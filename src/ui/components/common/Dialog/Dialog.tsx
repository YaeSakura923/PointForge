import React, { useEffect, useCallback, type ReactNode } from 'react';
import styles from './Dialog.module.css';

type DialogSize = 'sm' | 'md' | 'lg';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  closeable?: boolean;
  disableOverlayClose?: boolean;
}

const sizeClass: Record<DialogSize, string> = { sm: styles.sm, md: styles.md, lg: styles.lg };

const Dialog: React.FC<DialogProps> = ({
  open, onClose, title, children, footer,
  size = 'md', closeable = true, disableOverlayClose = false
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeable) onClose();
  }, [onClose, closeable]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={disableOverlayClose ? undefined : onClose}>
      <div
        className={`${styles.dialog} ${sizeClass[size]}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {closeable && (
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">✕</button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export { Dialog };
export type { DialogProps, DialogSize };
