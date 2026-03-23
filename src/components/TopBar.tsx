import React, { useRef } from 'react';
import {
  Upload, Link, Code, Minimize2, Maximize2, CheckCircle, GitCompare,
  ArrowLeftRight, Moon, Sun, Keyboard, History, ChevronDown,
  Braces, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatJSON, minifyJSON, parseJSON, getJSONStats, suggestFix } from '../utils/json';
import type { IndentSize, ViewMode } from '../types';

interface TopBarProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function TopBar({ isFullscreen, onToggleFullscreen }: TopBarProps) {
  const navigate = useNavigate();
  const {
    theme, toggleTheme,
    jsonInput, setJsonInput,
    viewMode, setViewMode,
    indentSize, setIndentSize,
    setValidationResult, setStats,
    showHistory, setShowHistory,
    showShortcuts, setShowShortcuts,
    addToHistory,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlValue, setUrlValue] = React.useState('');
  const [urlLoading, setUrlLoading] = React.useState(false);
  const [showIndentMenu, setShowIndentMenu] = React.useState(false);

  const handleFormat = () => {
    const formatted = formatJSON(jsonInput, indentSize === 'tab' ? '\t' : indentSize);
    setJsonInput(formatted);
    validateAndUpdate(formatted);
    addToHistory(formatted);
  };

  const handleMinify = () => {
    const minified = minifyJSON(jsonInput);
    setJsonInput(minified);
    validateAndUpdate(minified);
  };

  const handleValidate = () => {
    validateAndUpdate(jsonInput);
  };

  const validateAndUpdate = (input: string) => {
    const { parsed, error } = parseJSON(input);
    if (error) {
      setValidationResult(false, [error]);
      setStats(null);
    } else {
      setValidationResult(true, []);
      setStats(getJSONStats(parsed));
    }
  };

