import { create, StateCreator } from 'zustand';
import type { Splat } from '../engine/splat';

type SelectionMode = 'add' | 'remove' | 'set';

interface SelectionStateData {
  activeSplat: Splat | null;
  selectedCount: number;
  lockedCount: number;
  deletedCount: number;
  selectionMode: SelectionMode;
}

interface SelectionActions {
  setActiveSplat: (splat: Splat | null) => void;
  setCounts: (selected: number, locked: number, deleted: number) => void;
  setSelectionMode: (mode: SelectionMode) => void;
}

export type SelectionStore = SelectionStateData & SelectionActions;

const initialState: SelectionStateData = {
  activeSplat: null,
  selectedCount: 0,
  lockedCount: 0,
  deletedCount: 0,
  selectionMode: 'set'
};

const creator: StateCreator<SelectionStore> = (set) => ({
  ...initialState,
  setActiveSplat: (splat) => set({ activeSplat: splat }),
  setCounts: (selected, locked, deleted) =>
    set({ selectedCount: selected, lockedCount: locked, deletedCount: deleted }),
  setSelectionMode: (mode) => set({ selectionMode: mode })
});

export const useSelectionStore = create<SelectionStore>()(creator);
