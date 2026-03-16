import React, { useState } from 'react';
import {
  Filter, SortAsc, Minimize, Maximize, Search, Copy, Check
} from 'lucide-react';
import { useStore } from '../store';
import { parseJSON, removeNullValues, sortKeysAlphabetically, flattenJSON, unflattenJSON } from '../utils/json';

const SAMPLE_JSON = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
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

  const transform = (fn: (parsed: unknown) => unknown) => {
    const { parsed, error } = parseJSON(jsonInput);
    if (error || !parsed) return;
    setJsonInput(JSON.stringify(fn(parsed), null, 2));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(key);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const tools = [
    {
      icon: <Filter size={13} />,
      label: 'Remove nulls',
      description: 'Remove all null values',
      action: () => transform(removeNullValues),
    },
    {
      icon: <SortAsc size={13} />,
      label: 'Sort keys',
      description: 'Sort keys alphabetically',
      action: () => transform(sortKeysAlphabetically),
    },
    {
      icon: <Minimize size={13} />,
      label: 'Flatten',
      description: 'Flatten nested structure',
      action: () => transform(v => flattenJSON(v)),
    },
    {
      icon: <Maximize size={13} />,
      label: 'Unflatten',
      description: 'Restore nested structure',
      action: () => {
        const { parsed, error } = parseJSON(jsonInput);
        if (error || !parsed || typeof parsed !== 'object') return;
        setJsonInput(JSON.stringify(unflattenJSON(parsed as Record<string, unknown>), null, 2));
      },
    },
  ];

  const { parsed } = parseJSON(jsonInput);
  const isValid = !!parsed;

  return (
    <div className="flex flex-col h-full overflow-auto scrollbar-thin">
      {/* Quick transformations */}
      <div className={`px-3 py-2 border-b flex-shrink-0 ${
        isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
      }`}>
        <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Quick Transforms
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {tools.map(tool => (
            <button
              key={tool.label}
              onClick={tool.action}
              disabled={!isValid}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-all ${
                isValid
                  ? isDark
                    ? 'bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 border border-[#2d2d2d] hover:border-[#3d3d3d]'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  : isDark
                    ? 'bg-[#1a1a1a] text-gray-600 border border-[#2a2a2a] cursor-not-allowed'
                    : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
              title={tool.description}
            >
              <span className={isValid ? (isDark ? 'text-blue-400' : 'text-blue-600') : ''}>
                {tool.icon}
              </span>
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* JSON Path Finder */}
      {isValid && (
        <div className={`px-3 py-2 border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            JSON Path Finder
          </div>
          <PathFinder parsed={parsed} isDark={isDark} onCopy={handleCopy} copiedPath={copiedPath} />
        </div>
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
    : paths.slice(0, 15);

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
