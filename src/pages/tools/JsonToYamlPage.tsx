import { ToolPage } from '../ToolPage';

export function JsonToYamlPage() {
  return (
    <ToolPage
      mode="to-yaml"
      seo={{
        title: 'JSON to YAML Converter Online Free | JsonWorkspace',
        description: 'Convert JSON to YAML online for free. Instant conversion for Kubernetes configs, Docker Compose, GitHub Actions, and CI/CD pipelines.',
        canonical: '/json-to-yaml',
      }}
      content={{
        h1: 'JSON to YAML Converter Online — Free & Instant',
        intro: 'Convert JSON to YAML format instantly with JsonWorkspace\'s free online converter. YAML is the preferred format for Kubernetes manifests, Docker Compose files, GitHub Actions workflows, Ansible playbooks, and most modern DevOps configuration files. Convert your JSON config to YAML in one click.',
        howTo: [
          { step: 'Paste your JSON', desc: 'Paste any valid JSON into the input editor on the left.' },
          { step: 'Click Convert to YAML', desc: 'Hit Convert and get clean YAML output with proper indentation instantly.' },
          { step: 'Copy or download', desc: 'Copy the YAML to clipboard or download as a .yaml file for direct use in your project.' },
        ],
        benefits: [
          'Generates clean, properly indented YAML',
          'Perfect for Kubernetes, Docker, and CI/CD configs',
          'Handles complex nested structures correctly',
          'Preserves all data types (numbers, booleans, null)',
          'Download as .yaml file',
          'Free and instant — no account needed',
          'Client-side — your data never leaves your browser',
          'Handles arrays, objects, and primitives correctly',
        ],
        faq: [
          {
            question: 'Why convert JSON to YAML?',
            answer: 'YAML is more human-readable than JSON for configuration files. It supports comments, uses less punctuation, and is the standard format for Kubernetes, Docker Compose, GitHub Actions, Ansible, and most DevOps tools.',
          },
          {
            question: 'Are all JSON data types preserved in YAML?',
            answer: 'Yes. Numbers remain numbers, booleans remain true/false, null remains null, strings are preserved, and nested objects and arrays are properly represented in YAML syntax.',
          },
          {
            question: 'Can YAML be converted back to JSON?',
            answer: 'Yes, YAML is a superset of JSON. You can convert YAML back to JSON, though YAML features like comments are lost. Use our full editor for YAML to JSON conversion.',
          },
          {
            question: 'Why does my Kubernetes manifest use YAML instead of JSON?',
            answer: 'Kubernetes supports both formats, but YAML is preferred because it supports comments (great for documentation), is more readable, and requires less punctuation than JSON. Most Kubernetes examples and tooling default to YAML.',
          },
        ],
        relatedTools: [
          { label: 'JSON to CSV', href: '/json-to-csv' },
          { label: 'JSON to XML', href: '/json-to-xml' },
          { label: 'JSON Formatter', href: '/json-formatter' },
          { label: 'JSON Validator', href: '/json-validator' },
          { label: 'Full Editor', href: '/app' },
        ],
      }}
    />
  );
}
