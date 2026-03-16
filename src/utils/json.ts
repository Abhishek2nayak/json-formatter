import type { JsonError, JsonStats, TreeNode } from '../types';

export function parseJSON(input: string): { parsed: unknown; error: JsonError | null } {
  try {
    const parsed = JSON.parse(input);
    return { parsed, error: null };
  } catch (e) {
    const err = e as SyntaxError;
    const msg = err.message;

    // Extract position from error message
    const posMatch = msg.match(/position (\d+)/);
    const pos = posMatch ? parseInt(posMatch[1]) : undefined;

    let line: number | undefined;
    let column: number | undefined;

    if (pos !== undefined) {
      const lines = input.substring(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      parsed: null,
      error: { message: msg, line, column, position: pos },
    };
  }
}

export function formatJSON(input: string, indent: number | string = 2): string {
  const { parsed, error } = parseJSON(input);
  if (error || parsed === undefined) return input;
  return JSON.stringify(parsed, null, indent);
}

export function minifyJSON(input: string): string {
  const { parsed, error } = parseJSON(input);
  if (error || parsed === undefined) return input;
  return JSON.stringify(parsed);
}

export function getJSONStats(parsed: unknown): JsonStats {
  let keys = 0;
  let depth = 0;
  let objects = 0;
  let arrays = 0;
  let strings = 0;
  let numbers = 0;
  let nulls = 0;
  let booleans = 0;

  function traverse(value: unknown, currentDepth: number) {
    depth = Math.max(depth, currentDepth);

    if (value === null) {
      nulls++;
    } else if (typeof value === 'boolean') {
      booleans++;
    } else if (typeof value === 'number') {
      numbers++;
    } else if (typeof value === 'string') {
      strings++;
    } else if (Array.isArray(value)) {
      arrays++;
      keys += value.length;
      value.forEach(item => traverse(item, currentDepth + 1));
    } else if (typeof value === 'object') {
      objects++;
      const objKeys = Object.keys(value as object);
      keys += objKeys.length;
      objKeys.forEach(k => traverse((value as Record<string, unknown>)[k], currentDepth + 1));
    }
  }

  traverse(parsed, 0);

  return {
    size: JSON.stringify(parsed).length,
    keys,
    depth,
    objects,
    arrays,
    strings,
    numbers,
    nulls,
    booleans,
  };
}

export function buildTreeNodes(value: unknown, key: string = 'root', path: string = '$', depth: number = 0): TreeNode {
  const type = getValueType(value);

  const node: TreeNode = {
    key,
    value,
    path,
    type,
    depth,
    isExpanded: depth < 2,
  };

  if (type === 'object' && value !== null) {
    node.children = Object.entries(value as Record<string, unknown>).map(([k, v]) =>
      buildTreeNodes(v, k, `${path}.${k}`, depth + 1)
    );
  } else if (type === 'array') {
    node.children = (value as unknown[]).map((v, i) =>
      buildTreeNodes(v, `[${i}]`, `${path}[${i}]`, depth + 1)
    );
  }

  return node;
}

export function getValueType(value: unknown): TreeNode['type'] {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'null';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getValueAtPath(obj: unknown, path: string): unknown {
  if (path === '$') return obj;
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean).slice(1);
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function removeNullValues(obj: unknown): unknown {
  if (obj === null || obj === undefined) return undefined;
  if (Array.isArray(obj)) {
    return obj.map(removeNullValues).filter(v => v !== undefined);
  }
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const cleaned = removeNullValues(v);
      if (cleaned !== undefined) result[k] = cleaned;
    }
    return result;
  }
  return obj;
}

export function sortKeysAlphabetically(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortKeysAlphabetically);
  if (typeof obj === 'object' && obj !== null) {
    const sorted: Record<string, unknown> = {};
    Object.keys(obj as object).sort().forEach(k => {
      sorted[k] = sortKeysAlphabetically((obj as Record<string, unknown>)[k]);
    });
    return sorted;
  }
  return obj;
}

export function flattenJSON(obj: unknown, prefix: string = '', separator: string = '.'): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  function flatten(current: unknown, key: string) {
    if (Array.isArray(current)) {
      current.forEach((item, i) => flatten(item, key ? `${key}[${i}]` : `[${i}]`));
    } else if (typeof current === 'object' && current !== null) {
      Object.entries(current as Record<string, unknown>).forEach(([k, v]) => {
        flatten(v, key ? `${key}${separator}${k}` : k);
      });
    } else {
      result[key] = current;
    }
  }

  flatten(obj, prefix);
  return result;
}

export function unflattenJSON(obj: Record<string, unknown>, separator: string = '.'): unknown {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split(separator);
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
  }

  return result;
}

export function suggestFix(input: string): string {
  let fixed = input.trim();

  // Fix trailing commas
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Fix single quotes to double quotes
  fixed = fixed.replace(/'/g, '"');

  // Fix unquoted keys
  fixed = fixed.replace(/(\{|\,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

  // Fix undefined values
  fixed = fixed.replace(/:\s*undefined/g, ':null');

  // Fix missing quotes on string values (basic)
  // Note: this is a heuristic and may not always work

  return fixed;
}

export function diffJSON(left: unknown, right: unknown, path: string = ''): {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
} {
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];
  const unchanged: string[] = [];

  if (JSON.stringify(left) === JSON.stringify(right)) {
    unchanged.push(path || 'root');
    return { added, removed, modified, unchanged };
  }

  if (typeof left !== typeof right || Array.isArray(left) !== Array.isArray(right)) {
    modified.push(path || 'root');
    return { added, removed, modified, unchanged };
  }

  if (typeof left === 'object' && left !== null && right !== null) {
    const leftObj = left as Record<string, unknown>;
    const rightObj = right as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);

    for (const key of allKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in leftObj)) {
        added.push(childPath);
      } else if (!(key in rightObj)) {
        removed.push(childPath);
      } else {
        const childDiff = diffJSON(leftObj[key], rightObj[key], childPath);
        added.push(...childDiff.added);
        removed.push(...childDiff.removed);
        modified.push(...childDiff.modified);
        unchanged.push(...childDiff.unchanged);
      }
    }
  } else {
    modified.push(path || 'root');
  }

  return { added, removed, modified, unchanged };
}
