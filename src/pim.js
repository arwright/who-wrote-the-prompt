// pim.js: Pim, the machine-creature for "Who Wrote the Prompt". Painted with the same tools and rules as Clawd, but a
// different body: a mint pill, two round eyes with dot pupils, two legs with round feet, stubby arms and an antenna
// with an amber bulb that lights (glow()) when Pim "decides" something. (x, y) is the ground point between the feet.
//
// Body-local coordinates in the front view (so the kit's mouths, blush, hats and emotes line up):
//   body x -4u..4u, y -8u..-2u (corner radius 2.6u); eyes at (±2.3u, -6u); mouth near (0, -4.3u); legs reach y 0;
//   antenna from (0, -8u) to the bulb at (0, -10.1u). Pim is 8u wide and 10u tall with the antenna.
// Options are Clawd's (pose, view, face, colour, extras, boilKey) plus:
//   bulb 0..1  the antenna light.   horns 0..1  little red horns (pop in).   antSway  antenna lean in u (default: a slow wobble)
// Use pimFeel()/pimEmotions() instead of feel()/emotions() so the mood tints start from Pim's mint, not Clawd's clay.

const PIM = { col: '#8ED3BE', dk: '#4FA58F', lt: '#CDEFE3', bulb: '#FFB347', bulbOff: '#D8D0C2', horn: '#E0523F' };
const PIM_VIEWS = {
  front: { L: -4, R: 4, face: { cx: 0, fw: 1, sides: [-1, 1], mx: 0, bx: 2.9 }, hat: 0, hw: 1,
           legs: [[-1.8, 0], [1.8, 0]], arms: [[-3.9, -1, 'L', 0], [3.9, 1, 'R', 0]] },
  q:     { L: -4, R: 4.1, strip: [-4, -1.8], seam: -1.8, face: { cx: 1.2, fw: .75, sides: [-1, 1], mx: .25, bx: 2.9 }, hat: .5, hw: 1,
           legs: [[-2.2, 1], [1.4, 0]], arms: [[4, 1, 'R', 2], [-3.7, -1, 'L', 1]] },
  side:  { L: -2.6, R: 2.6, face: { cx: 1.1, fw: .55, sides: [1], mx: 1.5, bx: .9 }, hat: .25, hw: .66,
           legs: [[-.9, 1], [.5, 0]], arms: [[1.3, 0, 'L', 1]] },
  qback: { L: -4.1, R: 4, strip: [1.8, 4], seam: 1.8, face: null, hat: -.4, hw: 1, panel: [-3.2, 1.2],
           legs: [[2.2, 1], [-1.4, 0]], arms: [[-4, -1, 'R', 2], [3.7, 1, 'L', 1]] },
  back:  { L: -4, R: 4, face: null, hat: 0, hw: 1, back: true, panel: [-1.6, 1.6],
           legs: [[-1.8, 0], [1.8, 0]], arms: [[-3.9, -1, 'R', 0], [3.9, 1, 'L', 0]] },
};
let PIM_N = 0;

function pimFeel(name, t, over = {}) { return feel(name, t, { col: PIM.col, dk: PIM.dk, lt: PIM.lt, ...over }); }
function pimEmotions(t, keys, o = {}) {
  return emotions(t, keys.map(k => [k[0], k[1], { col: PIM.col, dk: PIM.dk, lt: PIM.lt, ...(k[2] || {}) }]), o);
}

