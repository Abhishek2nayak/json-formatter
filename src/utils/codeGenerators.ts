// ──────────────────────────────────────────────────────────────
// JSON → Code generators: TypeScript, Python, Go, SQL, Rust, C#
// ──────────────────────────────────────────────────────────────

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

// ── Helpers ────────────────────────────────────────────────────

function toPascalCase(s: string) {
  return s
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function toSnakeCase(s: string) {
  return s
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[-\s]+/g, '_');
}

// Collect nested object definitions so we can emit them separately
interface NestedDef { name: string; obj: Record<string, JsonValue> }

function collectNested(obj: Record<string, JsonValue>, _parentName: string, out: NestedDef[]) {
  for (const [key, val] of Object.entries(obj)) {
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      const childName = toPascalCase(key);
      out.push({ name: childName, obj: val as Record<string, JsonValue> });
      collectNested(val as Record<string, JsonValue>, childName, out);
    } else if (Array.isArray(val)) {
      const first = val[0];
      if (first !== null && typeof first === 'object' && !Array.isArray(first)) {
        const childName = toPascalCase(key.replace(/s$/, '')); // singularize
        out.push({ name: childName, obj: first as Record<string, JsonValue> });
        collectNested(first as Record<string, JsonValue>, childName, out);
      }
    }
  }
}

// ── TypeScript ─────────────────────────────────────────────────

function tsType(val: JsonValue, key: string): string {
  if (val === null) return 'null';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'unknown[]';
    const el = val[0];
    if (el !== null && typeof el === 'object' && !Array.isArray(el)) {
      return `${toPascalCase(key.replace(/s$/, ''))}[]`;
    }
    return `${tsType(el, key)}[]`;
  }
  if (typeof val === 'object') return toPascalCase(key);
  if (typeof val === 'number') return Number.isInteger(val) ? 'number' : 'number';
  return typeof val; // string | boolean | number
}

function tsInterface(name: string, obj: Record<string, JsonValue>, _defs: NestedDef[]): string {
  const lines = [`export interface ${name} {`];
  for (const [key, val] of Object.entries(obj)) {
    const t = tsType(val, key);
    lines.push(`  ${key}: ${t};`);
  }
  lines.push('}');
  return lines.join('\n');
}

export function toTypeScript(parsed: JsonValue, rootName = 'Root'): string {
  const root = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    return `// Could not generate TypeScript interface from this JSON.\n// Paste a JSON object or array of objects.`;
  }
  const obj = root as Record<string, JsonValue>;
  const defs: NestedDef[] = [];
  collectNested(obj, rootName, defs);

  const blocks: string[] = [];
  // Emit nested interfaces first (leaf → root order)
  const seen = new Set<string>();
  for (const d of [...defs].reverse()) {
    if (!seen.has(d.name)) {
      seen.add(d.name);
      blocks.push(tsInterface(d.name, d.obj, defs));
    }
  }
  blocks.push(tsInterface(rootName, obj, defs));
  return blocks.join('\n\n');
}

// ── Python Dataclass ───────────────────────────────────────────

function pyType(val: JsonValue, key: string): string {
  if (val === null) return 'Optional[Any]';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'List[Any]';
    const el = val[0];
    if (el !== null && typeof el === 'object' && !Array.isArray(el)) {
      return `List[${toPascalCase(key.replace(/s$/, ''))}]`;
    }
    return `List[${pyType(el, key)}]`;
  }
  if (typeof val === 'object') return toPascalCase(key);
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float';
  if (typeof val === 'boolean') return 'bool';
  return 'str';
}

function pyDataclass(name: string, obj: Record<string, JsonValue>): string {
  const lines = [`@dataclass`, `class ${name}:`];
  for (const [key, val] of Object.entries(obj)) {
    lines.push(`    ${toSnakeCase(key)}: ${pyType(val, key)}`);
  }
  return lines.join('\n');
}

export function toPython(parsed: JsonValue, rootName = 'Root'): string {
  const root = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    return `# Could not generate Python dataclass from this JSON.\n# Paste a JSON object or array of objects.`;
  }
  const obj = root as Record<string, JsonValue>;
  const defs: NestedDef[] = [];
  collectNested(obj, rootName, defs);

  const header = `from __future__ import annotations\nfrom dataclasses import dataclass\nfrom typing import Any, List, Optional\n`;
  const blocks: string[] = [header];
  const seen = new Set<string>();
  for (const d of [...defs].reverse()) {
    if (!seen.has(d.name)) {
      seen.add(d.name);
      blocks.push(pyDataclass(d.name, d.obj));
    }
  }
  blocks.push(pyDataclass(rootName, obj));
  return blocks.join('\n\n');
}

