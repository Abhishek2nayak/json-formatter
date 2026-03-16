import { useEffect } from 'react';
import { useStore } from '../store';
import { formatJSON, minifyJSON, parseJSON, getJSONStats } from '../utils/json';

export function useKeyboardShortcuts() {
  const store = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // Ctrl+Shift+F: Format
      if (ctrl && shift && e.key === 'F') {
        e.preventDefault();
        const formatted = formatJSON(store.jsonInput, store.indentSize === 'tab' ? '\t' : store.indentSize);
        store.setJsonInput(formatted);
        const { parsed, error } = parseJSON(formatted);
        if (error) store.setValidationResult(false, [error]);
        else { store.setValidationResult(true, []); store.setStats(getJSONStats(parsed)); }
        return;
      }

      // Ctrl+Shift+M: Minify
      if (ctrl && shift && e.key === 'M') {
        e.preventDefault();
        const minified = minifyJSON(store.jsonInput);
        store.setJsonInput(minified);
        return;
      }

      // Ctrl+Shift+V: Validate
      if (ctrl && shift && e.key === 'V') {
        e.preventDefault();
        const { parsed, error } = parseJSON(store.jsonInput);
        if (error) store.setValidationResult(false, [error]);
        else { store.setValidationResult(true, []); store.setStats(getJSONStats(parsed)); }
        return;
      }

      // Ctrl+Shift+C: Copy
      if (ctrl && shift && e.key === 'C') {
        e.preventDefault();
        navigator.clipboard.writeText(store.jsonInput);
        return;
      }

      // Ctrl+T: Toggle tree
      if (ctrl && e.key === 't') {
        e.preventDefault();
        store.setViewMode(store.viewMode === 'tree' ? 'editor' : 'tree');
        return;
      }

      // Ctrl+/: Toggle theme
      if (ctrl && e.key === '/') {
        e.preventDefault();
        store.toggleTheme();
        return;
      }

      // No modifier keys
      if (!ctrl && !shift && !e.altKey) {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (isInput) return;

        // H: History
        if (e.key === 'h' || e.key === 'H') {
          store.setShowHistory(!store.showHistory);
          return;
        }

        // ?: Shortcuts
        if (e.key === '?') {
          store.setShowShortcuts(!store.showShortcuts);
          return;
        }

        // Esc: Close panels
        if (e.key === 'Escape') {
          store.setShowHistory(false);
          store.setShowShortcuts(false);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);
}
