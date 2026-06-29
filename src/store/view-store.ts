import { create, StateCreator } from 'zustand';

type CameraMode = 'centers' | 'rings';
type ControlMode = 'orbit' | 'fly';
type Tonemapping = 'none' | 'aces' | 'filmic';

interface ViewStateData {
  cameraMode: CameraMode;
  controlMode: ControlMode;
  tonemapping: Tonemapping;
  fov: number;
  splatSize: number;
  shBands: number;
  showGrid: boolean;
  showBound: boolean;
  showBoundDimensions: boolean;
  showCameraPoses: boolean;
  outlineSelection: boolean;
  centersUseGaussianColor: boolean;
  cameraOverlay: boolean;
  bgColor: [number, number, number, number];
  selectedColor: [number, number, number, number];
  unselectedColor: [number, number, number, number];
  lockedColor: [number, number, number, number];
}

interface ViewActions {
  setCameraMode: (mode: CameraMode) => void;
  setControlMode: (mode: ControlMode) => void;
  setTonemapping: (t: Tonemapping) => void;
  setFov: (fov: number) => void;
  setSplatSize: (size: number) => void;
  setShBands: (bands: number) => void;
  setShowGrid: (show: boolean) => void;
  setShowBound: (show: boolean) => void;
  setColors: (key: 'bgColor' | 'selectedColor' | 'unselectedColor' | 'lockedColor', color: [number, number, number, number]) => void;
}

export type ViewStore = ViewStateData & ViewActions;

const initialState: ViewStateData = {
  cameraMode: 'centers',
  controlMode: 'orbit',
  tonemapping: 'none',
  fov: 60,
  splatSize: 2,
  shBands: 3,
  showGrid: true,
  showBound: false,
  showBoundDimensions: false,
  showCameraPoses: false,
  outlineSelection: false,
  centersUseGaussianColor: false,
  cameraOverlay: false,
  bgColor: [0.13, 0.13, 0.13, 1],
  selectedColor: [1, 0, 0, 1],
  unselectedColor: [1, 1, 1, 1],
  lockedColor: [0.5, 0.5, 0.5, 1]
};

const creator: StateCreator<ViewStore> = (set) => ({
  ...initialState,
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setControlMode: (mode) => set({ controlMode: mode }),
  setTonemapping: (t) => set({ tonemapping: t }),
  setFov: (fov) => set({ fov }),
  setSplatSize: (size) => set({ splatSize: size }),
  setShBands: (bands) => set({ shBands: bands }),
  setShowGrid: (show) => set({ showGrid: show }),
  setShowBound: (show) => set({ showBound: show }),
  setColors: (key, color) => set({ [key]: color } as Partial<ViewStateData>)
});

export const useViewStore = create<ViewStore>()(creator);

export type { CameraMode, ControlMode, Tonemapping };
