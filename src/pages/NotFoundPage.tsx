import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/layout/SEOHead';
import { useStore } from '../store';
import { TOOLS } from '../data/tools';
import { SITE_URL } from '../constants';

export function NotFoundPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900'}`}>
      <SEOHead
        title="Page Not Found | JsonWorkspace"
        description="The page you're looking for doesn't exist. Browse JsonWorkspace's free JSON tools instead."
        canonical={`${SITE_URL}/404`}
        noindex
      />
      <SiteNav />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className={`text-sm font-semibold tracking-wide ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>404</p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">Page not found</h1>
        <p className={`max-w-md mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          The page you're looking for doesn't exist or may have moved. Try one of our tools below.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-10 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-colors"
        >
          <Home size={14} /> Back to Home
        </Link>

        <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-wide text-gray-500">
          <Search size={12} /> Popular tools
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              to={`/${tool.slug}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                isDark
                  ? 'border-[#3d3d3d] text-gray-400 hover:text-brand-400 hover:border-brand-500/40'
                  : 'border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-300'
              }`}
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
