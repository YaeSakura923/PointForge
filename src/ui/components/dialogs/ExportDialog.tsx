import React from 'react';
import { Dialog } from '../common/Dialog/Dialog';
import { Button } from '../common/Button/Button';
import styles from './ExportDialog.module.css';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose, onExport }) => {
  const formats = [
    { id: 'ply', label: 'PLY', desc: 'Standard PLY format — full point cloud data' },
    { id: 'spz', label: 'SPZ', desc: 'Compressed Gaussian splat format — smaller file size' },
    { id: 'sog', label: 'SOG', desc: 'SuperPacked Open Gaussian — optimized for web' }
  ];

  return (
    <Dialog open={open} onClose={onClose} title="Export Scene" size="sm">
      <div className={styles.options}>
        {formats.map(f => (
          <button key={f.id} className={styles.option}
            onClick={() => { onExport(f.id); onClose(); }}>
            <span className={styles.optionLabel}>{f.label}</span>
            <span className={styles.optionDesc}>{f.desc}</span>
          </button>
        ))}
      </div>
    </Dialog>
  );
};

export { ExportDialog };
export type { ExportDialogProps };
