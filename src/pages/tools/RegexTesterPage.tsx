import { useState, useEffect, useMemo } from 'react';
import { Minimize2, Maximize2, Home, Copy, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SiteNav } from '../../components/layout/SiteNav';
import { Footer } from '../../components/layout/Footer';
import { SEOHead } from '../../components/layout/SEOHead';
import { useStore } from '../../store';
import { buildRegex, getMatches } from '../../utils/regex';
import type { FlagState, RegexMatch } from '../../utils/regex';

const SAMPLE_PATTERN = '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}';
const SAMPLE_FLAGS = { g: true, i: true, m: false, s: false, u: false };
const SAMPLE_TEXT = `Contact us at support@example.com or sales@company.org.
Invalid: not-an-email, @nodomain, missingat.com
Also valid: user.name+tag@sub.domain.io`;

const QUICK_PATTERNS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}' },
  { label: 'URL', pattern: 'https?:\\/\\/[^\\s/$.?#].[^\\s]*' },
  { label: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])' },
  { label: 'UUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' },
  { label: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { label: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b' },
  { label: 'Integer', pattern: '-?\\d+' },
  { label: 'Decimal', pattern: '-?\\d+\\.\\d+' },
  { label: 'Whitespace', pattern: '\\s+' },
];

function HighlightedText({ text, matches, isDark }: { text: string; matches: RegexMatch[]; isDark: boolean }) {
  if (!text) return <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>No text to highlight.</span>;
  if (matches.length === 0) return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{text}</span>;

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start > cursor) {
      parts.push(<span key={`t${cursor}`}>{text.slice(cursor, m.start)}</span>);
    }
    parts.push(
      <mark key={`m${m.start}`} className="bg-yellow-400/40 text-inherit rounded-sm px-0.5" title={`Match ${m.index + 1}: "${m.value}"`}>
        {m.value}
      </mark>
    );
    cursor = m.end;
  }
  if (cursor < text.length) {
    parts.push(<span key={`t${cursor}`}>{text.slice(cursor)}</span>);
  }
  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{parts}</span>;
}

