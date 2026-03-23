import { useState, useEffect } from 'react';
import { Minimize2, Maximize2, Home, Copy, Trash2, FileText, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';

type Mode = 'encode' | 'decode';

const SAMPLE_INPUT = 'https://example.com/search?q=hello world&lang=en&page=1#results';

interface ParsedUrl {
  protocol: string;
  host: string;
  pathname: string;
  params: Array<{ key: string; value: string }>;
  hash: string;
}

function tryParseUrl(input: string): ParsedUrl | null {
  try {
    const url = new URL(input);
    const params: Array<{ key: string; value: string }> = [];
    url.searchParams.forEach((value, key) => params.push({ key, value }));
    return {
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      params,
      hash: url.hash,
    };
  } catch {
    return null;
  }
}

function encodeUrl(input: string, fullUrl: boolean): string {
  try {
    return fullUrl ? encodeURI(input) : encodeURIComponent(input);
  } catch {
    return 'Error: unable to encode input';
  }
}

function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return 'Error: invalid URL-encoded input';
  }
}

export function UrlEncoderPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fullUrl, setFullUrl] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [copyMsg, setCopyMsg] = useState('');

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
      setOutput(encodeUrl(input, fullUrl));
    } else {
      setOutput(decodeUrl(input));
    }
  }, [input, mode, fullUrl]);

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

  const parsedUrl = input ? tryParseUrl(input) || tryParseUrl(output) : null;

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
            className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              mode === m
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

      {mode === 'encode' && (
        <label className={`inline-flex items-center gap-1.5 text-xs cursor-pointer ${textSecondary}`}>
          <input
            type="checkbox"
            checked={fullUrl}
            onChange={e => setFullUrl(e.target.checked)}
            className="rounded"
          />
          Full URL mode
        </label>
      )}

      <div className="flex-1" />

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

  const InputArea = (
    <div className={`flex flex-col h-full rounded-lg border overflow-hidden ${bgPanel}`}>
      <div className={`px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Input</span>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Paste text or URL to encode…' : 'Paste URL-encoded string to decode…'}
        className={`w-full flex-1 p-3 text-xs font-mono bg-transparent outline-none resize-none ${textPrimary}`}
        spellCheck={false}
      />
    </div>
  );

  const OutputArea = (
    <div className={`flex flex-col h-full rounded-lg border overflow-hidden ${bgPanel}`}>
      <div className={`px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Output</span>
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

  const UrlParser = parsedUrl && (
    <div className={`rounded-lg border p-4 mt-3 ${bgPanel}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${textMuted}`}>URL Parser</p>
      <div className="space-y-2">
        {[
          { label: 'Protocol', value: parsedUrl.protocol },
          { label: 'Host', value: parsedUrl.host },
          { label: 'Pathname', value: parsedUrl.pathname },
          parsedUrl.hash ? { label: 'Hash', value: parsedUrl.hash } : null,
        ].filter(Boolean).map((row, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className={`text-xs w-20 flex-shrink-0 font-medium ${textMuted}`}>{row!.label}</span>
            <span className={`text-xs font-mono break-all ${textSecondary}`}>{row!.value}</span>
          </div>
        ))}
        {parsedUrl.params.length > 0 && (
          <div>
            <p className={`text-xs font-medium mb-1.5 ${textMuted}`}>Query Parameters</p>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className={`text-left pb-1 font-medium ${textMuted}`}>Key</th>
                  <th className={`text-left pb-1 font-medium ${textMuted}`}>Value</th>
                </tr>
              </thead>
              <tbody>
                {parsedUrl.params.map((p, i) => (
                  <tr key={i} className={`border-t ${isDark ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
                    <td className={`py-1 pr-3 font-mono ${textSecondary}`}>{p.key}</td>
                    <td className={`py-1 font-mono break-all ${textSecondary}`}>{p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const seoHead = (
    <SEOHead
      title="URL Encoder Decoder Online — Free URL Encoding Tool | JsonMaster"
      description="Encode or decode URLs and URL components instantly. Supports encodeURIComponent and encodeURI modes, URL parsing with query parameter breakdown. Free and private."
      canonical="https://jsonmaster.dev/url-encoder"
    />
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        {seoHead}
        {Toolbar}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {InputArea}
            </div>
            <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {OutputArea}
            </div>
          </div>
          {parsedUrl && (
            <div className="px-3 pb-3 overflow-auto max-h-48 flex-shrink-0">
              {UrlParser}
            </div>
          )}
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
          <div className="flex" style={{ height: '400px' }}>
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {InputArea}
            </div>
            <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {OutputArea}
            </div>
          </div>
          {parsedUrl && (
            <div className="px-4 pb-4">
              {UrlParser}
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            URL Encoder Decoder Online — Free URL Encoding Tool
          </h1>
          <p className={`text-base leading-relaxed mb-8 ${textSecondary}`}>
            Encode or decode URLs and URL components instantly in your browser. Use encodeURIComponent mode for individual values like query parameters, or Full URL mode to encode a complete URL while preserving its structure. Automatically parses URLs to show protocol, host, path, query parameters, and hash.
          </p>
          <section>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: 'What is URL encoding?', a: 'URL encoding (also called percent-encoding) converts characters that are not safe in URLs into a "%" followed by two hexadecimal digits. For example, a space becomes %20 and "&" becomes %26. It is required when including special characters in query parameter values.' },
                { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURIComponent encodes everything except letters, digits, and - _ . ! ~ * \' ( ). Use it for individual query parameter keys and values. encodeURI preserves characters that have special meaning in URLs like / ? & = # : so it is suitable for encoding a complete URL.' },
                { q: 'When should I URL-encode form data?', a: 'Always URL-encode form values before appending them to a URL or sending them in an application/x-www-form-urlencoded body. Failing to encode special characters like "&", "=", and "+" can break query string parsing and cause incorrect form submissions.' },
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
