# PointForge Architecture

## Overview

PointForge is a professional 3D Point Cloud and Gaussian Splat editor built with TypeScript, React, and the PlayCanvas WebGL engine. This document describes the system architecture, design decisions, and module organization.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React UI Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Toolbar  │ │  Panels  │ │  Popups  │ │ ErrorBoundary │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    State Management (Zustand)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Scene   │ │Selection │ │   Edit   │ │  View / Tool  │  │
│  │  Store   │ │  Store   │ │  Store   │ │    Stores     │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Scene   │ │  Export  │ │  Import  │ │    Render     │  │
│  │ Service  │ │ Service  │ │ Service  │ │   Service     │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   PlayCanvas Engine Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Scene   │ │  Camera  │ │  Splat   │ │ DataProcessor │  │
│  │ (WebGL)  │ │ (3D View)│ │ (Gauss.) │ │   (Compute)   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Core Infrastructure                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │   DI     │ │  Event   │ │  Command │ │    Utils      │  │
│  │Container │ │   Bus    │ │  Queue   │ │               │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. React + PlayCanvas Bridge
- React manages the UI layer (panels, toolbars, dialogs)
- PlayCanvas manages the 3D rendering (WebGL 2.0)
- Communication via Zustand stores and typed event bus
- Canvas ownership stays with PlayCanvas; React renders around it

### 2. State Management (Zustand)
- Chosen over Redux for simplicity and TypeScript ergonomics
- Each domain has its own store (scene, selection, edit, view, tool, UI)
- Stores are independent and composable
- No boilerplate reducers or action creators

### 3. Event-Driven Editing
- EditHistory provides atomic undo/redo via Command pattern
- CommandQueue serializes async operations (GPU readbacks)
- SelectOp, DeleteSelectionOp, MultiOp compose operations

### 4. Service Layer
- Abstracts business logic from UI and engine
- Enables unit testing without engine dependency
- DI container resolves singleton services

### 5. Browser Compatibility
- WebGL 2.0 detection with user-friendly fallback
- File System Access API with legacy fallback
- Web Worker for compute-intensive operations
- Browserslist targeting modern browsers (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)

## Module Descriptions

### `src/engine/`
PlayCanvas-based rendering layer. Contains Scene, Camera, Splat, Element, shaders, and GPU data processing.

### `src/store/`
Zustand state management stores. Each store manages a specific domain of application state.

### `src/services/`
Business logic services. Decouple UI from engine for testability.

### `src/tools/`
Selection and transform tools (rect, brush, lasso, move, rotate, scale, measure).

### `src/ui/`
React component tree. Organized by feature (components/, hooks/, providers/).

### `src/core/`
Cross-cutting infrastructure: DI container, typed event bus.

### `src/utils/`
Browser compatibility checks, performance monitoring.

## Data Flow

1. User interacts with React UI component
2. Component calls Zustand store action
3. Store action may invoke service layer
4. Service calls engine API (Scene, Camera, etc.)
5. Engine updates PlayCanvas rendering
6. Store state changes trigger React re-renders
7. Edit operations go through EditHistory for undo/redo

## Testing Strategy

- **Unit tests**: Core logic (container, events, stores, utils)
- **Integration tests**: Service + Store interactions
- **E2E tests**: Full user workflows via Playwright
- **Coverage target**: 80%+
