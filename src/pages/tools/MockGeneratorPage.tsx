import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Copy, Check, Download, Zap,
  ChevronRight, Minimize2, Maximize2, Home, Shuffle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { useFullscreen } from '../../hooks/useFullscreen';
import { parseJSON } from '../../utils/json';
import { generateMockData } from '../../utils/mockGenerator';
import { ShareButton } from '../../components/ShareButton';

const SAMPLE_JSON = `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28,
  "active": true,
  "role": "admin",
  "score": 4.8,
  "avatar": "https://example.com/avatar.png",
  "phone": "+1-555-0100",
  "company": "Acme Corp",
  "jobTitle": "Engineer",
  "address": {
    "street": "123 Main St",
    "city": "London",
    "country": "UK",
    "zipCode": "EC1A 1BB"
  },
  "tags": ["developer", "admin"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T08:00:00Z"
}`;

const PRESETS = [
  { label: 'User / Profile', json: SAMPLE_JSON },
  {
    label: 'Product',
    json: `{
  "id": "uuid",
  "productName": "Widget Pro",
  "description": "A great product",
  "price": 29.99,
  "quantity": 100,
  "category": "Electronics",
  "rating": 4.5,
  "active": true,
  "createdAt": "2024-01-01T00:00:00Z"
}`,
  },
  {
    label: 'Blog Post',
    json: `{
  "id": 1,
  "title": "Hello world",
  "slug": "hello-world",
  "content": "Lorem ipsum dolor sit amet.",
  "author": "Alice",
  "email": "alice@blog.com",
  "tags": ["news", "tech"],
  "status": "published",
  "views": 1200,
  "publishedAt": "2024-06-01T09:00:00Z",
  "createdAt": "2024-05-20T00:00:00Z"
}`,
  },
  {
    label: 'Order',
    json: `{
  "orderId": "uuid",
  "status": "pending",
  "total": 149.99,
  "currency": "USD",
  "customerName": "Bob Smith",
  "email": "bob@example.com",
  "phone": "+1-555-0200",
  "address": "456 Oak Ave, New York, NY",
  "items": 3,
  "createdAt": "2024-03-15T12:00:00Z"
}`,
  },
];

