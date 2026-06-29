import { create, StateCreator } from 'zustand';
import type { Element } from '../engine/element';

interface SceneStateData {
  elements: Element[];
  sceneBound: { center: [number, number, number]; halfExtents: [number, number, number] } | null;
  isDirty: boolean;
  isLoading: boolean;
}

interface SceneActions {
  addElement: (element: Element) => void;
  removeElement: (element: Element) => void;
  setSceneBound: (bound: SceneStateData['sceneBound']) => void;
  setDirty: (dirty: boolean) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export type SceneStore = SceneStateData & SceneActions;

const initialState: SceneStateData = {
  elements: [],
  sceneBound: null,
  isDirty: false,
  isLoading: false
};

const creator: StateCreator<SceneStore> = (set) => ({
  ...initialState,
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  removeElement: (element) =>
    set((state) => ({ elements: state.elements.filter((e) => e.uid !== element.uid) })),
  setSceneBound: (bound) => set({ sceneBound: bound }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setLoading: (loading) => set({ isLoading: loading }),
  clear: () => set(initialState)
});

export const useSceneStore = create<SceneStore>()(creator);
