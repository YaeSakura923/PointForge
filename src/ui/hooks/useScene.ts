import { useEffect } from 'react';
import { useSceneStore } from '../../store';

/**
 * Hook to subscribe to scene state changes from Zustand store.
 */
function useScene() {
  const {
    elements,
    sceneBound,
    isDirty,
    isLoading,
    setDirty,
    setLoading
  } = useSceneStore();

  useEffect(() => {
    // Sync with scene dirty state via events
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return {
    elements,
    sceneBound,
    isDirty,
    isLoading,
    setDirty,
    setLoading
  };
}

export { useScene };
