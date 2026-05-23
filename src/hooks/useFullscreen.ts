import { useState, useCallback } from 'react';

const FS_KEY = 'jm_tool_fs';

function getStoredPref(): boolean {
  try { return localStorage.getItem(FS_KEY) === 'true'; } catch { return false; }
}

function isFirstVisit(): boolean {
  try { return localStorage.getItem(FS_KEY) === null; } catch { return false; }
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(getStoredPref);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const next = !prev;
      try { localStorage.setItem(FS_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // true only on the very first visit (localStorage key absent)
  const showHint = isFirstVisit();

  return { isFullscreen, toggleFullscreen, showHint };
}
