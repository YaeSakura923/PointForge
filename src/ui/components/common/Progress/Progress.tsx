import React, { forwardRef } from 'react';
import styles from './Progress.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  /**
   * Completion percentage (0–100). When omitted or set to `undefined` the bar
   * renders in an indeterminate animated state.
   */
  value?: number;
  /** Color variant. @default 'default' */
  variant?: ProgressVariant;
  /** Track height preset. @default 'md' */
  size?: ProgressSize;
  /** Optional label displayed left of the percentage. */
  label?: string;
  /** When true the percentage text is hidden. @default false */
  hidePercentage?: boolean;
  /** Custom accessible label (defaults to the `label` prop). */
  'aria-label'?: string;
  /** Additional class forwarded to the root element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const variantClass: Record<ProgressVariant, string> = {
  default: '',
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger
};

const sizeClass: Record<ProgressSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg
};

/**
 * Progress bar with percentage display, label and colour variants.
 *
 * Renders an indeterminate animation when `value` is omitted.
 *
 * Ref is forwarded to the root `<div>`.
 */
const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    variant = 'default',
    size = 'md',
    label,
    hidePercentage = false,
    'aria-label': ariaLabel,
    className
  },
  ref
) {
  const isIndeterminate = value === undefined;

  const rootClasses = [
    styles.wrapper,
    variantClass[variant],
    sizeClass[size],
    className ?? null
  ].filter(Boolean).join(' ');

  const fillClasses = [
    styles.fill,
    isIndeterminate ? styles.indeterminate : null
  ].filter(Boolean).join(' ');

  const clampedValue = isIndeterminate
    ? 0
    : Math.max(0, Math.min(100, value!));

  const accessibleLabel = ariaLabel ?? label ?? 'Progress';

  return (
    <div
      ref={ref}
      className={rootClasses}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={accessibleLabel}
    >
      {/* Header row */}
      {(label || !hidePercentage) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {!hidePercentage && (
            <span className={styles.percentage}>
              {isIndeterminate ? '--' : `${Math.round(clampedValue)}%`}
            </span>
          )}
        </div>
      )}

      {/* Track + fill */}
      <div className={styles.track}>
        <div
          className={fillClasses}
          style={isIndeterminate ? undefined : { width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
});

export { Progress };
