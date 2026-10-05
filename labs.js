/* Interactive labs, one per unit, plus the small figures used by questions. */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const fmt = (x, d = 2) => Number.isFinite(x) ? x.toFixed(d) : (x > 0 ? '∞' : x < 0 ? '−∞' : '–');

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function normal(r) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r()); }
function probit(p) {
  const q = p < 0.5 ? p : 1 - p, t = Math.sqrt(-2 * Math.log(q));
  const z = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
  return p < 0.5 ? -z : z;
}

/* Canvas with axes; returns helpers that map data to pixels. */
function chart(cv, o) {
  const W = o.w || 520, H = o.h || 300, d = window.devicePixelRatio || 1, m = { l: 44, r: 14, t: 12, b: 34 };
  cv.width = W * d; cv.height = H * d; cv.style.width = W + 'px'; cv.style.aspectRatio = W + '/' + H;
  const c = cv.getContext('2d'); c.scale(d, d); c.clearRect(0, 0, W, H);
  const X = x => m.l + (x - o.x[0]) / (o.x[1] - o.x[0]) * (W - m.l - m.r);
  const Y = y => H - m.b - (y - o.y[0]) / (o.y[1] - o.y[0]) * (H - m.t - m.b);
  c.font = '11px ' + css('--mono'); c.fillStyle = css('--muted'); c.strokeStyle = css('--line'); c.lineWidth = 1;
  (o.xt || []).forEach(v => { c.beginPath(); c.moveTo(X(v), Y(o.y[0])); c.lineTo(X(v), Y(o.y[1])); c.stroke(); c.textAlign = 'center'; c.fillText(v, X(v), H - m.b + 14); });
  (o.yt || []).forEach(v => { c.beginPath(); c.moveTo(X(o.x[0]), Y(v)); c.lineTo(X(o.x[1]), Y(v)); c.stroke(); c.textAlign = 'right'; c.fillText(v, m.l - 6, Y(v) + 4); });
  c.textAlign = 'center'; if (o.xl) c.fillText(o.xl, (m.l + W - m.r) / 2, H - 4);
  if (o.yl) { c.save(); c.translate(11, (m.t + H - m.b) / 2); c.rotate(-Math.PI / 2); c.fillText(o.yl, 0, 0); c.restore(); }
  return {
    c, X, Y,
    dots(pts, col = '--accent', r = 2.6) { c.fillStyle = css(col); pts.forEach(([x, y]) => { c.beginPath(); c.arc(X(x), Y(y), r, 0, 7); c.fill(); }); },
    line(pts, col = '--ink', w = 1.5, dash) { c.strokeStyle = css(col); c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))); c.stroke(); c.setLineDash([]); },
  };
}

/* ---- Residual and QQ figures ---- */
const FIG_INFO = {
  good: { a: 'None', say: 'Random scatter around zero with even spread. This is what you want.' },
  curve: { a: 'Linearity', say: 'A curve in the residuals means the model is misspecified (lack of fit). Fix: polynomial terms, a GAM, or another more flexible model.' },
  fan: { a: 'Constant variance', say: 'The spread grows with the predicted value: heteroscedasticity. Test: Breusch-Pagan. Fix: log the target, weighted least squares, or adjust the standard errors.' },
  cyc: { a: 'Independence', say: 'A repeating wave means neighbouring errors are correlated, typical of time series data. Test: Durbin-Watson.' },
  qqOk: { a: 'None', say: 'Points follow the diagonal, so the residuals look Normal.' },
  qqSkew: { a: 'Normality: skew', say: 'One bow, off the line in the same direction at both ends: skewed residuals. Test: Shapiro-Wilk or Anderson-Darling. Fix: transform the target (log).' },
  qqKurt: { a: 'Normality: kurtosis', say: 'An S shape, tails leaving in opposite directions: heavy tails, a kurtosis problem.' },
};
function drawFig(cv, kind, seed = 7, w = 420) {
  const r = rng(seed * 97 + kind.length * 13);
  if (kind.startsWith('qq')) {
    const n = 120; let v = [];
    for (let i = 0; i < n; i++) { const z = normal(r); v.push(kind === 'qqSkew' ? Math.exp(0.75 * z) : kind === 'qqKurt' ? z * Math.abs(z) : z); }
    const mu = v.reduce((a, b) => a + b) / n, sd = Math.sqrt(v.reduce((a, b) => a + (b - mu) ** 2, 0) / n);
    v = v.map(x => (x - mu) / sd).sort((a, b) => a - b);
    const pts = v.map((y, i) => [probit((i + 0.5) / n), Math.max(-4.4, Math.min(4.4, y))]);
    const ch = chart(cv, { w, h: 260, x: [-3, 3], y: [-4.5, 4.5], xt: [-2, 0, 2], yt: [-4, -2, 0, 2, 4], xl: 'Normal quantiles', yl: 'Residual quantiles' });
    ch.line([[-3, -3], [3, 3]], '--muted', 1.2); ch.dots(pts);
  } else {
    const n = 110, pts = [];
    for (let i = 0; i < n; i++) {
      const x = i / (n - 1) * 10, z = normal(r); let y = z * 4;
      if (kind === 'curve') y = 11 - 1.15 * (x - 5) ** 2 + z * 2.6;
      if (kind === 'fan') y = z * (0.6 + x * 1.15);
      if (kind === 'cyc') y = 9 * Math.sin(x * 1.9) + z * 2;
      pts.push([x, Math.max(-19.5, Math.min(19.5, y))]);
    }
    const ch = chart(cv, { w, h: 260, x: [0, 10], y: [-20, 20], yt: [-20, -10, 0, 10, 20], xl: kind === 'cyc' ? 'Time order' : 'Predicted value', yl: 'Residual' });
    ch.line([[0, 0], [10, 0]], '--muted', 1.2); ch.dots(pts);
  }
}

