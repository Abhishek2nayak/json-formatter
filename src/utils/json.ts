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

export function removeEmptyValues(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    const filtered = obj
      .map(removeEmptyValues)
      .filter(v => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0) && !(typeof v === 'object' && v !== null && Object.keys(v).length === 0));
    return filtered;
  }
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const cleaned = removeEmptyValues(v);
      if (cleaned !== undefined && cleaned !== null && cleaned !== '' && !(Array.isArray(cleaned) && cleaned.length === 0) && !(typeof cleaned === 'object' && cleaned !== null && Object.keys(cleaned).length === 0)) {
        result[k] = cleaned;
      }
    }
    return result;
  }
  return obj;
}

export function detectDuplicateKeys(input: string): { path: string; key: string }[] {
  const results: { path: string; key: string }[] = [];
  let pos = 0;
  const s = input.trim();

  function skipWs() { while (pos < s.length && /\s/.test(s[pos])) pos++; }

  function parseStr(): string {
    pos++;
    let r = '';
    while (pos < s.length) {
      if (s[pos] === '\\') { r += s[pos] + s[pos + 1]; pos += 2; continue; }
      if (s[pos] === '"') { pos++; break; }
      r += s[pos++];
    }
    return r;
  }

  function parseVal(path: string): void {
    skipWs();
    if (pos >= s.length) return;
    const ch = s[pos];
    if (ch === '{') {
      pos++;
      const seen = new Set<string>();
      while (pos < s.length && s[pos] !== '}') {
        skipWs();
        if (s[pos] === ',') { pos++; continue; }
        if (s[pos] === '}') break;
        if (s[pos] === '"') {
          const key = parseStr();
          if (seen.has(key)) results.push({ path, key });
          seen.add(key);
          skipWs();
          if (s[pos] === ':') pos++;
          parseVal(path === '$' ? `$.${key}` : `${path}.${key}`);
        } else { pos++; }
      }
      if (pos < s.length) pos++;
    } else if (ch === '[') {
      pos++;
      let idx = 0;
      while (pos < s.length && s[pos] !== ']') {
        skipWs();
        if (s[pos] === ',') { pos++; continue; }
        if (s[pos] === ']') break;
        parseVal(`${path}[${idx++}]`);
      }
      if (pos < s.length) pos++;
    } else if (ch === '"') { parseStr(); }
    else if (ch === 't') { pos += 4; }
    else if (ch === 'f') { pos += 5; }
    else if (ch === 'n') { pos += 4; }
    else { while (pos < s.length && /[0-9.\-+eE]/.test(s[pos])) pos++; }
  }

  try { parseVal('$'); } catch { /* ignore parse errors */ }
  return results;
}

export function detectTimestamps(obj: unknown): { path: string; unix: number; date: string }[] {
  const results: { path: string; unix: number; date: string }[] = [];
  const now = Date.now();
  const MIN_TS = 1_000_000_000;   // ~2001
  const MAX_TS = 9_999_999_999;   // ~2286 (seconds)
  const MIN_MS = 1_000_000_000_000;
  const MAX_MS = 9_999_999_999_999;

  function traverse(value: unknown, path: string) {
    if (typeof value === 'number') {
      let unix: number | null = null;
      if (value >= MIN_TS && value <= MAX_TS) unix = value * 1000;
      else if (value >= MIN_MS && value <= MAX_MS) unix = value;
      if (unix && Math.abs(unix - now) < 50 * 365 * 24 * 60 * 60 * 1000) {
        results.push({ path, unix: value, date: new Date(unix).toISOString() });
      }
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => traverse(v, `${path}[${i}]`));
    } else if (typeof value === 'object' && value !== null) {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        traverse(v, `${path}.${k}`);
      }
    }
  }
  traverse(obj, '$');
  return results;
}

export function generateJSONSchema(parsed: unknown, title: string = 'Root'): string {
  function inferSchema(value: unknown): Record<string, unknown> {
    if (value === null) return { type: 'null' };
    if (typeof value === 'boolean') return { type: 'boolean' };
    if (typeof value === 'number') return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
    if (typeof value === 'string') {
      const schema: Record<string, unknown> = { type: 'string' };
      if (/^\d{4}-\d{2}-\d{2}T/.test(value)) schema.format = 'date-time';
      else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) schema.format = 'date';
      else if (/^[\w.+-]+@[\w-]+\.\w{2,}$/.test(value)) schema.format = 'email';
      else if (/^https?:\/\//.test(value)) schema.format = 'uri';
      else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) schema.format = 'uuid';
      return schema;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return { type: 'array', items: {} };
      const itemTypes = [...new Set(value.map(v => typeof v === 'object' ? 'object' : typeof v))];
      return { type: 'array', items: inferSchema(value[0]), minItems: 0, ...(itemTypes.length > 1 ? {} : {}) };
    }
    if (typeof value === 'object') {
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        properties[k] = inferSchema(v);
        if (v !== null && v !== undefined) required.push(k);
      }
      const schema: Record<string, unknown> = { type: 'object', properties };
      if (required.length > 0) schema.required = required;
      return schema;
    }
    return {};
  }

  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title,
    description: `Generated by JsonWorkspace on ${new Date().toLocaleDateString()}`,
    ...inferSchema(parsed),
  };
  return JSON.stringify(schema, null, 2);
}

export function decodeBase64InJSON(obj: unknown): unknown {
  if (typeof obj === 'string') {
    try {
      const decoded = atob(obj);
      if (/^[\x20-\x7E\n\r\t]*$/.test(decoded) && decoded.length > 0) return decoded;
    } catch { /* not base64 */ }
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(decodeBase64InJSON);
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[k] = decodeBase64InJSON(v);
    }
    return result;
  }
  return obj;
}

export function encodeBase64InJSON(obj: unknown): unknown {
  if (typeof obj === 'string') return btoa(unescape(encodeURIComponent(obj)));
  if (Array.isArray(obj)) return obj.map(encodeBase64InJSON);
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[k] = encodeBase64InJSON(v);
    }
    return result;
  }
  return obj;
}

export function filterByRegex(obj: unknown, pattern: string, searchIn: 'keys' | 'values' | 'both' = 'both'): unknown {
  try {
    const regex = new RegExp(pattern, 'i');
    function filter(value: unknown, _key: string = ''): unknown {
      if (Array.isArray(value)) {
        const result = value
          .map((v, i) => filter(v, String(i)))
          .filter(v => v !== undefined);
        return result.length > 0 ? result : undefined;
      }
      if (typeof value === 'object' && value !== null) {
        const result: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          const keyMatches = (searchIn === 'keys' || searchIn === 'both') && regex.test(k);
          const filtered = filter(v, k);
          if (keyMatches) result[k] = v;
          else if (filtered !== undefined) result[k] = filtered;
        }
        return Object.keys(result).length > 0 ? result : undefined;
      }
      if ((searchIn === 'values' || searchIn === 'both') && regex.test(String(value))) return value;
      return undefined;
    }
    const result = filter(obj, '$');
    return result ?? {};
  } catch { return obj; }
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
