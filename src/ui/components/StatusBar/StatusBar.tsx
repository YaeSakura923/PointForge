import React from 'react';
import { useUIStore, useSceneStore, useSelectionStore } from '../../../store';

/**
 * Bottom status bar showing scene info and panel toggles.
 */
const StatusBar: React.FC = () => {
  const { elements } = useSceneStore();
  const { selectedCount, lockedCount } = useSelectionStore();
  const { activePanel, setActivePanel } = useUIStore();

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '28px',
      background: 'rgba(0,0,0,0.9)',
      color: '#ccc',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>Splats: {elements.length}</span>
        <span>Selected: {selectedCount}</span>
        <span>Locked: {lockedCount}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActivePanel(activePanel === 'timeline' ? null : 'timeline')}
          style={{
            background: activePanel === 'timeline' ? '#f26722' : 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '2px'
          }}
        >
          Timeline
        </button>
        <button
          onClick={() => setActivePanel(activePanel === 'splatData' ? null : 'splatData')}
          style={{
            background: activePanel === 'splatData' ? '#f26722' : 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '2px'
          }}
        >
          Data
        </button>
      </div>
    </div>
  );
};

export { StatusBar };
