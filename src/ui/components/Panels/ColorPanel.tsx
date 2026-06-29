import React from 'react';
import { useViewStore } from '../../../store';

/**
 * Color and tint adjustment panel.
 */
const ColorPanel: React.FC = () => {
  const { bgColor, setColors } = useViewStore();

  return (
    <div id="color-panel" style={{
      position: 'absolute',
      bottom: '60px',
      right: '8px',
      width: '200px',
      background: 'rgba(0,0,0,0.8)',
      borderRadius: '8px',
      padding: '8px',
      color: '#fff',
      fontSize: '13px',
      zIndex: 100
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#f26722' }}>Colors</h4>

      <label style={{ display: 'block', marginBottom: '8px' }}>
        Background:
        <input
          type="color"
          value={`#${bgColor.slice(0, 3).map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`}
          onChange={(e) => {
            const r = parseInt(e.target.value.slice(1, 3), 16) / 255;
            const g = parseInt(e.target.value.slice(3, 5), 16) / 255;
            const b = parseInt(e.target.value.slice(5, 7), 16) / 255;
            setColors('bgColor', [r, g, b, 1]);
          }}
          style={{ marginLeft: '8px' }}
        />
      </label>
    </div>
  );
};

export { ColorPanel };
