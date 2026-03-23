import { describe, it, expect } from 'vitest';
import { buildRegex, getMatches } from '../regex';
import type { FlagState } from '../regex';

const ALL_OFF: FlagState = { g: false, i: false, m: false, s: false, u: false };
const GLOBAL: FlagState  = { g: true,  i: false, m: false, s: false, u: false };
const GLOBAL_I: FlagState = { g: true, i: true,  m: false, s: false, u: false };

// ─────────────────────────────────────────────
// buildRegex
// ─────────────────────────────────────────────
describe('buildRegex', () => {
  it('returns a RegExp for a valid pattern', () => {
    const re = buildRegex('\\d+', GLOBAL);
    expect(re).toBeInstanceOf(RegExp);
    expect(re?.source).toBe('\\d+');
    expect(re?.flags).toContain('g');
  });

  it('returns null for an invalid pattern', () => {
    expect(buildRegex('[invalid', GLOBAL)).toBeNull();
    expect(buildRegex('(?P<bad>)', GLOBAL)).toBeNull();
  });

  it('returns null for empty pattern wrapped in invalid syntax', () => {
    // valid empty pattern should still produce a RegExp
    const re = buildRegex('', ALL_OFF);
    expect(re).toBeInstanceOf(RegExp);
  });

  it('builds correct flag string from FlagState', () => {
    const re = buildRegex('a', { g: true, i: true, m: false, s: false, u: false });
    expect(re?.flags).toContain('g');
    expect(re?.flags).toContain('i');
    expect(re?.flags).not.toContain('m');
  });

  it('applies no flags when all flags are false', () => {
    const re = buildRegex('\\w+', ALL_OFF);
    expect(re?.flags).toBe('');
  });

  it('applies all five flags when all are true', () => {
    const re = buildRegex('.', { g: true, i: true, m: true, s: true, u: true });
    expect(re?.flags).toContain('g');
    expect(re?.flags).toContain('i');
    expect(re?.flags).toContain('m');
    expect(re?.flags).toContain('s');
    expect(re?.flags).toContain('u');
  });
});

