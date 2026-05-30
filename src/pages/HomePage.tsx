import { Link } from 'react-router-dom';
import { Braces, ArrowRight, CheckCircle, Zap, Shield, Clock, ArrowUpRight } from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/layout/SEOHead';
import { useStore } from '../store';
import { TOOLS } from '../data/tools';
import { getRecentPosts } from '../data/blog-posts';
import { useEffect } from 'react';

const FEATURES = [
  { icon: <Zap size={18} />, title: 'Lightning Fast', desc: 'Monaco editor (VS Code engine) — instant syntax highlighting as you type.', color: '#f59e0b' },
  { icon: <Shield size={18} />, title: '100% Private', desc: 'All processing in your browser. Your JSON never leaves your device.', color: '#10b981' },
  { icon: <CheckCircle size={18} />, title: 'Smart Validation', desc: 'Pinpoints errors with exact line numbers, column positions, and auto-fix.', color: '#38bdf8' },
  { icon: <Clock size={18} />, title: 'Always Free', desc: 'Every tool, every format, no sign-up, no paywalls — forever.', color: '#f43f5e' },
];

// Full solid color palettes — visible, memorable, nothing like JSONLint
const CARD_COLORS: Record<string, { bg: string; darkBg: string; icon: string; darkIcon: string }> = {
  blue:   { bg: 'bg-sky-500',     darkBg: 'bg-sky-500/15 border border-sky-500/25',     icon: 'bg-sky-400/20 text-sky-300',   darkIcon: 'bg-sky-400/20 text-sky-300' },
  green:  { bg: 'bg-brand-500',   darkBg: 'bg-brand-500/15 border border-brand-500/25', icon: 'bg-brand-400/20 text-brand-300', darkIcon: 'bg-brand-400/20 text-brand-300' },
  orange: { bg: 'bg-orange-500',  darkBg: 'bg-orange-500/15 border border-orange-500/25', icon: 'bg-orange-400/20 text-orange-300', darkIcon: 'bg-orange-400/20 text-orange-300' },
  purple: { bg: 'bg-violet-500',  darkBg: 'bg-violet-500/15 border border-violet-500/25', icon: 'bg-violet-400/20 text-violet-300', darkIcon: 'bg-violet-400/20 text-violet-300' },
  teal:   { bg: 'bg-teal-500',    darkBg: 'bg-teal-500/15 border border-teal-500/25',   icon: 'bg-teal-400/20 text-teal-300',  darkIcon: 'bg-teal-400/20 text-teal-300' },
  red:    { bg: 'bg-rose-500',    darkBg: 'bg-rose-500/15 border border-rose-500/25',   icon: 'bg-rose-400/20 text-rose-300',  darkIcon: 'bg-rose-400/20 text-rose-300' },
  yellow: { bg: 'bg-amber-500',   darkBg: 'bg-amber-500/15 border border-amber-500/25', icon: 'bg-amber-400/20 text-amber-300', darkIcon: 'bg-amber-400/20 text-amber-300' },
};

const LIST_ACCENT: Record<string, string> = {
  blue: 'text-sky-400', green: 'text-brand-400', orange: 'text-orange-400',
  purple: 'text-violet-400', teal: 'text-teal-400', red: 'text-rose-400', yellow: 'text-amber-400',
};

