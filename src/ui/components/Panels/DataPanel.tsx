import React from 'react';

/**
 * Collapsible data/histogram panel.
 */
const DataPanel: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
        setExpanded((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: '28px',
      left: 0,
      right: 0,
      background: 'rgba(0,0,0,0.9)',
      borderTop: '1px solid #333',
      transition: 'height 0.2s',
      height: expanded ? '200px' : '28px',
      overflow: 'hidden',
      zIndex: 100
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          color: '#ccc',
          fontSize: '12px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        Data Panel (press D to toggle)
      </div>
      {expanded && (
        <div style={{ padding: '8px', color: '#888', fontSize: '12px' }}>
          Histogram visualization for selected splat properties.
          Drag to select splats by value range.
        </div>
      )}
    </div>
  );
};

export { DataPanel };