// ── Go Struct ──────────────────────────────────────────────────

function goType(val: JsonValue, key: string): string {
  if (val === null) return 'interface{}';
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]interface{}';
    const el = val[0];
    if (el !== null && typeof el === 'object' && !Array.isArray(el)) {
      return `[]${toPascalCase(key.replace(/s$/, ''))}`;
    }
    return `[]${goType(el, key)}`;
  }
  if (typeof val === 'object') return toPascalCase(key);
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float64';
  if (typeof val === 'boolean') return 'bool';
  return 'string';
}

function goStruct(name: string, obj: Record<string, JsonValue>): string {
  const lines = [`type ${name} struct {`];
  for (const [key, val] of Object.entries(obj)) {
    const fieldName = toPascalCase(key);
    const fieldType = goType(val, key);
    lines.push(`\t${fieldName.padEnd(16)} ${fieldType.padEnd(16)} \`json:"${key}"\``);
  }
  lines.push('}');
  return lines.join('\n');
}

export function toGo(parsed: JsonValue, rootName = 'Root'): string {
  const root = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    return `// Could not generate Go struct from this JSON.\n// Paste a JSON object or array of objects.`;
  }
  const obj = root as Record<string, JsonValue>;
  const defs: NestedDef[] = [];
  collectNested(obj, rootName, defs);

  const blocks: string[] = ['package main\n'];
  const seen = new Set<string>();
  for (const d of [...defs].reverse()) {
    if (!seen.has(d.name)) {
      seen.add(d.name);
      blocks.push(goStruct(d.name, d.obj));
    }
  }
  blocks.push(goStruct(rootName, obj));
  return blocks.join('\n\n');
}

// ── SQL CREATE TABLE ───────────────────────────────────────────

function sqlType(val: JsonValue): string {
  if (val === null) return 'TEXT';
  if (Array.isArray(val)) return 'JSON';
  if (typeof val === 'object') return 'JSON';
  if (typeof val === 'boolean') return 'BOOLEAN';
  if (typeof val === 'number') return Number.isInteger(val) ? 'INTEGER' : 'DECIMAL(10,2)';
  // Heuristic: long strings → TEXT, short → VARCHAR
  if (typeof val === 'string') {
    if (val.match(/^\d{4}-\d{2}-\d{2}/)) return 'TIMESTAMP';
    if (val.length > 100) return 'TEXT';
    return `VARCHAR(255)`;
  }
  return 'TEXT';
}

export function toSQL(parsed: JsonValue, tableName = 'table_name'): string {
  const root = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    return `-- Could not generate SQL from this JSON.\n-- Paste a JSON object or array of objects.`;
  }
  const obj = root as Record<string, JsonValue>;
  const name = toSnakeCase(tableName);
  const cols: string[] = [];

  // If there's no explicit id column, prepend one
  if (!('id' in obj)) {
    cols.push(`    id          BIGSERIAL PRIMARY KEY`);
  }

  for (const [key, val] of Object.entries(obj)) {
    const colName = toSnakeCase(key).padEnd(16);
    const colType = sqlType(val);
    const pk = key === 'id' ? ' PRIMARY KEY' : '';
    cols.push(`    ${colName} ${colType}${pk}`);
  }

  cols.push(`    created_at  TIMESTAMP DEFAULT NOW()`);
  cols.push(`    updated_at  TIMESTAMP DEFAULT NOW()`);

  return `CREATE TABLE ${name} (\n${cols.join(',\n')}\n);\n\n-- Indexes\nCREATE INDEX idx_${name}_id ON ${name} (id);`;
}

// ── Rust Struct ────────────────────────────────────────────────

function rustType(val: JsonValue, key: string): string {
  if (val === null) return 'Option<serde_json::Value>';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'Vec<serde_json::Value>';
    const el = val[0];
    if (el !== null && typeof el === 'object' && !Array.isArray(el)) {
      return `Vec<${toPascalCase(key.replace(/s$/, ''))}>`;
    }
    return `Vec<${rustType(el, key)}>`;
  }
  if (typeof val === 'object') return toPascalCase(key);
  if (typeof val === 'number') return Number.isInteger(val) ? 'i64' : 'f64';
  if (typeof val === 'boolean') return 'bool';
  return 'String';
}