const LABS = {};

/* ---- 1. Sort the scenario ---- */
LABS.intro = el => {
  const items = [
    ['Predict next month\'s electricity bill in dollars from home size and weather.', 0], ['Flag card transactions as fraud or not fraud using past labeled cases.', 1],
    ['Group stores into similar types with no predefined categories.', 2], ['A robot vacuum improves its route by bumping into things and trying again.', 4],
    ['Classify a million photos when only 500 have been labeled by hand.', 3], ['Estimate the sale price of a house from its features.', 0],
    ['Predict whether a customer will churn (yes/no).', 1], ['Find natural segments in survey responses.', 2],
    ['A program learns chess by playing against itself and being rewarded for wins.', 4], ['Predict whether a home sells above $175,000.', 1],
  ];
  const labels = ['Supervised regression', 'Supervised classification', 'Unsupervised', 'Semi-supervised', 'Reinforcement'];
  const why = ['Known target, continuous.', 'Known target, categorical.', 'No target variable at all.', 'A little labeled data plus a lot of unlabeled data.', 'Learns from trial and error with its environment.'];
  let i = 0, score = 0, done = false;
  el.innerHTML = `<h2>Sort the scenario</h2><p>Decide what kind of learning each problem is. Ask two questions: is there a target, and if so, is it a number or a category?</p>
    <div class="verdict" id="sc-q"></div><div class="chips" id="sc-o"></div><p class="note" id="sc-f"></p><div class="row"><button class="btn alt" id="sc-n">Next scenario</button><span class="mono" id="sc-s"></span></div>`;
  const show = () => {
    done = false; $('#sc-q', el).textContent = items[i][0]; $('#sc-f', el).textContent = '';
    $('#sc-o', el).innerHTML = labels.map((l, k) => `<button class="chip" data-k="${k}">${l}</button>`).join('');
    $('#sc-s', el).textContent = `${score} correct · scenario ${i + 1} of ${items.length}`;
  };
  $('#sc-o', el).onclick = e => {
    const b = e.target.closest('.chip'); if (!b || done) return; done = true;
    const k = +b.dataset.k, a = items[i][1];
    if (k === a) { score++; b.classList.add('good'); } else { b.classList.add('bad'); $(`[data-k="${a}"]`, el).classList.add('good'); }
    $('#sc-f', el).textContent = `${labels[a]}. ${why[a]}`; $('#sc-s', el).textContent = `${score} correct · scenario ${i + 1} of ${items.length}`;
  };
  $('#sc-n', el).onclick = () => { i = (i + 1) % items.length; if (i === 0) score = 0; show(); };
  show();
};

