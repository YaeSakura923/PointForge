/**
 * Type-safe Event Bus
 *
 * Wraps the PlayCanvas EventHandler with typed event definitions,
 * enabling better IDE support and compile-time validation.
 */

type EventCallback<T = any> = (data: T) => void;

interface EventDefinition {
  name: string;
  payload: unknown;
}

class TypedEventBus<E extends Record<string, unknown>> {
  private listeners = new Map<keyof E, Set<EventCallback>>();
  private onceListeners = new Map<keyof E, Set<EventCallback>>();

  /**
   * Subscribe to an event.
   */
  on<K extends keyof E>(event: K, callback: EventCallback<E[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event once.
   */
  once<K extends keyof E>(event: K, callback: EventCallback<E[K]>): void {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }
    this.onceListeners.get(event)!.add(callback);
  }

  /**
   * Unsubscribe from an event.
   */
  off<K extends keyof E>(event: K, callback: EventCallback<E[K]>): void {
    this.listeners.get(event)?.delete(callback);
    this.onceListeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event with its typed payload.
   */
  emit<K extends keyof E>(event: K, payload: E[K]): void {
    // Fire regular listeners
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(payload);
      } catch (error) {
        console.error(`Error in event handler for "${String(event)}":`, error);
      }
    });

    // Fire once listeners
    const once = this.onceListeners.get(event);
    if (once) {
      once.forEach((cb) => {
        try {
          cb(payload);
        } catch (error) {
          console.error(`Error in once event handler for "${String(event)}":`, error);
        }
      });
      this.onceListeners.delete(event);
    }
  }

  /**
   * Remove all listeners.
   */
  removeAllListeners(): void {
    this.listeners.clear();
    this.onceListeners.clear();
  }
}

export { TypedEventBus };
export type { EventCallback };
