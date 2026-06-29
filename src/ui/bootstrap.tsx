import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppOverlay } from './AppOverlay';

/**
 * Mounts the React UI as an overlay on top of the existing PCUI-based application.
 * The PlayCanvas engine and PCUI components handle 3D rendering,
 * while React provides the modern UI shell (toolbars, panels, dialogs).
 */
function mountReactUI(): void {
  // PCUI may have removed the original #react-root div from index.html.
  // Create it dynamically as a fixed overlay on top of the PCUI interface.
  let rootEl = document.getElementById('react-root');
  if (!rootEl) {
    rootEl = document.createElement('div');
    rootEl.id = 'react-root';
    document.body.appendChild(rootEl);
  }

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppOverlay />
    </React.StrictMode>
  );
}

export { mountReactUI };
