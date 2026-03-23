import { Link } from 'react-router-dom';
import { Braces, ArrowRight, CheckCircle, Zap, Shield, Clock } from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/layout/SEOHead';
import { useStore } from '../store';
import { TOOLS } from '../data/tools';
import { getRecentPosts } from '../data/blog-posts';
import { useEffect } from 'react';

const FEATURES = [
  { icon: <Zap size={16} />, title: 'Lightning Fast', desc: 'Monaco editor (VS Code engine) for instant formatting and syntax highlighting.' },
  { icon: <Shield size={16} />, title: '100% Private', desc: 'All processing happens in your browser. Your JSON never touches our servers.' },
  { icon: <CheckCircle size={16} />, title: 'Smart Validation', desc: 'Exact error location with line numbers, column positions, and auto-fix.' },
  { icon: <Clock size={16} />, title: 'Always Free', desc: 'All tools are completely free. No sign-up, no limits, no paywalls.' },
];

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: 'bg-blue-500/20 text-blue-400' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: 'bg-green-500/20 text-green-400' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: 'bg-orange-500/20 text-orange-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: 'bg-purple-500/20 text-purple-400' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', icon: 'bg-teal-500/20 text-teal-400' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: 'bg-red-500/20 text-red-400' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: 'bg-yellow-500/20 text-yellow-400' },
};

export function HomePage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const recentPosts = getRecentPosts(3);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const bg = isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-200';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const popularTools = TOOLS.slice(0, 4);
  const formatTools = TOOLS.filter(t => t.category === 'format');
  const convertTools = TOOLS.filter(t => t.category === 'convert');

  return (
    <div className={`min-h-screen flex flex-col ${bg}`} style={{ overflow: 'auto' }}>
      <SEOHead
        title="JsonMaster — Free JSON Formatter, Validator & Converter Online"
        description="JsonMaster is the best free online JSON formatter, validator, minifier, and converter. Format, validate, convert JSON to YAML, XML, CSV and more. Fast, private, developer-focused."
        canonical="https://jsonmaster.dev/"
        faqSchema={[
          { question: 'Is JsonMaster free?', answer: 'Yes, all tools on JsonMaster are completely free with no sign-up required.' },
          { question: 'Is JsonMaster safe to use with sensitive data?', answer: 'Yes. All JSON processing happens in your browser — your data never leaves your device.' },
          { question: 'What JSON tools does JsonMaster offer?', answer: 'JsonMaster offers a JSON formatter, validator, minifier, prettifier, and converters to CSV, XML, YAML, TypeScript, Python, and Java.' },
        ]}
      />

      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className={`border-b py-16 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Zap size={11} /> Free developer tool — no sign-up required
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              The Best JSON Tools for{' '}
              <span className="text-blue-400">Developers</span>
            </h1>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 ${textSecondary}`}>
              Format, validate, minify, and convert JSON instantly. Built with Monaco Editor (the VS Code engine) for the best developer experience. 100% free and private.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-colors"
              >
                <Braces size={16} /> Open Full Editor
              </Link>
              <Link
                to="/json-formatter"
                className={`inline-flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-lg border transition-colors ${
                  isDark ? 'border-[#3d3d3d] text-gray-300 hover:text-white hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:text-gray-900 bg-white'
                }`}
              >
                JSON Formatter <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features row */}
        <section className={`border-b py-8 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex flex-col items-start gap-2">
                  <span className="text-blue-400">{f.icon}</span>
                  <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</p>
                  <p className={`text-xs ${textMuted}`}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular tools */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Popular Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popularTools.map(tool => {
                const c = COLOR_CLASSES[tool.color] || COLOR_CLASSES.blue;
                return (
                  <Link
                    key={tool.id}
                    to={`/${tool.slug}`}
                    className={`group p-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg ${cardBg} ${isDark ? 'hover:border-[#4d4d4d]' : 'hover:border-gray-300 hover:shadow-gray-200'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-3 ${c.icon}`}>
                      {tool.icon}
                    </div>
                    <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{tool.name}</h3>
                    <p className={`text-xs leading-relaxed ${textMuted}`}>{tool.shortDesc}</p>
                    <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${c.text}`}>
                      Try it free <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* All tools by category */}
        <section className={`border-t py-12 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Format tools */}
              <div>
                <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Format & Validate</h2>
                <div className="space-y-2">
                  {formatTools.concat(TOOLS.filter(t => t.category === 'validate')).map(tool => {
                    const c = COLOR_CLASSES[tool.color] || COLOR_CLASSES.blue;
                    return (
                      <Link
                        key={tool.id}
                        to={`/${tool.slug}`}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${cardBg} ${isDark ? 'hover:border-[#4d4d4d]' : 'hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${c.icon}`}>
                            {tool.icon}
                          </span>
                          <div>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{tool.name}</p>
                            <p className={`text-xs ${textMuted}`}>{tool.shortDesc}</p>
                          </div>
                        </div>
                        <ArrowRight size={13} className={`${textMuted} transition-transform group-hover:translate-x-0.5`} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Convert tools */}
              <div>
                <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Convert JSON</h2>
                <div className="space-y-2">
                  {convertTools.map(tool => {
                    const c = COLOR_CLASSES[tool.color] || COLOR_CLASSES.blue;
                    return (
                      <Link
                        key={tool.id}
                        to={`/${tool.slug}`}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${cardBg} ${isDark ? 'hover:border-[#4d4d4d]' : 'hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${c.icon}`}>
                            {tool.icon}
                          </span>
                          <div>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{tool.name}</p>
                            <p className={`text-xs ${textMuted}`}>{tool.shortDesc}</p>
                          </div>
                        </div>
                        <ArrowRight size={13} className={`${textMuted} transition-transform group-hover:translate-x-0.5`} />
                      </Link>
                    );
                  })}
                  {/* Full editor CTA */}
                  <Link
                    to="/app"
                    className="flex items-center justify-between p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 transition-colors group hover:bg-blue-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold bg-blue-500/20 text-blue-400">
                        ⚡
                      </span>
                      <div>
                        <p className="text-xs font-medium text-blue-400">Full Editor + More</p>
                        <p className={`text-xs ${textMuted}`}>TypeScript, Python, Java + Tree View</p>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full editor CTA banner */}
        <section className={`border-t border-b py-10 ${isDark ? 'border-[#2d2d2d] bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Want the full power? Open the complete editor.
            </h2>
            <p className={`text-sm mb-5 ${textSecondary}`}>
              Tree View · Table View · JSON Compare · Schema Generator · JSON Path Finder · History Panel · Quick Tools · 7 Conversion Formats
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <Braces size={15} /> Open Full JsonMaster Editor
            </Link>
          </div>
        </section>

        {/* Blog posts */}
        {recentPosts.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Learn JSON</h2>
                <Link to="/blog" className={`text-xs font-medium text-blue-400 hover:text-blue-300`}>
                  All articles →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPosts.map(post => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className={`group p-4 rounded-xl border transition-all hover:scale-[1.01] ${cardBg} ${isDark ? 'hover:border-[#4d4d4d]' : 'hover:border-gray-300'}`}
                  >
                    <span className={`text-xs font-medium text-blue-400 mb-2 block`}>{post.category}</span>
                    <h3 className={`text-sm font-semibold mb-2 leading-snug group-hover:text-blue-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {post.title}
                    </h3>
                    <p className={`text-xs ${textMuted}`}>{post.readingTime} min read</p>
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
