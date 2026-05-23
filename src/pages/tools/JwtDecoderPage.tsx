import { useState, useEffect } from 'react';
import { Minimize2, Maximize2, Home, Copy, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { useFullscreen } from '../../hooks/useFullscreen';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3IxMjMiLCJuYW1lIjoiQWxpY2UgSm9obnNvbiIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDU4NjA2MDAsImV4cCI6OTk5OTk5OTk5OX0.signature';

function base64UrlDecode(str: string): string {
  const b = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b + '=='.slice(0, (4 - (b.length % 4)) % 4);
  try {
    return decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
  } catch {
    return atob(padded);
  }
}

function formatTimestamp(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return String(ts);
  }
}

interface DecodedJwt {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  error: string | null;
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: '', error: 'Invalid JWT format — expected 3 parts separated by "."' };
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2], error: null };
  } catch {
    return { header: null, payload: null, signature: '', error: 'Failed to decode JWT — check that the token is valid.' };
  }
}

function JsonDisplay({ obj, isDark }: { obj: Record<string, unknown>; isDark: boolean }) {
  const lines = JSON.stringify(obj, null, 2).split('\n');
  return (
    <pre className={`text-xs font-mono leading-5 overflow-auto p-3 rounded-md ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
      {lines.map((line, i) => {
        // color keys blue, strings green, numbers orange, booleans purple
        const colored = line
          .replace(/"([^"]+)":/g, '<span style="color:#7dd3fc">"$1":</span>')
          .replace(/: "([^"]*)"/g, ': <span style="color:#86efac">"$1"</span>')
          .replace(/: (\d+)/g, ': <span style="color:#fdba74">$1</span>')
          .replace(/: (true|false)/g, ': <span style="color:#c4b5fd">$1</span>');
        return (
          <span key={i} dangerouslySetInnerHTML={{ __html: colored + '\n' }} />
        );
      })}
    </pre>
  );
}

export function JwtDecoderPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const { isFullscreen, toggleFullscreen, showHint } = useFullscreen();
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
    if (token.trim()) {
      setDecoded(decodeJwt(token));
    } else {
      setDecoded(null);
    }
  }, [token]);

  const handleCopyPayload = () => {
    if (decoded?.payload) {
      navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2));
      setCopyMsg('Copied!');
      setTimeout(() => setCopyMsg(''), 2000);
    }
  };

  const bg = isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900';
  const bgBar = isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const bgPanel = isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const btnGhost = isDark
    ? 'border-[#3d3d3d] text-gray-400 hover:text-gray-200 hover:border-[#5d5d5d] bg-transparent'
    : 'border-gray-300 text-gray-600 hover:text-gray-900 bg-white';
  const textPrimary = isDark ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-600' : 'text-gray-400';

  const expiry = decoded?.payload && typeof decoded.payload.exp === 'number'
    ? { ts: decoded.payload.exp as number, expired: (decoded.payload.exp as number) < Date.now() / 1000 }
    : null;

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${bgBar}`}>
      <button onClick={() => setToken(SAMPLE_JWT)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <FileText size={12} /> Sample JWT
      </button>
      <button onClick={handleCopyPayload}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Copy size={12} /> {copyMsg || 'Copy Payload'}
      </button>
      <button onClick={() => setToken('')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Trash2 size={12} /> Clear
      </button>

      {decoded && !decoded.error && (
        <span className={`text-xs px-2 py-1 rounded font-medium ${expiry === null ? 'bg-gray-500/10 text-gray-400' : expiry.expired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
          {expiry === null ? 'No Expiry' : expiry.expired ? 'Expired' : 'Valid'}
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

  const ResultPanel = (
    <div className="flex flex-col gap-3 overflow-auto h-full">
      {!decoded && (
        <div className={`flex items-center justify-center h-full text-sm ${textMuted}`}>
          Paste a JWT token on the left to decode it.
        </div>
      )}

      {decoded?.error && (
        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {decoded.error}
        </div>
      )}

      {decoded && !decoded.error && (
        <>
          {/* Header */}
          <div className={`rounded-lg border p-3 ${bgPanel}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>Header</p>
            {decoded.header && <JsonDisplay obj={decoded.header} isDark={isDark} />}
          </div>

          {/* Payload */}
          <div className={`rounded-lg border p-3 ${bgPanel}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>Payload</p>
            {decoded.payload && <JsonDisplay obj={decoded.payload} isDark={isDark} />}

            {/* Time claims */}
            <div className="mt-3 space-y-1.5">
              {typeof decoded.payload?.exp === 'number' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-mono ${textMuted}`}>exp</span>
                  <span className={`text-xs ${textSecondary}`}>{formatTimestamp(decoded.payload.exp as number)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${expiry?.expired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {expiry?.expired ? 'Expired' : 'Valid'}
                  </span>
                </div>
              )}
              {typeof decoded.payload?.iat === 'number' && (
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${textMuted}`}>iat</span>
                  <span className={`text-xs ${textSecondary}`}>{formatTimestamp(decoded.payload.iat as number)}</span>
                </div>
              )}
              {typeof decoded.payload?.nbf === 'number' && (
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${textMuted}`}>nbf</span>
                  <span className={`text-xs ${textSecondary}`}>{formatTimestamp(decoded.payload.nbf as number)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className={`rounded-lg border p-3 ${bgPanel}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>Signature</p>
            <p className={`text-xs font-mono break-all leading-relaxed ${textSecondary}`}>{decoded.signature}</p>
            <p className={`text-[10px] mt-2 ${textMuted}`}>Signature not verified (client-side only — verification requires the secret key).</p>
          </div>
        </>
      )}
    </div>
  );

  const InputPanel = (
    <div className={`flex flex-col h-full rounded-lg border overflow-hidden ${bgPanel}`}>
      <div className={`px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>JWT Token</span>
      </div>
      <textarea
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="Paste your JWT token here…"
        className={`w-full flex-1 p-3 text-xs font-mono bg-transparent outline-none resize-none ${textPrimary}`}
        spellCheck={false}
      />
    </div>
  );

  const seoHead = (
    <SEOHead
      title="JWT Decoder Online — Decode JSON Web Tokens Free | JsonMaster"
      description="Decode and inspect JWT tokens instantly in your browser. View header, payload, signature, and expiry information. 100% free, private, no data sent to server."
      canonical="https://jsonworkspace.mythosh.com/jwt-decoder"
    />
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        {seoHead}
        {Toolbar}
        <div className="flex-1 overflow-hidden flex">
          <div className="w-[40%] p-3 overflow-hidden flex flex-col">
            {InputPanel}
          </div>
          <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
          <div className="flex-1 p-3 overflow-hidden">
            {ResultPanel}
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
          <div className="flex" style={{ height: '600px' }}>
            <div className="w-[40%] p-3 overflow-hidden flex flex-col">
              {InputPanel}
            </div>
            <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
            <div className="flex-1 p-3 overflow-hidden">
              {ResultPanel}
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            JWT Decoder Online — Decode JSON Web Tokens Free
          </h1>
          <p className={`text-base leading-relaxed mb-8 ${textSecondary}`}>
            Paste any JSON Web Token (JWT) to instantly decode and inspect its header, payload, and signature. See expiry dates, issued-at times, and all claims in a human-readable format. Everything runs in your browser — your tokens never leave your device.
          </p>
          <section>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: 'What is a JWT?', a: 'A JSON Web Token (JWT) is a compact, URL-safe token format used to securely transmit claims between parties. It consists of three Base64URL-encoded parts separated by dots: a header describing the algorithm, a payload containing the claims, and a signature for verification.' },
                { q: 'Is it safe to paste my JWT here?', a: 'Yes. All decoding happens entirely in your browser using standard JavaScript APIs. Your token is never sent to any server. However, avoid pasting production tokens with sensitive data in untrusted environments.' },
                { q: 'Can this tool verify the JWT signature?', a: 'No. Signature verification requires the secret key (for HMAC algorithms) or the public key (for RSA/ECDSA). This tool only decodes and displays the token contents client-side without verification.' },
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
