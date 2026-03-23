import { ToolPage } from '../ToolPage';

export function JsonFormatterPage() {
  return (
    <ToolPage
      mode="format"
      seo={{
        title: 'JSON Formatter Online Free — Beautify & Pretty Print JSON | JsonMaster',
        description: 'Format and beautify JSON online for free. Paste your JSON, click Format, and get clean, indented output instantly. Supports 2-space, 4-space, and tab indentation.',
        canonical: '/json-formatter',
      }}
      content={{
        h1: 'JSON Formatter Online — Free JSON Beautifier',
        intro: 'The JsonMaster JSON Formatter instantly beautifies and pretty-prints your JSON with proper indentation and syntax highlighting. Whether you\'re debugging an API response or cleaning up a config file, this tool makes messy JSON readable in one click. All processing is 100% client-side — your JSON never leaves your browser.',
        howTo: [
          { step: 'Paste your JSON', desc: 'Paste raw or minified JSON into the input editor on the left.' },
          { step: 'Click Format JSON', desc: 'Hit the Format JSON button or press Ctrl+Shift+F for instant formatting.' },
          { step: 'Copy or Download', desc: 'Copy the formatted JSON to clipboard or download it as a .json file.' },
        ],
        benefits: [
          'Instant formatting with one click',
          'Supports 2-space, 4-space, and tab indentation',
          'Monaco editor with full syntax highlighting',
          'Auto-format on paste — no button needed',
          'Auto-fix for common JSON errors',
          'Handles JSON files up to 50MB',
          '100% client-side — fully private',
          'Dark and light mode',
        ],
        faq: [
          {
            question: 'What is a JSON Formatter?',
            answer: 'A JSON formatter (also called a JSON beautifier) takes minified or raw JSON text and adds indentation, line breaks, and whitespace to make it human-readable without changing any data.',
          },
          {
            question: 'Does formatting change the JSON data?',
            answer: 'No. Formatting only adds whitespace characters. All key names, values, and data structure remain identical — only the visual presentation changes.',
          },
          {
            question: 'Can I format large JSON files?',
            answer: 'Yes. JsonMaster supports files up to 50MB with virtualized rendering for smooth performance even with very large JSON documents.',
          },
          {
            question: 'Is my JSON data safe?',
            answer: 'Completely. All JSON processing happens in your browser using JavaScript. Nothing is sent to any server. Your data never leaves your device.',
          },
          {
            question: 'What indentation should I use?',
            answer: '2 spaces is the most common standard, used by most JavaScript projects, npm, and JSON Schema. 4 spaces is common in Python and Java projects. Tabs are more compact and preferred in some older codebases.',
          },
        ],
        relatedTools: [
          { label: 'JSON Validator', href: '/json-validator' },
          { label: 'JSON Minifier', href: '/json-minifier' },
          { label: 'JSON Prettifier', href: '/json-prettifier' },
          { label: 'JSON to YAML', href: '/json-to-yaml' },
          { label: 'Full Editor', href: '/app' },
        ],
      }}
    />
  );
}
