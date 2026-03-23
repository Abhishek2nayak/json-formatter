import { describe, it, expect } from 'vitest';
import { jsonToZodSchema } from '../zodSchema';

// ─────────────────────────────────────────────
// Empty / invalid input
// ─────────────────────────────────────────────
describe('jsonToZodSchema — invalid input', () => {
  it('returns empty schema and null error for empty string', () => {
    const { schema, error } = jsonToZodSchema('');
    expect(schema).toBe('');
    expect(error).toBeNull();
  });

  it('returns empty schema and null error for whitespace-only input', () => {
    const { schema, error } = jsonToZodSchema('   ');
    expect(schema).toBe('');
    expect(error).toBeNull();
  });

  it('returns an error for invalid JSON', () => {
    const { schema, error } = jsonToZodSchema('{bad json}');
    expect(schema).toBe('');
    expect(error).not.toBeNull();
  });

  it('returns an error for bare string (not a JSON value)', () => {
    const { error } = jsonToZodSchema('hello');
    expect(error).not.toBeNull();
  });
});

// ─────────────────────────────────────────────
// Primitive top-level values
// ─────────────────────────────────────────────
describe('jsonToZodSchema — primitives', () => {
  it('generates z.string() for a top-level string', () => {
    const { schema, error } = jsonToZodSchema('"hello"');
    expect(error).toBeNull();
    expect(schema).toContain('z.string()');
  });

  it('generates z.boolean() for a top-level boolean', () => {
    const { schema, error } = jsonToZodSchema('true');
    expect(error).toBeNull();
    expect(schema).toContain('z.boolean()');
  });

  it('generates z.null() for null', () => {
    const { schema, error } = jsonToZodSchema('null');
    expect(error).toBeNull();
    expect(schema).toContain('z.null()');
  });

  it('generates z.number().int() for an integer', () => {
    const { schema, error } = jsonToZodSchema('42');
    expect(error).toBeNull();
    expect(schema).toContain('z.number().int()');
  });

  it('generates z.number() (without .int()) for a float', () => {
    const { schema, error } = jsonToZodSchema('3.14');
    expect(error).toBeNull();
    expect(schema).toContain('z.number()');
    expect(schema).not.toContain('z.number().int()');
  });
});

// ─────────────────────────────────────────────
// Flat object
// ─────────────────────────────────────────────
describe('jsonToZodSchema — flat object', () => {
  const json = JSON.stringify({ name: 'Alice', age: 30, active: true, score: 9.5, ref: null });

  it('wraps in z.object()', () => {
    const { schema } = jsonToZodSchema(json);
    expect(schema).toContain('z.object(');
  });

  it('infers z.string() for string fields', () => {
    const { schema } = jsonToZodSchema(json);
    expect(schema).toContain('name: z.string()');
  });

  it('infers z.number().int() for integer fields', () => {
    const { schema } = jsonToZodSchema(json);
    expect(schema).toContain('age: z.number().int()');
  });

  it('infers z.boolean() for boolean fields', () => {
    const { schema } = jsonToZodSchema(json);
    expect(schema).toContain('active: z.boolean()');
  });

  it('infers z.number() for float fields', () => {
    const { schema } = jsonToZodSchema(json);
    expect(schema).toContain('score: z.number()');
  });

  it('infers z.null() for null fields', () => {
    const { schema } = jsonToZodSchema(json);
    expect(schema).toContain('ref: z.null()');
  });
});

// ─────────────────────────────────────────────
// Nested object
// ─────────────────────────────────────────────
describe('jsonToZodSchema — nested object', () => {
  it('recursively generates z.object() for nested objects', () => {
    const json = JSON.stringify({ user: { id: 1, name: 'Alice' } });
    const { schema, error } = jsonToZodSchema(json);
    expect(error).toBeNull();
    expect(schema).toContain('user: z.object(');
    expect(schema).toContain('id: z.number().int()');
    expect(schema).toContain('name: z.string()');
  });

  it('handles deeply nested objects', () => {
    const json = JSON.stringify({ a: { b: { c: { d: 'deep' } } } });
    const { schema, error } = jsonToZodSchema(json);
    expect(error).toBeNull();
    expect(schema).toContain("d: z.string()");
  });
});

// ─────────────────────────────────────────────
// Arrays
// ─────────────────────────────────────────────
describe('jsonToZodSchema — arrays', () => {
  it('generates z.array(z.unknown()) for empty arrays', () => {
    const { schema, error } = jsonToZodSchema(JSON.stringify({ tags: [] }));
    expect(error).toBeNull();
    expect(schema).toContain('z.array(z.unknown())');
  });

  it('generates typed z.array() for homogeneous string array', () => {
    const { schema, error } = jsonToZodSchema(JSON.stringify({ roles: ['admin', 'editor'] }));
    expect(error).toBeNull();
    expect(schema).toContain('z.array(z.string())');
  });

  it('generates typed z.array() for homogeneous number array', () => {
    const { schema, error } = jsonToZodSchema(JSON.stringify({ scores: [1, 2, 3] }));
    expect(error).toBeNull();
    expect(schema).toContain('z.array(z.number().int())');
  });

  it('generates z.array(z.union([...])) for mixed-type arrays', () => {
    const { schema, error } = jsonToZodSchema(JSON.stringify({ mixed: [1, 'two', true] }));
    expect(error).toBeNull();
    expect(schema).toContain('z.union(');
    expect(schema).toContain('z.array(');
  });

  it('handles array of objects', () => {
    const { schema, error } = jsonToZodSchema(JSON.stringify({ items: [{ id: 1 }] }));
    expect(error).toBeNull();
    expect(schema).toContain('z.array(z.object(');
  });
});

// ─────────────────────────────────────────────
// Keys requiring quoting
// ─────────────────────────────────────────────
describe('jsonToZodSchema — special key names', () => {
  it('quotes keys that are not valid JS identifiers', () => {
    const json = JSON.stringify({ 'my-key': 'value', 'with space': 1 });
    const { schema, error } = jsonToZodSchema(json);
    expect(error).toBeNull();
    expect(schema).toContain('"my-key"');
    expect(schema).toContain('"with space"');
  });

  it('does not quote standard camelCase keys', () => {
    const json = JSON.stringify({ userId: 1, firstName: 'Bob' });
    const { schema } = jsonToZodSchema(json);
    expect(schema).toContain('userId:');
    expect(schema).toContain('firstName:');
  });
});

// ─────────────────────────────────────────────
// Output structure
// ─────────────────────────────────────────────
describe('jsonToZodSchema — output structure', () => {
  it('includes the zod import line', () => {
    const { schema } = jsonToZodSchema('{"x":1}');
    expect(schema).toContain("import { z } from 'zod'");
  });

  it('exports a const named schema', () => {
    const { schema } = jsonToZodSchema('{"x":1}');
    expect(schema).toContain('export const schema =');
  });

  it('exports a Schema type via z.infer', () => {
    const { schema } = jsonToZodSchema('{"x":1}');
    expect(schema).toContain('export type Schema = z.infer<typeof schema>');
  });
});