/* ---- 2. Missing values + patient aggregation ---- */
LABS.data = el => {
  const P = {
    A: [150, 148, 145, 140, 136, 130, 128, 126, 124, 122, 121, 120],
    B: [120, 121, 122, 124, 126, 130, 136, 140, 145, 148, 150, 158],
    C: [150, 120, 155, 118, 160, 119, 152, 121, 158, 122, 150, 120],
  };
  const V = { A: [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], B: [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 2], C: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0] };
  el.innerHTML = `<h2>What should you do with this missing data?</h2>
    <div class="row"><div class="chips" id="mv-t"><button class="chip" aria-pressed="true" data-t="cat">Categorical variable</button><button class="chip" aria-pressed="false" data-t="con">Continuous variable</button></div>
    <label class="ctl">Share of values missing <output id="mv-o"></output><input type="range" id="mv-p" min="0" max="90" value="15"></label></div>
    <div class="verdict" id="mv-v"></div>
    <h2>Three patients, one phone call</h2>
    <p>The activity from the deck. Each line is a year of monthly blood pressure readings. You can contact only one patient. The table shows how each way of summarizing the year describes them.</p>
    <canvas id="pt-c"></canvas>
    <div class="tw"><table id="pt-t"></table></div>
    <p class="note">The means are within five points of each other, so center hides the story. Trend and recency single out patient B, who is getting worse. Variability singles out patient C, who swings every month. The way you summarize history decides what a model can learn.</p>`;
  let type = 'cat';
  const upd = () => {
    const p = +$('#mv-p', el).value; $('#mv-o', el).textContent = p + '%';
    const v = $('#mv-v', el);
    if (p === 0) { v.className = 'verdict'; v.textContent = 'Nothing is missing. No action needed.'; }
    else if (p > 50) { v.className = 'verdict bad'; v.innerHTML = '<b>Consider deleting the variable.</b> More than half of it is missing.'; }
    else if (type === 'cat') { v.className = 'verdict good'; v.innerHTML = '<b>Keep: add a "Missing" category.</b> It can be done before the train/test split, and the missingness may be predictive.'; }
    else { v.className = 'verdict warn'; v.innerHTML = '<b>Replace: impute with the median and add a missing-flag variable.</b> Compute the median after the train/test split, from training data only, and always keep the flag.'; }
  };
  $('#mv-t', el).onclick = e => { const b = e.target.closest('.chip'); if (!b) return; type = b.dataset.t; $$('#mv-t .chip', el).forEach(c => c.setAttribute('aria-pressed', c === b)); upd(); };
  $('#mv-p', el).oninput = upd; upd();
  const cols = { A: '--accent', B: '--bad', C: '--mark' };
  const ch = chart($('#pt-c', el), { w: 560, h: 260, x: [1, 12], y: [110, 165], xt: [1, 3, 5, 7, 9, 11], yt: [120, 140, 160], xl: 'Month', yl: 'Blood pressure' });
  Object.keys(P).forEach(k => { ch.line(P[k].map((y, i) => [i + 1, y]), cols[k], 2); ch.c.fillStyle = css(cols[k]); ch.c.font = '600 12px ' + css('--body'); ch.c.fillText(k, ch.X(12) - 4, ch.Y(P[k][11]) - 7); });
  const mean = a => a.reduce((x, y) => x + y) / a.length, sd = a => Math.sqrt(a.reduce((s, x) => s + (x - mean(a)) ** 2, 0) / (a.length - 1));
  const rows = [['Center: mean', k => fmt(mean(P[k]), 1)], ['Recency: December', k => P[k][11]], ['Trend: Dec − Jan', k => (P[k][11] - P[k][0] > 0 ? '+' : '') + (P[k][11] - P[k][0])],
    ['Variability: std. dev.', k => fmt(sd(P[k]), 1)], ['Extremes: maximum', k => Math.max(...P[k])], ['Frequency: visits', k => V[k].reduce((x, y) => x + y)]];
  $('#pt-t', el).innerHTML = '<tr><th>Feature</th><th class="n">Patient A</th><th class="n">Patient B</th><th class="n">Patient C</th></tr>' +
    rows.map(([n, f]) => `<tr><td>${n}</td>${['A', 'B', 'C'].map(k => `<td class="n">${f(k)}</td>`).join('')}</tr>`).join('');
};

