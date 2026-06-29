/**
 * Bridges the PlayCanvas engine event system with Zustand stores.
 * Subscribes to engine events and updates store state accordingly.
 * Call `initStoreSync(events)` once during app bootstrap.
 */
import { Events } from '../events';
import { useSceneStore } from '../store/scene-store';
import { useSelectionStore } from '../store/selection-store';
import { useEditStore } from '../store/edit-store';
import { useViewStore } from '../store/view-store';
import { useUIStore } from '../store/ui-store';

let initialized = false;

function initStoreSync(events: Events): void {
  if (initialized) return;
  initialized = true;

  // Scene events → sceneStore
  events.on('splatCount', (count: number) => {
    useSceneStore.getState().setLoading(false);
  });

  events.on('scene.bound', (bound: { center: [number, number, number]; halfExtents: [number, number, number] }) => {
    useSceneStore.getState().setSceneBound(bound);
  });

  events.on('scene.dirty', () => {
    useSceneStore.getState().setDirty(true);
  });

  events.on('scene.saved', () => {
    useSceneStore.getState().setDirty(false);
  });

  // Selection events → selectionStore
  events.on('selection.changed', (data: { selected: number; locked: number; deleted: number }) => {
    useSelectionStore.getState().setCounts(data.selected, data.locked, data.deleted);
  });

  events.on('splat.active', (splat: any) => {
    useSelectionStore.getState().setActiveSplat(splat);
  });

  // Edit history events → editStore
  events.on('editHistory.changed', (data: { canUndo: boolean; canRedo: boolean; cursor: number }) => {
    useEditStore.getState().updateHistory(data.canUndo, data.canRedo, data.cursor);
  });

  // View events → viewStore
  events.on('bgClr', (clr: { r: number; g: number; b: number; a: number }) => {
    useViewStore.getState().setColors('bgColor', [clr.r, clr.g, clr.b, clr.a]);
  });

  events.on('selectedClr', (clr: { r: number; g: number; b: number; a: number }) => {
    useViewStore.getState().setColors('selectedColor', [clr.r, clr.g, clr.b, clr.a]);
  });

  events.on('unselectedClr', (clr: { r: number; g: number; b: number; a: number }) => {
    useViewStore.getState().setColors('unselectedColor', [clr.r, clr.g, clr.b, clr.a]);
  });

  events.on('lockedClr', (clr: { r: number; g: number; b: number; a: number }) => {
    useViewStore.getState().setColors('lockedColor', [clr.r, clr.g, clr.b, clr.a]);
  });

  // UI state events → uiStore
  events.on('ui.spinner', (visible: boolean) => {
    useUIStore.getState().showSpinner(visible);
  });

  events.on('ui.progress', (progress: number) => {
    useUIStore.getState().setProgress(progress);
  });

  events.on('ui.dialog', (dialogId: string | null) => {
    useUIStore.getState().setActiveDialog(dialogId);
  });
}

export { initStoreSync };
