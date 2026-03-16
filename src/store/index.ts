import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// zustand v5 compatible
import type { Theme, ViewMode, IndentSize, JsonError, JsonStats, HistoryEntry, ConvertFormat } from '../types';

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Editor content
  jsonInput: string;
  setJsonInput: (value: string) => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Indent
  indentSize: IndentSize;
  setIndentSize: (size: IndentSize) => void;

  // Validation state
  isValid: boolean;
  errors: JsonError[];
  setValidationResult: (isValid: boolean, errors: JsonError[]) => void;

  // Stats
  stats: JsonStats | null;
  setStats: (stats: JsonStats | null) => void;

  // Selected JSON path
  selectedPath: string;
  setSelectedPath: (path: string) => void;

  // Compare mode
  compareInput: string;
  setCompareInput: (value: string) => void;

  // Convert
  convertFormat: ConvertFormat;
  setConvertFormat: (format: ConvertFormat) => void;

  // History
  history: HistoryEntry[];
  addToHistory: (content: string) => void;
  clearHistory: () => void;
  loadFromHistory: (id: string) => void;

  // UI state
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  bottomPanelTab: 'errors' | 'stats' | 'path' | 'snippets';
  setBottomPanelTab: (tab: 'errors' | 'stats' | 'path' | 'snippets') => void;
  isBottomPanelOpen: boolean;
  setBottomPanelOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      // Editor
      jsonInput: '',
      setJsonInput: (value) => set({ jsonInput: value }),

      // View
      viewMode: 'editor',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Indent
      indentSize: 2,
      setIndentSize: (size) => set({ indentSize: size }),

      // Validation
      isValid: false,
      errors: [],
      setValidationResult: (isValid, errors) => set({ isValid, errors }),

      // Stats
      stats: null,
      setStats: (stats) => set({ stats }),

      // Path
      selectedPath: '$',
      setSelectedPath: (path) => set({ selectedPath: path }),

      // Compare
      compareInput: '',
      setCompareInput: (value) => set({ compareInput: value }),

      // Convert
      convertFormat: 'yaml',
      setConvertFormat: (format) => set({ convertFormat: format }),

      // History
      history: [],
      addToHistory: (content) => {
        if (!content.trim() || content.length < 2) return;
        const entry: HistoryEntry = {
          id: Date.now().toString(),
          content,
          timestamp: Date.now(),
          label: (() => {
            try {
              const parsed = JSON.parse(content);
              const keys = Object.keys(parsed);
              return keys.slice(0, 2).join(', ') || 'JSON';
            } catch {
              return 'JSON';
            }
          })(),
          size: content.length,
        };
        set((state) => ({
          history: [entry, ...state.history.filter(h => h.content !== content)].slice(0, 10),
        }));
      },
      clearHistory: () => set({ history: [] }),
      loadFromHistory: (id) => {
        const entry = get().history.find(h => h.id === id);
        if (entry) set({ jsonInput: entry.content });
      },

      // UI
      showHistory: false,
      setShowHistory: (show) => set({ showHistory: show }),
      showShortcuts: false,
      setShowShortcuts: (show) => set({ showShortcuts: show }),
      bottomPanelTab: 'errors',
      setBottomPanelTab: (tab) => set({ bottomPanelTab: tab }),
      isBottomPanelOpen: true,
      setBottomPanelOpen: (open) => set({ isBottomPanelOpen: open }),
    }),
    {
      name: 'json-formatter-store',
      partialize: (state) => ({
        theme: state.theme,
        history: state.history,
        indentSize: state.indentSize,
      }),
    }
  )
);
