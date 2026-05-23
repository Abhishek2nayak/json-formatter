import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../../constants';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  faqSchema?: Array<{ question: string; answer: string }>;
  /** Emits WebApplication structured data */
  isToolPage?: boolean;
  /** Emits Article structured data for blog posts */
  articleSchema?: {
    headline: string;
    datePublished: string;
    dateModified?: string;
    description: string;
  };
  breadcrumbs?: BreadcrumbItem[];
}

export function SEOHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = `${SITE_URL}/og-image.png`,
  noindex = false,
  faqSchema,
  isToolPage = false,
  articleSchema,
  breadcrumbs,
}: SEOHeadProps) {
  const robotsContent = noindex ? 'noindex, follow' : 'index, follow';

  const faqJsonLd =
    faqSchema && faqSchema.length > 0
      ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      })
      : null;

  const toolJsonLd = isToolPage
    ? JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title.split('|')[0].split('—')[0].trim(),
      url: canonical,
      description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: {
        '@type': 'Organization',
        name: 'JsonWorkspace',
        url: SITE_URL,
      },
    })
    : null;

  const articleJsonLd = articleSchema
    ? JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: articleSchema.headline,
      description: articleSchema.description,
      url: canonical,
      datePublished: articleSchema.datePublished,
      dateModified: articleSchema.dateModified ?? articleSchema.datePublished,
      author: {
        '@type': 'Organization',
        name: 'JsonWorkspace',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'JsonWorkspace',
        url: SITE_URL,
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    })
    : null;

  const breadcrumbJsonLd =
    breadcrumbs && breadcrumbs.length > 0
      ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      })
      : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="JsonWorkspace" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {faqJsonLd && (
        <script type="application/ld+json">{faqJsonLd}</script>
      )}
      {toolJsonLd && (
        <script type="application/ld+json">{toolJsonLd}</script>
      )}
      {articleJsonLd && (
        <script type="application/ld+json">{articleJsonLd}</script>
      )}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">{breadcrumbJsonLd}</script>
      )}
    </Helmet>
  );
}
