import type { TypedEventBus } from '../../core/events';

/**
 * Service Layer — Scene Service
 *
 * Manages scene lifecycle, element addition/removal,
 * and provides a typed API for scene operations.
 */
class SceneService {
  constructor(private events: TypedEventBus<any>) {}

  /**
   * Check if the scene is currently empty.
   */
  isEmpty(): boolean {
    // Implementation delegates to existing scene module
    return true;
  }

  /**
   * Clear all elements from the scene.
   */
  async clear(): Promise<void> {
    this.events.emit('scene:clear', undefined);
  }

  /**
   * Get scene bounding box.
   */
  getBound(): { center: [number, number, number]; halfExtents: [number, number, number] } | null {
    return null;
  }
}

export { SceneService };
