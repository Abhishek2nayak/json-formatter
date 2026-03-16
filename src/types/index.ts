export type Theme = 'dark' | 'light';
export type ViewMode = 'editor' | 'tree' | 'table' | 'compare' | 'convert';
export type ConvertFormat = 'yaml' | 'xml' | 'csv' | 'typescript' | 'python' | 'java' | 'env';
export type IndentSize = 2 | 4 | 'tab';

export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  position?: number;
}

export interface JsonStats {
  size: number;
  keys: number;
  depth: number;
  objects: number;
  arrays: number;
  strings: number;
  numbers: number;
  nulls: number;
  booleans: number;
}

export interface HistoryEntry {
  id: string;
  content: string;
  timestamp: number;
  label: string;
  size: number;
}

export interface TreeNode {
  key: string;
  value: unknown;
  path: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  depth: number;
  children?: TreeNode[];
  isExpanded?: boolean;
}

export interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
}

export interface ConversionResult {
  content: string;
  format: ConvertFormat;
  error?: string;
}

export interface SnippetType {
  language: string;
  label: string;
  code: string;
}
