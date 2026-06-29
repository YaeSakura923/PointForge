import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ui/App';
import { checkBrowserSupport } from './utils/browser-check';
import './ui/scss/style.scss';

// Browser compatibility check
const { supported, issues } = checkBrowserSupport();

if (!supported) {
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#1a1a1a;color:#fff;">
      <div style="max-width:500px;text-align:center;">
        <h1>PointForge</h1>
        <p>${issues.join('<br>')}</p>
      </div>
    </div>
  `;
  throw new Error(`Browser not supported: ${issues.join(', ')}`);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Create root if it doesn't exist (for compatibility with old index.html)
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

const mountPoint = rootElement || document.getElementById('root')!;

ReactDOM.createRoot(mountPoint).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
