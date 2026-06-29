import { useEffect } from 'react';
import { useSelectionStore } from '../../store';

/**
 * Hook to access and react to selection changes.
 */
function useSelection() {
  const {
    activeSplat,
    selectedCount,
    lockedCount,
    deletedCount,
    setActiveSplat
  } = useSelectionStore();

  useEffect(() => {
    // Sync keyboard shortcuts for selection
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveSplat(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setActiveSplat]);

  return {
    activeSplat,
    selectedCount,
    lockedCount,
    deletedCount,
    setActiveSplat
  };
}

export { useSelection };