function pim(x, y, u, o = {}) {
  // Horns never make Pim gleeful: whenever they're on, the face is suspicious (narrow eyes, flat mouth, no gloom),
  // whatever mood the body is in. Pass hornsFace: false to opt out.
  if ((o.horns || 0) > .3 && o.hornsFace !== false) o = { ...o, eyes: Array.isArray(o.eyes) ? o.eyes : 'narrow', mouth: 'flat', gloom: 0, blush: 0 };
  const id = o.boilKey ?? ++PIM_N, rs = part => boilSeed(`pim ${id} ${part}`);
  x += (o.dx || 0) * u;
  const V = PIM_VIEWS[o.view] || PIM_VIEWS.front;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sm = clamp(o.smear || 0);
  const sw = clamp(u / 15, .45, 2.4) * (o.swMul || 1), J = u * .06;
  const { col, dk, lt } = tintCols({ col: PIM.col, dk: PIM.dk, lt: PIM.lt, ...o }), far = mixCol(dk, PAL.ink, .25);

  rs('shadow');
  if (!o.noShadow) {
    const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .06), w = (V.R - V.L) / 8;
    paint(ellPts(x, y + u * .15, u * 4.4 * f * w, u * .9 * f, 22), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null });
  }
  if (sm > .05) smearTrail(x, y + dy, u, { R: V.R + .8 }, sm, o.smearDir ?? (o.flip ? -1 : 1), col);

  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .6) * (1 + sm * .35), (o.sy ?? 1) * (1 - sq));

  const arm = ([px, dir, which, layer]) => {
    rs('arm' + which);
    const a = which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2), hook = which === 'L' ? o.armL : o.armR;
    const style = { wash: layer === 2 ? mixCol(col, dk, .4) : col, washOp: 255, fill: dk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 };
    push(); translate((px + dir * .5 * clamp((Math.abs(a) - .7) / .9)) * u, -4.6 * u);
    if (dir === 0) {   // side view: the near arm reaches forward; a raises it
      translate(0, .3 * u); rotate(.7 - a);
      paint(rrPts(-.2 * u, -.42 * u, 2 * u, .84 * u, .4 * u, J * .5), style);
      if (hook) { translate(1.8 * u, 0); hook(u, sw); }
    } else {
      rotate(dir < 0 ? a : -a);
      paint(rrPts(dir < 0 ? -1.9 * u : 0, -.45 * u, 1.9 * u, .9 * u, .42 * u, J * .5), style);
      if (hook) { translate(dir * 1.9 * u, 0); if (dir < 0) scale(-1, 1); hook(u, sw); }
    }
    pop();
  };

  // arms behind, legs, body, arms in front
  V.arms.filter(a => a[3] !== 1).forEach(arm);
  if (!o.noLegs) V.legs.forEach(([lx, isFar], i) => {
    rs('leg' + i);
    let h = 2.3, sx = 0;
    if (o.walk != null) {
      if (o.view === 'side') { const ph = (o.walk + (i ? .5 : 0)) * TAU; sx = Math.sin(ph) * .6; h = 2.3 - Math.max(0, Math.cos(ph)) * .9; }
      else { const ph = Math.sin((o.walk + (i % 2 ? .5 : 0)) * TAU); if (ph > 0) h = 2.3 - ph * .9; }
    }
    const c = isFar ? far : dk;
    paint(rrPts((lx + sx - .5) * u, -2.5 * u, u, h * u, .3 * u, J * .5), { wash: c, washOp: 255, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts((lx + sx + .1) * u, (-2.5 + h) * u - .1 * u, .95 * u, .45 * u, 14, J * .4), { wash: c, washOp: 255, ink: PAL.ink, sw: sw * .8 });
  });

  rs('body');
  const L = V.L * u, R = V.R * u, r = Math.min(2.6 * u, (R - L) / 2 - .01);
  const body = rrPts(L, -8 * u, R - L, 6 * u, r, J);
  paint(body, { wash: col, washOp: 255, ink: null });
  const hx = V.strip ? (V.strip[0] < 0 ? (V.seam * u + R) / 2 : (L + V.seam * u) / 2) : (L + R) / 2 - .8 * u;
  paint(ellPts(hx, -6.6 * u, Math.min(2.4 * u, (R - L) * .3), 1.1 * u, 18, J * 2, -.1), { fill: lt, fillOp: V.back ? 80 : 130, bleed: .2, tex: .85, border: .8, ink: null });
  paint(ellPts((L + R) / 2, -3.3 * u, (R - L) / 2 - 1 * u, .95 * u, 20, J), { fill: dk, fillOp: 110, bleed: .05, tex: .7, border: .5, ink: null });
  if (V.strip) {
    paint(pimHalf(V.strip, V.seam, u, r, J), { fill: dk, fillOp: 150, bleed: .04, tex: .6, border: .4, ink: null });
    inkLine([[V.seam * u + jit(J), -7.5 * u], [V.seam * u + jit(J), -5 * u], [V.seam * u + jit(J), -2.5 * u]], sw * .55, PAL.ink, 'inkfine', 0);
  }
  if (V.panel) {   // a little service hatch on the back, so the back views read as a machine
    const [p0, p1] = V.panel;
    paint(rrPts(p0 * u, -6.4 * u, (p1 - p0) * u, 2.4 * u, .35 * u, J * .5), { fill: dk, fillOp: 90, bleed: .05, tex: .6, border: .5, ink: PAL.ink, sw: sw * .5 });
    for (const px of [p0 + .45, p1 - .45]) paint(ellPts(px * u, -4.4 * u, .18 * u, .18 * u, 8), { wash: PAL.ink, ink: null });
  }
  paint(body, { ink: PAL.ink, sw });
  if (o.gloom > .02) gloom(u, sw, { L: V.L, R: V.R }, o.gloom);
  if (V.face) {
    const F = V.face;
    push(); translate(F.cx * u, 0); scale(F.fw, 1);
    if (o.blush) blush(u, sw, F, o.blush === true ? 1 : o.blush);
    rs('eyes'); pimEyes(u, o, sw, F.sides, sm); rs('mouth');
    push(); translate(F.mx * u, 0); mouth(u, o.lid > .1 ? 'teeth' : o.mouth, sw); pop();
    if (['cat', 'masq', 'bowtie'].includes(o.hat)) faceHat(u, o.hat, sw, F.sides);
    pop();
  }
  if (o.horns > .01) {
    rs('horns');
    for (const s of [-1, 1]) {
      const k = backOut(clamp(o.horns));
      push(); translate((V.hat + s * 2.2 * V.hw) * u, -7.6 * u); scale(k, k);
      paint([[s * -.7 * u, 0], [s * .9 * u, -2.2 * u], [s * 1.4 * u, -1.6 * u], [s * .9 * u, .2 * u]], { wash: PIM.horn, fill: '#A8322A', fillOp: 70, ink: PAL.ink, sw: sw * .7, curv: .3 });
      pop();
    }
  }
  rs('antenna');
  const ax = V.hat * u, sway = (o.antSway ?? Math.sin(T * 2.1 + id) * .12) * u, b = clamp(o.bulb ?? 0);
  inkLine([[ax, -7.9 * u], [ax + sway * .5, -8.9 * u], [ax + sway, -9.6 * u]], sw * .9, PAL.ink, 'ink', .5);
  if (b > .02) glow(ax + sway, -10.1 * u, 2.6 * u * (.8 + .2 * b), PIM.bulb, b);
  paint(ellPts(ax + sway, -10.1 * u, .72 * u, .72 * u, 14, J * .3), { wash: mixCol(PIM.bulbOff, '#FFD27A', b), washOp: 255, ink: PAL.ink, sw: sw * .7 });
  if (b > .3 && u > 9) paint(ellPts(ax + sway - .22 * u, -10.35 * u, .2 * u, .16 * u, 8), { wash: PAL.cream, washOp: 220 * b, ink: null });
  rs('hat'); push(); translate(V.hat * u, 0); scale(V.hw, 1); hat(u, o.hat, sw); pop();
  V.arms.filter(a => a[3] === 1).forEach(arm);
  rs('draw'); if (o.draw) o.draw(u, sw);
  pop();

  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    const ex = top ? x + dir * V.hat * u : x + dir * (V.R + .5) * u, ey = y + dy + (top ? -12.4 : -8.8) * u * (1 - sq);
    emote(o.emote, ex, ey, u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// The darker side face of the pill in the 3/4 views: the outer half of the body up to the seam, as one shape.
function pimHalf(strip, seam, u, r, J) {
  const [a, b] = strip, left = a < 0, top = -8 * u, bot = -2 * u, X = (left ? a : b) * u, sx = seam * u, cx = left ? X + r : X - r, n = 7, pts = [[sx, top]];
  for (let i = 0; i <= n; i++) { const ang = -Math.PI / 2 + (left ? -1 : 1) * (i / n) * Math.PI / 2; pts.push([cx + Math.cos(ang) * r + jit(J * .4), top + r + Math.sin(ang) * r + jit(J * .4)]); }
  for (let i = 0; i <= n; i++) { const ang = left ? Math.PI - (i / n) * Math.PI / 2 : (i / n) * Math.PI / 2; pts.push([cx + Math.cos(ang) * r + jit(J * .4), bot - r + Math.sin(ang) * r + jit(J * .4)]); }
  pts.push([sx, bot]);
  return pts;
}

// Round eyes with dot pupils for the plain kinds; every other kind (happy, closed, narrow, swirl, heart...) is the kit's.
function pimEyes(u, o, sw, sides, smear) {
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const sqz = clamp(o.squint || 0), EX = 2.3;
  if (smear > .5 || sqz > .8) { for (const s of sides) inkLine([[s * EX * u - .9 * u, -6 * u], [s * EX * u + .9 * u, -6 * u]], sw * 1.2, PAL.ink, 'ink', 0); return; }
  if (sqz > 0) { push(); translate(0, -6 * u); scale(1 + sqz * .15, 1 - sqz); translate(0, 6 * u); }
  for (const s of sides) {
    push(); translate(s * EX * u, -6 * u);
    const e = kinds[s < 0 ? 0 : 1];
    if (['normal', 'look', 'wide', 'dot'].includes(e)) pimRoundEye(e, s, u, o, sw); else eye(e, s, u, o, sw);
    pop();
  }
  if (sqz > 0) pop();
}
function pimRoundEye(e, s, u, o, sw) {
  if (((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12) { inkLine([[-.8 * u, .3 * u], [.8 * u, .3 * u]], sw, PAL.ink, 'ink', .3); return; }
  const wide = e === 'wide', r = wide ? 1.3 * u : 1.1 * u, pr = wide ? .42 * u : e === 'dot' ? .62 * u : .5 * u;
  const lx = (o.lookX || 0) * u * .45, ly = (o.lookY || 0) * u * .4;
  paint(ellPts(0, 0, r, r * 1.08, 16, u * .03), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .75 });
  paint(ellPts(lx, ly, pr, pr * 1.1, 12), { wash: PAL.ink, ink: null });
  if (u > 9) paint(ellPts(lx - pr * .35, ly - pr * .4, pr * .3, pr * .3, 8), { wash: PAL.cream, washOp: 230, ink: null });
}

// ---------- model sheets (reference only; labels are fine here) ----------
(() => {
  const label = (txt, x, y, size = 20) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });
  const floor = (y, x0 = 0, x1 = W) => inkLine([[x0 + 40, y + 6], [W / 2, y + 4], [x1 - 40, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);

  LOOPS.pim = t => {
    // row 1: the five key views, and Clawd for scale
    const views = ['front', 'q', 'side', 'qback', 'back'];
    views.forEach((v, i) => { const x = 200 + i * 330; pim(x, 330, 18, { ...pimFeel('neutral', t, { seed: i }), view: v, bulb: v === 'front' ? .9 : 0 }); label(v, x, 372, 24); });
    clawd(1700, 330, 18, feel('neutral', t, { seed: 9 })); label('clawd, for scale', 1700, 372, 20);
    floor(330);
    // row 2: moods
    const moods = ['neutral', 'happy', 'determined', 'proud', 'confused', 'suspicious', 'bored', 'love', 'dizzy', 'hopeful'];
    moods.forEach((m, i) => { const x = 96 + i * 192; pim(x, 640, 11, { ...pimFeel(m, t, { seed: i }), bulb: m === 'determined' || m === 'hopeful' ? 1 : 0 }); label(m, x, 672, 18); });
    floor(640);
    // row 3: motion and the props the story needs
    const y3 = 960, u3 = 11, row = [
      ['walk (side)', x => pim(x, y3, u3, { ...move('walk', t), view: 'side', col: PIM.col, dk: PIM.dk, lt: PIM.lt })],
      ['turn', x => pim(x, y3, u3, { ...pimFeel('happy', t), ...spinView(Math.floor(t * 2) / 8) })],
      ['smear', x => pim(x, y3, u3, { ...pimFeel('excited', t), view: 'side', smear: .8, smearDir: 1, dx: Math.sin(t * TAU / 2) * .3 })],
      ['jump', x => { const k = t % 1.5; pim(x, y3, u3, { ...pimFeel('happy', t), ...jump(k, .35, .95, 3) }); }],
      ['take', x => pim(x, y3, u3, { ...pimFeel('surprised', t), ...take(t % 2, .5, 1.2), emoteAge: (t % 2) - .5, emoteK: seg(t % 2, .5, .7) })],
      ['bulb: the idea', x => pim(x, y3, u3, { ...pimFeel('idea', t), emote: null, bulb: .6 + .4 * Math.sin(t * 6) })],
      ['horns', x => pim(x, y3, u3, { ...pimFeel('suspicious', t), horns: 1 })],
      ['halo', x => pim(x, y3, u3, { ...pimFeel('shy', t), hat: 'halo' })],
      ['look to camera', x => pim(x, y3, u3, { ...pimFeel('neutral', t), eyes: 'normal', mouth: 'flat', lookX: 0, lookY: 0 })],
      ['holding the flag', x => pim(x, y3, u3, { ...pimFeel('proud', t), aR: 1.2, armR: (u, sw) => { inkLine([[0, 0], [0, -3.4 * u]], sw * .9, PAL.ink, 'ink', 0); paint([[0, -3.4 * u], [2.2 * u, -2.7 * u], [0, -2 * u]], { wash: '#E0523F', ink: PAL.ink, sw: sw * .6 }); } })],
    ];
    row.forEach(([name, f], i) => { const x = 96 + i * 192; f(x); label(name, x, y3 + 38, 17); });
    floor(y3);
  };
  LOOPS.pim.len = 4;

  // Pim as it will look in the film: the sunny "alone" framing that opens each section.
  LOOPS.pim_hero = t => {
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: PAL.cream, ink: null });
    boilSeed('sun'); paint(ellPts(960, 560, 700, 520, 36, 30), { fill: '#F6D35B', fillOp: 70, bleed: .3, tex: .5, ink: null });
    boilSeed('floor'); paint(ellPts(960, 1060, 1300, 260, 40, 6), { wash: '#F6D35B', fill: '#E8AA38', fillOp: 60, bleed: .15, tex: .6, ink: PAL.ink, sw: 1 });
    pim(960, 930, 52, { ...pimFeel('happy', t), bulb: .7 + .3 * Math.sin(t * 5) });
  };
  LOOPS.pim_hero.len = 4;
})();
