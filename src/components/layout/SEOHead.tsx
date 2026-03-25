import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  faqSchema?: Array<{ question: string; answer: string }>;
  /** Set to true on tool pages to emit WebApplication structured data */
  isToolPage?: boolean;
}

export function SEOHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = 'https://jsonmaster.dev/og-image.png',
  faqSchema,
  isToolPage = false,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const canonicalHref = canonical || window.location.href;

    // Primary meta
    setMeta('description', description);
    setMeta('robots', 'index, follow');

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', 'JsonMaster', true);
    setMeta('og:url', canonicalHref, true);
    setMeta('og:image', ogImage, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalHref);

    // FAQ structured data
    let faqEl = document.getElementById('faq-schema');
    if (faqSchema && faqSchema.length > 0) {
      if (!faqEl) {
        faqEl = document.createElement('script');
        faqEl.id = 'faq-schema';
        faqEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(faqEl);
      }
      faqEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      });
    } else if (faqEl) {
      faqEl.remove();
    }

    // WebApplication structured data for tool pages
    let toolEl = document.getElementById('tool-schema');
    if (isToolPage) {
      if (!toolEl) {
        toolEl = document.createElement('script');
        toolEl.id = 'tool-schema';
        toolEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(toolEl);
      }
      toolEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: title.split('|')[0].trim(),
        url: canonicalHref,
        description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'JsonMaster', url: 'https://jsonmaster.dev' },
      });
    } else if (toolEl) {
      toolEl.remove();
    }

    return () => {
      document.getElementById('faq-schema')?.remove();
      document.getElementById('tool-schema')?.remove();
    };
  }, [title, description, canonical, ogType, ogImage, faqSchema, isToolPage]);

  return null;
}
