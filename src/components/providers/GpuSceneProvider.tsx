"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

type RegisteredScene = {
  id: string;
  element: HTMLElement;
  priority: number;
  isNearViewport: boolean;
  visibilityRatio: number;
};

type GpuSceneContextValue = {
  activeSceneId: string | null;
  registerScene: (scene: Omit<RegisteredScene, "isNearViewport" | "visibilityRatio">) => () => void;
};

const GpuSceneContext = createContext<GpuSceneContextValue | null>(null);

function viewportVisibilityRatio(element: HTMLElement) {
  const bounds = element.getBoundingClientRect();
  const visibleWidth = Math.max(
    0,
    Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0),
  );
  const visibleHeight = Math.max(
    0,
    Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0),
  );
  const area = bounds.width * bounds.height;

  return area > 0 ? (visibleWidth * visibleHeight) / area : 0;
}

export default function GpuSceneProvider({ children }: { children: ReactNode }) {
  const scenesRef = useRef(new Map<string, RegisteredScene>());
  const sceneIdByElementRef = useRef(new WeakMap<Element, string>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const documentVisibleRef = useRef(
    typeof document !== "undefined" && document.visibilityState !== "hidden",
  );
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  const selectActiveScene = useCallback(() => {
    if (!documentVisibleRef.current) {
      setActiveSceneId(null);
      return;
    }

    const candidates = [...scenesRef.current.values()].filter(
      (scene) => scene.visibilityRatio > 0,
    );

    candidates.sort((first, second) => {
      const ratioDifference = second.visibilityRatio - first.visibilityRatio;

      if (Math.abs(ratioDifference) > gpuSceneConfig.visibilityTieThreshold) {
        return ratioDifference;
      }

      return second.priority - first.priority || first.id.localeCompare(second.id);
    });

    setActiveSceneId(candidates[0]?.id ?? null);
  }, []);

  const recalculateSceneVisibility = useCallback(() => {
    for (const scene of scenesRef.current.values()) {
      scene.visibilityRatio = viewportVisibilityRatio(scene.element);
    }

    selectActiveScene();
  }, [selectActiveScene]);

  const registerScene = useCallback(
    ({ id, element, priority }: Omit<RegisteredScene, "isNearViewport" | "visibilityRatio">) => {
      const scene: RegisteredScene = {
        id,
        element,
        priority,
        isNearViewport: false,
        visibilityRatio: viewportVisibilityRatio(element),
      };

      scenesRef.current.set(id, scene);
      sceneIdByElementRef.current.set(element, id);
      observerRef.current?.observe(element);
      selectActiveScene();

      return () => {
        const registeredScene = scenesRef.current.get(id);

        if (registeredScene?.element !== element) {
          return;
        }

        observerRef.current?.unobserve(element);
        scenesRef.current.delete(id);
        selectActiveScene();
      };
    },
    [selectActiveScene],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sceneId = sceneIdByElementRef.current.get(entry.target);
          const scene = sceneId ? scenesRef.current.get(sceneId) : undefined;

          if (!scene) {
            continue;
          }

          scene.isNearViewport = entry.isIntersecting;
          scene.visibilityRatio = viewportVisibilityRatio(scene.element);
        }

        selectActiveScene();
      },
      {
        rootMargin: gpuSceneConfig.intersectionRootMargin,
        threshold: [...gpuSceneConfig.intersectionThresholds],
      },
    );

    observerRef.current = observer;
    scenesRef.current.forEach((scene) => observer.observe(scene.element));

    const handleVisibilityChange = () => {
      documentVisibleRef.current = document.visibilityState !== "hidden";

      if (documentVisibleRef.current) {
        recalculateSceneVisibility();
        return;
      }

      selectActiveScene();
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      observerRef.current = null;
    };
  }, [recalculateSceneVisibility, selectActiveScene]);

  return (
    <GpuSceneContext.Provider value={{ activeSceneId, registerScene }}>
      {children}
    </GpuSceneContext.Provider>
  );
}

export function useGpuSceneContext() {
  const context = useContext(GpuSceneContext);

  if (!context) {
    throw new Error("useGpuSceneActivity must be used within a GpuSceneProvider.");
  }

  return context;
}