/* ---- 3. Cross-validation folds + metric sandbox ---- */
LABS.build = el => {
  el.innerHTML = `<h2>k-fold cross-validation</h2>
    <p>Each row is one round. The amber block is held out for validation; the model is built on the rest. Every observation is used for validation exactly once.</p>
    <div class="row"><label class="ctl">Folds (k) <output id="cv-ko"></output><input type="range" id="cv-k" min="3" max="10" value="5"></label>
    <button class="btn" id="cv-n">Run next round</button></div>
    <div class="folds" id="cv-f"></div><div class="verdict" id="cv-v"></div>
    <h2>How one bad miss moves each metric</h2>
    <p>Four predictions miss by 2, −4, 1 and −3. Drag the fifth miss and watch MAE and RMSE separate.</p>
    <label class="ctl">Fifth error <output id="me-o"></output><input type="range" id="me-e" min="0" max="40" value="3"></label>
    <div class="stats" id="me-s"></div><p class="note" id="me-n"></p>`;
  let round = 0, mses = [];
  const draw = () => {
    const k = +$('#cv-k', el).value; $('#cv-ko', el).textContent = k;
    $('#cv-f', el).innerHTML = Array.from({ length: k }, (_, r) => `<div class="fold ${r < round ? 'cur' : ''}"><span style="width:62px">Round ${r + 1}</span>${Array.from({ length: k }, (_, c) => `<i class="${c === r ? 'v' : ''}"></i>`).join('')}<span style="width:74px;text-align:right">${r < round ? 'MSE ' + mses[r] : ''}</span></div>`).join('');
    const v = $('#cv-v', el);
    if (!round) v.textContent = `Train on ${k - 1} folds (${Math.round((k - 1) / k * 100)}% of the training data), validate on 1.`;
    else if (round < k) v.textContent = `Round ${round} done. ${k - round} to go.`;
    else v.innerHTML = `<b>CV estimate = average of the ${k} validation MSEs = ${fmt(mses.reduce((a, b) => a + b) / k, 1)}.</b> Selection compares this average between candidate models.`;
    $('#cv-n', el).textContent = round >= k ? 'Start over' : 'Run next round';
  };
  $('#cv-k', el).oninput = () => { round = 0; mses = []; draw(); };
  $('#cv-n', el).onclick = () => { const k = +$('#cv-k', el).value; if (round >= k) { round = 0; mses = []; } else { mses.push(Math.round(480 + Math.sin(round * 2.3 + k) * 70)); round++; } draw(); };
  draw();
  const met = () => {
    const e = +$('#me-e', el).value, errs = [2, -4, 1, -3, e]; $('#me-o', el).textContent = e;
    const mae = errs.reduce((s, x) => s + Math.abs(x), 0) / 5, mse = errs.reduce((s, x) => s + x * x, 0) / 5;
    $('#me-s', el).innerHTML = `<div><span>MAE</span><strong>${fmt(mae)}</strong></div><div><span>MSE</span><strong>${fmt(mse)}</strong></div><div><span>RMSE</span><strong>${fmt(Math.sqrt(mse))}</strong></div><div><span>RMSE ÷ MAE</span><strong>${fmt(Math.sqrt(mse) / mae)}</strong></div>`;
    $('#me-n', el).textContent = e > 12 ? 'The single large miss now dominates MSE and RMSE. That is what "overweights larger errors" means.' : 'With similar-sized errors, MAE and RMSE stay close.';
  };
  $('#me-e', el).oninput = met; met();
};