export function RegexTesterPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<FlagState>({ g: true, i: false, m: false, s: false, u: false });
  const [testString, setTestString] = useState('');
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

  const regex = useMemo(() => pattern ? buildRegex(pattern, flags) : null, [pattern, flags]);
  const regexError = pattern && regex === null ? 'Invalid regular expression' : null;
  const matches = useMemo(() => getMatches(regex, testString), [regex, testString]);

  const hasGroups = pattern.includes('(');
  const groupCount = regex ? (new RegExp(regex.source + '|').exec('')?.length ?? 1) - 1 : 0;

  const handleCopyRegex = () => {
    if (pattern) {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
      navigator.clipboard.writeText(`/${pattern}/${flagStr}`);
      setCopyMsg('Copied!');
      setTimeout(() => setCopyMsg(''), 2000);
    }
  };

  const loadSample = () => {
    setPattern(SAMPLE_PATTERN);
    setFlags(SAMPLE_FLAGS);
    setTestString(SAMPLE_TEXT);
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

  const FLAG_KEYS = ['g', 'i', 'm', 's', 'u'] as const;
  const FLAG_LABELS: Record<string, string> = { g: 'global', i: 'case insensitive', m: 'multiline', s: 'dotAll', u: 'unicode' };

  const Toolbar = (
    <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 border-b flex-shrink-0 ${bgBar}`}>
      <button onClick={loadSample}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <FileText size={12} /> Sample
      </button>
      <button onClick={handleCopyRegex}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Copy size={12} /> {copyMsg || 'Copy Regex'}
      </button>
      <button onClick={() => { setPattern(''); setTestString(''); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${btnGhost}`}>
        <Trash2 size={12} /> Clear
      </button>

      {matches.length > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400">
          {matches.length} match{matches.length !== 1 ? 'es' : ''}
        </span>
      )}
      {regexError && (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400">
          Invalid regex
        </span>
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

  const PatternRow = (
    <div className={`flex items-center gap-2 px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
      <span className={`text-sm font-mono select-none ${textMuted}`}>/</span>
      <input
        type="text"
        value={pattern}
        onChange={e => setPattern(e.target.value)}
        placeholder="Enter regex pattern…"
        spellCheck={false}
        className={`flex-1 text-xs font-mono bg-transparent outline-none ${regexError ? 'text-red-400' : textPrimary}`}
      />
      <span className={`text-sm font-mono select-none ${textMuted}`}>/</span>
      <div className="flex items-center gap-2 ml-1">
        {FLAG_KEYS.map(f => (
          <label key={f} title={FLAG_LABELS[f]} className={`inline-flex items-center gap-1 text-xs cursor-pointer font-mono ${flags[f] ? 'text-blue-400' : textMuted}`}>
            <input
              type="checkbox"
              checked={flags[f]}
              onChange={e => setFlags(prev => ({ ...prev, [f]: e.target.checked }))}
              className="hidden"
            />
            {f}
          </label>
        ))}
      </div>
      {regexError && <span className="text-xs text-red-400">{regexError}</span>}
    </div>
  );

  const TestArea = (
    <div className={`flex flex-col h-full rounded-lg border overflow-hidden ${bgPanel}`}>
      <div className={`px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Test String</span>
      </div>
      <textarea
        value={testString}
        onChange={e => setTestString(e.target.value)}
        placeholder="Paste or type your test string here…"
        className={`w-full flex-1 p-3 text-xs font-mono bg-transparent outline-none resize-none ${textPrimary}`}
        spellCheck={false}
      />
    </div>
  );

  const MatchPanel = (
    <div className={`flex flex-col h-full rounded-lg border overflow-hidden ${bgPanel}`}>
      <div className={`px-3 py-2 border-b flex-shrink-0 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>
          Highlighted Output
        </span>
      </div>
      <div className={`flex-1 overflow-auto p-3 text-xs font-mono leading-5 ${textSecondary}`}>
        {testString
          ? <HighlightedText text={testString} matches={matches} isDark={isDark} />
          : <span className={textMuted}>Test string will be highlighted here.</span>
        }
      </div>
      {matches.length > 0 && (
        <div className={`border-t overflow-auto max-h-40 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <table className="w-full text-xs">
            <thead className={`sticky top-0 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
              <tr>
                <th className={`text-left px-3 py-1.5 font-medium ${textMuted}`}>#</th>
                <th className={`text-left px-3 py-1.5 font-medium ${textMuted}`}>Match</th>
                <th className={`text-left px-3 py-1.5 font-medium ${textMuted}`}>Start</th>
                <th className={`text-left px-3 py-1.5 font-medium ${textMuted}`}>End</th>
                {hasGroups && groupCount > 0 && <th className={`text-left px-3 py-1.5 font-medium ${textMuted}`}>Groups</th>}
              </tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <tr key={m.index} className={`border-t ${isDark ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
                  <td className={`px-3 py-1 font-mono ${textMuted}`}>{m.index + 1}</td>
                  <td className={`px-3 py-1 font-mono max-w-[200px] truncate ${textPrimary}`} title={m.value}>{m.value}</td>
                  <td className={`px-3 py-1 font-mono ${textSecondary}`}>{m.start}</td>
                  <td className={`px-3 py-1 font-mono ${textSecondary}`}>{m.end}</td>
                  {hasGroups && groupCount > 0 && (
                    <td className={`px-3 py-1 font-mono ${textSecondary}`}>
                      {m.groups.map((g, gi) => (
                        <span key={gi} className="mr-2">{g ?? '—'}</span>
                      ))}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const QuickRef = (
    <div className={`px-3 py-2 border-t flex-shrink-0 flex flex-wrap gap-1.5 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
      <span className={`text-[10px] font-semibold uppercase tracking-wider self-center mr-1 ${textMuted}`}>Quick:</span>
      {QUICK_PATTERNS.map(qp => (
        <button
          key={qp.label}
          onClick={() => setPattern(qp.pattern)}
          className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${btnGhost}`}
        >
          {qp.label}
        </button>
      ))}
    </div>
  );

  const seoHead = (
    <SEOHead
      title="Regex Tester Online — Test Regular Expressions Free | JsonMaster"
      description="Test and debug regular expressions in real time. Highlights all matches, shows capture groups, and includes a quick reference for common patterns. Free and private."
      canonical="https://jsonmaster.dev/regex-tester"
    />
  );

  if (isFullscreen) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
        {seoHead}
        {Toolbar}
        <div className={`flex-shrink-0 ${bgPanel} border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          {PatternRow}
          {QuickRef}
        </div>
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            {TestArea}
          </div>
          <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            {MatchPanel}
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
          <div className={`${bgPanel} border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
            {PatternRow}
            {QuickRef}
          </div>
          <div className="flex" style={{ height: '400px' }}>
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {TestArea}
            </div>
            <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              {MatchPanel}
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Regex Tester Online — Test Regular Expressions Free
          </h1>
          <p className={`text-base leading-relaxed mb-8 ${textSecondary}`}>
            Write and test regular expressions in real time. All matches are highlighted directly in your test string, with a match list showing position and capture groups. Includes flags (g, i, m, s, u), quick reference patterns for common use cases like email, URL, and UUID, and full privacy — everything runs in your browser.
          </p>
          <section>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: 'What regex flavour does this tester use?', a: 'This tester uses JavaScript\'s built-in RegExp engine, which supports most common regex syntax including character classes, quantifiers, groups, lookaheads, and lookbehinds. It does not support PCRE-specific features like named backreferences with the (?P<name>) syntax.' },
                { q: 'What do the flags mean?', a: 'g (global) finds all matches instead of stopping at the first. i (case insensitive) makes the match case-insensitive. m (multiline) makes ^ and $ match line boundaries. s (dotAll) makes . match newlines. u (unicode) enables full Unicode matching.' },
                { q: 'How do I test capture groups?', a: 'Wrap parts of your pattern in parentheses, e.g. (\\d{4})-(\\d{2})-(\\d{2}) for dates. The match table will show each group\'s captured value for every match. Use (?:...) for non-capturing groups if you only need grouping without capture.' },
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
