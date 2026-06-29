import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

/**
 * Lightweight React overlay that coexists with the PCUI-based editor.
 * Provides React-powered UI enhancements without breaking the existing app.
 */
const AppOverlay: React.FC = () => {
  return (
    <ErrorBoundary>
      <div style={{ display: 'none' }}>
        {/* React UI components mount here as they are integrated */}
      </div>
    </ErrorBoundary>
  );
};

export { AppOverlay };
