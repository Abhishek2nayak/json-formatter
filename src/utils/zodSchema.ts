/** Recursively infer a Zod schema string from a parsed JSON value. */
function inferZodType(value: unknown, depth = 0): string {
  if (value === null) return 'z.null()';

  switch (typeof value) {
    case 'string':  return 'z.string()';
    case 'boolean': return 'z.boolean()';
    case 'number':  return Number.isInteger(value) ? 'z.number().int()' : 'z.number()';

    case 'object': {
      if (Array.isArray(value)) {
        if (value.length === 0) return 'z.array(z.unknown())';
        const types = value.map(v => inferZodType(v, depth));
        const unique = [...new Set(types)];
        const inner = unique.length === 1 ? unique[0] : `z.union([${unique.join(', ')}])`;
        return `z.array(${inner})`;
      }

      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'z.object({})';
      const pad  = '  '.repeat(depth + 1);
      const back = '  '.repeat(depth);
      const fields = entries.map(([k, v]) => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
        return `${pad}${key}: ${inferZodType(v, depth + 1)}`;
      });
      return `z.object({\n${fields.join(',\n')},\n${back}})`;
    }

    default: return 'z.unknown()';
  }
}

export interface ZodResult {
  schema: string;
  error: string | null;
}

export function jsonToZodSchema(json: string): ZodResult {
  if (!json.trim()) return { schema: '', error: null };
  try {
    const parsed = JSON.parse(json);
    const body = inferZodType(parsed);
    const schema = [
      "import { z } from 'zod';",
      '',
      `export const schema = ${body};`,
      '',
      'export type Schema = z.infer<typeof schema>;',
    ].join('\n');
    return { schema, error: null };
  } catch (e) {
    return { schema: '', error: (e as Error).message };
  }
}
