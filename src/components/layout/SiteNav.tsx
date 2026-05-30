import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';

const SIMPLE_LINKS = [
  { label: 'Formatter', href: '/json-formatter' },
  { label: 'Validator', href: '/json-validator' },
  { label: 'Minifier', href: '/json-minifier' },
  { label: 'Compare', href: '/json-compare' },
  { label: 'Diff', href: '/diff-checker' },
];

const CONVERT_LINKS = [
  { label: 'JSON → YAML',       href: '/json-to-yaml',    desc: 'Config files & CI/CD pipelines',  dot: 'bg-amber-400' },
  { label: 'JSON → XML',        href: '/json-to-xml',     desc: 'Structured markup format',        dot: 'bg-orange-400' },
  { label: 'JSON → CSV',        href: '/json-to-csv',      desc: 'Spreadsheet & data export',       dot: 'bg-teal-400' },
  { label: 'JSON → Markdown',  href: '/json-to-markdown', desc: 'Arrays to Markdown tables',       dot: 'bg-brand-400' },
  { label: 'JSON → Prettifier', href: '/json-prettifier', desc: 'Human-readable formatting',       dot: 'bg-violet-400' },
  { label: 'JSON → Zod Schema', href: '/json-to-zod',     desc: 'TypeScript schema generation',    dot: 'bg-sky-400' },
];

const TOOLS_LINKS = [
  { label: 'JSONPath Explorer', href: '/json-path',       desc: 'Query JSON with expressions',       dot: 'bg-brand-400',   isNew: true },
  { label: 'JSON → Code',       href: '/json-to-code',    desc: 'TypeScript, Python, Go, SQL…',      dot: 'bg-sky-400',     isNew: true },
  { label: 'Mock Generator',    href: '/mock-generator',  desc: 'Generate realistic test data',       dot: 'bg-violet-400',  isNew: true },
  { label: 'JWT Decoder',       href: '/jwt-decoder',     desc: 'Decode JSON Web Tokens',             dot: 'bg-rose-400',    isNew: false },
  { label: 'Base64',            href: '/base64',           desc: 'Encode & decode Base64',             dot: 'bg-amber-400',   isNew: false },
  { label: 'URL Encoder',       href: '/url-encoder',     desc: 'Encode & decode URLs',                dot: 'bg-orange-400',  isNew: false },
  { label: 'Regex Tester',      href: '/regex-tester',    desc: 'Test regular expressions',            dot: 'bg-purple-400',  isNew: false },
];

export function SiteNav() {
  const { theme, toggleTheme } = useStore();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setConvertOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isConvertActive = CONVERT_LINKS.some(l => location.pathname === l.href);
  const isToolsActive = TOOLS_LINKS.some(l => location.pathname === l.href);

  const navItemClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active
      ? 'bg-brand-500/15 text-brand-500'
      : isDark
        ? 'text-gray-400 hover:text-white hover:bg-white/5'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <nav className={`flex-shrink-0 z-40 relative border-b ${isDark ? 'bg-[#0f0f0f] border-[#1e1e1e]' : 'bg-white border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/logo-with-name.png" alt="JSONWorkspace" className="h-7 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {SIMPLE_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={navItemClass(location.pathname === link.href)}
              >
                {link.label}
              </Link>
            ))}

            {/* Convert dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setConvertOpen(o => !o)}
                className={`inline-flex items-center gap-1 ${navItemClass(isConvertActive)}`}
              >
                Convert
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-150 ${convertOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {convertOpen && (
                <div className={`absolute top-[calc(100%+8px)] left-0 z-50 w-64 rounded-2xl border shadow-2xl overflow-hidden animate-fade-in ${isDark ? 'bg-[#111111] border-[#222222]' : 'bg-white border-gray-100'}`}>
                  {/* Header */}
                  <div className={`px-4 pt-3.5 pb-2.5 border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">Convert JSON to…</p>
                  </div>
                  {/* Items */}
                  <div className="p-1.5">
                    {CONVERT_LINKS.map(link => {
                      const isActive = location.pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setConvertOpen(false)}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            isActive
                              ? isDark ? 'bg-brand-500/15 text-brand-400' : 'bg-brand-50 text-brand-600'
                              : isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${link.dot}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold leading-none mb-0.5">{link.label}</p>
                            <p className={`text-[10px] leading-none truncate ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{link.desc}</p>
                          </div>
                          <ArrowRight size={11} className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        </Link>
                      );
                    })}
                  </div>
                  {/* Footer CTA */}
                  <div className={`px-3 pb-3 pt-1 border-t ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
                    <Link
                      to="/app"
                      onClick={() => setConvertOpen(false)}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-xs font-bold transition-colors"
                    >
                      Open full editor <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tools dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setToolsOpen(o => !o)}
                className={`inline-flex items-center gap-1 ${navItemClass(isToolsActive)}`}
              >
                Tools
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-150 ${toolsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {toolsOpen && (
                <div className={`absolute top-[calc(100%+8px)] left-0 z-50 w-64 rounded-2xl border shadow-2xl overflow-hidden animate-fade-in ${isDark ? 'bg-[#111111] border-[#222222]' : 'bg-white border-gray-100'}`}>
                  {/* Header */}
                  <div className={`px-4 pt-3.5 pb-2.5 border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">Developer Tools</p>
                  </div>
                  {/* Items */}
                  <div className="p-1.5">
                    {TOOLS_LINKS.map(link => {
                      const isActive = location.pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setToolsOpen(false)}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            isActive
                              ? isDark ? 'bg-brand-500/15 text-brand-400' : 'bg-brand-50 text-brand-600'
                              : isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${link.dot}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="text-xs font-semibold leading-none">{link.label}</p>
                              {link.isNew && (
                                <span className="text-[9px] font-black px-1 py-0.5 rounded bg-brand-500/20 text-brand-400 leading-none">NEW</span>
                              )}
                            </div>
                            <p className={`text-[10px] leading-none truncate ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{link.desc}</p>
                          </div>
                          <ArrowRight size={11} className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/app"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-sm shadow-brand-500/20"
            >
              Open Full Editor →
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-1.5 rounded-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className={`md:hidden border-t pb-4 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
            <div className="pt-2 space-y-0.5">
              {SIMPLE_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-md ${location.pathname === link.href
                    ? 'bg-brand-600 text-white'
                    : isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
              <p className={`px-3 text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Convert JSON to…
              </p>
              <div className="space-y-0.5">
                {CONVERT_LINKS.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm rounded-md ${location.pathname === link.href
                      ? 'text-brand-400 bg-brand-500/10'
                      : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
              <p className={`px-3 text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Developer Tools
              </p>
              <div className="space-y-0.5">
                {TOOLS_LINKS.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm rounded-md ${location.pathname === link.href
                      ? 'text-brand-400 bg-brand-500/10'
                      : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
              <Link
                to="/app"
                onClick={() => setMobileOpen(false)}
                className="block mx-3 px-4 py-2.5 text-sm font-medium rounded-md bg-brand-600 hover:bg-brand-500 text-white text-center transition-colors"
              >
                Open Full Editor →
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
