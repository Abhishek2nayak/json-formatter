import { ToolPage } from '../ToolPage';

export function JsonToCsvPage() {
  return (
    <ToolPage
      mode="to-csv"
      seo={{
        title: 'JSON to CSV Converter Online Free | JsonWorkspace',
        description: 'Convert JSON to CSV online for free. Transform JSON arrays into spreadsheet-ready CSV format instantly. Download or copy the result.',
        canonical: '/json-to-csv',
      }}
      content={{
        h1: 'JSON to CSV Converter Online — Free & Instant',
        intro: 'Convert JSON arrays to CSV format in one click with JsonWorkspace\'s free online JSON to CSV converter. Perfect for importing API data into Excel, Google Sheets, Tableau, or any tool that accepts CSV files. Handles nested objects, special characters, and large datasets.',
        howTo: [
          { step: 'Paste your JSON array', desc: 'Paste a JSON array of objects into the input editor. Each object becomes a row in the CSV.' },
          { step: 'Click Convert to CSV', desc: 'Click the Convert button to instantly generate the CSV output.' },
          { step: 'Download or copy', desc: 'Download as a .csv file or copy to clipboard for pasting into Excel or Google Sheets.' },
        ],
        benefits: [
          'Converts JSON arrays to tabular CSV format',
          'Auto-extracts column headers from JSON keys',
          'Handles commas and quotes in values correctly',
          'Supports nested JSON objects (flattened with dot notation)',
          'Download as .csv file or copy to clipboard',
          'Compatible with Excel, Google Sheets, and Tableau',
          'Free and instant — no sign-up required',
          'Private — all conversion happens in your browser',
        ],
        faq: [
          {
            question: 'What JSON structure works best for CSV conversion?',
            answer: 'An array of flat objects works best: [{\"name\":\"Alice\",\"age\":30},{\"name\":\"Bob\",\"age\":25}]. Each object becomes a row, and the keys become column headers.',
          },
          {
            question: 'What if my JSON has nested objects?',
            answer: 'Nested objects are flattened using dot notation. For example, {"user": {"name": "Alice"}} becomes a column named "user.name" in the CSV.',
          },
          {
            question: 'What if my JSON is a single object, not an array?',
            answer: 'A single object is converted to a two-column CSV with "key" and "value" columns, one row per property.',
          },
          {
            question: 'Can I open the CSV in Excel?',
            answer: 'Yes. Download the .csv file and open it directly in Excel, Google Sheets, or any spreadsheet application.',
          },
          {
            question: 'Are special characters handled correctly?',
            answer: 'Yes. Values containing commas, quotes, or newlines are automatically enclosed in double quotes and escaped according to the CSV standard (RFC 4180).',
          },
        ],
        relatedTools: [
          { label: 'JSON to XML', href: '/json-to-xml' },
          { label: 'JSON to YAML', href: '/json-to-yaml' },
          { label: 'JSON Formatter', href: '/json-formatter' },
          { label: 'JSON Validator', href: '/json-validator' },
          { label: 'Full Editor', href: '/app' },
        ],
      }}
    />
  );
}
