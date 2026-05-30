const SITE = 'https://jsonworkspace.mythosh.com';

function open(path) {
  chrome.tabs.create({ url: SITE + path });
  window.close();
}

function showStatus() {
  const el = document.getElementById('status');
  el.style.display = 'block';
  setTimeout(() => window.close(), 1000);
}

function openWithJson(json) {
  try {
    JSON.parse(json);
    const encoded = LZString.compressToEncodedURIComponent(json);
    const url = `${SITE}/app?j=${encoded}`;
    chrome.tabs.create({ url: url.length <= 8000 ? url : SITE + '/app' });
    showStatus();
  } catch {
    chrome.tabs.create({ url: SITE + '/app' });
    showStatus();
  }
}

// Open full page JSON
document.getElementById('btn-open-page').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return open('/app');
  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    });
    openWithJson(res?.result ?? '{}');
  } catch {
    open('/app');
  }
});

// Open selected text as JSON
document.getElementById('btn-open-selection').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return open('/app');
  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() ?? '',
    });
    const sel = (res?.result ?? '').trim();
    if (sel) openWithJson(sel);
    else open('/app');
  } catch {
    open('/app');
  }
});

// Quick links
document.getElementById('btn-formatter').addEventListener('click', () => open('/json-formatter'));
document.getElementById('btn-validator').addEventListener('click', () => open('/json-validator'));
document.getElementById('btn-path').addEventListener('click',      () => open('/json-path'));
document.getElementById('btn-mock').addEventListener('click',      () => open('/mock-generator'));
