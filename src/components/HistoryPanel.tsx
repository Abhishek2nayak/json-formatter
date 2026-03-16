import { Clock, Trash2, X } from 'lucide-react';
import { useStore } from '../store';
import { formatBytes } from '../utils/json';

export function HistoryPanel() {
  const { theme, history, clearHistory, loadFromHistory, setShowHistory } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`fixed right-0 top-12 bottom-0 w-72 z-40 border-l shadow-2xl flex flex-col animate-slide-in ${
      isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between px-3 py-2 border-b ${
        isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <Clock size={13} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
          <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>History</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? 'bg-[#2a2a2a] text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
            {history.length}/10
          </span>
        </div>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button onClick={clearHistory} className="btn-icon text-red-400 hover:text-red-300">
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={() => setShowHistory(false)} className="btn-icon">
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        {history.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full gap-2 text-sm ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <Clock size={24} />
            <p>No history yet</p>
            <p className="text-xs">Format or paste JSON to start</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => { loadFromHistory(entry.id); setShowHistory(false); }}
                className={`w-full text-left p-2.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`text-xs font-medium truncate mb-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {entry.label}
                </div>
                <div className={`text-xs flex items-center gap-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  <span>{formatBytes(entry.size)}</span>
                  <span>·</span>
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className={`text-xs font-mono mt-1 truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {entry.content.slice(0, 60)}...
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
