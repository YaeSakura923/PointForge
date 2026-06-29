import React, { useState, useCallback, useRef, useEffect } from 'react';
import { usePlayCanvasBridge } from '../../contexts/PlayCanvasBridge';
import { Button } from '../common/Button/Button';
import { Toolbar, ButtonGroup, ToolbarSeparator } from '../common/Toolbar/Toolbar';

type MenuItem = {
  label: string;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
};

interface MenuDef {
  label: string;
  items: MenuItem[];
}

const TopToolbar: React.FC = () => {
  const bridge = usePlayCanvasBridge();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  const toggleMenu = useCallback((label: string) => {
    setOpenMenu(prev => prev === label ? null : label);
  }, []);

  const fire = bridge.fire;

  const menus: MenuDef[] = [
    {
      label: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', action: () => fire('new') },
        { label: 'Open', shortcut: 'Ctrl+O', action: () => fire('open') },
        { label: '', separator: true },
        { label: 'Save', shortcut: 'Ctrl+S', action: () => fire('save') },
        { label: 'Save As', shortcut: 'Ctrl+Shift+S', action: () => fire('saveAs') },
        { label: '', separator: true },
        { label: 'Export PLY', action: () => fire('exportPly') },
        { label: 'Export SPZ', action: () => fire('exportSpz') },
        { label: 'Export SOG', action: () => fire('exportSog') },
        { label: '', separator: true },
        { label: 'Share / Publish', action: () => fire('publish') }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: () => fire('undo') },
        { label: 'Redo', shortcut: 'Ctrl+Shift+Z', action: () => fire('redo') },
        { label: '', separator: true },
        { label: 'Select All', shortcut: 'Ctrl+A', action: () => fire('selectAll') },
        { label: 'Select None', shortcut: 'Escape', action: () => fire('selectNone') },
        { label: 'Invert Selection', shortcut: 'Ctrl+I', action: () => fire('selectInvert') },
        { label: '', separator: true },
        { label: 'Lock Selected', action: () => fire('lock') },
        { label: 'Unlock All', action: () => fire('unlock') },
        { label: 'Delete Selected', shortcut: 'Delete', action: () => fire('deleteSelected') },
        { label: 'Duplicate Selected', shortcut: 'Ctrl+D', action: () => fire('duplicate') },
        { label: 'Separate Selected', action: () => fire('separate') }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Toggle Grid', action: () => fire('toggleGrid') },
        { label: 'Toggle Bound', action: () => fire('toggleBound') },
        { label: '', separator: true },
        { label: 'Camera: Orbit', action: () => fire('orbitCamera') },
        { label: 'Camera: Fly', action: () => fire('flyCamera') },
        { label: 'Reset Camera', action: () => fire('resetCamera') },
        { label: 'Frame Selection', shortcut: 'F', action: () => fire('frameSelection') },
        { label: '', separator: true },
        { label: 'Centers Mode', action: () => fire('centersMode') },
        { label: 'Rings Mode', action: () => fire('ringsMode') },
        { label: 'Toggle Outline', action: () => fire('toggleOutline') }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Keyboard Shortcuts', shortcut: '?', action: () => fire('showShortcuts') },
        { label: 'User Guide', action: () => fire('openUserGuide') },
        { label: '', separator: true },
        { label: 'About PointForge', action: () => fire('showAbout') }
      ]
    }
  ];

  return (
    <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <span style={{ fontWeight: 700, fontSize: 14, color: '#f26722', marginRight: 12, marginLeft: 8 }}>
        PointForge
      </span>

      {/* Dropdown menus */}
      {menus.map(menu => (
        <div key={menu.label} style={{ position: 'relative' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMenu(menu.label)}
            style={{
              background: openMenu === menu.label ? 'rgba(255,255,255,0.12)' : undefined,
              color: openMenu === menu.label ? '#fff' : '#ccc'
            }}
          >
            {menu.label}
          </Button>
          {openMenu === menu.label && (
            <div style={{
              position: 'absolute', top: '100%', left: 0,
              background: '#222', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, minWidth: 220, padding: '4px 0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 300
            }}>
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 8px' }} />
                ) : (
                  <div
                    key={i}
                    onClick={() => { item.action?.(); setOpenMenu(null); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 16px', cursor: 'pointer',
                      color: '#ccc', fontSize: 13,
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span style={{ color: '#666', fontSize: 11, marginLeft: 24 }}>{item.shortcut}</span>}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}

      <ToolbarSeparator />

      {/* Undo/Redo quick actions */}
      <ButtonGroup>
        <Button variant="ghost" size="sm" onClick={() => fire('undo')} title="Undo (Ctrl+Z)">↩</Button>
        <Button variant="ghost" size="sm" onClick={() => fire('redo')} title="Redo (Ctrl+Shift+Z)">↪</Button>
      </ButtonGroup>
    </div>
  );
};

export { TopToolbar };
