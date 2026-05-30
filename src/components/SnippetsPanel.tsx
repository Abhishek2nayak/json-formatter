import { useState, useRef, useEffect } from 'react';
import {
  Bookmark, Trash2, Pencil, Check, X, FolderOpen,
  Plus, ChevronRight, Clock,
} from 'lucide-react';
import { useStore } from '../store';

/** Compact save-snippet button that lives in the TopBar */
export function SaveSnippetButton() {
  const { theme, jsonInput, saveSnippet } = useStore();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const save = () => {
    if (!jsonInput.trim()) return;
    saveSnippet(name || `Snippet ${Date.now()}`, jsonInput);
    setName('');
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={!jsonInput.trim()}
        title="Save as snippet"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          open
            ? isDark ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-brand-50 border-brand-300 text-brand-600'
            : isDark ? 'border-[#2a2a2a] text-gray-400 hover:text-gray-200 hover:border-[#3a3a3a]' : 'border-gray-200 text-gray-600 hover:text-gray-900 bg-white'
        }`}
      >
        <Bookmark size={13} />
        <span className="hidden sm:inline">Save</span>
      </button>

      {open && (
        <div className={`absolute top-[calc(100%+8px)] right-0 z-50 w-64 rounded-2xl border shadow-2xl overflow-hidden animate-fade-in ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-100'}`}>
          <div className={`px-3 py-2.5 border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
            <p className={`text-xs font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Save snippet</p>
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setOpen(false); }}
              placeholder="Snippet name (optional)"
              className={`w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
                isDark
                  ? 'bg-[#0a0a0a] border-[#252525] text-gray-200 placeholder-gray-600 focus:border-brand-500/40'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-400'
              }`}
            />
          </div>
          <div className="px-3 py-2 flex gap-2">
            <button
              onClick={save}
              className="flex-1 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setOpen(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isDark ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function sizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

export function SnippetsPanel() {
  const { theme, jsonInput, snippets, saveSnippet, deleteSnippet, renameSnippet, loadSnippet } = useStore();
  const isDark = theme === 'dark';

  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');

  const handleSave = () => {
    if (!jsonInput.trim()) return;
    const name = saveName.trim() || `Snippet ${snippets.length + 1}`;
    saveSnippet(name, jsonInput);
    setSaveName('');
    setSaving(false);
  };

  const startRename = (id: string, current: string) => {
    setRenamingId(id);
    setRenameVal(current);
  };

  const commitRename = (id: string) => {
    if (renameVal.trim()) renameSnippet(id, renameVal.trim());
    setRenamingId(null);
  };

  const border = isDark ? 'border-[#2d2d2d]' : 'border-gray-200';
  const bg = isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#141414] border-[#1e1e1e]' : 'bg-white border-gray-100';
  const muted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const inputClass = isDark
    ? 'bg-[#111] border-[#2a2a2a] text-gray-200 placeholder-gray-600 focus:border-brand-500/40'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-400';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Save bar */}
      <div className={`flex-shrink-0 px-3 pt-3 pb-2.5 border-b ${border} ${bg}`}>
        {saving ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaving(false); }}
              placeholder="Snippet name…"
              className={`flex-1 min-w-0 px-2.5 py-1.5 text-xs rounded-lg border outline-none transition-colors ${inputClass}`}
            />
            <button
              onClick={handleSave}
              disabled={!jsonInput.trim()}
              className="px-2.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={() => setSaving(false)}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSaving(true)}
            disabled={!jsonInput.trim()}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark
                ? 'border-[#2a2a2a] text-gray-500 hover:border-brand-500/40 hover:text-brand-400'
                : 'border-gray-200 text-gray-400 hover:border-brand-400 hover:text-brand-600'
            }`}
          >
            <Plus size={13} /> Save current JSON as snippet
          </button>
        )}
      </div>

      {/* List */}
      <div className={`flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1.5 ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}>
        {snippets.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-10 gap-2 ${muted}`}>
            <Bookmark size={22} className="opacity-30" />
            <p className="text-[11px] text-center leading-relaxed">
              No snippets yet.<br />Save your frequently used JSON here.
            </p>
          </div>
        )}

        {snippets.map(s => (
          <div
            key={s.id}
            className={`group rounded-xl border overflow-hidden transition-all ${cardBg}`}
          >
            {/* Header row */}
            <div className={`flex items-center gap-2 px-2.5 py-2 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
              <Bookmark size={11} className="text-brand-400 flex-shrink-0" />

              {/* Name / rename input */}
              {renamingId === s.id ? (
                <input
                  autoFocus
                  value={renameVal}
                  onChange={e => setRenameVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitRename(s.id);
                    if (e.key === 'Escape') setRenamingId(null);
                  }}
                  onBlur={() => commitRename(s.id)}
                  className={`flex-1 min-w-0 text-xs font-semibold px-1.5 py-0.5 rounded border outline-none ${inputClass}`}
                />
              ) : (
                <span className={`flex-1 min-w-0 text-xs font-semibold truncate ${textPrimary}`}>{s.name}</span>
              )}

              {/* Actions — visible on hover */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {renamingId === s.id ? (
                  <button onClick={() => commitRename(s.id)} className={`p-1 rounded transition-colors ${isDark ? 'text-brand-400 hover:bg-white/10' : 'text-brand-500 hover:bg-gray-100'}`}>
                    <Check size={11} />
                  </button>
                ) : (
                  <button onClick={() => startRename(s.id, s.name)} className={`p-1 rounded transition-colors ${isDark ? 'text-gray-600 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
                    <Pencil size={11} />
                  </button>
                )}
                <button
                  onClick={() => deleteSnippet(s.id)}
                  className={`p-1 rounded transition-colors ${isDark ? 'text-gray-600 hover:text-red-400 hover:bg-white/5' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            {/* Meta + preview */}
            <div className="px-2.5 py-1.5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`flex items-center gap-0.5 text-[10px] ${muted}`}>
                  <Clock size={9} /> {timeAgo(s.createdAt)}
                </span>
                <span className={`text-[10px] ${muted}`}>·</span>
                <span className={`text-[10px] ${muted}`}>{sizeLabel(s.size)}</span>
              </div>
              <pre className={`text-[10px] font-mono leading-relaxed truncate ${muted}`}>
                {s.content.slice(0, 60).replace(/\n/g, ' ')}…
              </pre>
            </div>

            {/* Load button */}
            <button
              onClick={() => loadSnippet(s.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 border-t text-xs font-semibold transition-all ${
                isDark
                  ? 'border-[#1e1e1e] text-gray-600 hover:text-brand-400 hover:bg-brand-500/5'
                  : 'border-gray-100 text-gray-400 hover:text-brand-600 hover:bg-brand-50'
              }`}
            >
              <span className="flex items-center gap-1"><FolderOpen size={11} /> Load into editor</span>
              <ChevronRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
