import React from 'react';
import { useViewStore } from '../../../store';

/**
 * View settings panel for camera mode, display options.
 */
const ViewPanel: React.FC = () => {
  const {
    cameraMode, setCameraMode,
    showGrid, setShowGrid,
    showBound, setShowBound,
    fov, setFov,
    splatSize, setSplatSize
  } = useViewStore();

  return (
    <div id="view-panel" style={{
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '200px',
      background: 'rgba(0,0,0,0.8)',
      borderRadius: '8px',
      padding: '8px',
      color: '#fff',
      fontSize: '13px',
      zIndex: 100
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#f26722' }}>View Options</h4>

      <label style={{ display: 'block', marginBottom: '8px' }}>
        Mode:
        <select
          value={cameraMode}
          onChange={(e) => setCameraMode(e.target.value as 'centers' | 'rings')}
          style={{ marginLeft: '8px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', padding: '2px 4px' }}
        >
          <option value="centers">Centers</option>
          <option value="rings">Rings</option>
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: '8px' }}>
        FOV: {fov}°
        <input
          type="range"
          min={10}
          max={120}
          value={fov}
          onChange={(e) => setFov(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: '8px' }}>
        Splat Size: {splatSize}px
        <input
          type="range"
          min={1}
          max={10}
          value={splatSize}
          onChange={(e) => setSplatSize(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <input
          type="checkbox"
          checked={showGrid}
          onChange={(e) => setShowGrid(e.target.checked)}
        />
        Show Grid
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={showBound}
          onChange={(e) => setShowBound(e.target.checked)}
        />
        Show Bounds
      </label>
    </div>
  );
};

export { ViewPanel };