/* ---- 4. Diagnose the plot + VIF ---- */
LABS.diag = el => {
  const kinds = ['curve', 'fan', 'good', 'qqSkew', 'cyc', 'qqKurt', 'qqOk'], opts = ['None', 'Linearity', 'Constant variance', 'Independence', 'Normality: skew', 'Normality: kurtosis'];
  let i = 0, seed = 3, done = false, score = 0, seen = 0;
  el.innerHTML = `<h2>Diagnose the plot</h2><p>Which assumption does this plot call into question?</p>
    <canvas id="dg-c"></canvas><div class="chips" id="dg-o"></div><div class="verdict" id="dg-v" hidden></div>
    <div class="row"><button class="btn alt" id="dg-n">New plot</button><span class="mono" id="dg-s"></span></div>
    <h2>Variance inflation factor</h2>
    <p>R²ⱼ is how well the <em>other predictors</em> explain predictor j. The target is not involved.</p>
    <label class="ctl">R² of predictor j on the other predictors <output id="vf-o"></output><input type="range" id="vf-r" min="0" max="99" value="50"></label>
    <div class="stats" id="vf-s"></div><div class="verdict" id="vf-v"></div>`;
  const show = () => {
    done = false; drawFig($('#dg-c', el), kinds[i], seed, 460); $('#dg-v', el).hidden = true;
    $('#dg-o', el).innerHTML = opts.map(o => `<button class="chip">${o}</button>`).join('');
    $('#dg-s', el).textContent = seen ? `${score} of ${seen} correct` : '';
  };
  $('#dg-o', el).onclick = e => {
    const b = e.target.closest('.chip'); if (!b || done) return; done = true; seen++;
    const info = FIG_INFO[kinds[i]], ok = b.textContent === info.a; if (ok) score++;
    b.classList.add(ok ? 'good' : 'bad'); if (!ok) $$('#dg-o .chip', el).find(c => c.textContent === info.a).classList.add('good');
    const v = $('#dg-v', el); v.hidden = false; v.className = 'verdict ' + (ok ? 'good' : 'bad'); v.innerHTML = `<b>${info.a}.</b> ${info.say}`;
    $('#dg-s', el).textContent = `${score} of ${seen} correct`;
  };
  $('#dg-n', el).onclick = () => { i = (i + 1) % kinds.length; seed++; show(); };
  show();
  const vif = () => {
    const r = +$('#vf-r', el).value / 100, v = 1 / (1 - r); $('#vf-o', el).textContent = r.toFixed(2);
    $('#vf-s', el).innerHTML = `<div><span>Tolerance</span><strong>${fmt(1 - r)}</strong></div><div><span>VIF</span><strong>${fmt(v, 1)}</strong></div><div><span>Std. error inflated</span><strong>×${fmt(Math.sqrt(v), 1)}</strong></div>`;
    const b = $('#vf-v', el); b.className = 'verdict ' + (v > 10 ? 'bad' : 'good');
    b.textContent = v > 10 ? 'VIF is above 10: too much multicollinearity. Drop a correlated variable, avoid inference on this coefficient, or use biased regression.' : 'VIF is at or below 10: not typically a concern. It crosses 10 once R² passes 0.90.';
  };
  $('#vf-r', el).oninput = vif; vif();
};

