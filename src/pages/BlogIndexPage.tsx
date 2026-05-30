import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/layout/SEOHead';
import { useStore } from '../store';
import { BLOG_POSTS } from '../data/blog-posts';
import { useEffect } from 'react';

export function BlogIndexPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const bg = isDark ? 'bg-[#0f0f0f] text-gray-200' : 'bg-white text-gray-900';
  const cardBg = isDark ? 'bg-[#141414] border-[#1e1e1e] hover:border-[#2a2a2a]' : 'bg-white border-gray-100 hover:border-gray-200';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className={`min-h-screen flex flex-col ${bg}`} style={{ overflow: 'auto' }}>
      <SEOHead
        title="JSON Blog — Developer Guides & Tutorials | JsonWorkspace"
        description="Learn JSON fundamentals, debugging tips, conversion guides, and best practices for developers. Free articles from the JsonWorkspace team."
        canonical="https://jsonworkspace.mythosh.com/blog"
      />

      <SiteNav />

      <main className="flex-1">
        {/* Header */}
        <div className={`border-b py-12 ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>JSON Developer Blog</h1>
            <p className={`text-base ${textSecondary}`}>
              Guides, tutorials, and tips for developers working with JSON every day.
            </p>
          </div>
        </div>

        {/* Posts grid */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-4">
            {sortedPosts.map(post => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className={`group flex flex-col sm:flex-row gap-4 p-5 rounded-xl border transition-all hover:scale-[1.005] ${cardBg} ${isDark ? 'hover:border-[#4d4d4d]' : 'hover:border-gray-300'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${textMuted}`}>
                      <Clock size={11} /> {post.readingTime} min read
                    </span>
                    <span className={`text-xs ${textMuted}`}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className={`text-base font-semibold mb-2 leading-snug group-hover:text-brand-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {post.title}
                  </h2>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>{post.metaDescription}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-[#2a2a2a] text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <ArrowRight size={16} className={`${textMuted} group-hover:text-brand-400 transition-colors group-hover:translate-x-0.5 transform`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
