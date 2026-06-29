import React, { useEffect, useRef, Suspense } from 'react';
import { CanvasViewport } from './components/CanvasViewport/CanvasViewport';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ScenePanel } from './components/Panels/ScenePanel';
import { ViewPanel } from './components/Panels/ViewPanel';
import { ColorPanel } from './components/Panels/ColorPanel';
import { DataPanel } from './components/Panels/DataPanel';
import { StatusBar } from './components/StatusBar/StatusBar';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

/**
 * Root application component.
 * Orchestrates the main layout and initializes the PlayCanvas engine
 * within the CanvasViewport component.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div id="app-container">
        <div id="editor-container">
          <div id="main-container">
            <Toolbar />
            <CanvasViewport>
              <ScenePanel />
              <ViewPanel />
              <ColorPanel />
            </CanvasViewport>
            <DataPanel />
            <StatusBar />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export { App };