/* ---- 5. Logistic curve + 2x2 table ---- */
LABS.logit = el => {
  el.innerHTML = `<h2>The logistic curve</h2>
    <p>Move the coefficients and the value of x. The logit is a straight line in x; the probability is the S curve.</p>
    <div class="row"><label class="ctl">Intercept β₀ <output id="lg-b0o"></output><input type="range" id="lg-b0" min="-8" max="8" step="0.1" value="-3"></label>
    <label class="ctl">Slope β₁ <output id="lg-b1o"></output><input type="range" id="lg-b1" min="-2" max="2" step="0.05" value="0.6"></label>
    <label class="ctl">x <output id="lg-xo"></output><input type="range" id="lg-x" min="0" max="10" step="0.1" value="5"></label></div>
    <canvas id="lg-c"></canvas><div class="stats" id="lg-s"></div><p class="note" id="lg-n"></p>
    <h2>Odds ratio and χ² from a 2 × 2 table</h2>
    <p>Starts with the central air table from the deck. Edit any cell. Put a 0 in one cell to see quasi-complete separation, or zeros on a diagonal for complete separation.</p>
    <div class="tw"><table><tr><th></th><th class="n">Target = 0</th><th class="n">Target = 1</th><th class="n">P(1)</th><th class="n">Odds of 1</th></tr>
    <tr><td>Group A (central air)</td><td class="n"><input type="number" id="t-a0" min="0" value="563" style="width:84px"></td><td class="n"><input type="number" id="t-a1" min="0" value="470" style="width:84px"></td><td class="n" id="t-pa"></td><td class="n" id="t-oa"></td></tr>
    <tr><td>Group B (no central air)</td><td class="n"><input type="number" id="t-b0" min="0" value="60" style="width:84px"></td><td class="n"><input type="number" id="t-b1" min="0" value="2" style="width:84px"></td><td class="n" id="t-pb"></td><td class="n" id="t-ob"></td></tr></table></div>
    <div class="stats" id="t-s"></div><div class="verdict" id="t-v"></div>`;
  const lg = () => {
    const b0 = +$('#lg-b0', el).value, b1 = +$('#lg-b1', el).value, x = +$('#lg-x', el).value;
    $('#lg-b0o', el).textContent = fmt(b0, 1); $('#lg-b1o', el).textContent = fmt(b1); $('#lg-xo', el).textContent = fmt(x, 1);
    const P = t => 1 / (1 + Math.exp(-(b0 + b1 * t))), p = P(x), z = b0 + b1 * x;
    const ch = chart($('#lg-c', el), { w: 560, h: 260, x: [0, 10], y: [0, 1], xt: [0, 2, 4, 6, 8, 10], yt: [0, 0.25, 0.5, 0.75, 1], xl: 'x', yl: 'Predicted probability' });
    ch.line(Array.from({ length: 101 }, (_, i) => [i / 10, P(i / 10)]), '--accent', 2.5);
    ch.line([[x, 0], [x, p], [0, p]], '--mark', 1.2, [4, 4]); ch.dots([[x, p]], '--mark', 5);
    $('#lg-s', el).innerHTML = `<div><span>Logit (log-odds)</span><strong>${fmt(z)}</strong></div><div><span>Odds</span><strong>${fmt(Math.exp(z))}</strong></div><div><span>Probability</span><strong>${fmt(p, 3)}</strong></div><div><span>Odds ratio e^β₁</span><strong>${fmt(Math.exp(b1))}</strong></div>`;
    const pct = 100 * (Math.exp(b1) - 1);
    $('#lg-n', el).textContent = b1 === 0 ? 'β₁ = 0: x has no effect; the odds ratio is 1.' :
      `Each one-unit increase in x multiplies the odds by ${fmt(Math.exp(b1))} (${pct > 0 ? '+' : ''}${fmt(pct, 1)}% odds). ` + (b1 > 0 ? `The odds double every ${fmt(Math.log(2) / b1)} units of x. ` : '') + `The change in probability is not constant: from x = ${fmt(x, 1)} to ${fmt(x + 1, 1)} it moves by ${fmt(P(x + 1) - p, 3)}.`;
  };
  ['b0', 'b1', 'x'].forEach(k => $('#lg-' + k, el).oninput = lg); lg();
  const erfc = x => { const t = 1 / (1 + 0.3275911 * x); return ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); };
  const tb = () => {
    const [a0, a1, b0, b1] = ['a0', 'a1', 'b0', 'b1'].map(k => Math.max(0, +$('#t-' + k, el).value || 0));
    const na = a0 + a1, nb = b0 + b1, n = na + nb, oa = a1 / a0, ob = b1 / b0;
    $('#t-pa', el).textContent = fmt(a1 / na, 3); $('#t-pb', el).textContent = fmt(b1 / nb, 3); $('#t-oa', el).textContent = fmt(oa); $('#t-ob', el).textContent = fmt(ob, 3);
    const obs = [a0, a1, b0, b1], exp = [na * (a0 + b0) / n, na * (a1 + b1) / n, nb * (a0 + b0) / n, nb * (a1 + b1) / n];
    const chi = obs.reduce((s, o, i) => s + (o - exp[i]) ** 2 / exp[i], 0), p = erfc(Math.sqrt(chi / 2)), or = oa / ob;
    const zeros = obs.filter(v => v === 0).length, complete = (a0 === 0 && b1 === 0) || (a1 === 0 && b0 === 0);
    $('#t-s', el).innerHTML = `<div><span>Odds ratio A vs. B</span><strong>${zeros ? (Number.isFinite(or) ? fmt(or) : '∞') : fmt(or)}</strong></div><div><span>Expected B, target 1</span><strong>${fmt(exp[3])}</strong></div><div><span>Pearson χ² (df 1)</span><strong>${fmt(chi, 1)}</strong></div><div><span>p-value</span><strong>${p < 0.0001 ? '<0.0001' : fmt(p, 4)}</strong></div>`;
    const v = $('#t-v', el);
    if (complete) { v.className = 'verdict bad'; v.innerHTML = '<b>Complete separation.</b> The group perfectly predicts every outcome. Both logits are infinite and maximum likelihood cannot converge.'; }
    else if (zeros) { v.className = 'verdict bad'; v.innerHTML = '<b>Quasi-complete separation.</b> A zero cell: the outcome is perfectly predicted for one group. The odds ratio is 0 or infinite. Collapse categories or use penalized likelihood.'; }
    else { v.className = 'verdict'; v.innerHTML = `Group A has <b>${fmt(or)} times the odds</b> of the event compared with group B. ${p < 0.009 ? 'The χ² p-value is below 0.009, so there is evidence of an association.' : 'The χ² p-value is not below 0.009: no evidence of association at that level.'}`; }
  };
  ['a0', 'a1', 'b0', 'b1'].forEach(k => $('#t-' + k, el).oninput = tb); tb();
};

