import React, { useRef, useEffect, useCallback } from 'react';

interface CanvasViewportProps {
  children?: React.ReactNode;
}

/**
 * The main 3D viewport component.
 * Hosts the PlayCanvas canvas and overlays the UI panels.
 * This is the bridge between React and the PlayCanvas rendering engine.
 */
const CanvasViewport: React.FC<CanvasViewportProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize PlayCanvas engine
    // This is deferred to avoid coupling React lifecycle with engine init
    const initEngine = async () => {
      // Engine initialization will be handled by the existing main.ts/module
      // which is imported separately to maintain compatibility
    };

    initEngine();

    return () => {
      // Cleanup PlayCanvas resources
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefaults = (e: Event) => e.preventDefault();

    container.addEventListener('contextmenu', preventDefaults);
    container.addEventListener('gesturestart', preventDefaults);
    container.addEventListener('gesturechange', preventDefaults);
    container.addEventListener('gestureend', preventDefaults);

    return () => {
      container.removeEventListener('contextmenu', preventDefaults);
      container.removeEventListener('gesturestart', preventDefaults);
      container.removeEventListener('gesturechange', preventDefaults);
      container.removeEventListener('gestureend', preventDefaults);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} id="canvas" style={{ width: '100%', height: '100%' }} />
      {children}
    </div>
  );
};

export { CanvasViewport };
