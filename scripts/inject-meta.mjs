/**
 * Post-build meta injection script.
 *
 * Vite produces a single dist/index.html for every route (CSR SPA).
 * Google crawls each URL and sees identical <title> and <meta name="description">
 * before JS runs — which it treats as duplicate content, blocking rankings.
 *
 * This script runs after `vite build` and copies dist/index.html to
 * dist/<route>.html for every known route, injecting the correct
 * title, description, canonical, and OG tags into each copy.
 *
 * Netlify serves dist/<route>.html at /<route> directly when the file
 * exists (clean URLs, no redirect), so Googlebot gets unique, correct
 * meta tags without executing any JS. Deliberately NOT dist/<route>/index.html —
 * Netlify's pretty-urls post-processing 301-redirects /<route> -> /<route>/
 * when a directory+index.html exists, which caused "Page with redirect"
 * and duplicate-canonical issues in Google Search Console.
 * The `/* /index.html 404` SPA fallback in _redirects still handles
 * any unknown route (see main.tsx NotFoundPage).
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');
const SITE = 'https://jsonworkspace.mythosh.com';

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

// Escape HTML entities so values are safe inside attribute quotes
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Replace a regex match using a callback to avoid `$` special-char issues
function sub(html, pattern, fn) {
  return html.replace(pattern, fn);
}

function inject(html, { title, description, url }) {
  const t = esc(title);
  const d = esc(description);
  const u = esc(url);

  html = sub(html, /<title>[^<]*<\/title>/,                                       () => `<title>${t}</title>`);
  html = sub(html, /(<meta name="description" content=")[^"]*(")/,                (_, a, b) => `${a}${d}${b}`);
  html = sub(html, /(<link rel="canonical" href=")[^"]*(")/,                      (_, a, b) => `${a}${u}${b}`);
  html = sub(html, /(<meta property="og:title" content=")[^"]*(")/,               (_, a, b) => `${a}${t}${b}`);
  html = sub(html, /(<meta property="og:description" content=")[^"]*(")/,         (_, a, b) => `${a}${d}${b}`);
  html = sub(html, /(<meta property="og:url" content=")[^"]*(")/,                 (_, a, b) => `${a}${u}${b}`);
  html = sub(html, /(<meta name="twitter:title" content=")[^"]*(")/,              (_, a, b) => `${a}${t}${b}`);
  html = sub(html, /(<meta name="twitter:description" content=")[^"]*(")/,        (_, a, b) => `${a}${d}${b}`);
  return html;
}

function writeRoute(slug, { title, description }) {
  const url = `${SITE}/${slug}`;
  const filePath = join(distDir, `${slug}.html`);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, inject(template, { title, description, url }));
  console.log(`  ✓ /${slug}`);
}

// ─── Static tool + page routes ───────────────────────────────────────────────

const ROUTES = [
  {
    slug: 'app',
    title: 'Full JSON Editor — Format, Validate, Compare & Convert | JsonWorkspace',
    description: 'The full JsonWorkspace editor. Format, validate, minify, compare JSON, convert to YAML/CSV/XML, generate Zod schemas, and more. Free, private, no login.',
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter Online Free — Beautify & Pretty Print JSON | JsonWorkspace',
    description: 'Format and beautify JSON online for free. Paste your JSON, click Format, and get clean, indented output instantly. Supports 2-space, 4-space, and tab indentation.',
  },
  {
    slug: 'json-validator',
    title: 'JSON Validator Online Free — Validate & Lint JSON | JsonWorkspace',
    description: 'Validate JSON online for free. Get exact error messages with line numbers and column positions. Fix invalid JSON instantly with auto-fix.',
  },
  {
    slug: 'json-minifier',
    title: 'JSON Minifier Online Free — Compress & Minify JSON | JsonWorkspace',
    description: 'Minify and compress JSON online for free. Remove all whitespace to reduce file size by up to 60%. Perfect for production APIs and storage optimization.',
  },
  {
    slug: 'json-prettifier',
    title: 'JSON Prettifier Online Free — Pretty Print JSON | JsonWorkspace',
    description: 'Prettify JSON online for free. Transform minified or raw JSON into clean, indented, human-readable format instantly. Supports 2-space, 4-space, and tab indentation.',
  },
  {
    slug: 'json-to-csv',
    title: 'JSON to CSV Converter Online Free | JsonWorkspace',
    description: 'Convert JSON to CSV online for free. Transform JSON arrays into spreadsheet-ready CSV format instantly. Download or copy the result.',
  },
  {
    slug: 'json-to-xml',
    title: 'JSON to XML Converter Online Free | JsonWorkspace',
    description: 'Convert JSON to XML format online for free. Instant conversion with proper XML structure, attributes, and formatting.',
  },
  {
    slug: 'json-to-yaml',
    title: 'JSON to YAML Converter Online Free | JsonWorkspace',
    description: 'Convert JSON to YAML online for free. Instant conversion for Kubernetes configs, Docker Compose, GitHub Actions, and CI/CD pipelines.',
  },
  {
    slug: 'json-compare',
    title: 'JSON Compare — Side-by-Side JSON Diff Online | JsonWorkspace',
    description: 'Compare two JSON objects side by side and instantly see added, removed, and changed keys. Free JSON diff tool — no login required.',
  },
  {
    slug: 'diff-checker',
    title: 'Diff Checker — Compare Text, Code & Files Online | JsonWorkspace',
    description: 'Free online diff checker. Compare any two text files or code snippets side by side with live syntax highlighting. Supports JSON, JS, Python, HTML, CSS, YAML, and more.',
  },
  {
    slug: 'jwt-decoder',
    title: 'JWT Decoder Online — Decode JSON Web Tokens Free | JsonWorkspace',
    description: 'Decode and inspect JWT tokens instantly in your browser. View header, payload, signature, and expiry information. 100% free, private, no data sent to server.',
  },
  {
    slug: 'base64',
    title: 'Base64 Encoder Decoder Online — Free Base64 Tool | JsonWorkspace',
    description: 'Encode or decode Base64 strings instantly in your browser. Supports URL-safe Base64, file upload, Unicode text, and size comparison. 100% free and private.',
  },
  {
    slug: 'url-encoder',
    title: 'URL Encoder Decoder Online — Free URL Encoding Tool | JsonWorkspace',
    description: 'Encode or decode URLs and URL components instantly. Supports encodeURIComponent and encodeURI modes with URL parsing and query parameter breakdown. Free and private.',
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester Online — Test Regular Expressions Free | JsonWorkspace',
    description: 'Test and debug regular expressions in real time. Highlights all matches, shows capture groups, and includes a cheat sheet for common patterns. Free and private.',
  },
  {
    slug: 'json-to-zod',
    title: 'JSON to Zod Schema Generator — Free Online | JsonWorkspace',
    description: 'Convert any JSON object to a TypeScript Zod schema instantly. Auto-infers types for strings, numbers, booleans, arrays, nested objects, and null. Free and private.',
  },
  {
    slug: 'blog',
    title: 'JSON Blog — Developer Guides & Tutorials | JsonWorkspace',
    description: 'Learn JSON fundamentals, debugging tips, conversion guides, and best practices for developers. Free articles from the JsonWorkspace team.',
  },
  {
    slug: 'json-path',
    title: 'JSONPath Explorer — Test & Run JSONPath Expressions Online | JsonWorkspace',
    description: 'Test JSONPath expressions on real JSON. Instantly see matching values with path annotations. Free online JSONPath tester with Monaco Editor.',
  },
  {
    slug: 'json-to-code',
    title: 'JSON to Code Generator — TypeScript, Python, Go, SQL | JsonWorkspace',
    description: 'Generate TypeScript interfaces, Python dataclasses, Go structs, SQL tables, Rust structs, and C# classes from any JSON. Free online code generator.',
  },
  {
    slug: 'mock-generator',
    title: 'JSON Mock Data Generator — Generate Fake Test Data | JsonWorkspace',
    description: 'Generate realistic fake JSON test data instantly. Paste a sample JSON object and get N records with smart field detection using Faker.js.',
  },
  {
    slug: 'json-to-markdown',
    title: 'JSON to Markdown Table Converter Online Free | JsonWorkspace',
    description: 'Convert JSON arrays to Markdown tables instantly. Paste a JSON array of objects and get a formatted Markdown table ready to paste into GitHub, Notion, or any Markdown editor.',
  },
];

// ─── Blog post routes ─────────────────────────────────────────────────────────

const BLOG_POSTS = [
  {
    slug: 'blog/what-is-json-and-how-it-works',
    title: 'What is JSON? Complete Guide for Developers | JsonWorkspace',
    description: 'Learn what JSON is, how it works, its syntax rules, data types, and why it became the standard data format for APIs and web applications.',
  },
  {
    slug: 'blog/how-to-format-json-online',
    title: 'How to Format JSON Online Free — Step by Step | JsonWorkspace',
    description: 'Learn how to format JSON online for free. Step-by-step guide to beautify, indent, and pretty-print JSON using JsonWorkspace.',
  },
  {
    slug: 'blog/fix-json-parse-error',
    title: 'Fix JSON Parse Error — Common Causes & Solutions | JsonWorkspace',
    description: 'JSON parse errors stopping you? Learn the most common JSON syntax errors and how to fix them fast using JsonWorkspace\'s auto-fix feature.',
  },
  {
    slug: 'blog/json-vs-xml',
    title: 'JSON vs XML: Key Differences & When to Use Each | JsonWorkspace',
    description: 'JSON vs XML comparison: performance, readability, use cases, and when to choose each format in modern web development.',
  },
  {
    slug: 'blog/best-json-formatter-tools',
    title: 'Best JSON Formatter Tools in 2025 — Reviewed | JsonWorkspace',
    description: 'Compare the best online JSON formatter tools in 2025: features, speed, privacy, and which one fits your workflow.',
  },
  {
    slug: 'blog/how-to-convert-json-to-csv',
    title: 'Convert JSON to CSV Online Free — Complete Guide | JsonWorkspace',
    description: 'Learn how to convert JSON to CSV online for free. Handle nested JSON, arrays, and download your CSV file instantly.',
  },
  {
    slug: 'blog/json-validator-explained',
    title: 'JSON Validator: How It Works & What to Check | JsonWorkspace',
    description: 'Understand how JSON validation works, the difference between syntax and schema validation, and how to use a JSON validator effectively.',
  },
  {
    slug: 'blog/common-json-mistakes',
    title: '8 Common JSON Mistakes & How to Fix Them | JsonWorkspace',
    description: 'Avoid the most common JSON mistakes: trailing commas, single quotes, missing brackets, and more. With examples and fixes for each.',
  },
  {
    slug: 'blog/json-minify-vs-prettify',
    title: 'JSON Minify vs Prettify: Differences & When to Use | JsonWorkspace',
    description: 'Understand the difference between JSON minification and prettification, and when each is appropriate in development and production.',
  },
  {
    slug: 'blog/how-apis-use-json',
    title: 'How REST APIs Use JSON — Developer Guide | JsonWorkspace',
    description: 'Learn how REST APIs use JSON for requests and responses, JSON structure conventions, HTTP headers, and best practices for API developers.',
  },
  {
    slug: 'blog/how-to-parse-json-javascript',
    title: 'How to Parse JSON in JavaScript — JSON.parse() Guide | JsonWorkspace',
    description: 'Learn how to parse JSON in JavaScript using JSON.parse(), handle errors safely, parse nested JSON, and convert objects back to JSON strings.',
  },
  {
    slug: 'blog/regex-cheat-sheet',
    title: 'Regex Cheat Sheet 2025 — Complete Regular Expression Reference | JsonWorkspace',
    description: 'Complete regex cheat sheet covering character classes, quantifiers, anchors, groups, lookaheads, flags, and real-world patterns for email, URL, date, and more.',
  },
  {
    slug: 'blog/json-schema-validation-guide',
    title: 'JSON Schema Validation Guide — Types, Formats & Examples | JsonWorkspace',
    description: 'Learn JSON Schema validation from scratch. Covers types, required fields, string formats, numbers, arrays, nested objects, $ref, and how to validate in JavaScript.',
  },
  {
    slug: 'blog/jsonlint-alternative-jsonworkspace',
    title: 'JSONLint Alternative for Developers in 2026 | JSONWorkspace',
    description: 'JSONLint is fine for basic validation, but if you want dark mode, a tree view, JSONPath queries, type generation, and history — you need JSONWorkspace. Here\'s the honest comparison.',
  },
  {
    slug: 'blog/json-formatter-comparison-2026',
    title: 'Best Online JSON Formatter 2026 — Honest Comparison | JSONWorkspace',
    description: 'Tested JSONFormatter.org, JSONLint, JSON Crack, Postman, and others against JSONWorkspace. Real differences in editor quality, features, privacy, and mobile experience.',
  },
  {
    slug: 'blog/jsonpath-explorer-how-to-query-json-online',
    title: 'JSONPath Explorer Online — Query JSON with JSONPath Expressions Free | JSONWorkspace',
    description: 'JSONPath lets you query JSON like SQL queries a database. Our free online JSONPath Explorer highlights matches in real time — no setup, works with any JSON.',
  },
  {
    slug: 'blog/new-features-jsonpath-code-generator-mock-data-share',
    title: 'New: JSONPath Explorer, Code Generator, Mock Data Generator | JSONWorkspace',
    description: 'We shipped JSONPath Explorer, a code generator for TypeScript/Python/Go/SQL, a mock data generator, share-via-URL, saved snippets, JSON-to-Markdown, and a browser extension. Here\'s what each one does.',
  },
  {
    slug: 'blog/json-browser-extension-for-chrome',
    title: 'JSON Formatter Chrome Extension — JSONWorkspace | Format JSON in Browser',
    description: 'Our Chrome extension detects raw JSON pages and opens them in JSONWorkspace with one click. Smarter than built-in browser JSON viewers and doesn\'t override your default rendering.',
  },
];

// ─── Run ──────────────────────────────────────────────────────────────────────

console.log('\nInjecting per-route meta tags into dist/...\n');

for (const route of [...ROUTES, ...BLOG_POSTS]) {
  writeRoute(route.slug, route);
}

const total = ROUTES.length + BLOG_POSTS.length;
console.log(`\nDone — ${total} routes generated with unique title + meta.\n`);
