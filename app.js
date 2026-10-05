/* Routing, unit pages, question engine, flashcards, practice and mock exams. */
const store = {
  d: (() => { try { return JSON.parse(localStorage.getItem('mlreview') || '{}'); } catch { return {}; } })(),
  get(k, f) { return this.d[k] ?? f; },
  set(k, v) { this.d[k] = v; try { localStorage.setItem('mlreview', JSON.stringify(this.d)); } catch {} },
};
const done = () => store.get('q', {});
const mark = (key, ok) => { const q = done(); q[key] = ok ? 1 : 0; store.set('q', q); nav(); };
const unitScore = u => { const q = done(); return u.quiz.filter((_, i) => q[`${u.id}-${i}`] === 1).length; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const EXTRA = [['practice', 'Practice midterm', 'P'], ['past', 'Past quizzes', 'Q'], ['mock', 'Mock exam', 'M'], ['formulas', 'Formula sheet', 'ƒ']];
const KIND = { mc: 'Multiple choice', num: 'Calculate', fill: 'Fill in the blank', short: 'Short answer' };

function route() {
  const [page, tab] = location.hash.replace('#', '').split('.');
  return { page: page || 'home', tab: tab || 'notes' };
}
function nav() {
  const { page } = route(), pq = done();
  const pDone = PRACTICE.filter(p => pq['practice-' + p.n] === 1).length;
  $('#nav').innerHTML = `<a href="#home" ${page === 'home' ? 'aria-current="page"' : ''}><span class="num">00</span><span>Overview</span><span></span></a>` +
    UNITS.map((u, i) => { const s = unitScore(u); return `<a href="#${u.id}" ${page === u.id ? 'aria-current="page"' : ''}><span class="num">0${i + 1}</span><span>${u.title}</span><span class="prog ${s === u.quiz.length ? 'done' : ''}">${s}/${u.quiz.length}</span></a>`; }).join('') +
    '<div class="sep"></div>' +
    EXTRA.map(([id, t, g]) => `<a href="#${id}" ${page === id ? 'aria-current="page"' : ''}><span class="num">${g}</span><span>${t}</span><span class="prog ${id === 'practice' && pDone === PRACTICE.length ? 'done' : ''}">${id === 'practice' ? pDone + '/' + PRACTICE.length : ''}</span></a>`).join('');
}

/* ---------- Question engine ---------- */
function question(q, key, label) {
  const el = document.createElement('article'); el.className = 'q';
  const prev = done()[key];
  el.innerHTML = `<div class="q-head"><span class="q-n">${label}</span><span class="q-t">${q.q}</span><span class="q-kind">${q.past ? 'Past quiz · ' : ''}${KIND[q.t]}${prev === 1 ? ' · ✓' : ''}</span></div>` +
    (q.ctx ? `<div class="ctx">${q.ctx}</div>` : '') + (q.fig ? '<canvas class="fig"></canvas>' : '') + '<div class="body"></div><div class="why" hidden></div>';
  if (q.fig) drawFig($('.fig', el), q.fig, 5, 400);
  const body = $('.body', el), why = $('.why', el);
  const reveal = (ok, lead) => { why.hidden = false; why.innerHTML = `<b class="${ok ? 'r' : 'w'}">${lead}</b> ${q.why}`; if (ok !== null) mark(key, ok); el.dispatchEvent(new CustomEvent('answered', { bubbles: true, detail: { ok } })); };
  if (q.t === 'mc') {
    body.className = 'opts';
    body.innerHTML = q.o.map((o, i) => `<button class="opt" data-i="${i}">${String.fromCharCode(97 + i)}. ${o}</button>`).join('');
    body.onclick = e => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const i = +b.dataset.i, ok = i === q.a;
      $$('.opt', body).forEach((o, k) => { o.disabled = true; if (k === q.a) o.classList.add('good'); else if (k === i) o.classList.add('bad'); });
      reveal(ok, ok ? 'Correct.' : 'Not quite.');
    };
  } else if (q.t === 'num' || q.t === 'fill') {
    body.className = 'row';
    body.innerHTML = `<input type="text" id="in-${key}" ${q.t === 'num' ? 'inputmode="decimal"' : ''} placeholder="${q.t === 'num' ? 'Your number' : 'Your answer'}" aria-label="Answer" style="flex:0 1 220px"><button class="btn">Check</button><button class="btn alt">Show answer</button>`;
    const inp = $('input', body), [chk, show] = $$('button', body);
    const ans = q.t === 'num' ? String(q.a) : q.accept[0];
    const check = () => {
      const v = inp.value.trim().toLowerCase(); if (!v) return;
      const ok = q.t === 'num' ? Math.abs(parseFloat(v.replace(/[%,$]/g, '').replace('−', '-')) - q.a) <= (q.tol || 0) + 1e-9 : q.accept.some(a => v.includes(a));
      reveal(ok, ok ? 'Correct.' : `Not quite. Answer: ${ans}.`);
    };
    chk.onclick = check; inp.onkeydown = e => { if (e.key === 'Enter') check(); };
    show.onclick = () => reveal(null, `Answer: ${ans}.`);
  } else {
    body.innerHTML = `<textarea id="in-${key}" placeholder="Write your answer the way you would on the exam, then compare." aria-label="Your answer"></textarea><div class="row" style="margin-top:8px"><button class="btn">Show model answer</button><span class="grade row" hidden><span class="note">How did you do?</span><button class="btn alt" data-ok="1">Got it</button><button class="btn alt" data-ok="0">Missed it</button></span></div>`;
    $('.btn', body).onclick = () => { why.hidden = false; why.innerHTML = `<b class="r">Model answer.</b> ${q.why}`; $('.grade', body).hidden = false; };
    $('.grade', body).onclick = e => { const b = e.target.closest('[data-ok]'); if (!b) return; const ok = b.dataset.ok === '1'; mark(key, ok); $('.grade', body).innerHTML = `<span class="note">${ok ? 'Marked as correct.' : 'Marked for review.'}</span>`; el.dispatchEvent(new CustomEvent('answered', { bubbles: true, detail: { ok } })); };
  }
  return el;
}

