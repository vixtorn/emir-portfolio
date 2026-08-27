"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { tearConfig } from "./tear-config";
import styles from "./TearOffStub.module.css";

type Point = { x: number; y: number };

type TearOffStubProps = {
  onDragChange?: (isDragging: boolean) => void;
  onHoverChange?: (isHovering: boolean) => void;
  onTear?: () => void;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;

export default function TearOffStub({
  onDragChange,
  onHoverChange,
  onTear,
}: TearOffStubProps) {
  const stubRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{
    id: number | null;
    start: Point;
    origin: Point & { rotation: number };
    last: Point;
    lastTime: number;
    velocity: Point;
    threshold: number;
  }>({
    id: null,
    start: { x: 0, y: 0 },
    origin: { x: 0, y: 0, rotation: 0 },
    last: { x: 0, y: 0 },
    lastTime: 0,
    velocity: { x: 0, y: 0 },
    threshold: 0,
  });
  const positionRef = useRef({ x: 0, y: 0, rotation: 0 });
  const tornRef = useRef(false);
  const tearFiredRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const callbacksRef = useRef({ onDragChange, onHoverChange, onTear });
  const [isTorn, setIsTorn] = useState(false);

  useEffect(() => {
    callbacksRef.current = { onDragChange, onHoverChange, onTear };
  }, [onDragChange, onHoverChange, onTear]);

  const applyTransform = useCallback((x: number, y: number, rotation: number) => {
    const stub = stubRef.current;
    if (!stub) return;

    positionRef.current = { x, y, rotation };
    stub.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
  }, []);

  const stopMotion = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      stopMotion();
      callbacksRef.current.onDragChange?.(false);
    },
    [stopMotion],
  );

  const returnToOrigin = useCallback(() => {
    const start = { ...positionRef.current };
    const startTime = performance.now();

    const animateReturn = (now: number) => {
      const progress = clamp((now - startTime) / tearConfig.returnDuration, 0, 1);
      const remaining = Math.exp(-7 * progress);
      applyTransform(
        start.x * remaining,
        start.y * remaining,
        start.rotation * remaining,
      );

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animateReturn);
        return;
      }

      applyTransform(0, 0, 0);
      frameRef.current = null;
    };

    frameRef.current = requestAnimationFrame(animateReturn);
  }, [applyTransform]);

  const applyDetachedInertia = useCallback(() => {
    const stubWidth = stubRef.current?.getBoundingClientRect().width ?? 0;
    const maximumExtraX = clamp(stubWidth * 0.7, 80, 160);
    const maximumExtraY = clamp(stubWidth * 0.28, 30, 70);
    let velocityX = clamp(pointerRef.current.velocity.x, -0.2, 0.55);
    let velocityY = clamp(pointerRef.current.velocity.y, -0.3, 0.3);
    let previousTime = performance.now();

    const animateInertia = (now: number) => {
      const elapsed = Math.min(now - previousTime, 32);
      previousTime = now;
      velocityX *= 0.84;
      velocityY *= 0.84;
      const current = positionRef.current;
      const x = clamp(current.x + velocityX * elapsed, 0, stubWidth * 1.5 + maximumExtraX);
      const y = clamp(current.y + velocityY * elapsed, -maximumExtraY, maximumExtraY);
      const rotation = clamp(
        current.rotation + velocityY * 0.08,
        -tearConfig.detachedRotationLimit,
        tearConfig.detachedRotationLimit,
      );
      applyTransform(x, y, rotation);

      if (Math.abs(velocityX) > 0.015 || Math.abs(velocityY) > 0.015) {
        frameRef.current = requestAnimationFrame(animateInertia);
        return;
      }

      frameRef.current = null;
    };

    frameRef.current = requestAnimationFrame(animateInertia);
  }, [applyTransform]);

  const finishDrag = useCallback((pointerId: number) => {
    if (pointerRef.current.id !== pointerId) return;

    pointerRef.current.id = null;
    stubRef.current?.removeAttribute("data-dragging");
    stubRef.current?.removeAttribute("data-stressed");
    callbacksRef.current.onDragChange?.(false);

    if (tornRef.current) {
      applyDetachedInertia();
      return;
    }

    returnToOrigin();
  }, [applyDetachedInertia, returnToOrigin]);

  const { width: sourceWidth, height: sourceHeight } = tearConfig.sourceSize;
  const stubSourceWidth = sourceWidth - tearConfig.tearX;
  const hitArea = tearConfig.stubHitArea;

  return (
    <div
      ref={stubRef}
      className={styles.stub}
      data-torn={isTorn || undefined}
      style={{
        left: toPercent(tearConfig.tearX, sourceWidth),
        width: toPercent(stubSourceWidth, sourceWidth),
      }}
    >
      <div
        aria-label="Drag the boarding pass stub to the right to tear it off."
        className={styles.hitArea}
        role="button"
        style={{
          left: 0,
          top: toPercent(hitArea.top, sourceHeight),
          width: toPercent(hitArea.right - hitArea.left, stubSourceWidth),
          height: toPercent(hitArea.bottom - hitArea.top, sourceHeight),
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          callbacksRef.current.onHoverChange?.(true);
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          if (pointerRef.current.id === null) {
            callbacksRef.current.onHoverChange?.(false);
          }
        }}
        onPointerCancel={(event) => {
          event.stopPropagation();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          finishDrag(event.pointerId);
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.preventDefault();
          stopMotion();
          event.currentTarget.setPointerCapture(event.pointerId);
          const now = performance.now();
          const current = positionRef.current;
          pointerRef.current = {
            id: event.pointerId,
            start: { x: event.clientX, y: event.clientY },
            origin: { x: current.x, y: current.y, rotation: current.rotation },
            last: { x: event.clientX, y: event.clientY },
            lastTime: now,
            velocity: { x: 0, y: 0 },
            threshold:
              event.currentTarget.getBoundingClientRect().width *
              tearConfig.tearThresholdRatio,
          };
          stubRef.current?.setAttribute("data-dragging", "true");
          callbacksRef.current.onDragChange?.(true);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          if (pointerRef.current.id !== event.pointerId) return;

          event.preventDefault();
          const pointer = pointerRef.current;
          const rawDx = Math.max(0, event.clientX - pointer.start.x);
          const rawDy = event.clientY - pointer.start.y;
          const now = performance.now();
          const elapsed = Math.max(now - pointer.lastTime, 1);
          pointer.velocity = {
            x: (event.clientX - pointer.last.x) / elapsed,
            y: (event.clientY - pointer.last.y) / elapsed,
          };
          pointer.last = { x: event.clientX, y: event.clientY };
          pointer.lastTime = now;

          if (!tornRef.current && rawDx >= pointer.threshold) {
            tornRef.current = true;
            setIsTorn(true);
            if (!tearFiredRef.current) {
              tearFiredRef.current = true;
              callbacksRef.current.onTear?.();
            }
          }

          if (!tornRef.current) {
            const progress = clamp(rawDx / pointer.threshold, 0, 1);
            const x = rawDx * tearConfig.resistanceFactor;
            const y = clamp(
              rawDy * tearConfig.connectedVerticalFactor,
              -tearConfig.connectedVerticalLimit,
              tearConfig.connectedVerticalLimit,
            );
            const rotation = clamp(
              rawDy * 0.02 * progress,
              -tearConfig.connectedRotationLimit,
              tearConfig.connectedRotationLimit,
            );
            stubRef.current?.toggleAttribute("data-stressed", progress > 0.68);
            applyTransform(x, y, rotation);
            return;
          }

          const stubWidth = event.currentTarget.getBoundingClientRect().width;
          const x = pointer.origin.x + clamp(rawDx + tearConfig.releaseImpulseX, 0, stubWidth * 1.5);
          const y = pointer.origin.y + clamp(rawDy * 0.35, -stubWidth * 0.35, stubWidth * 0.35);
          const rotation = clamp(
            pointer.origin.rotation + rawDy * 0.05 + tearConfig.releaseImpulseRotation,
            -tearConfig.detachedRotationLimit,
            tearConfig.detachedRotationLimit,
          );
          applyTransform(x, y, rotation);
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          event.preventDefault();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          finishDrag(event.pointerId);
        }}
      />
    </div>
  );
}
