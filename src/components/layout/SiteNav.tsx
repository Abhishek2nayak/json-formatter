import { Link, useLocation } from 'react-router-dom';
import { Braces, Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';
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
  { label: 'JSON → YAML',       href: '/json-to-yaml',   desc: 'Convert to YAML format' },
  { label: 'JSON → XML',        href: '/json-to-xml',    desc: 'Convert to XML format' },
  { label: 'JSON → CSV',        href: '/json-to-csv',    desc: 'Convert to CSV spreadsheet' },
  { label: 'JSON → Prettifier', href: '/json-prettifier', desc: 'Prettify with formatting' },
];

export function SiteNav() {
  const { theme, toggleTheme } = useStore();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setConvertOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isConvertActive = CONVERT_LINKS.some(l => location.pathname === l.href);

  const navItemClass = (active: boolean) =>
    `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : isDark
          ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <nav className={`border-b flex-shrink-0 z-40 relative ${isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Braces size={14} className="text-white" />
            </div>
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>JsonMaster</span>
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
                <div className={`absolute top-[calc(100%+6px)] left-0 z-50 w-52 rounded-xl border shadow-xl overflow-hidden animate-fade-in ${
                  isDark ? 'bg-[#1e1e1e] border-[#3d3d3d]' : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider border-b ${
                    isDark ? 'text-gray-600 border-[#2d2d2d]' : 'text-gray-400 border-gray-100'
                  }`}>
                    Convert JSON to…
                  </div>
                  {CONVERT_LINKS.map(link => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setConvertOpen(false)}
                      className={`flex items-start gap-2.5 px-3 py-2.5 transition-colors ${
                        location.pathname === link.href
                          ? isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium leading-none mb-0.5">{link.label}</p>
                        <p className={`text-[10px] leading-none ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/app"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
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
          <div className={`md:hidden border-t pb-3 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
            {SIMPLE_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm font-medium mt-1 rounded-md ${
                  location.pathname === link.href
                    ? 'bg-blue-600 text-white'
                    : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile convert section */}
            <div className={`mt-2 px-3 pt-2 border-t ${isDark ? 'border-[#2d2d2d]' : 'border-gray-100'}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Convert JSON to…
              </p>
              {CONVERT_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-2 py-1.5 text-sm font-medium rounded-md ${
                    location.pathname === link.href
                      ? 'text-blue-400'
                      : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              to="/app"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white"
            >
              Open Full Editor →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
