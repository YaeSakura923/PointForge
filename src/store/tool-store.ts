import { create, StateCreator } from 'zustand';

type ToolType = 'rectSelection' | 'brushSelection' | 'floodSelection' | 'polygonSelection' |
  'lassoSelection' | 'sphereSelection' | 'boxSelection' | 'eyedropperSelection' |
  'move' | 'rotate' | 'scale' | 'measure' | null;

type CoordSpace = 'world' | 'local';

interface ToolStateData {
  activeTool: ToolType;
  coordSpace: CoordSpace;
  brushSize: number;
}

interface ToolActions {
  setActiveTool: (tool: ToolType) => void;
  setCoordSpace: (space: CoordSpace) => void;
  setBrushSize: (size: number) => void;
}

export type ToolStore = ToolStateData & ToolActions;

const initialState: ToolStateData = {
  activeTool: 'rectSelection',
  coordSpace: 'world',
  brushSize: 32
};

const creator: StateCreator<ToolStore> = (set) => ({
  ...initialState,
  setActiveTool: (tool) => set({ activeTool: tool }),
  setCoordSpace: (space) => set({ coordSpace: space }),
  setBrushSize: (size) => set({ brushSize: size })
});

export const useToolStore = create<ToolStore>()(creator);

export type { ToolType, CoordSpace };
