"use client";

import { useEffect, useState, type RefObject } from "react";
import { useGpuSceneContext } from "@/components/providers/GpuSceneProvider";

type GpuSceneOptions = {
  id: string;
  elementRef: RefObject<HTMLElement | null>;
  priority?: number;
};

export function useGpuSceneActivity({
  id,
  elementRef,
  priority = 0,
}: GpuSceneOptions) {
  const { activeSceneId, registerScene } = useGpuSceneContext();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const unregister = registerScene({ id, element, priority });
    setIsRegistered(true);

    return () => {
      setIsRegistered(false);
      unregister();
    };
  }, [elementRef, id, priority, registerScene]);

  return {
    // Keep a newly mounted scene live until its first observer registration so
    // the initial canvas frame is never delayed by provider bookkeeping.
    isActive: !isRegistered || activeSceneId === id,
  };
}
