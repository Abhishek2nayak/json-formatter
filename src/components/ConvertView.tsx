import { useMemo, useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { useStore } from '../store';
import { parseJSON } from '../utils/json';
import { convert } from '../utils/converters';
import type { ConvertFormat } from '../types';

const FORMATS: { id: ConvertFormat; label: string; ext: string; icon: string }[] = [
  { id: 'yaml', label: 'YAML', ext: 'yaml', icon: '📄' },
  { id: 'xml', label: 'XML', ext: 'xml', icon: '🔖' },
  { id: 'csv', label: 'CSV', ext: 'csv', icon: '📊' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts', icon: '🔷' },
  { id: 'python', label: 'Python', ext: 'py', icon: '🐍' },
  { id: 'java', label: 'Java', ext: 'java', icon: '☕' },
];

export function ConvertView() {
  const { theme, jsonInput, convertFormat, setConvertFormat } = useStore();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const { parsed, error } = parseJSON(jsonInput);
    if (error || !parsed) return '';
    try {
      return convert(parsed, convertFormat);
    } catch (e) {
      return `// Error: ${(e as Error).message}`;
    }
  }, [jsonInput, convertFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const format = FORMATS.find(f => f.id === convertFormat)!;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${format.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Format tabs */}
      <div className={`flex items-center gap-1 px-3 py-2 border-b flex-shrink-0 overflow-x-auto scrollbar-thin ${
        isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
      }`}>
        {FORMATS.map(fmt => (
          <button
            key={fmt.id}
            onClick={() => setConvertFormat(fmt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              convertFormat === fmt.id
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span>{fmt.icon}</span>
            {fmt.label}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={handleCopy} className={`btn-ghost text-xs ml-2 flex-shrink-0 ${isDark ? '' : 'hover:bg-gray-200'}`}>
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={handleDownload} className={`btn-ghost text-xs flex-shrink-0 ${isDark ? '' : 'hover:bg-gray-200'}`}>
          <Download size={12} />
          Download
        </button>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {!jsonInput.trim() ? (
          <div className={`flex flex-col items-center justify-center h-full gap-3 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <div className="text-4xl">{FORMATS.find(f => f.id === convertFormat)?.icon}</div>
            <p className="text-sm">Paste JSON to convert to {FORMATS.find(f => f.id === convertFormat)?.label}</p>
          </div>
        ) : !result ? (
          <div className={`flex flex-col items-center justify-center h-full gap-3 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <p className="text-sm">Fix JSON errors to convert</p>
          </div>
        ) : (
          <pre className={`p-4 text-xs font-mono leading-5 whitespace-pre-wrap break-all ${
            isDark ? 'text-gray-300' : 'text-gray-800'
          }`}>
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
