"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { scratchConfig } from "./scratch-config";
import surfaceStyles from "./ScratchSurface.module.css";

type Point = { x: number; y: number };

type ScratchSurfaceProps = {
  className?: string;
  onProgressChange?: (progress: number) => void;
  onScratchActiveChange?: (isActive: boolean) => void;
  onScratchHoverChange?: (isHovered: boolean) => void;
  onUnlock?: () => void;
  onUnlockedChange?: (unlocked: boolean) => void;
  resetKey?: number;
};

const coinRadius = 12;
const debrisSpawnDistance = 30;
const maximumDebris = 14;
const fringeRadiusMinimum = 1.1;
const fringeRadiusMaximum = 2.5;

function createRandom(seed: number) {
  let state = seed || 1;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function drawCoating(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed: number,
) {
  const random = createRandom(seed);
  const coating = context.createLinearGradient(0, 0, width, height * 0.72);

  coating.addColorStop(0, "#a7a9a5");
  coating.addColorStop(0.18, "#c7c9c5");
  coating.addColorStop(0.46, "#969994");
  coating.addColorStop(0.7, "#d2d3cf");
  coating.addColorStop(1, "#979a96");
  context.fillStyle = coating;
  context.fillRect(0, 0, width, height);

  const shade = context.createLinearGradient(0, 0, 0, height);
  shade.addColorStop(0, "rgba(33, 36, 34, 0.1)");
  shade.addColorStop(0.35, "rgba(255, 255, 255, 0.07)");
  shade.addColorStop(1, "rgba(38, 41, 39, 0.13)");
  context.fillStyle = shade;
  context.fillRect(0, 0, width, height);

  context.lineWidth = 0.45;
  for (let y = 1.5; y < height; y += 2.7 + random() * 1.8) {
    context.strokeStyle = `rgba(255, 255, 255, ${0.018 + random() * 0.035})`;
    context.beginPath();
    context.moveTo(0, y + random() * 0.8);
    context.lineTo(width, y + (random() - 0.5) * 1.6);
    context.stroke();
  }

  const fleckCount = Math.round((width * height) / 56);
  for (let index = 0; index < fleckCount; index += 1) {
    const brightness = 138 + Math.round(random() * 82);
    context.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness - 2}, ${0.035 + random() * 0.065})`;
    context.fillRect(
      random() * width,
      random() * height,
      0.45 + random() * 0.75,
      0.45 + random() * 0.65,
    );
  }
}

function pointToSegmentDistanceSquared(point: Point, start: Point, end: Point) {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (segmentLengthSquared === 0) {
    const offsetX = point.x - start.x;
    const offsetY = point.y - start.y;
    return offsetX * offsetX + offsetY * offsetY;
  }

  const progress = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) /
        segmentLengthSquared,
    ),
  );
  const nearestX = start.x + segmentX * progress;
  const nearestY = start.y + segmentY * progress;
  const offsetX = point.x - nearestX;
  const offsetY = point.y - nearestY;

  return offsetX * offsetX + offsetY * offsetY;
}

export default function ScratchSurface({
  className,
  onProgressChange,
  onScratchActiveChange,
  onScratchHoverChange,
  onUnlock,
  onUnlockedChange,
  resetKey = 0,
}: ScratchSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const debrisHostRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const coverageRef = useRef(new Set<number>());
  const coverageGridRef = useRef({ columns: 0, rows: 0 });
  const pointerRef = useRef<{ id: number | null; point: Point | null }>({
    id: null,
    point: null,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const randomRef = useRef(createRandom(1));
  const debrisDistanceRef = useRef(0);
  const debrisTimeoutsRef = useRef(new Set<number>());
  const prefersReducedMotionRef = useRef(false);
  const unlockFiredRef = useRef(false);
  const callbacksRef = useRef({
    onProgressChange,
    onScratchActiveChange,
    onScratchHoverChange,
    onUnlock,
    onUnlockedChange,
  });

  useEffect(() => {
    callbacksRef.current = {
      onProgressChange,
      onScratchActiveChange,
      onScratchHoverChange,
      onUnlock,
      onUnlockedChange,
    };
  }, [
    onProgressChange,
    onScratchActiveChange,
    onScratchHoverChange,
    onUnlock,
    onUnlockedChange,
  ]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const clearDebris = useCallback(() => {
    debrisTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    debrisTimeoutsRef.current.clear();
    debrisHostRef.current?.replaceChildren();
  }, []);

  const resetSurface = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    if (width === 0 || height === 0) return;

    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      scratchConfig.devicePixelRatioCap,
    );
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    const context = canvas.getContext("2d");
    if (!context) return;

    const seed =
      ((Math.round(width * 100) * 73856093) ^
        (Math.round(height * 100) * 19349663) ^
        ((resetKey + 1) * 83492791)) >>>
      0;
    randomRef.current = createRandom(seed ^ 0x9e3779b9);
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    drawCoating(context, width, height, seed);
    sizeRef.current = { width, height };
    coverageGridRef.current = {
      columns: Math.ceil(width / scratchConfig.coverageCellSize),
      rows: Math.ceil(height / scratchConfig.coverageCellSize),
    };
    coverageRef.current.clear();
    debrisDistanceRef.current = 0;
    pointerRef.current = { id: null, point: null };
    unlockFiredRef.current = false;
    rootRef.current?.removeAttribute("data-scratching");
    rootRef.current?.removeAttribute("data-coin-visible");
    clearDebris();
    callbacksRef.current.onScratchActiveChange?.(false);
    callbacksRef.current.onScratchHoverChange?.(false);
    callbacksRef.current.onProgressChange?.(0);
    callbacksRef.current.onUnlockedChange?.(false);
  }, [clearDebris, resetKey]);

  useLayoutEffect(() => {
    resetSurface();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(resetSurface);

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [resetSurface]);

  useEffect(() => {
    resetSurface();
  }, [resetKey, resetSurface]);

  useEffect(
    () => () => {
      clearDebris();
    },
    [clearDebris],
  );

  const getPoint = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    return {
      x: Math.min(bounds.width, Math.max(0, event.clientX - bounds.left)),
      y: Math.min(bounds.height, Math.max(0, event.clientY - bounds.top)),
    };
  }, []);

  const setCoinPosition = useCallback((point: Point) => {
    const coin = coinRef.current;
    if (!coin) return;

    coin.style.transform = `translate3d(${point.x - coinRadius}px, ${point.y - coinRadius}px, 0)`;
  }, []);

  const updateCoverage = useCallback((start: Point, end: Point) => {
    const { columns, rows } = coverageGridRef.current;
    const { width, height } = sizeRef.current;
    const brushRadius = scratchConfig.brushSize / 2;
    const minimumX = Math.max(0, Math.min(start.x, end.x) - brushRadius);
    const maximumX = Math.min(width, Math.max(start.x, end.x) + brushRadius);
    const minimumY = Math.max(0, Math.min(start.y, end.y) - brushRadius);
    const maximumY = Math.min(height, Math.max(start.y, end.y) + brushRadius);
    const minimumColumn = Math.floor(minimumX / scratchConfig.coverageCellSize);
    const maximumColumn = Math.min(
      columns - 1,
      Math.floor(maximumX / scratchConfig.coverageCellSize),
    );
    const minimumRow = Math.floor(minimumY / scratchConfig.coverageCellSize);
    const maximumRow = Math.min(
      rows - 1,
      Math.floor(maximumY / scratchConfig.coverageCellSize),
    );

    for (let row = minimumRow; row <= maximumRow; row += 1) {
      for (let column = minimumColumn; column <= maximumColumn; column += 1) {
        const cellCenter = {
          x: (column + 0.5) * scratchConfig.coverageCellSize,
          y: (row + 0.5) * scratchConfig.coverageCellSize,
        };

        if (
          pointToSegmentDistanceSquared(cellCenter, start, end) <=
          brushRadius * brushRadius
        ) {
          coverageRef.current.add(row * columns + column);
        }
      }
    }
  }, []);

  const getProgress = useCallback(() => {
    const { columns, rows } = coverageGridRef.current;
    const totalCells = columns * rows;

    return totalCells === 0 ? 0 : coverageRef.current.size / totalCells;
  }, []);

  const reportProgress = useCallback((shouldReportProgress = false) => {
    const progress = getProgress();

    if (shouldReportProgress) {
      callbacksRef.current.onProgressChange?.(progress);
    }
    if (!unlockFiredRef.current && progress >= scratchConfig.unlockThreshold) {
      unlockFiredRef.current = true;
      callbacksRef.current.onUnlockedChange?.(true);
      callbacksRef.current.onUnlock?.();
    }
  }, [getProgress]);

  const eraseFringe = useCallback((context: CanvasRenderingContext2D, start: Point, end: Point) => {
    const random = randomRef.current;
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const sampleCount = Math.max(1, Math.floor(distance / 8));
    const coreRadius = scratchConfig.brushSize / 2;

    for (let sample = 0; sample < sampleCount; sample += 1) {
      const progress = (sample + random()) / sampleCount;
      const centerX = start.x + (end.x - start.x) * progress;
      const centerY = start.y + (end.y - start.y) * progress;
      const pointCount = 3 + Math.floor(random() * 3);

      for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
        const angle = random() * Math.PI * 2;
        const ringDistance = coreRadius * (0.72 + random() * 0.42);
        const radius = fringeRadiusMinimum + random() * (fringeRadiusMaximum - fringeRadiusMinimum);
        context.beginPath();
        context.arc(
          centerX + Math.cos(angle) * ringDistance,
          centerY + Math.sin(angle) * ringDistance,
          radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      }

      if (random() < 0.16) {
        const angle = random() * Math.PI * 2;
        context.beginPath();
        context.arc(
          centerX + Math.cos(angle) * (coreRadius + 3 + random() * 3),
          centerY + Math.sin(angle) * (coreRadius + 3 + random() * 3),
          0.7 + random() * 0.8,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    }
  }, []);

  const spawnDebris = useCallback((point: Point, velocity: Point) => {
    const host = debrisHostRef.current;
    if (!host || prefersReducedMotionRef.current || host.childElementCount >= maximumDebris) {
      return;
    }

    const random = randomRef.current;
    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed < 0.5) return;

    debrisDistanceRef.current += speed;
    if (debrisDistanceRef.current < debrisSpawnDistance || random() > 0.72) {
      return;
    }
    debrisDistanceRef.current %= debrisSpawnDistance;

    const fragmentCount = 2 + Math.floor(random() * 2);
    for (let index = 0; index < fragmentCount; index += 1) {
      if (host.childElementCount >= maximumDebris) return;

      const fragment = document.createElement("span");
      const direction = Math.atan2(velocity.y, velocity.x) + (random() - 0.5) * 1.5;
      const travel = 4 + random() * 8;
      const size = 1 + random() * 1.6;
      const lifetime = 260 + Math.round(random() * 160);
      fragment.className = surfaceStyles.debris;
      fragment.style.setProperty("--debris-x", `${point.x + (random() - 0.5) * 8}px`);
      fragment.style.setProperty("--debris-y", `${point.y + (random() - 0.5) * 8}px`);
      fragment.style.setProperty("--debris-dx", `${Math.cos(direction) * travel}px`);
      fragment.style.setProperty("--debris-dy", `${Math.sin(direction) * travel}px`);
      fragment.style.setProperty("--debris-size", `${size}px`);
      fragment.style.setProperty("--debris-rotation", `${Math.round(random() * 160 - 80)}deg`);
      fragment.style.setProperty("--debris-duration", `${lifetime}ms`);
      host.appendChild(fragment);

      const timeout = window.setTimeout(() => {
        fragment.remove();
        debrisTimeoutsRef.current.delete(timeout);
      }, lifetime + 30);
      debrisTimeoutsRef.current.add(timeout);
    }
  }, []);

  const eraseStroke = useCallback(
    (start: Point, end: Point) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!context) return;

      context.save();
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = scratchConfig.brushSize;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
      eraseFringe(context, start, end);
      context.restore();
      updateCoverage(start, end);
      spawnDebris(end, { x: end.x - start.x, y: end.y - start.y });
      reportProgress();
    },
    [eraseFringe, reportProgress, spawnDebris, updateCoverage],
  );

  const finishStroke = useCallback((pointerId: number, isHovered: boolean) => {
    if (pointerRef.current.id !== pointerId) return;

    pointerRef.current = { id: null, point: null };
    const root = rootRef.current;
    root?.removeAttribute("data-scratching");
    if (root && !root.matches(":hover")) {
      root.removeAttribute("data-coin-visible");
    }
    callbacksRef.current.onScratchActiveChange?.(false);
    callbacksRef.current.onScratchHoverChange?.(isHovered);
    reportProgress(true);
  }, [reportProgress]);

  const rootClassName = [surfaceStyles.root, className].filter(Boolean).join(" ");

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      data-scratch-surface
    >
      <canvas
        ref={canvasRef}
        className={surfaceStyles.canvas}
        aria-describedby="scratch-surface-description"
        aria-label="Scratch to reveal the technical result"
        onPointerEnter={(event) => {
          callbacksRef.current.onScratchHoverChange?.(true);
          if (event.pointerType === "touch" || !window.matchMedia("(pointer: fine)").matches) {
            return;
          }

          rootRef.current?.setAttribute("data-coin-visible", "true");
          setCoinPosition(getPoint(event));
        }}
        onPointerLeave={(event) => {
          if (pointerRef.current.id === event.pointerId) return;
          callbacksRef.current.onScratchHoverChange?.(false);
          rootRef.current?.removeAttribute("data-coin-visible");
        }}
        onPointerCancel={(event) => {
          event.stopPropagation();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          finishStroke(event.pointerId, false);
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.preventDefault();
          const point = getPoint(event);

          event.currentTarget.setPointerCapture(event.pointerId);
          pointerRef.current = { id: event.pointerId, point };
          rootRef.current?.setAttribute("data-scratching", "true");
          callbacksRef.current.onScratchActiveChange?.(true);
          setCoinPosition(point);
          eraseStroke(point, point);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          const point = getPoint(event);
          setCoinPosition(point);
          if (pointerRef.current.id !== event.pointerId || !pointerRef.current.point) {
            return;
          }

          event.preventDefault();
          eraseStroke(pointerRef.current.point, point);
          pointerRef.current.point = point;
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          event.preventDefault();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          finishStroke(event.pointerId, event.currentTarget.matches(":hover"));
        }}
      />
      <div ref={debrisHostRef} aria-hidden="true" className={surfaceStyles.debrisHost} />
      <div ref={coinRef} aria-hidden="true" className={surfaceStyles.coinCursor}>
        <span className={surfaceStyles.coinFace} />
      </div>
    </div>
  );
}
