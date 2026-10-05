/* Concept figures for the Notes tabs. A <figure data-fig="name"> in content.js is filled in by NOTEFIGS[name]. */
const NOTEFIGS = (() => {
  const panel = (fig, title) => { const d = document.createElement('div'); d.className = 'fig-p'; d.innerHTML = `<span>${title}</span><canvas></canvas>`; fig.insertBefore(d, fig.querySelector('figcaption')); return d.querySelector('canvas'); };
  const text = (ch, x, y, s, col = '--ink', align = 'left') => { ch.c.fillStyle = css(col); ch.c.font = '500 11.5px ' + css('--body'); ch.c.textAlign = align; ch.c.fillText(s, ch.X(x), ch.Y(y)); };
  const seq = (a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
  const S = 250, H = 210;

  return {
    learnTypes(f) {
      const r = rng(11);
      let ch = chart(panel(f, 'Supervised regression'), { w: S, h: H, x: [0, 10], y: [0, 10], xl: 'predictor', yl: 'continuous target' });
      ch.dots(seq(0.5, 9.5, 34).map(x => [x, Math.max(0.3, Math.min(9.7, 1 + 0.8 * x + normal(r) * 1.1))])); ch.line([[0, 1], [10, 9]], '--mark', 2);
      ch = chart(panel(f, 'Supervised classification'), { w: S, h: H, x: [0, 10], y: [0, 10], xl: 'predictor 1', yl: 'predictor 2' });
      const a = [], b = []; for (let i = 0; i < 26; i++) { a.push([3 + normal(r) * 1.2, 6.8 + normal(r) * 1.2]); b.push([7 + normal(r) * 1.2, 3.2 + normal(r) * 1.2]); }
      ch.dots(a, '--accent'); ch.dots(b, '--bad'); ch.line([[1, 0.5], [9.5, 9.5]], '--mark', 2, [5, 4]); text(ch, 0.3, 3.9, 'class 1', '--accent'); text(ch, 9.8, 6.7, 'class 0', '--bad', 'right');
      ch = chart(panel(f, 'Unsupervised'), { w: S, h: H, x: [0, 10], y: [0, 10], xl: 'variable 1', yl: 'variable 2' });
      const u = []; [[2.5, 7.5], [7.5, 7], [5, 2.5]].forEach(([cx, cy]) => { for (let i = 0; i < 18; i++) u.push([cx + normal(r) * 0.9, cy + normal(r) * 0.9]); });
      ch.dots(u, '--muted');
    },
    featEng(f) {
      const r = rng(5), inn = [], out = [];
      for (let i = 0; i < 40; i++) { const t = r() * 6.283, d1 = r() * 1.6, d2 = 3 + r() * 1.3; inn.push([d1, t]); out.push([d2, t]); }
      let ch = chart(panel(f, 'Raw features x₁, x₂'), { w: 280, h: 230, x: [-5, 5], y: [-5, 5], xt: [-4, 0, 4], yt: [-4, 0, 4], xl: 'x₁', yl: 'x₂' });
      ch.dots(inn.map(([d, t]) => [d * Math.cos(t), d * Math.sin(t)]), '--accent'); ch.dots(out.map(([d, t]) => [d * Math.cos(t), d * Math.sin(t)]), '--bad');
      ch = chart(panel(f, 'Engineered: distance and direction'), { w: 280, h: 230, x: [0, 6.3], y: [0, 5], yt: [0, 2, 4], xl: 'direction (angle)', yl: 'distance from center' });
      ch.dots(inn.map(([d, t]) => [t, d]), '--accent'); ch.dots(out.map(([d, t]) => [t, d]), '--bad'); ch.line([[0, 2.3], [6.3, 2.3]], '--mark', 2, [5, 4]);
    },
    penalty(f) {
      const ch = chart(panel(f, 'How much one error costs'), { w: 420, h: 230, x: [-6, 6], y: [0, 36], xt: [-6, -3, 0, 3, 6], yt: [0, 12, 24, 36], xl: 'error (actual − predicted)', yl: 'contribution' });
      ch.line(seq(-6, 6).map(e => [e, Math.abs(e)]), '--accent', 2.2); ch.line(seq(-6, 6).map(e => [e, e * e]), '--bad', 2.2);
      text(ch, 0, 31, 'squared (MSE)', '--bad', 'center'); text(ch, 0, 26, 'absolute (MAE)', '--accent', 'center');
    },
    overfit(f) {
      const ch = chart(panel(f, 'Error as variables are added'), { w: 460, h: 240, x: [1, 30], y: [0, 100], xt: [1, 10, 20, 30], xl: 'number of variables in the model', yl: 'error (MSE)' });
      const tr = x => 22 + 68 * Math.exp(-x / 5), va = x => 30 + 62 * Math.exp(-x / 4.5) + 0.055 * (x - 2) ** 2;
      ch.line(seq(1, 30).map(x => [x, tr(x)]), '--accent', 2.2); ch.line(seq(1, 30).map(x => [x, va(x)]), '--bad', 2.2);
      let best = 1; seq(1, 30, 290).forEach(x => { if (va(x) < va(best)) best = x; });
      ch.line([[best, 0], [best, va(best)]], '--mark', 1.3, [4, 4]); ch.dots([[best, va(best)]], '--mark', 5);
      text(ch, 29.5, tr(30) - 9, 'training error keeps falling', '--accent', 'right'); text(ch, 29.5, va(30) + 6, 'validation error turns back up', '--bad', 'right'); text(ch, best + 0.6, 6, 'best size', '--mark');
    },
    residGallery(f) { [['good', 'Good: random scatter'], ['curve', 'Linearity fails: a curve'], ['fan', 'Constant variance fails: a fan'], ['cyc', 'Independence fails: a wave']].forEach(([k, t]) => drawFig(panel(f, t), k, 4, 270)); },
    qqGallery(f) { [['qqOk', 'Normal: on the line'], ['qqSkew', 'Skewed: one bow'], ['qqKurt', 'Kurtosis: an S']].forEach(([k, t]) => drawFig(panel(f, t), k, 4, 250)); },
    logFix(f) {
      const r = rng(21), raw = [], lg = [];
      for (let i = 0; i < 90; i++) { const x = 1 + i / 10, z = normal(r); raw.push([x, Math.max(-19, Math.min(19, z * x * 1.5))]); lg.push([x, z * 5]); }
      let ch = chart(panel(f, 'Before: target in dollars'), { w: 270, h: 220, x: [0, 10.5], y: [-20, 20], yt: [-20, 0, 20], xl: 'predicted value', yl: 'residual' }); ch.line([[0, 0], [10.5, 0]], '--muted', 1); ch.dots(raw);
      ch = chart(panel(f, 'After: log(target)'), { w: 270, h: 220, x: [0, 10.5], y: [-20, 20], yt: [-20, 0, 20], xl: 'predicted value', yl: 'residual' }); ch.line([[0, 0], [10.5, 0]], '--muted', 1); ch.dots(lg);
    },
    vifCurve(f) {
      const ch = chart(panel(f, 'VIF as the other predictors explain more of predictor j'), { w: 440, h: 230, x: [0, 1], y: [0, 30], xt: [0, 0.25, 0.5, 0.75, 0.9, 1], yt: [0, 10, 20, 30], xl: 'R² of predictor j on the other predictors', yl: 'VIF' });
      ch.line(seq(0, 0.9667, 120).map(x => [x, 1 / (1 - x)]), '--accent', 2.4); ch.line([[0, 10], [1, 10]], '--bad', 1.3, [5, 4]); ch.dots([[0.9, 10]], '--bad', 5); text(ch, 0.02, 11.5, 'too high above 10', '--bad');
    },
    chi2(f) {
      const g = { 1: 1.7725, 3: 0.8862, 6: 2 }, pdf = (x, k) => Math.pow(x, k / 2 - 1) * Math.exp(-x / 2) / (Math.pow(2, k / 2) * g[k]);
      const ch = chart(panel(f, 'χ² distributions'), { w: 420, h: 220, x: [0, 16], y: [0, 0.5], xt: [0, 4, 8, 12, 16], xl: 'χ² statistic', yl: 'density' });
      [[1, '--accent'], [3, '--mark'], [6, '--bad']].forEach(([k, c]) => ch.line(seq(0.12, 16, 160).map(x => [x, Math.min(0.5, pdf(x, k))]), c, 2.2));
      text(ch, 1.1, 0.42, 'df = 1', '--accent'); text(ch, 2.6, 0.22, 'df = 3', '--mark'); text(ch, 7.2, 0.12, 'df = 6', '--bad');
    },
    lpm(f) {
      const r = rng(8), pts = []; for (let i = 0; i < 70; i++) { const x = r() * 10, p = 1 / (1 + Math.exp(-(x - 5) * 1.3)); pts.push([x, (r() < p ? 1 : 0) + (r() - 0.5) * 0.06]); }
      const ch = chart(panel(f, 'A straight line vs. the logistic curve on 0/1 data'), { w: 460, h: 250, x: [0, 10], y: [-0.35, 1.35], xt: [0, 2, 4, 6, 8, 10], yt: [0, 0.5, 1], xl: 'predictor', yl: 'probability of the event' });
      ch.dots(pts, '--muted', 2.4); ch.line([[0, -0.3], [10, 1.3]], '--bad', 2); ch.line(seq(0, 10).map(x => [x, 1 / (1 + Math.exp(-(x - 5) * 1.3))]), '--accent', 2.6);
      text(ch, 8.6, 1.26, 'linear probability model: above 1', '--bad', 'right'); text(ch, 0.1, -0.27, 'below 0', '--bad'); text(ch, 6.6, 0.62, 'logistic: always 0 to 1', '--accent');
    },
    logitMap(f) {
      const ch = chart(panel(f, 'The logit stretches (0, 1) onto the whole number line'), { w: 420, h: 230, x: [0, 1], y: [-5, 5], xt: [0, 0.25, 0.5, 0.75, 1], yt: [-4, -2, 0, 2, 4], xl: 'probability p', yl: 'logit = log(p / (1 − p))' });
      ch.line(seq(0.007, 0.993, 140).map(p => [p, Math.log(p / (1 - p))]), '--accent', 2.4); ch.dots([[0.5, 0], [0.96, 3.18], [0.17, -1.59]], '--mark', 4.5);
      text(ch, 0.52, -0.9, 'p = 0.5 → 0', '--mark'); text(ch, 0.94, 3.5, 'p = 0.96 → 3.2', '--mark', 'right'); text(ch, 0.2, -2.2, 'p = 0.17 → −1.6', '--mark');
    },
    likelihood(f) {
      let ch = chart(panel(f, 'Normal data: a peak to find'), { w: 270, h: 220, x: [-2, 6], y: [-60, 0], xt: [-2, 0, 2, 4, 6], xl: 'candidate value of β', yl: 'log-likelihood' });
      ch.line(seq(-2, 6).map(b => [b, -8 - 3.2 * (b - 2) ** 2]), '--accent', 2.4); ch.dots([[2, -8]], '--mark', 5); text(ch, 2, -2.5, 'maximum = β̂', '--mark', 'center');
      ch = chart(panel(f, 'Separation: no peak, no convergence'), { w: 270, h: 220, x: [-2, 6], y: [-60, 0], xt: [-2, 0, 2, 4, 6], xl: 'candidate value of β', yl: 'log-likelihood' });
      ch.line(seq(-2, 6).map(b => [b, -55 * Math.exp(-(b + 2) / 2.2) - 1.5]), '--bad', 2.4); text(ch, 5.9, -30, 'keeps climbing as β → ∞', '--bad', 'right');
    },
    roc(f) {
      const ch = chart(panel(f, 'ROC curves'), { w: 340, h: 300, x: [0, 1], y: [0, 1], xt: [0, 0.5, 1], yt: [0, 0.5, 1], xl: 'false positive rate (1 − specificity)', yl: 'true positive rate (sensitivity)' });
      ch.line([[0, 0], [1, 1]], '--muted', 1.3, [5, 4]); ch.line(seq(0, 1, 120).map(x => [x, Math.pow(x, 1 / 2.2)]), '--mark', 2.2); ch.line(seq(0, 1, 160).map(x => [x, Math.pow(x, 1 / 8)]), '--accent', 2.6);
      text(ch, 0.97, 0.21, 'strong model, AUC ≈ 0.89', '--accent', 'right'); text(ch, 0.97, 0.13, 'weaker model, AUC ≈ 0.69', '--mark', 'right'); text(ch, 0.97, 0.05, 'random guessing, AUC = 0.50', '--muted', 'right');
    },
    calib(f) {
      const ch = chart(panel(f, 'Calibration curves'), { w: 340, h: 300, x: [0, 1], y: [0, 1], xt: [0, 0.5, 1], yt: [0, 0.5, 1], xl: 'predicted probability', yl: 'observed proportion of events' });
      ch.line([[0, 0], [1, 1]], '--muted', 1.3, [5, 4]); ch.line(seq(0, 1).map(x => [x, Math.pow(x, 0.55)]), '--accent', 2.3); ch.line(seq(0, 1).map(x => [x, Math.pow(x, 1.9)]), '--bad', 2.3);
      text(ch, 0.03, 0.94, 'above: predictions too low', '--accent'); text(ch, 0.97, 0.05, 'below: predictions too high', '--bad', 'right');
    },
    lift(f) {
      const gain = d => 1 - Math.pow(1 - d, 3.2);
      let ch = chart(panel(f, 'Lift chart'), { w: 270, h: 230, x: [0, 1], y: [0, 3.5], xt: [0, 0.5, 1], yt: [1, 2, 3], xl: 'depth (share of customers targeted)', yl: 'lift' });
      ch.line([[0, 1], [1, 1]], '--muted', 1.3, [5, 4]); ch.line(seq(0.03, 1).map(d => [d, gain(d) / d]), '--accent', 2.4); ch.dots([[0.1, gain(0.1) / 0.1]], '--mark', 5); text(ch, 0.14, 2.95, 'top 10%: about 2.9×', '--mark'); text(ch, 0.98, 0.68, 'random = 1', '--muted', 'right');
      ch = chart(panel(f, 'Cumulative capture (gain) chart'), { w: 270, h: 230, x: [0, 1], y: [0, 1], xt: [0, 0.5, 1], yt: [0, 0.5, 1], xl: 'depth', yl: 'share of all events captured' });
      ch.line([[0, 0], [1, 1]], '--muted', 1.3, [5, 4]); ch.line(seq(0, 1).map(d => [d, gain(d)]), '--accent', 2.4);
    },
    rare(f) {
      const bump = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
      const ch = chart(panel(f, 'Predicted probabilities when the event is rare'), { w: 460, h: 230, x: [0, 0.6], y: [0, 1.15], xt: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], xl: 'predicted probability', yl: 'share of observations' });
      ch.line(seq(0, 0.6, 150).map(x => [x, bump(x, 0.03, 0.025)]), '--muted', 2.2); ch.line(seq(0, 0.6, 150).map(x => [x, 0.55 * bump(x, 0.16, 0.06)]), '--accent', 2.2);
      ch.line([[0.5, 0], [0.5, 1.1]], '--bad', 1.4, [5, 4]); ch.line([[0.09, 0], [0.09, 1.1]], '--mark', 1.6);
      text(ch, 0.035, 1.05, 'non-events', '--muted'); text(ch, 0.2, 0.5, 'events', '--accent'); text(ch, 0.49, 0.9, 'cut-off 0.5: nothing flagged', '--bad', 'right'); text(ch, 0.1, 0.78, 'lower cut-off separates them', '--mark');
    },
  };
})();
