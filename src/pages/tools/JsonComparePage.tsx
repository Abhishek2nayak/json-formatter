import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Upload, Minimize2, Maximize2, RefreshCw, FileText, Plus, Minus, AlertCircle, CheckCircle2, Home, ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { parseJSON, formatJSON, diffJSON } from '../../utils/json';
import type * as Monaco from 'monaco-editor';

const SAMPLE_LEFT = JSON.stringify({
  user: { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', active: true },
  version: 1,
  tags: ['json', 'api'],
}, null, 2);

const SAMPLE_RIGHT = JSON.stringify({
  user: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'editor', active: false, phone: '+1234567890' },
  version: 2,
  tags: ['json', 'api', 'v2'],
  updatedAt: '2025-01-15T10:30:00Z',
}, null, 2);

export function JsonComparePage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [left, setLeft]               = useState('');
  const [right, setRight]             = useState('');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [leftError, setLeftError]     = useState<string | null>(null);
  const [rightError, setRightError]   = useState<string | null>(null);
  const leftFileRef  = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);
  const leftEditorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const validateSide = (val: string, set: (e: string | null) => void) => {
    if (!val.trim()) { set(null); return; }
    const { error } = parseJSON(val);
    set(error ? error.message : null);
  };

  const handleLeft  = (val: string | undefined) => { const v = val ?? ''; setLeft(v); validateSide(v, setLeftError); };
  const handleRight = (val: string | undefined) => { const v = val ?? ''; setRight(v); validateSide(v, setRightError); };

  const formatBoth = () => {
    if (!leftError && left.trim()) { const f = formatJSON(left, 2); setLeft(f); }
    if (!rightError && right.trim()) { const f = formatJSON(right, 2); setRight(f); }
  };

  const loadSample = () => { setLeft(SAMPLE_LEFT); setRight(SAMPLE_RIGHT); setLeftError(null); setRightError(null); };

  const uploadFile = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const txt = ev.target?.result as string;
      if (side === 'left') { setLeft(txt); validateSide(txt, setLeftError); }
      else { setRight(txt); validateSide(txt, setRightError); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Semantic diff
  const diff = (() => {
    const l = parseJSON(left); const r = parseJSON(right);
    if (l.error || r.error || !left.trim() || !right.trim()) return null;
    return diffJSON(l.parsed, r.parsed);
  })();

  const totalChanges = diff ? diff.added.length + diff.removed.length + diff.modified.length : 0;
  const identical = diff && totalChanges === 0;

  const bg    = isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900';
  const bgBar = isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const btnGhost = isDark
    ? 'border-[#3d3d3d] text-gray-400 hover:text-gray-200 hover:border-[#5d5d5d] bg-transparent'
    : 'border-gray-300 text-gray-600 hover:text-gray-900 bg-white';
  const editorTheme = isDark ? 'vs-dark' : 'light';

  const EDITOR_OPTS = {
    fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false,
    wordWrap: 'on' as const, lineNumbers: 'on' as const, folding: true,
    automaticLayout: true, mouseWheelZoom: true, padding: { top: 8 },
  };

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${bgBar}`}>
      <input ref={leftFileRef}  type="file" accept=".json,.txt" className="hidden" onChange={e => uploadFile('left', e)} />
      <input ref={rightFileRef} type="file" accept=".json,.txt" className="hidden" onChange={e => uploadFile('right', e)} />

      <button onClick={() => leftFileRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Upload size={12} /> Upload Left
      </button>
      <button onClick={() => rightFileRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Upload size={12} /> Upload Right
      </button>
      <button onClick={formatBoth}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <RefreshCw size={12} /> Format Both
      </button>
      <button onClick={loadSample}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <FileText size={12} /> Sample
      </button>

      {/* diff badges */}
      {diff && (
        <div className="flex items-center gap-1.5">
          {identical ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
              <CheckCircle2 size={11} /> Identical
            </span>
          ) : (
            <>
              {diff.added.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
                  <Plus size={11} /> {diff.added.length} added
                </span>
              )}
              {diff.removed.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400">
                  <Minus size={11} /> {diff.removed.length} removed
                </span>
              )}
              {diff.modified.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400">
                  ± {diff.modified.length} modified
                </span>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex-1" />

      <button
        onClick={() => leftEditorRef.current?.getAction('editor.action.fontZoomReset')?.run()}
        title="Reset zoom"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <ZoomIn size={13} /> Reset Zoom
      </button>
      <button onClick={() => setIsFullscreen(f => !f)}
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
      {/* Left */}
      <div className={`flex flex-col border-r ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <div className={`flex items-center justify-between px-3 py-1.5 border-b flex-shrink-0 text-xs ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Original (Left)</span>
          {leftError
            ? <span className="flex items-center gap-1 text-red-400"><AlertCircle size={10} /> Invalid JSON</span>
            : left.trim() ? <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Valid</span> : null}
        </div>
        <div className="flex-1" style={{ height }}>
          <Editor value={left} onChange={handleLeft} language="json" theme={editorTheme} options={EDITOR_OPTS}
            onMount={(ed) => { leftEditorRef.current = ed; }} />
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col">
        <div className={`flex items-center justify-between px-3 py-1.5 border-b flex-shrink-0 text-xs ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Modified (Right)</span>
          {rightError
            ? <span className="flex items-center gap-1 text-red-400"><AlertCircle size={10} /> Invalid JSON</span>
            : right.trim() ? <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Valid</span> : null}
        </div>
        <div className="flex-1" style={{ height }}>
          <Editor value={right} onChange={handleRight} language="json" theme={editorTheme} options={EDITOR_OPTS} />
        </div>
      </div>
    </div>
  );

  const DiffResults = () => {
    if (!left.trim() || !right.trim()) return null;
    if (leftError || rightError) return (
      <div className={`p-4 text-xs text-red-400 ${isDark ? 'border-t border-[#2d2d2d]' : 'border-t border-gray-200'}`}>
        Fix JSON errors in both panels to see diff results.
      </div>
    );
    if (!diff) return null;
    if (identical) return (
      <div className={`px-4 py-3 text-xs flex items-center gap-2 border-t ${isDark ? 'border-[#2d2d2d] text-green-400' : 'border-gray-200 text-green-600'}`}>
        <CheckCircle2 size={13} /> Both JSONs are identical — no differences found.
      </div>
    );
    return (
      <div className={`border-t px-4 py-3 flex flex-wrap gap-4 overflow-auto ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`} style={{ maxHeight: '180px' }}>
        {diff.added.length > 0 && (
          <div className="min-w-[160px]">
            <p className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-1"><Plus size={11}/> Added ({diff.added.length})</p>
            {diff.added.map(k => <p key={k} className="text-xs font-mono text-green-400/80 truncate">{k}</p>)}
          </div>
        )}
        {diff.removed.length > 0 && (
          <div className="min-w-[160px]">
            <p className="text-xs font-semibold text-red-400 mb-1 flex items-center gap-1"><Minus size={11}/> Removed ({diff.removed.length})</p>
            {diff.removed.map(k => <p key={k} className="text-xs font-mono text-red-400/80 truncate">{k}</p>)}
          </div>
        )}
        {diff.modified.length > 0 && (
          <div className="min-w-[160px]">
            <p className="text-xs font-semibold text-yellow-400 mb-1">± Modified ({diff.modified.length})</p>
            {diff.modified.map(k => <p key={k} className="text-xs font-mono text-yellow-400/80 truncate">{k}</p>)}
          </div>
        )}
      </div>
    );
  };

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        <SEOHead title="JSON Compare — Side-by-Side JSON Diff | JsonMaster" description="Compare two JSON files side by side. Instantly see added, removed, and modified keys with JsonMaster's free JSON compare tool." canonical="https://jsonmaster.dev/json-compare" />
        {Toolbar}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            {EditorPanels('100%')}
          </div>
          <DiffResults />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <SEOHead title="JSON Compare — Side-by-Side JSON Diff | JsonMaster" description="Compare two JSON files side by side. Instantly see added, removed, and modified keys with JsonMaster's free JSON compare tool." canonical="https://jsonmaster.dev/json-compare" />
      <SiteNav />
      <main className="flex-1">
        <div className={`border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          {Toolbar}
          <div style={{ height: '480px' }} className="overflow-hidden">
            {EditorPanels('480px')}
          </div>
          <DiffResults />
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            JSON Compare — Free Online JSON Diff Tool
          </h1>
          <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Compare two JSON objects side by side and instantly see every difference — added keys, removed fields, and modified values. All processing happens in your browser, so your data never leaves your device.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: <Plus size={14} className="text-green-400" />, title: 'Added keys', desc: 'Keys present in the right JSON but missing from the left.' },
              { icon: <Minus size={14} className="text-red-400" />, title: 'Removed keys', desc: 'Keys present in the left JSON that were deleted in the right.' },
              { icon: <span className="text-yellow-400 text-xs font-bold">±</span>, title: 'Modified values', desc: 'Keys present in both JSONs but with different values.' },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-lg border ${isDark ? 'border-[#2d2d2d] bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">{item.icon}<span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</span></div>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
