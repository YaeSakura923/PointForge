import React, { forwardRef } from 'react';
import styles from './Spinner.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** Size preset. @default 'md' */
  size?: SpinnerSize;
  /** Optional descriptive text (e.g. "Loading splats..."). */
  label?: string;
  /** When true the spinner is wrapped in a flex center container. */
  centered?: boolean;
  /** Additional class forwarded to the outermost element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const sizeClass: Record<SpinnerSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg
};

/**
 * Loading spinner with optional label and centering.
 *
 * Ref is forwarded to the outermost element (the spinner `<div>`, or the
 * wrapper `<div>` when a label or `centered` is present).
 */
const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  { size = 'md', label, centered = false, className },
  ref
) {
  const spinnerEl = (
    <div
      ref={!label && !centered ? ref : undefined}
      className={[styles.spinner, sizeClass[size], className ?? null]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label={label || 'Loading'}
    />
  );

  if (label) {
    return (
      <div
        ref={ref}
        className={[styles.wrapper, centered ? styles.centered : null]
          .filter(Boolean)
          .join(' ')}
      >
        {spinnerEl}
        <span className={styles.label}>{label}</span>
      </div>
    );
  }

  if (centered) {
    return (
      <div ref={ref} className={styles.centered}>
        {spinnerEl}
      </div>
    );
  }

  return spinnerEl;
});

export { Spinner };
