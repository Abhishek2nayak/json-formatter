import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Copy, Check, Minimize2, Maximize2, Home,
  FileText, ChevronRight, AlertCircle, Braces, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type * as Monaco from 'monaco-editor';
import { JSONPath } from 'jsonpath-plus';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { useFullscreen } from '../../hooks/useFullscreen';
import { parseJSON } from '../../utils/json';
import { decodeJsonFromUrl } from '../../utils/share';

const SAMPLE_JSON = `{
  "store": {
    "name": "BookWorld",
    "books": [
      {
        "title": "The Pragmatic Programmer",
        "author": "David Thomas",
        "price": 42.95,
        "category": "programming",
        "inStock": true
      },
      {
        "title": "Clean Code",
        "author": "Robert Martin",
        "price": 35.00,
        "category": "programming",
        "inStock": false
      },
      {
        "title": "Atomic Habits",
        "author": "James Clear",
        "price": 18.99,
        "category": "self-help",
        "inStock": true
      }
    ],
    "location": {
      "city": "London",
      "country": "UK"
    }
  }
}`;

const EXAMPLE_QUERIES = [
  { label: 'All books',          expr: '$.store.books[*]',              desc: 'Get every book object' },
  { label: 'All titles',         expr: '$.store.books[*].title',        desc: 'Get all book titles' },
  { label: 'All prices',         expr: '$.store.books[*].price',        desc: 'Get all prices' },
  { label: 'In-stock books',     expr: '$.store.books[?(@.inStock)]',   desc: 'Filter books in stock' },
  { label: 'Cheap books',        expr: '$.store.books[?(@.price<20)]',  desc: 'Price less than 20' },
  { label: 'First book',         expr: '$.store.books[0]',              desc: 'Get first element' },
  { label: 'All authors',        expr: '$..author',                     desc: 'Deep scan for author' },
  { label: 'Store name',         expr: '$.store.name',                  desc: 'Scalar value' },
  { label: 'City',               expr: '$.store.location.city',         desc: 'Nested property' },
  { label: 'All values (deep)',  expr: '$..*',                          desc: 'Every value recursively' },
];

interface PathResult {
  path: string;
  value: unknown;
  index: number;
}

