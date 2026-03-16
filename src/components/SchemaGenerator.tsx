import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, FileCode, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import { parseJSON, generateJSONSchema } from '../utils/json';

export function SchemaGenerator() {
  const { theme, jsonInput } = useStore();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState('Root');
  const [showOptions, setShowOptions] = useState(false);

  const { parsed, error } = parseJSON(jsonInput);
  const schema = parsed ? generateJSONSchema(parsed, title) : null;

  const handleCopy = () => {
    if (!schema) return;
    navigator.clipboard.writeText(schema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${
        isDark ? 'border-[#2d2d2d] bg-[#1a1a1a]' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-2">
          <FileCode size={13} className="text-purple-400" />
          <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            JSON Schema
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
            draft-07
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
              isDark
                ? 'border-[#3d3d3d] text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a]'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Options <ChevronDown size={10} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!schema}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
              schema
                ? isDark
                  ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 border border-[#3d3d3d]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                : isDark ? 'opacity-40 text-gray-600' : 'opacity-40 text-gray-400'
            }`}
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Options row */}
      {showOptions && (
        <div className={`flex items-center gap-3 px-3 py-2 border-b flex-shrink-0 ${
          isDark ? 'border-[#2d2d2d] bg-[#161616]' : 'border-gray-200 bg-white'
        }`}>
          <label className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={`text-xs px-2 py-1 rounded border outline-none w-40 ${
              isDark
                ? 'bg-[#2a2a2a] border-[#3d3d3d] text-gray-300 placeholder-gray-600'
                : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'
            }`}
            placeholder="Root"
          />
          <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Format detection: date-time, date, email, uri, uuid
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {!jsonInput.trim() ? (
          <div className={`flex flex-col items-center justify-center h-full gap-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <FileCode size={32} className="opacity-30" />
            <p className="text-xs">Paste valid JSON to generate schema</p>
          </div>
        ) : error ? (
          <div className={`flex flex-col items-center justify-center h-full gap-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <span className="text-red-400 text-xs">Invalid JSON — fix errors first</span>
          </div>
        ) : schema ? (
          <Editor
            value={schema}
            language="json"
            theme={isDark ? 'vs-dark' : 'light'}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              folding: true,
              renderLineHighlight: 'none',
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
