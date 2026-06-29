import React from 'react';
import { Dialog } from '../common/Dialog/Dialog';
import styles from './AboutDialog.module.css';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} title="About PointForge" size="sm">
      <div className={styles.about}>
        <div className={styles.logo}>PointForge</div>
        <div className={styles.version}>Version 3.0.0</div>
        <p className={styles.desc}>
          A high-performance 3D Gaussian Splatting editor built with React,
          TypeScript, and the PlayCanvas WebGL engine.
        </p>
        <div className={styles.tech}>
          <span>React 18</span>
          <span>TypeScript 5</span>
          <span>PlayCanvas WebGL</span>
          <span>Zustand</span>
          <span>Vite 5</span>
          <span>Web Workers</span>
        </div>
      </div>
    </Dialog>
  );
};

export { AboutDialog };
export type { AboutDialogProps };