/* ---------- Pages ---------- */
function home(main) {
  const total = UNITS.reduce((s, u) => s + u.quiz.length, 0), got = UNITS.reduce((s, u) => s + unitScore(u), 0);
  main.innerHTML = `<div class="col">
    <header><p class="eyebrow">Machine Learning for Business Analytics</p><h1>Midterm review</h1></header>
    <p class="lede">Seven units, one per lecture deck. Each has notes, a hands-on lab, flashcards and a quiz. No coding is tested, so everything here is about concepts and reading output.</p>
    <div class="stats"><div><span>Quiz questions correct</span><strong>${got} / ${total}</strong></div><div><span>Exam format</span><strong style="font-size:14px">T/F · multiple choice · fill-in · short answer</strong></div><div><span>Covers</span><strong style="font-size:14px">Decks 1–7</strong></div></div>
    <div class="grid">${UNITS.map((u, i) => `<a class="tile" href="#${u.id}"><span class="num">UNIT 0${i + 1}</span><strong>${u.title}</strong><span class="d">${u.lede}</span><div class="bar"><i style="width:${unitScore(u) / u.quiz.length * 100}%"></i></div></a>`).join('')}</div>
    <div class="sec"><h2>When you are short on time</h2><div class="grid">
      <a class="tile" href="#practice"><span class="num">START HERE</span><strong>Practice midterm</strong><span class="d">The instructor's sample questions with worked answers.</span></a>
      <a class="tile" href="#past"><span class="num">SEEN BEFORE</span><strong>Past quizzes</strong><span class="d">${PAST.length} questions from the course quizzes so far.</span></a>
      <a class="tile" href="#mock"><span class="num">TEST YOURSELF</span><strong>Mock exam</strong><span class="d">Twenty questions drawn at random from all seven units.</span></a>
      <a class="tile" href="#formulas"><span class="num">MEMORIZE</span><strong>Formula sheet</strong><span class="d">Every formula, test and rule-of-thumb number in one place.</span></a>
    </div></div>
    <p class="note">Built from Dr. Aric LaBarr's lecture decks and <a href="${SITE}" target="_blank" rel="noopener">course site</a>. Progress is saved in this browser only.</p></div>`;
}

