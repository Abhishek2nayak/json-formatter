import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { useStore } from '../store';

const shortcuts = [
  { keys: ['Ctrl', 'Shift', 'F'], label: 'Format JSON' },
  { keys: ['Ctrl', 'Shift', 'M'], label: 'Minify JSON' },
  { keys: ['Ctrl', 'Shift', 'V'], label: 'Validate JSON' },
  { keys: ['Ctrl', 'Shift', 'C'], label: 'Copy JSON' },
  { keys: ['Ctrl', 'Shift', 'D'], label: 'Download JSON' },
  { keys: ['Ctrl', 'T'], label: 'Toggle tree view' },
  { keys: ['Ctrl', '/'], label: 'Toggle theme' },
  { keys: ['H'], label: 'Toggle history' },
  { keys: ['?'], label: 'Show shortcuts' },
  { keys: ['Esc'], label: 'Close panels' },
];

export function ShortcutsModal() {
  const { theme, setShowShortcuts } = useStore();
  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => setShowShortcuts(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative rounded-xl border shadow-2xl w-80 overflow-hidden animate-slide-in ${
          isDark ? 'bg-[#1e1e1e] border-[#3d3d3d]' : 'bg-white border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <Keyboard size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            <span className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Keyboard Shortcuts
            </span>
          </div>
          <button onClick={() => setShowShortcuts(false)} className="btn-icon">
            <X size={14} />
          </button>
        </div>
        <div className="p-3 space-y-1">
          {shortcuts.map(({ keys, label }) => (
            <div key={label} className="flex items-center justify-between py-1">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
              <div className="flex items-center gap-1">
                {keys.map((key, i) => (
                  <React.Fragment key={key}>
                    <kbd className={`text-xs px-1.5 py-0.5 rounded border font-mono ${
                      isDark
                        ? 'bg-[#2a2a2a] border-[#3d3d3d] text-gray-300'
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}>
                      {key}
                    </kbd>
                    {i < keys.length - 1 && (
                      <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
