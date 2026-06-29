/**
 * Common UI component library for PointForge.
 *
 * All components follow the project design system:
 *   - Primary:  #f26722 (orange)
 *   - Dark BG:  #1a1a1a / #333 / #444
 *   - Text:     #fff / #b3aaac / #7c7678
 *
 * Usage:
 *   import { Button, Panel, Dialog, Toolbar, Spinner, Progress } from './ui/components/common';
 */

export { Button } from './Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/Button';

export { Panel } from './Panel/Panel';
export type { PanelProps } from './Panel/Panel';

export { Dialog } from './Dialog/Dialog';
export type { DialogProps, DialogSize } from './Dialog/Dialog';

export {
  Toolbar,
  ButtonGroup,
  ToolbarSeparator,
  ToolbarButton
} from './Toolbar/Toolbar';
export type {
  ToolbarProps,
  ToolbarDirection,
  ButtonGroupProps,
  ToolbarButtonProps
} from './Toolbar/Toolbar';

export { Spinner } from './Spinner/Spinner';
export type { SpinnerProps, SpinnerSize } from './Spinner/Spinner';

export { Progress } from './Progress/Progress';
export type { ProgressProps, ProgressVariant, ProgressSize } from './Progress/Progress';