function rustStruct(name: string, obj: Record<string, JsonValue>): string {
  const lines = [
    `#[derive(Debug, Clone, Serialize, Deserialize)]`,
    `pub struct ${name} {`,
  ];
  for (const [key, val] of Object.entries(obj)) {
    const fieldName = toSnakeCase(key);
    const fieldType = rustType(val, key);
    if (fieldName !== key) {
      lines.push(`    #[serde(rename = "${key}")]`);
    }
    lines.push(`    pub ${fieldName}: ${fieldType},`);
  }
  lines.push('}');
  return lines.join('\n');
}

export function toRust(parsed: JsonValue, rootName = 'Root'): string {
  const root = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    return `// Could not generate Rust struct from this JSON.\n// Paste a JSON object or array of objects.`;
  }
  const obj = root as Record<string, JsonValue>;
  const defs: NestedDef[] = [];
  collectNested(obj, rootName, defs);

  const header = `use serde::{Deserialize, Serialize};\n`;
  const blocks: string[] = [header];
  const seen = new Set<string>();
  for (const d of [...defs].reverse()) {
    if (!seen.has(d.name)) {
      seen.add(d.name);
      blocks.push(rustStruct(d.name, d.obj));
    }
  }
  blocks.push(rustStruct(rootName, obj));
  return blocks.join('\n\n');
}

// ── C# Class ───────────────────────────────────────────────────

function csType(val: JsonValue, key: string): string {
  if (val === null) return 'object?';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'List<object>';
    const el = val[0];
    if (el !== null && typeof el === 'object' && !Array.isArray(el)) {
      return `List<${toPascalCase(key.replace(/s$/, ''))}>`;
    }
    return `List<${csType(el, key)}>`;
  }
  if (typeof val === 'object') return toPascalCase(key);
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double';
  if (typeof val === 'boolean') return 'bool';
  return 'string';
}

function csClass(name: string, obj: Record<string, JsonValue>): string {
  const lines = [`public class ${name}`, `{`];
  for (const [key, val] of Object.entries(obj)) {
    const propName = toPascalCase(key);
    const propType = csType(val, key);
    lines.push(`    [JsonProperty("${key}")]`);
    lines.push(`    public ${propType} ${propName} { get; set; }`);
    lines.push('');
  }
  lines.push(`}`);
  return lines.join('\n');
}

export function toCSharp(parsed: JsonValue, rootName = 'Root'): string {
  const root = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    return `// Could not generate C# class from this JSON.\n// Paste a JSON object or array of objects.`;
  }
  const obj = root as Record<string, JsonValue>;
  const defs: NestedDef[] = [];
  collectNested(obj, rootName, defs);

  const header = `using System.Collections.Generic;\nusing Newtonsoft.Json;\n`;
  const blocks: string[] = [header];
  const seen = new Set<string>();
  for (const d of [...defs].reverse()) {
    if (!seen.has(d.name)) {
      seen.add(d.name);
      blocks.push(csClass(d.name, d.obj));
    }
  }
  blocks.push(csClass(rootName, obj));
  return blocks.join('\n\n');
}

// ── Target registry ────────────────────────────────────────────

export type CodeTarget = 'typescript' | 'python' | 'go' | 'sql' | 'rust' | 'csharp';

export const CODE_TARGETS: { id: CodeTarget; label: string; ext: string; monacoLang: string; color: string }[] = [
  { id: 'typescript', label: 'TypeScript', ext: 'ts',  monacoLang: 'typescript', color: 'text-sky-400' },
  { id: 'python',     label: 'Python',     ext: 'py',  monacoLang: 'python',     color: 'text-amber-400' },
  { id: 'go',         label: 'Go',         ext: 'go',  monacoLang: 'go',         color: 'text-cyan-400' },
  { id: 'sql',        label: 'SQL',        ext: 'sql', monacoLang: 'sql',        color: 'text-orange-400' },
  { id: 'rust',       label: 'Rust',       ext: 'rs',  monacoLang: 'rust',       color: 'text-rose-400' },
  { id: 'csharp',     label: 'C#',         ext: 'cs',  monacoLang: 'csharp',     color: 'text-violet-400' },
];

export function generateCode(parsed: unknown, target: CodeTarget, name: string): string {
  const v = parsed as JsonValue;
  switch (target) {
    case 'typescript': return toTypeScript(v, name);
    case 'python':     return toPython(v, name);
    case 'go':         return toGo(v, name);
    case 'sql':        return toSQL(v, name);
    case 'rust':       return toRust(v, name);
    case 'csharp':     return toCSharp(v, name);
  }
}