export function MockGeneratorPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [schema, setSchema] = useState(SAMPLE_JSON);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState<number | ''>('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  const run = useCallback((jsonStr: string, n: number, s: number | '') => {
    setError(null);
    const { parsed, error: pErr } = parseJSON(jsonStr);
    if (pErr) { setError(pErr.message); setOutput(''); return; }
    try {
      const result = generateMockData(parsed, {
        count: n,
        seed: s !== '' ? s : undefined,
      });
      setOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, []);

  // Auto-run on mount + whenever schema/count changes
  useEffect(() => {
    run(schema, count, seed);
  }, [schema, count, seed, run]);

  const regenerate = () => {
    // Change seed to get different data
    setSeed(Math.floor(Math.random() * 999999));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data-${count}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bg = isDark ? 'bg-[#0f0f0f] text-gray-200' : 'bg-white text-gray-900';

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-white border-gray-200'}`}>
      <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
        <Zap size={13} className="text-brand-400" />
      </div>
      <span className={`text-xs font-bold hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>Mock Generator</span>

      <div className={`w-px h-4 hidden sm:block ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`} />

      {/* Presets */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => setSchema(p.json)}
            className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
              schema.trim() === p.json.trim()
                ? isDark ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-brand-50 border-brand-300 text-brand-600'
                : isDark ? 'border-[#252525] text-gray-500 hover:text-gray-300 hover:border-[#333]' : 'border-gray-200 text-gray-500 hover:text-gray-700 bg-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ShareButton json={schema} basePath="/mock-generator" />

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
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border font-medium border transition-colors ${
            isDark ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600 bg-white'
          }`}>
          <Home size={13} />
        </button>
      )}
    </div>
  );

  const MainContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Controls bar */}
      <div className={`flex flex-wrap items-center gap-3 px-4 py-2.5 border-b flex-shrink-0 ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-gray-50 border-gray-200'}`}>
        {/* Record count */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Records</span>
          <div className="flex items-center gap-1">
            {[1, 5, 10, 25, 50].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-8 h-7 rounded-lg text-xs font-bold border transition-all ${
                  count === n
                    ? isDark ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'bg-brand-50 border-brand-300 text-brand-600'
                    : isDark ? 'border-[#1e1e1e] text-gray-500 hover:text-gray-300 hover:border-[#2a2a2a]' : 'border-gray-200 text-gray-500 hover:text-gray-700 bg-white'
                }`}
              >
                {n}
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              className={`w-14 h-7 text-center text-xs font-mono rounded-lg border outline-none ${isDark ? 'bg-[#141414] border-[#252525] text-gray-300 focus:border-brand-500/40' : 'bg-white border-gray-200 text-gray-700 focus:border-brand-400'}`}
            />
          </div>
        </div>

        <div className={`w-px h-5 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`} />

        {/* Seed */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Seed</span>
          <input
            type="number"
            placeholder="random"
            value={seed}
            onChange={e => setSeed(e.target.value === '' ? '' : Number(e.target.value))}
            className={`w-24 h-7 px-2 text-xs font-mono rounded-lg border outline-none ${isDark ? 'bg-[#141414] border-[#252525] text-gray-300 placeholder-gray-700 focus:border-brand-500/40' : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-brand-400'}`}
          />
        </div>

        <div className="flex-1" />

        {/* Regenerate */}
        <button
          onClick={regenerate}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isDark ? 'border-[#252525] text-gray-400 hover:text-brand-400 hover:border-brand-500/30' : 'border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-300 bg-white'}`}
        >
          <Shuffle size={12} /> Regenerate
        </button>

        {/* Copy */}
        {output && (
          <>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : isDark ? 'border border-[#252525] text-gray-400 hover:text-gray-200' : 'border border-gray-200 text-gray-600 hover:text-gray-900 bg-white'
              }`}
            >
              {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy JSON</>}
            </button>
            <button
              onClick={handleDownload}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isDark ? 'border-[#252525] text-gray-400 hover:text-gray-200' : 'border-gray-200 text-gray-600 hover:text-gray-900 bg-white'}`}
            >
              <Download size={11} /> Download
            </button>
          </>
        )}
      </div>

      {/* Split: Schema input | Output */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

        {/* Left: Schema / sample JSON */}
        <div className={`flex flex-col lg:w-[45%] border-b lg:border-b-0 lg:border-r ${isDark ? 'border-[#1e1e1e]' : 'border-gray-200'}`} style={{ minHeight: '200px' }}>
          <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
            <div>
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Sample JSON</span>
              <span className={`ml-2 text-[10px] ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>Shape defines the output structure</span>
            </div>
            {error && <span className="text-xs text-red-400">Invalid JSON</span>}
          </div>
          <div className="flex-1">
            <Editor
              value={schema}
              onChange={v => setSchema(v ?? '')}
              language="json"
              theme={isDark ? 'vs-dark' : 'light'}
              options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', automaticLayout: true, padding: { top: 8 } }}
            />
          </div>
        </div>

        {/* Right: Generated mock data */}
        <div className={`flex flex-col lg:w-[55%]`}>
          <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Generated Data</span>
              {output && (
                <span className="px-1.5 py-0.5 rounded-lg bg-brand-500/15 text-brand-400 text-[10px] font-bold">
                  {count} record{count !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {output && (
              <span className={`text-[10px] ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
                {(output.length / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          <div className="flex-1">
            {error ? (
              <div className="p-4">
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <span className="text-red-400 font-bold text-xs">⚠</span>
                  <div>
                    <p className="text-xs font-semibold text-red-400 mb-0.5">Invalid JSON</p>
                    <p className="text-xs text-red-300/70 font-mono">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Editor
                value={output || '// Generated mock data will appear here'}
                language="json"
                theme={isDark ? 'vs-dark' : 'light'}
                options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', readOnly: true, automaticLayout: true, padding: { top: 8 } }}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        <SEOHead title="JSON Mock Data Generator — Generate Fake Test Data | JsonWorkspace" description="Generate realistic fake JSON test data instantly. Paste a sample JSON object and get N records with smart field detection using Faker.js." canonical="https://jsonworkspace.mythosh.com/mock-generator" />
        {Toolbar}
        <div className="flex-1 overflow-hidden">{MainContent}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <SEOHead title="JSON Mock Data Generator — Generate Fake Test Data | JsonWorkspace" description="Generate realistic fake JSON test data instantly. Paste a sample JSON object and get N records with smart field detection using Faker.js." canonical="https://jsonworkspace.mythosh.com/mock-generator" />
      <SiteNav />

      <main className="flex-1">
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-6 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-100 bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs mb-3">
              <Link to="/" className={`hover:text-brand-400 transition-colors ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Home</Link>
              <ChevronRight size={12} className={isDark ? 'text-gray-700' : 'text-gray-300'} />
              <span className="text-brand-500 font-medium">Mock Data Generator</span>
            </div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-950'}`}>Mock Data Generator</h1>
                  <span className="px-2 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-xs font-black border border-brand-500/20">New</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Paste a sample JSON → get <strong>realistic fake test data</strong> instantly. Smart field detection for names, emails, dates, IPs, and 50+ more patterns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {Toolbar}

        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 py-0 sm:py-4">
          <div className={`rounded-none sm:rounded-2xl border overflow-hidden ${isDark ? 'border-[#1e1e1e]' : 'border-gray-200'}`}
            style={{ height: 'clamp(500px, 70vh, 720px)' }}>
            {MainContent}
          </div>
        </div>

        {/* Smart field detection callout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className={`text-lg font-black mb-2 ${isDark ? 'text-white' : 'text-gray-950'}`}>Smart field detection</h2>
          <p className={`text-sm mb-5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Field names are matched against 50+ patterns to generate realistic values automatically.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {[
              { field: 'name / fullName',     sample: 'Alice Johnson' },
              { field: 'email',               sample: 'alice@example.com' },
              { field: 'phone / mobile',      sample: '+1-555-0123' },
              { field: 'avatar / photo',      sample: 'https://…/avatar.jpg' },
              { field: 'createdAt / updatedAt', sample: '2024-03-15T08:00:00Z' },
              { field: 'city / country',      sample: 'London / UK' },
              { field: 'company / jobTitle',  sample: 'Acme Corp / Engineer' },
              { field: 'price / amount',      sample: '42.99' },
              { field: 'status',              sample: 'active / pending / …' },
              { field: 'uuid / id',           sample: '550e8400-…' },
              { field: 'latitude / longitude', sample: '51.5074 / -0.1278' },
              { field: 'token / apiKey',      sample: 'a3f8c2d1e9…' },
            ].map(item => (
              <div key={item.field} className={`p-3 rounded-xl border ${isDark ? 'bg-[#141414] border-[#1e1e1e]' : 'bg-white border-gray-100'}`}>
                <code className={`text-[11px] font-mono font-bold block mb-1 text-brand-400`}>{item.field}</code>
                <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{item.sample}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
