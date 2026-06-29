import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'secondary', size = 'md', loading = false,
  fullWidth = false, disabled, children, className, ...props
}, ref) => {
  const classes = [
    styles.button, styles[variant], styles[size],
    disabled && styles.disabled,
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ');

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
