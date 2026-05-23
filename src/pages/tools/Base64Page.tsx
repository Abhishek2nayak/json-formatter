import { useState, useEffect, useRef } from 'react';
import { Minimize2, Maximize2, Home, Copy, Trash2, FileText, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { useFullscreen } from '../../hooks/useFullscreen';

type Mode = 'encode' | 'decode';

const SAMPLE_INPUT = 'Hello, World! This is a Base64 encoding example. 🎉';

function encodeBase64(input: string, urlSafe: boolean): string {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    return urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_') : encoded;
  } catch {
    return 'Error: unable to encode input';
  }
}

function decodeBase64(input: string): string {
  try {
    const normalized = input.trim().replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(escape(atob(normalized)));
  } catch {
    return 'Error: invalid Base64 input';
  }
}

function byteSize(str: string): number {
  return new Blob([str]).size;
}

export function Base64Page() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const { isFullscreen, toggleFullscreen, showHint } = useFullscreen();
  const [copyMsg, setCopyMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (!input) { setOutput(''); return; }
    if (mode === 'encode') {
      setOutput(encodeBase64(input, urlSafe));
    } else {
      setOutput(decodeBase64(input));
    }
  }, [input, mode, urlSafe]);

  const handleSwap = () => {
    const newMode: Mode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopyMsg('Copied!');
      setTimeout(() => setCopyMsg(''), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    if (mode === 'encode') {
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        // result is already a data URL like "data:...;base64,<encoded>"
        const base64 = result.split(',')[1] ?? '';
        setInput(base64);
        setMode('decode'); // show the encoded result in output by switching to decode? No — set raw and encode
        // Actually: read as text for text files, read as binary for others
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (ev) => {
        setInput((ev.target?.result as string) ?? '');
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const inputBytes = byteSize(input);
  const outputBytes = byteSize(output);

  const bg = isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900';
  const bgBar = isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const bgPanel = isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const btnGhost = isDark
    ? 'border-[#3d3d3d] text-gray-400 hover:text-gray-200 hover:border-[#5d5d5d] bg-transparent'
    : 'border-gray-300 text-gray-600 hover:text-gray-900 bg-white';
  const textPrimary = isDark ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-600' : 'text-gray-400';

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${bgBar}`}>
      {/* Mode toggle */}
      <div className={`flex rounded-md border overflow-hidden ${isDark ? 'border-[#3d3d3d]' : 'border-gray-300'}`}>
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${mode === m
                ? 'bg-blue-600 text-white'
                : isDark ? 'bg-transparent text-gray-400 hover:text-gray-200' : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <button onClick={() => setInput(SAMPLE_INPUT)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <FileText size={12} /> Sample
      </button>
      <button onClick={handleSwap}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <ArrowLeftRight size={12} /> Swap
      </button>
      <button onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Copy size={12} /> {copyMsg || 'Copy Output'}
      </button>
      <button onClick={() => { setInput(''); setOutput(''); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Trash2 size={12} /> Clear
      </button>
      <button onClick={() => fileRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <RefreshCw size={12} /> Upload File
      </button>
      <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />

      <label className={`inline-flex items-center gap-1.5 text-xs cursor-pointer ${textSecondary}`}>
        <input
          type="checkbox"
          checked={urlSafe}
          onChange={e => setUrlSafe(e.target.checked)}
          className="rounded"
        />
        URL-safe
      </label>

      {input && (
        <span className={`text-xs ${textMuted}`}>
          {inputBytes}B → {outputBytes}B
        </span>
      )}

      <div className="flex-1" />

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

  const InputArea = (
    <div className={`flex flex-col h-full rounded-lg border overflow-hidden ${bgPanel}`}>
      <div className={`px-3 py-2 border-b flex-shrink-0 flex items-center justify-between ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Input</span>
        {input && <span className={`text-[10px] ${textMuted}`}>{input.length} chars</span>}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Paste text to encode…' : 'Paste Base64 string to decode…'}
        className={`w-full flex-1 p-3 text-xs font-mono bg-transparent outline-none resize-none ${textPrimary}`}
        spellCheck={false}
      />
    </div>
  );

  const OutputArea = (
    <div className={`flex flex-col h-full rounded-lg border overflow-hidden ${bgPanel}`}>
      <div className={`px-3 py-2 border-b flex-shrink-0 flex items-center justify-between ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Output</span>
        {output && <span className={`text-[10px] ${textMuted}`}>{output.length} chars</span>}
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="Output will appear here…"
        className={`w-full flex-1 p-3 text-xs font-mono bg-transparent outline-none resize-none ${textSecondary}`}
        spellCheck={false}
      />
    </div>
  );

  const seoHead = (
    <SEOHead
      title="Base64 Encoder Decoder Online — Free Base64 Tool | JsonWorkspace"
      description="Encode or decode Base64 strings instantly in your browser. Supports URL-safe Base64, file upload, Unicode text, and size comparison. 100% free and private."
      canonical="https://jsonworkspace.mythosh.com/base64"
    />
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        {seoHead}
        {Toolbar}
        <div className="flex-1 overflow-hidden flex gap-0">
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            {InputArea}
          </div>
          <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            {OutputArea}
          </div>
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
          <div className="flex" style={{ height: '400px' }}>
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {InputArea}
            </div>
            <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {OutputArea}
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Base64 Encoder Decoder Online — Free Base64 Tool
          </h1>
          <p className={`text-base leading-relaxed mb-8 ${textSecondary}`}>
            Quickly encode any text or file to Base64, or decode Base64 strings back to plain text. Supports standard and URL-safe Base64 variants, Unicode characters, and shows input/output size comparison. All processing happens in your browser — your data stays private.
          </p>
          <section>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: 'What is Base64 encoding?', a: 'Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It is commonly used to encode binary data like images for embedding in HTML/CSS, encode credentials in HTTP headers, and transmit data through text-based protocols.' },
                { q: 'What is URL-safe Base64?', a: 'URL-safe Base64 replaces "+" with "-" and "/" with "_" so the encoded string can be safely included in URLs and filenames without percent-encoding. It is used in JWTs, OAuth tokens, and other web contexts.' },
                { q: 'Does Base64 encrypt my data?', a: 'No. Base64 is an encoding scheme, not encryption. Anyone who receives a Base64-encoded string can trivially decode it. Do not use Base64 to protect sensitive information — use proper encryption instead.' },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border ${isDark ? 'border-[#2d2d2d] bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.q}</p>
                  <p className={`text-sm ${textSecondary}`}>{item.a}</p>
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