// ─────────────────────────────────────────────
// getMatches — null / empty guards
// ─────────────────────────────────────────────
describe('getMatches — empty / null guards', () => {
  it('returns [] when regex is null', () => {
    expect(getMatches(null, 'hello')).toEqual([]);
  });

  it('returns [] when text is empty', () => {
    const re = buildRegex('\\d+', GLOBAL);
    expect(getMatches(re, '')).toEqual([]);
  });

  it('returns [] when there is no match', () => {
    const re = buildRegex('\\d+', GLOBAL);
    expect(getMatches(re, 'no digits here')).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// getMatches — single match (no global flag)
// ─────────────────────────────────────────────
describe('getMatches — single match (no global flag)', () => {
  it('returns only the first match when global flag is off', () => {
    const re = buildRegex('\\d+', ALL_OFF);
    const matches = getMatches(re, 'abc 123 def 456');
    expect(matches).toHaveLength(1);
    expect(matches[0].value).toBe('123');
    expect(matches[0].start).toBe(4);
    expect(matches[0].end).toBe(7);
    expect(matches[0].index).toBe(0);
  });
});

// ─────────────────────────────────────────────
// getMatches — multiple matches (global flag)
// ─────────────────────────────────────────────
describe('getMatches — multiple matches (global flag)', () => {
  it('returns all non-overlapping matches', () => {
    const re = buildRegex('\\d+', GLOBAL);
    const matches = getMatches(re, 'abc 123 def 456 ghi 789');
    expect(matches).toHaveLength(3);
    expect(matches.map(m => m.value)).toEqual(['123', '456', '789']);
  });

  it('assigns sequential index values', () => {
    const re = buildRegex('a', GLOBAL);
    const matches = getMatches(re, 'banana');
    expect(matches.map(m => m.index)).toEqual([0, 1, 2]);
  });

  it('reports correct start and end positions', () => {
    const re = buildRegex('\\d+', GLOBAL);
    const matches = getMatches(re, '12 345');
    expect(matches[0]).toMatchObject({ start: 0, end: 2, value: '12' });
    expect(matches[1]).toMatchObject({ start: 3, end: 6, value: '345' });
  });
});

// ─────────────────────────────────────────────
// getMatches — case-insensitive flag
// ─────────────────────────────────────────────
describe('getMatches — case-insensitive', () => {
  it('matches upper and lower case when i flag is on', () => {
    const re = buildRegex('hello', GLOBAL_I);
    const matches = getMatches(re, 'Hello HELLO hello');
    expect(matches).toHaveLength(3);
    expect(matches.map(m => m.value)).toEqual(['Hello', 'HELLO', 'hello']);
  });

  it('does NOT match upper case when i flag is off', () => {
    const re = buildRegex('hello', GLOBAL);
    const matches = getMatches(re, 'Hello HELLO hello');
    expect(matches).toHaveLength(1);
    expect(matches[0].value).toBe('hello');
  });
});

// ─────────────────────────────────────────────
// getMatches — capture groups
// ─────────────────────────────────────────────
describe('getMatches — capture groups', () => {
  it('exposes capture groups in .groups array', () => {
    const re = buildRegex('(\\d{4})-(\\d{2})-(\\d{2})', GLOBAL);
    const matches = getMatches(re, 'Date: 2025-01-15 and 2024-12-31');
    expect(matches).toHaveLength(2);
    expect(matches[0].groups).toEqual(['2025', '01', '15']);
    expect(matches[1].groups).toEqual(['2024', '12', '31']);
  });

  it('returns empty groups array when no capturing groups exist', () => {
    const re = buildRegex('\\d+', GLOBAL);
    const matches = getMatches(re, '42');
    expect(matches[0].groups).toEqual([]);
  });

  it('returns undefined for unmatched optional groups', () => {
    const re = buildRegex('(a)(b)?', GLOBAL);
    const matches = getMatches(re, 'a ac');
    // "a" matches with group1="a", group2=undefined
    const first = matches.find(m => m.value === 'a');
    expect(first?.groups[1]).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// getMatches — zero-length match guard
// ─────────────────────────────────────────────
describe('getMatches — zero-length match guard', () => {
  it('does not infinite-loop on zero-length matches', () => {
    const re = buildRegex('a*', GLOBAL);
    // a* matches zero chars at every position — function must advance lastIndex
    const matches = getMatches(re, 'bbb');
    // Should terminate and return results (mostly empty-string matches)
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBeLessThanOrEqual(500);
  });
});

// ─────────────────────────────────────────────
// getMatches — capped at 500
// ─────────────────────────────────────────────
describe('getMatches — 500-match cap', () => {
  it('returns at most 500 matches', () => {
    const text = 'a'.repeat(1000);
    const re = buildRegex('a', GLOBAL);
    const matches = getMatches(re, text);
    expect(matches.length).toBe(500);
  });
});

// ─────────────────────────────────────────────
// getMatches — common quick patterns
// ─────────────────────────────────────────────
describe('getMatches — common quick patterns', () => {
  it('email pattern finds valid email addresses', () => {
    const pattern = '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}';
    const re = buildRegex(pattern, GLOBAL_I);
    const text = 'Contact support@example.com or sales@company.org — not @nodomain or missingat.com';
    const matches = getMatches(re, text);
    expect(matches.map(m => m.value)).toEqual(['support@example.com', 'sales@company.org']);
  });

  it('UUID pattern matches standard UUID format', () => {
    const pattern = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    const re = buildRegex(pattern, GLOBAL_I);
    const text = 'id: 550e8400-e29b-41d4-a716-446655440000, other: not-a-uuid';
    const matches = getMatches(re, text);
    expect(matches).toHaveLength(1);
    expect(matches[0].value).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('hex color pattern matches 3 and 6 digit hex codes', () => {
    const pattern = '#(?:[0-9a-fA-F]{3}){1,2}\\b';
    const re = buildRegex(pattern, GLOBAL);
    const text = 'Colors: #fff, #FF0000, #abc123, not #GGGGGG or #12';
    const matches = getMatches(re, text);
    expect(matches.map(m => m.value)).toContain('#fff');
    expect(matches.map(m => m.value)).toContain('#FF0000');
    expect(matches.map(m => m.value)).toContain('#abc123');
  });

  it('date pattern YYYY-MM-DD matches valid dates', () => {
    const pattern = '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])';
    const re = buildRegex(pattern, GLOBAL);
    const text = 'Created: 2025-01-15, Updated: 2024-12-31, Bad: 2025-13-01';
    const matches = getMatches(re, text);
    expect(matches.map(m => m.value)).toEqual(['2025-01-15', '2024-12-31']);
  });

  it('multiline flag makes ^ match start of each line', () => {
    const re = buildRegex('^\\w+', { g: true, i: false, m: true, s: false, u: false });
    const text = 'hello world\nfoo bar\nbaz';
    const matches = getMatches(re, text);
    expect(matches.map(m => m.value)).toEqual(['hello', 'foo', 'baz']);
  });
});
