import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  faqSchema?: Array<{ question: string; answer: string }>;
}

export function SEOHead({ title, description, canonical, ogType = 'website', faqSchema }: SEOHeadProps) {
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

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', 'JsonMaster', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical || window.location.href);

    // FAQ structured data
    if (faqSchema && faqSchema.length > 0) {
      let schemaEl = document.getElementById('faq-schema');
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = 'faq-schema';
        schemaEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      });
    }

    return () => {
      const schemaEl = document.getElementById('faq-schema');
      if (schemaEl) schemaEl.remove();
    };
  }, [title, description, canonical, ogType, faqSchema]);

  return null;
}
