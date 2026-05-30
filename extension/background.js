const SITE = 'https://jsonworkspace.mythosh.com';

// ── Context menu ────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-in-jsonworkspace',
    title: 'Open in JSONWorkspace',
    contexts: ['page', 'selection'],
  });
  chrome.contextMenus.create({
    id: 'open-selection-in-jsonworkspace',
    title: 'Open selected JSON in JSONWorkspace',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'open-selection-in-jsonworkspace' && info.selectionText) {
    const json = info.selectionText.trim();
    openInWorkspace(json);
    return;
  }

  // Inject script to grab full page JSON
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    });
    if (result?.result) openInWorkspace(result.result);
  } catch {
    chrome.tabs.create({ url: SITE + '/app' });
  }
});

// ── Message from content script ─────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'OPEN_IN_WORKSPACE') {
    openInWorkspace(msg.json);
  }
});

// ── Helpers ──────────────────────────────────────────────────────
function openInWorkspace(json) {
  try {
    // Validate it's parseable
    JSON.parse(json);
    const encoded = LZString.compressToEncodedURIComponent(json);
    const url = `${SITE}/app?j=${encoded}`;
    // If URL is too long, open without encoding
    if (url.length > 8000) {
      chrome.tabs.create({ url: SITE + '/app' });
    } else {
      chrome.tabs.create({ url });
    }
  } catch {
    chrome.tabs.create({ url: SITE + '/app' });
  }
}

// LZString must be loaded in the background service worker separately.
// Import it via importScripts (MV3 service workers support this).
try {
  importScripts('lz-string.min.js');
} catch (e) {
  console.warn('JSONWorkspace: could not load LZ-string', e);
}
