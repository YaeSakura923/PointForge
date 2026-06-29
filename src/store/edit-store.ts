import { create, StateCreator } from 'zustand';

interface EditStateData {
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  cursor: number;
}

interface EditActions {
  setCanUndo: (value: boolean) => void;
  setCanRedo: (value: boolean) => void;
  setHistoryState: (cursor: number, length: number) => void;
  updateHistory: (canUndo: boolean, canRedo: boolean, cursor: number) => void;
}

export type EditStore = EditStateData & EditActions;

const initialState: EditStateData = {
  canUndo: false,
  canRedo: false,
  historyLength: 0,
  cursor: 0
};

const creator: StateCreator<EditStore> = (set) => ({
  ...initialState,
  setCanUndo: (value) => set({ canUndo: value }),
  setCanRedo: (value) => set({ canRedo: value }),
  setHistoryState: (cursor, length) => set({ cursor, historyLength: length, canUndo: cursor > 0, canRedo: cursor < length }),
  updateHistory: (canUndo, canRedo, cursor) => set({ canUndo, canRedo, cursor })
});

export const useEditStore = create<EditStore>()(creator);
