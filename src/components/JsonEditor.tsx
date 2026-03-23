import { useCallback, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Copy, Download, Trash2, ClipboardPaste, ZoomIn } from 'lucide-react';
import { useStore } from '../store';
import { parseJSON, getJSONStats, formatJSON } from '../utils/json';
import type * as Monaco from 'monaco-editor';

interface Props {
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  height?: string;
}

export function JsonEditor({ readOnly = false, value, onChange, label, height = '100%' }: Props) {
  const {
    theme,
    jsonInput, setJsonInput,
    indentSize,
    setValidationResult, setStats,
    isValid, errors,
    addToHistory,
  } = useStore();

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const actualValue = value ?? jsonInput;
  const actualOnChange = onChange ?? setJsonInput;

  const isDark = theme === 'dark';

  const validateInput = useCallback((input: string) => {
    if (!input.trim()) {
      setValidationResult(false, []);
      setStats(null);
      return;
    }
    const { parsed, error } = parseJSON(input);
    if (error) {
      setValidationResult(false, [error]);
      setStats(null);
    } else {
      setValidationResult(true, []);
      setStats(getJSONStats(parsed));
    }
  }, [setValidationResult, setStats]);

  const handleChange = useCallback((val: string | undefined) => {
    const v = val ?? '';
    actualOnChange(v);
    validateInput(v);
  }, [actualOnChange, validateInput]);

  // Auto-format on paste
  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidPaste(() => {
      const currentValue = editor.getValue();
      if (currentValue) {
        const { error } = parseJSON(currentValue);
        if (!error) {
          const formatted = formatJSON(currentValue, indentSize === 'tab' ? '\t' : indentSize);
          if (formatted !== currentValue) {
            editor.setValue(formatted);
            actualOnChange(formatted);
          }
        }
        validateInput(currentValue);
        addToHistory(currentValue);
      }
    });
  };

  // Show error markers in Monaco
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    if (errors.length > 0 && errors[0].line) {
      monacoRef.current.editor.setModelMarkers(model, 'json-validator', [
        {
          severity: monacoRef.current.MarkerSeverity.Error,
          message: errors[0].message,
          startLineNumber: errors[0].line ?? 1,
          startColumn: errors[0].column ?? 1,
          endLineNumber: errors[0].line ?? 1,
          endColumn: (errors[0].column ?? 1) + 1,
        },
      ]);
    } else {
      monacoRef.current.editor.setModelMarkers(model, 'json-validator', []);
    }
  }, [errors]);

  const handleCopy = () => {
    navigator.clipboard.writeText(actualValue);
  };

  const handleDownload = () => {
    const blob = new Blob([actualValue], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    actualOnChange('');
    setValidationResult(false, []);
    setStats(null);
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    actualOnChange(text);
    validateInput(text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b flex-shrink-0 ${
        isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          {label && (
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {label}
            </span>
          )}
          {!readOnly && (
            <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
              !actualValue.trim()
                ? isDark ? 'text-gray-600' : 'text-gray-400'
                : isValid
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-red-500/15 text-red-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                !actualValue.trim() ? 'bg-gray-600' : isValid ? 'bg-green-400' : 'bg-red-400'
              }`} />
              {!actualValue.trim() ? 'Empty' : isValid ? 'Valid JSON' : 'Invalid'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          {!readOnly && (
            <button onClick={handlePaste} className="btn-icon" title="Paste from clipboard">
              <ClipboardPaste size={13} />
            </button>
          )}
          <button onClick={handleCopy} className="btn-icon" title="Copy">
            <Copy size={13} />
          </button>
          <button onClick={handleDownload} className="btn-icon" title="Download">
            <Download size={13} />
          </button>
          <button
            onClick={() => editorRef.current?.getAction('editor.action.fontZoomReset')?.run()}
            className="btn-icon"
            title="Reset zoom (Ctrl+0)"
          >
            <ZoomIn size={13} />
          </button>
          {!readOnly && (
            <button onClick={handleClear} className="btn-icon" title="Clear">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height={height}
          defaultLanguage="json"
          value={actualValue}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme={isDark ? 'vs-dark' : 'vs'}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            contextmenu: true,
            formatOnPaste: false,
            formatOnType: false,
            automaticLayout: true,
            tabSize: typeof indentSize === 'number' ? indentSize : 4,
            insertSpaces: indentSize !== 'tab',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            mouseWheelZoom: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>
    </div>
  );
}
