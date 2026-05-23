import React, { useRef, useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Upload, Copy, Download, CheckCircle, AlertCircle,
  FileText, Braces, RefreshCw, Minimize2, Maximize2, Home, ZoomIn,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type * as Monaco from 'monaco-editor';
import { SiteNav } from '../components/layout/SiteNav';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/layout/SEOHead';
import { useStore } from '../store';
import { parseJSON, formatJSON, minifyJSON, suggestFix } from '../utils/json';
import { toYAML, toXML, toCSV } from '../utils/converters';
import { useFullscreen } from '../hooks/useFullscreen';
import { SITE_URL } from '../constants';

export type ToolMode = 'format' | 'validate' | 'minify' | 'prettify' | 'to-csv' | 'to-xml' | 'to-yaml';

interface SEOContent {
  h1: string;
  intro: string;
  howTo: { step: string; desc: string }[];
  benefits: string[];
  faq: { question: string; answer: string }[];
  relatedTools: { label: string; href: string }[];
}

interface ToolPageProps {
  mode: ToolMode;
  seo: { title: string; description: string; canonical: string };
  content: SEOContent;
}

const SAMPLE_JSON = `{
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "active": true,
    "roles": ["admin", "editor"],
    "address": { "city": "London", "country": "UK" }
  },
  "metadata": { "created_at": "2025-01-15T10:30:00Z", "version": 2 }
}`;

function processJSON(input: string, mode: ToolMode): { output: string; error: string | null } {
  if (!input.trim()) return { output: '', error: null };
  const { parsed, error } = parseJSON(input);
  if (error) return { output: '', error: error.message };
  try {
    switch (mode) {
      case 'format':
      case 'prettify':   return { output: formatJSON(input, 2), error: null };
      case 'validate':   return { output: '✓ Valid JSON — no errors found.', error: null };
      case 'minify':     return { output: minifyJSON(input), error: null };
      case 'to-yaml':    return { output: toYAML(parsed), error: null };
      case 'to-xml':     return { output: toXML(parsed), error: null };
      case 'to-csv':     return { output: toCSV(parsed), error: null };
      default:           return { output: formatJSON(input, 2), error: null };
    }
  } catch (e) {
    return { output: '', error: (e as Error).message };
  }
}

const ACTION_LABELS: Record<ToolMode, string> = {
  format: 'Format JSON', validate: 'Validate JSON', minify: 'Minify JSON',
  prettify: 'Prettify JSON', 'to-csv': 'Convert to CSV',
  'to-xml': 'Convert to XML', 'to-yaml': 'Convert to YAML',
};

function getOutputLanguage(mode: ToolMode) {
  if (mode === 'to-yaml') return 'yaml';
  if (mode === 'to-xml') return 'xml';
  if (mode === 'to-csv') return 'plaintext';
  return 'json';
}

function getFileExt(mode: ToolMode) {
  if (mode === 'to-yaml') return 'yaml';
  if (mode === 'to-xml') return 'xml';
  if (mode === 'to-csv') return 'csv';
  return 'json';
}

const EDITOR_OPTIONS = {
  fontSize: 13,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  lineNumbers: 'on' as const,
  folding: true,
  automaticLayout: true,
  mouseWheelZoom: true,
  padding: { top: 8 },
};

export function ToolPage({ mode, seo, content }: ToolPageProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputEditorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const [input, setInput]       = useState('');
  const [output, setOutput]     = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);
  const [isValid, setIsValid]   = useState<boolean | null>(null);
  const { isFullscreen, toggleFullscreen, showHint } = useFullscreen();

  // Lock body scroll in fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  // Sync theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const run = useCallback((value: string) => {
    const { output: out, error: err } = processJSON(value, mode);
    setOutput(out);
    setError(err);
    if (value.trim()) setIsValid(!err);
  }, [mode]);

  const handleInput = (val: string | undefined) => {
    const v = val ?? '';
    setInput(v);
    if (v.trim()) run(v);
  };

  const handleSample = () => { setInput(SAMPLE_JSON); run(SAMPLE_JSON); };
  const handleFix    = () => { const f = suggestFix(input); setInput(f); run(f); };
  const handleCopy   = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `output.${getFileExt(mode)}`; a.click();
    URL.revokeObjectURL(url);
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const c = ev.target?.result as string; setInput(c); run(c); };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const editorTheme  = isDark ? 'vs-dark' : 'light';
  const bgPage       = isDark ? 'bg-[#141414]' : 'bg-gray-50';
  const bgBar        = isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const textPrimary  = isDark ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted    = isDark ? 'text-gray-600' : 'text-gray-400';
  const btnGhost     = isDark
    ? 'border-[#3d3d3d] text-gray-400 hover:text-gray-200 hover:border-[#5d5d5d] bg-transparent'
    : 'border-gray-300 text-gray-600 hover:text-gray-900 bg-white';

  // ── Shared toolbar ──────────────────────────────────────────
  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${bgBar}`}>
      <input ref={fileInputRef} type="file" accept=".json,.txt,.yaml,.csv,.xml" className="hidden" onChange={handleFile} />

      <button onClick={() => fileInputRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Upload size={12} /> Upload
      </button>

      <button onClick={handleSample}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <FileText size={12} /> Sample
      </button>

      <button onClick={() => run(input)}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors">
        <Braces size={12} /> {ACTION_LABELS[mode]}
      </button>

      {mode !== 'validate' && (
        <button onClick={handleFix}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            isDark ? 'border-[#3d3d3d] text-yellow-400 hover:text-yellow-300 bg-transparent' : 'border-gray-300 text-yellow-600 bg-white'
          }`}>
          <RefreshCw size={12} /> Fix
        </button>
      )}

      {isValid !== null && input.trim() && (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
          isValid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isValid ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
          {isValid ? 'Valid' : 'Invalid'}
        </span>
      )}

      <div className="flex-1" />

      {/* Reset zoom */}
      <button
        onClick={() => inputEditorRef.current?.getAction('editor.action.fontZoomReset')?.run()}
        title="Reset zoom (Ctrl+0)"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}
      >
        <ZoomIn size={13} /> Reset Zoom
      </button>

      {/* Minimize / Maximize */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Compact view' : 'Fullscreen editor'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}
      >
        {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        {isFullscreen ? 'Minimize' : 'Fullscreen'}
      </button>

      {/* Home — fullscreen only */}
      {isFullscreen && (
        <button
          onClick={() => navigate('/')}
          title="Back to home"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}
        >
          <Home size={13} />
        </button>
      )}
    </div>
  );

  // ── Shared editor panels ────────────────────────────────────
  const EditorPanels = (height: string) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      {/* Input */}
      <div className={`flex flex-col border-r ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <div className={`flex items-center justify-between px-3 py-2 border-b text-xs flex-shrink-0 ${isDark ? 'border-[#2d2d2d] text-gray-500' : 'border-gray-200 text-gray-500'}`}>
          <span>JSON Input</span>
          <span>{input.length.toLocaleString()} chars</span>
        </div>
        <div className="flex-1" style={{ height }}>
          <Editor value={input} onChange={handleInput} language="json"
            theme={editorTheme} options={EDITOR_OPTIONS}
            onMount={(ed) => { inputEditorRef.current = ed; }} />
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col">
        <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <span className={`text-xs ${textMuted}`}>Output</span>
          {output && (
            <div className="flex items-center gap-1">
              <button onClick={handleCopy}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  copied ? 'bg-green-500/20 text-green-400'
                    : isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}>
                <Copy size={11} />{copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}>
                <Download size={11} /> Download
              </button>
            </div>
          )}
        </div>
        <div className="flex-1" style={{ height }}>
          {error ? (
            <div className="p-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-400 mb-1">JSON Error</p>
                  <p className="text-xs text-red-300 font-mono">{error}</p>
                </div>
              </div>
              <button onClick={handleFix}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors">
                <RefreshCw size={11} /> Try Auto Fix
              </button>
            </div>
          ) : output ? (
            <Editor value={output} language={getOutputLanguage(mode)}
              theme={editorTheme} options={{ ...EDITOR_OPTIONS, readOnly: true }} />
          ) : (
            <div className={`flex flex-col items-center justify-center h-full gap-2 ${textMuted}`}>
              <Braces size={24} className="opacity-30" />
              <p className="text-xs">Output will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── SEO meta (always rendered regardless of mode) ────────────
  const Meta = (
    <SEOHead
      title={seo.title}
      description={seo.description}
      canonical={`${SITE_URL}${seo.canonical}`}
      faqSchema={content.faq}
      isToolPage
      breadcrumbs={[
        { name: 'Home', url: `${SITE_URL}/` },
        { name: content.h1, url: `${SITE_URL}${seo.canonical}` },
      ]}
    />
  );

  // ════════════════════════════════════════════════════════════
  // FULLSCREEN MODE — entire viewport, just toolbar + editors
  // ════════════════════════════════════════════════════════════
  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bgPage} ${textPrimary}`}>
        {Meta}
        {Toolbar}
        <div className="flex-1 overflow-hidden">
          {EditorPanels('100%')}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // COMPACT MODE — SiteNav + 500px editors + SEO content + Footer
  // ════════════════════════════════════════════════════════════
  return (
    <div className={`min-h-screen flex flex-col ${bgPage} ${textPrimary}`}>
      {Meta}
      <SiteNav />

      <main className="flex-1">
        {/* Tool UI */}
        <div className={`border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          {Toolbar}
          {showHint && (
            <div className={`flex items-center justify-between px-4 py-1.5 border-b text-xs ${isDark ? 'bg-blue-600/5 border-blue-600/15 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              <span>Open in fullscreen for the best editor experience</span>
              <button onClick={toggleFullscreen} className="font-medium underline whitespace-nowrap ml-4">
                Go Fullscreen →
              </button>
            </div>
          )}
          <div className={`rounded-none border-0 overflow-hidden`} style={{ height: '500px' }}>
            {EditorPanels('500px')}
          </div>
        </div>

        {/* Full editor CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className={`p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDark ? 'bg-blue-600/5 border-blue-600/20' : 'bg-blue-50 border-blue-200'
          }`}>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Need more power?</p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-blue-400/70' : 'text-blue-600'}`}>
                Tree view · Diff compare · Schema generator · 7 conversion formats · History panel
              </p>
            </div>
            <Link to="/app"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap">
              Open Full Editor →
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className={`border-t mt-8 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${textPrimary}`}>{content.h1}</h1>
            <p className={`text-base leading-relaxed mb-10 ${textSecondary}`}>{content.intro}</p>

            <section className="mb-10">
              <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>How to Use</h2>
              <ol className="space-y-3">
                {content.howTo.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>{step.step}</p>
                      <p className={`text-xs mt-0.5 ${textSecondary}`}>{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Benefits</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {content.benefits.map((b, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${textSecondary}`}>
                    <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.faq.map((item, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${isDark ? 'border-[#2d2d2d] bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
                    <h3 className={`text-sm font-semibold mb-1.5 ${textPrimary}`}>{item.question}</h3>
                    <p className={`text-sm ${textSecondary}`}>{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Related Tools</h2>
              <div className="flex flex-wrap gap-2">
                {content.relatedTools.map((t) => (
                  <Link key={t.href} to={t.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      isDark
                        ? 'border-[#3d3d3d] text-gray-400 hover:text-blue-400 hover:border-blue-500/40'
                        : 'border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300'
                    }`}>
                    {t.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
