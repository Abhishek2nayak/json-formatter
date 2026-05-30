import { useState, useEffect, useMemo, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Copy, Check, Download, FileText, Braces,
  ChevronRight, Minimize2, Maximize2, Home, Pencil,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { useFullscreen } from '../../hooks/useFullscreen';
import { parseJSON } from '../../utils/json';
import { generateCode, CODE_TARGETS, type CodeTarget } from '../../utils/codeGenerators';
import { ShareButton } from '../../components/ShareButton';

const SAMPLE_JSON = `{
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 30,
    "active": true,
    "score": 9.5,
    "roles": ["admin", "editor"],
    "address": {
      "street": "123 Main St",
      "city": "London",
      "country": "UK",
      "zipCode": "EC1A 1BB"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}`;

const TARGET_COLORS: Record<CodeTarget, string> = {
  typescript: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  python:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  go:         'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  sql:        'bg-orange-500/15 text-orange-400 border-orange-500/30',
  rust:       'bg-rose-500/15 text-rose-400 border-rose-500/30',
  csharp:     'bg-violet-500/15 text-violet-400 border-violet-500/30',
};

export function JsonToCodePage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [json, setJson] = useState(SAMPLE_JSON);
  const [target, setTarget] = useState<CodeTarget>('typescript');
  const [rootName, setRootName] = useState('Root');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('Root');
  const [copied, setCopied] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  const { parsed, error } = useMemo(() => parseJSON(json), [json]);

  const output = useMemo(() => {
    if (!parsed) return '';
    return generateCode(parsed, target, rootName);
  }, [parsed, target, rootName]);

  const currentTarget = CODE_TARGETS.find(t => t.id === target)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rootName.toLowerCase()}.${currentTarget.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const submitName = () => {
    const trimmed = nameInput.trim().replace(/\s+/g, '');
    if (trimmed) setRootName(trimmed || 'Root');
    setEditingName(false);
  };

  const bg = isDark ? 'bg-[#0f0f0f] text-gray-200' : 'bg-white text-gray-900';

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-white border-gray-200'}`}>
      <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
        <Braces size={13} className="text-brand-400" />
      </div>
      <span className={`text-xs font-bold hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>JSON → Code</span>

      <div className={`w-px h-4 hidden sm:block ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`} />

      <button
        onClick={() => setJson(SAMPLE_JSON)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          isDark ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600 hover:text-gray-900 bg-white'
        }`}
      >
        <FileText size={12} /> Sample
      </button>

      {/* Root name editor */}
      <div className="flex items-center gap-1">
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Root:</span>
        {editingName ? (
          <input
            ref={nameRef}
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onBlur={submitName}
            onKeyDown={e => { if (e.key === 'Enter') submitName(); if (e.key === 'Escape') setEditingName(false); }}
            className={`w-24 px-2 py-1 text-xs font-mono rounded-lg border outline-none ${
              isDark ? 'bg-[#1a1a1a] border-brand-500/40 text-white' : 'bg-white border-brand-400 text-gray-900'
            }`}
          />
        ) : (
          <button
            onClick={() => { setNameInput(rootName); setEditingName(true); }}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-semibold border transition-colors ${
              isDark ? 'border-[#1e1e1e] text-brand-400 hover:border-[#2a2a2a]' : 'border-gray-200 text-brand-600 hover:border-gray-300'
            }`}
          >
            {rootName} <Pencil size={10} />
          </button>
        )}
      </div>

      <ShareButton json={json} basePath="/json-to-code" />

      <div className="flex-1" />

      <button onClick={toggleFullscreen}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          isDark ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600 bg-white'
        }`}>
        {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        <span className="hidden sm:inline">{isFullscreen ? 'Minimize' : 'Fullscreen'}</span>
      </button>

      {isFullscreen && (
        <button onClick={() => navigate('/')}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDark ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600 bg-white'
          }`}>
          <Home size={13} />
        </button>
      )}
    </div>
  );

  const MainContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Language tabs */}
      <div className={`flex items-center gap-1 px-3 py-2 border-b flex-shrink-0 overflow-x-auto scrollbar-thin ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-gray-50 border-gray-200'}`}>
        {CODE_TARGETS.map(t => (
          <button
            key={t.id}
            onClick={() => setTarget(t.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
              target === t.id
                ? TARGET_COLORS[t.id]
                : isDark ? 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Split: JSON input | Code output */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

        {/* Left: JSON */}
        <div className={`flex flex-col lg:w-[45%] border-b lg:border-b-0 lg:border-r ${isDark ? 'border-[#1e1e1e]' : 'border-gray-200'}`} style={{ minHeight: '200px' }}>
          <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
            <span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>JSON Input</span>
            {error && <span className="text-xs text-red-400">{error.message}</span>}
            {!error && json.trim() && <span className="text-xs text-brand-400">✓ Valid</span>}
          </div>
          <div className="flex-1">
            <Editor
              value={json}
              onChange={v => setJson(v ?? '')}
              language="json"
              theme={isDark ? 'vs-dark' : 'light'}
              options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', automaticLayout: true, padding: { top: 8 } }}
            />
          </div>
        </div>

        {/* Right: Generated code */}
        <div className="flex flex-col lg:w-[55%]">
          <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {currentTarget.label} Output
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TARGET_COLORS[target]}`}>
                .{currentTarget.ext}
              </span>
            </div>
            {output && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    copied
                      ? 'bg-brand-500/20 text-brand-400'
                      : isDark ? 'text-gray-500 hover:text-gray-200 hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
                <button
                  onClick={handleDownload}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isDark ? 'text-gray-500 hover:text-gray-200 hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <Download size={11} /> Download
                </button>
              </div>
            )}
          </div>
          <div className="flex-1">
            <Editor
              value={output || (error ? `// Fix the JSON error to generate code` : `// Paste JSON on the left to generate ${currentTarget.label} code`)}
              language={currentTarget.monacoLang}
              theme={isDark ? 'vs-dark' : 'light'}
              options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', readOnly: true, automaticLayout: true, padding: { top: 8 } }}
            />
          </div>
        </div>

      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        <SEOHead title="JSON to Code Generator — TypeScript, Python, Go, SQL | JsonWorkspace" description="Generate TypeScript interfaces, Python dataclasses, Go structs, SQL tables, Rust structs, and C# classes from any JSON. Free online code generator." canonical="https://jsonworkspace.mythosh.com/json-to-code" />
        {Toolbar}
        <div className="flex-1 overflow-hidden">{MainContent}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <SEOHead title="JSON to Code Generator — TypeScript, Python, Go, SQL | JsonWorkspace" description="Generate TypeScript interfaces, Python dataclasses, Go structs, SQL tables, Rust structs, and C# classes from any JSON. Free online code generator." canonical="https://jsonworkspace.mythosh.com/json-to-code" />
      <SiteNav />

      <main className="flex-1">
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-6 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-100 bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs mb-3">
              <Link to="/" className={`hover:text-brand-400 transition-colors ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Home</Link>
              <ChevronRight size={12} className={isDark ? 'text-gray-700' : 'text-gray-300'} />
              <span className="text-brand-500 font-medium">JSON → Code Generator</span>
            </div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-black mb-1.5 ${isDark ? 'text-white' : 'text-gray-950'}`}>JSON → Code Generator</h1>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Paste any JSON and instantly get typed code — interfaces, structs, classes, SQL tables.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {CODE_TARGETS.map(t => (
                  <span key={t.id} className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${TARGET_COLORS[t.id]}`}>{t.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {Toolbar}

        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 py-0 sm:py-4">
          <div className={`rounded-none sm:rounded-2xl border overflow-hidden ${isDark ? 'border-[#1e1e1e]' : 'border-gray-200'}`}
            style={{ height: 'clamp(480px, 65vh, 700px)' }}>
            {MainContent}
          </div>
        </div>

        {/* What gets generated */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className={`text-lg font-black mb-5 ${isDark ? 'text-white' : 'text-gray-950'}`}>Supported targets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { lang: 'TypeScript', out: 'export interface + nested interfaces', ext: '.ts', color: TARGET_COLORS.typescript },
              { lang: 'Python',     out: '@dataclass with type hints + Optional', ext: '.py', color: TARGET_COLORS.python },
              { lang: 'Go',         out: 'struct with json:"" tags',              ext: '.go', color: TARGET_COLORS.go },
              { lang: 'SQL',        out: 'CREATE TABLE with inferred column types', ext: '.sql', color: TARGET_COLORS.sql },
              { lang: 'Rust',       out: '#[derive(Serialize, Deserialize)] struct', ext: '.rs', color: TARGET_COLORS.rust },
              { lang: 'C#',         out: 'public class with [JsonProperty] attrs', ext: '.cs', color: TARGET_COLORS.csharp },
            ].map(item => (
              <div key={item.lang} className={`flex items-start gap-3 p-4 rounded-xl border ${isDark ? 'bg-[#141414] border-[#1e1e1e]' : 'bg-white border-gray-100'}`}>
                <span className={`flex-shrink-0 text-[10px] font-black px-2 py-1 rounded-lg border ${item.color}`}>{item.ext}</span>
                <div>
                  <p className={`text-xs font-bold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.lang}</p>
                  <p className={`text-[11px] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{item.out}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
