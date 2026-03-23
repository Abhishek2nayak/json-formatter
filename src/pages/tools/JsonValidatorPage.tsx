import { ToolPage } from '../ToolPage';

export function JsonValidatorPage() {
  return (
    <ToolPage
      mode="validate"
      seo={{
        title: 'JSON Validator Online Free — Validate & Lint JSON | JsonMaster',
        description: 'Validate JSON online for free. Get exact error messages with line numbers and column positions. Fix invalid JSON instantly with auto-fix.',
        canonical: '/json-validator',
      }}
      content={{
        h1: 'JSON Validator Online — Free JSON Lint Tool',
        intro: 'The JsonMaster JSON Validator checks your JSON for syntax errors in real-time and shows the exact line number and position of every problem. Paste any JSON — from API responses to config files — and get instant validation with actionable error messages. No login required, completely free.',
        howTo: [
          { step: 'Paste your JSON', desc: 'Paste the JSON you want to validate into the input editor.' },
          { step: 'Click Validate JSON', desc: 'Hit Validate JSON to check for syntax errors. Real-time validation also runs as you type.' },
          { step: 'Review errors or success', desc: 'See the exact error message with line and column number, or a green success indicator if valid.' },
          { step: 'Auto-fix errors', desc: 'Click Auto Fix to automatically correct trailing commas, single quotes, and unquoted keys.' },
        ],
        benefits: [
          'Real-time validation as you type',
          'Exact error location with line and column numbers',
          'Clear, human-readable error messages',
          'Auto-fix for the most common JSON errors',
          'Validates JSON of any size',
          'No signup or registration required',
          '100% private — client-side only',
          'Free forever',
        ],
        faq: [
          {
            question: 'What does a JSON Validator check for?',
            answer: 'A JSON validator checks for syntax errors: missing quotes around keys, trailing commas, mismatched brackets, single quotes instead of double quotes, invalid values like undefined or NaN, and unescaped characters in strings.',
          },
          {
            question: 'What is the difference between JSON validation and JSON Schema validation?',
            answer: 'Syntax validation checks whether JSON is well-formed (can be parsed). Schema validation checks whether the JSON matches a specific expected structure — correct types, required fields, value ranges. JsonMaster\'s validator handles syntax validation. Use the Schema tab in the full editor for schema validation.',
          },
          {
            question: 'Why is my valid-looking JSON showing an error?',
            answer: 'Common causes: trailing commas after the last item, using single quotes instead of double quotes, JavaScript comments inside JSON, or using undefined as a value (JSON only allows null, not undefined).',
          },
          {
            question: 'Can I validate JSON from an API endpoint?',
            answer: 'Yes. In the full JsonMaster editor, use the URL button to fetch JSON directly from any API endpoint and validate it automatically.',
          },
        ],
        relatedTools: [
          { label: 'JSON Formatter', href: '/json-formatter' },
          { label: 'JSON Minifier', href: '/json-minifier' },
          { label: 'JSON to YAML', href: '/json-to-yaml' },
          { label: 'Full Editor', href: '/app' },
        ],
      }}
    />
  );
}