export function HomePage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const recentPosts = getRecentPosts(3);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const popularTools = TOOLS.slice(0, 4);
  const formatTools = TOOLS.filter(t => t.category === 'format');
  const convertTools = TOOLS.filter(t => t.category === 'convert');

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#0f0f0f] text-gray-200' : 'bg-white text-gray-900'}`} style={{ overflow: 'auto' }}>
      <SEOHead
        title="JsonWorkspace — Free JSON Formatter, Validator & Converter Online"
        description="JsonWorkspace is the best free online JSON formatter, validator, minifier, and converter. Format, validate, convert JSON to YAML, XML, CSV and more. Fast, private, developer-focused."
        canonical="https://jsonworkspace.mythosh.com/"
        faqSchema={[
          { question: 'Is JsonWorkspace free?', answer: 'Yes, all tools on JsonWorkspace are completely free with no sign-up required.' },
          { question: 'Is JsonWorkspace safe to use with sensitive data?', answer: 'Yes. All JSON processing happens in your browser — your data never leaves your device.' },
          { question: 'What JSON tools does JsonWorkspace offer?', answer: 'JsonWorkspace offers a JSON formatter, validator, minifier, prettifier, and converters to CSV, XML, YAML, TypeScript, Python, and Java.' },
        ]}
      />

      <SiteNav />

      <main className="flex-1">

        {/* ─── HERO ──────────────────────────────────────────────── */}
        <section className={`relative overflow-hidden ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8fffe]'}`}>
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-teal-400" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left: copy */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 bg-brand-500/10 text-brand-500 border border-brand-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  Free · No sign-up · 100% private
                </div>

                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] mb-5 tracking-tight ${isDark ? 'text-white' : 'text-gray-950'}`}>
                  JSON tools<br />
                  <span className="text-brand-500">built for<br />developers.</span>
                </h1>

                <p className={`text-base sm:text-lg leading-relaxed mb-8 max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Format, validate, minify, and convert JSON instantly — powered by Monaco Editor, the engine behind VS Code.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/app"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
                  >
                    <Braces size={16} /> Open Full Editor
                  </Link>
                  <Link
                    to="/json-formatter"
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-sm rounded-xl border-2 transition-all ${
                      isDark
                        ? 'border-[#2a2a2a] text-gray-300 hover:border-brand-500/40 hover:text-brand-400'
                        : 'border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600'
                    }`}
                  >
                    JSON Formatter <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Quick stats */}
                <div className={`flex items-center gap-6 mt-10 pt-8 border-t ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
                  {[
                    { val: '10+', label: 'Free tools' },
                    { val: '100%', label: 'Client-side' },
                    { val: '7', label: 'Export formats' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className={`text-2xl font-black text-brand-500`}>{s.val}</div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: JSON preview card */}
              <div className="hidden lg:block">
                <div className={`rounded-2xl border overflow-hidden shadow-2xl ${isDark ? 'bg-[#141414] border-[#2a2a2a]' : 'bg-[#0f0f0f] border-[#1a1a1a]'}`}>
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    <span className="ml-3 text-xs text-gray-600 font-mono">user.json</span>
                    <span className="ml-auto text-xs font-medium text-brand-400 flex items-center gap-1">
                      <CheckCircle size={11} /> Valid JSON
                    </span>
                  </div>
                  {/* Code */}
                  <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
                    <code>
                      <span className="text-gray-600">{'{'}</span>{'\n'}
                      {'  '}<span className="text-sky-400">"name"</span><span className="text-gray-500">: </span><span className="text-amber-300">"Alice Johnson"</span><span className="text-gray-600">,</span>{'\n'}
                      {'  '}<span className="text-sky-400">"role"</span><span className="text-gray-500">: </span><span className="text-amber-300">"engineer"</span><span className="text-gray-600">,</span>{'\n'}
                      {'  '}<span className="text-sky-400">"active"</span><span className="text-gray-500">: </span><span className="text-violet-400">true</span><span className="text-gray-600">,</span>{'\n'}
                      {'  '}<span className="text-sky-400">"scores"</span><span className="text-gray-500">: </span><span className="text-gray-600">[</span><span className="text-brand-400">98</span><span className="text-gray-600">, </span><span className="text-brand-400">87</span><span className="text-gray-600">, </span><span className="text-brand-400">95</span><span className="text-gray-600">],</span>{'\n'}
                      {'  '}<span className="text-sky-400">"address"</span><span className="text-gray-500">: </span><span className="text-gray-600">{'{'}</span>{'\n'}
                      {'    '}<span className="text-sky-400">"city"</span><span className="text-gray-500">: </span><span className="text-amber-300">"London"</span><span className="text-gray-600">,</span>{'\n'}
                      {'    '}<span className="text-sky-400">"country"</span><span className="text-gray-500">: </span><span className="text-amber-300">"UK"</span>{'\n'}
                      {'  '}<span className="text-gray-600">{'}'}</span>{'\n'}
                      <span className="text-gray-600">{'}'}</span>
                    </code>
                  </pre>
                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-t border-[#2a2a2a]">
                    <span className="text-xs text-gray-600 font-mono">7 keys · 142 chars</span>
                    <Link to="/json-formatter" className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                      Format yours →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────────────────── */}
        <section className={`border-y py-10 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-100 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" style={{ backgroundColor: f.color + '18', color: f.color }}>
                    {f.icon}
                  </span>
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</p>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── POPULAR TOOLS (bold solid cards) ─────────────────── */}
        <section className={`py-14 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 text-brand-500`}>Tools</p>
                <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-950'}`}>Popular tools</h2>
              </div>
              <Link to="/app" className={`text-sm font-medium text-brand-500 hover:text-brand-400 flex items-center gap-1`}>
                All tools <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTools.map(tool => {
                const c = CARD_COLORS[tool.color] ?? CARD_COLORS.blue;
                if (isDark) {
                  return (
                    <Link
                      key={tool.id}
                      to={`/${tool.slug}`}
                      className={`group p-5 rounded-2xl transition-all hover:scale-[1.02] hover:-translate-y-0.5 ${c.darkBg}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-4 ${c.darkIcon}`}>
                        {tool.icon}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{tool.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{tool.shortDesc}</p>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${LIST_ACCENT[tool.color] ?? 'text-brand-400'}`}>
                        Try free <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={tool.id}
                    to={`/${tool.slug}`}
                    className={`group p-5 rounded-2xl transition-all hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl text-white ${c.bg}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-sm font-bold mb-4">
                      {tool.icon}
                    </div>
                    <h3 className="text-sm font-bold mb-1">{tool.name}</h3>
                    <p className="text-xs text-white/70 leading-relaxed mb-4">{tool.shortDesc}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-white/90">
                      Try free <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── ALL TOOLS by category ─────────────────────────────── */}
        <section className={`border-t py-14 ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-gray-100 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Format & Validate */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 text-brand-500`}>Format & Validate</p>
                <h2 className={`text-xl font-black mb-5 ${isDark ? 'text-white' : 'text-gray-950'}`}>Clean up your JSON</h2>
                <div className="space-y-2">
                  {formatTools.concat(TOOLS.filter(t => t.category === 'validate')).map(tool => {
                    const accent = LIST_ACCENT[tool.color] ?? 'text-brand-400';
                    return (
                      <Link
                        key={tool.id}
                        to={`/${tool.slug}`}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all group ${
                          isDark
                            ? 'bg-[#141414] border-[#1e1e1e] hover:border-[#2a2a2a] hover:bg-[#181818]'
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isDark ? `${CARD_COLORS[tool.color]?.darkIcon ?? ''}` : `${CARD_COLORS[tool.color]?.bg ?? 'bg-brand-500'} text-white`
                          }`}>
                            {tool.icon}
                          </span>
                          <div>
                            <p className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{tool.name}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{tool.shortDesc}</p>
                          </div>
                        </div>
                        <ArrowRight size={13} className={`${isDark ? 'text-gray-700' : 'text-gray-400'} transition-all group-hover:${accent.replace('text-', 'text-')} group-hover:translate-x-0.5`} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Convert */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 text-brand-500`}>Convert</p>
                <h2 className={`text-xl font-black mb-5 ${isDark ? 'text-white' : 'text-gray-950'}`}>Export to any format</h2>
                <div className="space-y-2">
                  {convertTools.map(tool => {
                    return (
                      <Link
                        key={tool.id}
                        to={`/${tool.slug}`}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all group ${
                          isDark
                            ? 'bg-[#141414] border-[#1e1e1e] hover:border-[#2a2a2a] hover:bg-[#181818]'
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isDark ? `${CARD_COLORS[tool.color]?.darkIcon ?? ''}` : `${CARD_COLORS[tool.color]?.bg ?? 'bg-brand-500'} text-white`
                          }`}>
                            {tool.icon}
                          </span>
                          <div>
                            <p className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{tool.name}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{tool.shortDesc}</p>
                          </div>
                        </div>
                        <ArrowRight size={13} className={`${isDark ? 'text-gray-700' : 'text-gray-400'} transition-transform group-hover:translate-x-0.5`} />
                      </Link>
                    );
                  })}
                  <Link
                    to="/app"
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 border-dashed transition-all group ${
                      isDark
                        ? 'border-brand-500/20 hover:border-brand-500/40 hover:bg-brand-500/5'
                        : 'border-brand-300/40 hover:border-brand-400/60 hover:bg-brand-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center text-xs font-bold">⚡</span>
                      <div>
                        <p className="text-xs font-semibold text-brand-400">Full Editor + More</p>
                        <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>TypeScript, Python, Java + Tree View</p>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-brand-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FULL EDITOR BANNER ────────────────────────────────── */}
        <section className="py-14 bg-brand-500 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-100/70 mb-3">Full-featured workspace</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              One editor, everything you need.
            </h2>
            <p className="text-sm text-brand-100/80 mb-7 max-w-2xl mx-auto">
              Tree View · Table View · JSON Compare · Schema Generator · JSON Path Finder · History Panel · Quick Tools · 7 Conversion Formats
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-600 font-bold text-sm rounded-xl hover:bg-brand-50 transition-colors shadow-xl shadow-brand-700/30"
            >
              <Braces size={15} /> Open Full JsonWorkspace Editor
            </Link>
          </div>
        </section>

        {/* ─── BLOG ──────────────────────────────────────────────── */}
        {recentPosts.length > 0 && (
          <section className={`py-14 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-brand-500">Learn</p>
                  <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-950'}`}>JSON guides</h2>
                </div>
                <Link to="/blog" className="text-sm font-medium text-brand-500 hover:text-brand-400 flex items-center gap-1">
                  All articles <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPosts.map(post => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className={`group p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#141414] border-[#1e1e1e] hover:border-[#2a2a2a]'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <span className="text-xs font-bold text-brand-500 mb-3 block">{post.category}</span>
                    <h3 className={`text-sm font-bold mb-3 leading-snug group-hover:text-brand-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {post.title}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{post.readingTime} min read</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
