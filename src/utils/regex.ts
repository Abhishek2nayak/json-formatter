export interface FlagState {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
  u: boolean;
}

export interface RegexMatch {
  index: number;
  value: string;
  groups: (string | undefined)[];
  start: number;
  end: number;
}

export function buildRegex(pattern: string, flags: FlagState): RegExp | null {
  try {
    const flagStr = Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join('');
    return new RegExp(pattern, flagStr);
  } catch {
    return null;
  }
}

export function getMatches(regex: RegExp | null, text: string): RegexMatch[] {
  if (!regex || !text) return [];
  try {
    if (!regex.flags.includes('g')) {
      const m = regex.exec(text);
      if (!m) return [];
      return [{
        index: 0,
        value: m[0],
        groups: m.slice(1),
        start: m.index,
        end: m.index + m[0].length,
      }];
    }
    const matches: RegexMatch[] = [];
    let m: RegExpExecArray | null;
    let i = 0;
    const re = new RegExp(regex.source, regex.flags);
    while ((m = re.exec(text)) !== null) {
      matches.push({ index: i++, value: m[0], groups: m.slice(1), start: m.index, end: m.index + m[0].length });
      if (m[0].length === 0) re.lastIndex++;
      if (matches.length >= 500) break;
    }
    return matches;
  } catch {
    return [];
  }
}
