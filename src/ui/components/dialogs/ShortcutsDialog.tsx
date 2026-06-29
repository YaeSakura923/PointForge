import React from 'react';
import { Dialog } from '../common/Dialog/Dialog';
import styles from './ShortcutsDialog.module.css';

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string; action: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'File',
    shortcuts: [
      { keys: 'Ctrl + O', action: 'Open file' },
      { keys: 'Ctrl + S', action: 'Save scene' },
      { keys: 'Ctrl + Shift + S', action: 'Save as' }
    ]
  },
  {
    title: 'Edit',
    shortcuts: [
      { keys: 'Ctrl + Z', action: 'Undo' },
      { keys: 'Ctrl + Shift + Z', action: 'Redo' },
      { keys: 'Ctrl + A', action: 'Select all' },
      { keys: 'Ctrl + I', action: 'Invert selection' },
      { keys: 'Delete', action: 'Delete selected' },
      { keys: 'Ctrl + D', action: 'Duplicate selected' }
    ]
  },
  {
    title: 'View',
    shortcuts: [
      { keys: 'F', action: 'Frame selection' },
      { keys: 'G', action: 'Toggle grid' },
      { keys: 'B', action: 'Toggle bound' },
      { keys: 'Escape', action: 'Deselect all' }
    ]
  },
  {
    title: 'Tools',
    shortcuts: [
      { keys: 'W', action: 'Translate tool' },
      { keys: 'E', action: 'Rotate tool' },
      { keys: 'R', action: 'Scale tool' },
      { keys: 'Q', action: 'Select tool' }
    ]
  }
];

interface ShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} title="Keyboard Shortcuts" size="md">
      <div className={styles.shortcuts}>
        {shortcutGroups.map(group => (
          <div key={group.title} className={styles.group}>
            <h4 className={styles.groupTitle}>{group.title}</h4>
            {group.shortcuts.map(s => (
              <div key={s.keys} className={styles.row}>
                <kbd className={styles.keys}>{s.keys}</kbd>
                <span className={styles.action}>{s.action}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export { ShortcutsDialog };
export type { ShortcutsDialogProps };