function getType(val: unknown): string {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

const TYPE_COLORS: Record<string, string> = {
  string:  'text-amber-400',
  number:  'text-brand-400',
  boolean: 'text-violet-400',
  null:    'text-red-400',
  object:  'text-sky-400',
  array:   'text-orange-400',
};

const TYPE_BADGES: Record<string, string> = {
  string:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  number:  'bg-brand-500/10 text-brand-400 border-brand-500/20',
  boolean: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  null:    'bg-red-500/10 text-red-400 border-red-500/20',
  object:  'bg-sky-500/10 text-sky-400 border-sky-500/20',
  array:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

function formatValue(val: unknown): string {
  if (typeof val === 'string') return `"${val}"`;
  if (val === null) return 'null';
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

function ResultCard({
  result, isDark, index,
}: {
  result: PathResult; isDark: boolean; index: number;
}) {
  const [copied, setCopied] = useState(false);
  const type = getType(result.value);
  const colorClass = TYPE_COLORS[type] ?? 'text-gray-400';
  const badgeClass = TYPE_BADGES[type] ?? '';
  const displayVal = formatValue(result.value);

  const copy = () => {
    navigator.clipboard.writeText(displayVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${
      isDark ? 'bg-[#141414] border-[#1e1e1e]' : 'bg-white border-gray-100'
    }`}>
      {/* Card header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${
        isDark ? 'border-[#1e1e1e] bg-[#0f0f0f]' : 'border-gray-100 bg-gray-50'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className={`flex-shrink-0 w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center bg-brand-500/15 text-brand-400`}>
            {index + 1}
          </span>
          <code className={`text-[11px] font-mono truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {result.path}
          </code>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}>{type}</span>
          <button
            onClick={copy}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400'}`}
          >
            {copied ? <Check size={11} className="text-brand-400" /> : <Copy size={11} />}
          </button>
        </div>
      </div>
      {/* Value */}
      <pre className={`px-3 py-2.5 text-xs font-mono overflow-x-auto leading-relaxed ${colorClass}`}
        style={{ maxHeight: '120px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {displayVal}
      </pre>
    </div>
  );
}

export function JsonPathPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { isFullscreen, toggleFullscreen, showHint } = useFullscreen();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  // Pre-load JSON from ?j= param (passed by PathFinderPanel "Open in full explorer")
  const preloaded = (() => {
    const p = new URLSearchParams(window.location.search).get('j');
    if (!p) return null;
    const decoded = decodeJsonFromUrl(p);
    if (decoded) window.history.replaceState({}, '', '/json-path');
    return decoded;
  })();

  const [json, setJson] = useState(preloaded ?? SAMPLE_JSON);
  const [expr, setExpr] = useState('$.*');
  const [results, setResults] = useState<PathResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  const runQuery = useCallback((jsonStr: string, expression: string) => {
    setError(null);
    setParseError(null);
    setResults([]);

    if (!jsonStr.trim() || !expression.trim()) return;

    const { parsed, error: pErr } = parseJSON(jsonStr);
    if (pErr) { setParseError(pErr.message); return; }

    try {
      const raw = JSONPath({ path: expression, json: parsed as object, resultType: 'all' }) as unknown as {
        path: string; value: unknown;
      }[];

      setResults(
        raw.map((r, i) => ({
          path: r.path,
          value: r.value,
          index: i,
        }))
      );

      // Highlight matching lines in Monaco
      highlightMatches(jsonStr, raw.map(r => r.value));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  // Highlight matched values by finding their line numbers in the raw JSON string
  const highlightMatches = (jsonStr: string, values: unknown[]) => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    const lines = jsonStr.split('\n');
    const newDecorations: Monaco.editor.IModelDeltaDecoration[] = [];

    values.forEach(val => {
      const needle = typeof val === 'string'
        ? `"${val}"`
        : val === null ? 'null' : String(val);

      lines.forEach((line, i) => {
        if (line.includes(needle)) {
          const startCol = line.indexOf(needle) + 1;
          newDecorations.push({
            range: new (window as any).monaco.Range(i + 1, startCol, i + 1, startCol + needle.length),
            options: {
              inlineClassName: 'jsonpath-highlight',
              isWholeLine: false,
            },
          });
        }
      });
    });

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  };

  // Run on mount + whenever expr or json changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => runQuery(json, expr), 180);
    return () => clearTimeout(t);
  }, [json, expr, runQuery]);

  const handleCopyAll = () => {
    const out = results.map(r => formatValue(r.value)).join('\n');
    navigator.clipboard.writeText(out);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const isDark_ = isDark;
  const bg = isDark_ ? 'bg-[#0f0f0f] text-gray-200' : 'bg-gray-50 text-gray-900';
  const inputBg = isDark_ ? 'bg-[#141414] border-[#252525] text-gray-200 placeholder-gray-600 focus:border-brand-500/50' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-400';

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${isDark_ ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-white border-gray-200'}`}>
      <div className={`flex items-center gap-2 w-7 h-7 rounded-lg bg-brand-500 justify-center flex-shrink-0`}>
        <Braces size={14} className="text-white" />
      </div>
      <span className={`text-sm font-bold hidden sm:block ${isDark_ ? 'text-white' : 'text-gray-900'}`}>JSONPath Explorer</span>

      <div className={`w-px h-4 hidden sm:block ${isDark_ ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`} />

      <button
        onClick={() => { setJson(SAMPLE_JSON); setExpr('$.store.books[*].title'); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          isDark_ ? 'border-[#252525] text-gray-400 hover:text-gray-200 hover:border-[#3a3a3a]' : 'border-gray-200 text-gray-600 hover:text-gray-900 bg-white'
        }`}
      >
        <FileText size={12} /> Sample
      </button>

      <button
        onClick={() => { setJson(''); setExpr(''); setResults([]); setError(null); setParseError(null); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          isDark_ ? 'border-[#252525] text-gray-400 hover:text-gray-200 hover:border-[#3a3a3a]' : 'border-gray-200 text-gray-600 hover:text-gray-900 bg-white'
        }`}
      >
        <Trash2 size={12} /> Clear
      </button>

      <div className="flex-1" />

      <button
        onClick={toggleFullscreen}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          isDark_ ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600 hover:text-gray-900 bg-white'
        }`}
      >
        {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        <span className="hidden sm:inline">{isFullscreen ? 'Minimize' : 'Fullscreen'}</span>
      </button>

      {isFullscreen && (
        <button
          onClick={() => navigate('/')}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDark_ ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600 bg-white'
          }`}
        >
          <Home size={13} />
        </button>
      )}
    </div>
  );

  const MainContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* JSONPath expression input */}
      <div className={`flex-shrink-0 px-4 py-3 border-b ${isDark_ ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border font-mono text-sm transition-colors ${inputBg}`}>
            <span className={`text-brand-500 font-black text-base leading-none flex-shrink-0`}>$</span>
            <input
              type="text"
              value={expr.startsWith('$') ? expr.slice(1) : expr}
              onChange={e => setExpr('$' + e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') runQuery(json, expr); }}
              placeholder=".store.books[*].title"
              className="flex-1 bg-transparent outline-none min-w-0"
              spellCheck={false}
            />
            {results.length > 0 && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-bold">
                {results.length} {results.length === 1 ? 'match' : 'matches'}
              </span>
            )}
            {error && (
              <span className="flex-shrink-0 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={11} /> Invalid
              </span>
            )}
          </div>
          <button
            onClick={() => runQuery(json, expr)}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
          >
            Run
          </button>
        </div>

        {/* Example queries */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto scrollbar-thin pb-0.5">
          <span className={`text-[10px] font-semibold flex-shrink-0 ${isDark_ ? 'text-gray-600' : 'text-gray-400'}`}>Examples:</span>
          {EXAMPLE_QUERIES.map(q => (
            <button
              key={q.expr}
              onClick={() => setExpr(q.expr)}
              title={q.desc}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all whitespace-nowrap ${
                expr === q.expr
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : isDark_ ? 'bg-[#141414] text-gray-400 hover:text-gray-200 border border-[#1e1e1e] hover:border-[#2a2a2a]' : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor + Results split */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

        {/* Left: JSON editor */}
        <div className={`flex flex-col lg:w-[55%] border-b lg:border-b-0 lg:border-r ${isDark_ ? 'border-[#1e1e1e]' : 'border-gray-200'}`} style={{ minHeight: '240px' }}>
          <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark_ ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
            <span className={`text-xs font-semibold ${isDark_ ? 'text-gray-500' : 'text-gray-500'}`}>JSON Input</span>
            {parseError && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={10} /> {parseError}
              </span>
            )}
            {!parseError && json.trim() && (
              <span className="flex items-center gap-1 text-xs text-brand-400 font-medium">
                <Check size={10} /> Valid JSON
              </span>
            )}
          </div>
          <div className="flex-1" style={{ minHeight: '200px' }}>
            <Editor
              value={json}
              onChange={v => setJson(v ?? '')}
              language="json"
              theme={isDark_ ? 'vs-dark' : 'light'}
              onMount={ed => {
                editorRef.current = ed;
                // Inject highlight CSS into Monaco
                const style = document.createElement('style');
                style.textContent = `.jsonpath-highlight { background: rgba(16,185,129,0.25); border-radius: 2px; }`;
                document.head.appendChild(style);
              }}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
                padding: { top: 8 },
              }}
            />
          </div>
        </div>

        {/* Right: Results */}
        <div className={`flex flex-col lg:w-[45%] overflow-hidden`}>
          {/* Results header */}
          <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark_ ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
            <span className={`text-xs font-semibold ${isDark_ ? 'text-gray-500' : 'text-gray-500'}`}>
              Results
              {results.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-md bg-brand-500/15 text-brand-400 text-[10px] font-bold">
                  {results.length}
                </span>
              )}
            </span>
            {results.length > 0 && (
              <button
                onClick={handleCopyAll}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${isDark_ ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}
              >
                {copiedAll ? <Check size={11} className="text-brand-400" /> : <Copy size={11} />}
                {copiedAll ? 'Copied!' : 'Copy all'}
              </button>
            )}
          </div>

          {/* Results list */}
          <div className={`flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin ${isDark_ ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-400 mb-0.5">Invalid expression</p>
                  <p className="text-xs text-red-300/70 font-mono">{error}</p>
                </div>
              </div>
            )}

            {!error && results.length === 0 && expr.trim() && !parseError && (
              <div className={`flex flex-col items-center justify-center py-12 gap-2 ${isDark_ ? 'text-gray-700' : 'text-gray-400'}`}>
                <Braces size={28} className="opacity-40" />
                <p className="text-xs">No matches for this expression</p>
              </div>
            )}

            {!error && !expr.trim() && (
              <div className={`flex flex-col items-center justify-center py-12 gap-2 ${isDark_ ? 'text-gray-700' : 'text-gray-400'}`}>
                <ChevronRight size={28} className="opacity-40" />
                <p className="text-xs">Enter a JSONPath expression above</p>
              </div>
            )}

            {results.map((r, i) => (
              <ResultCard key={i} result={r} isDark={isDark_} index={i} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        <SEOHead
          title="JSONPath Explorer — Test & Run JSONPath Expressions Online | JsonWorkspace"
          description="Test JSONPath expressions on real JSON. Instantly see matching values with path annotations. Free online JSONPath tester with Monaco Editor."
          canonical="https://jsonworkspace.mythosh.com/json-path"
        />
        {Toolbar}
        <div className="flex-1 overflow-hidden">{MainContent}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <SEOHead
        title="JSONPath Explorer — Test & Run JSONPath Expressions Online | JsonWorkspace"
        description="Test JSONPath expressions on real JSON. Instantly see matching values with path annotations. Free online JSONPath tester with Monaco Editor."
        canonical="https://jsonworkspace.mythosh.com/json-path"
      />
      <SiteNav />

      <main className="flex-1">
        {/* Page header */}
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-6 ${isDark_ ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-100 bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs mb-3">
              <Link to="/" className={`hover:text-brand-400 transition-colors ${isDark_ ? 'text-gray-600' : 'text-gray-400'}`}>Home</Link>
              <ChevronRight size={12} className={isDark_ ? 'text-gray-700' : 'text-gray-300'} />
              <span className="text-brand-500 font-medium">JSONPath Explorer</span>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-black mb-1.5 ${isDark_ ? 'text-white' : 'text-gray-950'}`}>
                  JSONPath Explorer
                </h1>
                <p className={`text-sm ${isDark_ ? 'text-gray-500' : 'text-gray-500'}`}>
                  Write JSONPath expressions and instantly see matching values with path annotations — no setup needed.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-xs font-bold border border-brand-500/20">
                  New
                </span>
                <span className={`text-xs ${isDark_ ? 'text-gray-600' : 'text-gray-400'}`}>Powered by jsonpath-plus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hint bar */}
        {showHint && (
          <div className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 text-xs border-b ${
            isDark_ ? 'bg-brand-600/5 border-brand-600/15 text-brand-400' : 'bg-brand-50 border-brand-200 text-brand-600'
          }`}>
            <span className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <span>Open in fullscreen for the best experience</span>
              <button onClick={toggleFullscreen} className="font-semibold underline ml-4">Go Fullscreen →</button>
            </span>
          </div>
        )}

        {/* Tool area */}
        {Toolbar}
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 py-0 sm:py-4">
          <div
            className={`rounded-none sm:rounded-2xl border overflow-hidden ${isDark_ ? 'border-[#1e1e1e]' : 'border-gray-200'}`}
            style={{ height: 'clamp(480px, 65vh, 680px)' }}
          >
            {MainContent}
          </div>
        </div>

        {/* Quick reference */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className={`text-lg font-black mb-5 ${isDark_ ? 'text-white' : 'text-gray-950'}`}>JSONPath Quick Reference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { syntax: '$',             desc: 'Root element' },
              { syntax: '.',             desc: 'Child operator' },
              { syntax: '..',            desc: 'Recursive descent (deep scan)' },
              { syntax: '*',             desc: 'Wildcard — match all elements' },
              { syntax: '[n]',           desc: 'Array index (0-based)' },
              { syntax: '[start:end]',   desc: 'Array slice' },
              { syntax: '[?(@.key)]',    desc: 'Filter — exists check' },
              { syntax: '[?(@.x > 5)]',  desc: 'Filter — comparison' },
              { syntax: '[?(@.x == "v")]', desc: 'Filter — equality' },
              { syntax: '[-1]',          desc: 'Last element' },
              { syntax: '[0,2,4]',       desc: 'Multiple indexes' },
              { syntax: '$..key',        desc: 'All "key" values anywhere' },
            ].map(item => (
              <div
                key={item.syntax}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  isDark_ ? 'bg-[#141414] border-[#1e1e1e]' : 'bg-white border-gray-100'
                }`}
              >
                <code className={`flex-shrink-0 font-mono text-xs font-bold px-2 py-1 rounded-lg ${
                  isDark_ ? 'bg-brand-500/10 text-brand-400' : 'bg-brand-50 text-brand-600'
                }`}>{item.syntax}</code>
                <span className={`text-xs mt-1 ${isDark_ ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
