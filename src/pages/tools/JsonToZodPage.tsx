import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Upload, Copy, Download, CheckCircle, AlertCircle,
  FileText, Minimize2, Maximize2, Home, ZoomIn, Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type * as Monaco from 'monaco-editor';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { useFullscreen } from '../../hooks/useFullscreen';
import { jsonToZodSchema } from '../../utils/zodSchema';

const SAMPLE_JSON = JSON.stringify({
  user: {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    active: true,
    score: 9.5,
    roles: ['admin', 'editor'],
    address: { city: 'London', country: 'UK', zip: null },
  },
  metadata: { created_at: '2025-01-15T10:30:00Z', version: 2 },
}, null, 2);

const EDITOR_OPTS = {
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

export function JsonToZodPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { isFullscreen, toggleFullscreen, showHint } = useFullscreen();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputEditorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const convert = (json: string) => {
    const { schema, error: err } = jsonToZodSchema(json);
    setOutput(schema);
    setError(err);
  };

  const handleInput = (val: string | undefined) => {
    const v = val ?? '';
    setInput(v);
    if (v.trim()) convert(v);
    else { setOutput(''); setError(null); }
  };

  const handleSample = () => { setInput(SAMPLE_JSON); convert(SAMPLE_JSON); };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'schema.ts'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const c = ev.target?.result as string; setInput(c); convert(c); };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const bg = isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900';
  const bgBar = isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const textMuted = isDark ? 'text-gray-600' : 'text-gray-400';
  const btnGhost = isDark
    ? 'border-[#3d3d3d] text-gray-400 hover:text-gray-200 hover:border-[#5d5d5d] bg-transparent'
    : 'border-gray-300 text-gray-600 hover:text-gray-900 bg-white';
  const editorTheme = isDark ? 'vs-dark' : 'light';

  const seoHead = (
    <SEOHead
      title="JSON to Zod Schema Generator — Free Online | JsonWorkspace"
      description="Convert any JSON object to a TypeScript Zod schema instantly. Auto-infers types for strings, numbers, booleans, arrays, nested objects, and null. Free and private."
      canonical="https://jsonworkspace.mythosh.com/json-to-zod"
      isToolPage
    />
  );

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${bgBar}`}>
      <input ref={fileInputRef} type="file" accept=".json,.txt" className="hidden" onChange={handleFile} />

      <button onClick={() => fileInputRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Upload size={12} /> Upload JSON
      </button>
      <button onClick={handleSample}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <FileText size={12} /> Sample
      </button>
      <button onClick={() => { setInput(''); setOutput(''); setError(null); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Trash2 size={12} /> Clear
      </button>

      {input.trim() && !error && (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
          <CheckCircle size={11} /> Valid
        </span>
      )}
      {error && (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400">
          <AlertCircle size={11} /> Invalid JSON
        </span>
      )}

      <div className="flex-1" />

      <button
        onClick={() => inputEditorRef.current?.getAction('editor.action.fontZoomReset')?.run()}
        title="Reset zoom"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <ZoomIn size={13} /> Reset Zoom
      </button>
      <button onClick={toggleFullscreen}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        {isFullscreen ? <><Minimize2 size={13} /> Minimize</> : <><Maximize2 size={13} /> Fullscreen</>}
      </button>
      {isFullscreen && (
        <button onClick={() => navigate('/')} title="Back to home"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
          <Home size={13} />
        </button>
      )}
    </div>
  );

  const EditorPanels = (height: string) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      {/* Input */}
      <div className={`flex flex-col border-r ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <div className={`flex items-center justify-between px-3 py-2 border-b text-xs flex-shrink-0 ${isDark ? 'border-[#2d2d2d] text-gray-500' : 'border-gray-200 text-gray-500'}`}>
          <span>JSON Input</span>
          <span>{input.length.toLocaleString()} chars</span>
        </div>
        <div className="flex-1" style={{ height }}>
          <Editor
            value={input}
            onChange={handleInput}
            language="json"
            theme={editorTheme}
            options={EDITOR_OPTS}
            onMount={(ed) => { inputEditorRef.current = ed; }}
          />
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col">
        <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <span className={`text-xs ${textMuted}`}>Zod Schema (TypeScript)</span>
          {output && (
            <div className="flex items-center gap-1">
              <button onClick={handleCopy}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${copied ? 'bg-green-500/20 text-green-400'
                    : isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                <Copy size={11} />{copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                <Download size={11} /> Download .ts
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
                  <p className="text-xs font-medium text-red-400 mb-1">JSON Parse Error</p>
                  <p className="text-xs text-red-300 font-mono">{error}</p>
                </div>
              </div>
            </div>
          ) : output ? (
            <Editor
              value={output}
              language="typescript"
              theme={editorTheme}
              options={{ ...EDITOR_OPTS, readOnly: true }}
            />
          ) : (
            <div className={`flex flex-col items-center justify-center h-full gap-2 ${textMuted}`}>
              <span className="text-2xl opacity-30 font-mono">{'{ z }'}</span>
              <p className="text-xs">Zod schema will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        {seoHead}
        {Toolbar}
        <div className="flex-1 overflow-hidden">
          {EditorPanels('100%')}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      {seoHead}
      <SiteNav />
      <main className="flex-1">
        <div className={`border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          {Toolbar}
          {showHint && (
            <div className={`flex items-center justify-between px-4 py-1.5 border-b text-xs ${isDark ? 'bg-blue-600/5 border-blue-600/15 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              <span>Open in fullscreen for the best experience</span>
              <button onClick={toggleFullscreen} className="font-medium underline whitespace-nowrap ml-4">Go Fullscreen →</button>
            </div>
          )}
          <div style={{ height: '500px' }} className="overflow-hidden">
            {EditorPanels('500px')}
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            JSON to Zod Schema Generator — Free Online
          </h1>
          <p className={`text-base leading-relaxed mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Paste any JSON object and instantly get a ready-to-use TypeScript Zod schema. The generator infers
            <code className="mx-1 px-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5">z.string()</code>,
            <code className="mx-1 px-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5">z.number().int()</code>,
            <code className="mx-1 px-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5">z.boolean()</code>,
            <code className="mx-1 px-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5">z.null()</code>,
            nested <code className="mx-1 px-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5">z.object()</code>,
            and typed <code className="mx-1 px-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5">z.array()</code> — all with correct TypeScript types via <code className="mx-1 px-1 rounded text-xs font-mono bg-gray-100 dark:bg-white/5">z.infer</code>.
            Everything runs in your browser — your data never leaves your device.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              { title: 'Nested objects', desc: 'Deeply nested JSON objects become z.object() schemas recursively.' },
              { title: 'Typed arrays', desc: 'Homogeneous arrays become z.array(z.string()) etc. Mixed arrays use z.union([…]).' },
              { title: 'All primitives', desc: 'Strings, integers, floats, booleans, and null are all inferred correctly.' },
              { title: 'Download as .ts', desc: 'Download the generated schema as a .ts file, ready to drop into any project.' },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-lg border ${isDark ? 'border-[#2d2d2d] bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>

          <section>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {
                  q: 'What is Zod?',
                  a: 'Zod is a TypeScript-first schema validation library. You define a schema once and use it for both runtime validation and static TypeScript type inference — eliminating the need to maintain separate type definitions and validation logic.',
                },
                {
                  q: 'Do I need to install anything?',
                  a: 'The generator outputs plain TypeScript using the Zod library. To use it in your project, install Zod with: npm install zod. No setup is needed to use this online tool.',
                },
                {
                  q: 'Does the generator make all fields required?',
                  a: 'Yes — by default all fields are generated as required (z.string(), z.number(), etc.). To make a field optional in your final schema, add .optional() after the type, e.g. z.string().optional().',
                },
                {
                  q: 'How are mixed arrays handled?',
                  a: 'If an array contains elements of different types, the generator outputs z.array(z.union([...])) with all unique element types included. For uniform arrays, a single typed z.array(z.string()) etc. is used.',
                },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border ${isDark ? 'border-[#2d2d2d] bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.q}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
