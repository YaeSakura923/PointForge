import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppOverlay } from './AppOverlay';

/**
 * Mounts the React UI as an overlay on top of the existing PCUI-based application.
 * The PlayCanvas engine and PCUI components handle 3D rendering,
 * while React provides the modern UI shell (toolbars, panels, dialogs).
 */
function mountReactUI(): void {
  const rootEl = document.getElementById('react-root');
  if (!rootEl) return;

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppOverlay />
    </React.StrictMode>
  );
}

export { mountReactUI };
