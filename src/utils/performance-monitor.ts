/**
 * Performance Monitor
 *
 * Tracks FPS, frame times, and memory usage for development diagnostics.
 * Only active in development builds.
 */

interface PerformanceMetrics {
  fps: number;
  avgFrameTime: number;
  minFrameTime: number;
  maxFrameTime: number;
  memoryUsage: number | null;
  droppedFrames: number;
}

class PerformanceMonitor {
  private frames: number[] = [];
  private lastFrameTime = 0;
  private fpsUpdateInterval = 500;
  private lastFpsUpdate = 0;
  private currentFps = 0;
  private droppedFrames = 0;
  private enabled = false;

  constructor() {
    this.enabled = import.meta.env.DEV;
  }

  /**
   * Call at the beginning of each frame.
   */
  beginFrame(): void {
    if (!this.enabled) return;
    this.lastFrameTime = performance.now();
  }

  /**
   * Call at the end of each frame.
   */
  endFrame(): void {
    if (!this.enabled) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;

    this.frames.push(frameTime);

    // Track dropped frames (>33ms = <30fps)
    if (frameTime > 33) {
      this.droppedFrames++;
    }

    // Update FPS counter periodically
    if (now - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.currentFps = Math.round((this.frames.length / (now - this.lastFpsUpdate)) * 1000);
      this.frames = [];
      this.lastFpsUpdate = now;
    }
  }

  /**
   * Get current performance metrics.
   */
  getMetrics(): PerformanceMetrics {
    const frameTimes = this.frames.slice(-60);

    return {
      fps: this.currentFps,
      avgFrameTime: frameTimes.length > 0
        ? frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
        : 0,
      minFrameTime: frameTimes.length > 0 ? Math.min(...frameTimes) : 0,
      maxFrameTime: frameTimes.length > 0 ? Math.max(...frameTimes) : 0,
      memoryUsage: (performance as any).memory?.usedJSHeapSize ?? null,
      droppedFrames: this.droppedFrames
    };
  }

  /**
   * Reset dropped frame counter.
   */
  resetDroppedFrames(): void {
    this.droppedFrames = 0;
  }

  /**
   * Enable or disable the monitor.
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

export { PerformanceMonitor, performanceMonitor };
export type { PerformanceMetrics };
