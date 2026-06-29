import React, { forwardRef, type ReactNode } from 'react';
import styles from './Toolbar.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToolbarDirection = 'horizontal' | 'vertical';

export interface ToolbarProps {
  /** Layout direction. @default 'horizontal' */
  direction?: ToolbarDirection;
  /** Toolbar content — use `<ButtonGroup>` and `<ToolbarSeparator>`. */
  children?: ReactNode;
  /** Additional class forwarded to the root element. */
  className?: string;
}

export interface ButtonGroupProps {
  /** Buttons to group together with no gap. */
  children?: ReactNode;
}

export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {
  /** Whether the button is in its active/toggled state. */
  active?: boolean;
  /** When true the button is wider and shows a text label next to any icon. */
  label?: ReactNode;
}

// ---------------------------------------------------------------------------
// Toolbar (root)
// ---------------------------------------------------------------------------

/**
 * Horizontal or vertical toolbar container.
 *
 * Ref is forwarded to the root `<div>`.
 */
const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { direction = 'horizontal', children, className },
  ref
) {
  const classes = [
    styles.toolbar,
    direction === 'vertical' ? styles.vertical : styles.horizontal,
    className ?? null
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} role="toolbar">
      {children}
    </div>
  );
});

// ---------------------------------------------------------------------------
// ButtonGroup
// ---------------------------------------------------------------------------

/**
 * Groups toolbar buttons together without a gap between them.
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ children }, ref) {
    return (
      <div ref={ref} className={styles.group}>
        {children}
      </div>
    );
  }
);

// ---------------------------------------------------------------------------
// ToolbarSeparator
// ---------------------------------------------------------------------------

/**
 * A thin vertical or horizontal divider between toolbar groups.
 */
const ToolbarSeparator: React.FC = () => {
  return <div className={styles.separator} />;
};

// ---------------------------------------------------------------------------
// ToolbarButton
// ---------------------------------------------------------------------------

/**
 * A button sized for toolbar use — square by default, can show a label.
 *
 * Ref is forwarded to the `<button>` element.
 */
const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    { active = false, label, className, children, ...rest },
    ref
  ) {
    const classes = [
      styles.toolbarButton,
      active ? styles.active : null,
      label ? styles.withLabel : null,
      className ?? null
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...rest}>
        {label && <span>{label}</span>}
        {children}
      </button>
    );
  }
);

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Toolbar, ButtonGroup, ToolbarSeparator, ToolbarButton };
