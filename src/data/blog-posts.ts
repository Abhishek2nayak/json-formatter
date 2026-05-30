export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  content: string; // Markdown-like HTML string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-json-and-how-it-works',
    title: 'What is JSON and How Does it Work?',
    metaTitle: 'What is JSON? Complete Guide for Developers | JsonWorkspace',
    metaDescription: 'Learn what JSON is, how it works, its syntax rules, data types, and why it became the standard data format for APIs and web applications.',
    publishedAt: '2025-11-01',
    readingTime: 7,
    category: 'Fundamentals',
    tags: ['json', 'basics', 'web development', 'api'],
    content: `
<h2>What is JSON?</h2>
<p>JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format that is easy for humans to read and write, and easy for machines to parse and generate. Despite its name, JSON is language-independent and is used across virtually every modern programming language.</p>

<p>It was derived from JavaScript but has become the dominant format for REST APIs, configuration files, and data storage. Today, you'll find JSON everywhere — from API responses to npm package.json files, from AWS config to database documents in MongoDB.</p>

<h2>JSON Syntax Rules</h2>
<p>JSON has six data types and a strict syntax:</p>
<ul>
  <li><strong>String:</strong> Always double-quoted — <code>"hello world"</code></li>
  <li><strong>Number:</strong> Integer or float — <code>42</code>, <code>3.14</code></li>
  <li><strong>Boolean:</strong> Lowercase only — <code>true</code>, <code>false</code></li>
  <li><strong>Null:</strong> Lowercase — <code>null</code></li>
  <li><strong>Array:</strong> Ordered list — <code>[1, 2, 3]</code></li>
  <li><strong>Object:</strong> Key-value pairs — <code>{"key": "value"}</code></li>
</ul>

<h2>A Simple JSON Example</h2>
<pre><code>{
  "user": {
    "id": 101,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "active": true,
    "roles": ["admin", "editor"],
    "address": null
  }
}</code></pre>

<h2>JSON vs Other Formats</h2>
<p>Before JSON became dominant, XML was the standard. JSON won because it's:</p>
<ul>
  <li>Easier to read (less verbose than XML)</li>
  <li>Natively supported in JavaScript (no parsing library needed)</li>
  <li>Smaller payload size compared to XML</li>
  <li>Directly mappable to objects in most languages</li>
</ul>

<h2>Parsing JSON in Different Languages</h2>
<p><strong>JavaScript:</strong> <code>JSON.parse(text)</code> and <code>JSON.stringify(obj)</code></p>
<p><strong>Python:</strong> <code>json.loads(text)</code> and <code>json.dumps(obj)</code></p>
<p><strong>Java:</strong> Libraries like Gson or Jackson</p>
<p><strong>Go:</strong> <code>encoding/json</code> standard library</p>

<h2>Common JSON Mistakes to Avoid</h2>
<ol>
  <li>Using single quotes instead of double quotes for strings</li>
  <li>Leaving trailing commas after the last item</li>
  <li>Using <code>undefined</code> (not a valid JSON value)</li>
  <li>Adding comments (JSON doesn't support comments)</li>
  <li>Using <code>NaN</code> or <code>Infinity</code> as number values</li>
</ol>

<h2>Try the JsonWorkspace Tools</h2>
<p>Use our <a href="/json-formatter">JSON Formatter</a> to beautify raw JSON, or the <a href="/json-validator">JSON Validator</a> to check your JSON for errors instantly.</p>

<h2>FAQ</h2>
<h3>Is JSON case-sensitive?</h3>
<p>Yes. JSON keys and string values are case-sensitive. <code>"Name"</code> and <code>"name"</code> are different keys.</p>

<h3>Can JSON have comments?</h3>
<p>No. Standard JSON does not support comments. If you need comments, consider JSONC (JSON with Comments) supported in VS Code settings.</p>

<h3>What is the maximum size for JSON?</h3>
<p>There is no official size limit in the spec, but most APIs limit request bodies (typically 1MB–10MB). Large JSON should be paginated or compressed.</p>
`,
  },
  {
    slug: 'how-to-format-json-online',
    title: 'How to Format JSON Online — The Complete Guide',
    metaTitle: 'How to Format JSON Online Free — Step by Step | JsonWorkspace',
    metaDescription: 'Learn how to format JSON online for free. Step-by-step guide to beautify, indent, and pretty-print JSON using JsonWorkspace.',
    publishedAt: '2025-11-05',
    readingTime: 5,
    category: 'How-To',
    tags: ['json formatter', 'format json', 'beautify json', 'online tool'],
    content: `
<h2>Why Format JSON?</h2>
<p>Raw JSON from APIs often looks like a wall of text — minified, with no line breaks or indentation. This makes it nearly impossible to read, debug, or understand. Formatting (or "prettifying") JSON adds indentation and line breaks to make the structure clear.</p>

<p>Example of unformatted JSON:</p>
<pre><code>{"user":{"id":1,"name":"Alice","roles":["admin","editor"],"active":true}}</code></pre>

<p>After formatting with 2-space indentation:</p>
<pre><code>{
  "user": {
    "id": 1,
    "name": "Alice",
    "roles": [
      "admin",
      "editor"
    ],
    "active": true
  }
}</code></pre>

<h2>How to Format JSON with JsonWorkspace</h2>
<ol>
  <li>Go to the <a href="/json-formatter">JSON Formatter</a> page</li>
  <li>Paste your JSON into the editor on the left</li>
  <li>Click the <strong>Format</strong> button (or press <kbd>Ctrl+Shift+F</kbd>)</li>
  <li>Your formatted JSON appears instantly</li>
  <li>Click <strong>Copy</strong> or <strong>Download</strong> to save it</li>
</ol>

<h2>Choosing the Right Indentation</h2>
<p>JsonWorkspace supports three indentation styles:</p>
<ul>
  <li><strong>2 spaces</strong> — Most common, used by JavaScript, React, JSON Schema</li>
  <li><strong>4 spaces</strong> — Preferred by Python, Java, C# developers</li>
  <li><strong>Tabs</strong> — Compact, used in many older codebases</li>
</ul>

<h2>Format JSON from a URL</h2>
<p>Working with an API? Use the <strong>URL</strong> button to fetch JSON directly from an endpoint and format it in one click. No copy-paste needed.</p>

<h2>Auto-Format on Paste</h2>
<p>JsonWorkspace automatically formats JSON when you paste it into the editor. This saves you a click every time.</p>

<h2>Keyboard Shortcuts</h2>
<ul>
  <li><kbd>Ctrl+Shift+F</kbd> — Format JSON</li>
  <li><kbd>Ctrl+M</kbd> — Minify JSON</li>
  <li><kbd>Ctrl+D</kbd> — Download JSON</li>
  <li><kbd>Ctrl+K</kbd> — Copy to clipboard</li>
</ul>

<h2>Related Tools</h2>
<p>After formatting, you might also want to <a href="/json-validator">validate your JSON</a> for errors, or <a href="/json-to-yaml">convert it to YAML</a> for config files.</p>

<h2>FAQ</h2>
<h3>Does formatting change the data?</h3>
<p>No. Formatting only adds whitespace for readability. The actual data values, keys, and structure remain identical.</p>

<h3>Can I format large JSON files?</h3>
<p>Yes. JsonWorkspace handles files up to 50MB with lazy rendering for smooth performance.</p>
`,
  },
  {
    slug: 'fix-json-parse-error',
    title: 'How to Fix JSON Parse Errors Easily',
    metaTitle: 'Fix JSON Parse Error — Common Causes & Solutions | JsonWorkspace',
    metaDescription: 'JSON parse errors stopping you? Learn the most common JSON syntax errors and how to fix them fast using JsonWorkspace\'s auto-fix feature.',
    publishedAt: '2025-11-10',
    readingTime: 6,
    category: 'Debugging',
    tags: ['json error', 'json parse error', 'debug json', 'fix json'],
    content: `
<h2>What is a JSON Parse Error?</h2>
<p>A JSON parse error occurs when a parser tries to convert a string into a JSON object but encounters invalid syntax. In JavaScript, this manifests as <code>SyntaxError: Unexpected token</code> or similar messages. These errors halt your application and can be frustrating to debug.</p>

<h2>The 8 Most Common JSON Errors</h2>

<h3>1. Trailing Commas</h3>
<p>The most common mistake. JSON doesn't allow a comma after the last item:</p>
<pre><code>// WRONG
{ "name": "Alice", "age": 30, }

// CORRECT
{ "name": "Alice", "age": 30 }</code></pre>

<h3>2. Single Quotes Instead of Double Quotes</h3>
<pre><code>// WRONG
{ 'name': 'Alice' }

// CORRECT
{ "name": "Alice" }</code></pre>

<h3>3. Unquoted Keys</h3>
<pre><code>// WRONG (valid JavaScript, invalid JSON)
{ name: "Alice" }

// CORRECT
{ "name": "Alice" }</code></pre>

<h3>4. Comments</h3>
<pre><code>// WRONG — JSON has no comments
{
  // This is the user object
  "name": "Alice"
}

// CORRECT — remove all comments
{
  "name": "Alice"
}</code></pre>

<h3>5. Undefined Values</h3>
<pre><code>// WRONG
{ "value": undefined }

// CORRECT
{ "value": null }</code></pre>

<h3>6. Unescaped Special Characters in Strings</h3>
<pre><code>// WRONG
{ "message": "He said "hello" to her" }

// CORRECT
{ "message": "He said \\"hello\\" to her" }</code></pre>

<h3>7. Missing Commas Between Properties</h3>
<pre><code>// WRONG
{
  "name": "Alice"
  "age": 30
}

// CORRECT
{
  "name": "Alice",
  "age": 30
}</code></pre>

<h3>8. Mismatched Brackets</h3>
<p>Every <code>{</code> needs a <code>}</code> and every <code>[</code> needs a <code>]</code>.</p>

<h2>How to Fix JSON Errors with JsonWorkspace</h2>
<ol>
  <li>Paste your broken JSON into the <a href="/json-validator">JSON Validator</a></li>
  <li>The error message shows the exact line and column of the problem</li>
  <li>Click the <strong>⚡ Fix</strong> button for auto-fix of common issues</li>
  <li>For complex errors, the Tree View highlights where parsing failed</li>
</ol>

<h2>Auto-Fix Capabilities</h2>
<p>JsonWorkspace's smart fixer automatically handles:</p>
<ul>
  <li>Trailing commas</li>
  <li>Single quotes → double quotes</li>
  <li>Unquoted keys</li>
  <li><code>undefined</code> → <code>null</code></li>
</ul>

<h2>FAQ</h2>
<h3>Why does JSON.parse throw an error in JavaScript?</h3>
<p>JSON.parse is strict — it follows the JSON spec exactly. JavaScript object literals are more lenient (allowing trailing commas, single quotes), which causes confusion when developers use JS object syntax in JSON contexts.</p>

<h3>How do I find the error position?</h3>
<p>The error message usually includes "at position N". Paste into JsonWorkspace and it highlights exactly which line and column has the problem.</p>
`,
  },
  {
    slug: 'json-vs-xml',
    title: 'JSON vs XML — Which Should You Use in 2025?',
    metaTitle: 'JSON vs XML: Key Differences & When to Use Each | JsonWorkspace',
    metaDescription: 'JSON vs XML comparison: performance, readability, use cases, and when to choose each format in modern web development.',
    publishedAt: '2025-11-15',
    readingTime: 8,
    category: 'Comparison',
    tags: ['json vs xml', 'json', 'xml', 'data formats', 'api'],
    content: `
<h2>The Short Answer</h2>
<p>For modern REST APIs and web applications, use <strong>JSON</strong>. For document-centric data, enterprise integrations, SOAP services, or when you need attributes and metadata on elements, consider <strong>XML</strong>.</p>

<h2>Side-by-Side Comparison</h2>
<p>The same data in both formats:</p>

<p><strong>JSON:</strong></p>
<pre><code>{
  "book": {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "year": 2008,
    "tags": ["programming", "software"]
  }
}</code></pre>

<p><strong>XML:</strong></p>
<pre><code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;book&gt;
  &lt;title&gt;Clean Code&lt;/title&gt;
  &lt;author&gt;Robert C. Martin&lt;/author&gt;
  &lt;year&gt;2008&lt;/year&gt;
  &lt;tags&gt;
    &lt;tag&gt;programming&lt;/tag&gt;
    &lt;tag&gt;software&lt;/tag&gt;
  &lt;/tags&gt;
&lt;/book&gt;</code></pre>

<h2>Key Differences</h2>

<h3>Readability</h3>
<p>JSON wins. It's significantly less verbose — the same data takes 30–50% fewer characters in JSON than XML. Developers find JSON easier to scan and understand at a glance.</p>

<h3>Data Types</h3>
<p>JSON natively supports numbers, booleans, null, arrays, and objects. XML treats everything as text — you must define types through schemas (XSD).</p>

<h3>Parsing Performance</h3>
<p>JSON parses faster in browsers and most runtimes. Native JSON support in JavaScript (<code>JSON.parse</code>) is highly optimized. XML requires DOM or SAX parsers which are heavier.</p>

<h3>Schema & Validation</h3>
<p>XML has mature schema languages (XSD, DTD, RelaxNG). JSON has JSON Schema (draft-07 and later), which is well-supported but less mature.</p>

<h3>Comments</h3>
<p>XML supports comments. JSON does not. This is a genuine limitation for configuration files (workaround: use JSONC or YAML).</p>

<h3>Namespaces</h3>
<p>XML supports namespaces — useful for merging documents from different vocabularies. JSON has no namespace concept.</p>

<h3>Attributes</h3>
<p>XML has both elements and attributes. JSON only has key-value pairs — more uniform, but less expressive for metadata.</p>

<h2>When to Choose JSON</h2>
<ul>
  <li>REST APIs</li>
  <li>Configuration files (package.json, tsconfig.json)</li>
  <li>NoSQL databases (MongoDB, Firestore)</li>
  <li>Browser storage (localStorage)</li>
  <li>Modern web apps</li>
</ul>

<h2>When to Choose XML</h2>
<ul>
  <li>SOAP web services</li>
  <li>Document formats (Word, SVG, EPUB)</li>
  <li>Enterprise integrations (EDI, XSLT)</li>
  <li>When you need element attributes and namespaces</li>
  <li>RSS/Atom feeds</li>
</ul>

<h2>Convert Between Formats</h2>
<p>Need to switch between JSON and XML? Use our free <a href="/json-to-xml">JSON to XML converter</a> for instant conversion.</p>

<h2>FAQ</h2>
<h3>Is JSON replacing XML?</h3>
<p>In the REST API world, yes. But XML remains dominant in enterprise systems, document formats, and legacy integrations. Both formats will coexist for years.</p>

<h3>Which is better for SEO?</h3>
<p>Neither directly. For structured data that Google reads, use JSON-LD (JSON-based) or Microdata (HTML attributes). JSON-LD is Google's preferred format.</p>
`,
  },
  {
    slug: 'best-json-formatter-tools',
    title: 'Best JSON Formatter Tools for Developers in 2026',
    metaTitle: 'Best JSON Formatter Tools in 2026 — Reviewed | JsonWorkspace',
    metaDescription: 'The best online JSON formatters compared: editor quality, speed, dark mode, JSONPath, code generation, privacy. Updated for 2026.',
    publishedAt: '2026-01-15',
    readingTime: 7,
    category: 'Tools',
    tags: ['json tools', 'json formatter', 'developer tools', 'best json tools 2026'],
    content: `
<h2>What to Look for in a JSON Formatter</h2>
<p>Not all JSON formatters are equal. When choosing one, evaluate: editor quality, speed with large files, extra features (tree view, conversion), keyboard shortcuts, and whether it respects your privacy (client-side vs server-side processing).</p>

<h2>JsonWorkspace — Best Overall</h2>
<p><a href="/json-formatter">JsonWorkspace</a> leads the pack with a Monaco editor (the same engine powering VS Code), real-time validation, tree view, table view, 7 conversion formats, diff comparison, history panel, and keyboard shortcuts for everything. All processing is client-side — your JSON never leaves your browser.</p>

<p><strong>Standout features:</strong></p>
<ul>
  <li>Monaco editor with full syntax highlighting</li>
  <li>JSON → YAML, XML, CSV, TypeScript, Python, Java</li>
  <li>JSON Schema generator</li>
  <li>Smart error fixer with exact line/column error location</li>
  <li>50MB file support with virtualized rendering</li>
  <li>Dark and light themes</li>
</ul>

<h2>Other Popular Tools</h2>

<h3>jsonformatter.org</h3>
<p>Solid basic formatter. Simple UI, tree view, works well. Lacks Monaco editor, schema generation, and conversion tools. Ads-heavy.</p>

<h3>jsonlint.com</h3>
<p>Great for quick JSON validation with clear error messages. Minimal feature set — focused on linting only. No conversion, no tree view.</p>

<h3>JSON Crack</h3>
<p>Unique visual graph view of JSON structure. Beautiful for exploring deeply nested data. Not ideal for editing or conversion.</p>

<h3>Postman</h3>
<p>Full API client with excellent JSON formatting built in. Overkill if you just need to format a snippet, but powerful for API workflows.</p>

<h2>Why Client-Side Processing Matters</h2>
<p>If you're formatting API responses that contain auth tokens, PII, or sensitive business data, you should use a tool that processes JSON in the browser — never sending it to a server. JsonWorkspace and most modern tools do this correctly.</p>

<h2>Built-in vs Online Tools</h2>
<p>VS Code's built-in formatter (<kbd>Shift+Alt+F</kbd>) is excellent for files. Online tools shine when you're dealing with API responses, sharing formatted JSON, or on a machine without your editor installed.</p>

<h2>FAQ</h2>
<h3>Is it safe to paste sensitive JSON into online formatters?</h3>
<p>Only if the tool processes JSON client-side. JsonWorkspace does all processing in your browser — nothing is sent to any server.</p>

<h3>Which JSON formatter works offline?</h3>
<p>JsonWorkspace works offline once cached by your browser. VS Code also works offline with its built-in formatter.</p>
`,
  },
  {
    slug: 'how-to-convert-json-to-csv',
    title: 'How to Convert JSON to CSV — Step by Step Guide',
    metaTitle: 'Convert JSON to CSV Online Free — Complete Guide | JsonWorkspace',
    metaDescription: 'Learn how to convert JSON to CSV online for free. Handle nested JSON, arrays, and download your CSV file instantly.',
    publishedAt: '2025-11-25',
    readingTime: 5,
    category: 'How-To',
    tags: ['json to csv', 'convert json', 'csv', 'data conversion'],
    content: `
<h2>When Do You Need JSON to CSV?</h2>
<p>JSON to CSV conversion is needed when:</p>
<ul>
  <li>Importing API data into Excel or Google Sheets</li>
  <li>Preparing data for database imports</li>
  <li>Sharing data with non-technical stakeholders</li>
  <li>Processing data in tools that only accept CSV (Tableau, Power BI)</li>
</ul>

<h2>How JSON to CSV Conversion Works</h2>
<p>CSV is a flat, tabular format. JSON can be nested and hierarchical. The conversion works best with JSON arrays of flat objects:</p>

<p><strong>Input JSON (ideal structure):</strong></p>
<pre><code>[
  { "name": "Alice", "age": 30, "city": "London" },
  { "name": "Bob", "age": 25, "city": "Paris" },
  { "name": "Carol", "age": 35, "city": "Tokyo" }
]</code></pre>

<p><strong>Output CSV:</strong></p>
<pre><code>name,age,city
Alice,30,London
Bob,25,Paris
Carol,35,Tokyo</code></pre>

<h2>Step-by-Step: Convert JSON to CSV with JsonWorkspace</h2>
<ol>
  <li>Open the <a href="/json-to-csv">JSON to CSV converter</a></li>
  <li>Paste or upload your JSON</li>
  <li>Click <strong>Convert</strong> — output appears instantly</li>
  <li>Click <strong>Download CSV</strong> or <strong>Copy to Clipboard</strong></li>
</ol>

<h2>Handling Nested JSON</h2>
<p>When your JSON has nested objects, the converter flattens them using dot notation:</p>
<pre><code>// Input
[{ "user": { "name": "Alice", "age": 30 } }]

// Output CSV
user.name,user.age
Alice,30</code></pre>

<h2>Special Characters in CSV</h2>
<p>Values containing commas, quotes, or newlines are automatically wrapped in double quotes:</p>
<pre><code>"Smith, John",45,"New York"</code></pre>

<h2>Common Issues</h2>
<h3>JSON is an object, not an array</h3>
<p>CSV requires tabular data. If your JSON is a single object (not an array), it converts to a two-column key-value table.</p>

<h3>Mixed types in array</h3>
<p>If array items have different structures, missing fields are left blank in CSV.</p>

<h2>Related Tools</h2>
<p>Also try <a href="/json-to-xml">JSON to XML</a> or <a href="/json-to-yaml">JSON to YAML</a> for other format conversions.</p>

<h2>FAQ</h2>
<h3>Can I convert CSV back to JSON?</h3>
<p>Not yet in JsonWorkspace, but it's on the roadmap. For now, use a dedicated CSV to JSON tool.</p>

<h3>Does it handle large JSON files?</h3>
<p>Yes — JsonWorkspace handles files up to 50MB efficiently.</p>
`,
  },
  {
    slug: 'json-validator-explained',
    title: 'JSON Validator Explained — How Validation Works',
    metaTitle: 'JSON Validator: How It Works & What to Check | JsonWorkspace',
    metaDescription: 'Understand how JSON validation works, the difference between syntax and schema validation, and how to use a JSON validator effectively.',
    publishedAt: '2025-12-01',
    readingTime: 6,
    category: 'Fundamentals',
    tags: ['json validator', 'json validation', 'json schema', 'json lint'],
    content: `
<h2>Types of JSON Validation</h2>
<p>There are two distinct levels of JSON validation:</p>
<ol>
  <li><strong>Syntax Validation</strong> — Is the JSON well-formed? Can it be parsed?</li>
  <li><strong>Schema Validation</strong> — Does the JSON match an expected structure and data types?</li>
</ol>

<h2>Syntax Validation</h2>
<p>Syntax validation checks whether your JSON follows the JSON specification. It catches:</p>
<ul>
  <li>Trailing commas</li>
  <li>Missing or mismatched brackets</li>
  <li>Unquoted keys</li>
  <li>Invalid values (<code>undefined</code>, comments)</li>
  <li>Incorrect escaping in strings</li>
</ul>

<p>Use our <a href="/json-validator">JSON Validator</a> for instant syntax checking with exact error positions.</p>

<h2>Schema Validation</h2>
<p>Even syntactically valid JSON can be "wrong" if it doesn't match what your application expects. Schema validation uses JSON Schema to define rules:</p>
<pre><code>{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer", "minimum": 0 }
  }
}</code></pre>

<h2>How JsonWorkspace Validates</h2>
<ol>
  <li>As you type, JSON is validated in real-time</li>
  <li>Errors show exact line number and column</li>
  <li>The error message explains what went wrong</li>
  <li>The ⚡ Fix button auto-corrects common issues</li>
</ol>

<h2>Error Messages Decoded</h2>
<p><code>Unexpected token , in JSON at position 45</code> — trailing comma at char 45</p>
<p><code>Unexpected token } in JSON at position 12</code> — missing value before closing brace</p>
<p><code>Unexpected end of JSON input</code> — unclosed bracket or brace</p>
<p><code>Unexpected token ' in JSON at position 0</code> — using single quotes</p>

<h2>Validating JSON in Code</h2>
<p><strong>JavaScript:</strong></p>
<pre><code>function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}</code></pre>

<p><strong>Python:</strong></p>
<pre><code>import json

def is_valid_json(text):
    try:
        json.loads(text)
        return True
    except json.JSONDecodeError:
        return False</code></pre>

<h2>FAQ</h2>
<h3>What's the difference between JSON lint and JSON validator?</h3>
<p>They're the same thing. "Lint" originally meant detecting code issues; in JSON context, both terms refer to checking JSON syntax for errors.</p>

<h3>Can a JSON validator check data types?</h3>
<p>Basic validators only check syntax. Schema validators (using JSON Schema) can enforce types, ranges, required fields, and formats.</p>
`,
  },
  {
    slug: 'common-json-mistakes',
    title: '8 Common JSON Mistakes Developers Make (and How to Fix Them)',
    metaTitle: '8 Common JSON Mistakes & How to Fix Them | JsonWorkspace',
    metaDescription: 'Avoid the most common JSON mistakes: trailing commas, single quotes, missing brackets, and more. With examples and fixes.',
    publishedAt: '2025-12-05',
    readingTime: 7,
    category: 'Debugging',
    tags: ['json mistakes', 'json errors', 'json tips', 'debugging'],
    content: `
<h2>Why JSON Errors Are So Frustrating</h2>
<p>JSON is strict by design. One misplaced comma or quote can break an entire configuration file or API response. The good news: the same mistakes come up again and again. Master these eight and you'll debug JSON much faster.</p>

<h2>Mistake 1: Trailing Commas</h2>
<p>The most common mistake, especially for developers used to JavaScript:</p>
<pre><code>// BROKEN
{
  "name": "Alice",
  "age": 30,     ← extra comma
}

// FIXED
{
  "name": "Alice",
  "age": 30
}</code></pre>

<h2>Mistake 2: Single Quotes</h2>
<p>JavaScript allows single-quoted strings. JSON doesn't:</p>
<pre><code>// BROKEN
{ 'name': 'Alice' }

// FIXED
{ "name": "Alice" }</code></pre>

<h2>Mistake 3: Unquoted Property Names</h2>
<p>This is valid JavaScript but invalid JSON:</p>
<pre><code>// BROKEN (JS object literal)
{ name: "Alice", age: 30 }

// FIXED
{ "name": "Alice", "age": 30 }</code></pre>

<h2>Mistake 4: Comments</h2>
<pre><code>// BROKEN
{
  // user data
  "name": "Alice" /* primary user */
}

// FIXED — remove all comments
{
  "name": "Alice"
}</code></pre>

<h2>Mistake 5: Using undefined</h2>
<pre><code>// BROKEN — undefined is not a JSON value
{ "value": undefined }

// FIXED
{ "value": null }</code></pre>

<h2>Mistake 6: Unescaped Characters in Strings</h2>
<pre><code>// BROKEN
{ "quote": "She said "hello"" }

// FIXED
{ "quote": "She said \\"hello\\"" }</code></pre>
<p>Characters that must be escaped in JSON strings: <code>"</code>, <code>\\</code>, <code>/</code>, and control characters like <code>\\n</code>, <code>\\t</code>, <code>\\r</code>.</p>

<h2>Mistake 7: Numbers as Strings</h2>
<pre><code>// Works but loses type information
{ "count": "42" }

// Better — use actual number type
{ "count": 42 }</code></pre>

<h2>Mistake 8: Mixing Array and Object Syntax</h2>
<pre><code>// BROKEN — arrays use [], objects use {}
{ 0: "first", 1: "second" }   ← trying to use object as array
["name": "Alice"]              ← trying to use array as object

// FIXED
["first", "second"]             ← array
{ "name": "Alice" }             ← object</code></pre>

<h2>Quick Fix: Use JsonWorkspace</h2>
<p>Paste your broken JSON into <a href="/json-formatter">JsonWorkspace</a> and click ⚡ Fix. It automatically fixes trailing commas, single quotes, and unquoted keys. For remaining errors, the validator shows exact line and column numbers.</p>

<h2>FAQ</h2>
<h3>Why does JavaScript allow what JSON doesn't?</h3>
<p>JavaScript object literals evolved for programming convenience (trailing commas make diffs cleaner, single quotes are easier to type). JSON was designed to be a strict, minimal data interchange format, not a programming language.</p>
`,
  },
  {
    slug: 'json-minify-vs-prettify',
    title: 'JSON Minify vs Prettify — When to Use Each',
    metaTitle: 'JSON Minify vs Prettify: Differences & When to Use | JsonWorkspace',
    metaDescription: 'Understand the difference between JSON minification and prettification, and when each is appropriate in development and production.',
    publishedAt: '2025-12-10',
    readingTime: 5,
    category: 'Fundamentals',
    tags: ['json minify', 'json prettify', 'json format', 'performance'],
    content: `
<h2>The Core Difference</h2>
<p><strong>Prettify (Format/Beautify):</strong> Adds whitespace, line breaks, and indentation to make JSON human-readable.</p>
<p><strong>Minify (Compress):</strong> Removes all unnecessary whitespace to make JSON as compact as possible.</p>

<h2>Size Comparison</h2>
<p>The same data prettified vs minified:</p>

<p><strong>Prettified (127 bytes):</strong></p>
<pre><code>{
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "active": true
  }
}</code></pre>

<p><strong>Minified (51 bytes):</strong></p>
<pre><code>{"user":{"id":1,"name":"Alice Johnson","active":true}}</code></pre>

<p>That's a <strong>60% size reduction</strong>. For large JSON payloads, this translates to faster API responses and lower bandwidth costs.</p>

<h2>When to Prettify</h2>
<ul>
  <li><strong>Development:</strong> Reading and debugging API responses</li>
  <li><strong>Documentation:</strong> Examples in README files, API docs</li>
  <li><strong>Config files:</strong> package.json, .prettierrc, etc.</li>
  <li><strong>Code review:</strong> Reviewing JSON changes in git diffs</li>
  <li><strong>Logging:</strong> Human-readable log output</li>
</ul>

<h2>When to Minify</h2>
<ul>
  <li><strong>API responses:</strong> Reduce payload size in production</li>
  <li><strong>localStorage/cookies:</strong> Storage has size limits</li>
  <li><strong>Bundling:</strong> JSON assets in web builds</li>
  <li><strong>High-traffic endpoints:</strong> Save bandwidth at scale</li>
</ul>

<h2>Gzip vs Minification</h2>
<p>Modern HTTP servers apply gzip/brotli compression, which already dramatically reduces JSON size. Does minification still matter?</p>
<p>Yes, but less so. Gzip + prettified JSON is often comparable to gzip + minified JSON. However, minification still helps for:</p>
<ul>
  <li>Uncompressed responses</li>
  <li>localStorage (not compressed)</li>
  <li>Parsing speed (slightly faster for minified)</li>
</ul>

<h2>How to Minify/Prettify with JsonWorkspace</h2>
<ul>
  <li>Go to <a href="/json-minifier">JSON Minifier</a> to compress JSON</li>
  <li>Go to <a href="/json-prettifier">JSON Prettifier</a> to beautify JSON</li>
  <li>Or use the <a href="/json-formatter">main editor</a> with Format/Minify buttons</li>
</ul>

<h2>Keyboard Shortcuts</h2>
<ul>
  <li><kbd>Ctrl+Shift+F</kbd> — Prettify (format)</li>
  <li><kbd>Ctrl+M</kbd> — Minify</li>
</ul>

<h2>FAQ</h2>
<h3>Does minification change data?</h3>
<p>No. Only whitespace is removed. All key names, values, and structure remain identical.</p>

<h3>Does prettifying change parsing speed?</h3>
<p>Negligibly. Parsers skip whitespace efficiently. The difference is microseconds even for large files.</p>
`,
  },
  {
    slug: 'how-apis-use-json',
    title: 'How APIs Use JSON — A Developer\'s Guide',
    metaTitle: 'How REST APIs Use JSON — Developer Guide | JsonWorkspace',
    metaDescription: 'Learn how REST APIs use JSON for requests and responses, JSON structure conventions, HTTP headers, and best practices for API developers.',
    publishedAt: '2025-12-15',
    readingTime: 8,
    category: 'APIs',
    tags: ['json api', 'rest api', 'json requests', 'api development'],
    content: `
<h2>JSON as the Language of APIs</h2>
<p>JSON has become the standard request/response format for REST APIs. When you call a GitHub, Stripe, Twilio, or OpenAI API, you're sending and receiving JSON. Understanding how JSON flows through an API helps you debug faster and build better integrations.</p>

<h2>The JSON Request-Response Cycle</h2>
<p>A typical API interaction:</p>
<ol>
  <li>Client sends an HTTP request with JSON body</li>
  <li>Server processes the request</li>
  <li>Server responds with a JSON body and HTTP status code</li>
  <li>Client parses the JSON response</li>
</ol>

<h2>HTTP Headers for JSON</h2>
<pre><code>Content-Type: application/json
Accept: application/json</code></pre>
<p><code>Content-Type</code> tells the server you're sending JSON. <code>Accept</code> tells the server you expect JSON back.</p>

<h2>Making JSON API Requests</h2>

<p><strong>JavaScript fetch():</strong></p>
<pre><code>const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
});

const user = await response.json();</code></pre>

<p><strong>curl:</strong></p>
<pre><code>curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"name":"Alice","email":"alice@example.com"}'</code></pre>

<p><strong>Python requests:</strong></p>
<pre><code>import requests

response = requests.post(
    'https://api.example.com/users',
    json={'name': 'Alice', 'email': 'alice@example.com'},
    headers={'Authorization': 'Bearer YOUR_TOKEN'}
)

user = response.json()</code></pre>

<h2>Standard API Response Patterns</h2>

<p><strong>Success response:</strong></p>
<pre><code>{
  "data": {
    "id": "usr_123",
    "name": "Alice",
    "email": "alice@example.com",
    "created_at": "2025-01-15T10:30:00Z"
  },
  "meta": {
    "request_id": "req_abc123"
  }
}</code></pre>

<p><strong>Error response:</strong></p>
<pre><code>{
  "error": {
    "code": "validation_error",
    "message": "Email address is invalid",
    "field": "email"
  }
}</code></pre>

<p><strong>Paginated list:</strong></p>
<pre><code>{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 483,
    "next_cursor": "cursor_xyz"
  }
}</code></pre>

<h2>JSON API Conventions</h2>
<ul>
  <li><strong>snake_case</strong> for keys (GitHub, Stripe style) vs <strong>camelCase</strong> (JavaScript style)</li>
  <li>ISO 8601 for dates: <code>"2025-01-15T10:30:00Z"</code></li>
  <li>String IDs for globally unique identifiers (avoid integer IDs that expose record counts)</li>
  <li>Consistent null vs absent field policy</li>
</ul>

<h2>Debugging API JSON</h2>
<p>When an API call fails or returns unexpected data:</p>
<ol>
  <li>Copy the raw response body</li>
  <li>Paste into <a href="/json-formatter">JsonWorkspace</a> and format it</li>
  <li>Use Tree View to explore the structure</li>
  <li>Click any value to see its JSONPath</li>
</ol>

<h2>Related Tools</h2>
<p>Use the <a href="/json-validator">JSON Validator</a> to check request bodies before sending, or <a href="/json-to-yaml">convert JSON to YAML</a> for API configuration files.</p>

<h2>FAQ</h2>
<h3>Why does my API return JSON as a string?</h3>
<p>Double-serialization: the server called JSON.stringify twice. Check if you're parsing the response body before stringifying again on the server side.</p>

<h3>What's JSON:API?</h3>
<p>JSON:API (jsonapi.org) is a specification for building APIs in JSON that defines a standard response envelope, relationships, and pagination. Different from regular JSON — it has a specific <code>data</code>/<code>included</code>/<code>links</code> structure.</p>
`,
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'how-to-parse-json-javascript',
    title: 'How to Parse JSON in JavaScript (Complete Guide)',
    metaTitle: 'How to Parse JSON in JavaScript — JSON.parse() Guide | JsonWorkspace',
    metaDescription: 'Learn how to parse JSON in JavaScript using JSON.parse(), handle errors safely, parse nested JSON, and convert objects back to JSON strings with JSON.stringify().',
    publishedAt: '2026-03-24',
    readingTime: 8,
    category: 'Tutorial',
    tags: ['javascript', 'json', 'json parse', 'tutorial'],
    content: `
<h2>JSON.parse() — The Basics</h2>
<p><code>JSON.parse()</code> is the built-in JavaScript method for converting a JSON string into a JavaScript object. It's available in every modern browser and in Node.js with no imports needed.</p>

<pre><code>const json = '{"name": "Alice", "age": 30, "active": true}';
const obj = JSON.parse(json);

console.log(obj.name);   // "Alice"
console.log(obj.age);    // 30
console.log(obj.active); // true</code></pre>

<h2>Parsing Nested JSON</h2>
<p>JSON.parse() handles deeply nested objects and arrays automatically:</p>

<pre><code>const json = \`{
  "user": {
    "id": 1,
    "roles": ["admin", "editor"],
    "address": { "city": "London" }
  }
}\`;

const data = JSON.parse(json);
console.log(data.user.roles[0]);       // "admin"
console.log(data.user.address.city);   // "London"</code></pre>

<h2>Handling Parse Errors Safely</h2>
<p>If the JSON string is malformed, <code>JSON.parse()</code> throws a <code>SyntaxError</code>. Always wrap it in a try/catch in production code:</p>

<pre><code>function safeParseJSON(str) {
  try {
    return { data: JSON.parse(str), error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

const { data, error } = safeParseJSON('{ bad json }');
if (error) {
  console.error('Failed to parse JSON:', error);
}</code></pre>

<h2>Common Causes of JSON.parse() Errors</h2>
<ul>
  <li><strong>Single quotes</strong> instead of double quotes — <code>{'name': 'Alice'}</code> is invalid</li>
  <li><strong>Trailing commas</strong> — <code>[1, 2, 3,]</code> is invalid JSON (but valid JS)</li>
  <li><strong>Unquoted keys</strong> — <code>{name: "Alice"}</code> is invalid</li>
  <li><strong>Comments</strong> — JSON does not support <code>//</code> or <code>/* */</code> comments</li>
  <li><strong>Undefined values</strong> — <code>undefined</code> is not a valid JSON value; use <code>null</code></li>
</ul>

<h2>The Reviver Parameter</h2>
<p>JSON.parse() accepts an optional reviver function as the second argument. This lets you transform values during parsing — useful for converting date strings into Date objects:</p>

<pre><code>const json = '{"name":"Alice","createdAt":"2025-01-15T10:00:00Z"}';

const obj = JSON.parse(json, (key, value) => {
  if (key === 'createdAt') return new Date(value);
  return value;
});

console.log(obj.createdAt instanceof Date); // true</code></pre>

<h2>JSON.stringify() — Going the Other Way</h2>
<p><code>JSON.stringify()</code> converts a JavaScript object back into a JSON string:</p>

<pre><code>const obj = { name: 'Alice', age: 30, roles: ['admin'] };

// Compact
console.log(JSON.stringify(obj));
// {"name":"Alice","age":30,"roles":["admin"]}

// Pretty-printed with 2-space indent
console.log(JSON.stringify(obj, null, 2));
// {
//   "name": "Alice",
//   "age": 30,
//   "roles": ["admin"]
// }</code></pre>

<h2>Values That JSON.stringify() Drops</h2>
<p>Some JavaScript values are silently dropped or changed when stringified:</p>
<ul>
  <li><code>undefined</code> values in objects → dropped entirely</li>
  <li><code>undefined</code> in arrays → becomes <code>null</code></li>
  <li>Functions → dropped</li>
  <li><code>Symbol</code> keys → dropped</li>
  <li><code>Infinity</code>, <code>NaN</code> → become <code>null</code></li>
</ul>

<pre><code>JSON.stringify({ a: 1, b: undefined, c: () => {} });
// '{"a":1}'  — b and c are dropped</code></pre>

<h2>Parsing JSON from a Fetch API Response</h2>
<p>When fetching JSON from an API, use the <code>.json()</code> method on the Response object — it handles parsing automatically:</p>

<pre><code>const response = await fetch('https://api.example.com/users/1');
const user = await response.json(); // returns parsed object, no JSON.parse() needed
console.log(user.name);</code></pre>

<h2>TypeScript: Typing Parsed JSON</h2>
<p>In TypeScript, <code>JSON.parse()</code> returns <code>any</code>. Cast it to your type or use Zod for runtime validation:</p>

<pre><code>// Simple cast (no runtime validation)
interface User { name: string; age: number; }
const user = JSON.parse(json) as User;

// Safe runtime validation with Zod
import { z } from 'zod';
const UserSchema = z.object({ name: z.string(), age: z.number() });
const user = UserSchema.parse(JSON.parse(json)); // throws if invalid</code></pre>

<p>Use our free <a href="/json-to-zod">JSON to Zod Schema Generator</a> to instantly generate a Zod schema from any JSON sample.</p>

<h2>Quick Reference</h2>
<table>
  <thead><tr><th>Method</th><th>Direction</th><th>Second argument</th></tr></thead>
  <tbody>
    <tr><td><code>JSON.parse(str)</code></td><td>JSON string → JS object</td><td>Reviver function</td></tr>
    <tr><td><code>JSON.stringify(obj)</code></td><td>JS object → JSON string</td><td>Replacer + indent</td></tr>
  </tbody>
</table>
`,
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'regex-cheat-sheet',
    title: 'Regex Cheat Sheet — Regular Expression Reference for Developers',
    metaTitle: 'Regex Cheat Sheet 2025 — Complete Regular Expression Reference | JsonWorkspace',
    metaDescription: 'Complete regex cheat sheet covering character classes, quantifiers, anchors, groups, lookaheads, flags, and common patterns for email, URL, date, IP, and more.',
    publishedAt: '2026-03-24',
    readingTime: 10,
    category: 'Reference',
    tags: ['regex', 'regular expressions', 'cheat sheet', 'javascript'],
    content: `
<h2>What is a Regular Expression?</h2>
<p>A regular expression (regex) is a sequence of characters that defines a search pattern. In JavaScript, you can create one with a literal (<code>/pattern/flags</code>) or with the <code>RegExp</code> constructor:</p>

<pre><code>const re1 = /hello/i;                  // literal
const re2 = new RegExp('hello', 'i');  // constructor — use when pattern is dynamic</code></pre>

<p>Test patterns interactively with our free <a href="/regex-tester">Online Regex Tester</a>.</p>

<h2>Character Classes</h2>
<table>
  <thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
  <tbody>
    <tr><td><code>.</code></td><td>Any character except newline (add <code>s</code> flag to include newline)</td></tr>
    <tr><td><code>\d</code></td><td>Digit [0-9]</td></tr>
    <tr><td><code>\D</code></td><td>Non-digit</td></tr>
    <tr><td><code>\w</code></td><td>Word character [a-zA-Z0-9_]</td></tr>
    <tr><td><code>\W</code></td><td>Non-word character</td></tr>
    <tr><td><code>\s</code></td><td>Whitespace (space, tab, newline)</td></tr>
    <tr><td><code>\S</code></td><td>Non-whitespace</td></tr>
    <tr><td><code>[abc]</code></td><td>One of: a, b, or c</td></tr>
    <tr><td><code>[^abc]</code></td><td>Anything except a, b, c</td></tr>
    <tr><td><code>[a-z]</code></td><td>Any lowercase letter</td></tr>
    <tr><td><code>[a-zA-Z0-9]</code></td><td>Any alphanumeric character</td></tr>
  </tbody>
</table>

<h2>Quantifiers</h2>
<table>
  <thead><tr><th>Quantifier</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>*</code></td><td>0 or more (greedy)</td></tr>
    <tr><td><code>+</code></td><td>1 or more (greedy)</td></tr>
    <tr><td><code>?</code></td><td>0 or 1 (optional)</td></tr>
    <tr><td><code>{n}</code></td><td>Exactly n times</td></tr>
    <tr><td><code>{n,}</code></td><td>n or more times</td></tr>
    <tr><td><code>{n,m}</code></td><td>Between n and m times</td></tr>
    <tr><td><code>*?</code></td><td>0 or more (lazy — match as few as possible)</td></tr>
    <tr><td><code>+?</code></td><td>1 or more (lazy)</td></tr>
  </tbody>
</table>

<h2>Anchors</h2>
<table>
  <thead><tr><th>Anchor</th><th>Matches</th></tr></thead>
  <tbody>
    <tr><td><code>^</code></td><td>Start of string (or line with <code>m</code> flag)</td></tr>
    <tr><td><code>$</code></td><td>End of string (or line with <code>m</code> flag)</td></tr>
    <tr><td><code>\b</code></td><td>Word boundary</td></tr>
    <tr><td><code>\B</code></td><td>Non-word boundary</td></tr>
  </tbody>
</table>

<h2>Groups and Alternation</h2>
<table>
  <thead><tr><th>Syntax</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>(abc)</code></td><td>Capturing group — captures the match</td></tr>
    <tr><td><code>(?:abc)</code></td><td>Non-capturing group — groups without capturing</td></tr>
    <tr><td><code>(?&lt;name&gt;abc)</code></td><td>Named capturing group</td></tr>
    <tr><td><code>a|b</code></td><td>Alternation — match a or b</td></tr>
    <tr><td><code>\\1</code></td><td>Backreference to group 1</td></tr>
  </tbody>
</table>

<h2>Lookaheads and Lookbehinds</h2>
<table>
  <thead><tr><th>Syntax</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>(?=abc)</code></td><td>Positive lookahead — followed by abc</td></tr>
    <tr><td><code>(?!abc)</code></td><td>Negative lookahead — NOT followed by abc</td></tr>
    <tr><td><code>(?&lt;=abc)</code></td><td>Positive lookbehind — preceded by abc</td></tr>
    <tr><td><code>(?&lt;!abc)</code></td><td>Negative lookbehind — NOT preceded by abc</td></tr>
  </tbody>
</table>

<h2>Flags</h2>
<table>
  <thead><tr><th>Flag</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>g</code></td><td>Global — find all matches, not just the first</td></tr>
    <tr><td><code>i</code></td><td>Case insensitive</td></tr>
    <tr><td><code>m</code></td><td>Multiline — <code>^</code> and <code>$</code> match line boundaries</td></tr>
    <tr><td><code>s</code></td><td>DotAll — <code>.</code> matches newlines</td></tr>
    <tr><td><code>u</code></td><td>Unicode — enables full Unicode matching</td></tr>
    <tr><td><code>y</code></td><td>Sticky — match only from <code>lastIndex</code></td></tr>
  </tbody>
</table>

<h2>Common Regex Patterns</h2>

<h3>Email address</h3>
<pre><code>/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g</code></pre>

<h3>URL (http/https)</h3>
<pre><code>/https?:\/\/[^\s/$.?#].[^\s]*/g</code></pre>

<h3>US Phone number</h3>
<pre><code>/\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/g</code></pre>

<h3>Date (YYYY-MM-DD)</h3>
<pre><code>/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/g</code></pre>

<h3>UUID v4</h3>
<pre><code>/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi</code></pre>

<h3>IPv4 address</h3>
<pre><code>/\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g</code></pre>

<h3>Hex color</h3>
<pre><code>/#(?:[0-9a-fA-F]{3}){1,2}\b/g</code></pre>

<h3>Credit card number (basic)</h3>
<pre><code>/\b(?:\d{4}[\s\-]?){3}\d{4}\b/g</code></pre>

<h3>Slug (URL-safe string)</h3>
<pre><code>/^[a-z0-9]+(?:-[a-z0-9]+)*$/</code></pre>

<h2>JavaScript Regex Methods</h2>
<table>
  <thead><tr><th>Method</th><th>Returns</th><th>Use when</th></tr></thead>
  <tbody>
    <tr><td><code>str.match(re)</code></td><td>Array of matches (or null)</td><td>Getting all matches at once</td></tr>
    <tr><td><code>str.matchAll(re)</code></td><td>Iterator of match objects</td><td>Need groups from each match</td></tr>
    <tr><td><code>re.test(str)</code></td><td>true / false</td><td>Just checking if a match exists</td></tr>
    <tr><td><code>re.exec(str)</code></td><td>Match object (or null)</td><td>Iterating with a stateful regex</td></tr>
    <tr><td><code>str.replace(re, fn)</code></td><td>New string</td><td>Replacing or transforming matches</td></tr>
    <tr><td><code>str.split(re)</code></td><td>Array of parts</td><td>Splitting on a pattern</td></tr>
  </tbody>
</table>

<h2>Greedy vs Lazy — Why it Matters</h2>
<pre><code>const html = '&lt;b&gt;hello&lt;/b&gt; and &lt;b&gt;world&lt;/b&gt;';

// Greedy — matches as much as possible
html.match(/&lt;b&gt;.*&lt;\/b&gt;/)[0];
// "&lt;b&gt;hello&lt;/b&gt; and &lt;b&gt;world&lt;/b&gt;"  ← too much

// Lazy — matches as little as possible
html.match(/&lt;b&gt;.*?&lt;\/b&gt;/)[0];
// "&lt;b&gt;hello&lt;/b&gt;"  ← correct</code></pre>
`,
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'json-schema-validation-guide',
    title: 'JSON Schema Validation — Complete Guide with Examples',
    metaTitle: 'JSON Schema Validation Guide — Types, Formats & Examples | JsonWorkspace',
    metaDescription: 'Learn JSON Schema validation from scratch. Covers types, required fields, string formats, numbers, arrays, nested objects, $ref, and how to validate in JavaScript.',
    publishedAt: '2026-03-24',
    readingTime: 9,
    category: 'Tutorial',
    tags: ['json schema', 'validation', 'api', 'typescript'],
    content: `
<h2>What is JSON Schema?</h2>
<p>JSON Schema is a vocabulary that lets you annotate and validate JSON documents. It describes the structure of your data — which fields are required, what types they must be, what formats are allowed, and what constraints apply. JSON Schema is widely used to validate API request/response bodies, configuration files, and database documents.</p>

<p>The current stable version is <strong>Draft 2020-12</strong>. Most libraries support Draft 7 or later.</p>

<h2>A Basic JSON Schema</h2>
<pre><code>{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":     { "type": "integer" },
    "name":   { "type": "string", "minLength": 1 },
    "email":  { "type": "string", "format": "email" },
    "age":    { "type": "integer", "minimum": 0, "maximum": 150 },
    "active": { "type": "boolean" }
  },
  "additionalProperties": false
}</code></pre>

<h2>JSON Schema Types</h2>
<table>
  <thead><tr><th>Type</th><th>JSON values it matches</th></tr></thead>
  <tbody>
    <tr><td><code>"string"</code></td><td>Any JSON string</td></tr>
    <tr><td><code>"number"</code></td><td>Any JSON number (integer or float)</td></tr>
    <tr><td><code>"integer"</code></td><td>Numbers without a fractional part</td></tr>
    <tr><td><code>"boolean"</code></td><td><code>true</code> or <code>false</code></td></tr>
    <tr><td><code>"null"</code></td><td><code>null</code></td></tr>
    <tr><td><code>"array"</code></td><td>JSON arrays</td></tr>
    <tr><td><code>"object"</code></td><td>JSON objects</td></tr>
  </tbody>
</table>

<p>You can allow multiple types: <code>"type": ["string", "null"]</code></p>

<h2>String Constraints</h2>
<pre><code>{
  "type": "string",
  "minLength": 3,
  "maxLength": 100,
  "pattern": "^[a-zA-Z0-9_]+$",
  "format": "email"
}</code></pre>

<p>Common <code>format</code> values: <code>"date"</code>, <code>"date-time"</code>, <code>"email"</code>, <code>"uri"</code>, <code>"uuid"</code>, <code>"ipv4"</code>, <code>"ipv6"</code>. Format validation depends on your validator library.</p>

<h2>Number Constraints</h2>
<pre><code>{
  "type": "number",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMinimum": 0,
  "multipleOf": 0.5
}</code></pre>

<h2>Array Validation</h2>
<pre><code>{
  "type": "array",
  "items": { "type": "string" },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}</code></pre>

<h2>Object Validation</h2>
<pre><code>{
  "type": "object",
  "required": ["name"],
  "properties": {
    "name": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } }
  },
  "minProperties": 1,
  "additionalProperties": false
}</code></pre>

<p>Setting <code>"additionalProperties": false</code> rejects any fields not listed in <code>properties</code> — useful for strict API validation.</p>

<h2>Reusing Schemas with $ref and $defs</h2>
<pre><code>{
  "$defs": {
    "Address": {
      "type": "object",
      "required": ["city", "country"],
      "properties": {
        "city":    { "type": "string" },
        "country": { "type": "string", "minLength": 2, "maxLength": 2 }
      }
    }
  },
  "type": "object",
  "properties": {
    "name":            { "type": "string" },
    "billingAddress":  { "$ref": "#/$defs/Address" },
    "shippingAddress": { "$ref": "#/$defs/Address" }
  }
}</code></pre>

<h2>Combining Schemas</h2>
<table>
  <thead><tr><th>Keyword</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>allOf</code></td><td>Must match ALL listed schemas</td></tr>
    <tr><td><code>anyOf</code></td><td>Must match AT LEAST ONE listed schema</td></tr>
    <tr><td><code>oneOf</code></td><td>Must match EXACTLY ONE listed schema</td></tr>
    <tr><td><code>not</code></td><td>Must NOT match the given schema</td></tr>
  </tbody>
</table>

<pre><code>{
  "oneOf": [
    { "type": "string", "format": "email" },
    { "type": "null" }
  ]
}</code></pre>

<h2>Validating JSON Schema in JavaScript</h2>
<p>The most popular JSON Schema validator for JavaScript is <strong>Ajv</strong>:</p>

<pre><code>import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv); // adds format validation (email, date, etc.)

const schema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name:  { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
  },
};

const validate = ajv.compile(schema);

const valid = validate({ name: 'Alice', email: 'alice@example.com' });
if (!valid) console.log(validate.errors);</code></pre>

<h2>JSON Schema vs Zod — Which Should You Use?</h2>
<table>
  <thead><tr><th></th><th>JSON Schema</th><th>Zod</th></tr></thead>
  <tbody>
    <tr><td>Language</td><td>Language-agnostic JSON</td><td>TypeScript only</td></tr>
    <tr><td>Type inference</td><td>Requires separate TS types</td><td>Automatic via z.infer</td></tr>
    <tr><td>Ecosystem</td><td>OpenAPI, JSON Schema org, many libs</td><td>tRPC, React Hook Form, Next.js</td></tr>
    <tr><td>Runtime validation</td><td>Yes (with Ajv/etc)</td><td>Yes (built-in)</td></tr>
    <tr><td>Best for</td><td>APIs, OpenAPI specs, cross-language</td><td>TypeScript projects, form validation</td></tr>
  </tbody>
</table>

<p>Generate a Zod schema from your JSON instantly with our <a href="/json-to-zod">JSON to Zod Schema Generator</a>, or validate JSON structure with our <a href="/json-validator">JSON Validator</a>.</p>
`,
  },

  // ── NEW BLOGS ─────────────────────────────────────────────────

  {
    slug: 'jsonlint-alternative-jsonworkspace',
    title: 'JSONLint Is Showing Its Age — Here\'s What Developers Are Using Instead',
    metaTitle: 'JSONLint Alternative for Developers in 2026 | JSONWorkspace',
    metaDescription: 'JSONLint is fine for basic validation, but if you want dark mode, a tree view, JSONPath queries, type generation, and history — you need JSONWorkspace. Here\'s the honest comparison.',
    publishedAt: '2026-05-01',
    readingTime: 8,
    category: 'Comparison',
    tags: ['jsonlint', 'jsonlint alternative', 'json formatter', 'json validator', 'json tools 2026'],
    content: `
<p>Let me say upfront: JSONLint is not bad. Doug Crockford built it in 2010 and it does exactly what the name says — it lints JSON. It's fast, it's free, and it gives you a clear error message when your JSON is broken.</p>

<p>But here's the thing. It's 2026. Developer tooling has moved on considerably, and JSONLint… hasn't really. The last meaningful UI update was years ago. There's no dark mode. No keyboard shortcuts. No way to query your JSON. No history. No conversion tools. It's a validator in an era when most developers need a full JSON workspace.</p>

<p>I'm not here to dunk on JSONLint. I'm here to explain what JSONWorkspace does differently, and why more developers have been switching to it — especially once they realise how much time they were wasting going back and forth between five different tools.</p>

<h2>The thing JSONLint does well</h2>

<p>Validation. That's it, and it's genuinely good at it. Paste broken JSON, get a clear error message with a line number. For that single use case, JSONLint still holds up.</p>

<p>The problem is that "validate my JSON" is almost never the only thing you need to do with a piece of JSON. You need to read it, understand it, query specific values out of it, maybe convert it, maybe generate a TypeScript interface from it. JSONLint can't do any of that.</p>

<h2>What JSONWorkspace does instead</h2>

<p>JSONWorkspace built its editor on Monaco — the same engine that powers VS Code. So instead of a text area, you get a proper editor with syntax highlighting, folding, multiple cursors, and Ctrl+Z that actually works across sessions.</p>

<p>On top of that, the right panel gives you four views of your JSON:</p>

<ul>
  <li><strong>Tree view</strong> — click any node to expand/collapse, click any value to copy its JSONPath to clipboard</li>
  <li><strong>Table view</strong> — turns JSON arrays into a readable table, sortable by column</li>
  <li><strong>Tools</strong> — quick transforms: sort keys alphabetically, remove nulls, flatten arrays</li>
  <li><strong>Schema</strong> — generates a JSON Schema from your data automatically</li>
</ul>

<p>And now there's a fifth tab: <strong>Path Finder</strong>. Type a JSONPath expression like <code>$.users[?(@.active)].email</code> and every matching value lights up instantly. No copying to a separate tool, no re-pasting your JSON.</p>

<h2>The features JSONLint users keep asking for</h2>

<p>I've seen the same requests in developer forums for years: "does JSONLint have dark mode?" (No.) "Can JSONLint convert JSON to YAML?" (No.) "Is there a JSONLint with history so I can go back to a previous version?" (No.)</p>

<p>JSONWorkspace has all of these:</p>

<ul>
  <li><strong>Dark mode</strong> — proper dark theme, not just browser dark mode fighting with a white background</li>
  <li><strong>History panel</strong> — keeps your last 10 JSON snippets automatically, load any of them in one click</li>
  <li><strong>Saved snippets</strong> — manually save and name JSON you use regularly (auth tokens, test payloads, API responses you keep re-pasting)</li>
  <li><strong>Convert</strong> — JSON to YAML, XML, CSV, TypeScript interface, Python dataclass, Go struct, SQL CREATE TABLE, Markdown table</li>
  <li><strong>Share via link</strong> — click Share, get a URL. Send it to a colleague. They open it, your JSON is already there. JSONLint has nothing like this.</li>
</ul>

<h2>The auto-fix thing</h2>

<p>This one matters more than it sounds. JSONLint tells you your JSON is invalid. JSONWorkspace tells you AND fixes the most common mistakes with one click.</p>

<p>Trailing comma? Fixed. Single quotes around strings? Fixed. Unquoted keys? Fixed. <code>undefined</code> values? Replaced with <code>null</code>. The ⚡ Fix button handles 80% of the JSON errors that come from copying JS objects and forgetting they're not valid JSON.</p>

<h2>On privacy</h2>

<p>Both JSONLint and JSONWorkspace process JSON client-side — your data doesn't leave your browser. That's table stakes now. But it's worth confirming: nothing in JSONWorkspace phones home with your JSON data.</p>

<h2>The honest answer</h2>

<p>If all you ever need to do is validate a JSON string and see whether it parses, JSONLint is fine. Bookmark it, use it.</p>

<p>But if you're a developer who works with JSON every day — debugging API responses, building integrations, reading unfamiliar data structures, converting formats, generating types — then you need something that keeps up with that workflow. That's what JSONWorkspace is built for.</p>

<p>You can <a href="/json-formatter">try it free here</a>, no account needed. The editor opens immediately, and if you paste JSON that has errors, it'll tell you exactly where and offer to fix it.</p>

<h2>Quick comparison</h2>

<table>
  <thead>
    <tr><th>Feature</th><th>JSONLint</th><th>JSONWorkspace</th></tr>
  </thead>
  <tbody>
    <tr><td>JSON validation</td><td>✓</td><td>✓</td></tr>
    <tr><td>Error location (line + column)</td><td>✓</td><td>✓</td></tr>
    <tr><td>Auto-fix common errors</td><td>✗</td><td>✓</td></tr>
    <tr><td>Monaco editor (VS Code engine)</td><td>✗</td><td>✓</td></tr>
    <tr><td>Dark mode</td><td>✗</td><td>✓</td></tr>
    <tr><td>Tree / Table view</td><td>✗</td><td>✓</td></tr>
    <tr><td>JSONPath Explorer</td><td>✗</td><td>✓</td></tr>
    <tr><td>Convert to YAML, XML, CSV…</td><td>✗</td><td>✓</td></tr>
    <tr><td>Generate TypeScript / Go / SQL</td><td>✗</td><td>✓</td></tr>
    <tr><td>Share JSON via URL</td><td>✗</td><td>✓</td></tr>
    <tr><td>Keyboard shortcuts</td><td>✗</td><td>✓</td></tr>
    <tr><td>History panel</td><td>✗</td><td>✓</td></tr>
    <tr><td>Saved snippets</td><td>✗</td><td>✓</td></tr>
    <tr><td>Client-side (private)</td><td>✓</td><td>✓</td></tr>
    <tr><td>Free</td><td>✓</td><td>✓</td></tr>
  </tbody>
</table>
`,
  },

  {
    slug: 'json-formatter-comparison-2026',
    title: 'I Tested 6 Online JSON Formatters. Here\'s What I Actually Found.',
    metaTitle: 'Best Online JSON Formatter 2026 — Honest Comparison | JSONWorkspace',
    metaDescription: 'Tested JSONFormatter.org, JSONLint, JSON Crack, Postman, and others against JSONWorkspace. Real differences in editor quality, features, privacy, and mobile experience.',
    publishedAt: '2026-05-05',
    readingTime: 9,
    category: 'Comparison',
    tags: ['json formatter comparison', 'jsonformatter.org alternative', 'best json formatter 2026', 'json tools comparison'],
    content: `
<p>Every few months I do a sweep of the JSON formatter landscape because the tools we recommend to junior devs actually matter. A bad tool slows you down in ways that are hard to notice — extra clicks, no keyboard shortcuts, data loss when the tab refreshes.</p>

<p>Here's what I found in my latest round of testing. I'll try to be fair, because each tool has a reason people use it.</p>

<h2>The tools I tested</h2>
<ol>
  <li>JSONFormatter.org</li>
  <li>JSONLint.com</li>
  <li>JSON Crack</li>
  <li>Codebeautify.org</li>
  <li>JSON Editor Online (jsoneditoronline.org)</li>
  <li>JSONWorkspace (that's us — I'll try to be objective)</li>
</ol>

<h2>JSONFormatter.org</h2>

<p>This one has been around forever, which is both a compliment and a critique. The tree view is genuinely useful — click any node to expand, collapse, or copy. The interface is clean enough. It handles basic formatting and minification without complaint.</p>

<p>The problems: it's slow with large JSON files (anything over 500KB starts lagging noticeably). No Monaco editor — it's a basic textarea, which means no multi-cursor, no proper undo history, no code folding. There are ads, which is fine, but combined with the dated UI it feels like a tool from 2014 that hasn't been touched since. No keyboard shortcuts for common operations. No dark mode. No conversion to other formats.</p>

<p>Verdict: fine for a quick look at small JSON. Not something you'd use as a daily driver.</p>

<h2>JSONLint.com</h2>

<p>Covered this in detail in <a href="/blog/jsonlint-alternative-jsonworkspace">another post</a>, but the short version: excellent at the one thing it does (validation), genuinely nothing else. The error messages are clear. That's where the praise ends.</p>

<h2>JSON Crack</h2>

<p>Visually the most interesting tool on this list. JSON Crack renders your data as an interactive graph — nodes and edges, drag to explore, click to expand. For understanding an unfamiliar deeply-nested structure, it's genuinely impressive. I've used it to understand the shape of Stripe API responses.</p>

<p>The catch: it's a visualizer, not a formatter. You can't really edit JSON in it, there's no conversion, no validation with error messages. Think of it as a companion tool, not a replacement for a proper formatter. Also, large datasets make the graph unreadable quickly.</p>

<h2>Codebeautify.org</h2>

<p>Has an enormous number of tools on one site — JSON formatter, XML formatter, CSS beautifier, Base64, you name it. The breadth is impressive. The JSON formatter itself is solid: tree view, formatting options, minify. The downside is that trying to support everything means nothing feels particularly polished. The UI is cluttered, there are a lot of ads, and the editor quality is basic.</p>

<h2>JSON Editor Online (jsoneditoronline.org)</h2>

<p>This one is genuinely good and underrated. The split-pane layout (raw JSON on one side, tree on the other) is a solid pattern. It has a proper editor, not just a textarea. JSONPath querying works. It's been actively maintained.</p>

<p>Where it falls short: no code generation (TypeScript, Python, Go, SQL), no share-via-URL, no mock data generator, the dark mode is a bit rough around the edges, and mobile is barely usable. Also it's the least discoverable tool on this list — somehow it never comes up in "best JSON formatter" searches despite being quite capable.</p>

<h2>JSONWorkspace</h2>

<p>I'll be transparent: this is our tool. I'm going to describe what it actually does and let you decide if the comparison is fair.</p>

<p>The core editor is Monaco (VS Code's engine). That matters because it means real multi-cursor editing, real undo/redo, code folding, real syntax highlighting, and keyboard shortcuts that feel familiar to anyone who uses VS Code daily — which is most of us.</p>

<p>The feature that gets the most "oh that's useful" reactions from people: the JSONPath Explorer tab. You're looking at an API response, you type <code>$.data[?(@.status=="active")].id</code> and immediately see every matching ID highlighted in the editor and listed in the results panel. No extra tool, no re-pasting.</p>

<p>A few others worth mentioning because they genuinely save time:</p>

<ul>
  <li><strong>Code generation</strong> — paste JSON, get a TypeScript interface, Python dataclass, Go struct, SQL CREATE TABLE, Rust struct, or C# class. I use this probably three times a week.</li>
  <li><strong>Mock data generator</strong> — paste a sample JSON object, get 5 (or 50) realistic fake records. It's smart about field names: a field called <code>email</code> gets a realistic email, <code>createdAt</code> gets an ISO timestamp, <code>latitude</code> gets an actual coordinate.</li>
  <li><strong>Share via URL</strong> — click Share, get a compressed link, send it. Your colleague opens it and the JSON is there. This sounds trivial but I've saved a lot of Slack back-and-forth with it.</li>
  <li><strong>Saved snippets</strong> — save JSON you use repeatedly (test auth tokens, API payloads, config templates) with a name. Load them in one click. It persists in localStorage, so they're there next time.</li>
</ul>

<p>Is it perfect? No. The mobile experience on the full editor is cramped (though the individual tool pages work fine on mobile). There's no CSV-to-JSON converter yet. If you want a visual graph view like JSON Crack, we don't have that.</p>

<h2>My actual recommendation</h2>

<p>For most developers, use JSONWorkspace as your main tool. Open it in a pinned tab. Use the snippets to save things you re-paste constantly. Use the JSONPath tab when you're trying to understand an API response structure.</p>

<p>Keep a bookmark to JSON Crack for the occasional "I need to see the shape of this nested thing visually" moment.</p>

<p>If you're on a machine where you can't install extensions and you just need to quickly validate a string, JSONLint.com works fine.</p>

<p>Everything else on this list is either outclassed by the above or has a specific niche I haven't covered here.</p>

<p><a href="/json-formatter">Open JSONWorkspace →</a> — no sign-up, no ads, works offline once cached.</p>
`,
  },

  {
    slug: 'jsonpath-explorer-how-to-query-json-online',
    title: 'Stop Manually Hunting Through JSON. Use JSONPath Explorer Instead.',
    metaTitle: 'JSONPath Explorer Online — Query JSON with JSONPath Expressions Free | JSONWorkspace',
    metaDescription: 'JSONPath lets you query JSON like SQL queries a database. Our free online JSONPath Explorer highlights matches in real time — no setup, works with any JSON.',
    publishedAt: '2026-05-10',
    readingTime: 7,
    category: 'Features',
    tags: ['jsonpath', 'jsonpath online', 'jsonpath tester', 'query json', 'json path finder'],
    content: `
<p>You've been there. An API response comes back with 200 lines of JSON and you need to find every user whose <code>status</code> is <code>"active"</code>. So you Ctrl+F for "active", manually skip over everything that isn't in a status field, and after two minutes you have half the answer.</p>

<p>There's a better way. It's called JSONPath, it's been around since 2007, and somehow it's still not on most developers' radar. Let me fix that.</p>

<h2>What is JSONPath?</h2>

<p>JSONPath is a query language for JSON, roughly analogous to XPath for XML. It gives you a compact syntax to select values out of a JSON structure without writing any code.</p>

<p>A few examples to make it concrete:</p>

<pre><code>$.store.books[*].title        // all book titles
$.store.books[0]              // first book
$..author                     // every "author" field, anywhere in the document
$.store.books[?(@.price<10)]  // books cheaper than 10
$.store.books[?(@.inStock)]   // books that have inStock set to a truthy value</code></pre>

<p>The <code>$</code> is always the root of the document. <code>.</code> is child access. <code>..</code> is deep scan (searches the whole document). <code>[?(@.field)]</code> is a filter expression.</p>

<h2>Why developers don't use it more</h2>

<p>The main barrier has always been tooling. To test a JSONPath expression, you'd typically have to:</p>

<ol>
  <li>Find a JSONPath testing website</li>
  <li>Copy your JSON there</li>
  <li>Type your expression</li>
  <li>Realise the site uses a slightly different JSONPath dialect</li>
  <li>Go back to your formatter to look at the structure</li>
  <li>Come back and adjust the expression</li>
</ol>

<p>It's a five-step context switch for something that should take ten seconds. No wonder people just use Ctrl+F.</p>

<h2>How JSONWorkspace's Path Finder works</h2>

<p>We built JSONPath querying directly into every JSON editor on the site. There are two ways to access it:</p>

<p><strong>Built into the editor (every tool page)</strong>: in the formatter, validator, and every other tool, there's a "⟨/⟩ Path" tab next to the Output tab. Switch to it, type your expression, and matches appear immediately — no re-pasting required. The JSON you're already working with is the one being queried.</p>

<p><strong>Full explorer at <a href="/json-path">/json-path</a></strong>: a dedicated page with a bigger results panel, Monaco editor for the JSON input, example query chips, and a reference table at the bottom. Use this when you're seriously interrogating a response and need more screen real estate.</p>

<p>Results show: the full JSONPath to each matched value, a type badge (string / number / boolean / object / array), the value itself, and a copy button for each result. There's also a "Copy all" button that dumps all matched values as a JSON array.</p>

<h2>Quick reference for the expressions you'll actually use</h2>

<table>
  <thead><tr><th>Expression</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><code>$.*</code></td><td>All top-level values</td></tr>
    <tr><td><code>$.users[*]</code></td><td>All items in the users array</td></tr>
    <tr><td><code>$.users[0]</code></td><td>First user</td></tr>
    <tr><td><code>$.users[-1]</code></td><td>Last user</td></tr>
    <tr><td><code>$..email</code></td><td>Every email field anywhere in the document</td></tr>
    <tr><td><code>$.users[?(@.active)]</code></td><td>Users where active is truthy</td></tr>
    <tr><td><code>$.users[?(@.age >= 18)]</code></td><td>Users aged 18 or over</td></tr>
    <tr><td><code>$.users[?(@.role == "admin")]</code></td><td>Admin users only</td></tr>
    <tr><td><code>$.data[*].id</code></td><td>All IDs from a data array</td></tr>
    <tr><td><code>$..*</code></td><td>Every single value in the whole document</td></tr>
  </tbody>
</table>

<h2>A realistic example</h2>

<p>Say you have a GitHub API response listing your repositories. You want just the names of repos that are forks. The expression would be:</p>

<pre><code>$[?(@.fork == true)].name</code></pre>

<p>Paste the GitHub response into the editor, type that expression, done. No Python script, no jq installed, no Stack Overflow.</p>

<p>Or you have a Stripe webhook payload and you want every <code>amount</code> field from every charge in the event:</p>

<pre><code>$..amount</code></pre>

<p>Two characters. That's the power of JSONPath's deep scan operator.</p>

<h2>How it's different from using jq</h2>

<p>jq is excellent and if you're comfortable in the terminal, use it. JSONPath isn't trying to replace jq — it's a different trade-off. JSONPath is declarative and readable at a glance. jq has more power (functions, transformations, arithmetic) but a steeper learning curve.</p>

<p>For "find me these values in this JSON," JSONPath is faster to write and faster to debug. For "transform this JSON into a different shape," jq wins.</p>

<p><a href="/json-path">Try the JSONPath Explorer →</a></p>
`,
  },

  {
    slug: 'new-features-jsonpath-code-generator-mock-data-share',
    title: 'What We Just Shipped: JSONPath, Code Generator, Mock Data, and More',
    metaTitle: 'New: JSONPath Explorer, Code Generator, Mock Data Generator | JSONWorkspace',
    metaDescription: 'We shipped JSONPath Explorer, a code generator for TypeScript/Python/Go/SQL, a mock data generator, share-via-URL, saved snippets, JSON-to-Markdown, and a browser extension. Here\'s what each one does.',
    publishedAt: '2026-05-15',
    readingTime: 9,
    category: 'Features',
    tags: ['jsonpath explorer', 'json to typescript', 'mock data generator', 'json share link', 'json browser extension', 'json saved snippets'],
    content: `
<p>We've been heads-down building for a while. Here's the full changelog, with a quick explanation of why we built each thing and what problem it actually solves.</p>

<h2>1. JSONPath Explorer</h2>

<p>This is the one I'm most excited about. JSONPath is a query language that lets you select specific values from a JSON document using an expression — no code required. Type <code>$.users[?(@.active)].email</code> and immediately see every active user's email highlighted.</p>

<p>We built it in two places. First, there's a <a href="/json-path">standalone JSONPath Explorer</a> with a full Monaco editor, example queries, and a detailed results panel. Second — and this matters more — we added a "Path" tab to every JSON editor on the site. So when you're in the formatter and you need to query the JSON you're already looking at, you just flip to the Path tab. No copy-paste, no context switch.</p>

<p>The results panel shows the full JSONPath to each match, the type of the matched value, the value itself, and a copy button. There's a "Copy all" button that exports all matched values as a JSON array.</p>

<h2>2. Code Generator — TypeScript, Python, Go, SQL, Rust, C#</h2>

<p>Paste JSON. Pick a language. Get typed code back.</p>

<p>I cannot count how many times I've manually written a TypeScript interface from an API response. It's the kind of task that takes 5 minutes but feels like it takes 20 because it's so tedious. The <a href="/json-to-code">JSON to Code Generator</a> handles TypeScript interfaces, Python dataclasses, Go structs with JSON tags, SQL CREATE TABLE with inferred column types, Rust structs with serde attributes, and C# classes with JsonProperty attributes.</p>

<p>Nested objects get their own separate type definitions, not inline noise. The root type name is editable — click the pencil icon next to "Root:" in the toolbar and rename it to match your domain model.</p>

<p>This also made it into the Tools dropdown in the nav under the new name "JSON → Code".</p>

<h2>3. Mock Data Generator</h2>

<p>Paste a sample JSON object — not a schema, just an example — and get back N realistic fake records.</p>

<p>The smart part is field name detection. A field called <code>email</code> generates a real-looking email. <code>createdAt</code> generates an ISO timestamp. <code>avatar</code> generates an avatar URL. <code>latitude</code> generates an actual latitude. We handle about 50 field name patterns before falling back to generic lorem text.</p>

<p>The controls are: number of records (1 to 100), an optional seed for reproducible output, a Regenerate button that shuffles data on demand, and four presets (User, Product, Blog Post, Order) if you want a starting point without writing a sample.</p>

<p>This lives at <a href="/mock-generator">/mock-generator</a>.</p>

<h2>4. Share via URL</h2>

<p>This one is simple but has already saved me more time than anything else we shipped this month.</p>

<p>Click the Share button in any JSON editor. A popover appears with a compressed URL. Send it. The person you sent it to opens the link and your JSON is already loaded, no copy-paste required. The JSON is compressed with LZ-string before being put in the URL, so a typical API response fits comfortably within the URL length limit.</p>

<p>If the JSON is too large for a URL (over ~8KB compressed), you get a clear message and a "Copy raw JSON" button instead.</p>

<p>The Share button lives in the main full editor toolbar and in every tool page toolbar.</p>

<h2>5. Saved Snippets</h2>

<p>This one is about the JSON you keep re-pasting. Auth tokens for testing, sample API payloads you always use, config templates, whatever.</p>

<p>In the main editor, there's now a "Snippets" tab in the right panel (alongside Tree, Table, Tools, Schema, Path). Click "Save current JSON as snippet", give it a name, and it's there. Snippets persist in localStorage, so they survive browser restarts. Click "Load into editor" to bring any snippet back.</p>

<p>You can rename snippets inline and delete them. There's also a "Save" button in the TopBar for quick access without going to the panel.</p>

<h2>6. JSON to Markdown Table</h2>

<p>This one's a niche tool, but developers who need it really need it. Paste a JSON array of objects, get a Markdown table with proper column headers. Paste a single object, get a 2-column key/value table.</p>

<p>Pipe characters inside values are automatically escaped. The output is GitHub Flavored Markdown (GFM) and renders correctly on GitHub, GitLab, Notion, and most Markdown editors.</p>

<p>It's at <a href="/json-to-markdown">/json-to-markdown</a> and is also available as a tab in the main editor's Convert view (📝 Markdown).</p>

<h2>7. Browser Extension</h2>

<p>When you hit a URL that returns raw JSON — an API endpoint, a GitHub raw file, a Next.js route — your browser just shows you an unformatted blob of text. The extension fixes that.</p>

<p>Install it, and any time you're on a page that returns JSON, you'll see a small banner in the bottom-right corner: "JSON detected — Open in JSONWorkspace →". Click it. Your JSON opens in the editor, already formatted, ready to explore.</p>

<p>You can also right-click on any page and choose "Open in JSONWorkspace" from the context menu — useful for JSON inside a web page (a <code>pre</code> block with API response examples, for instance). And if you select some text first, "Open selected JSON in JSONWorkspace" becomes available.</p>

<p>The extension popup has quick links to the Formatter, Validator, JSONPath Explorer, and Mock Generator.</p>

<p>Find the extension files in the <code>extension/</code> folder of the repo. Load it in Chrome via chrome://extensions → Developer mode → Load unpacked. Firefox support is next.</p>

<h2>What's next</h2>

<p>A few things in progress: CSV to JSON converter, a diff view that actually shows structural differences (not just text diff), and better mobile support for the full editor. If there's something you're missing, open an issue.</p>

<p><a href="/app">Open the full editor →</a></p>
`,
  },

  {
    slug: 'json-browser-extension-for-chrome',
    title: 'The JSON Chrome Extension That Doesn\'t Get in Your Way',
    metaTitle: 'JSON Formatter Chrome Extension — JSONWorkspace | Format JSON in Browser',
    metaDescription: 'Our Chrome extension detects raw JSON pages and opens them in JSONWorkspace with one click. Smarter than built-in browser JSON viewers and doesn\'t override your default rendering.',
    publishedAt: '2026-05-18',
    readingTime: 7,
    category: 'Features',
    tags: ['json chrome extension', 'json browser extension', 'format json in chrome', 'chrome json formatter', 'json extension firefox'],
    content: `
<p>If you work with APIs, you've had this experience: you open a URL in the browser that returns JSON, and Chrome just shows you a wall of monospace text. No formatting, no folding, no way to understand the structure at a glance.</p>

<p>There are Chrome extensions for this. Most of them work by intercepting JSON responses and rendering them directly in the browser tab with a custom viewer. The problem is that approach has a few annoying side effects: it breaks <code>Content-Type</code> detection for some pages, it applies to every JSON response even when you just want to see the raw text, and if you want to actually do something with the JSON beyond looking at it (convert, query, generate types), you're back to copy-pasting into another tool.</p>

<p>We took a different approach with the JSONWorkspace extension.</p>

<h2>How it works</h2>

<p>The extension doesn't intercept and replace JSON pages. Instead, it watches for pages that return JSON (by checking Content-Type and trying to parse the body), and when it finds one, it shows a small banner in the bottom-right corner:</p>

<p><em>"JSON detected — Open in JSONWorkspace →"</em></p>

<p>Click the button. A new tab opens with the JSONWorkspace editor, your JSON already loaded and formatted, ready to explore. The original raw JSON tab is untouched.</p>

<p>This matters because:</p>
<ul>
  <li>You can still see the raw JSON if you need to (it's still there in the original tab)</li>
  <li>You get the full JSONWorkspace feature set, not just a tree view — query with JSONPath, convert to YAML, generate TypeScript interfaces, whatever you need</li>
  <li>The extension doesn't override your browser's default rendering behaviour globally</li>
</ul>

<h2>The context menu option</h2>

<p>Right-click on any page and you'll see "Open in JSONWorkspace" in the context menu. This extracts the entire page text and sends it to the editor.</p>

<p>More usefully: select some text first, then right-click. You get "Open selected JSON in JSONWorkspace" instead, which sends just the selection. This is handy when you're looking at documentation that has a JSON example in a <code>pre</code> block, or a GitHub issue where someone pasted an API response.</p>

<h2>The popup</h2>

<p>Click the extension icon to open the popup. It gives you:</p>
<ul>
  <li><strong>Open page JSON in editor</strong> — same as the banner button</li>
  <li><strong>Open selected text as JSON</strong> — sends whatever you've selected</li>
  <li>Quick links to the most-used tools: Formatter, Validator, JSONPath Explorer, Mock Generator</li>
</ul>

<h2>How it sends JSON to the editor</h2>

<p>The JSON is compressed using LZ-string (the same compression used by the Share via URL feature) and appended to the URL as a <code>?j=</code> parameter. When the editor loads, it reads the parameter, decompresses the JSON, loads it, and then replaces the URL with a clean <code>/app</code>. So your browser history and address bar stay clean after the fact.</p>

<p>For very large JSON responses (over ~8KB compressed), the extension opens the editor without pre-loading data — you'll need to copy-paste for those, but we display a note explaining why.</p>

<h2>Comparison with other JSON extensions</h2>

<table>
  <thead>
    <tr><th>Extension approach</th><th>Pros</th><th>Cons</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>In-page renderer (e.g. JSONView)</td>
      <td>Immediate, no new tab</td>
      <td>Replaces original, limited tools, can break some pages</td>
    </tr>
    <tr>
      <td>JSONWorkspace approach</td>
      <td>Full tool suite, original preserved, no rendering conflicts</td>
      <td>Opens a new tab</td>
    </tr>
  </tbody>
</table>

<p>If you just want to look at JSON without doing anything to it, a pure in-page renderer like JSONView is fine. If you regularly need to query, convert, or generate types from the JSON you're looking at, the JSONWorkspace approach saves you the copy-paste step.</p>

<h2>How to install (Chrome)</h2>

<ol>
  <li>Clone or download the <a href="https://github.com">JSONWorkspace repo</a></li>
  <li>Navigate to the <code>extension/</code> folder</li>
  <li>Add your own icons (16×16, 48×48, 128×128 PNG files) with a green <code>#10b981</code> background and white <code>{}</code> symbol — or use the ones from the dist folder once we publish to the Web Store</li>
  <li>Open Chrome, go to <code>chrome://extensions</code></li>
  <li>Turn on Developer mode (top right)</li>
  <li>Click "Load unpacked", select the <code>extension/</code> folder</li>
</ol>

<p>Chrome Web Store submission is in progress. Firefox support follows after that.</p>

<h2>Privacy</h2>

<p>The extension never sends your JSON data to any server. The content script reads the page body in your browser, compresses it locally, and constructs the JSONWorkspace URL — all client-side. The JSONWorkspace editor itself also processes everything locally.</p>

<p>The extension requests <code>activeTab</code>, <code>contextMenus</code>, and <code>scripting</code> permissions. It does not request history, cookies, or any persistent access beyond the currently active tab.</p>
`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getRecentPosts(count = 3): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ).slice(0, count);
}
