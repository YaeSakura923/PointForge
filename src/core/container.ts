/**
 * Simple Dependency Injection Container
 *
 * Provides a lightweight IoC container for registering and resolving
 * service instances. This enables testability and loose coupling
 * between modules without requiring decorator-based DI frameworks.
 */
type Factory<T> = (container: Container) => T;

interface Binding<T> {
  factory: Factory<T>;
  singleton: boolean;
  instance?: T;
}

class Container {
  private bindings = new Map<string, Binding<any>>();

  /**
   * Register a singleton service by its abstract name.
   */
  bind<T>(name: string, factory: Factory<T>): void {
    if (this.bindings.has(name)) {
      throw new Error(`Service "${name}" is already registered`);
    }
    this.bindings.set(name, { factory, singleton: true });
  }

  /**
   * Register a transient (new instance per resolution) service.
   */
  bindTransient<T>(name: string, factory: Factory<T>): void {
    if (this.bindings.has(name)) {
      throw new Error(`Service "${name}" is already registered`);
    }
    this.bindings.set(name, { factory, singleton: false });
  }

  /**
   * Resolve a service by name.
   */
  resolve<T>(name: string): T {
    const binding = this.bindings.get(name);
    if (!binding) {
      throw new Error(`Service "${name}" is not registered`);
    }

    if (binding.singleton) {
      if (!binding.instance) {
        binding.instance = binding.factory(this);
      }
      return binding.instance as T;
    }

    return binding.factory(this) as T;
  }

  /**
   * Remove a registered service.
   */
  unbind(name: string): void {
    this.bindings.delete(name);
  }

  /**
   * Clear all registrations (useful in tests).
   */
  clear(): void {
    this.bindings.clear();
  }
}

// Global application container instance
const container = new Container();

export { Container, container };
