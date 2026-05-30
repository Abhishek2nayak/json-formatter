// Detect if the current page is a raw JSON response
(function () {
  'use strict';

  const ct = document.contentType || '';
  const isJsonPage =
    ct.includes('application/json') ||
    ct.includes('text/json') ||
    (ct === '' && isLikelyJsonPage());

  if (!isJsonPage) return;

  // Don't inject if already injected
  if (document.getElementById('jw-banner')) return;

  injectBanner();

  function isLikelyJsonPage() {
    const body = document.body;
    if (!body) return false;
    const text = body.innerText.trim();
    if (!text.startsWith('{') && !text.startsWith('[')) return false;
    try { JSON.parse(text); return true; } catch { return false; }
  }

  function injectBanner() {
    const banner = document.createElement('div');
    banner.id = 'jw-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 2147483647;
      background: #0f0f0f;
      border: 1px solid #1e1e1e;
      border-radius: 14px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: #e5e5e5;
      cursor: default;
      animation: jw-slide-in 0.25s ease-out;
    `;

    // Logo mark
    const logo = document.createElement('div');
    logo.style.cssText = `
      width: 28px; height: 28px; border-radius: 8px;
      background: #10b981; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; font-weight: 900;
      font-size: 12px; color: white;
    `;
    logo.textContent = '{}';

    const text = document.createElement('span');
    text.textContent = 'JSON detected';
    text.style.color = '#9ca3af';

    const btn = document.createElement('button');
    btn.textContent = 'Open in JSONWorkspace →';
    btn.style.cssText = `
      background: #10b981; color: white; border: none;
      padding: 6px 12px; border-radius: 8px; cursor: pointer;
      font-size: 12px; font-weight: 700; white-space: nowrap;
      font-family: inherit;
    `;
    btn.onmouseenter = () => { btn.style.background = '#059669'; };
    btn.onmouseleave = () => { btn.style.background = '#10b981'; };
    btn.onclick = () => {
      const json = document.body.innerText;
      chrome.runtime.sendMessage({ type: 'OPEN_IN_WORKSPACE', json });
    };

    const close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = `
      background: none; border: none; color: #6b7280;
      cursor: pointer; font-size: 16px; line-height: 1;
      padding: 0 2px; font-family: inherit;
    `;
    close.onmouseenter = () => { close.style.color = '#e5e5e5'; };
    close.onmouseleave = () => { close.style.color = '#6b7280'; };
    close.onclick = () => banner.remove();

    banner.append(logo, text, btn, close);

    // Keyframe animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes jw-slide-in {
        from { transform: translateY(16px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(banner);
  }
})();
