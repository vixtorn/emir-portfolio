"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { scratchConfig } from "./scratch-config";

type Point = { x: number; y: number };

type ScratchSurfaceProps = {
  className?: string;
  onProgressChange?: (progress: number) => void;
  onUnlock?: () => void;
  onUnlockedChange?: (unlocked: boolean) => void;
  resetKey?: number;
};

function drawCoating(context: CanvasRenderingContext2D, width: number, height: number) {
  const coating = context.createLinearGradient(0, 0, width, height);

  coating.addColorStop(0, "#b8bab7");
  coating.addColorStop(0.32, "#767875");
  coating.addColorStop(0.56, "#d0d2ce");
  coating.addColorStop(0.78, "#6e706e");
  coating.addColorStop(1, "#a7a9a6");
  context.fillStyle = coating;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(255, 255, 255, 0.14)";
  context.lineWidth = 1;
  for (let y = 8; y < height; y += 12) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
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
  onUnlock,
  onUnlockedChange,
  resetKey = 0,
}: ScratchSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const coverageRef = useRef(new Set<number>());
  const coverageGridRef = useRef({ columns: 0, rows: 0 });
  const pointerRef = useRef<{ id: number | null; point: Point | null }>({
    id: null,
    point: null,
  });
  const unlockFiredRef = useRef(false);
  const callbacksRef = useRef({ onProgressChange, onUnlock, onUnlockedChange });

  useEffect(() => {
    callbacksRef.current = { onProgressChange, onUnlock, onUnlockedChange };
  }, [onProgressChange, onUnlock, onUnlockedChange]);

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

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    drawCoating(context, width, height);
    sizeRef.current = { width, height };
    coverageGridRef.current = {
      columns: Math.ceil(width / scratchConfig.coverageCellSize),
      rows: Math.ceil(height / scratchConfig.coverageCellSize),
    };
    coverageRef.current.clear();
    pointerRef.current = { id: null, point: null };
    unlockFiredRef.current = false;
    callbacksRef.current.onProgressChange?.(0);
    callbacksRef.current.onUnlockedChange?.(false);
  }, []);

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

  const getPoint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
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
      context.restore();
      updateCoverage(start, end);
      reportProgress();
    },
    [reportProgress, updateCoverage],
  );

  const finishStroke = useCallback((pointerId: number) => {
    if (pointerRef.current.id !== pointerId) return;

    pointerRef.current = { id: null, point: null };
    reportProgress(true);
  }, [reportProgress]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-describedby="scratch-surface-description"
      aria-label="Scratch to reveal the technical result"
      onPointerCancel={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        finishStroke(event.pointerId);
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        const point = getPoint(event);

        event.currentTarget.setPointerCapture(event.pointerId);
        pointerRef.current = { id: event.pointerId, point };
        eraseStroke(point, point);
      }}
      onPointerMove={(event) => {
        if (pointerRef.current.id !== event.pointerId || !pointerRef.current.point) {
          return;
        }

        event.preventDefault();
        const point = getPoint(event);

        eraseStroke(pointerRef.current.point, point);
        pointerRef.current.point = point;
      }}
      onPointerUp={(event) => {
        event.preventDefault();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        finishStroke(event.pointerId);
      }}
    />
  );
}