/* ---- 6. Selection race ---- */
LABS.subset = el => {
  const vars = ['Size', 'Rooms', 'Baths', 'Paint'];
  /* Toy validation error: Size overlaps heavily with Rooms + Baths together; Paint is noise; each variable costs a little. */
  const err = S => {
    const h = v => S.includes(v);
    let g = 0;
    if (h('Rooms') && h('Baths')) g = h('Size') ? 56 : 55; else if (h('Size')) g = (h('Rooms') || h('Baths')) ? 48 : 40; else if (h('Rooms') || h('Baths')) g = 25;
    if (h('Paint')) g += 1;
    return 100 - g + 3 * S.length;
  };
  const name = S => S.length ? '{' + vars.filter(v => S.includes(v)).join(', ') + '}' : '{intercept only}';
  const run = mode => {
    let S = mode === 'backward' ? [...vars] : [], log = [`start   ${name(S).padEnd(30)} CV error ${err(S)}`];
    for (let step = 0; step < 12; step++) {
      const moves = [];
      if (mode !== 'backward') vars.filter(v => !S.includes(v)).forEach(v => moves.push(['add ' + v, [...S, v]]));
      if (mode !== 'forward') S.forEach(v => moves.push(['drop ' + v, S.filter(x => x !== v)]));
      const best = moves.map(m => [...m, err(m[1])]).sort((a, b) => a[2] - b[2])[0];
      if (!best || best[2] >= err(S)) { log.push(`stop    no single move beats ${err(S)}`); break; }
      S = best[1]; log.push(`${best[0].padEnd(7)} ${name(S).padEnd(30)} CV error ${best[2]}`);
    }
    return { S, log };
  };
  el.innerHTML = `<h2>Three searches, one dataset</h2>
    <p>A toy problem with four candidate predictors of home price. Size carries much of the same information as Rooms and Baths together, and Paint is noise. Each search greedily takes the single move that lowers the cross-validated error most.</p>
    <div class="chips" id="ss-m"><button class="chip" aria-pressed="true" data-m="forward">Forward</button><button class="chip" aria-pressed="false" data-m="backward">Backward</button><button class="chip" aria-pressed="false" data-m="stepwise">Stepwise</button></div>
    <pre class="log" id="ss-l"></pre>
    <div class="tw"><table id="ss-t"></table></div>
    <p class="note">Forward grabs Size first because it is the best single variable, then can never let it go. Backward and stepwise can remove it once Rooms and Baths are both in. Same data, same metric, different final models: never accept the output of one automatic search blindly.</p>`;
  const show = m => {
    $$('#ss-m .chip', el).forEach(c => c.setAttribute('aria-pressed', c.dataset.m === m));
    $('#ss-l', el).textContent = run(m).log.join('\n');
  };
  $('#ss-m', el).onclick = e => { const b = e.target.closest('.chip'); if (b) show(b.dataset.m); };
  $('#ss-t', el).innerHTML = '<tr><th>Method</th><th>Final model</th><th class="n">CV error</th></tr>' + ['forward', 'backward', 'stepwise'].map(m => { const r = run(m); return `<tr><td>${m[0].toUpperCase() + m.slice(1)}</td><td>${name(r.S)}</td><td class="n">${err(r.S)}</td></tr>`; }).join('');
  show('forward');
};

