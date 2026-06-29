import { defineConfig, type Plugin } from 'vite';
import { resolve, dirname } from 'path';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import autoprefixer from 'autoprefixer';
import sass from 'sass';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BUILD_TYPE = process.env.BUILD_TYPE || 'release';
const HREF = process.env.BASE_HREF || '';
const ENGINE_DIR = resolve(`node_modules/playcanvas/build/playcanvas${BUILD_TYPE === 'debug' ? '.dbg' : ''}/src/index.js`);
const PCUI_DIR = resolve('node_modules/@playcanvas/pcui');

// Plugin to copy files with optional transformation
function copyStatic(): Plugin {
  return {
    name: 'copy-static',
    buildStart() {
      const distDir = 'dist';
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }
      // Copy index.html with HREF replacement
      const html = readFileSync('src/index.html', 'utf-8');
      writeFileSync(`${distDir}/index.html`, html.replace('__BASE_HREF__', HREF));
      // Copy manifest.json
      const manifest = readFileSync('static/manifest.json');
      writeFileSync(`${distDir}/manifest.json`, manifest);
    }
  };
}

// Plugin to transform SVG imports into data URLs (Rollup-compatible format)
function svgDataUrl(): Plugin {
  const svgCache = new Map<string, string>();

  function getSvgDataUrl(filePath: string): string {
    if (svgCache.has(filePath)) return svgCache.get(filePath)!;
    const code = readFileSync(filePath, 'utf-8');
    const encoded = encodeURIComponent(code);
    const dataUrl = `data:image/svg+xml,${encoded}`;
    svgCache.set(filePath, dataUrl);
    return dataUrl;
  }

  return {
    name: 'svg-data-url',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts') && !id.endsWith('.tsx')) return;
      const svgImportRe = /import (\w+) from ['"](\.\/[^'"]+\.svg)['"];?/g;
      let match;
      let result = code;
      let changed = false;
      while ((match = svgImportRe.exec(code)) !== null) {
        const varName = match[1];
        const svgPath = match[2];
        const dir = id.split('/').slice(0, -1).join('/');
        const absSvgPath = resolve(dir, svgPath);
        const dataUrl = getSvgDataUrl(absSvgPath);
        result = result.replace(match[0], `const ${varName} = "${dataUrl}";`);
        changed = true;
      }
      if (changed) {
        return { code: result, map: null };
      }
    }
  };
}

export default defineConfig({
  base: HREF,
  publicDir: 'static',
  resolve: {
    alias: {
      'playcanvas': ENGINE_DIR,
      '@playcanvas/pcui': PCUI_DIR
    }
  },
  plugins: [copyStatic(), svgDataUrl()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        includePaths: [`${PCUI_DIR}/dist`]
      }
    },
    postcss: {
      plugins: [autoprefixer()]
    }
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: BUILD_TYPE !== 'debug',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 5173,
    open: false,
    cors: true
  },
  optimizeDeps: {
    exclude: ['mediabunny']
  },
  define: {
    'process.env.BUILD_TYPE': JSON.stringify(BUILD_TYPE)
  }
});
