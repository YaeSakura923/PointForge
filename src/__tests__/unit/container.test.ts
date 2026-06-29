import { describe, it, expect } from 'vitest';
import { Container } from '../core/container';

describe('Container — Dependency Injection', () => {
  it('should register and resolve a singleton service', () => {
    const container = new Container();
    const svc = { id: 'test' };

    container.bind('testService', () => svc);
    const resolved = container.resolve<{ id: string }>('testService');

    expect(resolved).toBe(svc);
  });

  it('should return the same instance for singletons', () => {
    const container = new Container();
    let counter = 0;

    container.bind('counter', () => ({ count: ++counter }));

    const a = container.resolve<{ count: number }>('counter');
    const b = container.resolve<{ count: number }>('counter');

    expect(a).toBe(b);
    expect(a.count).toBe(1);
  });

  it('should create new instances for transient bindings', () => {
    const container = new Container();
    let counter = 0;

    container.bindTransient('counter', () => ({ count: ++counter }));

    const a = container.resolve<{ count: number }>('counter');
    const b = container.resolve<{ count: number }>('counter');

    expect(a).not.toBe(b);
    expect(a.count).toBe(1);
    expect(b.count).toBe(2);
  });

  it('should throw when resolving unregistered service', () => {
    const container = new Container();
    expect(() => container.resolve('missing')).toThrow('not registered');
  });

  it('should throw when registering duplicate service', () => {
    const container = new Container();
    container.bind('svc', () => ({}));
    expect(() => container.bind('svc', () => ({}))).toThrow('already registered');
  });

  it('should clear all bindings', () => {
    const container = new Container();
    container.bind('svc', () => ({}));
    container.clear();
    expect(() => container.resolve('svc')).toThrow('not registered');
  });
});
