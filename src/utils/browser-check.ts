/**
 * Browser compatibility detection and polyfill management.
 */

interface BrowserInfo {
  name: string;
  version: number;
  supportsWebGL2: boolean;
  supportsFileSystemAPI: boolean;
  supportsWebWorker: boolean;
  supportsSharedArrayBuffer: boolean;
  isMobile: boolean;
}

/**
 * Detect browser capabilities.
 */
function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;

  let name = 'unknown';
  let version = 0;

  if (ua.includes('Edg/')) {
    name = 'edge';
    version = parseInt((ua.match(/Edg\/(\d+)/) || [])[1] || '0', 10);
  } else if (ua.includes('Chrome/')) {
    name = 'chrome';
    version = parseInt((ua.match(/Chrome\/(\d+)/) || [])[1] || '0', 10);
  } else if (ua.includes('Firefox/')) {
    name = 'firefox';
    version = parseInt((ua.match(/Firefox\/(\d+)/) || [])[1] || '0', 10);
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    name = 'safari';
    version = parseInt((ua.match(/Version\/(\d+)/) || [])[1] || '0', 10);
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');

  return {
    name,
    version,
    supportsWebGL2: !!gl,
    supportsFileSystemAPI: 'showOpenFilePicker' in window,
    supportsWebWorker: typeof Worker !== 'undefined',
    supportsSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
    isMobile: /Android|iPhone|iPad|iPod|webOS/i.test(ua)
  };
}

/**
 * Check if the browser meets minimum requirements.
 */
function checkBrowserSupport(): { supported: boolean; issues: string[] } {
  const info = detectBrowser();
  const issues: string[] = [];

  if (!info.supportsWebGL2) {
    issues.push('WebGL 2.0 is not supported. Please use a modern browser (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+).');
  }

  if (info.name === 'safari' && info.version < 15) {
    issues.push('Safari 15+ is required for full functionality.');
  }

  if (info.name === 'chrome' && info.version < 90) {
    issues.push('Chrome 90+ is recommended for optimal performance.');
  }

  return {
    supported: issues.length === 0,
    issues
  };
}

export { detectBrowser, checkBrowserSupport };
export type { BrowserInfo };
