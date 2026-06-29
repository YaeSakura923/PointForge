import React from 'react';
import { useSceneStore } from '../../../store';

/**
 * Scene hierarchy panel showing loaded splats.
 */
const ScenePanel: React.FC = () => {
  const { elements } = useSceneStore();

  return (
    <div id="scene-panel" style={{
      position: 'absolute',
      top: '8px',
      left: '8px',
      width: '240px',
      background: 'rgba(0,0,0,0.8)',
      borderRadius: '8px',
      padding: '8px',
      color: '#fff',
      fontSize: '13px',
      zIndex: 100
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#f26722' }}>Scene</h4>
      {elements.length === 0 ? (
        <p style={{ color: '#888', margin: 0 }}>No splats loaded. Drag and drop PLY files here.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {elements.map((el) => (
            <li key={el.uid} style={{
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}>
              {el.type} #{el.uid}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { ScenePanel };