function unit(main, u, tab) {
  const i = UNITS.indexOf(u), tabs = [['notes', 'Notes'], ['lab', 'Lab'], ['cards', 'Flashcards'], ['quiz', `Quiz (${u.quiz.length})`]];
  main.innerHTML = `<div class="col">
    <header><p class="eyebrow">Unit 0${i + 1} · ${u.deck}</p><h1>${u.title}</h1></header>
    <p class="lede">${u.lede}</p>
    <div class="tabs" role="tablist">${tabs.map(([k, t]) => `<button role="tab" aria-selected="${k === tab}" data-tab="${k}">${t}</button>`).join('')}</div>
    <div id="pane"></div>
    <div class="pager">${i ? `<a href="#${UNITS[i - 1].id}">← ${UNITS[i - 1].title}</a>` : '<span></span>'}${i < UNITS.length - 1 ? `<a href="#${UNITS[i + 1].id}">${UNITS[i + 1].title} →</a>` : '<a href="#practice">Practice midterm →</a>'}</div></div>`;
  $('.tabs', main).onclick = e => { const b = e.target.closest('[data-tab]'); if (b) location.hash = `${u.id}.${b.dataset.tab}`; };
  const pane = $('#pane', main);
  if (tab === 'lab') { pane.className = 'panel'; LABS[u.id](pane); }
  else if (tab === 'cards') cards(pane, u);
  else if (tab === 'quiz') {
    pane.className = 'col'; pane.style.gap = '14px';
    u.quiz.forEach((q, k) => pane.append(question(q, `${u.id}-${k}`, `Q${k + 1}`)));
  } else {
    pane.className = 'col';
    pane.innerHTML = u.secs.map(s => `<section class="sec"><h2>${s.h}</h2><div class="prose">${s.b}</div></section>`).join('') +
      `<section class="sec"><h2>Go deeper</h2><div class="prose"><ul>${u.links.map(([t, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${t}</a></li>`).join('')}</ul></div>
      <div class="row"><button class="btn" data-go="lab">Open the lab</button><button class="btn alt" data-go="quiz">Take the quiz</button></div></section>`;
    $$('[data-go]', pane).forEach(b => b.onclick = () => location.hash = `${u.id}.${b.dataset.go}`);
    $$('[data-fig]', pane).forEach(f => NOTEFIGS[f.dataset.fig](f));
    $$('[data-reader]', pane).forEach(pre => {
      const id = pre.dataset.reader, note = $(`[data-note="${id}"]`, pane);
      pre.onclick = e => { const b = e.target.closest('b[data-k]'); if (!b) return; $$('b', pre).forEach(x => x.classList.toggle('on', x === b)); const [t, d] = READERS[id][b.dataset.k]; note.innerHTML = `<strong>${t}</strong><br>${d}`; };
    });
  }
}

function cards(pane, u) {
  let order = u.cards.map((_, i) => i), i = 0, back = false;
  pane.className = 'col'; pane.style.gap = '12px';
  pane.innerHTML = `<div class="card"><button class="card-in" aria-live="polite"></button></div>
    <div class="row"><button class="btn alt" data-a="prev">← Previous</button><button class="btn" data-a="flip">Flip</button><button class="btn alt" data-a="next">Next →</button><button class="ghost" data-a="mix">Shuffle</button><span class="mono note" id="cd-n"></span></div>
    <p class="note">Click the card or press space to flip. Arrow keys move between cards.</p>`;
  const face = $('.card-in', pane);
  const draw = () => { const [f, b] = u.cards[order[i]]; face.classList.toggle('back', back); face.innerHTML = `<span><span class="side-l">${back ? 'Answer' : 'Prompt'}</span><span class="txt">${esc(back ? b : f)}</span></span>`; $('#cd-n', pane).textContent = `${i + 1} / ${order.length}`; };
  const act = a => {
    if (a === 'flip') back = !back; else { back = false; if (a === 'next') i = (i + 1) % order.length; if (a === 'prev') i = (i - 1 + order.length) % order.length; if (a === 'mix') { order.sort(() => Math.random() - 0.5); i = 0; } }
    draw();
  };
  face.onclick = () => act('flip');
  pane.onclick = e => { const b = e.target.closest('[data-a]'); if (b) act(b.dataset.a); };
  pane.tabIndex = 0;
  pane.onkeydown = e => { if (e.key === 'ArrowRight') act('next'); else if (e.key === 'ArrowLeft') act('prev'); else if (e.key === ' ' && e.target !== face) { e.preventDefault(); act('flip'); } };
  draw();
}

function practice(main) {
  main.innerHTML = `<div class="col"><header><p class="eyebrow">From the instructor's sample test</p><h1>Practice midterm</h1></header>
    <p class="lede">The ${PRACTICE.length} questions from the practice midterm, reworded, with a worked answer for each. Numbering follows the original, which skips a few numbers. The two plots are redrawn to show the same shapes.</p>
    <div class="col" id="pq" style="gap:14px"></div></div>`;
  PRACTICE.forEach(p => {
    const el = question(p, 'practice-' + p.n, 'Q' + p.n), u = UNITS.find(x => x.id === p.u);
    const a = document.createElement('a'); a.href = '#' + u.id; a.className = 'note'; a.textContent = `Review: ${u.title} →`; el.append(a);
    $('#pq', main).append(el);
  });
}

function past(main) {
  main.innerHTML = `<div class="col"><header><p class="eyebrow">From your course quizzes</p><h1>Past quizzes</h1></header>
    <p class="lede">${PAST.length} questions from the quizzes already taken, reworded and grouped by unit. Each one also appears at the end of its unit's quiz. Answers were checked against the lecture decks, not an official key.</p>
    <div class="col" id="pz" style="gap:14px"></div></div>`;
  UNITS.forEach(u => {
    const qs = PAST.filter(p => p.u === u.id); if (!qs.length) return;
    const h = document.createElement('h2'); h.textContent = u.title; $('#pz', main).append(h);
    qs.forEach((p, i) => $('#pz', main).append(question(p, p.key, 'Q' + (i + 1))));
  });
}

function mock(main) {
  const pool = UNITS.flatMap(u => u.quiz.map((q, i) => ({ q, key: `${u.id}-${i}`, u })));
  const pick = pool.sort(() => Math.random() - 0.5).slice(0, 20);
  let right = 0, seen = 0;
  main.innerHTML = `<div class="col"><header><p class="eyebrow">Mixed review</p><h1>Mock exam</h1></header>
    <p class="lede">Twenty questions drawn at random across all seven units. Use New draw for a fresh set.</p>
    <div class="row"><div class="stats" style="flex:1 1 260px"><div><span>Score</span><strong id="mk-s">0 / 0</strong></div><div><span>Remaining</span><strong id="mk-r">20</strong></div></div><button class="btn alt" id="mk-n">New draw</button></div>
    <div class="col" id="mq" style="gap:14px"></div><div class="verdict" id="mk-v" hidden></div></div>`;
  pick.forEach((p, i) => { const el = question(p.q, p.key, `${i + 1}`); const t = document.createElement('span'); t.className = 'note'; t.textContent = p.u.title; el.append(t); el.dataset.u = p.u.title; $('#mq', main).append(el); });
  const missed = {};
  $('#mq', main).addEventListener('answered', e => {
    if (e.detail.ok === null || e.target.dataset.done) return; e.target.dataset.done = 1;
    seen++; if (e.detail.ok) right++; else missed[e.target.dataset.u] = (missed[e.target.dataset.u] || 0) + 1;
    $('#mk-s', main).textContent = `${right} / ${seen}`; $('#mk-r', main).textContent = 20 - seen;
    if (seen === 20) { const v = $('#mk-v', main), m = Object.entries(missed).sort((a, b) => b[1] - a[1]); v.hidden = false; v.className = 'verdict ' + (right >= 16 ? 'good' : 'warn'); v.innerHTML = `<b>${right} of 20.</b> ` + (m.length ? `Most misses: ${m.map(([u, n]) => `${u} (${n})`).join(', ')}.` : 'A clean sweep.'); }
  });
  $('#mk-n', main).onclick = () => mock(main);
}

function formulas(main) {
  main.innerHTML = `<div class="col"><header><p class="eyebrow">One page to memorize</p><h1>Formula sheet</h1></header>
    <p class="lede">Formulas, hypothesis tests and the rule-of-thumb numbers from all seven decks.</p>
    ${FORMULAS.map(([h, rows]) => `<section class="sec"><h2>${h}</h2><div class="tw"><table>${rows.map(([n, f]) => `<tr><td>${n}</td><td class="mono">${f}</td></tr>`).join('')}</table></div></section>`).join('')}
    <section class="sec"><h2>Which test, and what is its null?</h2><div class="tw"><table><tr><th>Test</th><th>Used for</th><th>H₀</th></tr>${TESTS.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>
    <p class="trap"><b>Remember</b>For the assumption tests, H₀ is always "the assumption holds". A small p-value is the problem.</p></section>
    <section class="sec"><h2>Numbers worth knowing</h2><div class="tw"><table>${NUMBERS.map(([n, d]) => `<tr><td class="mono">${n}</td><td>${d}</td></tr>`).join('')}</table></div></section>
    <section class="sec"><h2>Sentence templates for interpreting output</h2><div class="prose"><ul>
      <li><b>Linear slope:</b> "Each additional [unit of x] is associated with a [β] change in [y], on average, holding the other variables constant."</li>
      <li><b>Linear dummy:</b> "[Group] has [β] higher/lower [y] than [reference group], holding the other variables constant."</li>
      <li><b>Logistic, categorical:</b> "[Group] has e<sup>β</sup> times the odds of [event] compared with [reference group], on average."</li>
      <li><b>Logistic, continuous:</b> "Each additional [unit of x] changes the expected odds of [event] by 100 × (e<sup>β</sup> − 1)%."</li>
      <li><b>Concordance:</b> "For [c]% of event/non-event pairs, the model gave the event the higher predicted probability."</li>
      <li><b>Lift:</b> "In the top [depth]% of customers by predicted probability, we get [lift] times as many responses as a random sample of that size."</li>
    </ul></div></section></div>`;
}

function render() {
  const { page, tab } = route(), main = $('#main'), u = UNITS.find(x => x.id === page);
  if (u) unit(main, u, ['notes', 'lab', 'cards', 'quiz'].includes(tab) ? tab : 'notes');
  else if (page === 'practice') practice(main); else if (page === 'past') past(main); else if (page === 'mock') mock(main); else if (page === 'formulas') formulas(main); else home(main);
  nav(); document.title = (u ? u.title : page === 'home' ? 'Overview' : EXTRA.find(e => e[0] === page)?.[1] || 'Overview') + ' · ML Midterm Review';
  window.scrollTo(0, 0);
}

/* ---------- Theme and reset ---------- */
const themes = ['auto', 'light', 'dark'];
function applyTheme() { const t = store.get('theme', 'auto'); if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t; $('#theme').textContent = 'Theme: ' + t; }
$('#theme').onclick = () => { store.set('theme', themes[(themes.indexOf(store.get('theme', 'auto')) + 1) % 3]); applyTheme(); render(); };
let armed = false;
$('#reset').onclick = e => { if (!armed) { armed = true; e.target.textContent = 'Click again to confirm'; setTimeout(() => { armed = false; e.target.textContent = 'Reset progress'; }, 3000); return; } armed = false; store.set('q', {}); e.target.textContent = 'Reset progress'; render(); };
window.addEventListener('hashchange', render);
applyTheme(); render();
