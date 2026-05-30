import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/layout/SEOHead';
import { useStore } from '../store';
import { BLOG_POSTS, getBlogPost } from '../data/blog-posts';

const RELATED_TOOLS = [
  { label: 'JSON Formatter', href: '/json-formatter' },
  { label: 'JSON Validator', href: '/json-validator' },
  { label: 'JSON Minifier', href: '/json-minifier' },
  { label: 'JSON to YAML', href: '/json-to-yaml' },
  { label: 'JSON to CSV', href: '/json-to-csv' },
];

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const post = getBlogPost(slug ?? '');
  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (!post) navigate('/blog', { replace: true });
  }, [post, navigate]);

  if (!post) return null;

  const bg = isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';
  const cardBg = isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-200';

  // Extract FAQ only from the explicit FAQ section (after <h2>FAQ</h2>)
  const faqSection = post.content.match(/<h2>FAQ<\/h2>([\s\S]*?)(?=<h2>|$)/)?.[1] ?? '';
  const faqItems = faqSection
    .match(/<h3>(.*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)
    ?.map(match => {
      const q = match.match(/<h3>(.*?)<\/h3>/)?.[1] ?? '';
      const a = match.match(/<p>([\s\S]*?)<\/p>/)?.[1]?.replace(/<[^>]*>/g, '') ?? '';
      return { question: q, answer: a };
    })
    .filter(item => item.question.trim().endsWith('?')) ?? [];

  const canonicalUrl = `https://jsonworkspace.mythosh.com/blog/${post.slug}`;

  return (
    <div className={`min-h-screen flex flex-col ${bg}`} style={{ overflow: 'auto' }}>
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={canonicalUrl}
        ogType="article"
        faqSchema={faqItems.length > 0 ? faqItems : undefined}
        articleSchema={{
          headline: post.title,
          description: post.metaDescription,
          datePublished: post.publishedAt,
        }}
        breadcrumbs={[
          { name: 'Home', url: 'https://jsonworkspace.mythosh.com/' },
          { name: 'Blog', url: 'https://jsonworkspace.mythosh.com/blog' },
          { name: post.title, url: canonicalUrl },
        ]}
      />

      <SiteNav />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back */}
          <Link to="/blog" className={`inline-flex items-center gap-1.5 text-xs mb-6 hover:text-brand-400 transition-colors ${textMuted}`}>
            <ArrowLeft size={13} /> All Articles
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                {post.category}
              </span>
              <span className={`text-xs flex items-center gap-1 ${textMuted}`}>
                <Clock size={11} /> {post.readingTime} min read
              </span>
              <span className={`text-xs ${textMuted}`}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map(tag => (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-[#2a2a2a] text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* CTA banner */}
          <div className={`mb-8 p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isDark ? 'bg-brand-600/5 border-brand-600/20' : 'bg-brand-50 border-brand-200'}`}>
            <p className={`text-sm ${isDark ? 'text-brand-300' : 'text-brand-800'}`}>
              Try our free JSON tools — no sign-up required
            </p>
            <div className="flex gap-2">
              <Link to="/json-formatter" className="px-3 py-1.5 bg-blue-600 hover:bg-brand-500 text-white text-xs font-medium rounded-md transition-colors whitespace-nowrap">
                JSON Formatter →
              </Link>
              <Link to="/json-validator" className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${isDark ? 'border-[#3d3d3d] text-gray-300 hover:text-white' : 'border-brand-300 text-brand-700 bg-white'}`}>
                Validator
              </Link>
            </div>
          </div>

          {/* Article content */}
          <article
            className={`
              prose prose-sm max-w-none
              ${isDark ? 'prose-invert' : ''}
              prose-headings:font-semibold
              prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
              prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-3 prose-ol:my-3
              prose-li:my-1
              prose-code:text-xs prose-code:bg-transparent
              prose-pre:my-4
              prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
              [&_pre]:rounded-lg [&_pre]:border [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-xs
              [&_code]:font-mono
              ${isDark
                ? '[&_pre]:bg-[#1a1a1a] [&_pre]:border-[#2d2d2d] [&_code]:text-gray-300'
                : '[&_pre]:bg-gray-50 [&_pre]:border-gray-200 [&_code]:text-gray-800'
              }
              [&_h2]:border-b [&_h2]:pb-2
              ${isDark ? '[&_h2]:border-[#2d2d2d]' : '[&_h2]:border-gray-200'}
            `}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related tools */}
          <div className={`mt-10 p-5 rounded-xl border ${cardBg}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Try These Free JSON Tools</h3>
            <div className="flex flex-wrap gap-2">
              {RELATED_TOOLS.map(t => (
                <Link
                  key={t.href}
                  to={t.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors hover:text-brand-400 hover:border-blue-500/40 ${
                    isDark ? 'border-[#3d3d3d] text-gray-400' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Post navigation */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                to={`/blog/${prevPost.slug}`}
                className={`p-4 rounded-xl border transition-all group hover:border-brand-500/30 ${cardBg}`}
              >
                <p className={`text-xs mb-1 flex items-center gap-1 ${textMuted}`}>
                  <ArrowLeft size={11} /> Previous
                </p>
                <p className={`text-sm font-medium group-hover:text-brand-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {prevPost.title}
                </p>
              </Link>
            )}
            {nextPost && (
              <Link
                to={`/blog/${nextPost.slug}`}
                className={`p-4 rounded-xl border transition-all group hover:border-brand-500/30 text-right ${cardBg} ${!prevPost ? 'sm:col-start-2' : ''}`}
              >
                <p className={`text-xs mb-1 flex items-center justify-end gap-1 ${textMuted}`}>
                  Next <ArrowRight size={11} />
                </p>
                <p className={`text-sm font-medium group-hover:text-brand-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
