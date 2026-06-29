import React, { useState, useEffect, useCallback } from 'react';
import { usePlayCanvasBridge } from '../../contexts/PlayCanvasBridge';
import { Panel } from '../common/Panel/Panel';
import { Button } from '../common/Button/Button';
import styles from './ScenePanel.module.css';

interface SplatInfo {
  uid: number;
  name: string;
  count: number;
  visible: boolean;
  locked: boolean;
}

const ScenePanel: React.FC = () => {
  const bridge = usePlayCanvasBridge();
  const [splats, setSplats] = useState<SplatInfo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [soloActive, setSoloActive] = useState(false);

  useEffect(() => {
    if (!bridge.isReady) return;

    const unsub1 = bridge.on('splatList', (list: SplatInfo[]) => {
      setSplats(list);
    });

    const unsub2 = bridge.on('selection.changed', (data: { uid?: number }) => {
      setSelectedId(data?.uid ?? null);
    });

    const unsub3 = bridge.on('splatCount', () => {
      bridge.fire('requestSplatList');
    });

    bridge.fire('requestSplatList');

    return () => { unsub1(); unsub2(); unsub3(); };
  }, [bridge.isReady, bridge.on, bridge.fire]);

  const handleSelect = useCallback((uid: number) => {
    bridge.fire('select', uid);
  }, [bridge.fire]);

  const handleToggleVisibility = useCallback((uid: number, visible: boolean) => {
    bridge.fire(visible ? 'show' : 'hide', uid);
  }, [bridge.fire]);

  const handleToggleLock = useCallback((uid: number, locked: boolean) => {
    bridge.fire(locked ? 'lock' : 'unlock', uid);
  }, [bridge.fire]);

  const handleSolo = useCallback(() => {
    const next = !soloActive;
    setSoloActive(next);
    bridge.fire('scene.solo', next);
  }, [soloActive, bridge.fire]);

  const handleImport = useCallback(() => {
    bridge.fire('scene.import');
  }, [bridge.fire]);

  const handleNew = useCallback(() => {
    bridge.fire('doc.new');
  }, [bridge.fire]);

  const actions = (
    <>
      <Button variant="ghost" size="sm" active={soloActive} onClick={handleSolo} title="Solo Mode">
        S
      </Button>
      <Button variant="ghost" size="sm" onClick={handleImport} title="Import Scene">
        +
      </Button>
      <Button variant="ghost" size="sm" onClick={handleNew} title="New Scene">
        N
      </Button>
    </>
  );

  return (
    <Panel title="Scene Manager" actions={actions} defaultOpen>
      <div className={styles.splatList}>
        {splats.length === 0 ? (
          <div className={styles.empty}>No splats loaded</div>
        ) : (
          splats.map((splat) => (
            <div
              key={splat.uid}
              className={`${styles.splatItem} ${selectedId === splat.uid ? styles.selected : ''}`}
              onClick={() => handleSelect(splat.uid)}
            >
              <span className={styles.splatName}>{splat.name}</span>
              <span className={styles.splatCount}>{splat.count.toLocaleString()}</span>
              <div className={styles.splatActions}>
                <button
                  className={`${styles.iconBtn} ${splat.visible ? '' : styles.off}`}
                  onClick={(e) => { e.stopPropagation(); handleToggleVisibility(splat.uid, !splat.visible); }}
                  title={splat.visible ? 'Hide' : 'Show'}
                >
                  {splat.visible ? '\u{1F441}' : '—'}
                </button>
                <button
                  className={`${styles.iconBtn} ${splat.locked ? styles.on : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleToggleLock(splat.uid, !splat.locked); }}
                  title={splat.locked ? 'Unlock' : 'Lock'}
                >
                  {splat.locked ? '\u{1F512}' : '\u{1F513}'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
};

export { ScenePanel };
