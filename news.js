/* TaxSignal, headline banner.
   Edit this one file to change the moving headlines on every page.
   s = status label, t = headline, d = date, href = where it links. Newest / most important first. */
window.TS_NEWS = [
  { s: 'In effect', t: 'Payday Super has started, super guarantee must now reach the fund within 7 business days of each payday', d: '1 Jul 2026', href: '/updates#payday-super' },
  { s: 'Before the Senate', t: 'Discretionary trusts: a 30% minimum tax on trust net income passed the House on 29 October', d: 'Proposed from 1 Jul 2028', href: '/updates' },
  { s: 'ATO', t: 'ATO says super mismatch letters sent to more than 150,000 employers “do not create a debt”', d: '16 Nov 2026', href: '/updates#payday-super' },
  { s: 'Law', t: 'Capital gains: the 50% CGT discount is replaced by cost base indexation and a 30% minimum tax on gains', d: 'From 1 Jul 2027', href: '/updates' },
  { s: 'Law', t: 'Negative gearing limited to new builds, properties held before 7:30pm, 12 May 2026 are grandfathered', d: 'From 1 Jul 2027', href: '/updates' },
  { s: 'In effect', t: 'The 16% tax rate is now 15% on income from $18,201 to $45,000, falling to 14% next year', d: '1 Jul 2026', href: '/updates#rate-cut-15' },
  { s: 'Passed', t: 'Division 296: extra tax on earnings for super balances above $3 million', d: 'From 1 Jul 2026', href: '/updates#division-296' },
  { s: 'Not yet law', t: 'Electric cars: full FBT exemption narrows, 25% discount only for EVs costing over $75,000', d: 'From 1 Apr 2027', href: '/updates' },
  { s: 'FBT', t: 'Benchmark interest rate for the 2026–27 FBT year is 8.27%, used in car operating cost and loan benefits', d: '1 Apr 2026', href: '/fbt-calculator' },
  { s: 'Budget', t: 'The $20,000 instant asset write-off for small business is made permanent', d: 'From 1 Jul 2026', href: '/updates' },
  { s: 'Budget', t: 'Opt-in monthly PAYG instalments for businesses', d: 'From 1 Jul 2027', href: '/updates' },
];
window.TS_NEWS_FEED = function () { var n = window.TS_NEWS || []; return n.concat(n); };

/* Static pages (privacy, 404): fill the masthead banner and date without the page runtime */
(function () {
  function fill() {
    var t = document.querySelector('[data-static-ticker]');
    if (t && !t.childElementCount) {
      var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      t.innerHTML = window.TS_NEWS_FEED().map(function (n) { return '<a class="ts-item" href="' + esc(n.href) + '"><span class="ts-s">' + esc(n.s) + '</span><span class="ts-h">' + esc(n.t) + '</span><span class="ts-d">' + esc(n.d) + '</span></a>'; }).join('');
    }
    var d = document.querySelector('[data-static-date]');
    if (d && !d.textContent) d.textContent = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
