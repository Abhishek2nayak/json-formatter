import React, { useState } from 'react';
import {
  Filter, SortAsc, Minimize, Maximize, Search, Copy, Check,
  Trash2, Clock, KeyRound, Lock, Unlock, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useStore } from '../store';
import {
  parseJSON, removeNullValues, removeEmptyValues, sortKeysAlphabetically,
  flattenJSON, unflattenJSON, detectTimestamps, detectDuplicateKeys,
  decodeBase64InJSON, encodeBase64InJSON, filterByRegex
} from '../utils/json';

const SAMPLE_JSON = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": 1710000000,
    "token": "SGVsbG8gV29ybGQ=",
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    }
  },
  "posts": [
    {
      "id": 101,
      "title": "Getting Started with React",
      "tags": ["react", "javascript", "frontend"],
      "published": true,
      "views": 1500,
      "metadata": null
    },
    {
      "id": 102,
      "title": "TypeScript Best Practices",
      "tags": ["typescript", "javascript"],
      "published": false,
      "views": 0,
      "metadata": null
    }
  ],
  "stats": {
    "total_posts": 2,
    "published_count": 1,
    "draft_count": 1
  }
}`;

export function QuickTools() {
  const { theme, jsonInput, setJsonInput } = useStore();
  const isDark = theme === 'dark';
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>('transforms');

  // Regex filter state
  const [regexPattern, setRegexPattern] = useState('');
  const [regexTarget, setRegexTarget] = useState<'keys' | 'values' | 'both'>('both');
  const [regexError, setRegexError] = useState('');

  const { parsed, error } = parseJSON(jsonInput);
  const isValid = !!parsed && !error;

  const transform = (fn: (p: unknown) => unknown) => {
    if (!parsed) return;
    setJsonInput(JSON.stringify(fn(parsed), null, 2));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(key);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleRegexFilter = () => {
    if (!parsed || !regexPattern) return;
    try {
      new RegExp(regexPattern);
      setRegexError('');
      const result = filterByRegex(parsed, regexPattern, regexTarget);
      setJsonInput(JSON.stringify(result, null, 2));
    } catch {
      setRegexError('Invalid regex pattern');
    }
  };

  const duplicates = isValid ? detectDuplicateKeys(jsonInput) : [];
  const timestamps = isValid && parsed ? detectTimestamps(parsed) : [];

  const transforms = [
    { icon: <Filter size={12} />, label: 'Remove nulls', description: 'Remove all null values', action: () => transform(removeNullValues), color: 'text-red-400' },
    { icon: <Trash2 size={12} />, label: 'Remove empty', description: 'Remove empty strings, arrays, objects', action: () => transform(removeEmptyValues), color: 'text-orange-400' },
    { icon: <SortAsc size={12} />, label: 'Sort keys', description: 'Sort keys alphabetically (recursive)', action: () => transform(sortKeysAlphabetically), color: 'text-blue-400' },
    { icon: <Minimize size={12} />, label: 'Flatten', description: 'Flatten nested structure to dot notation', action: () => transform(v => flattenJSON(v)), color: 'text-green-400' },
    { icon: <Maximize size={12} />, label: 'Unflatten', description: 'Restore nested structure from dot notation', action: () => { if (!parsed || typeof parsed !== 'object') return; setJsonInput(JSON.stringify(unflattenJSON(parsed as Record<string, unknown>), null, 2)); }, color: 'text-teal-400' },
    { icon: <Unlock size={12} />, label: 'Decode Base64', description: 'Decode all base64 string values', action: () => transform(decodeBase64InJSON), color: 'text-purple-400' },
    { icon: <Lock size={12} />, label: 'Encode Base64', description: 'Encode all string values to base64', action: () => transform(encodeBase64InJSON), color: 'text-indigo-400' },
    { icon: <RefreshCw size={12} />, label: 'Deep clone', description: 'Stringify and re-parse (normalizes)', action: () => { if (!parsed) return; setJsonInput(JSON.stringify(JSON.parse(JSON.stringify(parsed)), null, 2)); }, color: 'text-cyan-400' },
  ];

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className={`border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
      <button
        onClick={() => setActiveSection(activeSection === id ? null : id)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
          isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <span>{title}</span>
        <span className={`transition-transform ${activeSection === id ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {activeSection === id && <div className="px-3 pb-3">{children}</div>}
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-auto scrollbar-thin">
      {/* Quick Transforms */}
      <Section id="transforms" title="Quick Transforms">
        <div className="grid grid-cols-2 gap-1.5">
          {transforms.map(tool => (
            <button
              key={tool.label}
              onClick={tool.action}
              disabled={!isValid}
              title={tool.description}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-all ${
                isValid
                  ? isDark
                    ? 'bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 border border-[#2d2d2d] hover:border-[#3d3d3d]'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  : isDark
                    ? 'bg-[#1a1a1a] text-gray-600 border border-[#2a2a2a] cursor-not-allowed'
                    : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
            >
              <span className={isValid ? tool.color : ''}>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Regex Filter */}
      <Section id="regex" title="Regex Filter">
        <div className="space-y-2">
          <div className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 ${
            isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
          }`}>
            <Search size={11} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
            <input
              type="text"
              placeholder="e.g. ^user|email$"
              value={regexPattern}
              onChange={e => { setRegexPattern(e.target.value); setRegexError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleRegexFilter()}
              className={`flex-1 text-xs bg-transparent outline-none font-mono ${
                isDark ? 'text-gray-300 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'
              }`}
            />
          </div>
          {regexError && <p className="text-red-400 text-xs">{regexError}</p>}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Search in:</span>
            {(['keys', 'values', 'both'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setRegexTarget(opt)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                  regexTarget === opt
                    ? isDark ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-300 text-blue-600'
                    : isDark ? 'border-[#2d2d2d] text-gray-500' : 'border-gray-200 text-gray-400'
                }`}
              >
                {opt}
              </button>
            ))}
            <button
              onClick={handleRegexFilter}
              disabled={!isValid || !regexPattern}
              className="ml-auto text-xs px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Filter
            </button>
          </div>
        </div>
      </Section>

      {/* Duplicate Key Detector */}
      {isValid && (
        <Section id="duplicates" title={`Duplicate Keys${duplicates.length ? ` (${duplicates.length})` : ''}`}>
          {duplicates.length === 0 ? (
            <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <Check size={12} /> No duplicate keys found
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-yellow-400 mb-2">
                <AlertTriangle size={12} />
                <span>{duplicates.length} duplicate key{duplicates.length > 1 ? 's' : ''} detected</span>
              </div>
              {duplicates.map((d, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-md ${
                  isDark ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <KeyRound size={11} className="text-yellow-400 flex-shrink-0" />
                  <code className={`font-mono flex-1 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    {d.path} → <span className="font-bold">"{d.key}"</span>
                  </code>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Timestamp Detector */}
      {isValid && timestamps.length > 0 && (
        <Section id="timestamps" title={`Timestamps (${timestamps.length})`}>
          <div className="space-y-1.5">
            {timestamps.map((ts, i) => (
              <div key={i} className={`rounded-md p-2 border ${
                isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={11} className="text-cyan-400" />
                  <code className={`text-xs font-mono truncate ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {ts.path}
                  </code>
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className={`font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{ts.unix}</span>
                  {' → '}
                  <span className={`${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>{ts.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* JSON Path Finder */}
      {isValid && (
        <Section id="paths" title="JSON Path Finder">
          <PathFinder parsed={parsed} isDark={isDark} onCopy={handleCopy} copiedPath={copiedPath} />
        </Section>
      )}

      {/* Load sample */}
      {!jsonInput.trim() && (
        <div className="px-3 py-2">
          <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Sample Data
          </div>
          <button
            onClick={() => setJsonInput(SAMPLE_JSON)}
            className={`w-full text-xs px-3 py-2 rounded-lg border transition-all ${
              isDark
                ? 'bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 border-[#2d2d2d]'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            Load Sample JSON
          </button>
        </div>
      )}
    </div>
  );
}

function PathFinder({
  parsed, isDark, onCopy, copiedPath
}: {
  parsed: unknown;
  isDark: boolean;
  onCopy: (text: string, key: string) => void;
  copiedPath: string | null;
}) {
  const [search, setSearch] = useState('');

  const paths = React.useMemo(() => {
    const result: string[] = [];
    function traverse(value: unknown, path: string) {
      result.push(path);
      if (Array.isArray(value)) {
        value.slice(0, 5).forEach((v, i) => traverse(v, `${path}[${i}]`));
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value as object).slice(0, 10).forEach(([k, v]) => {
          traverse(v, `${path}.${k}`);
        });
      }
    }
    traverse(parsed, '$');
    return result;
  }, [parsed]);

  const filtered = search
    ? paths.filter(p => p.toLowerCase().includes(search.toLowerCase()))
    : paths.slice(0, 20);

  return (
    <div>
      <div className={`flex items-center gap-1.5 mb-1.5 rounded-md border px-2 py-1 ${
        isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
      }`}>
        <Search size={11} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
        <input
          type="text"
          placeholder="Filter paths..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`flex-1 text-xs bg-transparent outline-none ${
            isDark ? 'text-gray-300 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'
          }`}
        />
      </div>
      <div className="space-y-0.5 max-h-40 overflow-y-auto scrollbar-thin">
        {filtered.map(path => (
          <div key={path} className={`group flex items-center justify-between gap-2 px-2 py-1 rounded text-xs font-mono hover:bg-white/5 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>
            <span className="truncate">{path}</span>
            <button
              onClick={() => onCopy(path, path)}
              className={`opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {copiedPath === path ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
