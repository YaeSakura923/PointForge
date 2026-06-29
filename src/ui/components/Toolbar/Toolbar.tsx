import React from 'react';
import { useToolStore } from '../../../store';
import type { ToolType } from '../../../store';

/**
 * Main toolbar with tool selection buttons.
 */
const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useToolStore();

  const tools: Array<{ id: ToolType; label: string; group: string }> = [
    { id: 'rectSelection', label: 'Rect Select', group: 'selection' },
    { id: 'brushSelection', label: 'Brush Select', group: 'selection' },
    { id: 'lassoSelection', label: 'Lasso Select', group: 'selection' },
    { id: 'polygonSelection', label: 'Polygon Select', group: 'selection' },
    { id: 'sphereSelection', label: 'Sphere Select', group: 'selection' },
    { id: 'boxSelection', label: 'Box Select', group: 'selection' },
    { id: 'floodSelection', label: 'Flood Select', group: 'selection' },
    { id: 'eyedropperSelection', label: 'Eyedropper', group: 'selection' },
    { id: 'move', label: 'Move', group: 'transform' },
    { id: 'rotate', label: 'Rotate', group: 'transform' },
    { id: 'scale', label: 'Scale', group: 'transform' },
    { id: 'measure', label: 'Measure', group: 'utility' }
  ];

  return (
    <div id="bottom-toolbar" style={{
      position: 'absolute',
      bottom: '8px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '4px',
      background: 'rgba(0,0,0,0.8)',
      borderRadius: '8px',
      padding: '4px',
      zIndex: 100
    }}>
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          title={tool.label}
          style={{
            padding: '6px 10px',
            border: 'none',
            borderRadius: '4px',
            background: activeTool === tool.id ? '#f26722' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTool === tool.id ? 'bold' : 'normal'
          }}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};

export { Toolbar };
