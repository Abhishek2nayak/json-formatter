import React, { useState, useMemo, useCallback } from 'react';
import { ChevronRight, ChevronDown, Search, X, Copy } from 'lucide-react';
import { useStore } from '../store';
import { buildTreeNodes } from '../utils/json';
import type { TreeNode } from '../types';

interface TreeNodeProps {
  node: TreeNode;
  isDark: boolean;
  onSelect: (path: string) => void;
  searchTerm: string;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
}

function matchesSearch(node: TreeNode, term: string): boolean {
  if (!term) return true;
  const lower = term.toLowerCase();
  if (node.key.toLowerCase().includes(lower)) return true;
  if (typeof node.value === 'string' && node.value.toLowerCase().includes(lower)) return true;
  if (typeof node.value === 'number' && String(node.value).includes(lower)) return true;
  return false;
}

function hasMatchingDescendant(node: TreeNode, term: string): boolean {
  if (!term) return true;
  if (matchesSearch(node, term)) return true;
  if (node.children) {
    return node.children.some(child => hasMatchingDescendant(child, term));
  }
  return false;
}

const VALUE_COLORS = {
  string: { dark: 'text-green-400', light: 'text-green-700' },
  number: { dark: 'text-blue-400', light: 'text-blue-600' },
  boolean: { dark: 'text-purple-400', light: 'text-purple-600' },
  null: { dark: 'text-gray-500', light: 'text-gray-400' },
  object: { dark: 'text-yellow-400', light: 'text-yellow-600' },
  array: { dark: 'text-orange-400', light: 'text-orange-600' },
};

function TreeNodeComponent({ node, isDark, onSelect, searchTerm, expandedPaths, onToggle }: TreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const hasChildren = node.children && node.children.length > 0;
  const isVisible = !searchTerm || hasMatchingDescendant(node, searchTerm);
  const isMatch = searchTerm && matchesSearch(node, searchTerm);

  if (!isVisible) return null;

  const typeColor = VALUE_COLORS[node.type];
  const colorClass = isDark ? typeColor.dark : typeColor.light;

  const renderValue = () => {
    if (node.type === 'object') {
      return <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
        {`{${node.children?.length ?? 0}}`}
      </span>;
    }
    if (node.type === 'array') {
      return <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
        {`[${node.children?.length ?? 0}]`}
      </span>;
    }
    if (node.type === 'null') return <span className={colorClass}>null</span>;
    if (node.type === 'boolean') return <span className={colorClass}>{String(node.value)}</span>;
    if (node.type === 'string') {
      const str = String(node.value);
      const truncated = str.length > 80 ? str.slice(0, 80) + '...' : str;
      return <span className={colorClass}>"{truncated}"</span>;
    }
    return <span className={colorClass}>{String(node.value)}</span>;
  };

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(node.path);
  };

  const handleCopyValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    const val = typeof node.value === 'string' ? node.value : JSON.stringify(node.value, null, 2);
    navigator.clipboard.writeText(val);
  };

  return (
    <div className="tree-node-enter">
      <div
        className={`group flex items-center gap-1 py-0.5 px-2 rounded cursor-pointer transition-colors text-xs ${
          isMatch
            ? isDark ? 'bg-yellow-500/15' : 'bg-yellow-100'
            : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${node.depth * 16 + 8}px` }}
        onClick={() => {
          onSelect(node.path);
          if (hasChildren) onToggle(node.path);
        }}
      >
        {/* Expand/collapse arrow */}
        <span className="w-4 flex-shrink-0">
          {hasChildren ? (
            isExpanded
              ? <ChevronDown size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              : <ChevronRight size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
          ) : null}
        </span>

        {/* Type indicator dot */}
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colorClass.replace('text-', 'bg-')}`} />

        {/* Key */}
        <span className={`font-medium flex-shrink-0 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {node.depth === 0 ? 'root' : node.key}
        </span>

        <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>:</span>

        {/* Value */}
        <span className="truncate">{renderValue()}</span>

        {/* Actions on hover */}
        <span className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={handleCopyPath}
            className={`text-xs px-1.5 py-0.5 rounded font-mono ${
              isDark ? 'text-gray-600 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
            }`}
            title="Copy path"
          >
            path
          </button>
          <button
            onClick={handleCopyValue}
            className={`text-xs p-0.5 rounded ${
              isDark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Copy value"
          >
            <Copy size={10} />
          </button>
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              isDark={isDark}
              onSelect={onSelect}
              searchTerm={searchTerm}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView() {
  const { theme, jsonInput, setSelectedPath } = useStore();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['$']));

  const tree = useMemo(() => {
    const { parsed, error } = (() => {
      try {
        return { parsed: JSON.parse(jsonInput), error: null };
      } catch (e) {
        return { parsed: null, error: e };
      }
    })();
    if (error || parsed === null) return null;
    return buildTreeNodes(parsed);
  }, [jsonInput]);

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expandAll = () => {
    const paths = new Set<string>();
    function collect(node: TreeNode) {
      paths.add(node.path);
      node.children?.forEach(collect);
    }
    if (tree) collect(tree);
    setExpandedPaths(paths);
  };

  const collapseAll = () => {
    setExpandedPaths(new Set(['$']));
  };

  if (!jsonInput.trim()) {
    return (
      <div className={`flex flex-col items-center justify-center h-full gap-3 ${
        isDark ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <div className="text-4xl">🌳</div>
        <p className="text-sm">Paste JSON in the editor to see the tree view</p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className={`flex flex-col items-center justify-center h-full gap-3 ${
        isDark ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <div className="text-4xl">⚠️</div>
        <p className="text-sm">Fix JSON errors to see the tree view</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className={`flex items-center gap-2 px-3 py-2 border-b flex-shrink-0 ${
        isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
      }`}>
        <Search size={13} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
        <input
          type="text"
          placeholder="Search keys and values..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`flex-1 text-xs bg-transparent outline-none ${
            isDark ? 'text-gray-200 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'
          }`}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}>
            <X size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
          </button>
        )}
        <div className={`w-px h-4 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />
        <button
          onClick={expandAll}
          className={`text-xs ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Expand all
        </button>
        <button
          onClick={collapseAll}
          className={`text-xs ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Collapse
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto scrollbar-thin py-2">
        <TreeNodeComponent
          node={tree}
          isDark={isDark}
          onSelect={setSelectedPath}
          searchTerm={searchTerm}
          expandedPaths={expandedPaths}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
