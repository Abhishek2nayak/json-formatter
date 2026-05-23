import { ToolPage } from '../ToolPage';

export function JsonPrettifierPage() {
  return (
    <ToolPage
      mode="prettify"
      seo={{
        title: 'JSON Prettifier Online Free — Pretty Print JSON | JsonWorkspace',
        description: 'Prettify JSON online for free. Transform minified, ugly JSON into clean, indented, human-readable format instantly.',
        canonical: '/json-prettifier',
      }}
      content={{
        h1: 'JSON Prettifier Online — Pretty Print JSON for Free',
        intro: 'The JsonWorkspace JSON Prettifier transforms compact, unreadable JSON into a clean, properly indented format. Whether you got a minified API response, a one-liner config file, or raw JSON data, our prettifier makes it instantly readable. Paste and prettify in one click.',
        howTo: [
          { step: 'Paste your minified JSON', desc: 'Paste compact or minified JSON into the input editor on the left.' },
          { step: 'Click Prettify JSON', desc: 'Click Prettify JSON to add indentation and line breaks automatically.' },
          { step: 'Copy or download the result', desc: 'Use the Copy button for clipboard or Download to save as a file.' },
        ],
        benefits: [
          'Instant prettification with 2-space indentation',
          'Transforms any valid JSON into readable format',
          'Great for debugging API responses',
          'Works with deeply nested JSON structures',
          'Auto-detects JSON arrays and objects',
          'No login or account required',
          'Fully private — client-side processing',
          'Free forever',
        ],
        faq: [
          {
            question: 'What is the difference between prettify and format?',
            answer: 'They are the same operation. "Prettify", "format", "beautify", and "pretty print" all refer to adding whitespace and indentation to make JSON human-readable. JsonWorkspace uses 2-space indentation by default.',
          },
          {
            question: 'Can I choose the indentation level?',
            answer: 'Yes. In the full JsonWorkspace editor (/app), you can choose 2 spaces, 4 spaces, or tabs from the indent menu. The prettifier tool uses 2-space indentation as the standard.',
          },
          {
            question: 'Does prettifying affect the data?',
            answer: 'No. Only whitespace is added. All values, keys, and structure remain completely unchanged.',
          },
        ],
        relatedTools: [
          { label: 'JSON Formatter', href: '/json-formatter' },
          { label: 'JSON Minifier', href: '/json-minifier' },
          { label: 'JSON Validator', href: '/json-validator' },
          { label: 'JSON to YAML', href: '/json-to-yaml' },
        ],
      }}
    />
  );
}
