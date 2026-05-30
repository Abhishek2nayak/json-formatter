import LZString from 'lz-string';

export function encodeJsonForUrl(json: string): string {
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeJsonFromUrl(encoded: string): string | null {
  try {
    return LZString.decompressFromEncodedURIComponent(encoded) || null;
  } catch {
    return null;
  }
}

export function buildShareUrl(json: string, basePath = '/app'): string {
  const encoded = encodeJsonForUrl(json);
  return `${window.location.origin}${basePath}?j=${encoded}`;
}

/** Returns true if the share URL is short enough to be practical (<= 8000 chars) */
export function isShareable(json: string): boolean {
  return buildShareUrl(json).length <= 8000;
}
