import * as yaml from 'js-yaml';
import { XMLBuilder } from 'fast-xml-parser';
import type { ConvertFormat } from '../types';

export function toYAML(parsed: unknown): string {
  return yaml.dump(parsed, { indent: 2, lineWidth: -1 });
}

export function toXML(parsed: unknown, rootTag: string = 'root'): string {
  const builder = new XMLBuilder({
    format: true,
    indentBy: '  ',
    ignoreAttributes: false,
  });

  const wrapped = Array.isArray(parsed)
    ? { [rootTag]: { item: parsed } }
    : { [rootTag]: parsed };

  return `<?xml version="1.0" encoding="UTF-8"?>\n${builder.build(wrapped)}`;
}

export function toCSV(parsed: unknown): string {
  if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
    const headers = Object.keys(parsed[0] as object);
    const rows = parsed.map(row => {
      return headers.map(h => {
        const val = (row as Record<string, unknown>)[h];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
    const rows = Object.entries(parsed as Record<string, unknown>).map(([k, v]) => {
      const val = v === null || v === undefined ? '' : String(v);
      return `${k},${val.includes(',') ? `"${val}"` : val}`;
    });
    return ['key,value', ...rows].join('\n');
  }

  return String(parsed);
}

export function toTypeScript(parsed: unknown, name: string = 'Root'): string {
  function getType(value: unknown, depth: number = 0, indent: string = '  '): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';

    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const itemType = getType(value[0], depth, indent);
      return `${itemType}[]`;
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'Record<string, unknown>';

      const fields = entries.map(([k, v]) => {
        const type = getType(v, depth + 1, indent + '  ');
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
        return `${indent + '  '}${key}: ${type};`;
      });

      return `{\n${fields.join('\n')}\n${indent}}`;
    }

    return 'unknown';
  }

  function buildInterface(value: unknown, interfaceName: string, indent: string = ''): string {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const itemInterface = buildInterface(value[0], `${interfaceName}Item`, indent);
      return `${itemInterface}\n\n${indent}export type ${interfaceName} = ${interfaceName}Item[];`;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      const nestedInterfaces: string[] = [];

      const fields = entries.map(([k, v]) => {
        let type: string;
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          const nested = toPascalCase(k);
          nestedInterfaces.push(buildInterface(v, nested, indent));
          type = nested;
        } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') {
          const nested = toPascalCase(k);
          nestedInterfaces.push(buildInterface(v, nested, indent));
          type = `${nested}[]`;
        } else {
          type = getType(v, 0, '  ');
        }
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
        return `  ${key}: ${type};`;
      });

      const nested = nestedInterfaces.length > 0 ? nestedInterfaces.join('\n\n') + '\n\n' : '';
      return `${nested}${indent}export interface ${interfaceName} {\n${fields.join('\n')}\n${indent}}`;
    }

    return `${indent}export type ${interfaceName} = ${getType(value)};`;
  }

  return buildInterface(parsed, name);
}

export function toPython(parsed: unknown, name: string = 'Root'): string {
  function getPythonType(value: unknown): string {
    if (value === null) return 'Optional[Any]';
    if (typeof value === 'string') return 'str';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List[Any]';
      return `List[${getPythonType(value[0])}]`;
    }
    if (typeof value === 'object') return toPascalCase(name);
    return 'Any';
  }

  function buildClass(value: unknown, className: string): string {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      const nestedClasses: string[] = [];

      const fields = entries.map(([k, v]) => {
        let type: string;
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          const nested = toPascalCase(k);
          nestedClasses.push(buildClass(v, nested));
          type = nested;
        } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') {
          const nested = toPascalCase(k);
          nestedClasses.push(buildClass(v[0], nested));
          type = `List[${nested}]`;
        } else {
          type = getPythonType(v);
        }
        return `    ${toSnakeCase(k)}: ${type}`;
      });

      const nested = nestedClasses.length > 0 ? nestedClasses.join('\n\n') + '\n\n' : '';
      return `${nested}@dataclass\nclass ${className}:\n${fields.join('\n')}`;
    }
    return '';
  }

  const header = 'from dataclasses import dataclass\nfrom typing import List, Optional, Any\n\n';
  return header + buildClass(parsed, name);
}

export function toJava(parsed: unknown, name: string = 'Root'): string {
  function getJavaType(value: unknown, fieldName: string = ''): string {
    if (value === null) return 'Object';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<Object>';
      return `List<${getJavaType(value[0])}>`;
    }
    if (typeof value === 'object') return toPascalCase(fieldName || name);
    return 'Object';
  }

  function buildClass(value: unknown, className: string): string {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      const nestedClasses: string[] = [];

      const fields = entries.map(([k, v]) => {
        let type: string;
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          const nested = toPascalCase(k);
          nestedClasses.push(buildClass(v, nested));
          type = nested;
        } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') {
          const nested = toPascalCase(k);
          nestedClasses.push(buildClass(v[0], nested));
          type = `List<${nested}>`;
        } else {
          type = getJavaType(v, k);
        }
        return `    private ${type} ${toCamelCase(k)};`;
      });

      const getters = entries.map(([k]) => {
        const camel = toCamelCase(k);
        const pascal = toPascalCase(k);
        return `    public ${getJavaType((value as Record<string, unknown>)[k], k)} get${pascal}() { return ${camel}; }\n    public void set${pascal}(${getJavaType((value as Record<string, unknown>)[k], k)} ${camel}) { this.${camel} = ${camel}; }`;
      });

      const nested = nestedClasses.length > 0 ? nestedClasses.join('\n\n') + '\n\n' : '';
      return `${nested}public class ${className} {\n${fields.join('\n')}\n\n${getters.join('\n')}\n}`;
    }
    return '';
  }

  return buildClass(parsed, name);
}

function toPascalCase(str: string): string {
  return str.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '').replace(/[-\s]+/g, '_');
}

function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
}

export function convert(parsed: unknown, format: ConvertFormat): string {
  switch (format) {
    case 'yaml': return toYAML(parsed);
    case 'xml': return toXML(parsed);
    case 'csv': return toCSV(parsed);
    case 'typescript': return toTypeScript(parsed);
    case 'python': return toPython(parsed);
    case 'java': return toJava(parsed);
    default: return '';
  }
}

export function generateSnippets(url: string = 'https://api.example.com/data'): Array<{language: string; label: string; code: string}> {
  return [
    {
      language: 'javascript',
      label: 'fetch()',
      code: `const response = await fetch('${url}');
const data = await response.json();
console.log(data);`,
    },
    {
      language: 'javascript',
      label: 'axios',
      code: `import axios from 'axios';

const { data } = await axios.get('${url}');
console.log(data);`,
    },
    {
      language: 'bash',
      label: 'curl',
      code: `curl -X GET '${url}' \\
  -H 'Content-Type: application/json' | jq .`,
    },
    {
      language: 'python',
      label: 'Python requests',
      code: `import requests

response = requests.get('${url}')
data = response.json()
print(data)`,
    },
  ];
}
