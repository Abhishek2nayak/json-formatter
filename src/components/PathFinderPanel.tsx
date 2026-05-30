import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, ChevronRight, Braces, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JSONPath } from 'jsonpath-plus';
import { parseJSON } from '../utils/json';
import { useStore } from '../store';
import { encodeJsonForUrl } from '../utils/share';

interface PathResult {
  path: string;
  value: unknown;
}

const QUICK_QUERIES = [
  { label: '$.*',          desc: 'Root keys' },
  { label: '$..*',         desc: 'All values' },
  { label: '$[*]',         desc: 'Array items' },
  { label: '$..id',        desc: 'All IDs' },
  { label: '$..name',      desc: 'All names' },
  { label: '$..email',     desc: 'All emails' },
];

function getType(val: unknown) {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

const TYPE_COLOR: Record<string, string> = {
  string:  'text-amber-400',
  number:  'text-brand-400',
  boolean: 'text-violet-400',
  null:    'text-red-400',
  object:  'text-sky-400',
  array:   'text-orange-400',
};

const TYPE_BADGE: Record<string, string> = {
  string:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  number:  'bg-brand-500/10 text-brand-400 border-brand-500/20',
  boolean: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  null:    'bg-red-500/10 text-red-400 border-red-500/20',
  object:  'bg-sky-500/10 text-sky-400 border-sky-500/20',
  array:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

function formatVal(val: unknown): string {
  if (typeof val === 'string') return `"${val}"`;
  if (val === null) return 'null';
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

interface PathFinderPanelProps {
  /** Pass JSON string directly, or leave undefined to read from store */
  json?: string;
}

export function PathFinderPanel({ json: jsonProp }: PathFinderPanelProps) {
  const { theme, jsonInput } = useStore();
  const isDark = theme === 'dark';
  const json = jsonProp ?? jsonInput;

  const [expr, setExpr] = useState('$.*');
  const [results, setResults] = useState<PathResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [parseErr, setParseErr] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const run = useCallback((expression: string, jsonStr: string) => {
    setError(null);
    setParseErr(null);
    setResults([]);
    if (!expression.trim() || !jsonStr.trim()) return;

    const { parsed, error: pErr } = parseJSON(jsonStr);
    if (pErr) { setParseErr(pErr.message); return; }

    try {
      const raw = JSONPath({ path: expression, json: parsed as object, resultType: 'all' }) as unknown as { path: string; value: unknown }[];
      setResults(raw.map(r => ({ path: r.path, value: r.value })));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => run(expr, json), 150);
    return () => clearTimeout(t);
  }, [expr, json, run]);

  const copyVal = (val: unknown, idx: number) => {
    navigator.clipboard.writeText(formatVal(val));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(results.map(r => r.value), null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const border = isDark ? 'border-[#2d2d2d]' : 'border-gray-200';
  const bg = isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#141414] border-[#222]' : 'bg-white border-gray-100';
  const muted = isDark ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Expression input */}
      <div className={`flex-shrink-0 px-3 pt-3 pb-2 border-b ${border} ${bg}`}>
        <div className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border font-mono text-xs transition-colors ${
          isDark
            ? 'bg-[#111] border-[#2a2a2a] focus-within:border-brand-500/40'
            : 'bg-white border-gray-200 focus-within:border-brand-400'
        }`}>
          <span className="text-brand-500 font-black text-sm leading-none flex-shrink-0">$</span>
          <input
            value={expr.startsWith('$') ? expr.slice(1) : expr}
            onChange={e => setExpr('$' + e.target.value)}
            placeholder=".*"
            className="flex-1 bg-transparent outline-none text-xs min-w-0"
            spellCheck={false}
          />
          {results.length > 0 && (
            <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-400 text-[10px] font-bold">
              {results.length}
            </span>
          )}
        </div>

        {/* Quick query chips */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto scrollbar-thin pb-0.5">
          {QUICK_QUERIES.map(q => (
            <button
              key={q.label}
              onClick={() => setExpr(q.label)}
              title={q.desc}
              className={`flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-mono font-medium border transition-all whitespace-nowrap ${
                expr === q.label
                  ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                  : isDark
                    ? 'bg-[#111] border-[#222] text-gray-500 hover:text-gray-300 hover:border-[#333]'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      {results.length > 0 && (
        <div className={`flex items-center justify-between px-3 py-1.5 border-b flex-shrink-0 ${border} ${bg}`}>
          <span className={`text-[10px] font-semibold ${muted}`}>
            {results.length} match{results.length !== 1 ? 'es' : ''}
          </span>
          <button
            onClick={copyAll}
            className={`flex items-center gap-1 text-[10px] font-semibold transition-colors ${
              copiedAll ? 'text-brand-400' : `${muted} hover:text-brand-400`
            }`}
          >
            {copiedAll ? <><Check size={9} /> Copied</> : <><Copy size={9} /> Copy all</>}
          </button>
        </div>
      )}

      {/* Results list */}
      <div className={`flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1.5 ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}>
        {/* Error states */}
        {parseErr && (
          <div className={`flex items-start gap-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20`}>
            <AlertCircle size={11} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-red-400">Invalid JSON — fix the editor first</p>
          </div>
        )}
        {error && (
          <div className={`flex items-start gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20`}>
            <AlertCircle size={11} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-400 font-mono">{error}</p>
          </div>
        )}

        {/* No matches */}
        {!error && !parseErr && results.length === 0 && expr.trim() && !parseErr && (
          <div className={`flex flex-col items-center justify-center py-8 gap-1.5 ${muted}`}>
            <Braces size={20} className="opacity-30" />
            <p className="text-[11px]">No matches</p>
          </div>
        )}

        {/* Empty expression */}
        {!expr.trim() && (
          <div className={`flex flex-col items-center justify-center py-8 gap-1.5 ${muted}`}>
            <ChevronRight size={20} className="opacity-30" />
            <p className="text-[11px]">Type a JSONPath expression above</p>
          </div>
        )}

        {/* Result cards */}
        {results.map((r, i) => {
          const type = getType(r.value);
          const valStr = formatVal(r.value);
          const isLong = valStr.length > 60 || type === 'object' || type === 'array';

          return (
            <div key={i} className={`rounded-lg border overflow-hidden ${cardBg}`}>
              {/* Path row */}
              <div className={`flex items-center justify-between px-2 py-1.5 border-b ${isDark ? 'bg-[#0f0f0f] border-[#222]' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`flex-shrink-0 w-4 h-4 rounded text-[9px] font-black flex items-center justify-center bg-brand-500/15 text-brand-400`}>
                    {i + 1}
                  </span>
                  <code className={`text-[10px] font-mono truncate ${muted}`}>{r.path}</code>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                  <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${TYPE_BADGE[type] ?? ''}`}>{type}</span>
                  <button
                    onClick={() => copyVal(r.value, i)}
                    className={`p-0.5 rounded transition-colors ${isDark ? 'hover:bg-white/10 text-gray-600 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400'}`}
                  >
                    {copiedIdx === i
                      ? <Check size={9} className="text-brand-400" />
                      : <Copy size={9} />
                    }
                  </button>
                </div>
              </div>

              {/* Value */}
              <div className={`px-2 py-1.5 ${TYPE_COLOR[type] ?? 'text-gray-300'}`}>
                {isLong ? (
                  <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto" style={{ maxHeight: '80px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {valStr}
                  </pre>
                ) : (
                  <span className="text-[11px] font-mono">{valStr}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: link to full explorer — carries current JSON */}
      <div className={`flex-shrink-0 border-t px-3 py-1.5 flex items-center justify-between ${border} ${bg}`}>
        <span className={`text-[10px] ${muted}`}>JSONPath · jsonpath-plus</span>
        <Link
          to={json.trim() ? `/json-path?j=${encodeJsonForUrl(json)}` : '/json-path'}
          className={`flex items-center gap-0.5 text-[10px] font-medium text-brand-400 hover:text-brand-300 transition-colors`}
        >
          Open in full explorer <ExternalLink size={9} />
        </Link>
      </div>
    </div>
  );
}
