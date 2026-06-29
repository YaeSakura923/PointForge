import { create, StateCreator } from 'zustand';

type ActivePanel = 'timeline' | 'splatData' | null;
type ActiveDialog = 'export' | 'publish' | 'imageSettings' | 'videoSettings' | 'shortcuts' | 'about' | null;

interface UIStateData {
  activePanel: ActivePanel;
  activeDialog: ActiveDialog;
  spinnerVisible: boolean;
  progressVisible: boolean;
  progressHeader: string;
  progressText: string;
  progressPercent: number;
  showCancelButton: boolean;
}

interface UIActions {
  setActivePanel: (panel: ActivePanel) => void;
  setActiveDialog: (dialog: ActiveDialog) => void;
  showSpinner: () => void;
  hideSpinner: () => void;
  updateProgress: (opts: { header?: string; text?: string; progress?: number; cancel?: boolean }) => void;
  hideProgress: () => void;
}

export type UIStore = UIStateData & UIActions;

const initialState: UIStateData = {
  activePanel: null,
  activeDialog: null,
  spinnerVisible: false,
  progressVisible: false,
  progressHeader: '',
  progressText: '',
  progressPercent: 0,
  showCancelButton: false
};

const creator: StateCreator<UIStore> = (set) => ({
  ...initialState,
  setActivePanel: (panel) => set({ activePanel: panel }),
  setActiveDialog: (dialog) => set({ activeDialog: dialog }),
  showSpinner: () => set({ spinnerVisible: true }),
  hideSpinner: () => set({ spinnerVisible: false }),
  updateProgress: (opts) =>
    set((state) => ({
      progressVisible: true,
      progressHeader: opts.header ?? state.progressHeader,
      progressText: opts.text ?? state.progressText,
      progressPercent: opts.progress ?? state.progressPercent,
      showCancelButton: opts.cancel ?? state.showCancelButton
    })),
  hideProgress: () => set({
    progressVisible: false,
    showCancelButton: false
  })
});

export const useUIStore = create<UIStore>()(creator);

export type { ActivePanel, ActiveDialog };
