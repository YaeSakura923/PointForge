# PointForge Editor

[![License](https://img.shields.io/github/license/pointforge/pointforge)](https://github.com/YaeSakura923/PointForge/blob/main/LICENSE)

PointForge is a professional, open-source browser-based editor for inspecting, editing, optimizing and publishing 3D Point Clouds and Gaussian Splats. Built with modern web technologies, it requires no downloads or installation.

## Features

- **3D Gaussian Splat Editing** — Load, view, and edit PLY/SPZ format splats
- **Advanced Selection Tools** — Rect, lasso, polygon, sphere, box, brush, flood, and eyedropper selection
- **Transform Tools** — Move, rotate, and scale splats with precision gizmos
- **Color Adjustment** — Tint, temperature, saturation, brightness, black/white point, transparency
- **Export Pipeline** — Export to PLY, SPZ, SOG formats
- **Video/Image Rendering** — Render high-quality still images and fly-through videos
- **Camera Poses** — Save and manage camera viewpoints
- **Animation Support** — Timeline-based splat sequence playback
- **PWA Support** — Install as a desktop app with file association

## Tech Stack

- **Engine**: PlayCanvas WebGL 2.0
- **Language**: TypeScript (strict mode)
- **UI Framework**: React 18 + PCUI
- **State Management**: Zustand
- **Build Tool**: Vite
- **Testing**: Vitest + Playwright
- **I18n**: i18next (multi-language support)

## Local Development

Node.js 20+ is required.

```sh
git clone https://github.com/YaeSakura923/PointForge.git
cd pointforge
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Changes are hot-reloaded automatically.

### Build

```sh
npm run build
```

### Test

```sh
npm run test
npm run test:e2e
```

## Internationalization

Supported languages: English, 中文, Deutsch, Español, Français, 日本語, 한국어, Português, Русский.

Add locale files in `src/i18n/locales/`.

## Architecture

```
src/
├── core/          # DI container, type-safe events
├── engine/        # PlayCanvas rendering layer
├── store/         # Zustand state management
├── services/      # Business logic services
├── tools/         # Selection & transform tools
├── ui/            # React components
├── hooks/         # Custom React hooks
└── utils/         # Browser check, performance monitor
```

## License

MIT
