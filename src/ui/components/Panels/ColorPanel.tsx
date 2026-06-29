import React, { useState, useEffect, useCallback } from "react";
import { usePlayCanvasBridge } from "../../contexts/PlayCanvasBridge";
import { Panel } from "../common/Panel/Panel";
import { Button } from "../common/Button/Button";
import styles from "./ColorPanel.module.css";

interface ColorAdjustment {
  tint: number[];
  temperature: number;
  saturation: number;
  brightness: number;
  blackPoint: number;
  whitePoint: number;
  transparency: number;
}

const defaults: ColorAdjustment = {
  tint: [1, 1, 1],
  temperature: 0,
  saturation: 1,
  brightness: 0,
  blackPoint: 0,
  whitePoint: 1,
  transparency: 1
};

const ColorPanel: React.FC = () => {
  const bridge = usePlayCanvasBridge();
  const [adjustment, setAdjustment] = useState<ColorAdjustment>({ ...defaults });
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (!bridge.isReady) return;
    const subs = [
      bridge.on("selection.changed", (splat: any) => {
        if (splat) {
          setHasSelection(true);
          setAdjustment({
            tint: splat.tintClr ? [splat.tintClr.r, splat.tintClr.g, splat.tintClr.b] : [1, 1, 1],
            temperature: splat.temperature ?? 0,
            saturation: splat.saturation ?? 1,
            brightness: splat.brightness ?? 0,
            blackPoint: splat.blackPoint ?? 0,
            whitePoint: splat.whitePoint ?? 1,
            transparency: splat.transparency ?? 1
          });
        } else {
          setHasSelection(false);
          setAdjustment({ ...defaults });
        }
      }),
      bridge.on("splat.tintClr", (d: any) => { setAdjustment(p => ({ ...p, ...d })); setHasSelection(true); }),
      bridge.on("splat.temperature", (d: any) => { setAdjustment(p => ({ ...p, ...d })); setHasSelection(true); }),
      bridge.on("splat.saturation", (d: any) => { setAdjustment(p => ({ ...p, ...d })); setHasSelection(true); }),
      bridge.on("splat.brightness", (d: any) => { setAdjustment(p => ({ ...p, ...d })); setHasSelection(true); }),
      bridge.on("splat.blackPoint", (d: any) => { setAdjustment(p => ({ ...p, ...d })); setHasSelection(true); }),
      bridge.on("splat.whitePoint", (d: any) => { setAdjustment(p => ({ ...p, ...d })); setHasSelection(true); }),
      bridge.on("splat.transparency", (d: any) => { setAdjustment(p => ({ ...p, ...d })); setHasSelection(true); })
    ];
    return () => subs.forEach(fn => fn());
  }, [bridge.isReady, bridge.on]);

  const handleReset = useCallback(() => {
    setAdjustment({ ...defaults });
    bridge.fire("color.reset");
  }, [bridge.fire]);

  const toHex = (rgb: number[]) => {
    const r = Math.round(rgb[0] * 255).toString(16).padStart(2, "0");
    const g = Math.round(rgb[1] * 255).toString(16).padStart(2, "0");
    const b = Math.round(rgb[2] * 255).toString(16).padStart(2, "0");
    return "#" + r + g + b;
  };

  const sliders = [
    { label: "Temperature", key: "temperature" as const, min: -0.5, max: 0.5, step: 0.005 },
    { label: "Saturation", key: "saturation" as const, min: 0, max: 2, step: 0.1 },
    { label: "Brightness", key: "brightness" as const, min: -1, max: 1, step: 0.1 },
    { label: "Black Point", key: "blackPoint" as const, min: 0, max: 1, step: 0.01 },
    { label: "White Point", key: "whitePoint" as const, min: 0, max: 1, step: 0.01 }
  ];

  const logTransparency = Math.log(Math.max(adjustment.transparency, 0.002));
  const displayTransparency = Math.min(6, Math.max(-6, logTransparency));

  return (
    <Panel title="Color Adjustments" collapsible defaultOpen={false}
      actions={<Button variant="ghost" size="sm" onClick={handleReset} title="Reset">R</Button>}
    >
      <div className={styles.panel}>
        {!hasSelection && <div className={styles.noSelection}>Select a splat to adjust colors</div>}
        <div className={styles.row}>
          <span className={styles.label}>Tint</span>
          <input type="color" className={styles.colorInput} value={toHex(adjustment.tint)}
            disabled={!hasSelection}
            onChange={(e) => {
              const hex = e.target.value;
              const r = parseInt(hex.slice(1, 3), 16) / 255;
              const g = parseInt(hex.slice(3, 5), 16) / 255;
              const b = parseInt(hex.slice(5, 7), 16) / 255;
              setAdjustment(prev => ({ ...prev, tint: [r, g, b] }));
              bridge.fire("color.setTint", [r, g, b]);
            }} />
        </div>
        {sliders.map(({ label, key, min, max, step }) => (
          <div key={key} className={styles.row}>
            <span className={styles.label}>{label}: {adjustment[key].toFixed(3)}</span>
            <input type="range" className={styles.slider} min={min} max={max} step={step}
              value={adjustment[key]} disabled={!hasSelection}
              onChange={(e) => {
                const v = Number(e.target.value);
                setAdjustment(prev => ({ ...prev, [key]: v }));
                bridge.fire("color.adjust", { [key]: v });
              }} />
          </div>
        ))}
        <div className={styles.row}>
          <span className={styles.label}>Transparency: {adjustment.transparency.toFixed(3)}</span>
          <input type="range" className={styles.slider} min={-6} max={6} step={0.01}
            value={displayTransparency} disabled={!hasSelection}
            onChange={(e) => {
              const v = Math.exp(Number(e.target.value));
              setAdjustment(prev => ({ ...prev, transparency: v }));
              bridge.fire("color.adjust", { transparency: v });
            }} />
        </div>
      </div>
    </Panel>
  );
};

export { ColorPanel };
