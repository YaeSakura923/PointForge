import React, { useState, useCallback, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { PlayCanvasBridgeProvider, usePlayCanvasBridge } from './contexts/PlayCanvasBridge';
import { TopToolbar } from './components/TopToolbar/TopToolbar';
import { ScenePanel, ViewPanel, ColorPanel } from './components/panels';
import { ExportDialog, AboutDialog, ShortcutsDialog } from './components/dialogs';
import './AppOverlay.css';

const AppShell: React.FC = () => {
  const bridge = usePlayCanvasBridge();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [splatCount, setSplatCount] = useState(0);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);

  // Listen for scene changes via the bridge
  useEffect(() => {
    if (!bridge.isReady) return;
    const unsub = bridge.on('splatCount', (count: number) => {
      setSplatCount(count);
    });
    return unsub;
  }, [bridge.isReady, bridge.on]);

  // Listen for dialog events from the engine / shortcuts
  useEffect(() => {
    if (!bridge.isReady) return;

    const subs = [
      bridge.on('showShortcuts', () => setActiveDialog('shortcuts')),
      bridge.on('showAbout', () => setActiveDialog('about')),
      bridge.on('exportPly', () => setActiveDialog(null)),
      bridge.on('exportSpz', () => setActiveDialog(null)),
      bridge.on('exportSog', () => setActiveDialog(null))
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setActiveDialog(prev => prev === 'shortcuts' ? null : 'shortcuts');
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      subs.forEach(fn => fn());
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [bridge.isReady, bridge.on]);

  const handleExport = useCallback(() => setActiveDialog('export'), []);

  const closeDialog = useCallback(() => setActiveDialog(null), []);

  return (
    <div id="pf-overlay-root">
      {/* Top Toolbar */}
      <header id="pf-toolbar">
        <TopToolbar />
        <div id="pf-toolbar-actions">
          <button
            className={`pf-toggle-btn ${leftOpen ? 'active' : ''}`}
            onClick={() => setLeftOpen(o => !o)}
            title={leftOpen ? 'Hide Scene Panel' : 'Show Scene Panel'}
          >
            <span className="pf-toggle-icon">{leftOpen ? '◀' : '▶'}</span>
            <span className="pf-toggle-label">Scene</span>
          </button>
          <button
            className={`pf-toggle-btn ${rightOpen ? 'active' : ''}`}
            onClick={() => setRightOpen(o => !o)}
            title={rightOpen ? 'Hide Properties' : 'Show Properties'}
          >
            <span className="pf-toggle-label">Properties</span>
            <span className="pf-toggle-icon">{rightOpen ? '▶' : '◀'}</span>
          </button>
          <span className="pf-splat-count">{splatCount > 0 ? `${splatCount.toLocaleString()} splats` : ''}</span>
        </div>
      </header>

      {/* Left Panel */}
      <aside id="pf-left-panel" className={leftOpen ? 'pf-panel-open' : 'pf-panel-closed'}>
        {bridge.isReady && leftOpen ? (
          <ScenePanel />
        ) : null}
      </aside>

      {/* Right Panel */}
      <aside id="pf-right-panel" className={rightOpen ? 'pf-panel-open' : 'pf-panel-closed'}>
        {bridge.isReady && rightOpen ? (
          <>
            <ViewPanel />
            <ColorPanel />
          </>
        ) : null}
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

      {/* Dialogs */}
      <ExportDialog
        open={activeDialog === 'export'}
        onClose={closeDialog}
        onExport={(format) => {
          const event = format === 'ply' ? 'exportPly' : format === 'spz' ? 'exportSpz' : 'exportSog';
          bridge.fire(event);
        }}
      />
      <AboutDialog open={activeDialog === 'about'} onClose={closeDialog} />
      <ShortcutsDialog open={activeDialog === 'shortcuts'} onClose={closeDialog} />
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
