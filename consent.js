/* TaxSignal cookie consent — small, dependency-free.
   Stores the visitor's choice for 12 months and fires a "ts:consent" event,
   so analytics can be switched on only after "Accept all":
     window.addEventListener('ts:consent', e => { if (e.detail.analytics) { ...load analytics... } });
     TaxSignalConsent.get()  -> { analytics: true|false } or null
     TaxSignalConsent.open() -> show the banner again (e.g. a "Cookie settings" link) */
(function () {
  var KEY = 'ts_consent';
  // Don't show inside the design editor's preview frame.
  try { if (window.top !== window.self && !/(^|\.)taxsignal\.com\.au$/.test(location.hostname)) return; } catch (e) { return; }

  function read() {
    try { var v = localStorage.getItem(KEY); if (v) return JSON.parse(v); } catch (e) {}
    var m = document.cookie.match(/(?:^|; )ts_consent=([^;]*)/);
    if (m) return { analytics: m[1] === 'all' };
    return null;
  }
  function save(analytics) {
    var c = { analytics: !!analytics, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    document.cookie = KEY + '=' + (analytics ? 'all' : 'essential') + '; Max-Age=31536000; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    window.dispatchEvent(new CustomEvent('ts:consent', { detail: c }));
  }

  var css = '#ts-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin-left:auto;background:#101218;color:#F5F5F5;border:1px solid rgba(255,255,255,.14);box-shadow:0 20px 60px rgba(0,0,0,.55);padding:20px 22px;font:14px/1.6 Inter,-apple-system,"Segoe UI",sans-serif;box-sizing:border-box}' +
    '#ts-cc h2{font:600 11px/1.4 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7FA6E8;margin:0 0 8px;display:flex;align-items:center;gap:8px}' +
    '#ts-cc p{margin:0;color:#B4B9C4}#ts-cc a{color:#A9C4F0;text-decoration:underline}' +
    '#ts-cc .r{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}' +
    '#ts-cc button{flex:1 1 140px;font:600 12px/1 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:13px 16px;cursor:pointer;border:1px solid #0C4DA2;border-radius:0}' +
    '#ts-cc .a{background:#0C4DA2;color:#fff}#ts-cc .a:hover{background:#1A5FBB}' +
    '#ts-cc .e{background:transparent;color:#F5F5F5;border-color:rgba(255,255,255,.28)}#ts-cc .e:hover{border-color:#fff}' +
    '#ts-cc button:focus-visible{outline:2px solid #A9C4F0;outline-offset:2px}';

  function show() {
    if (document.getElementById('ts-cc')) return;
    if (!document.getElementById('ts-cc-css')) { var st = document.createElement('style'); st.id = 'ts-cc-css'; st.textContent = css; document.head.appendChild(st); }
    var d = document.createElement('section');
    d.id = 'ts-cc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-live', 'polite'); d.setAttribute('aria-labelledby', 'ts-cc-t');
    d.innerHTML = '<h2 id="ts-cc-t"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="#7FA6E8" d="M12 1 3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4z"/></svg>Your privacy</h2>' +
      '<p>We use essential cookies to keep this site secure and working. With your OK, we’d also use analytics cookies to see which explainers and calculators help most. We never sell your data. <a href="/privacy">Privacy &amp; cookies</a></p>' +
      '<div class="r"><button type="button" class="a">Accept all</button><button type="button" class="e">Essential only</button></div>';
    d.querySelector('.a').onclick = function () { save(true); d.remove(); };
    d.querySelector('.e').onclick = function () { save(false); d.remove(); };
    document.body.appendChild(d);
  }

  window.TaxSignalConsent = { get: read, open: show };
  function init() { if (!read()) show(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
