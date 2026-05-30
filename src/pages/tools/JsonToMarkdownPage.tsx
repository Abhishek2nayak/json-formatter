import { ToolPage } from '../ToolPage';

export function JsonToMarkdownPage() {
  return (
    <ToolPage
      mode="to-markdown"
      seo={{
        title: 'JSON to Markdown Table Converter Online Free | JsonWorkspace',
        description: 'Convert JSON arrays to Markdown tables instantly. Paste a JSON array of objects and get a formatted Markdown table ready to paste into GitHub, Notion, or any Markdown editor.',
        canonical: '/json-to-markdown',
      }}
      content={{
        h1: 'JSON to Markdown Table Converter — Free & Instant',
        intro: 'Convert JSON arrays to clean Markdown tables with one click. Paste an array of objects and get a formatted | column | table | ready to use in GitHub READMEs, Notion pages, documentation sites, or any Markdown editor.',
        howTo: [
          { step: 'Paste your JSON array', desc: 'Paste a JSON array of objects into the left editor. Each object becomes a row, each key becomes a column.' },
          { step: 'Click Convert to Markdown', desc: 'Hit Convert and the Markdown table appears instantly with headers and separator row.' },
          { step: 'Copy or download', desc: 'Copy the table to clipboard or download as a .md file to drop straight into your documentation.' },
        ],
        benefits: [
          'Automatically detects all keys as column headers',
          'Properly escapes pipe characters inside values',
          'Works with any flat JSON array of objects',
          'Single objects converted to a 2-column key/value table',
          'Output is GitHub Flavored Markdown (GFM) compatible',
          'Download as .md file',
          'Free and instant — no account needed',
          'Client-side — your data never leaves your browser',
        ],
        faq: [
          { question: 'What JSON structure works best?', answer: 'An array of objects works best — each object becomes a table row. A single flat object is converted to a 2-column key/value table.' },
          { question: 'What happens with nested objects or arrays?', answer: 'Nested values are serialised as compact JSON strings inside the cell so no data is lost.' },
          { question: 'Is the output GitHub compatible?', answer: 'Yes. The output follows GitHub Flavored Markdown (GFM) table syntax and renders correctly on GitHub, GitLab, Notion, and most Markdown editors.' },
          { question: 'Can I convert large datasets?', answer: 'Yes. All processing is done in your browser so there are no size limits beyond your device memory.' },
        ],
        relatedTools: [
          { label: 'JSON to CSV', href: '/json-to-csv' },
          { label: 'JSON Formatter', href: '/json-formatter' },
          { label: 'JSON to YAML', href: '/json-to-yaml' },
          { label: 'JSON Validator', href: '/json-validator' },
        ],
      }}
    />
  );
}
