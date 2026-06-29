import { useRef, useEffect, useCallback } from 'react';
import type { Scene } from '../../engine/scene';

/**
 * Hook to manage PlayCanvas application lifecycle within React.
 */
function usePlayCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const sceneRef = useRef<Scene | null>(null);
  const initializedRef = useRef(false);

  const initEngine = useCallback(async (events: any, graphicsDevice: any) => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Engine initialization is deferred to the existing main module
    // for compatibility with the existing codebase architecture.
    // This hook provides the React-side interface for the canvas.
  }, []);

  useEffect(() => {
    return () => {
      if (sceneRef.current) {
        // Cleanup handled by scene lifecycle
      }
    };
  }, []);

  return {
    sceneRef,
    initEngine
  };
}

export { usePlayCanvas };
