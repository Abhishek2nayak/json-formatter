import { useState } from 'react';
import {
  AlertCircle, BarChart2, Navigation, Code2,
  ChevronDown, ChevronUp, Copy, Check, X
} from 'lucide-react';
import { useStore } from '../store';
import { formatBytes } from '../utils/json';
import { generateSnippets } from '../utils/converters';

export function BottomPanel() {
  const {
    theme, errors, isValid, stats, selectedPath, jsonInput,
    bottomPanelTab, setBottomPanelTab,
    isBottomPanelOpen, setBottomPanelOpen,
  } = useStore();

  const isDark = theme === 'dark';
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const snippets = generateSnippets();

  const copySnippet = (label: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const tabs = [
    { id: 'errors' as const, label: 'Problems', icon: <AlertCircle size={12} />, badge: errors.length || null },
    { id: 'stats' as const, label: 'Stats', icon: <BarChart2 size={12} />, badge: null },
    { id: 'path' as const, label: 'JSON Path', icon: <Navigation size={12} />, badge: null },
    { id: 'snippets' as const, label: 'Snippets', icon: <Code2 size={12} />, badge: null },
  ];

  return (
    <div className={`flex-shrink-0 border-t transition-all ${
      isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-gray-200'
    } ${isBottomPanelOpen ? 'h-36' : 'h-8'}`}>
      {/* Tab bar */}
      <div className={`flex items-center h-8 border-b ${
        isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
      }`}>
        <div className="flex items-center flex-1 overflow-x-auto scrollbar-thin">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (bottomPanelTab === tab.id && isBottomPanelOpen) {
                  setBottomPanelOpen(false);
                } else {
                  setBottomPanelTab(tab.id);
                  setBottomPanelOpen(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 h-8 text-xs border-r transition-colors whitespace-nowrap flex-shrink-0 ${
                isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
              } ${
                bottomPanelTab === tab.id && isBottomPanelOpen
                  ? isDark ? 'bg-[#1e1e1e] text-gray-200' : 'bg-gray-100 text-gray-900'
                  : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== null && tab.badge > 0 && (
                <span className="bg-red-500/20 text-red-400 text-xs px-1 rounded-full min-w-[16px] text-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Status bar info */}
        <div className={`flex items-center gap-3 px-3 text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          {jsonInput && (
            <>
              <span>{formatBytes(jsonInput.length)}</span>
              <span>{jsonInput.split('\n').length} lines</span>
            </>
          )}
          <div className={`flex items-center gap-1 ${isValid ? 'text-green-500' : errors.length ? 'text-red-500' : 'text-gray-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-green-500' : errors.length ? 'bg-red-500' : 'bg-gray-600'}`} />
            {isValid ? 'Valid' : errors.length ? 'Invalid' : '—'}
          </div>
        </div>

        <button
          onClick={() => setBottomPanelOpen(!isBottomPanelOpen)}
          className="btn-icon mr-1"
        >
          {isBottomPanelOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
      </div>

      {/* Panel content */}
      {isBottomPanelOpen && (
        <div className="h-[calc(100%-2rem)] overflow-auto scrollbar-thin">
          {bottomPanelTab === 'errors' && (
            <div className="p-2">
              {errors.length === 0 ? (
                <div className={`flex items-center gap-2 text-xs py-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {jsonInput.trim() ? 'No problems detected' : 'No JSON content'}
                </div>
              ) : (
                errors.map((err, i) => (
                  <div key={i} className={`flex items-start gap-2 text-xs py-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    <X size={12} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{err.message}</span>
                      {err.line && (
                        <span className={`ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          Line {err.line}, Col {err.column}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {bottomPanelTab === 'stats' && (
            <div className="p-2">
              {stats ? (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[
                    { label: 'Size', value: formatBytes(stats.size) },
                    { label: 'Keys', value: stats.keys },
                    { label: 'Depth', value: stats.depth },
                    { label: 'Objects', value: stats.objects },
                    { label: 'Arrays', value: stats.arrays },
                    { label: 'Strings', value: stats.strings },
                    { label: 'Numbers', value: stats.numbers },
                    { label: 'Nulls', value: stats.nulls },
                  ].map(stat => (
                    <div key={stat.label} className={`rounded-md p-2 text-center ${
                      isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'
                    }`}>
                      <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-xs py-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Format valid JSON to see stats
                </div>
              )}
            </div>
          )}

          {bottomPanelTab === 'path' && (
            <div className="p-2 flex items-center gap-2">
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Selected path:</span>
              <code className={`text-xs font-mono px-2 py-1 rounded flex-1 ${
                isDark ? 'bg-[#1e1e1e] text-blue-400' : 'bg-gray-100 text-blue-600'
              }`}>
                {selectedPath || '$'}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(selectedPath || '$')}
                className="btn-icon"
              >
                <Copy size={12} />
              </button>
            </div>
          )}

          {bottomPanelTab === 'snippets' && (
            <div className="p-2 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              {snippets.map(snippet => (
                <div key={snippet.label} className={`flex-shrink-0 rounded-md border overflow-hidden ${
                  isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
                }`}>
                  <div className={`flex items-center justify-between px-2 py-1 border-b ${
                    isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {snippet.label}
                    </span>
                    <button
                      onClick={() => copySnippet(snippet.label, snippet.code)}
                      className="btn-icon ml-2"
                    >
                      {copiedSnippet === snippet.label
                        ? <Check size={10} className="text-green-400" />
                        : <Copy size={10} />
                      }
                    </button>
                  </div>
                  <pre className={`text-xs p-2 max-w-xs overflow-hidden font-mono ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {snippet.code.split('\n').slice(0, 2).join('\n')}...
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
