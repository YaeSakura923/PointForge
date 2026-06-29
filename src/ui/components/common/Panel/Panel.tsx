import React, { useState, useCallback, type ReactNode } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

const Panel: React.FC<PanelProps> = ({
  title, collapsible = false, defaultOpen = true,
  children, className = '', actions
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => { if (collapsible) setOpen(o => !o); }, [collapsible]);

  return (
    <div className={`${styles.panel} ${className}`}>
      <div
        className={styles.header}
        onClick={toggle}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={collapsible ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } } : undefined}
      >
        <div className={styles.headerLeft}>
          <span className={styles.title}>{title}</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {actions && <div className={styles.headerActions}>{actions}</div>}
          {collapsible && (
            <span className={`${styles.chevron} ${open ? styles.chevronOpen : styles.chevronClosed}`}>▶</span>
          )}
        </span>
      </div>
      <div className={`${styles.content} ${open ? styles.contentOpen : styles.contentClosed}`}>
        {children}
      </div>
    </div>
  );
};

export { Panel };
export type { PanelProps };
