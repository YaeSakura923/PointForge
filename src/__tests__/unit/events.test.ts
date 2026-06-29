import { describe, it, expect, vi } from 'vitest';
import { TypedEventBus } from '../core/events';

interface TestEvents {
  'test:click': { x: number; y: number };
  'test:change': string;
  'test:empty': undefined;
}

describe('TypedEventBus', () => {
  let bus: TypedEventBus<TestEvents>;

  beforeEach(() => {
    bus = new TypedEventBus<TestEvents>();
  });

  it('should emit and receive typed events', () => {
    const handler = vi.fn();
    bus.on('test:click', handler);

    bus.emit('test:click', { x: 10, y: 20 });

    expect(handler).toHaveBeenCalledWith({ x: 10, y: 20 });
  });

  it('should support unsubscribe', () => {
    const handler = vi.fn();
    const unsubscribe = bus.on('test:change', handler);

    unsubscribe();
    bus.emit('test:change', 'hello');

    expect(handler).not.toHaveBeenCalled();
  });

  it('should fire once listener only once', () => {
    const handler = vi.fn();
    bus.once('test:click', handler);

    bus.emit('test:click', { x: 1, y: 2 });
    bus.emit('test:click', { x: 3, y: 4 });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not throw on emit with no listeners', () => {
    expect(() => bus.emit('test:empty', undefined)).not.toThrow();
  });

  it('should catch errors in handlers and continue', () => {
    const goodHandler = vi.fn();
    const badHandler = vi.fn(() => { throw new Error('handler error'); });

    bus.on('test:change', badHandler);
    bus.on('test:change', goodHandler);

    expect(() => bus.emit('test:change', 'test')).not.toThrow();
    expect(goodHandler).toHaveBeenCalled();
  });

  it('should remove all listeners', () => {
    const handler = vi.fn();
    bus.on('test:change', handler);
    bus.removeAllListeners();

    bus.emit('test:change', 'test');
    expect(handler).not.toHaveBeenCalled();
  });
});
