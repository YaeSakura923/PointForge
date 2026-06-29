import React, { useState, useEffect } from 'react';
import { usePlayCanvasBridge } from '../../contexts/PlayCanvasBridge';
import { Panel } from '../common/Panel/Panel';
import styles from './ViewPanel.module.css';

interface ColorState {
  bg: number[];
  selected: number[];
  unselected: number[];
  locked: number[];
}

const ViewPanel: React.FC = () => {
  const bridge = usePlayCanvasBridge();
  const [colors, setColors] = useState<ColorState>({
    bg: [0, 0, 0],
    selected: [1, 1, 1, 1],
    unselected: [1, 1, 1, 0.3],
    locked: [1, 0.5, 0, 1]
  });
  const [tonemapping, setTonemapping] = useState('linear');
  const [fov, setFov] = useState(60);
  const [shBands, setShBands] = useState(3);
  const [flySpeed, setFlySpeed] = useState(1);
  const [splatSize, setSplatSize] = useState(2);
  const [centersGaussianColor, setCentersGaussianColor] = useState(false);
  const [outlineSelection, setOutlineSelection] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showBound, setShowBound] = useState(true);
  const [showBoundDims, setShowBoundDims] = useState(false);
  const [showCameraPoses, setShowCameraPoses] = useState(false);

  useEffect(() => {
    if (!bridge.isReady) return;

    const subs = [
      bridge.on('bgClr', (clr: number[]) => setColors(c => ({ ...c, bg: clr }))),
      bridge.on('selectedClr', (clr: number[]) => setColors(c => ({ ...c, selected: clr }))),
      bridge.on('unselectedClr', (clr: number[]) => setColors(c => ({ ...c, unselected: clr }))),
      bridge.on('lockedClr', (clr: number[]) => setColors(c => ({ ...c, locked: clr }))),
      bridge.on('camera.tonemapping', (t: string) => setTonemapping(t)),
      bridge.on('camera.fov', (f: number) => setFov(f)),
      bridge.on('view.bands', (b: number) => setShBands(b)),
      bridge.on('camera.flySpeed', (s: number) => setFlySpeed(s)),
      bridge.on('camera.splatSize', (s: number) => setSplatSize(s)),
      bridge.on('view.centersUseGaussianColor', (v: boolean) => setCentersGaussianColor(v)),
      bridge.on('view.outlineSelection', (v: boolean) => setOutlineSelection(v)),
      bridge.on('grid.visible', (v: boolean) => setShowGrid(v)),
      bridge.on('camera.bound', (v: boolean) => setShowBound(v)),
      bridge.on('camera.boundDimensions', (v: boolean) => setShowBoundDims(v)),
      bridge.on('camera.showPoses', (v: boolean) => setShowCameraPoses(v))
    ];

    return () => subs.forEach(fn => fn());
  }, [bridge.isReady, bridge.on]);

  const toHex = (rgba: number[]) => {
    const r = Math.round(rgba[0] * 255).toString(16).padStart(2, '0');
    const g = Math.round(rgba[1] * 255).toString(16).padStart(2, '0');
    const b = Math.round(rgba[2] * 255).toString(16).padStart(2, '0');
    return '#' + r + g + b;
  };

  const colorLabels = [
    { key: 'bg', title: 'Background', clr: colors.bg, event: 'setBgClr' },
    { key: 'selected', title: 'Selected', clr: colors.selected, event: 'setSelectedClr' },
    { key: 'unselected', title: 'Unselected', clr: colors.unselected, event: 'setUnselectedClr' },
    { key: 'locked', title: 'Locked', clr: colors.locked, event: 'setLockedClr' }
  ];

  const toggles = [
    { label: 'Gaussian Color Centers', value: centersGaussianColor, event: 'view.setCentersUseGaussianColor', set: setCentersGaussianColor },
    { label: 'Outline Selection', value: outlineSelection, event: 'view.setOutlineSelection', set: setOutlineSelection },
    { label: 'Show Grid', value: showGrid, event: 'grid.setVisible', set: setShowGrid },
    { label: 'Show Bound', value: showBound, event: 'camera.setBound', set: setShowBound },
    { label: 'Show Dimensions', value: showBoundDims, event: 'camera.setBoundDimensions', set: setShowBoundDims },
    { label: 'Show Camera Poses', value: showCameraPoses, event: 'camera.setShowPoses', set: setShowCameraPoses }
  ];

  return (
    <Panel title="View Options" collapsible defaultOpen={false}>
      <div className={styles.panel}>
        <div className={styles.row}>
          <span className={styles.label}>Colors</span>
          <div className={styles.colorPickers}>
            {colorLabels.map(({ key, title, clr, event }) => (
              <input
                key={key}
                type="color"
                className={styles.colorInput}
                value={toHex(clr)}
                title={title}
                onChange={(e) => {
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16) / 255;
                  const g = parseInt(hex.slice(3, 5), 16) / 255;
                  const b = parseInt(hex.slice(5, 7), 16) / 255;
                  bridge.fire(event, [r, g, b, clr[3] ?? 1]);
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Tonemapping</span>
          <select className={styles.select} value={tonemapping}
            onChange={(e) => bridge.fire('camera.setTonemapping', e.target.value)}>
            {['linear', 'neutral', 'aces', 'aces2', 'filmic', 'hejl'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>FOV: {fov} deg</span>
          <input type="range" className={styles.slider} min={10} max={120} step={1} value={fov}
            onChange={(e) => { const v = Number(e.target.value); setFov(v); bridge.fire('camera.setFov', v); }} />
        </div>

        <div className={styles.row}>
          <span className={styles.label}>SH Bands: {shBands}</span>
          <input type="range" className={styles.slider} min={0} max={3} step={1} value={shBands}
            onChange={(e) => { const v = Number(e.target.value); setShBands(v); bridge.fire('view.setBands', v); }} />
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Fly Speed: {flySpeed.toFixed(1)}</span>
          <input type="range" className={styles.slider} min={0.1} max={30} step={0.1} value={flySpeed}
            onChange={(e) => { const v = Number(e.target.value); setFlySpeed(v); bridge.fire('camera.setFlySpeed', v); }} />
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Splat Size: {splatSize.toFixed(1)}</span>
          <input type="range" className={styles.slider} min={0} max={10} step={0.1} value={splatSize}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSplatSize(v);
              bridge.fire('camera.setSplatSize', v);
              bridge.fire('camera.setOverlay', true);
              bridge.fire('camera.setMode', 'centers');
            }} />
        </div>

        {toggles.map(({ label, value, event, set }) => (
          <div key={event} className={styles.row}>
            <span className={styles.label}>{label}</span>
            <label className={styles.toggle}>
              <input type="checkbox" checked={value}
                onChange={(e) => { const v = e.target.checked; set(v); bridge.fire(event, v); }} />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export { ViewPanel };
