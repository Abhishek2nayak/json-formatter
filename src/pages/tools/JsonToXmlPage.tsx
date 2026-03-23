import { ToolPage } from '../ToolPage';

export function JsonToXmlPage() {
  return (
    <ToolPage
      mode="to-xml"
      seo={{
        title: 'JSON to XML Converter Online Free | JsonMaster',
        description: 'Convert JSON to XML format online for free. Instant conversion with proper XML structure, attributes, and formatting.',
        canonical: '/json-to-xml',
      }}
      content={{
        h1: 'JSON to XML Converter Online — Free & Instant',
        intro: 'Convert JSON to XML format instantly with JsonMaster\'s free online converter. Whether you\'re integrating with legacy SOAP services, working with RSS feeds, or need XML for enterprise systems, this tool generates clean, well-formed XML from any JSON structure.',
        howTo: [
          { step: 'Paste your JSON', desc: 'Paste any valid JSON object or array into the input editor.' },
          { step: 'Click Convert to XML', desc: 'Click Convert and get properly formatted XML output immediately.' },
          { step: 'Copy or download', desc: 'Copy the XML to clipboard or download as a .xml file.' },
        ],
        benefits: [
          'Generates well-formed, valid XML output',
          'Adds XML declaration header automatically',
          'Handles nested objects and arrays',
          'Proper XML formatting with indentation',
          'Download as .xml file',
          'Free with no registration',
          'Client-side processing — fully private',
          'Fast conversion even for large JSON',
        ],
        faq: [
          {
            question: 'Is the generated XML valid?',
            answer: 'Yes. JsonMaster generates well-formed XML with a proper XML declaration, correct nesting, and UTF-8 encoding. The output can be validated against XML standards.',
          },
          {
            question: 'How are JSON arrays converted to XML?',
            answer: 'JSON arrays are converted to repeated XML elements. Each array item becomes an <item> element within the parent element.',
          },
          {
            question: 'Can I specify the root element name?',
            answer: 'The default root element is <root>. For custom root element names, use the full JsonMaster editor which provides more conversion options.',
          },
          {
            question: 'What is the difference between JSON and XML?',
            answer: 'JSON is more compact and native to JavaScript. XML supports attributes, namespaces, and mixed content. XML is required for SOAP services, legacy enterprise systems, and document formats like Word and SVG. Read our comparison at /blog/json-vs-xml.',
          },
        ],
        relatedTools: [
          { label: 'JSON to CSV', href: '/json-to-csv' },
          { label: 'JSON to YAML', href: '/json-to-yaml' },
          { label: 'JSON Formatter', href: '/json-formatter' },
          { label: 'Full Editor', href: '/app' },
        ],
      }}
    />
  );
}