/* ---- 7. Cut-off explorer ---- */
LABS.assess = el => {
  const D = [['A', 1, .7], ['B', 1, .8], ['C', 0, .2], ['D', 1, .5], ['E', 0, .5], ['F', 1, .6], ['G', 1, .4], ['H', 0, .1], ['I', 0, .3], ['J', 0, .5]];
  const at = c => { let tp = 0, fp = 0, tn = 0, fn = 0; D.forEach(([, y, p]) => { const h = p >= c - 1e-9 ? 1 : 0; if (y && h) tp++; else if (y) fn++; else if (h) fp++; else tn++; }); return { tp, fp, tn, fn, sens: tp / (tp + fn), spec: tn / (tn + fp), prec: tp / (tp + fp) }; };
  let con = 0, dis = 0, tie = 0;
  D.filter(d => d[1]).forEach(a => D.filter(d => !d[1]).forEach(b => a[2] > b[2] ? con++ : a[2] < b[2] ? dis++ : tie++));
  const c = (con + tie / 2) / (con + dis + tie);
  el.innerHTML = `<h2>Move the cut-off</h2>
    <p>These are the ten observations from the practice midterm. An observation is classified as 1 when its predicted probability is at or above the cut-off, which matches the table on the exam (0.5 is classified as 1).</p>
    <label class="ctl">Cut-off <output id="as-o"></output><input type="range" id="as-c" min="0.05" max="0.95" step="0.05" value="0.5"></label>
    <div class="row" style="align-items:flex-start">
      <div class="cm" id="as-m" style="flex:1 1 280px"></div>
      <div style="flex:1 1 280px"><canvas id="as-r"></canvas></div>
    </div>
    <div class="chips" id="as-d"></div>
    <div class="stats" id="as-s"></div><p class="note" id="as-n"></p>
    <h2>Concordance on the same ten</h2>
    <p>Five 1s and five 0s make 25 pairs. Compare each 1 with each 0.</p>
    <div class="stats"><div><span>Concordant</span><strong>${con}</strong></div><div><span>Discordant</span><strong>${dis}</strong></div><div><span>Tied</span><strong>${tie}</strong></div><div><span>c = (C + ½T) / pairs</span><strong>${fmt(c, 2)}</strong></div><div><span>Somers' D = 2c − 1</span><strong>${fmt(2 * c - 1, 2)}</strong></div></div>
    <p class="note">The model ranked the 1 above the 0 in ${con} of 25 pairs (${Math.round(con / 25 * 100)}%). The ${dis} discordant pairs are G (a 1 scored 0.4) against E and J (0s scored 0.5). The ${tie} ties are D against E and J, all at 0.5. The c-statistic is equivalent to the area under the ROC curve.</p>`;
  const upd = () => {
    const cut = +$('#as-c', el).value, m = at(cut); $('#as-o', el).textContent = cut.toFixed(2);
    $('#as-m', el).innerHTML = `<div></div><div class="h">Predicted 0</div><div class="h">Predicted 1</div><div class="h">Actual 0</div><div class="c ok"><strong>${m.tn}</strong>TN</div><div class="c no"><strong>${m.fp}</strong>FP</div><div class="h">Actual 1</div><div class="c no"><strong>${m.fn}</strong>FN</div><div class="c ok"><strong>${m.tp}</strong>TP</div>`;
    $('#as-d', el).innerHTML = [...D].sort((a, b) => b[2] - a[2]).map(([n, y, p]) => { const h = p >= cut - 1e-9 ? 1 : 0; return `<span class="chip ${h === y ? 'good' : 'bad'}" style="cursor:default">${n} · y=${y} · ${p.toFixed(1)} → ${h}</span>`; }).join('');
    const f1 = 2 * m.prec * m.sens / (m.prec + m.sens), acc = (m.tp + m.tn) / 10;
    $('#as-s', el).innerHTML = [['Sensitivity', m.sens], ['Specificity', m.spec], ['Precision', m.prec], ['Accuracy', acc], ['Youden J', m.sens + m.spec - 1], ['F₁', f1]].map(([k, v]) => `<div><span>${k}</span><strong>${Number.isFinite(v) ? fmt(v) : '–'}</strong></div>`).join('');
    $('#as-n', el).textContent = cut < 0.35 ? 'A low cut-off catches every 1 (high sensitivity) but flags many 0s (low specificity).' : cut > 0.65 ? 'A high cut-off clears every 0 (high specificity) but misses many 1s (low sensitivity).' : 'Sensitivity and specificity trade off. Slide the cut-off to find where Youden\'s J and F₁ each peak; they need not peak at the same place.';
    const ch = chart($('#as-r', el), { w: 300, h: 260, x: [0, 1], y: [0, 1], xt: [0, 0.5, 1], yt: [0, 0.5, 1], xl: 'False positive rate (1 − specificity)', yl: 'Sensitivity' });
    ch.line([[0, 0], [1, 1]], '--muted', 1, [4, 4]);
    const roc = [[0, 0]]; for (let t = 0.95; t > 0.01; t -= 0.05) { const r = at(+t.toFixed(2)); roc.push([1 - r.spec, r.sens]); } roc.push([1, 1]);
    ch.line(roc, '--accent', 2.2); ch.dots([[1 - m.spec, m.sens]], '--mark', 6);
  };
  $('#as-c', el).oninput = upd; upd();
};
