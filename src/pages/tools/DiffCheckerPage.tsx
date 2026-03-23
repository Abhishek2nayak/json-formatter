import { useState, useEffect, useRef } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import {
  Upload, Minimize2, Maximize2, FileText, Trash2,
  Plus, Minus, ChevronDown, Home, ZoomIn,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';

const LANGUAGES = [
  { label: 'Text',       value: 'plaintext' },
  { label: 'JSON',       value: 'json' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'HTML',       value: 'html' },
  { label: 'CSS',        value: 'css' },
  { label: 'Python',     value: 'python' },
  { label: 'YAML',       value: 'yaml' },
  { label: 'XML',        value: 'xml' },
  { label: 'Markdown',   value: 'markdown' },
  { label: 'SQL',        value: 'sql' },
  { label: 'Bash',       value: 'shell' },
];

const SAMPLE_ORIGINAL = `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}

const users = ["Alice", "Bob", "Charlie"];
users.forEach(user => greet(user));`;

const SAMPLE_MODIFIED = `function greet(name, greeting = "Hello") {
  const message = \`\${greeting}, \${name}!\`;
  console.log(message);
  return message;
}

const users = ["Alice", "Bob", "Charlie", "Diana"];
users.forEach(user => greet(user));

// New: export for module use
export { greet };`;

function computeStats(original: string, modified: string) {
  const oLines = original ? original.split('\n') : [];
  const mLines = modified ? modified.split('\n') : [];
  let added = 0, removed = 0;
  const maxLen = Math.max(oLines.length, mLines.length);
  for (let i = 0; i < maxLen; i++) {
    if (i >= oLines.length) added++;
    else if (i >= mLines.length) removed++;
    else if (oLines[i] !== mLines[i]) { added++; removed++; }
  }
  return { added, removed, oLines: oLines.length, mLines: mLines.length };
}

export function DiffCheckerPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // ── Content stored in refs — never passed back as props to DiffEditor ──
  // This prevents the cursor-jump bug caused by React re-renders triggering
  // model.setValue() inside Monaco when controlled props change.
  const originalRef = useRef('');
  const modifiedRef = useRef('');

  const [language, setLanguage]       = useState('plaintext');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [renderSideBySide, setRenderSideBySide] = useState(true);
  const [stats, setStats] = useState({ added: 0, removed: 0, oLines: 0, mLines: 0 });
  const [hasContent, setHasContent] = useState(false);

  const origFileRef = useRef<HTMLInputElement>(null);
  const modFileRef  = useRef<HTMLInputElement>(null);
  const editorRef   = useRef<any>(null);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const refreshStats = () => {
    const s = computeStats(originalRef.current, modifiedRef.current);
    setStats(s);
    setHasContent(!!(originalRef.current.trim() || modifiedRef.current.trim()));
  };

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    // Read content into refs on every change — do NOT call setState for content
    editor.getOriginalEditor().onDidChangeModelContent(() => {
      originalRef.current = editor.getOriginalEditor().getValue();
      refreshStats();
    });
    editor.getModifiedEditor().onDidChangeModelContent(() => {
      modifiedRef.current = editor.getModifiedEditor().getValue();
      refreshStats();
    });
  };

  const EXT_MAP: Record<string, string> = {
    json: 'json', js: 'javascript', ts: 'typescript', html: 'html', css: 'css',
    py: 'python', yaml: 'yaml', yml: 'yaml', xml: 'xml', md: 'markdown',
    sql: 'sql', sh: 'shell', bash: 'shell', txt: 'plaintext',
  };

  const uploadFile = (side: 'orig' | 'mod', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext && EXT_MAP[ext]) setLanguage(EXT_MAP[ext]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const txt = ev.target?.result as string;
      // Drive Monaco imperatively — onDidChangeModelContent fires and updates refs/stats
      if (side === 'orig') editorRef.current?.getOriginalEditor().setValue(txt);
      else                 editorRef.current?.getModifiedEditor().setValue(txt);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearAll = () => {
    editorRef.current?.getOriginalEditor().setValue('');
    editorRef.current?.getModifiedEditor().setValue('');
  };

  const loadSample = () => {
    setLanguage('javascript');
    editorRef.current?.getOriginalEditor().setValue(SAMPLE_ORIGINAL);
    editorRef.current?.getModifiedEditor().setValue(SAMPLE_MODIFIED);
  };

  const bg     = isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900';
  const bgBar  = isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const btnGhost = isDark
    ? 'border-[#3d3d3d] text-gray-400 hover:text-gray-200 hover:border-[#5d5d5d] bg-transparent'
    : 'border-gray-300 text-gray-600 hover:text-gray-900 bg-white';
  const currentLang = LANGUAGES.find(l => l.value === language)?.label ?? 'Text';

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${bgBar}`}>
      <input ref={origFileRef} type="file" className="hidden" onChange={e => uploadFile('orig', e)} />
      <input ref={modFileRef}  type="file" className="hidden" onChange={e => uploadFile('mod', e)} />

      <button onClick={() => origFileRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Upload size={12} /> Original File
      </button>
      <button onClick={() => modFileRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Upload size={12} /> Modified File
      </button>
      <button onClick={loadSample}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <FileText size={12} /> Sample
      </button>
      <button onClick={clearAll}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Trash2 size={12} /> Clear
      </button>

      {/* Language picker */}
      <div className="relative">
        <button onClick={() => setShowLangMenu(m => !m)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
          {currentLang} <ChevronDown size={11} />
        </button>
        {showLangMenu && (
          <div className={`absolute top-9 left-0 z-50 rounded-lg border shadow-xl overflow-hidden w-36 ${isDark ? 'bg-[#1e1e1e] border-[#3d3d3d]' : 'bg-white border-gray-200'}`}>
            {LANGUAGES.map(l => (
              <button key={l.value}
                onClick={() => { setLanguage(l.value); setShowLangMenu(false); }}
                className={`block w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  language === l.value ? 'text-blue-400 bg-blue-500/10' : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View toggle */}
      <button onClick={() => setRenderSideBySide(s => !s)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        {renderSideBySide ? 'Inline' : 'Split'} view
      </button>

      {/* Stats */}
      {hasContent && (
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
            <Plus size={11} /> {stats.added}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400">
            <Minus size={11} /> {stats.removed}
          </span>
        </div>
      )}

      <div className="flex-1" />

      <button
        onClick={() => editorRef.current?.getModifiedEditor()?.getAction('editor.action.fontZoomReset')?.run()}
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

  const DiffPanel = (height: string) => (
    <div style={{ height }}>
      <DiffEditor
        original=""
        modified=""
        language={language}
        theme={isDark ? 'vs-dark' : 'light'}
        onMount={handleMount}
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          mouseWheelZoom: true,
          renderSideBySide,
          originalEditable: true,
          padding: { top: 8 },
          renderOverviewRuler: false,
        }}
      />
    </div>
  );

  // Panel labels above editor
  const PanelLabels = (
    <div className={`grid border-b flex-shrink-0 ${renderSideBySide ? 'grid-cols-2' : 'grid-cols-1'} ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
      <div className={`px-4 py-1.5 text-xs ${isDark ? 'text-gray-500 border-r border-[#2d2d2d]' : 'text-gray-500 border-r border-gray-200'}`}>
        Original &nbsp;<span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{stats.oLines} lines</span>
      </div>
      {renderSideBySide && (
        <div className={`px-4 py-1.5 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Modified &nbsp;<span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{stats.mLines} lines</span>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        <SEOHead title="Diff Checker — Compare Text, Code & Files Online | JsonMaster" description="Free online diff checker tool. Compare any text, code, or files side by side with live syntax highlighting. Supports JSON, JavaScript, Python, HTML, CSS and more." canonical="https://jsonmaster.dev/diff-checker" />
        {Toolbar}
        {PanelLabels}
        <div className="flex-1 overflow-hidden">
          {DiffPanel('100%')}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <SEOHead title="Diff Checker — Compare Text, Code & Files Online | JsonMaster" description="Free online diff checker tool. Compare any text, code, or files side by side with live syntax highlighting. Supports JSON, JavaScript, Python, HTML, CSS and more." canonical="https://jsonmaster.dev/diff-checker" />
      <SiteNav />
      <main className="flex-1">
        <div className={`border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          {Toolbar}
          {PanelLabels}
          {DiffPanel('520px')}
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Diff Checker — Compare Text, Code & Files Online Free
          </h1>
          <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Paste or upload any text, code, or file into both panels and instantly see every difference highlighted inline — just like your code editor. Supports JSON, JavaScript, TypeScript, Python, HTML, CSS, YAML, SQL, and more. 100% free, no sign-up, fully private.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              { title: 'Any file type', desc: 'Supports text, JSON, JS, TS, Python, HTML, CSS, YAML, XML, SQL, Markdown, and more.' },
              { title: 'Upload files', desc: 'Drag & drop or click to upload files from your device. Language is auto-detected from file extension.' },
              { title: 'Split or inline view', desc: 'Toggle between side-by-side split view and unified inline diff view.' },
              { title: '100% private', desc: 'All comparison happens in your browser. Your code and files never leave your device.' },
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
                { q: 'What is a diff checker?', a: 'A diff checker compares two versions of text or code and highlights lines that were added, removed, or changed. It\'s used by developers to review changes between file versions, API responses, or configuration files.' },
                { q: 'What file types does this support?', a: 'This tool supports any text-based file: plain text, JSON, JavaScript, TypeScript, HTML, CSS, Python, YAML, XML, SQL, Markdown, shell scripts, and more. Language is auto-detected from the file extension when you upload.' },
                { q: 'Is my code safe?', a: 'Yes. All comparison is done entirely in your browser using Monaco Editor (the engine behind VS Code). Nothing is sent to any server.' },
                { q: 'What is the difference between split and inline view?', a: 'Split view shows original and modified content side by side, making it easy to compare. Inline view shows both in a single column with added/removed lines interleaved — useful for long files.' },
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
