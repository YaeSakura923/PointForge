import React, { useState, useCallback } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { PlayCanvasBridgeProvider, usePlayCanvasBridge } from './contexts/PlayCanvasBridge';
import './AppOverlay.css';

const AppShell: React.FC = () => {
  const bridge = usePlayCanvasBridge();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [splatCount, setSplatCount] = useState(0);

  // Listen for scene changes via the bridge
  React.useEffect(() => {
    if (!bridge.isReady) return;
    const unsub = bridge.on('splatCount', (count: number) => {
      setSplatCount(count);
    });
    return unsub;
  }, [bridge.isReady, bridge.on]);

  const handleNew = useCallback(() => bridge.fire('new'), [bridge.fire]);
  const handleOpen = useCallback(() => bridge.fire('open'), [bridge.fire]);
  const handleSave = useCallback(() => bridge.fire('save'), [bridge.fire]);
  const handleUndo = useCallback(() => bridge.fire('undo'), [bridge.fire]);
  const handleRedo = useCallback(() => bridge.fire('redo'), [bridge.fire]);
  const handleExport = useCallback(() => setActiveDialog('export'), []);

  const closeDialog = useCallback(() => setActiveDialog(null), []);

  return (
    <div id="pf-overlay-root">
      {/* Top Toolbar */}
      <header id="pf-toolbar">
        <div id="pf-toolbar-left">
          <span className="pf-brand">PointForge</span>
          <nav className="pf-menu">
            <button className="pf-btn" onClick={handleNew}>New</button>
            <button className="pf-btn" onClick={handleOpen}>Open</button>
            <button className="pf-btn" onClick={handleSave}>Save</button>
            <button className="pf-btn" onClick={handleExport}>Export</button>
          </nav>
        </div>
        <div id="pf-toolbar-center">
          <button className="pf-btn pf-icon-btn" onClick={handleUndo} title="Undo">↩</button>
          <button className="pf-btn pf-icon-btn" onClick={handleRedo} title="Redo">↪</button>
        </div>
        <div id="pf-toolbar-right">
          <span className="pf-splat-count">{splatCount > 0 ? `${splatCount.toLocaleString()} splats` : ''}</span>
        </div>
      </header>

      {/* Left Panel */}
      <aside id="pf-left-panel">
        <div className="pf-panel">
          <div className="pf-panel-header">Scene</div>
          <div className="pf-panel-body" id="pf-scene-list">
            {!bridge.isReady && <div className="pf-panel-placeholder">Loading engine...</div>}
          </div>
        </div>
      </aside>

      {/* Right Panel */}
      <aside id="pf-right-panel">
        <div className="pf-panel">
          <div className="pf-panel-header">Properties</div>
          <div className="pf-panel-body" id="pf-props-panel">
            {!bridge.isReady && <div className="pf-panel-placeholder">Loading...</div>}
          </div>
        </div>
      </aside>

      {/* Bottom Status Bar */}
      <footer id="pf-status-bar">
        <span id="pf-status-left">
          {bridge.isReady ? 'Ready' : 'Initializing PlayCanvas engine...'}
        </span>
        <span id="pf-status-right">
          PointForge v3.0.0
        </span>
      </footer>

      {/* Export Dialog */}
      {activeDialog === 'export' && (
        <div className="pf-dialog-overlay" onClick={closeDialog}>
          <div className="pf-dialog" onClick={e => e.stopPropagation()}>
            <div className="pf-dialog-header">
              <h3>Export</h3>
              <button className="pf-btn pf-icon-btn" onClick={closeDialog}>✕</button>
            </div>
            <div className="pf-dialog-body">
              <div className="pf-export-options">
                <button className="pf-btn pf-btn-primary" onClick={() => { bridge.fire('exportPly'); closeDialog(); }}>
                  Export PLY
                </button>
                <button className="pf-btn pf-btn-primary" onClick={() => { bridge.fire('exportSpz'); closeDialog(); }}>
                  Export SPZ
                </button>
                <button className="pf-btn pf-btn-primary" onClick={() => { bridge.fire('exportSog'); closeDialog(); }}>
                  Export SOG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AppOverlay: React.FC = () => {
  return (
    <ErrorBoundary>
      <PlayCanvasBridgeProvider>
        <AppShell />
      </PlayCanvasBridgeProvider>
    </ErrorBoundary>
  );
};

export { AppOverlay };
