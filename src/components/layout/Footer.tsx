import { Link } from 'react-router-dom';
import { useStore } from '../../store';

const TOOL_LINKS = [
  { label: 'JSON Formatter', href: '/json-formatter' },
  { label: 'JSON Validator', href: '/json-validator' },
  { label: 'JSON Minifier', href: '/json-minifier' },
  { label: 'JSON Prettifier', href: '/json-prettifier' },
  { label: 'JSON to CSV', href: '/json-to-csv' },
  { label: 'JSON to XML', href: '/json-to-xml' },
  { label: 'JSON to YAML', href: '/json-to-yaml' },
  { label: 'JSON Compare', href: '/json-compare' },
  { label: 'Diff Checker', href: '/diff-checker' },
];

const BLOG_LINKS = [
  { label: 'What is JSON?', href: '/blog/what-is-json-and-how-it-works' },
  { label: 'Fix JSON Parse Errors', href: '/blog/fix-json-parse-error' },
  { label: 'JSON vs XML', href: '/blog/json-vs-xml' },
  { label: 'JSON to CSV Guide', href: '/blog/how-to-convert-json-to-csv' },
  { label: 'JSON Minify vs Prettify', href: '/blog/json-minify-vs-prettify' },
];

export function Footer() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t mt-16 ${isDark ? 'bg-[#0d0d0d] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <img src="/logo-with-name.png" alt="JSONWorkspace" className="w-auto" style={{
                height: "100px"
              }} />            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              The best free JSON formatter, validator, and converter for developers. Fast, private, and always free.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tools</h3>
            <ul className="space-y-2">
              {TOOL_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-xs hover:text-blue-400 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Learn</h3>
            <ul className="space-y-2">
              {BLOG_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-xs hover:text-blue-400 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/blog" className={`text-xs hover:text-blue-400 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  All Articles →
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stay Updated</h3>
            <p className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Get notified about new developer tools and JSON tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className={`flex-1 text-xs px-3 py-2 rounded-md border outline-none focus:border-blue-500 ${isDark
                  ? 'bg-[#1e1e1e] border-[#3d3d3d] text-gray-200 placeholder-gray-600'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
              />
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} JSONWorkspace. All rights reserved. All processing is 100% client-side — your data never leaves your browser.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/sitemap.xml" className={`text-xs hover:text-blue-400 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
