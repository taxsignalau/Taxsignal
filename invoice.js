/* TaxSignal invoice maker. Runs entirely in the browser.
   The draft is kept in this browser's localStorage only; nothing is sent to a server. */
(function () {
  'use strict';
  var KEY = 'ts_invoice_draft_v1';
  var ACCENTS = [['Ink', '#14181A'], ['Brass', '#8E7543'], ['Forest', '#1E4D3A'], ['Navy', '#1F3A5F'], ['Claret', '#6E2433']];
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; }
  function money(n) { return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function nice(s) { if (!s) return ''; var p = s.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function abnDigits(s) { return String(s || '').replace(/\D/g, ''); }
  function abnFmt(s) { var d = abnDigits(s); return d.length === 11 ? d.slice(0, 2) + ' ' + d.slice(2, 5) + ' ' + d.slice(5, 8) + ' ' + d.slice(8) : String(s || '').trim(); }
  // ABN check digit test published by the Australian Business Register.
  function abnValid(s) {
    var d = abnDigits(s); if (d.length !== 11) return false;
    var w = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19], sum = 0;
    for (var i = 0; i < 11; i++) sum += (i === 0 ? (+d[i] - 1) : +d[i]) * w[i];
    return sum % 89 === 0;
  }

  function blank() {
    var today = new Date();
    return {
      from: { name: '', abn: '', addr: '', email: '', phone: '' }, gst: 1, logo: '',
      to: { name: '', abn: '', addr: '', email: '' },
      no: 'INV-0001', date: iso(today), terms: '14', due: '', ref: '', inc: 0,
      items: [{ d: '', q: '1', p: '', t: 1 }],
      pay: { name: '', bsb: '', acc: '', payid: '' }, notes: '', acc: '#14181A'
    };
  }
  var S = blank();
  function load() { try { var j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j && j.items) S = Object.assign(blank(), j); } catch (e) {} }
  var saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }, 250); }
  function getK(k) { var p = k.split('.'), o = S; for (var i = 0; i < p.length - 1; i++) o = o[p[i]]; return o[p[p.length - 1]]; }
  function setK(k, v) { var p = k.split('.'), o = S; for (var i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = v; }

  function dueDate() {
    if (S.terms === 'custom') return S.due;
    if (!S.date) return '';
    var p = S.date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + (+S.terms || 0)); return iso(d);
  }
  function totals() {
    var lines = S.items.map(function (it) {
      var amt = r2(num(it.q) * num(it.p)), taxable = S.gst && it.t;
      var g = !taxable ? 0 : (S.inc ? r2(amt / 11) : r2(amt * 0.1));
      return { d: it.d, q: num(it.q), p: num(it.p), amt: amt, gst: g, taxable: !!taxable };
    });
    var sum = r2(lines.reduce(function (a, l) { return a + l.amt; }, 0));
    var gst = r2(lines.reduce(function (a, l) { return a + l.gst; }, 0));
    var total = S.gst ? (S.inc ? sum : r2(sum + gst)) : sum;
    var sub = S.gst ? (S.inc ? r2(sum - gst) : sum) : sum;
    return { lines: lines, sub: sub, gst: gst, total: total, mixed: S.gst && lines.some(function (l) { return !l.taxable; }) };
  }

  /* ---------- Editor ---------- */
  function fillForm() {
    Array.prototype.forEach.call(document.querySelectorAll('#ed [data-k]'), function (el) { var v = getK(el.dataset.k); el.value = v == null ? '' : v; });
    segs(); renderItems(); renderSw(); logoUi();
    $('dueWrap').hidden = S.terms !== 'custom';
  }
  function segs() {
    Array.prototype.forEach.call($('gstSeg').children, function (b) { b.setAttribute('aria-pressed', String(+b.dataset.v === S.gst)); });
    Array.prototype.forEach.call($('incSeg').children, function (b) { b.setAttribute('aria-pressed', String(+b.dataset.v === S.inc)); });
    $('incWrap').hidden = !S.gst;
  }
  function renderItems() {
    var head = '<div class="item-head"><span>Description</span><span>Qty</span><span>Unit price</span><span>' + (S.gst ? 'GST' : '') + '</span><span></span></div>';
    $('items').innerHTML = head + S.items.map(function (it, i) {
      return '<div class="item" data-i="' + i + '">' +
        '<div class="desc"><span class="lab">Description</span><textarea class="in" rows="1" data-f="d" aria-label="Item ' + (i + 1) + ' description" placeholder="What you supplied">' + esc(it.d) + '</textarea></div>' +
        '<div><span class="lab">Qty</span><input class="in" inputmode="decimal" data-f="q" aria-label="Item ' + (i + 1) + ' quantity" value="' + esc(it.q) + '"></div>' +
        '<div><span class="lab">Unit price</span><input class="in" inputmode="decimal" data-f="p" aria-label="Item ' + (i + 1) + ' unit price" placeholder="0.00" value="' + esc(it.p) + '"></div>' +
        '<div><span class="lab">' + (S.gst ? 'GST' : '&nbsp;') + '</span>' + (S.gst ? '<select class="sel" data-f="t" aria-label="Item ' + (i + 1) + ' GST"><option value="1"' + (it.t ? ' selected' : '') + '>GST</option><option value="0"' + (!it.t ? ' selected' : '') + '>GST-free</option></select>' : '') + '</div>' +
        '<button type="button" class="x" data-del="' + i + '" aria-label="Remove item ' + (i + 1) + '"' + (S.items.length < 2 ? ' disabled' : '') + '>×</button>' +
        '<div class="amt"><span id="ia' + i + 'l">' + (S.gst ? (S.inc ? 'Amount, including GST' : 'Amount, excluding GST') : 'Amount') + '</span><b class="fig" id="ia' + i + '"></b></div></div>';
    }).join('');
    amounts();
  }
  function amounts() { var T = totals(); T.lines.forEach(function (l, i) { var el = $('ia' + i); if (el) el.textContent = money(l.amt); }); }
  function renderSw() {
    $('sw').innerHTML = ACCENTS.map(function (a) { return '<button type="button" style="background:' + a[1] + '" data-c="' + a[1] + '" aria-label="' + a[0] + '" aria-pressed="' + (S.acc === a[1]) + '"></button>'; }).join('');
  }
  function logoUi() { $('logoRm').hidden = !S.logo; }
  function abnMsg() {
    var el = $('abnMsg'), v = S.from.abn;
    if (!abnDigits(v)) { el.textContent = ''; return; }
    el.textContent = abnValid(v) ? 'ABN format checks out.' : 'This doesn\'t look like a valid ABN. Check the 11 digits.';
    el.style.color = abnValid(v) ? 'var(--sage)' : '#E9B497';
  }

  /* ---------- Preview ---------- */
  function render() {
    var T = totals(), title = S.gst ? 'Tax invoice' : 'Invoice', due = dueDate();
    var ph = function (v, p) { return v ? esc(v) : '<span class="p-empty">' + p + '</span>'; };
    var fromLines = [S.from.addr, S.from.email, S.from.phone].filter(Boolean).join('\n');
    var toLines = [S.to.abn ? 'ABN ' + abnFmt(S.to.abn) : '', S.to.addr, S.to.email].filter(Boolean).join('\n');
    var rows = T.lines.map(function (l) {
      return '<tr><td>' + (l.d ? esc(l.d).replace(/\n/g, '<br>') : '<span class="p-empty">Item description</span>') + (S.gst && !l.taxable ? ' <span class="free">(GST-free)</span>' : '') + '</td><td class="r">' + (l.q || '') + '</td><td class="r">' + money(l.p) + '</td>' + (S.gst ? '<td class="r">' + (l.taxable ? money(l.gst) : '–') + '</td>' : '') + '<td class="r">' + money(l.amt) + '</td></tr>';
    }).join('');
    var pay = [S.pay.name ? 'Account name: ' + S.pay.name : '', S.pay.bsb ? 'BSB: ' + S.pay.bsb : '', S.pay.acc ? 'Account: ' + S.pay.acc : '', S.pay.payid ? 'PayID: ' + S.pay.payid : ''].filter(Boolean).join('\n');
    $('paper').style.setProperty('--acc', S.acc);
    $('paper').innerHTML =
      '<div class="p-top"><div>' + (S.logo ? '<img class="p-logo" src="' + S.logo + '" alt="">' : '<div class="p-biz">' + ph(S.from.name, 'Your business name') + '</div>') +
      (S.logo && S.from.name ? '<div style="font-weight:700;margin-top:.6em">' + esc(S.from.name) + '</div>' : '') +
      '<div style="color:#4A5358;margin-top:.3em">' + (S.from.abn ? 'ABN ' + esc(abnFmt(S.from.abn)) : '<span class="p-empty">ABN</span>') + '</div></div>' +
      '<div><div class="p-title">' + title + '</div><div class="p-meta">Invoice <b>' + esc(S.no || '') + '</b><br>Issued <b>' + esc(nice(S.date)) + '</b><br>Due <b>' + esc(S.terms === '0' ? 'On receipt' : nice(due)) + '</b>' + (S.ref ? '<br>Ref <b>' + esc(S.ref) + '</b>' : '') + '</div></div></div>' +
      '<div class="p-parties"><div><div class="h">From</div><div class="n">' + ph(S.from.name, 'Your business') + '</div><div>' + esc(fromLines) + '</div></div>' +
      '<div><div class="h">Bill to</div><div class="n">' + ph(S.to.name, 'Client name') + '</div><div>' + esc(toLines) + '</div></div></div>' +
      '<table class="p-tbl"><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Unit price</th>' + (S.gst ? '<th class="r">GST</th>' : '') + '<th class="r">Amount</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="p-tot">' + (S.gst ? '<div><span>Subtotal (excl. GST)</span><span>' + money(T.sub) + '</span></div><div><span>GST</span><span>' + money(T.gst) + '</span></div>' : '') +
      '<div class="grand"><span>Total' + (S.gst ? ' (incl. GST)' : '') + '</span><span>' + money(T.total) + '</span></div>' +
      (!S.gst ? '<div class="note">No GST has been charged.</div>' : '') + '</div>' +
      '<div class="p-pay"><div><div class="h">How to pay</div><div>' + (pay ? esc(pay) + (S.no ? '\nReference: ' + esc(S.no) : '') : '<span class="p-empty">Add your bank details</span>') + '</div></div>' +
      '<div><div class="h">Notes</div><div>' + (S.notes ? esc(S.notes) : '<span class="p-empty">Optional</span>') + '</div></div></div>';
    $('barTotal').textContent = money(T.total);
    checklist(T);
  }
  function checklist(T) {
    var c = [], ok = function (b, t) { c.push('<div class="' + (b ? 'ok' : 'no') + '"><i>' + (b ? '✓' : '•') + '</i><span>' + t + '</span></div>'); };
    var desc = T.lines.length && T.lines.every(function (l) { return l.d.trim() && l.p > 0; });
    if (S.gst) {
      ok(true, 'Titled "Tax invoice"');
      ok(!!S.from.name.trim(), 'Your business name');
      ok(abnValid(S.from.abn), 'Your ABN, 11 valid digits');
      ok(!!S.date, 'Date of issue');
      ok(desc, 'Each item has a description and price');
      ok(true, 'GST shown separately');
      if (T.mixed) ok(true, 'GST-free items marked');
      if (T.total >= 1000) ok(!!(S.to.name.trim() || abnDigits(S.to.abn)), 'Client name or ABN, needed for sales of $1,000 or more');
    } else {
      ok(!!S.from.name.trim(), 'Your business name');
      ok(abnValid(S.from.abn), 'Your ABN, so payers don\'t withhold 47%');
      ok(!!S.date, 'Date of issue');
      ok(desc, 'Each item has a description and price');
      ok(!!S.to.name.trim(), 'Client name');
    }
    ok(!!(S.pay.bsb && S.pay.acc) || !!S.pay.payid, 'How to pay you');
    var missing = c.filter(function (x) { return x.indexOf('class="no"') >= 0; }).length;
    $('check').innerHTML = '<h3>' + (S.gst ? 'ATO tax invoice checklist' : 'Invoice checklist') + '</h3>' + c.join('') +
      '<p>' + (missing ? missing + ' item' + (missing > 1 ? 's' : '') + ' to finish. You can still download a draft.' : 'Everything the ' + (S.gst ? 'ATO asks for is on this tax invoice.' : 'invoice needs is there.')) + '</p>';
  }
  function update() { amounts(); render(); save(); }

  /* ---------- PDF ---------- */
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function pdf(btn) {
    var label = btn.innerHTML; btn.textContent = 'Preparing…';
    var go = function () {
      try { build(); } catch (e) { console.log(e); }
      btn.innerHTML = label;
    };
    if (window.jspdf) return go();
    var sc = document.createElement('script'); sc.src = '/vendor/jspdf.umd.min.js'; sc.onload = go; sc.onerror = function () { btn.innerHTML = label; }; document.head.appendChild(sc);
  }
  function build() {
    var J = window.jspdf.jsPDF, d = new J({ unit: 'pt', format: 'a4' }), W = 595.28, H = 841.89, M = 50, T = totals(), acc = hex(S.acc), due = dueDate();
    var clean = function (s) { return String(s == null ? '' : s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/—/g, ' - ').replace(/[^\x20-\x7E -ÿ–\n]/g, ''); };
    var tx = function (s, x, y, o) { d.text(clean(s), x, y, o); };
    var ink = function () { d.setTextColor(20, 24, 26); }, grey = function () { d.setTextColor(90, 97, 101); };
    var y = M + 8, leftBottom = y;
    // Logo or name
    if (S.logo && /^data:image\/(png|jpe?g|webp)/.test(S.logo)) {
      try {
        var props = d.getImageProperties(S.logo), mw = 170, mh = 60, r = Math.min(mw / props.width, mh / props.height);
        d.addImage(S.logo, props.fileType || 'PNG', M, y - 8, props.width * r, props.height * r);
        leftBottom = y - 8 + props.height * r + 16;
        if (S.from.name) { d.setFont('helvetica', 'bold'); d.setFontSize(11); ink(); tx(S.from.name, M, leftBottom); leftBottom += 14; }
      } catch (e) { S.logo = ''; }
    }
    if (!S.logo || !/^data:image\/(png|jpe?g|webp)/.test(S.logo)) { d.setFont('helvetica', 'bold'); d.setFontSize(18); ink(); var nm = d.splitTextToSize(clean(S.from.name || 'Your business'), 250); nm.forEach(function (l, i) { tx(l, M, y + 6 + i * 20); }); leftBottom = y + 6 + nm.length * 20; }
    d.setFont('helvetica', 'normal'); d.setFontSize(9.5); grey(); if (S.from.abn) { tx('ABN ' + abnFmt(S.from.abn), M, leftBottom); leftBottom += 13; }
    // Title block
    d.setFont('helvetica', 'bold'); d.setFontSize(24); d.setTextColor(acc[0], acc[1], acc[2]); tx(S.gst ? 'Tax invoice' : 'Invoice', W - M, y + 10, { align: 'right' });
    d.setFontSize(9.5); var my = y + 32;
    [['Invoice', S.no], ['Issued', nice(S.date)], ['Due', S.terms === '0' ? 'On receipt' : nice(due)]].concat(S.ref ? [['Ref', S.ref]] : []).forEach(function (r) {
      d.setFont('helvetica', 'normal'); grey(); tx(r[0], W - M - 120, my); d.setFont('helvetica', 'bold'); ink(); tx(r[1] || '', W - M, my, { align: 'right' }); my += 14;
    });
    y = Math.max(leftBottom, my) + 18;
    d.setDrawColor(acc[0], acc[1], acc[2]); d.setLineWidth(1.2); d.line(M, y, W - M, y); y += 20;
    // Parties
    var col = function (x, head, name, lines) {
      var yy = y; d.setFont('helvetica', 'bold'); d.setFontSize(8); d.setTextColor(acc[0], acc[1], acc[2]); tx(head.toUpperCase(), x, yy); yy += 14;
      d.setFontSize(10.5); ink(); d.splitTextToSize(clean(name || ''), 230).forEach(function (l) { tx(l, x, yy); yy += 13; });
      d.setFont('helvetica', 'normal'); d.setFontSize(9.5); grey();
      lines.filter(Boolean).forEach(function (t) { d.splitTextToSize(clean(t), 230).forEach(function (l) { tx(l, x, yy); yy += 12.5; }); });
      return yy;
    };
    var y1 = col(M, 'From', S.from.name, [S.from.addr, S.from.email, S.from.phone]);
    var y2 = col(W / 2 + 10, 'Bill to', S.to.name, [S.to.abn ? 'ABN ' + abnFmt(S.to.abn) : '', S.to.addr, S.to.email]);
    y = Math.max(y1, y2) + 22;
    // Items table
    var cx = S.gst ? { d: M, q: 340, p: 410, g: 470, a: W - M } : { d: M, q: 380, p: 460, a: W - M };
    var head = function () {
      d.setFont('helvetica', 'bold'); d.setFontSize(8); ink();
      tx('DESCRIPTION', cx.d, y); tx('QTY', cx.q, y, { align: 'right' }); tx('UNIT PRICE', cx.p, y, { align: 'right' }); if (S.gst) tx('GST', cx.g, y, { align: 'right' }); tx('AMOUNT', cx.a, y, { align: 'right' });
      y += 7; d.setDrawColor(20, 24, 26); d.setLineWidth(1); d.line(M, y, W - M, y); y += 15;
    };
    head();
    d.setFontSize(9.5);
    T.lines.forEach(function (l) {
      var desc = d.splitTextToSize(clean((l.d || 'Item') + (S.gst && !l.taxable ? ' (GST-free)' : '')), (S.gst ? cx.q - 50 : cx.q - 60) - M);
      var h = Math.max(1, desc.length) * 12.5 + 8;
      if (y + h > H - 150) { d.addPage(); y = M + 10; head(); d.setFontSize(9.5); }
      d.setFont('helvetica', 'normal'); ink();
      desc.forEach(function (ln, i) { tx(ln, cx.d, y + i * 12.5); });
      tx(String(l.q), cx.q, y, { align: 'right' }); tx(money(l.p), cx.p, y, { align: 'right' });
      if (S.gst) tx(l.taxable ? money(l.gst) : '-', cx.g, y, { align: 'right' });
      tx(money(l.amt), cx.a, y, { align: 'right' });
      y += h; d.setDrawColor(226, 228, 227); d.setLineWidth(0.6); d.line(M, y - 9, W - M, y - 9);
    });
    // Totals
    y += 6; var tl = W - M - 200;
    if (y > H - 190) { d.addPage(); y = M + 10; }
    d.setFontSize(10);
    if (S.gst) {
      d.setFont('helvetica', 'normal'); grey(); tx('Subtotal (excl. GST)', tl, y); ink(); tx(money(T.sub), W - M, y, { align: 'right' }); y += 16;
      grey(); tx('GST', tl, y); ink(); tx(money(T.gst), W - M, y, { align: 'right' }); y += 10;
    }
    d.setDrawColor(20, 24, 26); d.setLineWidth(1); d.line(tl, y, W - M, y); y += 18;
    d.setFont('helvetica', 'bold'); d.setFontSize(14); ink(); tx('Total' + (S.gst ? ' (incl. GST)' : ''), tl, y); tx(money(T.total), W - M, y, { align: 'right' });
    if (!S.gst) { y += 15; d.setFont('helvetica', 'normal'); d.setFontSize(9); grey(); tx('No GST has been charged.', W - M, y, { align: 'right' }); }
    // Payment and notes at the bottom
    var pay = [S.pay.name ? 'Account name: ' + S.pay.name : '', S.pay.bsb ? 'BSB: ' + S.pay.bsb : '', S.pay.acc ? 'Account: ' + S.pay.acc : '', S.pay.payid ? 'PayID: ' + S.pay.payid : '', (S.pay.bsb || S.pay.payid) && S.no ? 'Reference: ' + S.no : ''].filter(Boolean);
    var notes = S.notes ? d.splitTextToSize(clean(S.notes), 230) : [];
    var blockH = 22 + Math.max(pay.length, notes.length) * 12.5;
    var by = Math.max(y + 40, H - M - blockH);
    if (by + blockH > H - 30) { d.addPage(); by = M + 10; }
    d.setDrawColor(226, 228, 227); d.setLineWidth(0.8); d.line(M, by - 14, W - M, by - 14);
    d.setFont('helvetica', 'bold'); d.setFontSize(8); d.setTextColor(acc[0], acc[1], acc[2]);
    if (pay.length) tx('HOW TO PAY', M, by); if (notes.length) tx('NOTES', W / 2 + 10, by);
    d.setFont('helvetica', 'normal'); d.setFontSize(9.5); grey();
    pay.forEach(function (t, i) { tx(t, M, by + 15 + i * 12.5); });
    notes.forEach(function (t, i) { tx(t, W / 2 + 10, by + 15 + i * 12.5); });
    var file = (S.no || 'invoice').replace(/[^A-Za-z0-9_-]+/g, '-') + '.pdf';
    d.save(file);
  }

  /* ---------- Events ---------- */
  function init() {
    load(); fillForm(); render(); abnMsg();
    var ed = $('ed');
    ed.addEventListener('submit', function (e) { e.preventDefault(); });
    ed.addEventListener('input', function (e) {
      var t = e.target;
      if (t.dataset.k) {
        setK(t.dataset.k, t.value);
        if (t.dataset.k === 'from.abn') abnMsg();
        if (t.dataset.k === 'terms') $('dueWrap').hidden = S.terms !== 'custom';
        update(); return;
      }
      var row = t.closest('.item'); if (row && t.dataset.f) { var it = S.items[+row.dataset.i]; it[t.dataset.f] = t.dataset.f === 't' ? +t.value : t.value; update(); }
    });
    ed.addEventListener('change', function (e) {
      var t = e.target, row = t.closest('.item');
      if (row && t.dataset.f === 't') { S.items[+row.dataset.i].t = +t.value; update(); }
      if (t.dataset.k === 'terms') { setK('terms', t.value); $('dueWrap').hidden = S.terms !== 'custom'; if (S.terms === 'custom' && !S.due) { S.due = dueDateFrom(14); $('iDue').value = S.due; } update(); }
    });
    function dueDateFrom(n) { var p = (S.date || iso(new Date())).split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return iso(d); }
    $('items').addEventListener('click', function (e) { var b = e.target.closest('[data-del]'); if (!b || S.items.length < 2) return; S.items.splice(+b.dataset.del, 1); renderItems(); update(); });
    $('addItem').addEventListener('click', function () { S.items.push({ d: '', q: '1', p: '', t: 1 }); renderItems(); update(); var rows = $('items').querySelectorAll('.item textarea'); rows[rows.length - 1].focus(); });
    $('gstSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.gst = +b.dataset.v; segs(); renderItems(); update(); });
    $('incSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.inc = +b.dataset.v; segs(); renderItems(); update(); });
    $('sw').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.acc = b.dataset.c; renderSw(); update(); });
    $('logoIn').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      if (f.size > 1.5e6) { alertMsg('That logo is over 1.5 MB. Use a smaller image.'); this.value = ''; return; }
      var rd = new FileReader(), input = this;
      rd.onload = function () {
        var src = rd.result;
        if (/^data:image\/(svg\+xml|webp)/.test(src)) {
          // Convert SVG or WebP to PNG so the PDF can embed it.
          var img = new Image(); img.onload = function () { var c = document.createElement('canvas'), sc = Math.min(1, 600 / Math.max(img.width || 600, img.height || 200)); c.width = Math.max(1, (img.width || 600) * sc); c.height = Math.max(1, (img.height || 200) * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); S.logo = c.toDataURL('image/png'); logoUi(); update(); }; img.src = src;
        } else { S.logo = src; logoUi(); update(); }
        input.value = '';
      };
      rd.readAsDataURL(f);
    });
    $('logoRm').addEventListener('click', function () { S.logo = ''; logoUi(); update(); });
    $('dl').addEventListener('click', function () { pdf(this); });
    $('dl2').addEventListener('click', function () { pdf(this); });
    $('newInv').addEventListener('click', function () {
      var m = String(S.no || '').match(/^(.*?)(\d+)(\D*)$/);
      S.no = m ? m[1] + String(+m[2] + 1).padStart(m[2].length, '0') + m[3] : (S.no ? S.no + '-2' : 'INV-0001');
      S.to = { name: '', abn: '', addr: '', email: '' }; S.items = [{ d: '', q: '1', p: '', t: 1 }]; S.ref = ''; S.date = iso(new Date()); S.due = '';
      fillForm(); update(); $('tName').focus();
    });
    $('clearAll').addEventListener('click', function () {
      var b = this;
      if (b.dataset.armed) { S = blank(); fillForm(); update(); abnMsg(); b.textContent = 'Clear all'; delete b.dataset.armed; return; }
      b.dataset.armed = '1'; b.textContent = 'Tap again to clear everything'; setTimeout(function () { if (b.dataset.armed) { b.textContent = 'Clear all'; delete b.dataset.armed; } }, 3500);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.iv-switch button'), function (b) {
      b.addEventListener('click', function () {
        $('ivApp').dataset.view = b.dataset.view;
        Array.prototype.forEach.call(document.querySelectorAll('.iv-switch button'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var top = $('ivApp').getBoundingClientRect().top + scrollY - 170; if (scrollY > top) scrollTo({ top: top });
      });
    });
  }
  function alertMsg(t) { var el = $('logoHint'); el.textContent = t; el.style.color = '#E9B497'; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