  const handleFix = () => {
    const fixed = suggestFix(jsonInput);
    setJsonInput(fixed);
    validateAndUpdate(fixed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setJsonInput(content);
      validateAndUpdate(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFetchUrl = async () => {
    if (!urlValue.trim()) return;
    setUrlLoading(true);
    try {
      const response = await fetch(urlValue);
      const text = await response.text();
      setJsonInput(text);
      validateAndUpdate(text);
      setShowUrlInput(false);
      setUrlValue('');
    } catch (e) {
      alert(`Failed to fetch: ${(e as Error).message}`);
    } finally {
      setUrlLoading(false);
    }
  };

  const isDark = theme === 'dark';

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'editor', label: 'Editor', icon: <Braces size={14} /> },
    { id: 'tree', label: 'Tree', icon: <Code size={14} /> },
    { id: 'compare', label: 'Compare', icon: <GitCompare size={14} /> },
    { id: 'convert', label: 'Convert', icon: <ArrowLeftRight size={14} /> },
  ];

  return (
    <div className={`flex items-center gap-2 px-3 h-12 border-b flex-shrink-0 ${
      isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-gray-200'
    }`}>
      {/* Back to home (fullscreen only) */}
      {isFullscreen && (
        <button
          onClick={() => navigate('/')}
          className={`btn-icon mr-1`}
          title="Back to home"
        >
          <Home size={14} />
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <Braces size={14} className="text-white" />
        </div>
        <span className={`text-sm font-semibold hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>
          JsonMaster
        </span>
      </div>

      <div className={`w-px h-5 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />

      {/* Upload */}
      <input ref={fileInputRef} type="file" accept=".json,.txt" className="hidden" onChange={handleFileUpload} />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`btn-ghost text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <Upload size={13} />
        <span className="hidden sm:block">Upload</span>
      </button>

      {/* Fetch URL */}
      <div className="relative">
        <button
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`btn-ghost text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Link size={13} />
          <span className="hidden sm:block">URL</span>
        </button>
        {showUrlInput && (
          <div className={`absolute top-8 left-0 z-50 p-2 rounded-lg border shadow-xl flex gap-2 w-72 ${
            isDark ? 'bg-[#1e1e1e] border-[#3d3d3d]' : 'bg-white border-gray-200'
          }`}>
            <input
              type="text"
              placeholder="https://api.example.com/data"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
              autoFocus
              className={`flex-1 text-xs px-2 py-1.5 rounded-md outline-none border ${
                isDark
                  ? 'bg-[#2a2a2a] border-[#3d3d3d] text-gray-200 placeholder-gray-600'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              onClick={handleFetchUrl}
              disabled={urlLoading}
              className="btn-primary text-xs py-1 px-2"
            >
              {urlLoading ? '...' : 'Fetch'}
            </button>
          </div>
        )}
      </div>

      <div className={`w-px h-5 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />

      {/* Format */}
      <button onClick={handleFormat} className="btn-primary text-xs py-1">
        <Code size={13} />
        <span className="hidden sm:block">Format</span>
      </button>

      {/* Minify */}
      <button
        onClick={handleMinify}
        className={`btn-ghost text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <Minimize2 size={13} />
        <span className="hidden sm:block">Minify</span>
      </button>

      {/* Validate */}
      <button
        onClick={handleValidate}
        className={`btn-ghost text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <CheckCircle size={13} />
        <span className="hidden sm:block">Validate</span>
      </button>

      {/* Fix */}
      <button
        onClick={handleFix}
        className={`btn-ghost text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
        title="Auto-fix common JSON errors"
      >
        <span className="text-yellow-400">⚡</span>
        <span className="hidden sm:block">Fix</span>
      </button>

      {/* Indent selector */}
      <div className="relative">
        <button
          onClick={() => setShowIndentMenu(!showIndentMenu)}
          className={`btn-ghost text-xs flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
        >
          {indentSize === 'tab' ? 'Tab' : `${indentSize}s`}
          <ChevronDown size={10} />
        </button>
        {showIndentMenu && (
          <div className={`absolute top-8 left-0 z-50 rounded-lg border shadow-xl overflow-hidden ${
            isDark ? 'bg-[#1e1e1e] border-[#3d3d3d]' : 'bg-white border-gray-200'
          }`}>
            {([2, 4, 'tab'] as IndentSize[]).map(size => (
              <button
                key={size}
                onClick={() => { setIndentSize(size); setShowIndentMenu(false); }}
                className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-blue-500/20 ${
                  indentSize === size ? 'text-blue-400' : isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {size === 'tab' ? 'Tab' : `${size} spaces`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`flex-1`} />

      {/* View mode tabs */}
      <div className={`flex items-center rounded-md p-0.5 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === item.id
                ? isDark ? 'bg-[#3d3d3d] text-white' : 'bg-white text-gray-900 shadow-sm'
                : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.icon}
            <span className="hidden sm:block">{item.label}</span>
          </button>
        ))}
      </div>

      <div className={`w-px h-5 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />

      {/* History */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className={`btn-icon ${showHistory ? 'text-blue-400' : ''} ${isDark ? '' : 'hover:bg-gray-100'}`}
        title="History (H)"
      >
        <History size={15} />
      </button>

      {/* Shortcuts */}
      <button
        onClick={() => setShowShortcuts(!showShortcuts)}
        className={`btn-icon ${isDark ? '' : 'hover:bg-gray-100'}`}
        title="Keyboard shortcuts (?)"
      >
        <Keyboard size={15} />
      </button>

      {/* Minimize / Maximize */}
      <button
        onClick={onToggleFullscreen}
        className={`btn-icon ${isDark ? '' : 'hover:bg-gray-100'}`}
        title={isFullscreen ? 'Compact view' : 'Fullscreen editor'}
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`btn-icon ${isDark ? '' : 'hover:bg-gray-100'}`}
        title="Toggle theme"
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </div>
  );
}
