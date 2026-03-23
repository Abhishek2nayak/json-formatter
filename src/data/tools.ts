export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  icon: string;
  color: string;
  category: 'format' | 'convert' | 'validate';
  keywords: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 'formatter',
    name: 'JSON Formatter',
    slug: 'json-formatter',
    description: 'Format and beautify JSON online with syntax highlighting and auto-indentation.',
    shortDesc: 'Beautify & pretty-print JSON',
    icon: '{}',
    color: 'blue',
    category: 'format',
    keywords: ['json formatter', 'json beautifier', 'json pretty print', 'format json online'],
  },
  {
    id: 'validator',
    name: 'JSON Validator',
    slug: 'json-validator',
    description: 'Validate JSON online instantly. Get exact error messages with line numbers.',
    shortDesc: 'Validate JSON & find errors',
    icon: '✓',
    color: 'green',
    category: 'validate',
    keywords: ['json validator', 'validate json online', 'json lint', 'json checker'],
  },
  {
    id: 'minifier',
    name: 'JSON Minifier',
    slug: 'json-minifier',
    description: 'Minify and compress JSON to reduce file size by removing whitespace.',
    shortDesc: 'Compress & minify JSON',
    icon: '↓',
    color: 'orange',
    category: 'format',
    keywords: ['json minifier', 'minify json', 'compress json', 'json compressor'],
  },
  {
    id: 'prettifier',
    name: 'JSON Prettifier',
    slug: 'json-prettifier',
    description: 'Prettify JSON with customizable indentation — 2 spaces, 4 spaces, or tabs.',
    shortDesc: 'Prettify JSON with indentation',
    icon: '≡',
    color: 'purple',
    category: 'format',
    keywords: ['json prettifier', 'prettify json', 'json indent', 'json pretty'],
  },
  {
    id: 'to-csv',
    name: 'JSON to CSV',
    slug: 'json-to-csv',
    description: 'Convert JSON arrays to CSV format instantly. Download or copy the result.',
    shortDesc: 'Convert JSON arrays to CSV',
    icon: '⊞',
    color: 'teal',
    category: 'convert',
    keywords: ['json to csv', 'convert json to csv', 'json csv converter', 'export json as csv'],
  },
  {
    id: 'to-xml',
    name: 'JSON to XML',
    slug: 'json-to-xml',
    description: 'Convert JSON to XML format with proper structure and attributes.',
    shortDesc: 'Convert JSON to XML',
    icon: '</>',
    color: 'red',
    category: 'convert',
    keywords: ['json to xml', 'convert json to xml', 'json xml converter'],
  },
  {
    id: 'to-yaml',
    name: 'JSON to YAML',
    slug: 'json-to-yaml',
    description: 'Convert JSON to YAML format. Perfect for Kubernetes configs and CI/CD pipelines.',
    shortDesc: 'Convert JSON to YAML',
    icon: '—',
    color: 'yellow',
    category: 'convert',
    keywords: ['json to yaml', 'convert json to yaml', 'json yaml converter'],
  },
];

export const TOOL_COLORS: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};
