/* TaxSignal: Am I Being Underpaid? award pay checker.
   Every dollar rate comes from /data/awards/*.json, built from the Fair Work Commission
   Modern Awards Pay Database by tools/build_award_data.py. Nothing is sent to a server. */
(function () {
  'use strict';
  var SG = 0.12; // Super guarantee rate from 1 July 2025
  // Victorian public holidays (Business Victoria). The 2027 AFL Grand Final Friday is not set yet.
  var PH = {
    '2026-01-01': "New Year's Day", '2026-01-26': 'Australia Day', '2026-03-09': 'Labour Day', '2026-04-03': 'Good Friday',
    '2026-04-04': 'Saturday before Easter Sunday', '2026-04-05': 'Easter Sunday', '2026-04-06': 'Easter Monday', '2026-04-25': 'ANZAC Day',
    '2026-06-08': "King's Birthday", '2026-09-25': 'Friday before the AFL Grand Final', '2026-11-03': 'Melbourne Cup Day',
    '2026-12-25': 'Christmas Day', '2026-12-26': 'Boxing Day', '2026-12-28': 'Boxing Day (substitute)',
    '2027-01-01': "New Year's Day", '2027-01-26': 'Australia Day', '2027-03-08': 'Labour Day', '2027-03-26': 'Good Friday',
    '2027-03-27': 'Saturday before Easter Sunday', '2027-03-28': 'Easter Sunday', '2027-03-29': 'Easter Monday', '2027-04-25': 'ANZAC Day',
    '2027-06-14': "King's Birthday", '2027-11-02': 'Melbourne Cup Day', '2027-12-25': 'Christmas Day', '2027-12-26': 'Boxing Day',
    '2027-12-27': 'Christmas Day (substitute)', '2027-12-28': 'Boxing Day (substitute)'
  };
  var POPULAR = ['MA000003', 'MA000004', 'MA000009', 'MA000119', 'MA000002', 'MA000022', 'MA000100', 'MA000034'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var S = { idx: null, meta: null, doc: null, emp: 'casual', cat: 'adult', cls: null, shifts: [], seq: 0 };
  var cache = {};
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // Site copy uses no em dashes: FWC labels are tidied for display.
  function tidy(s) { return String(s || '').replace(/\s*—\s*/g, ': ').replace(/\s+/g, ' ').trim(); }
  function tidyName(s) { return String(s || '').replace(/\s*—\s*/g, ' – ').trim(); }
  function money(n) { return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function pd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function longDate(s) { var d = pd(s); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function shortDate(s) { var d = pd(s); return DAYS[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MON[d.getMonth()]; }
  function mins(t) { if (!t || !/^\d{1,2}:\d{2}/.test(t)) return null; var p = t.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function num(v) { var n = parseFloat(String(v || '').replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : null; }

  /* ---------- Data ---------- */
  function loadIndex() {
    return fetch('/data/awards/index.json').then(function (r) { return r.json(); }).then(function (j) {
      S.idx = j.awards; S.meta = j.meta;
      var eff = j.meta.effective ? longDate(j.meta.effective) : '';
      var ch = (j.meta.changes || []).map(function (c) { var d = pd(c); return d.getDate() + ' ' + MONTHS[d.getMonth()]; });
      var chTxt = ch.length ? ' Includes later changes operative from ' + (ch.length > 1 ? ch.slice(0, -1).join(', ') + ' and ' + ch[ch.length - 1] : ch[0]) + ' ' + pd(j.meta.changes[j.meta.changes.length - 1]).getFullYear() + '.' : '';
      $('stampEff').textContent = eff;
      $('stampTxt').textContent = 'Rates from the Fair Work Commission Modern Awards Pay Database, effective ' + eff + '.' + chTxt;
      $('stampN').textContent = j.awards.length;
      $('srcLine').textContent = 'Rates from the Fair Work Commission Modern Awards Pay Database, effective ' + eff + '.';
      search('');
    });
  }
  function loadAward(code) {
    if (cache[code]) return Promise.resolve(cache[code]);
    return fetch('/data/awards/' + code + '.json').then(function (r) { return r.json(); }).then(function (j) { cache[code] = j; return j; });
  }

  /* ---------- Award search ---------- */
  function search(q) {
    var res = $('res'); if (!S.idx) return;
    var t = q.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
    var list;
    if (!t.length) {
      list = POPULAR.map(function (c) { return S.idx.find(function (a) { return a.c === c; }); }).filter(Boolean);
    } else {
      list = S.idx.map(function (a) {
        var n = a.n.toLowerCase(), k = a.k, syn = a.s || '', s = 0;
        for (var i = 0; i < t.length; i++) {
          var w = t[i];
          if (a.c.toLowerCase() === w) s += 10;
          else if (new RegExp('\\b' + w + '(s|es)?\\b').test(n)) s += 6;
          else if (new RegExp('\\b' + w + '\\b').test(syn)) s += 5;
          else if (new RegExp('\\b' + w).test(n)) s += 4;
          else if (n.indexOf(w) >= 0) s += 2;
          else if (new RegExp('\\b' + w).test(syn) || new RegExp('\\b' + w).test(k)) s += 1;
          else return null;
        }
        return { a: a, s: s - (/state reference|victorian|local government/i.test(a.n) ? 1 : 0) };
      }).filter(Boolean).sort(function (x, y) { return y.s - x.s || x.a.n.localeCompare(y.a.n); }).slice(0, 8).map(function (x) { return x.a; });
    }
    res.innerHTML = list.length ? list.map(function (a) { return '<button type="button" role="listitem" data-c="' + a.c + '">' + esc(tidyName(a.n)) + '<span>' + (a.p ? '' : 'Limited rates · ') + a.c + '</span></button>'; }).join('')
      : '<p class="hint" style="padding:14px 0">No award matches that. Try another word, or use the award finder below.</p>';
  }
  function pick(code) {
    var a = S.idx.find(function (x) { return x.c === code; }); if (!a) return;
    $('pickedName').textContent = tidyName(a.n); $('pickedCode').textContent = a.c;
    $('picked').hidden = false; $('awardPick').hidden = true;
    loadAward(code).then(function (doc) {
      S.doc = doc; S.cls = null;
      var cats = categories();
      if (cats.indexOf(S.cat) < 0) S.cat = cats[0] || 'adult';
      renderYou(); if (!S.shifts.length) addShift(); else S.shifts.forEach(function (s) { s.manual = false; }); renderShifts();
    });
  }

  /* ---------- Classification and rate options ---------- */
  var CAT_ORDER = ['adult', 'junior', 'apprentice', 'trainee', 'other'];
  var CAT_LABEL = { adult: 'Adult', junior: 'Junior', apprentice: 'Apprentice', trainee: 'Trainee', other: 'Other' };
  function hasPen() { return S.doc && S.doc.rows.length > 0; }
  function empKey() { return S.emp === 'casual' ? 'casual' : 'perm'; }
  function groupOk(g) { var G = S.doc.groups[g]; return G.cat === S.cat && (G.emp === 'any' || G.emp === empKey()); }
  function categories() {
    var set = {};
    if (hasPen()) S.doc.groups.forEach(function (g) { set[g.cat] = 1; }); else S.doc.base.forEach(function (b) { set[b[2]] = 1; });
    return CAT_ORDER.filter(function (c) { return set[c]; });
  }
  function inDate(fromI, toI, date) {
    var f = fromI >= 0 ? S.doc.dates[fromI] : null, t = toI >= 0 ? S.doc.dates[toI] : null;
    return (!f || date >= f) && (!t || date <= t);
  }
  function clsList() {
    var seen = {}, out = [];
    if (hasPen()) {
      S.doc.rows.forEach(function (r) {
        if (!groupOk(r[0])) return;
        var k = r[1], f = S.doc.dates[r[5]] || '', t = r[6] >= 0 ? S.doc.dates[r[6]] : '';
        if (!seen[k]) { seen[k] = { id: String(k), parent: S.doc.cls[k][0], name: S.doc.cls[k][1], from: f, to: t }; out.push(seen[k]); }
        else { if (f < seen[k].from) seen[k].from = f; if (!t || (seen[k].to && t > seen[k].to)) seen[k].to = t; }
      });
    } else {
      S.doc.base.forEach(function (b, i) {
        if (b[2] !== S.cat) return; var k = b[0] + '|' + b[1];
        if (!seen[k]) { seen[k] = { id: 'b' + i, parent: b[0], name: b[1], from: S.doc.dates[b[4]] || '', to: b[5] >= 0 ? S.doc.dates[b[5]] : '' }; out.push(seen[k]); }
      });
    }
    return out;
  }
  function options(date) {
    var out = [], seen = {};
    if (!S.doc || S.cls == null) return out;
    if (hasPen()) {
      var c = +S.cls;
      S.doc.rows.forEach(function (r) {
        if (r[1] !== c || !groupOk(r[0]) || !inDate(r[5], r[6], date)) return;
        var key = r[0] + ':' + r[2]; if (seen[key]) return; seen[key] = 1;
        var G = S.doc.groups[r[0]];
        out.push({ key: key, g: r[0], label: tidy(S.doc.pens[r[2]]), group: tidy(G.d), clause: G.cl, val: r[3], pct: r[4], ot: G.ot, shift: /shiftwork/i.test(G.d) });
      });
    } else {
      var bi = +String(S.cls).slice(1), b0 = S.doc.base[bi];
      S.doc.base.forEach(function (b) {
        if (b[0] === b0[0] && b[1] === b0[1] && b[2] === S.cat && inDate(b[4], b[5], date) && !seen.b) {
          seen.b = 1; out.push({ key: 'b', g: -1, label: 'Ordinary hours (minimum hourly rate)', group: 'Minimum rates', clause: '', val: b[3], pct: 100, ot: false, shift: false });
        }
      });
    }
    return out;
  }
  function isOT(o) { return o.ot || /overtime/i.test(o.label); }
  function suggest(sh, opts) {
    var c = opts.filter(function (o) { return !isOT(o); });
    c.sort(function (a, b) { return (a.shift - b.shift) || (a.g - b.g); });
    if (!c.length) return null;
    var d = pd(sh.date), day = d.getDay(), ph = PH[sh.date], re;
    if (ph) re = /public holiday/i; else if (day === 0) re = /sunday/i; else if (day === 6) re = /saturday/i; else re = /^ordinary/i;
    var m = c.find(function (o) { return re.test(o.label); }) || c.find(function (o) { return /^ordinary/i.test(o.label); }) || c[0];
    return m.key;
  }

  /* ---------- Rendering: step 2 ---------- */
  function renderYou() {
    var cats = categories();
    $('catWrap').hidden = cats.length < 2;
    $('cat').innerHTML = cats.map(function (c) { return '<button type="button" data-v="' + c + '" aria-pressed="' + (c === S.cat) + '">' + CAT_LABEL[c] + '</button>'; }).join('');
    Array.prototype.forEach.call($('emp').children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === S.emp)); });
    var list = clsList(), sel = $('cls');
    if (!list.length) {
      sel.innerHTML = '<option value="">No rates for this combination</option>'; sel.disabled = true; S.cls = null;
    } else {
      var groups = [], byP = {};
      list.forEach(function (c) { var p = c.parent || ''; if (!byP[p]) { byP[p] = []; groups.push(p); } byP[p].push(c); });
      sel.innerHTML = groups.map(function (p) {
        var opts = byP[p].map(function (c) {
          var note = c.to ? ' (to ' + shortRange(c.to) + ')' : (S.meta && c.from > S.meta.effective ? ' (from ' + shortRange(c.from) + ')' : '');
          return '<option value="' + c.id + '">' + esc(tidyName(c.name) + note) + '</option>';
        }).join('');
        return p ? '<optgroup label="' + esc(tidyName(p)) + '">' + opts + '</optgroup>' : opts;
      }).join('');
      sel.disabled = false;
      if (!list.some(function (c) { return c.id === String(S.cls); })) S.cls = list[0].id;
      sel.value = String(S.cls);
    }
    var note = $('noPen');
    if (S.doc && !hasPen()) {
      note.hidden = false;
      note.textContent = !S.doc.base.length
        ? 'The pay database has no hourly rates for this award, only weekly or annual salaries. Use "Other rate from my award" on each shift and enter the hourly rate from the award.'
        : 'The pay database has no penalty rates for this award, only minimum hourly rates. ' + (S.emp === 'casual' ? 'It also has no casual rates for it, so use "Other rate from my award" and enter the casual rate from the award. ' : '') + 'For weekend, public holiday or evening work, enter the rate from the award with "Other rate from my award".';
    } else note.hidden = true;
  }
  function shortRange(s) { var d = pd(s); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }

  /* ---------- Shifts ---------- */
  function newShift(date) { return { id: ++S.seq, date: date, start: '09:00', end: '17:00', brk: '30', pen: null, manual: false, split: false, at: '18:00', pen2: null, custom: '', custom2: '' }; }
  function addShift() { S.shifts.push(newShift(iso(new Date()))); renderShifts(); }
  function addNext() {
    var last = S.shifts[S.shifts.length - 1]; var s = newShift(iso(new Date()));
    if (last) { var d = pd(last.date); d.setDate(d.getDate() + 1); s.date = iso(d); s.start = last.start; s.end = last.end; s.brk = last.brk; }
    S.shifts.push(s); renderShifts();
  }
  function optHtml(opts, cur) {
    var html = '', g = null;
    opts.forEach(function (o) {
      if (o.group !== g) { if (g !== null) html += '</optgroup>'; g = o.group; html += '<optgroup label="' + esc(o.group) + '">'; }
      html += '<option value="' + o.key + '"' + (o.key === cur ? ' selected' : '') + '>' + esc(o.label) + ' · ' + money(o.val) + '/hr</option>';
    });
    if (g !== null) html += '</optgroup>';
    html += '<option value="custom"' + (cur === 'custom' ? ' selected' : '') + '>Other rate from my award (enter it)</option>';
    return html;
  }
  function renderShifts() {
    $('shifts').innerHTML = S.shifts.map(cardHtml).join('');
    S.shifts.forEach(updateMeta);
    renderResult();
  }
  function renderOne(s) {
    var el = document.querySelector('.shift[data-id="' + s.id + '"]'); if (!el) return renderShifts();
    var t = document.createElement('div'); t.innerHTML = cardHtml(s, S.shifts.indexOf(s)); el.replaceWith(t.firstChild);
    updateMeta(s); renderResult();
  }
  function cardHtml(s, i) {
      var opts = options(s.date);
      if (!s.manual || (s.pen !== 'custom' && !opts.some(function (o) { return o.key === s.pen; }))) s.pen = suggest(s, opts) || (opts[0] ? opts[0].key : 'custom');
      if (s.split && (!s.pen2 || (s.pen2 !== 'custom' && !opts.some(function (o) { return o.key === s.pen2; })))) s.pen2 = s.pen;
      return '<div class="shift" data-id="' + s.id + '">' +
        '<div class="shift-top">' +
        '<div class="f"><label for="d' + s.id + '">Date</label><input class="in" type="date" id="d' + s.id + '" data-k="date" value="' + s.date + '"></div>' +
        '<div class="f"><label for="s' + s.id + '">Start</label><input class="in" type="time" id="s' + s.id + '" data-k="start" value="' + s.start + '"></div>' +
        '<div class="f"><label for="e' + s.id + '">Finish</label><input class="in" type="time" id="e' + s.id + '" data-k="end" value="' + s.end + '"></div>' +
        '<div class="f"><label for="b' + s.id + '">Unpaid break (min)</label><input class="in" inputmode="numeric" id="b' + s.id + '" data-k="brk" value="' + esc(s.brk) + '"></div>' +
        '<button type="button" class="x" data-act="del" aria-label="Remove shift ' + (i + 1) + '">×</button></div>' +
        '<div class="f"><label for="p' + s.id + '">Rate for this shift</label><select class="sel" id="p' + s.id + '" data-k="pen">' + optHtml(opts, s.pen) + '</select></div>' +
        (s.pen === 'custom' ? '<div class="custom f"><label for="c' + s.id + '">Hourly rate from your award</label><div class="money"><input class="in" inputmode="decimal" id="c' + s.id + '" data-k="custom" value="' + esc(s.custom) + '" placeholder="0.00"></div></div>' : '') +
        (s.split ? '<div class="split"><div class="f"><label for="a' + s.id + '">From</label><input class="in" type="time" id="a' + s.id + '" data-k="at" value="' + s.at + '"></div><div class="f"><label for="q' + s.id + '">Use this rate</label><select class="sel" id="q' + s.id + '" data-k="pen2">' + optHtml(opts, s.pen2) + '</select></div>' +
          (s.pen2 === 'custom' ? '<div class="custom f"><label for="r' + s.id + '">Hourly rate from your award</label><div class="money"><input class="in" inputmode="decimal" id="r' + s.id + '" data-k="custom2" value="' + esc(s.custom2) + '" placeholder="0.00"></div></div>' : '') + '</div>' : '') +
        '<div class="shift-meta"><span class="mchips" id="m' + s.id + '"></span>' +
        (s.split ? '<button type="button" class="linkbtn" data-act="unsplit">Remove split</button>' : '<button type="button" class="linkbtn" data-act="split">Split shift into two rates</button>') +
        '<span class="amt fig" id="t' + s.id + '"></span></div></div>';
  }
  function calc(s) {
    var opts = options(s.date), st = mins(s.start), en = mins(s.end);
    if (st == null || en == null || !s.date) return { lines: [], hours: 0, opts: opts };
    var dur = en > st ? en - st : en + 1440 - st, brk = Math.max(0, num(s.brk) || 0), segs = [];
    var rel = s.split ? ((mins(s.at) - st + 1440) % 1440) : 0;
    if (s.split && rel > 0 && rel < dur) {
      var b1 = Math.min(brk, rel), b2 = Math.min(brk - b1, dur - rel);
      segs.push({ m: rel - b1, key: s.pen, custom: s.custom, from: s.start, to: s.at });
      segs.push({ m: dur - rel - b2, key: s.pen2, custom: s.custom2, from: s.at, to: s.end });
    } else segs.push({ m: Math.max(0, dur - brk), key: s.pen, custom: s.custom, from: s.start, to: s.end });
    var lines = segs.map(function (g) {
      var o = g.key === 'custom' ? null : opts.find(function (x) { return x.key === g.key; });
      var rate = o ? o.val : num(g.custom), h = g.m / 60;
      return { date: s.date, from: g.from, to: g.to, hours: h, rate: rate, amount: rate != null ? r2(h * rate) : 0, label: o ? o.label : 'Other rate from your award', group: o ? o.group : 'Entered by you', pct: o ? o.pct : null, ot: o ? isOT(o) : false, missing: rate == null };
    });
    return { lines: lines, hours: lines.reduce(function (a, l) { return a + l.hours; }, 0), opts: opts };
  }
  function updateMeta(s) {
    var el = $('m' + s.id); if (!el) return;
    var c = calc(s), ph = PH[s.date], bits = [];
    if (ph) bits.push('<span class="chip ph">Victorian public holiday: ' + esc(ph) + '</span>');
    if (!c.opts.length && S.doc) bits.push('<span class="chip ph">No award rate in the data for this date and classification</span>');
    if (!s.manual && c.opts.length) bits.push('<span class="chip sg">Suggested from the day</span>');
    var day = pd(s.date).getDay(), en = mins(s.end), st = mins(s.start);
    var hasEve = c.opts.some(function (o) { return !isOT(o) && /evening|night|after \d|between|before \d|pm/i.test(o.label) && !/^ordinary/i.test(o.label); });
    if (hasEve && day > 0 && day < 6 && !s.split && (en > 18 * 60 || en < st || st < 7 * 60)) bits.push('<span>This award has evening or early rates. Split the shift to apply one from a set time.</span>');
    var t = $('t' + s.id); if (t) t.textContent = c.hours.toFixed(2) + ' h · ' + money(c.lines.reduce(function (a, l) { return a + l.amount; }, 0));
    el.innerHTML = bits.join('');
  }

  /* ---------- Result ---------- */
  function result() {
    var lines = []; S.shifts.forEach(function (s) { lines = lines.concat(calc(s).lines); });
    lines.sort(function (a, b) { return (a.date + a.from).localeCompare(b.date + b.from); });
    var total = r2(lines.reduce(function (a, l) { return a + l.amount; }, 0));
    var hours = lines.reduce(function (a, l) { return a + l.hours; }, 0);
    var sup = r2(lines.reduce(function (a, l) { return a + (l.ot ? 0 : l.amount); }, 0) * SG);
    var paid = num($('paid').value);
    return { lines: lines, total: total, hours: hours, sup: sup, paid: paid, diff: paid == null ? null : r2(total - paid), missing: lines.some(function (l) { return l.missing; }) };
  }
  function whoText() {
    if (!S.doc) return 'Choose your award to start.';
    var cls = clsList().find(function (c) { return c.id === String(S.cls); });
    return tidyName(S.doc.name) + ' · ' + ({ casual: 'Casual', pt: 'Part-time', ft: 'Full-time' })[S.emp] + (S.cat !== 'adult' ? ' · ' + CAT_LABEL[S.cat] : '') + (cls ? ' · ' + tidyName((cls.parent && S.cat !== 'adult' ? cls.parent + ', ' : '') + cls.name) : '');
  }
  function renderResult() {
    $('who').textContent = whoText();
    var body = $('stmtBody');
    if (!S.doc || !S.shifts.length) { body.innerHTML = '<p class="stmt-empty">Your result appears here once you\'ve picked an award and added a shift.</p>'; return; }
    var R = result(), v;
    if (R.paid == null) v = '<div class="verdict"><div class="k">Award minimum for these shifts</div><div class="v fig">' + money(R.total) + '</div><p>Enter what your payslip says in step 4 to see if you may be owed money.</p></div>';
    else if (R.diff > 0.004) v = '<div class="verdict"><div class="k">You may be owed</div><div class="v owed fig">' + money(R.diff) + '</div><p>Your payslip shows less than the award minimum for the shifts and rates you entered. Check the rates you picked, then see the steps below.</p></div>';
    else v = '<div class="verdict"><div class="k">Paid at or above the award minimum</div><div class="v ok fig">' + money(Math.abs(R.diff)) + ' over</div><p>Based on the shifts and rates you entered, you were paid at least the minimum your award sets.</p></div>';
    var rows = R.lines.map(function (l) {
      return '<tr><td>' + esc(shortDate(l.date)) + '<small>' + l.from + ' to ' + l.to + '</small></td><td class="n fig">' + l.hours.toFixed(2) + '</td><td>' + esc(l.label) + '<small>' + esc(l.group) + '</small></td><td class="n fig">' + (l.pct != null ? l.pct + '%' : '') + '</td><td class="n fig">' + (l.rate != null ? money(l.rate) : 'Enter rate') + '</td><td class="n fig">' + money(l.amount) + '</td></tr>';
    }).join('');
    body.innerHTML = v +
      '<div class="tot"><div><span>Award minimum</span><b class="fig">' + money(R.total) + '</b></div><div><span>You were paid</span><b class="fig">' + (R.paid == null ? '–' : money(R.paid)) + '</b></div><div><span>Difference</span><b class="fig">' + (R.diff == null ? '–' : money(R.diff)) + '</b></div><div><span>Super on top at 12%</span><b class="fig">' + money(R.sup) + '</b></div></div>' +
      (R.missing ? '<p class="stmt-note" style="color:#8A3B16">One or more shifts use "Other rate" without an amount, so they count as $0.</p>' : '') +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Shift</th><th class="n">Hours</th><th>Rate used</th><th class="n">Penalty</th><th class="n">Per hour</th><th class="n">Amount</th></tr></thead><tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td>Total</td><td class="n fig">' + R.hours.toFixed(2) + '</td><td></td><td></td><td></td><td class="n fig">' + money(R.total) + '</td></tr></tfoot></table></div>' +
      '<p class="stmt-note">Penalty is the percentage of the base rate shown in the award data. Super is an estimate: 12% super guarantee on the amounts above, excluding overtime, which is usually not ordinary time earnings. Super is paid to your fund on top of your wages.</p>';
  }
  function summaryText() {
    var R = result(), out = ['TaxSignal pay check', whoText(), ''];
    R.lines.forEach(function (l) { out.push(shortDate(l.date) + ' ' + l.from + '-' + l.to + ': ' + l.hours.toFixed(2) + ' h x ' + (l.rate != null ? money(l.rate) : '?') + ' (' + l.label + ') = ' + money(l.amount)); });
    out.push('', 'Award minimum: ' + money(R.total));
    if (R.paid != null) { out.push('Paid: ' + money(R.paid)); out.push(R.diff > 0.004 ? 'You may be owed: ' + money(R.diff) : 'Paid at or above the minimum by ' + money(Math.abs(R.diff))); }
    out.push('Super on top at 12% (estimate): ' + money(R.sup));
    out.push('', $('srcLine').textContent, 'Estimate only. For disputes, check with the Fair Work Ombudsman: fairwork.gov.au', 'https://taxsignal.com.au/am-i-being-underpaid');
    return out.join('\n');
  }
  function copy() {
    var t = summaryText(), b = $('copy');
    var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy result'; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fallback); else fallback();
    function fallback() { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove(); }
  }
  function pdf() {
    var b = $('pdf'); b.textContent = 'Preparing…';
    var go = function () {
      var J = window.jspdf.jsPDF, doc = new J({ unit: 'pt', format: 'a4' }), R = result(), y = 56, W = 595, M = 48;
      var t = function (s, x, yy, o) { doc.text(String(s).replace(/[^\x20-\x7E–·]/g, ''), x, yy, o); };
      doc.setFillColor(11, 22, 18); doc.rect(0, 0, W, 86, 'F');
      doc.setTextColor(224, 200, 145); doc.setFont('helvetica', 'bold'); doc.setFontSize(18); t('TaxSignal', M, 50);
      doc.setTextColor(238, 231, 215); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); t('Pay check statement', W - M, 50, { align: 'right' });
      y = 120; doc.setTextColor(11, 22, 18); doc.setFontSize(10);
      doc.splitTextToSize(whoText(), W - 2 * M).forEach(function (ln) { t(ln, M, y); y += 14; });
      y += 14; doc.setFontSize(11); doc.setTextColor(90, 97, 89);
      t(R.paid == null ? 'Award minimum for these shifts' : (R.diff > 0.004 ? 'You may be owed' : 'Paid at or above the award minimum by'), M, y);
      y += 30; doc.setFontSize(30); doc.setFont('helvetica', 'bold'); doc.setTextColor(R.paid != null && R.diff > 0.004 ? 138 : 11, R.paid != null && R.diff > 0.004 ? 59 : 22, R.paid != null && R.diff > 0.004 ? 22 : 18);
      t(R.paid == null ? money(R.total) : money(Math.abs(R.diff)), M, y);
      y += 30; doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(11, 22, 18);
      [['Award minimum', money(R.total)], ['You were paid', R.paid == null ? '-' : money(R.paid)], ['Difference', R.diff == null ? '-' : money(R.diff)], ['Super on top at 12% (estimate)', money(R.sup)]].forEach(function (p, i) { t(p[0], M + i * 125, y); doc.setFont('helvetica', 'bold'); t(p[1], M + i * 125, y + 15); doc.setFont('helvetica', 'normal'); });
      y += 44; doc.setDrawColor(11, 22, 18); doc.line(M, y, W - M, y); y += 16;
      var cols = [M, M + 92, M + 132, M + 360, M + 430];
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); ['SHIFT', 'HOURS', 'RATE USED', 'PER HOUR', 'AMOUNT'].forEach(function (h, i) { t(h, cols[i] + (i === 1 || i >= 3 ? 30 : 0), y, i === 1 || i >= 3 ? { align: 'right' } : undefined); });
      y += 8; doc.line(M, y, W - M, y); y += 14; doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      R.lines.forEach(function (l) {
        if (y > 760) { doc.addPage(); y = 60; }
        var lab = doc.splitTextToSize(l.label, 220);
        t(shortDate(l.date), cols[0], y); t(l.from + '-' + l.to, cols[0], y + 11);
        t(l.hours.toFixed(2), cols[1] + 30, y, { align: 'right' });
        lab.forEach(function (ln, k) { t(ln, cols[2], y + k * 11); });
        t(l.rate != null ? money(l.rate) : '-', cols[3] + 30, y, { align: 'right' }); t(money(l.amount), cols[4] + 30, y, { align: 'right' });
        y += Math.max(24, lab.length * 11 + 8);
      });
      doc.line(M, y - 6, W - M, y - 6); doc.setFont('helvetica', 'bold'); t('Total', cols[0], y + 8); t(R.hours.toFixed(2), cols[1] + 30, y + 8, { align: 'right' }); t(money(R.total), cols[4] + 30, y + 8, { align: 'right' });
      y += 36; doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(90, 97, 89);
      doc.splitTextToSize($('srcLine').textContent + ' Estimate only. It does not cover enterprise agreements, allowances or every award rule. For a dispute, check with the Fair Work Ombudsman at fairwork.gov.au. Super estimate excludes overtime. Generated ' + new Date().toLocaleDateString('en-AU') + ' at taxsignal.com.au/am-i-being-underpaid', W - 2 * M).forEach(function (ln) { if (y > 800) { doc.addPage(); y = 60; } t(ln, M, y); y += 12; });
      doc.save('TaxSignal-pay-check.pdf'); b.textContent = 'Download PDF summary';
    };
    if (window.jspdf) return go();
    var sc = document.createElement('script'); sc.src = '/vendor/jspdf.umd.min.js'; sc.onload = go; sc.onerror = function () { b.textContent = 'Download PDF summary'; }; document.head.appendChild(sc);
  }

  /* ---------- Events ---------- */
  function shiftOf(el) { var c = el.closest('.shift'); return c && S.shifts.find(function (s) { return s.id === +c.dataset.id; }); }
  function init() {
    var q = $('q'), deb;
    q.addEventListener('input', function () { clearTimeout(deb); deb = setTimeout(function () { search(q.value); }, 60); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = $('res').querySelector('button'); if (f) { e.preventDefault(); pick(f.dataset.c); } } });
    $('res').addEventListener('click', function (e) { var b = e.target.closest('button[data-c]'); if (b) pick(b.dataset.c); });
    $('change').addEventListener('click', function () { $('awardPick').hidden = false; $('picked').hidden = true; q.focus(); q.select(); });
    $('emp').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.emp = b.dataset.v; if (S.doc) { renderYou(); S.shifts.forEach(function (s) { s.manual = false; }); renderShifts(); } else renderYou0(); });
    $('cat').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.cat = b.dataset.v; S.cls = null; renderYou(); S.shifts.forEach(function (s) { s.manual = false; }); renderShifts(); });
    $('cls').addEventListener('change', function () { S.cls = this.value; S.shifts.forEach(function (s) { s.manual = false; }); renderShifts(); });
    $('addShift').addEventListener('click', function () { addShift(); var l = $('shifts').lastElementChild; if (l) l.querySelector('input').focus(); });
    $('addNext').addEventListener('click', addNext);
    $('paid').addEventListener('input', renderResult);
    var sh = $('shifts');
    // Only a new date or a new rate changes the card's options, so only those redraw the card.
    // Other edits update the totals in place, so focus never jumps while someone is typing.
    sh.addEventListener('input', function (e) {
      var s = shiftOf(e.target), k = e.target.dataset.k; if (!s || !k || k === 'pen' || k === 'pen2') return;
      if (k === 'date') { if (e.target.value) s.date = e.target.value; return; }
      s[k] = e.target.value; updateMeta(s); renderResult();
    });
    sh.addEventListener('change', function (e) {
      var s = shiftOf(e.target), k = e.target.dataset.k; if (!s || !k) return;
      if (k === 'date' && !e.target.value) return;
      s[k] = e.target.value;
      if (k === 'pen' || k === 'pen2') s.manual = true;
      if (k === 'date' || k === 'pen' || k === 'pen2') {
        var focusId = e.target.id; renderOne(s);
        var el = document.getElementById(focusId); if (el && document.activeElement === document.body) el.focus();
      } else { updateMeta(s); renderResult(); }
    });
    sh.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'), s = b && shiftOf(b); if (!s) return;
      if (b.dataset.act === 'del') S.shifts = S.shifts.filter(function (x) { return x !== s; });
      if (b.dataset.act === 'split') { s.split = true; var o = options(s.date).find(function (x) { return !isOT(x) && /evening|night|after \d|between|pm/i.test(x.label) && !/^ordinary/i.test(x.label); }); s.pen2 = o ? o.key : s.pen; var m = (o && o.label.match(/(\d{1,2})[.:](\d{2})\s*(am|pm)/i)); if (m) { var h = (+m[1] % 12) + (/pm/i.test(m[3]) ? 12 : 0); s.at = String(h).padStart(2, '0') + ':' + m[2]; } }
      if (b.dataset.act === 'unsplit') s.split = false;
      renderShifts();
    });
    $('copy').addEventListener('click', copy);
    $('pdf').addEventListener('click', pdf);
    loadIndex().catch(function () { $('res').innerHTML = '<p class="notice">Award data could not load. Refresh the page to try again.</p>'; });
  }
  function renderYou0() { Array.prototype.forEach.call($('emp').children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === S.emp)); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
