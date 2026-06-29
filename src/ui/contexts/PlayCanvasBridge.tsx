import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Events } from '../../events';
import type { Scene } from '../../scene';

interface BridgeState {
  events: Events | null;
  scene: Scene | null;
  isReady: boolean;
}

interface PlayCanvasBridgeValue extends BridgeState {
  /** Fire an event to the engine and wait for handlers */
  invoke: <T = void>(name: string, data?: unknown) => Promise<T>;
  /** Fire an event to the engine (fire-and-forget) */
  fire: (name: string, data?: unknown) => void;
  /** Subscribe to an engine event, returns unsubscribe function */
  on: (name: string, handler: (...args: any[]) => void) => () => void;
}

const PlayCanvasBridgeContext = createContext<PlayCanvasBridgeValue | null>(null);

function usePlayCanvasBridge(): PlayCanvasBridgeValue {
  const ctx = useContext(PlayCanvasBridgeContext);
  if (!ctx) {
    throw new Error('usePlayCanvasBridge must be used within PlayCanvasBridgeProvider');
  }
  return ctx;
}

interface ProviderProps {
  children: ReactNode;
}

function PlayCanvasBridgeProvider({ children }: ProviderProps): React.ReactElement {
  const [state, setState] = useState<BridgeState>({
    events: null,
    scene: null,
    isReady: false
  });

  useEffect(() => {
    const checkReady = () => {
      if (window.scene && window.events) {
        setState({
          events: window.events,
          scene: window.scene,
          isReady: true
        });
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    const interval = setInterval(() => {
      if (checkReady()) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const invoke = useCallback(<T = void>(name: string, data?: unknown): Promise<T> => {
    if (!state.events) return Promise.reject(new Error('Engine not ready'));
    return state.events.invoke(name, data) as Promise<T>;
  }, [state.events]);

  const fire = useCallback((name: string, data?: unknown): void => {
    if (!state.events) return;
    state.events.fire(name, data);
  }, [state.events]);

  const on = useCallback((name: string, handler: (...args: any[]) => void): (() => void) => {
    if (!state.events) {
      return () => {};
    }
    state.events.on(name, handler);
    return () => state.events?.off(name, handler);
  }, [state.events]);

  const value: PlayCanvasBridgeValue = {
    ...state,
    invoke,
    fire,
    on
  };

  return React.createElement(PlayCanvasBridgeContext.Provider, { value }, children);
}

export { PlayCanvasBridgeProvider, usePlayCanvasBridge };
export type { PlayCanvasBridgeValue, BridgeState };
