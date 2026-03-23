import { ToolPage } from '../ToolPage';

export function JsonMinifierPage() {
  return (
    <ToolPage
      mode="minify"
      seo={{
        title: 'JSON Minifier Online Free — Compress & Minify JSON | JsonMaster',
        description: 'Minify and compress JSON online for free. Remove all whitespace to reduce file size by up to 60%. Perfect for production APIs and storage optimization.',
        canonical: '/json-minifier',
      }}
      content={{
        h1: 'JSON Minifier Online — Free JSON Compressor',
        intro: 'The JsonMaster JSON Minifier removes all unnecessary whitespace, line breaks, and indentation from your JSON to produce the smallest possible output. Minified JSON loads faster, uses less bandwidth, and takes up less storage — ideal for production APIs, localStorage, and any performance-critical application.',
        howTo: [
          { step: 'Paste formatted JSON', desc: 'Paste your pretty-printed or formatted JSON into the input editor.' },
          { step: 'Click Minify JSON', desc: 'Click the Minify JSON button to compress your JSON into a single line.' },
          { step: 'Copy or download', desc: 'Copy the minified JSON to clipboard or download as a file for deployment.' },
        ],
        benefits: [
          'Reduces JSON size by up to 60%',
          'Instant one-click compression',
          'Produces valid, parseable JSON output',
          'Perfect for production API payloads',
          'Optimizes localStorage and cookie usage',
          'Copy or download the minified result',
          'Handles files up to 50MB',
          'Free and client-side — no data sent to servers',
        ],
        faq: [
          {
            question: 'Does minifying JSON change the data?',
            answer: 'No. Minification only removes whitespace characters (spaces, tabs, newlines). All keys, values, arrays, and objects remain completely unchanged. The data is 100% identical.',
          },
          {
            question: 'How much does minification reduce JSON size?',
            answer: 'Typically 20–60% reduction depending on how much whitespace the original has. A JSON file with 4-space indentation and many nested levels will see larger reductions than a 2-space indented file.',
          },
          {
            question: 'Should I minify JSON for APIs?',
            answer: 'If your server uses gzip/brotli compression, the benefit is smaller since compression already handles repetitive whitespace well. However, minification still reduces parsing time and helps with uncompressed channels like localStorage.',
          },
          {
            question: 'How do I un-minify JSON?',
            answer: 'Use our JSON Formatter to re-add indentation and whitespace, making the minified JSON readable again.',
          },
        ],
        relatedTools: [
          { label: 'JSON Formatter', href: '/json-formatter' },
          { label: 'JSON Prettifier', href: '/json-prettifier' },
          { label: 'JSON Validator', href: '/json-validator' },
          { label: 'Full Editor', href: '/app' },
        ],
      }}
    />
  );
}
