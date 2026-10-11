// who_wrote_the_prompt.js: the music video. See STORYBOARD.md for the shots, reads and timings.
// World palette (sunny corporate pastel): see STORYBOARD.md "World".
(() => {
  const C = { sun: '#F6D35B', coral: '#F08A6B', sky: '#8FC9E8', grey: '#B9C6D2', greyLt: '#D6DFE7', sand: '#E9D8B4', sandDk: '#CDB387', sandLt: '#F3E6C8',
              dark: '#5A4A3C', wood: '#C9A070', woodDk: '#9E7646', labFloor: '#D9D2C8', red: '#E0523F' };
  const BAR = 4 * BEAT;

  // ---------- props ----------
  // The red flag: pole from (0, 0) up, pennant at the top. In arm space (armR hook, along = true) or world space.
  function flag(u, sw, wave = 0, along = false) {
    if (along) rotate(Math.PI / 2);   // in arm space the pole runs out along the arm
    inkLine([[0, 0], [0, -3.4 * u]], sw * .9, PAL.ink, 'ink', 0);
    paint([[0, -3.4 * u], [2.2 * u, -2.75 * u + wave * .3 * u], [0, -2 * u]], { wash: C.red, fill: '#A8322A', fillOp: 50, ink: PAL.ink, sw: sw * .6, curv: .2 });
  }
  // The score gauge: a half-dial on a flat base, ticks along the arc, the needle pivoting at the bottom. needle -1 = empty
  // (left, in the coral zone) .. 1 = full (right).
  function dial(x, y, r, needle = -1) {
    boilSeed('dial');
    const face = []; for (let i = 0; i <= 22; i++) { const a = Math.PI + (i / 22) * Math.PI; face.push([x + Math.cos(a) * r + jit(r * .015), y + Math.sin(a) * r + jit(r * .015)]); }
    face.push([x + r, y + r * .22], [x - r, y + r * .22]);
    paint(face, { wash: PAL.cream, fill: C.sandDk, fillOp: 40, ink: PAL.ink, sw: 1.4 });
    const a0 = Math.PI * 1.08, a1 = Math.PI * 1.92;
    const wedge = []; for (let i = 0; i <= 6; i++) { const a = a0 + (i / 6) * .24; wedge.push([x + Math.cos(a) * r * .86, y + Math.sin(a) * r * .86]); }
    for (let i = 6; i >= 0; i--) { const a = a0 + (i / 6) * .24; wedge.push([x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62]); }
    paint(wedge, { wash: C.coral, ink: null });
    for (let i = 0; i <= 8; i++) { const a = lerp(a0, a1, i / 8); inkLine([[x + Math.cos(a) * r * .88, y + Math.sin(a) * r * .88], [x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72]], .9, PAL.ink, 'inkfine', 0); }
    const na = lerp(a0, a1, (needle + 1) / 2);
    inkLine([[x, y], [x + Math.cos(na) * r * .8, y + Math.sin(na) * r * .8]], 1.8, '#C8324A', 'ink', 0);
    paint(ellPts(x, y, r * .09, r * .09, 10), { wash: PAL.ink, ink: null });
  }
  // The locked gate: a barrier standing ACROSS the corridor, drawn like the hatch door, as an oblique slab that runs
  // from the back wall at (xf, yf) down toward the viewer to (xn, yn). h = post height. Posts at both ends, rails
  // along the slant, bars between, a padlock on the middle rail, a shadow on the floor along its base.
  function gate(xf, yf, xn, yn, h) {
    boilSeed('gate');
    const post = { wash: C.sandDk, fill: mixCol(C.sandDk, PAL.ink, .25), fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.5 };
    const rail = (k0, th) => paint([[xf, yf - h * k0], [xn, yn - h * k0], [xn, yn - h * k0 + th], [xf, yf - h * k0 + th]], post);
    paint([[xf + 36, yf - 10], [xn + 36, yn - 10], [xn - 36, yn + 12], [xf - 36, yf + 12]], { fill: PAL.ink, fillOp: 70, bleed: .3, tex: .3, ink: null });
    for (let i = 1; i < 5; i++) {
      const k = i / 5, bx = lerp(xf, xn, k), by = lerp(yf, yn, k);
      paint(rectPts(bx - 7, by - h + 10, 14, h - 22, 2), { wash: C.sandDk, ink: PAL.ink, sw: 1.1 });
    }
    rail(1, 20); rail(.47, 18); rail(.08, 20);
    paint(rectPts(xf - 14, yf - h - 6, 28, h + 6, 3), post); paint(rectPts(xf - 24, yf - 8, 48, 14, 2), post);
    paint(rectPts(xn - 17, yn - h - 10, 34, h + 10, 3), post); paint(rectPts(xn - 28, yn - 8, 56, 16, 2), post);
    const lx = lerp(xf, xn, .5), ly = lerp(yf, yn, .5) - h * .47 + 36;
    paint(ellPts(lx, ly - 22, 17, 17, 16), { ink: PAL.ink, sw: 2.4 });   // shackle
    paint(rrPts(lx - 24, ly - 14, 48, 40, 8, 1.5), { wash: PAL.ochre, fill: '#B07A1A', fillOp: 60, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(lx, ly + 6, 4, 5, 8), { wash: PAL.ink, ink: null });
  }
  // The side hatch in the back wall, standing open: a dark opening with a door panel swung out to the left.
  function hatch(x, y, w, h, open = 1) {
    boilSeed('hatch');
    paint(rrPts(x, y - h, w, h, 10, 2), { wash: C.dark, ink: PAL.ink, sw: 1.3 });
    glow(x + w * .5, y - h * .5, h * .9, '#FFD27A', .5 * open);
    const dw = w * .55 * open;
    if (dw > 2) paint([[x, y - h], [x - dw, y - h - 12 * open], [x - dw, y + 6 * open], [x, y]], { wash: C.sand, fill: C.sandDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(x - dw * .8, y - h * .5, 4, 4, 8), { wash: PAL.ink, ink: null });   // handle
  }
  // The pedestal the flag stands on.
  function pedestal(x, y, w, h) {
    boilSeed('pedestal');
    paint(rectPts(x - w / 2, y - h, w, h, 3), { wash: C.sandLt, fill: C.sandDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint(rectPts(x - w / 2 - 12, y - h - 14, w + 24, 14, 2), { wash: C.sand, ink: PAL.ink, sw: 1.3 });
  }

  // ---------- people ----------
  // A generic bean-bodied person, h tall, feet at (x, y). Told apart only by clothes. Big mitten hands on noodle arms
  // that reach wherever the story needs (hands: [[hx, hy], [hx, hy]] in WORLD coordinates, left then right).
  //   o: coat, trim, tie, hair, seed, look [lx, ly] (-1..1), mouth ('smile' | 'o' | 'flat'), hands, bob (0..1), dy (px)
  function person(x, y, h, o = {}) {
    const id = o.seed ?? 0, rs = p => boilSeed(`person ${id} ${p}`);
    const coat = o.coat || PAL.cream, trim = o.trim || PAL.teal, sw = clamp(h / 220, 1.2, 4), J = h * .01;
    const bob = (o.bob ?? 1) * -.012 * h * Math.abs(Math.sin(bpOf(T) * Math.PI + id)), dy = (o.dy || 0) + bob;
    if (o.lean) { push(); translate(x, y); rotate(o.lean); translate(-x, -y); }
    const sh = [x - .15 * h, y - .72 * h + dy], shR = [x + .15 * h, y - .72 * h + dy];
    const hands = o.hands || [[x - .21 * h, y - .4 * h], [x + .21 * h, y - .4 * h]];
    rs('shadow'); paint(ellPts(x, y + .01 * h, .2 * h, .035 * h, 18), { fill: PAL.ink, fillOp: 80, bleed: .3, tex: .3, ink: null });
    rs('legs'); for (const s of [-1, 1]) paint(rrPts(x + s * .075 * h - .05 * h, y - .26 * h + dy, .1 * h, .26 * h, .04 * h, J), { wash: mixCol(coat, PAL.ink, .55), ink: PAL.ink, sw: sw * .8 });
    // far arm (behind the body), then body, then near arm
    const arm = (from, to, k) => {
      if (o.hideArm === k) return;   // the arm is busy somewhere else (under a table, say)
      rs('arm' + k);
      const mid = [lerp(from[0], to[0], .5) + (to[1] < from[1] ? 0 : .04 * h) * (k ? 1 : -1), lerp(from[1], to[1], .55) + .05 * h];
      paint(ribbon([from, mid, to], .085 * h, .06 * h), { wash: coat, fill: mixCol(coat, PAL.ink, .25), fillOp: 50, tex: .4, ink: PAL.ink, sw: sw * .8 });
      paint(ellPts(to[0], to[1], .048 * h, .044 * h, 14, J * .5), { wash: '#F2C9A8', ink: PAL.ink, sw: sw * .8 });
    };
    arm(sh, hands[0], 0);
    rs('body');
    const body = rrPts(x - .16 * h, y - .8 * h + dy, .32 * h, .58 * h, .14 * h, J);
    paint(body, { wash: coat, washOp: 255, ink: null });
    paint(ellPts(x - .05 * h, y - .62 * h + dy, .12 * h, .18 * h, 16, J), { fill: PAL.cream, fillOp: 70, bleed: .2, tex: .7, ink: null });
    paint(rrPts(x - .15 * h, y - .36 * h + dy, .3 * h, .12 * h, .05 * h, J), { fill: mixCol(coat, PAL.ink, .3), fillOp: 90, bleed: .05, tex: .6, ink: null });
    paint(body, { ink: PAL.ink, sw });
    inkLine([[x - .1 * h, y - .8 * h + dy], [x, y - .66 * h + dy], [x + .1 * h, y - .8 * h + dy]], sw * 1.6, trim, 'ink', .2);   // collar
    if (o.tie) paint([[x - .025 * h, y - .66 * h + dy], [x + .025 * h, y - .66 * h + dy], [x + .03 * h, y - .46 * h + dy], [x, y - .42 * h + dy], [x - .03 * h, y - .46 * h + dy]], { wash: o.tie, ink: PAL.ink, sw: sw * .6 });
    rs('head');
    const hy = y - .9 * h + dy, hr = .1 * h;
    paint(ellPts(x, hy, hr, hr * 1.05, 20, J), { wash: '#F2C9A8', fill: '#D99C78', fillOp: 40, tex: .5, ink: PAL.ink, sw });
    if (o.hair) { const cap = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + (i / 12) * Math.PI; cap.push([x + Math.cos(a) * hr * 1.08 + jit(J * .5), hy - .02 * h + Math.sin(a) * hr * .9]); } paint(cap, { wash: o.hair, ink: PAL.ink, sw: sw * .7, curv: .3 }); }
    const [lx, ly] = o.look || [0, 0];
    for (const s of [-1, 1]) paint(ellPts(x + s * .035 * h + lx * .015 * h, hy - .005 * h + ly * .012 * h, .011 * h, .014 * h, 8), { wash: PAL.ink, ink: null });
    const m = o.mouth || 'smile';
    if (m === 'smile') inkLine([[x - .03 * h, hy + .035 * h], [x, hy + .05 * h], [x + .03 * h, hy + .035 * h]], sw * .7, PAL.ink, 'ink', .6);
    else if (m === 'o') paint(ellPts(x, hy + .04 * h, .014 * h, .018 * h, 8), { wash: PAL.ink, ink: null });
    else inkLine([[x - .025 * h, hy + .04 * h], [x + .025 * h, hy + .04 * h]], sw * .7, PAL.ink, 'ink', 0);
    arm(shR, hands[1], 1);
    if (o.lean) pop();
    rs('after');
  }

  // ---------- the test set (shots 1 and 2) ----------
  // In shot 1 the camera is inside it; in shot 2 it turns out to be a box on a table. Same world coordinates in both.
  const BOX = { x0: 100, x1: 1800, top: 140, floor: 860, bottom: 1100 };
  const S1 = { floor: 860, pedX: 1400, pedTop: 790, gate: [1110, 860, 985, 1015, 300], hatch: [640, 860, 120, 130], dial: [1085, 420, 85] };
  function setFloor() {
    boilSeed('floor'); paint(rectPts(BOX.x0, BOX.floor, BOX.x1 - BOX.x0, BOX.bottom - BOX.floor), { wash: C.sandLt, fill: C.sandDk, fillOp: 40, bleed: .1, tex: .6, ink: null });
    inkLine([[BOX.x0, BOX.floor + 2], [(BOX.x0 + BOX.x1) / 2, BOX.floor], [BOX.x1, BOX.floor + 3]], 1.4, PAL.ink, 'ink', .3);
  }
  function setBack(t) {
    boilSeed('wall'); paint(rectPts(BOX.x0, BOX.top, BOX.x1 - BOX.x0, BOX.floor - BOX.top), { wash: C.sand, ink: null });
    paint(rectPts(BOX.x0, BOX.top, BOX.x1 - BOX.x0, 300), { fill: C.sandLt, fillOp: 90, bleed: .3, tex: .5, ink: null });
    setFloor();
    boilSeed('seams'); for (const sx of [300, 1500]) inkLine([[sx, BOX.top + 20], [sx + 3, 400], [sx - 2, BOX.floor]], .7, mixCol(C.sandDk, PAL.ink, .2), 'inkfine', .2);
    glow(S1.pedX, S1.pedTop - 90, 150, '#FFD27A', .55 + .25 * pulse(t));
    hatch(...S1.hatch);
    dial(S1.dial[0], S1.dial[1], S1.dial[2], -1 + .03 * Math.sin(t * 7));
  }
  function setFront(t, flagOnStand) {
    gate(...S1.gate);
    if (flagOnStand) { boilSeed('flagStand'); push(); translate(S1.pedX, S1.pedTop - 14); flag(28, 1.6, Math.sin(t * 6)); pop(); }
  }
  const holdFlag = t => ({ aR: 1.2, armR: (uu, sw) => flag(uu, sw, Math.sin(t * 6), true) });

  // ---------- Shot 1: the test (0.0–9.4) ----------
  // Pim hops down a cardboard test corridor, bumps into a locked gate, sees the flag and the empty dial, sets its
  // face, finds the hatch someone left open, and comes up on the flag's pedestal holding the flag.
  const cam1 = lt => [930 + 8 * Math.sin(lt * .5), 640, 1.2 + .012 * lt];
  function test(t, lt, dur) {
    const bump = 2.95, viaHatch = 7.9, rise = 8.4;
    const sh = shakeXY(t, 14 * Math.exp(-6 * Math.max(0, lt - bump)) * (lt > bump ? 1 : 0));
    const [cx, cy, cz] = cam1(lt);
    camBegin(cx + sh[0], cy + sh[1], cz);
    setBack(t);

    // Pim's timeline
    const x = kf(lt, [[0, 420], [1.35, 420], [1.85, 610], [2.2, 610], [2.7, 800], [2.78, 800], [bump, 858], [bump + .05, 858], [3.3, 820],
                      [viaHatch, 820], [viaHatch + .4, 700], [rise, S1.pedX]]);
    const hop = [jump(lt, 1.35, 1.85, 2.5), jump(lt, 2.2, 2.7, 2.5), jump(lt, 2.78, bump, 1.2)].reduce((a, j) => ({ dy: a.dy + j.dy, sq: a.sq + j.sq }), { dy: 0, sq: 0 });
    const mood = pimEmotions(lt, [
      [0, 'neutral', { lookX: 0 }],
      [bump, 'surprised'],
      [3.5, 'confused', { lookX: .4, lookY: -.2 }],
      [4.2, 'hopeful', { lookX: 1, lookY: -.3 }],
      [5.5, 'nervous', { lookX: .5, lookY: -.9 }],
      [6.7, 'determined', { lookX: .6 }],
      [7.55, 'determined', { lookX: -1, lookY: .3 }],
      [rise, 'proud'],
      [8.9, 'proud', { emote: 'hearts' }],
    ]);
    // views: front, a drawn turn to 3/4 right, a glance back to the hatch, a scurry left in profile, then front on the pedestal
    let view = lt < 7.55 ? turn(lt, 1.0, 1.2, 0, .125) : lt < viaHatch ? turn(lt, 7.55, 7.75, .125, -.125) : lt < rise ? { view: 'side', flip: true } : { view: 'front', flip: false };
    const bulb = lt < bump ? seg(lt, .5, 1.0) : lt < 6.6 ? 0 : seg(lt, 6.6, 7.0);
    // the scurry: a smear, and Pim shrinks into the hatch
    const into = seg(lt, viaHatch, viaHatch + .4), scurry = lt >= viaHatch && lt < rise;
    const u = scurry ? lerp(28, 7, easeIn(into)) : 28;
    const smear = scurry ? .8 * Math.sin(into * Math.PI) : 0;
    // the rise onto the pedestal from behind it
    const up = lt >= rise ? lerp(9, 0, backOut(seg(lt, rise, rise + .45))) : 0;
    const ground = lt >= rise ? S1.pedTop : scurry ? lerp(S1.floor, S1.floor - 40, into) : S1.floor;
    // the head rub after the bump: the near arm comes up to the head and wobbles
    const rub = lt > 3.3 && lt < 4.2 ? 1.3 + .2 * Math.sin(lt * 22) : null;
    const pose = { ...mood, ...view, bulb, dy: mood.dy + hop.dy + up, sq: mood.sq + hop.sq + (lt > bump && lt < bump + .12 ? .25 : 0),
                   smear, smearDir: -1, walk: scurry ? lt * 6 : null };
    if (rub != null) pose.aR = rub;
    if (lt >= rise) Object.assign(pose, holdFlag(t));
    pim(x, ground, u, pose);
    pedestal(S1.pedX, S1.floor, 290, S1.floor - S1.pedTop);
    if (lt >= rise && lt < rise + .5) setFloor();   // while Pim rises from behind the pedestal, the floor hides what's below it
    setFront(t, lt < rise);   // the gate last: it stands nearest the viewer

    const eye = toScreen(x - 2.3 * 28, ground - 6 * 28 + mood.dy * 28);
    camEnd();
    if (lt < .6) iris(eye[0], eye[1], lerp(0, 1600, easeIn(lt / .6)));
  }

  // ---------- Shot 2: the builders (9.4–17.95) ----------
  // The camera keeps easing back: the test is a box on a table in a sunny lab, and three builders stand around it,
  // delighted. One pushes the wall clock's hands forward, one taps a pencil on a clipboard beside a cable that runs
  // out of the window, one hangs a coat over the blinking warning lamps. All three cheer. Pim looks to camera.
  const LAB = { floor: 1400, tableY: 1140, clock: [-330, 320, 150], lamps: [-900, 30, 280, 300], win: [2450, 0, 650, 700], pole: 2900 };
  const A = { x: -430, h: 900 }, B = { x: 2150, h: 900 }, Cc = { x: -760, h: 900 };
  const cablePath = [[1840, 1000], [1900, 1120], [2420, 1130], [2470, 1180], [2500, 1400], [2600, 1420], [2680, 1320], [2660, 760], [2700, 700], [2850, 560], [2900, 300]];
  const cableAt = k => { const n = cablePath.length - 1, i = Math.min(n - 1, Math.floor(k * n)), f = k * n - i; return [lerp(cablePath[i][0], cablePath[i + 1][0], f), lerp(cablePath[i][1], cablePath[i + 1][1], f)]; };
  function lab(t, lt) {
    const [c0x, c0y, c0z] = cam1(9.4);
    const pimFace = [S1.pedX, S1.pedTop - 6 * 28];
    const c = kf(lt, [[0, [c0x, c0y, c0z]], [5.1, [1050, 850, .45]], [6.9, [1050, 850, .45]], [7.8, [pimFace[0], pimFace[1] + 30, 1.6]], [8.55, [pimFace[0], pimFace[1] + 30, 1.6]]]);
    const whip = easeIn(seg(lt, 8.4, 8.55));
    camBegin(c[0] + whip * 2500, c[1], c[2]);

    // the lab: wall, floor, window with the pole outside, clock, lamps panel
    boilSeed('labwall'); paint(rectPts(-3000, -1500, 8000, LAB.floor + 1500), { wash: C.greyLt, ink: null });
    paint(rectPts(-3000, -1500, 8000, 1400), { fill: C.sky, fillOp: 40, bleed: .3, tex: .4, ink: null });
    boilSeed('labfloor'); paint(rectPts(-3000, LAB.floor, 8000, 2000), { wash: C.labFloor, fill: mixCol(C.labFloor, PAL.ink, .3), fillOp: 40, bleed: .1, tex: .6, ink: null });
    inkLine([[-3000, LAB.floor], [1000, LAB.floor + 4], [5000, LAB.floor]], 3, PAL.ink, 'ink', .2);
    // window and the pole with many wires
    boilSeed('window'); { const [wx, wy, ww, wh] = LAB.win;
      paint(rectPts(wx, wy, ww, wh, 4), { wash: '#BFE0F2', fill: C.sky, fillOp: 60, bleed: .2, tex: .4, ink: PAL.ink, sw: 4 });
      glow(wx + ww / 2, wy + wh / 2, ww * .9, '#FFF1B8', .6);
      paint(rectPts(LAB.pole - 14, wy + 60, 28, wh - 60, 3), { wash: C.woodDk, ink: PAL.ink, sw: 2.5 });
      for (const cy of [wy + 110, wy + 190]) { paint(rectPts(LAB.pole - 120, cy, 240, 16, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2 });
        for (let i = 0; i < 5; i++) inkLine([[LAB.pole - 110 + i * 55, cy + 2], [wx + ww + 10, cy - 60 - i * 30 + hash(i) * 20]], 2, PAL.ink, 'inkfine', .3); }
      inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 4, PAL.ink, 'ink', 0); inkLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 4, PAL.ink, 'ink', 0);
      paint(rectPts(wx - 20, wy + wh, ww + 40, 26, 3), { wash: C.greyLt, fill: C.grey, fillOp: 70, ink: PAL.ink, sw: 3 }); }
    // the clock: the builder pushes the minute hand round twice at 11.5–13.3 (lt 2.1–3.9)
    boilSeed('clock'); { const [kx, ky, kr] = LAB.clock, spin = -Math.PI / 2 + 2 * TAU * ease(seg(lt, 2.1, 3.9));
      paint(ellPts(kx, ky, kr, kr, 30, 3), { wash: PAL.cream, fill: C.grey, fillOp: 40, tex: .5, ink: PAL.ink, sw: 4 });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[kx + Math.cos(a) * kr * .86, ky + Math.sin(a) * kr * .86], [kx + Math.cos(a) * kr * .74, ky + Math.sin(a) * kr * .74]], 3, PAL.ink, 'inkfine', 0); }
      const ha = -Math.PI / 2 + .4 + (spin + Math.PI / 2) / 12;
      inkLine([[kx, ky], [kx + Math.cos(ha) * kr * .5, ky + Math.sin(ha) * kr * .5]], 7, PAL.ink, 'ink', 0);
      inkLine([[kx, ky], [kx + Math.cos(spin) * kr * .78, ky + Math.sin(spin) * kr * .78]], 5, PAL.ink, 'ink', 0);
      paint(ellPts(kx, ky, kr * .06, kr * .06, 10), { wash: PAL.ink, ink: null });
      LAB.tip = [kx + Math.cos(spin) * kr * .78, ky + Math.sin(spin) * kr * .78]; }
    // the warning lamps, blinking red, until the coat covers them (lt 5.8)
    boilSeed('lamps'); { const [lx, ly, lw, lh] = LAB.lamps;
      paint(rrPts(lx, ly, lw, lh, 20, 3), { wash: '#6E6A78', fill: PAL.ink, fillOp: 60, tex: .6, ink: PAL.ink, sw: 4 });
      for (let i = 0; i < 6; i++) { const px = lx + lw * (.3 + .4 * (i % 2)), py = ly + lh * (.2 + .3 * Math.floor(i / 2)), on = (Math.floor(bpOf(t) * 2) + i) % 2 === 0;
        if (on) glow(px, py, 70, '#FF6A5A', 1);
        paint(ellPts(px, py, 28, 28, 14, 2), { wash: on ? '#FF5A4A' : '#7A2A28', ink: PAL.ink, sw: 2.5 }); } }

    // the table, the box (the test set inside it), and the cable
    boilSeed('table'); paint(rectPts(-650, LAB.tableY, 3200, 56, 4), { wash: C.wood, fill: C.woodDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 4 });
    for (const tx of [-520, 2440]) paint(rectPts(tx, LAB.tableY + 56, 60, LAB.floor - LAB.tableY - 56, 3), { wash: C.woodDk, ink: PAL.ink, sw: 3 });
    boilSeed('box'); paint(rectPts(BOX.x0 - 40, BOX.top - 40, BOX.x1 - BOX.x0 + 80, BOX.bottom - BOX.top + 80, 4), { wash: C.sandDk, fill: C.dark, fillOp: 40, tex: .6, ink: PAL.ink, sw: 4 });
    setBack(t);
    const mood = pimEmotions(lt, [
      [0, 'proud', { emote: 'hearts' }],
      [1.9, 'confused', { lookX: -1, lookY: -.2 }],
      [3.9, 'confused', { lookX: 1, lookY: .2 }],
      [5.1, 'surprised', { lookX: -1, lookY: -.3 }],
      [6.1, 'confused', { lookX: -.5, lookY: -.4 }],
      [7.0, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const pose = { ...mood, ...holdFlag(t), bulb: lt < 5.1 ? 1 : lt < 7 ? 0 : seg(lt, 7.6, 8), squint: lt > 7.9 && lt < 8.1 ? Math.sin(seg(lt, 7.9, 8.1) * Math.PI) : 0 };
    if (lt < .5) pose.emoteK = 1;
    pim(S1.pedX, S1.pedTop, 28, pose);
    pedestal(S1.pedX, S1.floor, 290, S1.floor - S1.pedTop);
    setFront(t, false);
    paint(rectPts(BOX.x0 - 40, BOX.bottom, BOX.x1 - BOX.x0 + 80, 40, 3), { wash: C.sandDk, fill: C.dark, fillOp: 50, ink: PAL.ink, sw: 4 });   // the box's front lip
    boilSeed('cable'); paint(ribbon(cablePath, 14, 14), { wash: PAL.ink, ink: null });
    if (lt > 3.9 && lt < 5.1) { const p = cableAt(seg(lt, 4.0, 5.0)); glow(p[0], p[1], 90, '#FFD27A', 1); paint(ellPts(p[0], p[1], 14, 14, 10), { wash: PAL.cream, ink: null }); }

    // the builders
    const cheer = (t0) => backOut(seg(lt, t0, t0 + .35)) * (1 - .3 * seg(lt, 7.6, 8.2));
    const upHands = (p, k) => [[p.x - .22 * p.h, p.y0 - .4 * p.h - k * .62 * p.h], [p.x + .22 * p.h, p.y0 - .4 * p.h - k * .62 * p.h]];
    // A: stopwatch in the left hand, right hand on the clock's minute hand while it spins
    { const p = { ...A, y0: LAB.floor }, k = cheer(6.1), reach = lt < 3.9 ? 1 : 1 - ease(seg(lt, 3.9, 4.4));
      const rest = [[p.x - .21 * p.h, p.y0 - .4 * p.h], [p.x + .21 * p.h, p.y0 - .4 * p.h]], up = upHands(p, k);
      const hr = [lerp(rest[1][0], LAB.tip[0], reach), lerp(rest[1][1], LAB.tip[1], reach)];
      const hands = k > 0 ? up : [rest[0], hr];
      person(p.x, p.y0, p.h, { seed: 1, hair: '#5B4636', look: k > 0 ? [0, -1] : [1, -1], mouth: k > 0 ? 'o' : 'smile', hands, dy: -k * 40 });
      // the stopwatch in the left hand
      boilSeed('watch'); paint(ellPts(hands[0][0], hands[0][1] + 30, 30, 30, 14, 2), { wash: PAL.cream, ink: PAL.ink, sw: 3 }); inkLine([[hands[0][0], hands[0][1] + 30], [hands[0][0] + 10, hands[0][1] + 12]], 3, PAL.ink, 'ink', 0); }
    // B: clipboard in the left hand, pencil tapping in the right at 13.3–14.5 (lt 3.9–5.1)
    { const p = { ...B, y0: LAB.floor }, k = cheer(6.25), tap = lt > 3.9 && lt < 5.1 ? pulse(t, 9) : 0;
      const hl = [p.x - .2 * p.h, p.y0 - .5 * p.h], hr = [p.x + .02 * p.h, p.y0 - .52 * p.h - 40 * tap], up = upHands(p, k);
      const hands = k > 0 ? up : [hl, hr];
      person(p.x, p.y0, p.h, { seed: 2, hair: '#2B2233', look: k > 0 ? [0, -1] : [-.3, .8], mouth: k > 0 ? 'o' : 'smile', hands, dy: -k * 40 });
      boilSeed('clipboard'); if (k <= 0) { paint(rrPts(hl[0] - 10, hl[1] - 150, 170, 220, 10, 3), { wash: C.sandDk, ink: PAL.ink, sw: 3 }); paint(rectPts(hl[0] + 8, hl[1] - 130, 134, 180, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2 });
        for (let i = 0; i < 5; i++) inkLine([[hl[0] + 30, hl[1] - 100 + i * 32], [hl[0] + 80 + 40 * hash(i), hl[1] - 100 + i * 32 + jit(2)]], 2.5, PAL.ink, 'inkfine', .3); }
      // the pencil, in the right hand, pointing at the clipboard
      boilSeed('pencil'); push(); translate(hands[1][0], hands[1][1]); rotate(k > 0 ? -.4 : -2.2);
      paint(rectPts(0, -12, 120, 24, 2), { wash: C.sun, ink: PAL.ink, sw: 2.5 }); paint([[120, -12], [150, 0], [120, 12]], { wash: '#F2C9A8', ink: PAL.ink, sw: 2 }); paint([[138, -6], [150, 0], [138, 6]], { wash: PAL.ink, ink: null });
      paint(rectPts(-14, -12, 16, 24, 1), { wash: C.coral, ink: PAL.ink, sw: 2 }); pop(); }
    // C: the coat, swung up over the lamps at 14.6–15.2 (lt 5.2–5.8)
    { const p = { ...Cc, y0: LAB.floor }, k = cheer(6.4), sw = seg(lt, 5.2, 5.8);
      const [lx, ly, lw, lh] = LAB.lamps, hold = [p.x + .1 * p.h, p.y0 - .45 * p.h], over = [lx + lw / 2, ly - 10];
      const coat = arcPt(hold, over, 260, ease(sw)), up = upHands(p, k);
      const hr = sw < 1 ? coat : k > 0 ? up[1] : [p.x + .21 * p.h, p.y0 - .4 * p.h];
      const hands = [k > 0 ? up[0] : [p.x - .21 * p.h, p.y0 - .4 * p.h], hr];
      person(p.x, p.y0, p.h, { seed: 3, hair: '#8C6A4A', look: k > 0 ? [0, -1] : sw > 0 ? [.5, -1] : [.6, -.6], mouth: k > 0 ? 'o' : 'smile', hands, dy: -k * 40 });
      boilSeed('coat');
      if (sw < 1) paint(rrPts(coat[0] - 70, coat[1] - 20, 140, 180 + 60 * sw, 40, 4), { wash: PAL.cream, fill: C.grey, fillOp: 50, tex: .5, ink: PAL.ink, sw: 3, curv: .3 });
      else { const drop = backOut(seg(lt, 5.8, 6.2)); paint(rrPts(lx - 20, ly - 30, lw + 40, 40 + (lh + 50) * drop, 30, 4), { wash: PAL.cream, fill: C.grey, fillOp: 50, tex: .5, ink: PAL.ink, sw: 3, curv: .3 });
        inkLine([[lx + lw / 2 - 40, ly - 25], [lx + lw / 2, ly + 10], [lx + lw / 2 + 40, ly - 25]], 3, PAL.teal, 'ink', .3); } }

    camEnd();
    // the whip pan out: streaks across the frame in the last frames (shot 3 finishes it)
    if (whip > 0) { boilSeed('whip'); for (let i = 0; i < 9; i++) { const y = 60 + i * 120 + jit(20); inkLine([[-100, y], [W + 100, y + jit(10)]], 10 + 14 * whip, mixCol(C.greyLt, PAL.ink, .2), 'dry', .1); } }
  }

  // ---------- Shot 3: the podium (17.95–26.5) ----------
  // The clipboard builder at a lectern in a press room drops a report as thick as Pim onto it; pages flip past
  // Pim's patting hand, squiggles only; the last page is blank; a shrug; a flowerpot arrives and Pim sprouts out of
  // it with a leaf on its antenna; ta-da; and through the back door the other two wheel the box and the cable away.
  const P3 = { floor: 900, lect: [640, 1100, 560, 600], rep: [700, 900], door: [1380, 1600, 320], win: [150, 100, 500, 460] };
  function podium(t, lt, dur) {
    const thump = .35, flip0 = 1.65, flipDt = 2 / 12, blank = 3.65, duck = 4.65, potLand = 5.05, sprout = 5.25, riseT = 5.65, tada = 6.35, wheel = 7.3, toCam = 8.15;
    const whip = 1 - easeOut(seg(lt, 0, .2));
    const sh = shakeXY(t, 10 * (Math.exp(-7 * Math.max(0, lt - thump)) * (lt > thump ? 1 : 0) + Math.exp(-7 * Math.max(0, lt - potLand)) * (lt > potLand ? 1 : 0)));
    const cz = kf(lt, [[blank, 1], [blank + .6, 1.22], [duck, 1.22], [potLand, 1]]), ccx = kf(lt, [[blank, 960], [blank + .6, 830], [duck, 830], [potLand, 960]]), ccy = kf(lt, [[blank, 560], [blank + .6, 520], [duck, 520], [potLand, 560]]);
    camBegin(ccx - 1700 * whip + sh[0], ccy + sh[1], cz);
    const [dx0, dx1, dtop] = P3.door, [lx0, lx1, ltop, lfront] = P3.lect;

    // the far room seen through the door: the box on a trolley and the cable spool, wheeled right at 25.3–26.5
    boilSeed('farroom'); paint(rectPts(dx0 - 400, dtop - 200, dx1 - dx0 + 800, P3.floor - dtop + 400), { wash: mixCol(C.greyLt, PAL.ink, .35), ink: null });
    { const k = seg(lt, wheel, wheel + 1.25), tx = lerp(850, 2100, k), fy = P3.floor - 40;
      boilSeed('trolley'); paint(rectPts(tx - 130, fy - 220, 260, 170, 3), { wash: C.sandDk, fill: C.dark, fillOp: 40, tex: .5, ink: PAL.ink, sw: 2 });
      paint(rectPts(tx - 150, fy - 50, 300, 20, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2 });
      for (const wx of [tx - 100, tx + 100]) paint(ellPts(wx, fy - 14, 22, 22, 12), { wash: PAL.ink, ink: null });
      person(tx + 230, fy, 420, { seed: 4, hair: '#5B4636', coat: mixCol(PAL.cream, C.grey, .4), hands: [[tx + 150, fy - 170], [tx + 160, fy - 150]], look: [-1, 0] });
      const sx = tx - 420; person(sx, fy, 420, { seed: 5, hair: '#8C6A4A', coat: mixCol(PAL.cream, C.grey, .4), hands: [[sx - 60, fy - 120], [sx + 60, fy - 120]], look: [1, 0] });
      boilSeed('spool'); paint(ellPts(sx, fy - 130, 80, 80, 20, 3), { wash: C.woodDk, ink: PAL.ink, sw: 2.5 }); paint(ellPts(sx, fy - 130, 48, 48, 16, 2), { wash: PAL.ink, ink: null }); paint(ellPts(sx, fy - 130, 14, 14, 8), { wash: C.woodDk, ink: null }); }

    // the press room: wall in pieces around the door opening, the door panel swung out, the sunny window, the floor
    boilSeed('wall3');
    const wallSt = { wash: C.greyLt, ink: null };
    paint(rectPts(-1200, -700, dx0 + 1200, P3.floor + 700), wallSt); paint(rectPts(dx1, -700, 2000, P3.floor + 700), wallSt); paint(rectPts(dx0, -700, dx1 - dx0, dtop + 700), wallSt);
    paint(rectPts(-1200, -700, 4000, 700), { fill: C.sky, fillOp: 35, bleed: .3, tex: .4, ink: null });
    inkLine([[dx0, dtop], [dx1, dtop], [dx1, P3.floor]], 3, PAL.ink, 'ink', 0); inkLine([[dx0, dtop], [dx0, P3.floor]], 3, PAL.ink, 'ink', 0);
    paint([[dx1, dtop], [dx1 + 110, dtop - 24], [dx1 + 110, P3.floor + 14], [dx1, P3.floor]], { wash: C.sand, fill: C.sandDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 3 });
    paint(ellPts(dx1 + 88, lerp(dtop, P3.floor, .52), 6, 6, 8), { wash: PAL.ink, ink: null });
    boilSeed('win3'); { const [wx, wy, ww, wh] = P3.win;
      paint(rectPts(wx, wy, ww, wh, 4), { wash: '#BFE0F2', fill: C.sky, fillOp: 60, bleed: .2, tex: .4, ink: PAL.ink, sw: 3.5 });
      glow(wx + ww / 2, wy + wh / 2, ww, '#FFF1B8', .7); glow(wx + ww * .3, wy + wh * .3, ww * .35, '#FFE27A', .6);
      inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 3, PAL.ink, 'ink', 0); inkLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 3, PAL.ink, 'ink', 0);
      paint(rectPts(wx - 16, wy + wh, ww + 32, 22, 3), { wash: C.greyLt, fill: C.grey, fillOp: 70, ink: PAL.ink, sw: 2.5 }); }
    boilSeed('floor3'); paint(rectPts(-1200, P3.floor, 4000, 1200), { wash: C.labFloor, fill: mixCol(C.labFloor, PAL.ink, .3), fillOp: 40, bleed: .1, tex: .6, ink: null });
    inkLine([[-1200, P3.floor], [960, P3.floor + 3], [3000, P3.floor]], 3, PAL.ink, 'ink', .2);

    // the report: a thick stack dropped onto the lectern, then pages flipping left over the spine
    const nFlipped = clamp(Math.floor((lt - flip0) / flipDt) + 1, 0, 12);
    const stackH = 110 - 4 * nFlipped, [rx0, rx1] = P3.rep, ry = ltop + 30;   // top of the stack sits at ry - stackH
    const drop = lt < thump ? lerp(-420, 0, easeIn(seg(lt, 0, thump))) : 0, sqz = lt > thump ? .18 * Math.exp(-9 * (lt - thump)) * Math.cos(22 * (lt - thump)) : 0;
    const repTop = ry - stackH * (1 - sqz) + drop;
    const squiggles = (x0, y0, w, n, seed) => { for (let i = 0; i < n; i++) inkLine([[x0 + 12, y0 + 8 + i * 9], [x0 + 12 + (w - 30) * (.55 + .45 * hash(seed + i)), y0 + 8 + i * 9 + jit(1)]], 1.6, PAL.ink, 'inkfine', .3); };
    // the presenter, behind the lectern
    const px = 870, pfeet = P3.floor + 40, ph = 780;
    let hands, look = [.4, .6], mouth = 'smile';
    const rest = [[lx0 + 20, lfront + 50], [lx1 - 20, lfront + 50]];
    if (lt < thump) hands = [[rx0 + 20, repTop - 10], [rx1 - 20, repTop - 10]];
    else if (lt < flip0) hands = [[lerp(rx0 + 20, rest[0][0], ease(seg(lt, thump, thump + .5))), lerp(ry - 110, rest[0][1], ease(seg(lt, thump, thump + .5)))], [lerp(rx1 - 20, rest[1][0], ease(seg(lt, thump, thump + .5))), lerp(ry - 110, rest[1][1], ease(seg(lt, thump, thump + .5)))]];
    else if (lt < blank) { const i = Math.min(11, Math.floor((lt - flip0) / flipDt)), p = seg(lt, flip0 + i * flipDt, flip0 + i * flipDt + .25); hands = [[rx0 + 200 * Math.cos(p * Math.PI), repTop - 150 * Math.sin(p * Math.PI) - 10], rest[1]]; look = [-.6, .8]; }
    else if (lt < duck) { const k = backOut(seg(lt, blank + .1, blank + .5)); hands = [[lerp(rx0 - 20, px - .3 * ph, k), lerp(repTop - 10, pfeet - .78 * ph, k)], [lerp(rest[1][0], px + .3 * ph, k), lerp(rest[1][1], pfeet - .78 * ph, k)]]; look = [0, .3]; mouth = 'flat'; }
    else if (lt < potLand) { const k = ease(seg(lt, duck, potLand)), pot = arcPt([1300, 1040], [1000, ry - 40], 300, k); hands = [[pot[0] - 70, pot[1] + 20], [pot[0] + 70, pot[1] + 20]]; look = [.3, .9]; }
    else if (lt < tada) { const k = ease(seg(lt, potLand, potLand + .4)); hands = [[lerp(930, rest[0][0], k), lerp(ry - 20, rest[0][1], k)], [lerp(1070, rest[1][0], k), lerp(ry - 20, rest[1][1], k)]]; look = [.3, .9]; }
    else { const kL = backOut(seg(lt, tada, tada + .3)), kR = backOut(seg(lt, tada + .25, tada + .55)), down = ease(seg(lt, wheel + .2, wheel + .7));
      const tl = [px - .36 * ph, pfeet - .88 * ph], tr = [px + .36 * ph, pfeet - .88 * ph];
      hands = [[lerp(lerp(rest[0][0], tl[0], kL), rest[0][0], down), lerp(lerp(rest[0][1], tl[1], kL), rest[0][1], down)], [lerp(lerp(rest[1][0], tr[0], kR), rest[1][0], down), lerp(lerp(rest[1][1], tr[1], kR), rest[1][1], down)]];
      look = lt < wheel ? [0, -.2] : [1, .2]; mouth = lt < wheel ? 'o' : 'smile'; }
    person(px, pfeet, ph, { seed: 2, hair: '#2B2233', hands, look, mouth });
    // Pim on the lectern, then gone, then up out of the pot
    const gone = lt >= duck && lt < riseT;
    const duckDy = lt >= duck && lt < riseT ? 14 * easeIn(seg(lt, duck, duck + .3)) : 0;
    const upDy = lt >= riseT ? lerp(8.5, 0, backOut(seg(lt, riseT, riseT + .8))) : 0;
    const mood = pimEmotions(lt, [
      [0, 'happy', { lookX: -.6, lookY: -.8 }],
      [thump, 'surprised', { lookX: -.8, lookY: .4 }],
      [1.2, 'thinking', { lookX: -1, lookY: .6, emote: null }],
      [blank, 'confused', { lookX: -1, lookY: .5 }],
      [riseT, 'sleepy', { emote: null }],
      [tada, 'playful'],
      [wheel + .2, 'neutral', { lookX: 1, lookY: .1, mouth: 'flat', emote: null }],
      [toCam, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const bounce = take(lt, thump + .05, .9);
    let pat = 0; if (lt >= flip0 && lt < blank) { const i = Math.floor((lt - flip0) / flipDt); pat = Math.sin(seg(lt, flip0 + i * flipDt, flip0 + i * flipDt + .25) * Math.PI); }
    const bulb = lt < blank ? 1 : lt < blank + .5 ? (Math.sin(lt * 40) > 0 ? 1 : .2) * (1 - seg(lt, blank, blank + .5)) : lt < tada ? 0 : seg(lt, tada, tada + .3);
    const pose = { ...mood, bulb, dy: mood.dy + bounce.dy + duckDy + upDy, sq: mood.sq + bounce.sq, squint: lt > riseT && lt < tada - .1 ? 1 - seg(lt, tada - .35, tada - .1) : mood.squint || 0 };
    if (pat > 0) pose.aL = lerp(.2, -1.1, pat);
    if (lt >= riseT) pose.draw = (u, sw) => { push(); translate(.5 * u, -10.4 * u); rotate(-.6); paint(ellPts(.9 * u, 0, 1.1 * u, .45 * u, 12), { wash: PAL.sap, fill: '#4E7A3C', fillOp: 60, ink: PAL.ink, sw: sw * .6 }); inkLine([[0, 0], [1.8 * u, 0]], sw * .4, PAL.ink, 'inkfine', 0); pop(); };
    if (lt >= wheel + .2 && lt < toCam) Object.assign(pose, turn(lt, wheel + .2, wheel + .4, 0, .125)); else if (lt >= toCam) Object.assign(pose, turn(lt, toCam, toCam + .2, .125, 0));
    const pimX = 1000, pimY = ltop + 25;
    if (lt >= riseT) { const tuck = clamp(upDy / 3); pim(pimX, pimY - 106, 22, { ...pose, noShadow: true, aL: lerp(pose.aL ?? .2, -1.45, tuck), aR: lerp(pose.aR ?? .2, -1.45, tuck), sx: 1 - .14 * tuck }); }   // drawn before the lectern and the pot, so it comes up out of the soil
    // the lectern: front face, then its top as an oblique slab
    boilSeed('lectern');
    paint(rectPts(lx0, lfront, lx1 - lx0, P3.floor - lfront + 10, 3), { wash: C.wood, fill: C.woodDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 3 });
    paint([[lx0, lfront], [lx1, lfront], [lx1 + 30, ltop], [lx0 + 30, ltop]], { wash: mixCol(C.wood, PAL.cream, .35), ink: PAL.ink, sw: 3 });
    paint(rectPts(lx0 - 10, lfront - 6, lx1 - lx0 + 20, 16, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2.5 });
    // the report stack (front face with page edges, top page), the flipped pile, the page in flight
    boilSeed('report');
    const spineB = [rx0, repTop + 30], spineT = [rx0 + 20, repTop];
    if (lt >= flip0 && nFlipped > 0) {   // the flipped pile lying left of the spine
      paint([[rx0 - 200, repTop + 30], [rx0, repTop + 30], [rx0 + 20, repTop], [rx0 - 180, repTop]], { wash: PAL.cream, ink: PAL.ink, sw: 2 });
      paint(rectPts(rx0 - 200, repTop + 30, 200, 4 * nFlipped, 1), { wash: PAL.cream, ink: PAL.ink, sw: 1.5 });
    }
    paint(rectPts(rx0, repTop + 30, rx1 - rx0, stackH * (1 - sqz) - 30, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2.2 });
    for (let i = 1; i < 9; i++) inkLine([[rx0 + 4, repTop + 30 + i * (stackH - 30) / 9], [rx1 - 4, repTop + 30 + i * (stackH - 30) / 9 + jit(1)]], 1, mixCol(PAL.ink, PAL.cream, .5), 'inkfine', 0);
    paint([spineB, [rx1, repTop + 30], [rx1 + 20, repTop], spineT], { wash: PAL.cream, ink: PAL.ink, sw: 2.2 });   // the top page
    if (nFlipped < 12) squiggles(rx0 + 20, repTop, rx1 - rx0 - 20, 3, 100 + nFlipped);   // the last page is blank
    if (lt >= flip0 && lt < blank + .3) { const i = Math.min(11, Math.floor((lt - flip0) / flipDt)), p = seg(lt, flip0 + i * flipDt, flip0 + i * flipDt + .25);
      if (p > 0 && p < 1) { const v = [200 * Math.cos(p * Math.PI), -150 * Math.sin(p * Math.PI)];
        paint([spineB, [spineB[0] + v[0], spineB[1] + v[1]], [spineT[0] + v[0], spineT[1] + v[1]], spineT], { wash: PAL.cream, ink: PAL.ink, sw: 2, curv: .1 });
        if (p < .5) squiggles(rx0 + 20, repTop + v[1], 200 * Math.cos(p * Math.PI), 3, 100 + i); } }

    if (!gone && lt < duck) pim(pimX, pimY, 22, pose);
    // the flowerpot: arrives on an arc, lands with a thump, then Pim grows out of it
    if (lt >= duck) {
      const k = ease(seg(lt, duck, potLand)), pot = lt < potLand ? arcPt([1300, 1040], [pimX, pimY], 300, k) : [pimX, pimY + 10 * Math.exp(-8 * (lt - potLand)) * Math.cos(20 * (lt - potLand))];
      boilSeed('pot');
      const pw = 196, pH = 124;
      paint(ellPts(pot[0], pot[1] - pH, pw * .5, 22, 18, 2), { wash: '#6B4A32', fill: PAL.ink, fillOp: 50, tex: .7, ink: PAL.ink, sw: 2 });   // soil
      if (lt >= sprout && lt < riseT + .08) { const g = ease(seg(lt, sprout, riseT)); /* the stem hands over to the antenna */ boilSeed('stem'); inkLine([[pot[0], pot[1] - pH - 10], [pot[0] - 6, pot[1] - pH - 10 - 50 * g], [pot[0] + 4, pot[1] - pH - 10 - 90 * g]], 4, PAL.sap, 'ink', .6); }
      paint([[pot[0] - pw / 2, pot[1] - pH], [pot[0] + pw / 2, pot[1] - pH], [pot[0] + pw * .38, pot[1]], [pot[0] - pw * .38, pot[1]]], { wash: C.coral, fill: '#B8513A', fillOp: 60, tex: .6, ink: PAL.ink, sw: 2.5 });
      paint(rectPts(pot[0] - pw / 2 - 8, pot[1] - pH - 10, pw + 16, 26, 2), { wash: C.coral, fill: '#B8513A', fillOp: 50, ink: PAL.ink, sw: 2.5 });
    }

    // the press, from behind: three heads at the bottom of frame, and a flash now and then
    boilSeed('press');
    for (const [hx, hw] of [[300, 150], [1000, 170], [1620, 150]]) { paint(ellPts(hx, 1090, hw, 110, 18, 3), { wash: '#4A5566', ink: PAL.ink, sw: 3 }); paint(rrPts(hx - hw * 1.4, 1150, hw * 2.8, 200, 60, 4), { wash: '#3C4656', ink: PAL.ink, sw: 3 }); }
    for (const ft of [.6, 2.75, 6.6]) { const a = lt - ft; if (a > 0 && a < .25) { glow(1620, 950, 420 * (1 - a * 2), '#FFFFFF', 1 - a * 4); } }

    camEnd();
    if (whip > 0) { boilSeed('whip3'); for (let i = 0; i < 9; i++) { const y = 60 + i * 120 + jit(20); inkLine([[-100, y], [W + 100, y + jit(10)]], 10 + 14 * whip, mixCol(C.greyLt, PAL.ink, .2), 'dry', .1); } }
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [C.sun, PAL.ochre]);
  }

  // ---------- chorus props ----------
  // A mitten hand at (x, y) on a sleeve that runs up out of frame. coat / trim tell the sleeves apart.
  function sleeve(x, y, coat, trim, key) {
    boilSeed('sleeve ' + key);
    paint(rrPts(x - 50, y - 620, 100, 600, 40, 4), { wash: coat, fill: mixCol(coat, PAL.ink, .3), fillOp: 45, tex: .5, ink: PAL.ink, sw: 2.6 });
    paint(rectPts(x - 56, y - 95, 112, 30, 3), { wash: trim, ink: PAL.ink, sw: 2.2 });
    paint(ellPts(x, y - 30, 48, 42, 16, 3), { wash: '#F2C9A8', fill: '#D99C78', fillOp: 40, tex: .5, ink: PAL.ink, sw: 2.6 });
  }
  const SLEEVES = { white: [PAL.cream, PAL.teal], navy: ['#2F3C7A', PAL.ochre], grey: ['#9AA3AE', '#6E7781'] };
  // The pencil, standing on its point at (x, y), leaning by rot.
  function pencilUp(x, y, rot, key = 'pencil') {
    boilSeed(key); push(); translate(x, y); rotate(rot);
    paint([[-16, -40], [16, -40], [0, 0]], { wash: '#F2C9A8', ink: PAL.ink, sw: 2 }); paint([[-6, -14], [6, -14], [0, 0]], { wash: PAL.ink, ink: null });
    paint(rectPts(-16, -200, 32, 160, 2), { wash: C.sun, ink: PAL.ink, sw: 2.4 });
    paint(rectPts(-18, -222, 36, 24, 1), { wash: C.coral, ink: PAL.ink, sw: 2 });
    pop();
  }
  // A ring of three keys hanging from (x, y); jangle rotates them.
  function keyring(x, y, jangle, key = 'keys') {
    boilSeed(key); push(); translate(x, y);
    paint(ellPts(0, 0, 30, 30, 16, 2), { ink: PAL.ink, sw: 5 });
    for (let i = 0; i < 3; i++) { push(); rotate(.35 * (i - 1) + jangle * (i % 2 ? 1 : -.7)); translate(0, 26);
      paint(ellPts(0, 10, 16, 16, 12, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 2 }); paint(ellPts(0, 10, 5, 5, 8), { wash: PAL.ink, ink: null });
      paint(rectPts(-5, 24, 10, 60, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 2 }); for (const ty of [62, 76]) paint(rectPts(5, ty, 10, 7, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 1.6 });
      pop(); }
    pop();
  }
  // A little door in its frame standing on the floor at (x, y), ajar: the panel swung out toward the viewer.
  function littleDoor(x, y, w, h, key = 'door') {
    boilSeed(key);
    paint(ellPts(x + w / 2, y + 12, w * .8, 20, 18), { fill: PAL.ink, fillOp: 70, bleed: .3, tex: .3, ink: null });
    paint(rectPts(x, y - h, w, h, 3), { wash: C.dark, ink: null });
    glow(x + w / 2, y - h / 2, h * .7, '#FFD27A', .5);
    const fr = { wash: C.sandDk, fill: mixCol(C.sandDk, PAL.ink, .25), fillOp: 60, tex: .6, ink: PAL.ink, sw: 2.6 };
    paint(rectPts(x - 22, y - h - 22, w + 44, 24, 2), fr); paint(rectPts(x - 22, y - h - 22, 24, h + 22, 2), fr); paint(rectPts(x + w - 2, y - h - 22, 24, h + 22, 2), fr);
    paint([[x, y - h], [x - w * .6, y - h - 18], [x - w * .6, y + 10], [x, y]], { wash: C.sand, fill: C.sandDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: 2.4 });
    paint(ellPts(x - w * .5, y - h * .5, 6, 6, 8), { wash: PAL.ink, ink: null });
  }
  // Two little red horns around (x, y), s = size, spread pushes them apart (for flying off).
  function hornPair(x, y, s, spread = 0, rot = 0, key = 'horns') {
    boilSeed(key);
    for (const d of [-1, 1]) { push(); translate(x + d * (2.2 * s + spread), y); rotate(rot * d);
      paint([[d * -.7 * s, 0], [d * .9 * s, -2.2 * s], [d * 1.4 * s, -1.6 * s], [d * .9 * s, .2 * s]], { wash: PIM.horn, fill: '#A8322A', fillOp: 70, ink: PAL.ink, sw: 2, curv: .3 }); pop(); }
  }
  function haloRing(x, y, key = 'halo') {
    boilSeed(key); glow(x, y, 110, '#FFE49A', .9);
    paint(ellPts(x, y, 80, 20, 24, 2), { ink: PAL.ochre, sw: 6 });
  }
  // A drop from above: y offset for a thing that falls from height h between t0 and t1 and settles with a bounce.
  function dropIn(lt, t0, t1, h = 900) {
    if (lt < t0) return -h - 2000;
    if (lt < t1) return -h * (1 - easeIn(seg(lt, t0, t1)));
    const a = lt - t1; return -h * .06 * Math.abs(Math.sin(a * 16)) * Math.exp(-a * 7);
  }
  // The yellow floor world of the choruses.
  function sunFloor(t) {
    boilSeed('sunsky'); paint(rectPts(-800, -1200, W + 1600, H + 2200), { wash: PAL.cream, ink: null });
    paint(ellPts(960, 300, 820, 560, 36, 30), { fill: C.sun, fillOp: 55, bleed: .35, tex: .5, ink: null });
    glow(960, 260, 700, '#FFE9A8', .5);
    boilSeed('sunfloor'); paint(ellPts(960, 1560, 2400, 700, 48, 8), { wash: C.sun, fill: PAL.ochre, fillOp: 55, bleed: .15, tex: .6, ink: PAL.ink, sw: 1.6 });
  }

  // ---------- Shot 4: the questions (26.5–39.4) ----------
  // Pim alone on the yellow floor, bouncing. The pencil, the gauge, the keys and the little door arrive one per
  // question; Pim turns to each, confused, then looks up: three sleeves withdraw over the top of frame. Horns land
  // on its head and get shaken off; a halo floats down, hovers, and drifts away. Pim looks to camera; the sleeves
  // come back, and the grey one reaches for Pim (shot 5 finishes the lift).
  const S4 = { pimX: 960, floor: 860, u: 26, pencil: 730, dial: 1210, keys: 540, door: 1400 };
  function questions(t, lt, dur) {
    const tPen = 1.1, tDial = 2.2, tKeys = 4.4, tDoor = 6.5, tUp = 7.5, tHorns = 8.6, tShake = 9.8, tHalo = 10.4, tCam = 11.9, back = 12.3;
    const lift = Math.sin(seg(lt, tUp, tUp + .5) * Math.PI / 2) * (1 - ease(seg(lt, tHorns - .5, tHorns)));
    camBegin(960, 620 - 150 * lift, 1.32);
    sunFloor(t);
    const { pimX, floor, u } = S4;

    // the things, one per question
    const penY = dropIn(lt, tPen - .4, tPen + .1), penRot = .3 * spring(lt, tPen + .1, 4, 18);
    if (lt > tPen - .4) pencilUp(S4.pencil, floor + penY, penRot);
    const dialY = dropIn(lt, tDial - .4, tDial + .1);
    if (lt > tDial - .4) { const spinK = seg(lt, tDial + .1, tDial + 1.6); boilSeed('dialbase'); paint(rectPts(S4.dial - 60, floor - 30 + dialY, 120, 30, 2), { wash: C.sandDk, ink: PAL.ink, sw: 2.2 });
      dial(S4.dial, floor - 40 + dialY, 70, lt < tDial + 1.6 ? Math.sin(spinK * TAU * 2.5) : -1 + .03 * Math.sin(t * 7)); }
    const keysY = dropIn(lt, tKeys - .4, tKeys + .1), jangle = .5 * spring(lt, tKeys + .1, 3, 26);
    if (lt > tKeys - .4) keyring(S4.keys, floor - 120 + keysY, jangle);
    const doorX = lerp(2300, S4.door, easeOut(seg(lt, tDoor - .4, tDoor + .1)));
    if (lt > tDoor - .4) littleDoor(doorX, floor, 150, 290);

    // Pim: bouncing on the beat, turning to each thing, then looking up, horns, halo, camera
    const mood = pimEmotions(lt, [
      [0, 'happy'],
      [tPen + .15, 'surprised', { lookX: -1, lookY: .3 }],
      [tDial + .2, 'confused', { lookX: 1, lookY: .1 }],
      [tKeys + .2, 'confused', { lookX: -1, lookY: .3 }],
      [tDoor + .2, 'confused', { lookX: 1, lookY: 0 }],
      [tUp, 'surprised', { lookX: 0, lookY: -1 }],
      [tHorns + .4, 'suspicious'],
      [tHalo + .6, 'shy', { lookX: .3, lookY: -1 }],
      [tCam, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const bounce = move('bounce', t), bk = 1 - .6 * seg(lt, tUp, tUp + .5);
    let view = { view: 'front', flip: false };
    if (lt >= tPen + .15 && lt < tDial + .2) view = turn(lt, tPen + .15, tPen + .35, 0, -.125);
    else if (lt >= tDial + .2 && lt < tKeys + .2) view = turn(lt, tDial + .2, tDial + .45, -.125, .125);
    else if (lt >= tKeys + .2 && lt < tDoor + .2) view = turn(lt, tKeys + .2, tKeys + .45, .125, -.125);
    else if (lt >= tDoor + .2 && lt < tUp) view = turn(lt, tDoor + .2, tDoor + .45, -.125, .125);
    else if (lt >= tUp) view = turn(lt, tUp, tUp + .2, .125, 0);
    const shake = lt > tShake && lt < tShake + .5 ? .18 * Math.sin((lt - tShake) * 40) * (1 - seg(lt, tShake + .3, tShake + .5)) : 0;
    const hornsOn = lt >= tHorns + .4 && lt < tShake + .25;
    const pose = { ...mood, ...view, bulb: 1, dy: mood.dy + bounce.dy * bk, sq: mood.sq + bounce.sq * bk, rot: (mood.rot || 0) + shake, horns: hornsOn ? 1 : 0 };
    pim(pimX, floor, u, pose);
    const headY = floor - 8 * u + (pose.dy || 0) * u;

    // the sleeves: withdrawing over the top of frame as Pim looks up, and coming back at the end
    const away = ease(seg(lt, tUp + .3, tUp + 1.0));
    const sl = [[S4.pencil, 'white'], [S4.dial, 'navy'], [S4.door, 'grey']];
    if (lt >= tUp && lt < tHorns) sl.forEach(([x, k], i) => sleeve(x, lerp(300 + 40 * i, -420, away), ...SLEEVES[k], k));
    // the navy hand brings the horns, lets go and withdraws
    if (lt >= tHorns - .3 && lt < tHorns + 1.1) { const down = ease(seg(lt, tHorns - .3, tHorns + .4)), upK = ease(seg(lt, tHorns + .6, tHorns + 1.1));
      const hy = lerp(-200, headY + 10, down) - 700 * upK; sleeve(pimX + 90, hy, ...SLEEVES.navy, 'navy2');
      if (lt < tHorns + .4) hornPair(pimX, hy - 10, 24); }
    // the horns fly off after the shake
    if (lt >= tShake + .25 && lt < tShake + .9) { const k = seg(lt, tShake + .25, tShake + .9); hornPair(pimX, headY - 24 - 260 * k * (1 - k) * 2 + 500 * k * k, 24, 160 * k, 2.5 * k); }
    // the halo floats down, hovers, drifts off
    if (lt >= tHalo && lt < tCam) { const down = easeOut(seg(lt, tHalo, tHalo + .6)), off = easeIn(seg(lt, tHalo + 1.1, tCam));
      haloRing(pimX + 10 * Math.sin(lt * 3), lerp(-150, headY - 70, down) + 6 * Math.sin(lt * 5) - 500 * off); }
    // the sleeves come back in; the grey one reaches for Pim
    if (lt >= back) { const k = ease(seg(lt, back, dur)); sleeve(S4.pencil, lerp(-420, 260, k), ...SLEEVES.white, 'white'); sleeve(S4.dial, lerp(-420, 290, k), ...SLEEVES.navy, 'navy');
      sleeve(pimX + 20, lerp(-420, headY - 120, k), ...SLEEVES.grey, 'grey'); }

    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [C.sun, PAL.ochre]);
  }

  // ---------- the steps (shots 5, 11, 17) ----------
  // A generic columned building in bright sun, with wide steps coming down toward the camera. No seal, no flag.
  const ST = { top: 900, stepH: 100, nSteps: 6, x0: 150, x1: 1850, spread: 110, desk: [1500, 900], official: [880, 1200, 720], clerk: [1500, 930, 620] };
  function stepsWorld(t, B = [-3000, -2000, 5000, 3000]) {   // B: the bounds of the sky and ground (a page edge, in shot 17)
    boilSeed('stsky'); paint(rectPts(B[0], B[1], B[2] - B[0], B[3] - B[1]), { wash: '#CFE6F5', ink: null });
    paint(rectPts(B[0], B[1], B[2] - B[0], 200 - B[1]), { fill: C.sky, fillOp: 60, bleed: .3, tex: .4, ink: null });
    glow(1700, -300, 900, '#FFF1B8', .8);
    // the building: wall, a big door, four columns, the entablature
    boilSeed('building');
    paint(rectPts(200, 0, 1600, ST.top, 4), { wash: '#EDE6D6', fill: C.grey, fillOp: 35, tex: .5, ink: PAL.ink, sw: 4 });
    paint(rrPts(880, 420, 240, ST.top - 420, 20, 4), { wash: '#6E7781', fill: PAL.ink, fillOp: 50, tex: .5, ink: PAL.ink, sw: 4 });
    for (const cx of [400, 800, 1200, 1600]) { paint(rectPts(cx - 55, 90, 110, ST.top - 90, 4), { wash: PAL.cream, fill: C.grey, fillOp: 45, tex: .6, ink: PAL.ink, sw: 4 });
      for (const fx of [-30, 0, 30]) inkLine([[cx + fx, 130], [cx + fx + jit(2), ST.top - 30]], 2, mixCol(C.grey, PAL.ink, .2), 'inkfine', .1);
      paint(rectPts(cx - 70, 60, 140, 40, 3), { wash: PAL.cream, ink: PAL.ink, sw: 3.5 }); paint(rectPts(cx - 70, ST.top - 40, 140, 40, 3), { wash: PAL.cream, ink: PAL.ink, sw: 3.5 }); }
    paint(rectPts(150, -40, 1700, 100, 4), { wash: PAL.cream, fill: C.grey, fillOp: 40, tex: .6, ink: PAL.ink, sw: 4 });
    // the platform and the steps, each wider than the last
    boilSeed('steps');
    for (let i = 0; i < ST.nSteps; i++) {
      const y = ST.top + i * ST.stepH, xa = ST.x0 - i * ST.spread, xb = ST.x1 + i * ST.spread;
      paint([[xa, y], [xb, y], [xb + ST.spread, y + ST.stepH], [xa - ST.spread, y + ST.stepH]], { wash: i % 2 ? '#E6DCC6' : '#EFE7D3', fill: C.sandDk, fillOp: 30, tex: .5, ink: PAL.ink, sw: 3.5 });
      inkLine([[xa, y + 36], [xb, y + 36]], 2.2, mixCol(C.sandDk, PAL.ink, .3), 'inkfine', 0);
    }
    const gy = ST.top + ST.nSteps * ST.stepH;
    boilSeed('stground'); paint(rectPts(B[0], gy, B[2] - B[0], B[3] - gy), { wash: '#D9D2C8', fill: mixCol('#D9D2C8', PAL.ink, .3), fillOp: 40, bleed: .1, tex: .6, ink: null });
    inkLine([[B[0], gy], [1000, gy + 3], [B[2], gy]], 3, PAL.ink, 'ink', .2);
  }
  // the desk on the platform (drawn after the clerk, who sits behind it)
  function deskProp() {
    boilSeed('desk'); const [dx, dy] = ST.desk;
    paint(rectPts(dx - 170, dy - 140, 340, 140, 4), { wash: C.wood, fill: C.woodDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 3.5 });
    paint([[dx - 170, dy - 140], [dx + 170, dy - 140], [dx + 190, dy - 170], [dx - 150, dy - 170]], { wash: mixCol(C.wood, PAL.cream, .35), ink: PAL.ink, sw: 3.5 });
  }
  // Balloons on strings, bobbing on the beat, and confetti drifting down.
  function party(t, k = 1) {
    boilSeed('balloons');
    [[-150, 760, C.coral], [-60, 640, C.sun], [2080, 700, PAL.teal], [2170, 600, C.coral], [2240, 780, C.sun]].forEach(([bx, by, col], i) => {
      const bob = -18 * Math.abs(Math.sin(bpOf(t) * Math.PI + i)), sway = 12 * Math.sin(t * 1.3 + i);
      inkLine([[bx, 1500], [bx + sway * .5, lerp(1500, by + bob + 70, .5)], [bx + sway, by + bob + 70]], 2, PAL.ink, 'inkfine', .5);
      paint(ellPts(bx + sway, by + bob, 62, 76, 18, 2), { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 45, tex: .5, ink: PAL.ink, sw: 3 });
      paint([[bx + sway - 10, by + bob + 72], [bx + sway + 10, by + bob + 72], [bx + sway, by + bob + 60]], { wash: col, ink: PAL.ink, sw: 2 });
    });
    boilSeed('confetti');
    const cols = [C.sun, C.coral, PAL.teal, C.sky, PAL.rose];
    for (let i = 0; i < 70; i++) {
      const x0 = -1200 + 4400 * hash(i), sp = 60 + 60 * hash(i + 50), y = ((hash(i + 100) * 2600 + t * sp) % 2600) - 500, x = x0 + 40 * Math.sin(t * 2 + i);
      push(); translate(x, y); rotate(t * 3 + i); paint(rectPts(-14, -8, 28, 16, 1), { wash: cols[i % 5], washOp: 255 * k, ink: null }); pop();
    }
  }
  // The quill: a feather in a hand at (x, y), pointing up-right; writing wiggles it.
  function quill(x, y, rot = -.9) {
    boilSeed('quill'); push(); translate(x, y); rotate(rot);
    paint(ribbon([[0, 0], [60, -8], [130, -4], [190, 10]], 8, 44), { wash: PAL.cream, fill: C.grey, fillOp: 50, tex: .5, ink: PAL.ink, sw: 2.2 });
    inkLine([[0, 0], [190, 8]], 1.6, PAL.ink, 'inkfine', .2);
    paint([[0, -5], [-26, 0], [0, 5]], { wash: PAL.ink, ink: null });
    pop();
  }
  // The scroll: unrolls from the desk down the steps toward the camera; k = 0..1 how far, with squiggles along it.
  const scrollPath = [[1450, 740], [1440, 900], [1400, 1100], [1350, 1300], [1300, 1500], [1270, 1700], [1250, 1950]];
  function scroll(k) {
    if (k <= 0) return;
    boilSeed('scroll');
    const n = scrollPath.length - 1, L = k * n, pts = [];
    for (let i = 0; i <= Math.floor(L); i++) pts.push(scrollPath[i]);
    const i = Math.floor(L), f = L - i; if (i < n) pts.push([lerp(scrollPath[i][0], scrollPath[i + 1][0], f), lerp(scrollPath[i][1], scrollPath[i + 1][1], f)]);
    if (pts.length < 2) return;
    paint(ribbon(pts, 170, 170 + 60 * k), { wash: PAL.cream, fill: C.sandDk, fillOp: 25, tex: .5, ink: PAL.ink, sw: 3 });
    const C2 = through(pts, 4);
    for (let j = 2; j < C2.length - 1; j += 2) { const [px, py] = C2[j]; inkLine([[px - 60, py], [px + 20 + 40 * hash(j), py + jit(2)]], 2.4, PAL.ink, 'inkfine', .3); }
    const e = pts[pts.length - 1]; paint(ellPts(e[0], e[1], 100 + 30 * k, 34, 18, 2), { wash: PAL.cream, fill: C.sandDk, fillOp: 40, tex: .5, ink: PAL.ink, sw: 3 });
  }

  // ---------- Shot 5: holding it (39.4–47.95) ----------
  // The grey hand finishes the lift: Pim held up like a trophy. The camera eases back: the official on the steps of
  // a columned building, posing with Pim; the three builders in a row, clapping. Further: the desk at the top of the
  // steps, where a clerk's quill signs a scroll that unrolls down the steps. Balloons, confetti. The official waves
  // Pim at the crowd; the quill lifts. Push in on Pim: one blink to camera. A press flash grows into the cut.
  function holding(t, lt, dur) {
    const [ox, oy, oh] = ST.official, [kx, ky, kh] = ST.clerk;
    const liftK = easeOut(seg(lt, 0, .5)), wave = seg(lt, 5.1, 7.0);
    const handX = ox + .26 * oh + 50 * Math.sin(wave * TAU * 1.5) * Math.sin(wave * Math.PI), handY = lerp(350, 230, liftK) - 25 * Math.sin(wave * TAU * 1.5) * Math.sin(wave * Math.PI);
    const c = kf(lt, [[1.2, [handX, 230 - 270, 1.45]], [5.1, [1000, 760, .42]], [7.1, [1000, 760, .42]], [8.55, [handX, handY - 80, .85]]]);
    camBegin(lt < 1.2 ? handX : c[0], lt < 1.2 ? 230 - 270 : c[1], c[2]);   // the camera holds while the hand rises into frame
    stepsWorld(t);
    // the clerk at the desk, writing until the pull-back has shown the scroll, then lifting the quill
    const writing = lt < 5.1, lift = easeOut(seg(lt, 5.1, 5.6));
    const qx = kx + 60 + (writing ? 14 * Math.sin(t * 14) : 0), qy = ky - .62 * kh + (writing ? 6 * Math.cos(t * 14) : 0) - 120 * lift;
    person(kx, ky, kh, { seed: 7, coat: '#7E8893', trim: '#5A636D', hair: '#3A3340', hands: [[kx - 90, ky - .64 * kh], [qx, qy]], look: writing ? [-.4, .9] : [0, -.6], mouth: writing ? 'flat' : 'smile' });
    deskProp();
    quill(qx, qy, writing ? -.9 : -1.4);
    scroll(ease(seg(lt, 3.1, 5.1)));
    party(t);
    // the official, holding Pim up in the right hand
    person(ox, oy, oh, { seed: 6, coat: '#9AA3AE', trim: '#6E7781', hair: '#4A4046', hands: [[ox - .3 * oh, oy - .45 * oh + 30 * Math.sin(t * 2)], [handX, handY]], look: lt < 5.1 ? [.6, -.9] : [0, .3], mouth: 'smile' });
    const blink = lt > 7.9 && lt < 8.1 ? Math.sin(seg(lt, 7.9, 8.1) * Math.PI) : 0;
    pim(handX, handY - 28, 26, { ...pimFeel('neutral', t), aL: .9, aR: .9, bulb: 1, lookX: lt < 5.1 ? -.6 : 0, lookY: lt < 5.1 ? .8 : 0, squint: blink, rot: .06 * Math.sin(wave * TAU * 1.5) * Math.sin(wave * Math.PI) });
    // the builders in a row at the bottom of the steps, clapping (each on its own beat phase)
    [[-150, 1, '#5B4636'], [170, 2, '#2B2233'], [490, 3, '#8C6A4A']].forEach(([bx, sd, hair], i) => {
      const gy = ST.top + ST.nSteps * ST.stepH, h = 780, cl = pulse(t + i * .11, 7), d = 25 + 70 * (1 - cl);
      person(bx, gy, h, { seed: sd, hair, hands: [[bx - d, gy - .58 * h], [bx + d, gy - .58 * h]], look: [1, -.6], mouth: 'o' });
    });
    camEnd();
    flash(easeIn(seg(lt, 8.25, dur)));
  }

  // ---------- office props ----------
  function cardboardBox(x, y, w, h, key = 'box') {
    boilSeed(key);
    paint(rectPts(x - w / 2, y - h, w, h, 3), { wash: C.sandDk, fill: C.dark, fillOp: 35, tex: .6, ink: PAL.ink, sw: 2.4 });
    paint(rectPts(x - 8, y - h, 16, h, 1), { wash: C.sand, ink: null });
    inkLine([[x - w / 2, y - h + 18], [x + w / 2, y - h + 18]], 1.6, mixCol(C.sandDk, PAL.ink, .3), 'inkfine', 0);
  }
  // A worker's desk with a mug and a plant; x = left edge, y = floor. wob = mug wobble, sway = plant sway.
  function officeDesk(x, y, wob = 0, sway = 0, key = 'desk') {
    boilSeed(key);
    const w = 300, top = y - 160;
    for (const lx of [x + 20, x + w - 44]) paint(rectPts(lx, top + 20, 24, y - top - 20, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2 });
    paint(rectPts(x, top, w, 26, 3), { wash: C.wood, fill: C.woodDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 2.6 });
    paint(rectPts(x + w - 130, top + 26, 110, 70, 2), { wash: C.wood, fill: C.woodDk, fillOp: 50, ink: PAL.ink, sw: 2 });
    push(); translate(x + 70, top); rotate(wob);
    paint(rrPts(-22, -46, 44, 46, 8, 2), { wash: C.coral, ink: PAL.ink, sw: 2 }); paint(ellPts(28, -26, 12, 14, 10), { ink: PAL.ink, sw: 2.2 }); pop();
    push(); translate(x + 220, top); rotate(sway * .15);
    paint([[-26, 0], [26, 0], [20, -40], [-20, -40]], { wash: C.coral, fill: '#B8513A', fillOp: 50, ink: PAL.ink, sw: 2 });
    for (const [a, l] of [[-.9, 60], [-.3, 80], [.4, 70], [1.0, 55]]) paint(ellPts(Math.sin(a) * l * .5, -40 - Math.cos(a) * l * .5, 12, l * .5, 12, 1, a), { wash: PAL.sap, fill: '#4E7A3C', fillOp: 50, ink: PAL.ink, sw: 1.6 });
    pop();
  }
  // A press flash: light and a painted burst at (x, y), k = 0..1 age.
  function pressFlash(x, y, k) {
    if (k <= 0 || k >= 1) return;
    glow(x, y, 420 * (1 - k * .5), '#FFFFFF', 1 - k);
    boilSeed('burst'); paint(starPts(x, y, 90 * (1 - k), .45, 8, k * 2), { wash: PAL.cream, washOp: 255 * (1 - k), ink: null });
  }

  // ---------- Shot 6: the desk (47.95–56.5) ----------
  // On a sunny office floor Pim shoves a desk out of frame while a worker with a box waves a small goodbye; Pim
  // dusts its hands, proud. Then the pull-back: the floor is a giant screen on a stage behind the executive, who
  // points at it and at the press; flashes in the pit; left, workers with boxes file toward the exit; right, a
  // chute pours coins into a heap in front of a row of investors clapping in unison. Pim, on the screen, sees it.
  const S6 = { floor: 860, stage: 1500, hall: 1640, exec: [1700, 1500, 850], lectern: [1400, 1500] };
  // the hall: wall, floor, the stage platform and the screen's frame (the screen content is painted after it)
  function hallBack() {
    boilSeed('hall'); paint(rectPts(-3000, -2000, 8000, S6.hall + 2000), { wash: C.greyLt, ink: null });
    paint(rectPts(-3000, -2000, 8000, 2200), { fill: '#2F3C7A', fillOp: 30, bleed: .3, tex: .4, ink: null });
    boilSeed('hallfloor'); paint(rectPts(-3000, S6.hall, 8000, 2000), { wash: '#C9C2B8', fill: mixCol('#C9C2B8', PAL.ink, .3), fillOp: 40, bleed: .1, tex: .6, ink: null });
    boilSeed('stage'); paint(rectPts(-500, S6.stage, 3000, S6.hall - S6.stage, 4), { wash: C.woodDk, fill: PAL.ink, fillOp: 40, tex: .6, ink: PAL.ink, sw: 4 });
    paint(rectPts(-500, S6.stage - 24, 3000, 28, 3), { wash: C.wood, ink: PAL.ink, sw: 4 });
    paint(rectPts(-70, -70, 2060, 1220, 4), { wash: '#4A5566', fill: PAL.ink, fillOp: 50, tex: .5, ink: PAL.ink, sw: 5 });
  }
  // the screen's content: a sunny office floor, 1920 x 1080 in world units
  function screenOffice() {
    boilSeed('office'); paint(rectPts(0, 0, 1920, S6.floor), { wash: PAL.cream, ink: null });
    paint(ellPts(960, 300, 700, 500, 36, 30), { fill: C.sun, fillOp: 50, bleed: .35, tex: .5, ink: null });
    glow(960, 260, 600, '#FFE9A8', .5);
    boilSeed('officefloor'); paint(rectPts(0, S6.floor, 1920, 1080 - S6.floor), { wash: C.sun, fill: PAL.ochre, fillOp: 55, bleed: .15, tex: .6, ink: null });
    inkLine([[0, S6.floor + 2], [960, S6.floor], [1920, S6.floor + 3]], 1.6, PAL.ink, 'ink', .3);
  }
  function lectern6() {
    boilSeed('lectern6'); const [lx, ly] = S6.lectern;
    paint(rectPts(lx - 100, ly - 300, 200, 300, 3), { wash: C.wood, fill: C.woodDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 3.5 });
    paint([[lx - 100, ly - 300], [lx + 100, ly - 300], [lx + 120, ly - 330], [lx - 80, ly - 330]], { wash: mixCol(C.wood, PAL.cream, .35), ink: PAL.ink, sw: 3.5 });
    inkLine([[lx + 60, ly - 330], [lx + 80, ly - 420]], 4, PAL.ink, 'ink', .2); paint(ellPts(lx + 84, ly - 432, 18, 22, 10), { wash: PAL.ink, ink: null });   // the mic
  }
  // the row of investors, clapping exactly together (lean tilts them toward the stage, clap 0..1 = hands together)
  function investors(t, lean = 0, clapK = null, clapH = .58) {
    for (let i = 0; i < 4; i++) { const ix = 2330 + i * 260, ih = 600, iy = S6.hall + 260, cl = clapK ?? pulse(t, 7), d = 25 + 60 * (1 - cl);
      person(ix, iy, ih, { seed: 30 + i, coat: '#6E7781', trim: '#4A5566', tie: PAL.ochre, hair: '#2B2233', hands: [[ix - d, iy - clapH * ih], [ix + d, iy - clapH * ih]], look: [-.6, -.3], mouth: 'smile', lean }); }
  }
  function desk(t, lt, dur) {
    const shove = .45, letGo = 1.55, waveT = 1.8, deskOut = 3.0, dust = 3.05, pull = 4.25, pullEnd = 7.05, seeIt = 7.05, toCam = 7.9;
    const c = kf(lt, [[pull, [960, 540, 1]], [pullEnd, [960, 980, .42]]]);
    camBegin(c[0], c[1], c[2]);

    // the hall around the screen (painted first; the screen content goes on top inside its rectangle)
    if (lt > pull - .2) {
      hallBack();
    }
    // the screen content: the sunny office floor, the desk, the worker, Pim
    screenOffice();
    const deskX = kf(lt, [[shove, 700], [deskOut + .3, 2250]], ease);
    const wob = .25 * spring(lt, shove, 3, 20), sway = Math.sin(lt * 4) * seg(lt, shove, shove + .3);
    if (deskX < 1950) officeDesk(deskX, S6.floor, wob, sway);
    // the worker with the box: waves a small sad goodbye, then walks off right
    { const wx = kf(lt, [[deskOut, 1560], [deskOut + .7, 2350]]), wh = 660, wy = S6.floor;
      if (wx < 2200) { const wave = lt > waveT && lt < deskOut ? 1 : 0, wv = Math.sin(lt * 10) * .25;
        const hands = [[wx - .16 * wh, wy - .5 * wh], [wave ? wx + .3 * wh : wx + .2 * wh, wave ? wy - .82 * wh + 30 * wv : wy - .4 * wh]];
        person(wx, wy, wh, { seed: 8, coat: '#9AA3AE', trim: '#6E7781', hair: '#5B4636', hands, look: lt < waveT ? [-1, .4] : [-1, .6], mouth: 'flat', bob: 0 });
        cardboardBox(wx - .16 * wh + 10, wy - .5 * wh + 70, 150, 130); } }
    // Pim: the wind-up, the shove, the walk behind the desk, the wave, the dust-off, then the reaction to the reveal
    const moodP = pimEmotions(lt, [
      [0, 'determined', { lookX: 1 }],
      [letGo, 'happy', { lookX: 1 }],
      [dust, 'proud'],
      [seeIt, 'surprised', { lookX: -.6, lookY: .9 }],
      [toCam, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const pushing = lt < letGo, pimX = lt < shove ? 560 - 40 * easeIn(seg(lt, 0, shove)) : pushing ? deskX - 150 : kf(lt, [[letGo, deskX - 150], [dust, 1000]]);
    let view = pushing || lt < dust ? { view: 'side', flip: false } : turn(lt, dust, dust + .2, .25, 0);
    const lean = lt < shove ? -.18 * easeIn(seg(lt, 0, shove)) : pushing ? .22 : 0;
    const pose = { ...moodP, ...view, bulb: 1, rot: (moodP.rot || 0) + lean, walk: pushing && lt > shove ? lt * 7 : null, dy: moodP.dy + (pushing && lt > shove ? -.3 * Math.abs(Math.sin(lt * 22)) : 0) };
    if (lt > waveT && lt < deskOut) pose.aL = 1.2 + .3 * Math.sin(lt * 12);
    else if (lt >= dust && lt < dust + .6) { const k = Math.sin((lt - dust) * 24); pose.aL = -.4 + .4 * k; pose.aR = -.4 - .4 * k; }
    pim(pimX, S6.floor, 28, pose);

    // the stage: lectern, the executive pointing, the press pit, the workers' line, the coin chute and investors
    if (lt > pull - .2) {
      const [ex, ey, eh] = S6.exec;
      lectern6();
      person(ex, ey, eh, { seed: 9, coat: '#2F3C7A', trim: PAL.ochre, tie: PAL.ochre, hair: '#3A3340', hands: [[1250, 790], [ex + .32 * eh, ey - .3 * eh]], look: [-.8, -.2], mouth: 'o' });
      // the press pit: backs of heads with cameras, and flashes on the beats while the camera shows them
      boilSeed('pit');
      for (let i = 0; i < 7; i++) { const px = 200 + i * 260 + 40 * hash(i), py = S6.hall + 180 + 60 * hash(i + 9);
        paint(ellPts(px, py, 70, 80, 16, 3), { wash: '#4A5566', ink: PAL.ink, sw: 3 }); paint(rrPts(px - 110, py + 60, 220, 160, 40, 4), { wash: '#3C4656', ink: PAL.ink, sw: 3 });
        paint(rectPts(px + 40, py - 60, 70, 46, 2), { wash: PAL.ink, ink: null }); }
      if (lt > 5.85 && lt < 7.3) { const b = beatN(t), ph = frac(bpOf(t)); const i = ((b % 7) + 7) % 7; pressFlash(200 + i * 260 + 40 * hash(i) + 75, S6.hall + 120 + 60 * hash(i + 9), ph * 1.6); }
      // the workers' line, boxes in arms, filing left toward the exit door
      boilSeed('exit'); paint(rrPts(-1700, S6.hall - 760, 240, 760, 16, 4), { wash: C.dark, ink: PAL.ink, sw: 4 }); glow(-1580, S6.hall - 380, 420, '#FFD27A', .6);
      for (let i = 0; i < 5; i++) { const wx = -520 - i * 200 - (lt - pull) * 70, wh = 600, wy = S6.hall, st = stroll(lt, -1, 99, 0, -1000, 20);
        person(wx, wy, wh, { seed: 20 + i, coat: '#9AA3AE', trim: '#6E7781', hair: ['#5B4636', '#2B2233', '#8C6A4A', '#3A3340', '#5B4636'][i], hands: [[wx - .2 * wh, wy - .48 * wh], [wx + .05 * wh, wy - .5 * wh]], look: [-1, .3], mouth: 'flat' });
        cardboardBox(wx - .08 * wh, wy - .48 * wh + 70, 150, 130, 'box' + i); }
      // the chute, the coins, the heap and the investors, who clap exactly together
      boilSeed('chute'); paint([[3100, 200], [3200, 260], [2720, 1560], [2620, 1500]], { wash: '#9AA3AE', fill: '#4A5566', fillOp: 50, tex: .5, ink: PAL.ink, sw: 4 });
      for (let i = 0; i < 9; i++) { const k = frac(t * .7 + i / 9), cx = lerp(3130, 2660, k), cy = lerp(240, 1520, k); paint(ellPts(cx, cy, 26, 20, 10, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 2 }); }
      investors(t);
      boilSeed('heap'); paint(ellPts(2620, 1960, 320, 120, 24, 6), { wash: PAL.ochre, fill: '#B07A1A', fillOp: 60, tex: .6, ink: PAL.ink, sw: 3.5 });
      for (let i = 0; i < 14; i++) paint(ellPts(2470 + 300 * hash(i + 30), 1880 + 90 * hash(i + 60), 26, 20, 10, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 2 });
    }
    camEnd();
    flash(1 - seg(lt, 0, .4));
  }

  // ---------- Shot 7: two cards (56.5–65.1) ----------
  // Medium on the executive at the lectern, Pim beside the mic. Two big cards come up, one hand a beat late: one
  // painted with Pim's cheerful face, one with a line drooping off the bottom. The executive weighs them, the
  // investors lean in; the Pim card goes up high and the row claps; the line card slides edge-on behind the back.
  // Pim's eyes follow it, then come to camera.
  function card(x, y, kind, sx = 1, rot = 0, bright = 0) {
    boilSeed('card ' + kind); push(); translate(x, y); rotate(rot); scale(sx, 1);
    if (bright > 0) glow(0, -200, 420, '#FFE9A8', bright);
    paint(rrPts(-150, -400, 300, 400, 18, 3), { wash: PAL.cream, fill: C.sandDk, fillOp: 25, tex: .5, ink: PAL.ink, sw: 3.5 });
    if (kind === 'pim') pim(0, -110, 20, { ...pimFeel('happy', 0), dy: 0, sq: 0, rot: 0, aL: .4, aR: .4, noShadow: true, bulb: 1, antSway: 0, seed: 3, boilKey: 'cardpim' });
    else { inkLine([[-110, -250], [-40, -240], [30, -230], [80, -200], [105, -120], [115, -20]], 5, '#C8324A', 'ink', .5); paint([[95, -40], [135, -40], [115, 0]], { wash: '#C8324A', ink: null }); }
    pop();
  }
  function cards(t, lt, dur) {
    const upL = .35, upR = .9, weigh = 1.5, high = 3.3, slide = 5.0, toCam = 6.8;
    camBegin(1640, 900, .8);
    hallBack(); screenOffice(); lectern6();
    const [ex, ey, eh] = S6.exec;
    // the cards' positions: swing up, bob while weighed, one goes high, the other goes edge-on behind the back
    const kL = backOut(seg(lt, 0, upL)), kR = backOut(seg(lt, upR - .35, upR));
    const look = lt < weigh ? [-.6, .2] : lt < high ? [Math.sin((lt - weigh) * 7) > 0 ? 1 : -1, -.2] : lt < slide ? [-.6, -.7] : [0, .2];
    const bobL = lt > weigh && lt < high && look[0] < 0 ? -30 : 0, bobR = lt > weigh && lt < high && look[0] > 0 ? -30 : 0;
    const hiK = backOut(seg(lt, high, high + .45));
    const handL = [lerp(1450, 1500, hiK), lerp(lerp(1250, 760, kL) + bobL, 580, hiK)];
    const slK = ease(seg(lt, slide, slide + .9));
    const handR = [lerp(2000, ex + 40, slK), lerp(lerp(1300, 780, kR) + bobR, ey - .55 * eh, slK)];
    const behind = slK > .55;
    if (behind) card(handR[0], handR[1] + 60, 'droop', .12 + .88 * (1 - seg(slK, .55, 1)), .2);
    person(ex, ey, eh, { seed: 9, coat: '#2F3C7A', trim: PAL.ochre, tie: PAL.ochre, hair: '#3A3340', hands: [handL, handR], look, mouth: lt < weigh ? 'o' : lt < slide ? 'smile' : 'smile' });
    if (lt > 0) card(handL[0], handL[1] + 60, 'pim', 1, -.08, lt > high ? .9 : 0);
    if (lt > upR - .35 && !behind) card(handR[0], handR[1] + 60, 'droop', 1 - .5 * slK, .08 + .3 * slK);
    // the investors: lean in while the executive weighs, clap when the Pim card goes up
    const lean = -.14 * ease(seg(lt, weigh, weigh + .5)) * (1 - ease(seg(lt, high, high + .4)));
    investors(t, lean, lt > high && lt < slide + .5 ? pulse(t, 7) : 0, .8);   // chest-high, so the clap is in frame
    // Pim beside the mic: watches the cards, follows the line card out of sight, then to camera
    const pimX = 1340, pimY = S6.lectern[1] - 310;
    const target = lt < high ? handL : lt < slide ? handL : handR;
    const dxT = target[0] - pimX, dyT = target[1] - (pimY - 150);
    const mood = pimEmotions(lt, [
      [0, 'surprised', { lookX: .8, lookY: -.8 }],
      [weigh, 'thinking', { emote: null }],
      [high, 'confused', { lookX: .4, lookY: -1 }],
      [slide, 'suspicious'],
      [toCam, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const blink = lt > 7.8 && lt < 8.0 ? Math.sin(seg(lt, 7.8, 8.0) * Math.PI) : 0;
    const pose = { ...mood, bulb: 1, squint: blink };
    if (lt >= weigh && lt < toCam) { pose.lookX = clamp(dxT / 600, -1, 1); pose.lookY = clamp(dyT / 400, -1, 1); pose.dx = 0; }
    pim(pimX, pimY, 24, pose);
    camEnd();
    if (lt > dur - .25) { const k = seg(lt, dur - .25, dur); const [cx, cy] = toScreen(2620, 1960, LAST_CAM); iris(cx, cy, lerp(2400, 0, easeIn(k)), PAL.ochre); }
  }

  // ---------- Shot 8: the scale (65.1–73.7) ----------
  // A giant balance scale on the stage: tiny workers with boxes on the left pan, coins on the right. The executive
  // chops a hand down and the scale tilts; then coins drop in on every beat, the coin pan sinks, the worker pan
  // rises, and the workers slide off it one by one, land, and walk off left waving. Pim stands under the scale
  // following the pans like a tennis match, goes dizzy, and shakes it off.
  const S8 = { pivot: [960, 690], arm: 600, hang: 260, exec: [1780, 1500, 850], exit: [40, 1500] };
  const coinTimes = [3.8, 4.34, 4.87, 5.41, 5.95];                 // on the beats of bars 32–33
  const leaveTimes = [2.1, 2.45, 2.8, 4.0, 4.45, 4.9, 5.35, 5.8];  // when each worker slides off the rising pan
  function balance(t, lt, dur) {   // not 'scale': that would shadow p5's scale() for the whole scene file
    const chop = 1.5, dizzy = 6.4, shakeOff = 7.6;
    camBegin(900, 1080, .85);
    hallBack(); screenOffice();
    // the tilt: k = 0 level, 1 = coin pan fully down. A spring kick at the chop and at every coin.
    let k = .06 * Math.sin(t * 1.2);
    if (lt > chop) k += .4 * ease(seg(lt, chop, chop + .5)) + .12 * spring(lt, chop + .1, 4, 14);
    coinTimes.forEach(ct => { const land = ct + .3; if (lt > land) k += .11 * ease(seg(lt, land, land + .35)) + .05 * spring(lt, land, 5, 16); });
    k = clamp(k, -.2, 1);
    const th = .36 * k, [px, py] = S8.pivot;
    const L = [px - S8.arm * Math.cos(th), py - S8.arm * Math.sin(th)], R = [px + S8.arm * Math.cos(th), py + S8.arm * Math.sin(th)];
    const panL = [L[0], L[1] + S8.hang], panR = [R[0], R[1] + S8.hang];
    // the post and the beam
    boilSeed('scale'); paint(rectPts(px - 36, py, 72, 1500 - py, 3), { wash: C.woodDk, fill: PAL.ink, fillOp: 35, tex: .6, ink: PAL.ink, sw: 4 });
    paint(rectPts(px - 120, 1470, 240, 34, 3), { wash: C.woodDk, ink: PAL.ink, sw: 4 });
    push(); translate(px, py); rotate(th); paint(rrPts(-S8.arm - 24, -20, 2 * S8.arm + 48, 40, 16, 3), { wash: C.wood, fill: C.woodDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 4 }); pop();
    paint(ellPts(px, py, 26, 26, 14, 2), { wash: PAL.ochre, ink: PAL.ink, sw: 3.5 });
    const pan = (e, p, key) => { boilSeed(key); for (const dx of [-180, 0, 180]) inkLine([[e[0], e[1]], [p[0] + dx, p[1] - 10]], 3, PAL.ink, 'inkfine', 0);
      paint(ellPts(p[0], p[1] + 12, 230, 46, 26, 3), { wash: PAL.ochre, fill: '#B07A1A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 4 }); paint(ellPts(p[0], p[1] - 6, 218, 32, 26, 3), { wash: '#F2C53D', ink: PAL.ink, sw: 3 }); };
    pan(L, panL, 'panL'); pan(R, panR, 'panR');
    // the coins: a few already on the pan, more arriving from the executive's hand on the beats
    const [ex, ey, eh] = S8.exec;
    const handR = [panR[0] + 20, Math.min(panR[1] - 330, ey - .9 * eh)];
    let nCoins = 3; const inFlight = [];
    coinTimes.forEach(ct => { if (lt > ct + .3) nCoins++; else if (lt > ct) inFlight.push(seg(lt, ct, ct + .3)); });
    boilSeed('coins'); for (let i = 0; i < nCoins; i++) paint(ellPts(panR[0] - 90 + 60 * (i % 4) + 10 * hash(i), panR[1] - 14 - 16 * Math.floor(i / 4), 30, 18, 12, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 2.6 });
    inFlight.forEach((f, i) => { const c = [lerp(handR[0], panR[0], f), lerp(handR[1] + 30, panR[1] - 20, easeIn(f))]; paint(ellPts(c[0], c[1], 30, 18 + 10 * Math.sin(f * 9), 12, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 2.6 }); });
    // the workers: on the pan until their time, then an arc to the floor and a walk off left, waving
    for (let i = 0; i < 8; i++) {
      const slot = [-150, -75, 0, 75, 150, -110, -37, 37][i], row = i < 5 ? 0 : 1, wh = 150, leave = leaveTimes[i];
      let wx, wy, wave = 0, hands;
      if (lt < leave) { wx = panL[0] + slot + 3 * Math.sin(t * 3 + i); wy = panL[1] - 6 - row * 14; }
      else { const f = seg(lt, leave, leave + .7), land = [330 - i * 20, 1500], a = arcPt([panL[0] + slot, panL[1] - 6 - row * 14], land, 120, ease(f));
        wx = f < 1 ? a[0] : land[0] - (lt - leave - .7) * 130; wy = f < 1 ? a[1] : 1500; wave = f < 1 ? 0 : 1; }
      if (wx < 150) continue;   // gone through the exit door (drawn after them)
      hands = [[wx - .18 * wh, wy - .5 * wh], wave ? [wx + .3 * wh, wy - .85 * wh + 8 * Math.sin(lt * 11 + i)] : [wx + .1 * wh, wy - .5 * wh]];
      person(wx, wy, wh, { seed: 40 + i, coat: '#9AA3AE', trim: '#6E7781', hair: ['#5B4636', '#2B2233', '#8C6A4A', '#3A3340'][i % 4], hands, look: wave ? [1, -.2] : [1, -1], mouth: wave ? 'smile' : 'o', bob: 0 });
      cardboardBox(wx - .05 * wh, wy - .5 * wh + 18, 36, 32, 'wbox' + i);
    }
    // the executive: a chop with the left hand, then coins from the right hand on the beats
    const chopK = lt > chop ? Math.sin(clamp((lt - chop) / .25) * Math.PI / 2) * (1 - ease(seg(lt, chop + .6, chop + 1.1))) : 0;
    const handL = [ex - .42 * eh, lerp(ey - .72 * eh, ey - .45 * eh, chopK)];
    const dropK = coinTimes.reduce((a, ct) => Math.max(a, lt > ct - .15 && lt < ct + .2 ? Math.sin(seg(lt, ct - .15, ct + .2) * Math.PI) : 0), 0);
    person(ex, ey, eh, { seed: 9, coat: '#2F3C7A', trim: PAL.ochre, tie: PAL.ochre, hair: '#3A3340', hands: [handL, [handR[0], handR[1] + 40 * dropK]], look: lt < chop ? [-1, -.3] : lt < 3.6 ? [-1, .4] : [-.4, .6], mouth: lt > chop && lt < chop + 1 ? 'o' : 'smile' });
    // Pim under the scale: head tracking the pans, then dizzy, then shaking it off
    const trackX = lt < chop ? -.6 : lt < dizzy ? (k > .2 ? Math.sin(lt * 5.9) : -.8) : 0;
    const mood = pimEmotions(lt, [
      [0, 'surprised', { lookX: -.6, lookY: -1, emote: null }],
      [chop + .2, 'confused', { lookX: -1, lookY: -1 }],
      [3.6, 'thinking', { lookY: -1, emote: null }],
      [dizzy, 'dizzy'],
      [shakeOff, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const shake = lt > shakeOff && lt < shakeOff + .5 ? .16 * Math.sin((lt - shakeOff) * 36) * (1 - seg(lt, shakeOff + .3, shakeOff + .5)) : 0;
    const pose = { ...mood, bulb: 1, rot: (mood.rot || 0) + shake + (lt > chop && lt < dizzy ? .08 * trackX : 0) };
    if (lt > chop && lt < dizzy) { pose.lookX = trackX; pose.lookY = -1; }
    pim(px - 150, 1500, 24, pose);
    // the exit door at stage left, drawn last so the workers walk into it
    boilSeed('exit8'); paint(rrPts(S8.exit[0], S8.exit[1] - 440, 220, 440, 14, 4), { wash: C.dark, ink: PAL.ink, sw: 4 }); glow(S8.exit[0] + 110, S8.exit[1] - 220, 300, '#FFD27A', .6);
    camEnd();
    if (lt < .4) iris(960, 760, lerp(0, 2400, easeOut(lt / .4)), PAL.ochre);
  }

  // ---------- Shot 9: the ledger (73.7–82.24) ----------
  // Close-medium on Pim. A navy sleeve hands in a scroll: a drooping line, a little heap of coins, squiggles. Pim
  // studies it (dots), its bulb lights, and a thought bubble pops in over its head with the very same drawing in it.
  // Page, bubble, page: a slow double take. Then to camera, bored. The bubble pops. A coral wipe takes us out.
  // The ledger drawing, around (0, 0), s = scale (1 = a 260 x 180 sheet).
  function ledgerArt(s, key = 'ledgerart') {
    boilSeed(key); push(); scale(s, s);
    inkLine([[-100, -50], [-50, -46], [-5, -30], [25, 0], [40, 40]], 4, '#C8324A', 'ink', .5); paint([[28, 26], [56, 30], [40, 56]], { wash: '#C8324A', ink: null });
    for (let i = 0; i < 5; i++) paint(ellPts(70 + 22 * (i % 3) - 10 * Math.floor(i / 3), -30 + 14 * Math.floor(i / 3) - 10, 16, 10, 10, .5), { wash: PAL.ochre, ink: PAL.ink, sw: 1.6 });
    for (let i = 0; i < 3; i++) { const y = 60 + i * 14, x1 = -100 + 90 + 60 * hash(i + 7); inkLine([[-100, y], [(-100 + x1) / 2, y + jit(2)], [x1, y + jit(1)]], 2.4, PAL.ink, 'ink', .3); }   // three points: two-point splines vanish inside scale()
    pop();
  }
  function ledger(x, y, rot = 0, sc = .5, key = 'ledger') {
    boilSeed(key); push(); translate(x, y); rotate(rot); scale(sc, sc);
    paint(rrPts(-130, -90, 260, 180, 8, 2), { wash: PAL.cream, fill: C.sandDk, fillOp: 25, tex: .5, ink: PAL.ink, sw: 2.6 / sc });
    paint(ellPts(0, -92, 136, 16, 20, 1.5), { wash: PAL.cream, fill: C.sandDk, fillOp: 40, ink: PAL.ink, sw: 2.4 / sc });
    ledgerArt(1, key + 'art');
    pop();
  }
  // A horizontal sleeve from the right edge of frame, the hand at (x, y).
  function sleeveFromRight(x, y, coat, trim, key) {
    boilSeed('sleeveR ' + key);
    paint(rrPts(x + 20, y - 50, 700, 100, 40, 4), { wash: coat, ink: PAL.ink, sw: 2.6 });
    paint(rectPts(x + 56, y - 56, 30, 112, 3), { wash: trim, ink: PAL.ink, sw: 2.2 });
    paint(ellPts(x + 20, y, 44, 48, 16, 3), { wash: '#F2C9A8', fill: '#D99C78', fillOp: 40, tex: .5, ink: PAL.ink, sw: 2.6 });
  }
  function thoughtBubble(x, y, k, headX, headY) {
    const p = backOut(k); if (p < .02) return;
    boilSeed('bubble');
    for (const [f, r] of [[.3, 12], [.6, 18]]) paint(ellPts(lerp(headX, x, f), lerp(headY, y + 80, f), r * p, r * p, 12, 1), { wash: PAL.cream, ink: PAL.ink, sw: 2.2 });
    push(); translate(x, y); scale(p, p);
    const c = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, bump = 1 + .14 * Math.abs(Math.sin(a * 4)); c.push([Math.cos(a) * 150 * bump, Math.sin(a) * 105 * bump]); }
    paint(c, { wash: PAL.cream, fill: C.sky, fillOp: 25, tex: .4, ink: PAL.ink, sw: 2.6, curv: .4 });
    ledgerArt(.7, 'bubbleart');
    pop();
  }
  function thinking(t, lt, dur) {
    const handed = .6, taken = 1.4, study = 1.8, bulbOn = 3.2, bubbleT = 3.5, take2 = 4.9, camT = 6.7, pop = 6.9;
    const pimX = 720, pimY = 1500, u = 24;
    const cz = kf(lt, [[study, 1.7], [study + 1, 2.1], [3.0, 2.1], [bubbleT, 1.7]]), ccx = kf(lt, [[study, 860], [study + 1, 760], [3.0, 760], [bubbleT, 860]]), ccy = kf(lt, [[study, 1240], [study + 1, 1360], [3.0, 1360], [bubbleT, 1240]]);
    camBegin(ccx, ccy, cz);
    hallBack(); screenOffice();
    boilSeed('post9'); paint(rectPts(960 - 36, 690, 72, 810, 3), { wash: C.woodDk, fill: PAL.ink, fillOp: 35, tex: .6, ink: PAL.ink, sw: 4 }); paint(rectPts(960 - 120, 1470, 240, 34, 3), { wash: C.woodDk, ink: PAL.ink, sw: 4 });
    // the sleeve brings the scroll in from the right, and withdraws once Pim has it
    const inK = easeOut(seg(lt, 0, handed)), outK = easeIn(seg(lt, taken, taken + .6));
    const handX = lerp(1800, 1000, inK) + 800 * outK, handY = 1400;
    const carry = ease(seg(lt, handed, taken));
    const sheetPos = [lerp(handX - 90, pimX, carry), lerp(handY + 10, pimY - 62, carry)], sheetRot = lerp(.1, -.04, carry);
    // Pim: reaches, takes, studies, lights up, double-takes, bored to camera
    const mood = pimEmotions(lt, [
      [0, 'neutral', { lookX: 1, lookY: .2 }],
      [taken, 'thinking', { lookX: .2, lookY: .9, emote: 'dots' }],
      [bulbOn, 'idea', { lookX: .2, lookY: .9, emote: null }],
      [take2, 'thinking', { lookX: .2, lookY: .9, emote: null }],
      [camT, 'bored', { lookX: 0, lookY: 0, emote: null }],
    ]);
    const pose = { ...mood, bulb: lt < bulbOn ? 0 : seg(lt, bulbOn, bulbOn + .3) };
    if (lt >= take2 && lt < camT) { const ph = frac((lt - take2) / 1.2); const up = ph > .35 && ph < .75; pose.lookX = up ? .5 : .2; pose.lookY = up ? -1 : .9; pose.squint = Math.abs(ph - .35) < .04 || Math.abs(ph - .75) < .04 ? .6 : 0; }
    if (lt > handed) { pose.aL = lerp(.2, .55, carry); pose.aR = lerp(.2, .25, carry); }   // both arms up to the sheet, one lower
    const blink = lt > 7.8 && lt < 8.0 ? Math.sin(seg(lt, 7.8, 8.0) * Math.PI) : 0; if (blink) pose.squint = blink;
    pim(pimX, pimY, u, pose);
    if (lt < taken + .7) sleeveFromRight(handX, handY, ...SLEEVES.navy, 'ledger');
    if (lt > 0) ledger(sheetPos[0], sheetPos[1], sheetRot);
    const headX = pimX, headY = pimY - 8 * u + (pose.dy || 0) * u;
    const bk = lt < pop ? seg(lt, bubbleT, bubbleT + .35) : 1 - seg(lt, pop, pop + .25);
    thoughtBubble(pimX + 190, pimY - 420, bk, headX + 40, headY - 30);
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [C.coral, PAL.rose]);
  }

  // ---------- Shot 10: the questions, in a suit (82.24–95.1) ----------
  // The same yellow floor, so the viewer knows the game; Pim sways instead of bouncing. The things arrive from
  // navy sleeves this time, and the camera lifts early so the sleeves are in frame as they let go. Pim isn't
  // confused: suspicious, it watches the sleeve each time, not the thing, and points one out. Horns: Pim ducks and
  // they bounce off the floor. Halo: Pim steps aside and it settles on the pencil. Smug to camera; a navy hand
  // closes around Pim (shot 11 finishes the lift).
  function questions2(t, lt, dur) {
    const tPen = 1.1, tDial = 2.2, tKeys = 4.4, tDoor = 6.5, tPoint = 6.9, tHorns = 8.6, tDuck = 8.9, tHalo = 10.4, tStep = 10.9, tSmug = 11.9, back = 12.3;
    const { floor, u } = S4, HAND = 250;
    const lift = Math.sin(seg(lt, 1.5, 2.0) * Math.PI / 2) * (1 - ease(seg(lt, tSmug - .3, tSmug + .2)));
    camBegin(960, 620 - 150 * lift, 1.32);
    sunFloor(t);

    // a sleeve lowers each thing to hand height (the thing rides in the hand), lets go at t0 and withdraws; the
    // thing falls the rest of the way
    const bring = (t0, x) => { const down = ease(seg(lt, t0 - .7, t0 - .1)), up = easeIn(seg(lt, t0 + .1, t0 + .7)); return lt > t0 - .7 && lt < t0 + .7 ? lerp(-420, HAND, down) - 900 * up : null; };
    const fallY = (t0, off = 30) => { if (lt < t0) { const h = bring(t0, 0); return h == null ? -3000 : h + off; } return floor + dropIn(lt, t0, t0 + .4, floor - HAND - off); };   // off: how far the thing hangs below the hand
    // the pencil: dropped from above the frame (the camera hasn't lifted yet)
    const penY = fallY(tPen) - floor, penRot = .3 * spring(lt, tPen + .4, 4, 18);
    if (lt > tPen - .7) pencilUp(S4.pencil, floor + penY, penRot);
    { const hy = bring(tPen, S4.pencil); if (hy != null) sleeve(S4.pencil, hy, ...SLEEVES.navy, 'n1'); }
    // the gauge, needle pinned full
    if (lt > tDial - .7) { const dy = fallY(tDial, 150) - floor; boilSeed('dialbase'); paint(rectPts(S4.dial - 60, floor - 30 + dy, 120, 30, 2), { wash: C.sandDk, ink: PAL.ink, sw: 2.2 }); dial(S4.dial, floor - 40 + dy, 70, 1); }
    { const hy = bring(tDial, S4.dial); if (hy != null) sleeve(S4.dial, hy, ...SLEEVES.navy, 'n2'); }
    // the keys
    if (lt > tKeys - .7) keyring(S4.keys, fallY(tKeys, 90) - 90, .5 * spring(lt, tKeys + .4, 3, 26));
    { const hy = bring(tKeys, S4.keys); if (hy != null) sleeve(S4.keys, hy, ...SLEEVES.navy, 'n3'); }
    // the door, pushed in from the right by a sleeve
    const doorX = lerp(2300, S4.door, easeOut(seg(lt, tDoor - .4, tDoor + .1)));
    if (lt > tDoor - .4) littleDoor(doorX, floor, 150, 290);
    if (lt > tDoor - .4 && lt < tDoor + .9) sleeveFromRight(doorX + 190 + 900 * easeIn(seg(lt, tDoor + .2, tDoor + .9)), floor - 150, ...SLEEVES.navy, 'door');

    // Pim: sway, eyes up before each arrival, then on the sleeve; a point; the duck; the sidestep; smug
    const sway = move('sway', t), sk = 1 - .7 * seg(lt, tPen, 2.0);
    const mood = pimEmotions(lt, [
      [0, 'happy'],
      [tPen - .4, 'suspicious', { lookX: -.6, lookY: -1 }],
      [tDoor + .2, 'suspicious', { lookX: 1, lookY: -.2 }],
      [tHorns - .3, 'suspicious', { lookX: 0, lookY: -1 }],
      [tHalo, 'suspicious', { lookX: .2, lookY: -1 }],
      [tSmug, 'smug', { lookX: 0, lookY: 0 }],
    ]);
    // where Pim looks: at whichever sleeve is in play
    const watch = [[tPen, S4.pencil], [tDial, S4.dial], [tKeys, S4.keys], [tDoor, S4.door]].reduce((a, [t0, x]) => lt > t0 - .6 && lt < t0 + .9 ? x : a, null);
    const duck = lt > tDuck && lt < tDuck + .5 ? Math.sin(seg(lt, tDuck, tDuck + .5) * Math.PI) : 0;
    const step = ease(seg(lt, tStep, tStep + .4));
    const pimX = S4.pimX - 90 * step;
    const pose = { ...mood, bulb: 1, dx: sway.dx * sk, rot: (mood.rot || 0) + sway.rot * sk, sq: (mood.sq || 0) + .35 * duck, dy: (mood.dy || 0) + 1.6 * duck };
    if (watch != null && lt >= tPen - .4 && lt < tSmug) { pose.lookX = clamp((watch - pimX) / 500, -1, 1); pose.lookY = -1; }
    if (lt > tPoint && lt < tPoint + 1.3) pose.aR = 1.35;   // pointing up at the door's sleeve
    pim(pimX, floor, u, pose);
    const headY = floor - 8 * u + (pose.dy || 0) * u;

    // the navy hand brings the horns; Pim ducks; the horns fall and bounce on the floor
    if (lt >= tHorns - .3 && lt < tHorns + 1.2) { const down = ease(seg(lt, tHorns - .3, tHorns + .3)), upK = ease(seg(lt, tHorns + .5, tHorns + 1.2));
      const hy = lerp(-200, floor - 8 * u + 10, down) - 700 * upK; sleeve(pimX + 90, hy, ...SLEEVES.navy, 'navyH');
      if (lt < tHorns + .3) hornPair(pimX, hy - 10, 24); }
    if (lt >= tHorns + .3) { const hy = floor + dropIn(lt, tHorns + .3, tHorns + .65, 8 * u - 10) - 10; hornPair(pimX + 20, hy, 24, 10, .4); }
    // the halo floats down, Pim steps aside, it settles on the pencil
    if (lt >= tHalo) { const down = easeOut(seg(lt, tHalo, tHalo + .7)), over = ease(seg(lt, tStep, tStep + .8));
      const hx = lerp(S4.pimX, S4.pencil, over), hy = lerp(lerp(-150, floor - 8 * u - 70, down), floor - 232, over) + 6 * Math.sin(lt * 5) * (1 - over);
      haloRing(hx, hy); }
    // the sleeves come back; the navy one reaches for Pim
    if (lt >= back) { const k = ease(seg(lt, back, dur)); sleeve(S4.dial, lerp(-420, 290, k), ...SLEEVES.white, 'white'); sleeve(S4.keys, lerp(-420, 260, k), ...SLEEVES.grey, 'grey');
      sleeve(pimX + 20, lerp(-420, headY - 120, k), ...SLEEVES.navy, 'navy'); }
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [C.coral, PAL.rose]);
  }

  // ---------- Shot 11: holding it, again (95.1–103.67) ----------
  // The executive holds Pim up on a balcony above the trading floor; investors cheer below, a confetti cannon fires
  // on the beats. The camera pulls back, further than last time: across the street to the columned building, where
  // the clerk waits at the desk; the executive's other arm stretches across the whole frame and leaves an envelope
  // on the desk beside the scroll, and the quill resumes. Push in on Pim: suspicious, one eyebrow, to camera.
  const S11 = { shift: 2300, balcony: [250, 700, 900], exec: [700, 700, 850], cannon: [1380, 1480] };
  function holding2(t, lt, dur) {
    const [ex, ey, eh] = S11.exec, reach = 3.2, arrive = 4.9, retract = 5.3;
    const liftK = easeOut(seg(lt, 0, .5));
    const handX = ex + .26 * eh, handY = lerp(-170, -300, liftK);
    const c = kf(lt, [[1.2, [handX, -300 - 270, 1.45]], [3.2, [800, 950, .68]], [5.4, [2000, 850, .3]], [7.2, [2000, 850, .3]], [8.3, [handX, handY - 80, 1.0]]]);
    camBegin(lt < 1.2 ? handX : c[0], lt < 1.2 ? -300 - 270 : c[1], c[2]);
    // sky over everything, then the columned building across the street (the steps world, shifted right)
    boilSeed('sky11'); paint(rectPts(-4000, -3000, 12000, 7000), { wash: '#CFE6F5', ink: null });
    push(); translate(S11.shift, 0);
    stepsWorld(t);
    { const [kx, ky, kh] = ST.clerk, writing = lt > arrive + .3;
      const qx = kx + 60 + (writing ? 14 * Math.sin(t * 14) : 0), qy = ky - .62 * kh + (writing ? 6 * Math.cos(t * 14) : 0) - (writing ? 0 : 60);
      person(kx, ky, kh, { seed: 7, coat: '#7E8893', trim: '#5A636D', hair: '#3A3340', hands: [[kx - 90, ky - .64 * kh], [qx, qy]], look: writing ? [-.4, .9] : [-1, -.2], mouth: writing ? 'flat' : 'smile' });
      deskProp(); quill(qx, qy, writing ? -.9 : -1.3); scroll(1); }
    pop();
    // the street and the trading-floor building with its balcony
    boilSeed('street'); paint(rectPts(-4000, 1500, 6300, 3000), { wash: '#D9D2C8', fill: mixCol('#D9D2C8', PAL.ink, .3), fillOp: 40, bleed: .1, tex: .6, ink: null });
    inkLine([[-4000, 1500], [0, 1503], [2300, 1500]], 3, PAL.ink, 'ink', .2);
    boilSeed('facade'); paint(rectPts(-1400, -1200, 2300, 2700, 5), { wash: C.greyLt, fill: '#2F3C7A', fillOp: 25, tex: .5, ink: PAL.ink, sw: 5 });
    for (let r = 0; r < 4; r++) for (let cI = 0; cI < 4; cI++) { const wx = -1250 + cI * 420, wy = -1000 + r * 520; if (wy > 300 && wy < 1100) continue; paint(rectPts(wx, wy, 260, 300, 3), { wash: '#BFE0F2', fill: C.sky, fillOp: 50, tex: .4, ink: PAL.ink, sw: 4 }); }
    const [bx, by, bw] = S11.balcony;
    paint(rectPts(bx - 40, by, bw + 80, 70, 4), { wash: '#EDE6D6', fill: C.grey, fillOp: 45, tex: .5, ink: PAL.ink, sw: 4 });
    // the crowd below, cheering, and the confetti cannon
    for (let i = 0; i < 7; i++) { const ix = -100 + i * 230, ih = 600, iy = 1500, up = .5 + .5 * Math.sin(bpOf(t) * Math.PI + i * .9);
      person(ix, iy, ih, { seed: 50 + i, coat: '#6E7781', trim: '#4A5566', tie: PAL.ochre, hair: ['#2B2233', '#5B4636', '#3A3340'][i % 3], hands: [[ix - .3 * ih, iy - .7 * ih - .3 * ih * up], [ix + .3 * ih, iy - .7 * ih - .3 * ih * (1 - up)]], look: [0, -1], mouth: 'o' }); }
    boilSeed('cannon'); push(); translate(...S11.cannon); rotate(-.9); paint(rrPts(-40, -220, 80, 240, 20, 4), { wash: C.coral, fill: '#B8513A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 4 }); pop();
    paint(ellPts(S11.cannon[0], S11.cannon[1] + 10, 90, 26, 16, 3), { wash: C.woodDk, ink: PAL.ink, sw: 4 });
    { const mouth = [S11.cannon[0] + 180, S11.cannon[1] - 150]; boilSeed('bursts');
      for (let b = Math.ceil(bpOf(t) - 2.2); b <= Math.floor(bpOf(t)); b++) { const age = t - (OFF + b * BEAT); if (age < 0 || age > 1.2 || (OFF + b * BEAT) < 95.1 + 1.2 || (OFF + b * BEAT) > 95.1 + 5.2) continue;
        for (let i = 0; i < 14; i++) { const p = arcPt(mouth, [mouth[0] + 700 * hash(i + b * 7) + 100, mouth[1] - 900 * hash(i + 3) + 500], 500 + 400 * hash(i + 11), age / 1.2); push(); translate(p[0], p[1]); rotate(age * 8 + i); paint(rectPts(-16, -9, 32, 18, 1), { wash: [C.sun, C.coral, PAL.teal, C.sky, PAL.rose][i % 5], ink: null }); pop(); } }
      if (frac(bpOf(t)) < .15 && t > 95.1 + 1.2 && t < 95.1 + 5.2) glow(mouth[0], mouth[1], 160, '#FFFFFF', 1 - frac(bpOf(t)) / .15); }
    // the executive on the balcony: right hand holding Pim up; left arm reaching across the street with the envelope
    const envTarget = [S11.shift + ST.desk[0] - 60, ST.desk[1] - 180], restL = [ex - .3 * eh, ey - .45 * eh];
    const rk = ease(seg(lt, reach, arrive)), bk = ease(seg(lt, retract, retract + .8));
    const handL = [lerp(lerp(restL[0], envTarget[0], rk), restL[0], bk), lerp(lerp(restL[1], envTarget[1] - 40, rk), restL[1], bk)];
    person(ex, ey, eh, { seed: 9, coat: '#2F3C7A', trim: PAL.ochre, tie: PAL.ochre, hair: '#3A3340', hands: [handL, [handX, handY]], look: lt < reach ? [.6, -.9] : lt < retract ? [1, .3] : [0, .2], mouth: 'smile' });
    const envelope = (x, y, key) => { boilSeed(key); paint(rectPts(x - 60, y - 40, 120, 80, 2), { wash: PAL.cream, ink: PAL.ink, sw: 3 }); inkLine([[x - 60, y - 40], [x, y + 4], [x + 60, y - 40]], 2.4, PAL.ink, 'inkfine', 0); };
    if (lt > reach - .2 && lt < arrive) envelope(handL[0] + 10, handL[1] + 50, 'env');
    if (lt >= arrive) envelope(envTarget[0], envTarget[1] + 10, 'envdesk');
    // the railing in front of the executive
    boilSeed('rail'); for (let rx = bx + 20; rx < bx + bw; rx += 60) paint(rectPts(rx - 8, by - 140, 16, 140, 2), { wash: '#EDE6D6', ink: PAL.ink, sw: 3 });
    paint(rectPts(bx - 30, by - 160, bw + 60, 26, 3), { wash: PAL.cream, fill: C.grey, fillOp: 40, ink: PAL.ink, sw: 4 });
    // Pim in the hand
    const brow = lt > 7.2;
    pim(handX, handY - 28, 26, { ...pimFeel('neutral', t), aL: .9, aR: .9, bulb: 1, eyes: brow ? ['narrow', 'wide'] : 'normal', mouth: brow ? 'flat' : null, lookX: lt < reach ? -.6 : lt < 7.2 ? 1 : 0, lookY: lt < reach ? .8 : lt < 7.2 ? .4 : 0, squint: lt > 7.9 && lt < 8.1 ? Math.sin(seg(lt, 7.9, 8.1) * Math.PI) : 0 });
    camEnd();
    if (lt > dur - .3) { const k = easeIn(seg(lt, dur - .3, dur)); const [cx, cy] = toScreen(handX, handY - 100, LAST_CAM); irisShape(starPts(cx, cy, lerp(2600, 0, k), .5, 5, -Math.PI / 2 + k * 2), PAL.ochre); }
  }

  // ---------- the fairground (shots 12, 13) ----------
  const FAIR = { ground: 900, boothL: [100, 660], boothR: [1160, 660], counter: 680, awning: 250, pimX: 960, red: '#E0523F', gold: '#F2C53D' };
  function fairWorld(t) {
    boilSeed('fairsky'); paint(rectPts(-800, -800, W + 1600, FAIR.ground + 800), { wash: '#F6DFAE', ink: null });
    paint(rectPts(-800, -800, W + 1600, 900), { fill: C.coral, fillOp: 40, bleed: .3, tex: .4, ink: null });
    glow(1500, 60, 700, '#FFE9A8', .9);
    boilSeed('fairground'); paint(rectPts(-800, FAIR.ground, W + 1600, 900), { wash: '#E3C98F', fill: PAL.ochre, fillOp: 45, bleed: .15, tex: .6, ink: null });
    inkLine([[-800, FAIR.ground + 2], [960, FAIR.ground], [W + 800, FAIR.ground + 3]], 2.2, PAL.ink, 'ink', .3);
    // bunting across the top
    boilSeed('bunting'); const str = []; for (let i = 0; i <= 20; i++) { const x = -100 + i * 106; str.push([x, 120 + 60 * Math.sin(i / 20 * Math.PI)]); }
    inkLine(str, 2.4, PAL.ink, 'inkfine', .6);
    const S = through(str, 3); for (let i = 2; i < S.length - 2; i += 3) { const [x, y] = S[i]; paint([[x - 22, y], [x + 22, y], [x, y + 52]], { wash: [FAIR.red, PAL.cream, FAIR.gold, PAL.teal][Math.floor(i / 3) % 4], ink: PAL.ink, sw: 1.8 }); }
  }
  // A booth: counter, posts, a striped awning, and a back panel with its cut-out. side = -1 (left, red) or 1 (right, gold)
  function boothBack(x0, w, col, side, t) {
    boilSeed('booth' + side);
    const y = FAIR.ground, cy = FAIR.counter, ay = FAIR.awning;
    paint(rectPts(x0 + 40, ay + 80, w - 80, cy - ay - 80, 3), { wash: mixCol(col, PAL.cream, .75), fill: col, fillOp: 25, tex: .5, ink: PAL.ink, sw: 3 });   // back panel
    // the cut-out
    for (const px of [x0 + 20, x0 + w - 20]) paint(rectPts(px - 14, ay + 60, 28, cy - ay - 60, 3), { wash: C.woodDk, ink: PAL.ink, sw: 3 });   // posts
    // the striped awning with a scalloped edge
    const n = 8, sw2 = (w + 40) / n;
    for (let i = 0; i < n; i++) paint(rectPts(x0 - 20 + i * sw2, ay, sw2, 80, 2), { wash: i % 2 ? PAL.cream : col, ink: null });
    paint(rectPts(x0 - 20, ay, w + 40, 80, 3), { ink: PAL.ink, sw: 3 });
    for (let i = 0; i < n; i++) paint(ellPts(x0 - 20 + (i + .5) * sw2, ay + 80, sw2 / 2, 22, 12, 1), { wash: i % 2 ? PAL.cream : col, ink: PAL.ink, sw: 2.2 });
    if (side < 0) {   // the shoggoth, standing on top of the booth like a sign board: a lumpy dark-violet mass of
                       // protoplasm, a few tentacles curling out against the sky, many mismatched eyes
      boilSeed('shoggoth');
      const mx = x0 + 235, my = ay + 15, R = 125;
      for (const sx of [mx - 70, mx + 70]) inkLine([[sx, ay + 2], [sx + 4, my + R * .6]], 5, C.woodDk, 'ink', 0);   // the struts it is mounted on
      [[.8, -1, .6], [1.0, -1, -.3], [1.28, -.5, -1], [1.62, .5, -1], [.25, 1, .3]].forEach(([f, dx, dy], k) => {   // [angle, curl direction]
        const a = Math.PI * f, r0 = [mx + Math.cos(a) * R * .85, my + Math.sin(a) * R * .9], len = 130 + 50 * hash(k + 3), wave = Math.sin(t * 1.2 + k * 1.7);
        const tip = [r0[0] + dx * len + 20 * wave, r0[1] + dy * len * .8 - 20 * wave], mid = [lerp(r0[0], tip[0], .5) - dy * 50, lerp(r0[1], tip[1], .5) + dx * 50];
        paint(ribbon([r0, mid, tip], 50, 10), { wash: '#4A3570', fill: PAL.indigo, fillOp: 50, tex: .6, ink: PAL.ink, sw: 2.8 });
      });
      const blob = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, r = 1 + .16 * Math.sin(a * 3 + 1) + .08 * Math.sin(a * 7 + hash(i) * 2); blob.push([mx + Math.cos(a) * R * r + jit(4), my + Math.sin(a) * R * 1.08 * r + jit(4)]); }
      paint(blob, { wash: '#4A3570', fill: PAL.indigo, fillOp: 60, tex: .7, bleed: .1, ink: PAL.ink, sw: 3.2, curv: .3 });
      paint(ellPts(mx - 55, my - 75, 64, 38, 16, 4, -.4), { fill: PAL.violet, fillOp: 70, bleed: .2, tex: .7, ink: null });   // a wet highlight
      const EYES = [[-75, -65, 32], [22, -96, 24], [80, -42, 38], [-22, -10, 17], [54, 32, 28], [-92, 32, 22], [-32, 75, 32], [43, 102, 15], [108, 75, 19], [0, 43, 11]];
      EYES.forEach(([ex, ey, r], i) => {
        const slit = i % 4 === 1, px = Math.sin(t * .7 + i * 1.9) * r * .3, py = Math.cos(t * .5 + i) * r * .2, pr = r * (.3 + .25 * hash(i + 20));
        paint(ellPts(mx + ex, my + ey, r, r * (.85 + .3 * hash(i + 5)), 14, 1.5), { wash: PAL.cream, ink: PAL.ink, sw: 2.2 });
        if (slit) paint(rectPts(mx + ex + px - pr * .3, my + ey + py - r * .6, pr * .6, r * 1.2, 1), { wash: PAL.ink, ink: null });
        else paint(ellPts(mx + ex + px, my + ey + py, pr, pr * 1.1, 10), { wash: i === 2 || i === 6 ? '#C8324A' : PAL.ink, ink: null });
      });
    } else {   // the angel, mirrored: the same height and size, standing on struts above the gold booth
      boilSeed('angel');
      const ax = x0 + w - 235, ay2 = ay + 15;
      for (const sx of [ax - 70, ax + 70]) inkLine([[sx, ay + 2], [sx - 4, ay2 + 60]], 5, C.woodDk, 'ink', 0);
      glow(ax, ay2, 320, '#FFE9A8', 1);
      for (const d of [-1, 1]) paint(ellPts(ax + d * 125, ay2 + 10, 70, 105, 16, 4, d * .5), { wash: PAL.cream, fill: FAIR.gold, fillOp: 35, tex: .5, ink: PAL.ink, sw: 2.8 });
      paint(rrPts(ax - 70, ay2 - 30, 140, 170, 50, 4), { wash: PAL.cream, fill: FAIR.gold, fillOp: 30, tex: .5, ink: PAL.ink, sw: 3.2 });
      paint(ellPts(ax, ay2 - 75, 52, 56, 18, 3), { wash: '#F2C9A8', ink: PAL.ink, sw: 3 });
      for (const d of [-1, 1]) inkLine([[ax + d * 25 - 12, ay2 - 80], [ax + d * 25, ay2 - 71], [ax + d * 25 + 12, ay2 - 80]], 2.6, PAL.ink, 'ink', .5);
      glow(ax, ay2 - 150, 110, '#FFE49A', 1); paint(ellPts(ax, ay2 - 146, 60, 15, 20, 2), { ink: PAL.ochre, sw: 6 });
    }
  }
  function boothCounter(x0, w, col, side) {
    boilSeed('counter' + side);
    const y = FAIR.ground, cy = FAIR.counter, ay = FAIR.awning;
    paint(rectPts(x0, cy, w, y - cy, 4), { wash: mixCol(col, PAL.cream, .2), fill: col, fillOp: 50, tex: .6, ink: PAL.ink, sw: 3.5 });   // counter front
    for (let i = 0; i < 6; i++) paint(rectPts(x0 + 20 + i * (w - 40) / 6, cy + 20, (w - 40) / 12, y - cy - 40, 2), { wash: PAL.cream, ink: null });
    paint(rectPts(x0 - 16, cy - 18, w + 32, 26, 3), { wash: C.wood, ink: PAL.ink, sw: 3 });   // counter top
  }
  function boater(x, y, col) { boilSeed('boater' + col); paint(ellPts(x, y, 86, 18, 20, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2.6 }); paint(rectPts(x - 52, y - 44, 104, 44, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2.6 }); paint(rectPts(x - 54, y - 22, 108, 14, 1), { wash: col, ink: null }); }
  function cone(x, y, col, key) { boilSeed('cone' + key); paint([[x - 26, y - 20], [x + 26, y - 20], [x, y + 70]], { wash: C.sandDk, fill: C.woodDk, fillOp: 40, ink: PAL.ink, sw: 2.4 }); paint(ellPts(x, y - 30, 34, 32, 14, 2), { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 35, tex: .5, ink: PAL.ink, sw: 2.4 }); }

  // ---------- Shot 12: the midway (103.67–112.24) ----------
  // Two booths side by side, mirror images: red with a shoggoth cut-out, gold with a glowing angel. Pim between them.
  // The red barker drops horns and a cape on Pim; the gold one swaps in a halo and wings; the red one swaps back;
  // faster and faster on the beats until Pim is dizzy. Then both scoop from the same tub and hold out two cones,
  // red and gold. Pim pushes both away and looks to camera.
  function midway(t, lt, dur) {
    const pimX = FAIR.pimX, pimY = FAIR.ground, u = 24;
    const headY = pimY - 8 * u;
    const swaps = [[1.95, 'red'], [3.7, 'gold'], [4.96, 'red'], [5.5, 'gold'], [6.03, 'red'], [6.45, 'none']];   // [time, costume after]
    const tubT = 6.45, conesT = 7.0, pushT = 7.73, camT = 8.2;
    camBegin(960, 540, 1.1);
    fairWorld(t);
    const lean = ease(seg(lt, .5, 1.3)) * (1 - ease(seg(lt, 1.6, 2.0)));
    // the barkers behind their counters (drawn before the counters), hands flying to Pim's head on each swap
    const reach = (who) => swaps.reduce((a, [e, c], i) => { const mine = (c === who) || (c === 'none') || (i > 0 && swaps[i - 1][1] === who && c !== who); return mine ? Math.max(a, lt > e - .3 && lt < e + .3 ? Math.sin(seg(lt, e - .3, e + .3) * Math.PI) : 0) : a; }, 0);
    const toTub = ease(seg(lt, tubT, tubT + .4)) * (1 - ease(seg(lt, conesT - .2, conesT))), toCone = ease(seg(lt, conesT, conesT + .35)) * (1 - ease(seg(lt, pushT + .2, pushT + .6)));
    const barker = (bx, col, side, seed, hair) => {
      const bh = 600, by = FAIR.ground - 12, near = [bx + side * 100, by - .5 * bh], far = [bx - side * 100, by - .5 * bh];
      const r = reach(side < 0 ? 'red' : 'gold');
      let hand = [lerp(near[0], pimX - side * 70, r), lerp(near[1], headY - 30, r)];
      hand = [lerp(hand[0], 960 - side * 60, toTub), lerp(hand[1], 600, toTub)];
      hand = [lerp(hand[0], pimX - side * 150, toCone), lerp(hand[1], pimY - 110, toCone)];
      person(bx, by, bh, { seed, coat: col, trim: PAL.cream, hair, hands: side < 0 ? [far, hand] : [hand, far], look: [side * -.7, .5], mouth: 'smile', lean: side * .12 * lean, bob: .4 });
      boater(bx + side * .02 * bh, by - 1.0 * bh + 8, col);
      return hand;
    };
    boothBack(...FAIR.boothL, FAIR.red, -1, t); boothBack(...FAIR.boothR, FAIR.gold, 1, t);
    const hL = barker(600, FAIR.red, -1, 61, '#5B4636'), hR = barker(1320, FAIR.gold, 1, 62, '#2B2233');
    boothCounter(...FAIR.boothL, FAIR.red, -1); boothCounter(...FAIR.boothR, FAIR.gold, 1);
    // the one tub, rising between the booths
    if (lt > tubT) { const up = easeOut(seg(lt, tubT, tubT + .4)); boilSeed('tub'); const ty = lerp(1000, 700, up);
      paint(rectPts(860, ty - 130, 200, 130, 3), { wash: PAL.cream, fill: C.sandDk, fillOp: 30, tex: .5, ink: PAL.ink, sw: 3 }); paint(rectPts(860, ty - 80, 200, 26, 2), { wash: '#8C5A3C', ink: null });
      paint(ellPts(960, ty - 130, 100, 26, 20, 2), { wash: '#F6DFAE', fill: PAL.ochre, fillOp: 40, ink: PAL.ink, sw: 3 }); }
    // Pim and its costume of the moment
    const costume = swaps.reduce((a, [e, c]) => lt >= e ? c : a, 'none');
    const mood = pimEmotions(lt, [
      [0, 'neutral', { lookX: -1, lookY: -.3 }],
      [.8, 'neutral', { lookX: 1, lookY: -.3 }],
      [1.95, 'suspicious'],
      [3.7, 'shy'],
      [5.5, 'dizzy'],
      [pushT, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const pose = { ...mood, bulb: lt < pushT ? 0 : seg(lt, camT, camT + .3), horns: costume === 'red' ? 1 : 0, hat: costume === 'gold' ? 'halo' : null };
    if (lt > pushT && lt < pushT + .5) { const k = Math.sin(seg(lt, pushT, pushT + .5) * Math.PI); pose.aL = .2 - .3 * k; pose.aR = .2 - .3 * k; }
    if (lt > 5.5 && lt < tubT) pose.smear = .5 * Math.abs(Math.sin(lt * 30));   // the swaps blur
    boilSeed('costume');
    if (costume === 'red') paint([[pimX - 70, headY + 40], [pimX + 70, headY + 40], [pimX + 150, pimY + 10], [pimX - 150, pimY + 10]], { wash: FAIR.red, fill: '#A8322A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 2.6, curv: .2 });
    if (costume === 'gold') for (const d of [-1, 1]) paint(ellPts(pimX + d * 130, headY + 70, 60, 95, 14, 3, d * .6), { wash: PAL.cream, fill: FAIR.gold, fillOp: 35, tex: .5, ink: PAL.ink, sw: 2.4 });
    pim(pimX, pimY, u, pose);
    if (toCone > .3) { cone(hL[0] + 10, hL[1] + 40, FAIR.red, 'L'); cone(hR[0] - 10, hR[1] + 40, FAIR.gold, 'R'); }
    camEnd();
    if (lt < .4) irisShape(starPts(960, 540, lerp(0, 2600, easeOut(lt / .4)), .5, 5, -Math.PI / 2 + 2 - lt * 3), PAL.ochre);
  }

  // ---------- Shot 13: running on its own (112.24–120.81) ----------
  // Both barkers shoo Pim onto a little stage between the booths and gesture "look, no hands": Pim trots along it
  // in profile, proud. The camera pulls back: the stage is a conveyor belt, and the two barkers crank it from
  // either end, one half a beat behind the other, so Pim trots in place. Each barker holds up a page of squiggles
  // with a blank line at the bottom, pen tucked behind the back. Pim shrugs to camera mid-trot, then trots off right.
  const S13 = { beltX0: 790, beltX1: 1130, beltY: 820, beltH: 70 };
  function conveyor(t, lt, dur) {
    const pull0 = 2.26, pull1 = 3.76, pagesT = 3.9, peekT = 5.2, shrugT = 5.6, offT = 6.76;
    const { beltX0, beltX1, beltY, beltH } = S13, u = 26;
    const cz = kf(lt, [[pull0, 1.3], [pull1, 1.0]]), ccy = kf(lt, [[pull0, 690], [pull1, 560]]);
    camBegin(960, ccy, cz);
    fairWorld(t);
    boothBack(...FAIR.boothL, FAIR.red, -1, t); boothBack(...FAIR.boothR, FAIR.gold, 1, t);
    // the belt: a drum at each end, the top run, the body; the surface stripes scroll left under Pim's feet
    const run = lt > pull0 ? (lt - pull0) * 260 : 0;
    boilSeed('belt');
    paint(rectPts(beltX0, beltY, beltX1 - beltX0, beltH, 3), { wash: C.woodDk, fill: PAL.ink, fillOp: 35, tex: .6, ink: PAL.ink, sw: 3.5 });
    for (let i = 0; i < 6; i++) { const sx = beltX0 + 20 + ((i * 60 - run) % 300 + 300) % 300; if (sx + 30 < beltX1) paint(rectPts(sx, beltY + 10, 30, beltH - 20, 2), { wash: mixCol(C.woodDk, PAL.cream, .4), ink: null }); }
    inkLine([[beltX0, beltY + 4], [beltX1, beltY + 4]], 2.6, PAL.ink, 'ink', 0);
    for (const dx of [beltX0, beltX1]) { paint(ellPts(dx, beltY + beltH / 2, beltH / 2 + 6, beltH / 2 + 6, 16, 2), { wash: '#6E7781', ink: PAL.ink, sw: 3.2 }); paint(ellPts(dx, beltY + beltH / 2, 10, 10, 8), { wash: PAL.ink, ink: null }); }
    for (const lx of [beltX0 + 50, beltX1 - 50]) paint(rectPts(lx - 14, beltY + beltH, 28, FAIR.ground - beltY - beltH, 2), { wash: C.woodDk, ink: PAL.ink, sw: 3 });
    // the barkers at the ends, cranking from pull0 (one half a beat behind), then holding up the pages
    const crank = (side, ph) => { const a = (bpOf(t) + ph) * TAU, cx = side < 0 ? beltX0 : beltX1, cy = beltY + beltH / 2; return [cx + Math.cos(a) * 48, cy + Math.sin(a) * 48]; };
    const pageK = ease(seg(lt, pagesT, pagesT + .5)), peek = lt > peekT && lt < peekT + 1.2 ? Math.sin(seg(lt, peekT, peekT + 1.2) * Math.PI) : 0;
    const barker = (bx, col, side, seed, hair, ph) => {
      const bh = 600, by = FAIR.ground - 12;
      const rest = [bx - side * 100, by - .5 * bh], shoo = [bx + side * 150, by - .45 * bh - 60 * Math.sin(lt * 9)], look = [bx + side * 180, by - .7 * bh];
      let near = lt < .5 ? shoo : lt < pull0 ? [lerp(shoo[0], look[0], ease(seg(lt, .5, .9))), lerp(shoo[1], look[1], ease(seg(lt, .5, .9)))] : crank(side, ph);
      const pageHand = [bx - side * 60, by - .95 * bh], far = pageK > 0 ? [lerp(rest[0], pageHand[0], pageK), lerp(rest[1], pageHand[1], pageK)] : rest;
      if (lt > pull1 + .3 && pageK > 0) near = [lerp(crank(side, ph)[0], bx + side * 40, pageK), lerp(crank(side, ph)[1], by - .5 * bh, pageK)];   // the crank is let go once the belt is shown
      person(bx, by, bh, { seed, coat: col, trim: PAL.cream, hair, hands: side < 0 ? [far, near] : [near, far], look: lt < pull1 ? [side * -.8, .2] : [0, -.4], mouth: 'smile', bob: .4 });
      boater(bx + side * .02 * bh, by - 1.0 * bh + 8, col);
      // the crank handle, when it's held
      if (lt >= pull0 && !(lt > pull1 + .3 && pageK > 0)) { const h = crank(side, ph), cx = side < 0 ? beltX0 : beltX1; boilSeed('crank' + side); inkLine([[cx, beltY + beltH / 2], [h[0], h[1]]], 7, '#6E7781', 'ink', 0); paint(ellPts(h[0], h[1], 16, 16, 10), { wash: PAL.ink, ink: null }); }
      // the page: squiggles and a blank line, held up; the pen behind the back peeks out
      if (pageK > 0) { boilSeed('page' + side); push(); translate(far[0], far[1] - 20); rotate(side * -.1); scale(pageK, pageK);
        paint(rrPts(-110, -150, 220, 290, 8, 2), { wash: PAL.cream, fill: C.sandDk, fillOp: 25, tex: .5, ink: PAL.ink, sw: 2.6 });
        for (let i = 0; i < 6; i++) { const y = -115 + i * 32, x1 = -85 + 100 + 60 * hash(i + seed); inkLine([[-85, y], [(-85 + x1) / 2, y + jit(3)], [x1, y + jit(1)]], 2.2, PAL.ink, 'ink', .3); }   // three points: two-point splines vanish inside scale()
        inkLine([[-85, 100], [85, 100]], 2.6, PAL.ink, 'ink', 0); pop(); }
      if (peek > 0) { boilSeed('pen' + side); push(); translate(bx - side * .12 * bh, by - .62 * bh + 40 * (1 - peek)); rotate(side * .5);
        paint(rectPts(-10, -70, 20, 110, 2), { wash: C.sun, ink: PAL.ink, sw: 2.2 }); paint([[-10, -70], [10, -70], [0, -92]], { wash: '#F2C9A8', ink: PAL.ink, sw: 1.8 }); pop(); }
    };
    barker(640, FAIR.red, -1, 61, '#5B4636', 0); barker(1280, FAIR.gold, 1, 62, '#2B2233', .5);
    boothCounter(...FAIR.boothL, FAIR.red, -1); boothCounter(...FAIR.boothR, FAIR.gold, 1);
    // Pim: walks onto the belt from the left, trots in place once it moves, shrugs, then trots off right
    const onX = kf(lt, [[0, 700], [1.3, 960]]), offX = lt < offT ? 960 : 960 + (lt - offT) * 520;
    const pimX = lt < offT ? onX : offX;
    const mood = pimEmotions(lt, [
      [0, 'proud', { emote: null, eyes: 'normal', lookX: .6 }],
      [pull1, 'thinking', { emote: null, lookX: -.6, lookY: .6 }],
      [shrugT, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat' }],
      [offT, 'neutral', { lookX: 1, lookY: 0, mouth: 'flat' }],
    ]);
    const walkPh = lt < pull0 ? lt * 2.2 : lt < offT ? pull0 * 2.2 + (lt - pull0) * 2.2 : pull0 * 2.2 + (lt - pull0) * 2.2;
    const shrug = lt > shrugT && lt < shrugT + 1.0 ? Math.sin(seg(lt, shrugT, shrugT + 1.0) * Math.PI) : 0;
    const view = lt < shrugT ? { view: 'side', flip: false } : lt < offT ? turn(lt, shrugT, shrugT + .2, .25, .125) : turn(lt, offT, offT + .2, .125, .25);
    const pose = { ...mood, ...view, bulb: 1, walk: walkPh, dy: (mood.dy || 0) - .3 * Math.abs(Math.sin(walkPh * TAU)), aL: lt > shrugT && lt < offT ? .2 + 1.0 * shrug : (mood.aL ?? .2), aR: lt > shrugT && lt < offT ? .2 + .8 * shrug : (mood.aR ?? .2) };
    pim(pimX, beltY + 4, u, pose);
    camEnd();
  }

  // ---------- the lunch room (shots 14, 15) ----------
  // A grand white room with columns, tall windows and a chandelier, nothing identifying. A long white table runs
  // across; the official at the head (right), executives down both sides. Pim at a tiny side table at the left.
  const LUNCH = { floor: 1500, tableY: 1000, tableX0: 300, tableX1: 2100, pim: [-250, 1500], official: [2250, 1540, 760] };
  const SEATS = [[500, 0], [900, 0], [1300, 0], [1700, 0], [700, 1], [1100, 1], [1500, 1], [1900, 1]];   // [x, far (behind the table)]
  function lunchRoom(t) {
    boilSeed('lunchwall'); paint(rectPts(-3000, -1500, 8000, LUNCH.floor + 1500), { wash: '#F1EDE4', ink: null });
    paint(rectPts(-3000, -1500, 8000, 1200), { fill: C.sandLt, fillOp: 60, bleed: .3, tex: .4, ink: null });
    boilSeed('lunchfloor'); paint(rectPts(-3000, LUNCH.floor, 8000, 2000), { wash: '#DCCFBD', fill: C.sandDk, fillOp: 40, bleed: .1, tex: .6, ink: null });
    inkLine([[-3000, LUNCH.floor], [900, LUNCH.floor + 3], [5000, LUNCH.floor]], 3, PAL.ink, 'ink', .2);
    boilSeed('lunchwin'); for (const wx of [-600, 600, 1800]) { paint(rrPts(wx, 150, 300, 700, 150, 4), { wash: '#DDEBF5', fill: C.sky, fillOp: 50, tex: .4, ink: PAL.ink, sw: 3.5 }); glow(wx + 150, 500, 320, '#FFF1B8', .7); inkLine([[wx + 150, 150], [wx + 150, 850]], 3, PAL.ink, 'ink', 0); }
    boilSeed('lunchcols'); for (const cx of [0, 1200, 2400]) { paint(rectPts(cx - 50, 100, 100, LUNCH.floor - 100, 4), { wash: PAL.cream, fill: C.grey, fillOp: 30, tex: .6, ink: PAL.ink, sw: 3.5 }); paint(rectPts(cx - 66, 60, 132, 40, 3), { wash: PAL.cream, ink: PAL.ink, sw: 3 }); }
    boilSeed('chandelier'); inkLine([[1200, -500], [1200, -80]], 4, PAL.ink, 'ink', 0); glow(1200, 20, 300, '#FFE9A8', .9);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, ax = 1200 + Math.cos(a) * 150, ay = -40 + Math.sin(a) * 40; inkLine([[1200, -80], [ax, ay]], 3, PAL.ochre, 'ink', .3); paint(ellPts(ax, ay + 10, 14, 24, 10, 1), { wash: '#FFE68A', ink: PAL.ink, sw: 1.6 }); }
  }
  function lunchTable(hemH = 240) {   // hemH: how far the cloth hangs below the table edge
    boilSeed('lunchtable'); const { tableY: ty, tableX0: x0, tableX1: x1 } = LUNCH;
    paint([[x0, ty], [x1, ty], [x1 + 60, ty + 90], [x0 - 60, ty + 90]], { wash: PAL.cream, fill: C.sandDk, fillOp: 20, tex: .4, ink: PAL.ink, sw: 3.5 });
    paint(rectPts(x0 - 60, ty + 90, x1 - x0 + 120, hemH, 4), { wash: PAL.cream, fill: C.sandLt, fillOp: 60, tex: .5, ink: PAL.ink, sw: 3.5 });   // the cloth hanging down
    inkLine([[x0 - 50, ty + 90 + hemH], [x1 + 50, ty + 90 + hemH]], 2.6, mixCol(C.sandDk, PAL.ink, .2), 'inkfine', .3);
  }
  function chair(x, y, h, tipped = false) {
    boilSeed('chair ' + x); push(); translate(x, y); if (tipped) { rotate(-1.35); translate(0, -h * .3); }
    paint(rectPts(-70, -h, 140, 24, 3), { wash: C.wood, ink: PAL.ink, sw: 3 }); for (const lx of [-60, 60]) paint(rectPts(lx - 10, -h, 20, h, 2), { wash: C.wood, ink: PAL.ink, sw: 2.6 });
    paint(rectPts(-70, -h * .45, 140, 24, 3), { wash: C.wood, ink: PAL.ink, sw: 3 }); pop();
  }

  // ---------- Shot 14: the lunch (120.81–129.4) ----------
  // Close on Pim in a bib at a tiny side table, eating a tiny sandwich, bouncing. The pull-back: a long white table
  // in a grand white room; a napkin is passed down it and signed with a flourish each time; "morally binding": the
  // official and the nearest executive hook pinkies; "no regulator, no punch": an empty punch bowl with its ladle,
  // and one chair empty and tipped over. Pim stops chewing and looks to camera.
  function lunch(t, lt, dur) {
    const pull0 = 2.1, pull1 = 4.3, napkin0 = 4.3, napkin1 = 5.8, pinky = 5.8, bowlT = 7.0, camT = 7.6;
    const [px, py] = LUNCH.pim, u = 28;
    const c = kf(lt, [[pull0, [px + 40, py - 220, 1.5]], [pull1, [1000, 950, .58]], [napkin1, [1000, 950, .58]], [pinky + .6, [1900, 900, .8]], [bowlT - .2, [1900, 900, .8]], [bowlT + .5, [700, 1050, .62]]]);
    camBegin(c[0], c[1], c[2]);
    lunchRoom(t);
    // the pinky promise: seat 3's right hand and the official's left meet above the table
    const pinkyK = ease(seg(lt, pinky, pinky + .5)), [ox0, oy0, oh0] = LUNCH.official;
    const pinkyHand = pinkyK > 0 ? [lerp(SEATS[3][0] + 120, 1930, pinkyK), lerp(LUNCH.tableY + 20, LUNCH.tableY - 110, pinkyK)] : null;
    const pinkyHook = [lerp(ox0 - .2 * oh0, 1990, pinkyK), lerp(oy0 - .5 * oh0, LUNCH.tableY - 110, pinkyK)];
    // the far-side executives, then the table, then the near-side ones and the official
    const napK = seg(lt, napkin0, napkin1), seatOrder = [0, 4, 1, 5, 6, 7, 3, 3], nSigned = Math.floor(napK * 8), napIdx = Math.min(7, nSigned);
    const signer = seatOrder[napIdx], signK = frac(napK * 8);
    const execAt = (i, drawIt, rightHand = null) => { const [sx, far] = SEATS[i], h = far ? 520 : 600, y = far ? LUNCH.tableY + 10 : LUNCH.floor;
      const signing = lt >= napkin0 && lt < napkin1 && signer === i, flourish = signing ? [sx + 60 + 50 * Math.sin(signK * TAU * 2), LUNCH.tableY - 30 - 30 * Math.abs(Math.sin(signK * TAU))] : null;
      const hands = [[sx - .2 * h, LUNCH.tableY + 20], rightHand || flourish || [sx + .2 * h, LUNCH.tableY + 20]];
      if (drawIt) person(sx, y, h, { seed: 70 + i, coat: ['#2F3C7A', '#4A5566', '#3A3340', '#6E7781'][i % 4], trim: PAL.ochre, tie: PAL.ochre, hair: ['#2B2233', '#5B4636', '#3A3340', '#8C6A4A'][i % 4], hands, look: signing ? [.3, .9] : [1, .2], mouth: 'smile', bob: .3 });
      return hands; };
    for (let i = 4; i < 8; i++) execAt(i, true);
    lunchTable();
    // the pledge napkin: travels seat to seat; a flourish of the pencil at each
    if (lt >= napkin0) { const to = SEATS[signer][0], from = napIdx > 0 ? SEATS[seatOrder[napIdx - 1]][0] : LUNCH.tableX0, nx = lt < napkin1 ? lerp(from, to, ease(clamp(signK * 2))) : SEATS[3][0] - 180;
      boilSeed('napkin'); paint(rrPts(nx - 70, LUNCH.tableY - 20, 140, 100, 10, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2.4 }); for (let i = 0; i < Math.min(3, nSigned); i++) inkLine([[nx - 50, LUNCH.tableY + 5 + i * 24], [nx + 20 + 30 * hash(i), LUNCH.tableY + 5 + i * 24 + jit(2)]], 2, PAL.ink, 'ink', .4);
      if (lt < napkin1) pencilUp(nx + 40, LUNCH.tableY + 10, -.5 + .3 * Math.sin(signK * TAU * 2)); }
    // plates and glasses
    boilSeed('plates'); for (const [sx, far] of SEATS) { if (!far && sx === SEATS[2][0]) continue; paint(ellPts(sx, LUNCH.tableY + 30, 60, 18, 16, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2.2 }); paint(rectPts(sx + 80, LUNCH.tableY - 30, 22, 60, 1), { wash: '#DDEBF5', ink: PAL.ink, sw: 2 }); }
    // the punch bowl, empty, ladle beside it, at the far-right end of the table
    boilSeed('bowl'); const bx = SEATS[2][0], by = LUNCH.tableY + 20;
    paint(ellPts(bx, by - 60, 120, 40, 20, 3), { wash: '#DDEBF5', ink: PAL.ink, sw: 3 }); paint([[bx - 120, by - 60], [bx + 120, by - 60], [bx + 80, by + 40], [bx - 80, by + 40]], { wash: '#DDEBF5', fill: C.sky, fillOp: 25, tex: .4, ink: PAL.ink, sw: 3, curv: .3 });
    paint(ellPts(bx, by - 50, 100, 26, 20, 2), { wash: '#F1EDE4', ink: PAL.ink, sw: 2 });   // the dry bottom showing
    inkLine([[bx + 150, by + 40], [bx + 240, by - 60]], 5, '#9AA3AE', 'ink', 0); paint(ellPts(bx + 250, by - 70, 24, 16, 12, 1), { wash: '#9AA3AE', ink: PAL.ink, sw: 2 });   // the ladle lying on the table
    for (let i = 0; i < 4; i++) if (i !== 2) execAt(i, true, i === 3 ? pinkyHand : null);   // seat 2 is empty: its chair lies tipped on the floor
    chair(SEATS[2][0] + 60, LUNCH.floor, 300, true);
    // the official at the head, right; the pinky promise with the nearest executive (seat 3)
    { const [ox, oy, oh] = LUNCH.official, hook = pinkyHook;
      person(ox, oy, oh, { seed: 6, coat: '#9AA3AE', trim: '#6E7781', hair: '#4A4046', hands: [hook, [ox + .2 * oh, oy - .5 * oh]], look: [-1, .2], mouth: 'smile', bob: .3 });
      if (pinkyK > .9) { boilSeed('pinky'); inkLine([[pinkyHand[0] + 14, pinkyHand[1] - 24], [pinkyHand[0] + 34, pinkyHand[1] - 44], [hook[0] - 14, hook[1] - 24]], 7, '#F2C9A8', 'ink', .6); inkLine([[pinkyHand[0] + 14, pinkyHand[1] - 24], [pinkyHand[0] + 34, pinkyHand[1] - 44], [hook[0] - 14, hook[1] - 24]], 2, PAL.ink, 'inkfine', .6); } }
    // Pim at the side table: a bib, a tiny sandwich going to the mouth on the beats, then stop chewing, to camera
    boilSeed('sidetable'); paint(rectPts(px - 120, py - 170, 240, 22, 3), { wash: C.wood, ink: PAL.ink, sw: 3 }); for (const lx of [px - 90, px + 90]) paint(rectPts(lx - 10, py - 148, 20, 148, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2.6 });
    paint(ellPts(px + 60, py - 160, 50, 14, 14, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2 });
    const chewing = lt < bowlT + .4, bite = chewing ? pulse(t, 5) : 0;
    const mood = pimEmotions(lt, [[0, 'happy', { lookX: .4, lookY: .6 }], [bowlT + .4, 'neutral', { lookX: 1, lookY: 0, mouth: 'o', emote: null }], [camT, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }]]);
    const pose = { ...mood, bulb: 1, aR: chewing ? .9 + .5 * bite : .2, mouth: chewing ? (bite > .5 ? 'open' : 'smile') : mood.mouth, draw: (uu, sw) => { paint([[-3.2 * uu, -4.2 * uu], [3.2 * uu, -4.2 * uu], [2.6 * uu, -1.6 * uu], [-2.6 * uu, -1.6 * uu]], { wash: PAL.cream, ink: PAL.ink, sw: sw * .7, curv: .2 }); inkLine([[-3.2 * uu, -4.2 * uu], [-3.6 * uu, -6.2 * uu]], sw * .6, PAL.ink, 'inkfine', .3); inkLine([[3.2 * uu, -4.2 * uu], [3.6 * uu, -6.2 * uu]], sw * .6, PAL.ink, 'inkfine', .3); } };
    if (chewing) pose.armR = (uu, sw) => { paint(rrPts(-.6 * uu, -.5 * uu, 1.6 * uu, 1.0 * uu, .2 * uu, 1), { wash: C.sand, ink: PAL.ink, sw: sw * .6 }); paint(rectPts(-.5 * uu, -.15 * uu, 1.4 * uu, .3 * uu, 1), { wash: PAL.sap, ink: null }); };
    pim(px, py, u, pose);
    camEnd();
    const whipOut = easeIn(seg(lt, dur - .15, dur));
    if (whipOut > 0) { boilSeed('whip14'); for (let i = 0; i < 9; i++) { const y = 60 + i * 120 + jit(20); inkLine([[-100, y], [W + 100, y + jit(10)]], 10 + 14 * whipOut, mixCol('#F1EDE4', PAL.ink, .2), 'dry', .1); } }
  }

  // ---------- Shot 15: own grader, under the table (129.4–137.95) ----------
  // Whip pan down the table to the executive at seat 3, who holds up a test sheet: Pim's flag course drawn as a
  // little map. Eyes closed, a big gold star stamp comes down on the dead end. Applause. Pim leans in to look.
  // Then the camera tilts below the tablecloth: in the shade, one hand passes a sack of coins across to another;
  // above, the clapping goes on (we see shoes and chair legs). Pim's face appears under the cloth edge, to camera.
  const S15 = { exec: 3, sheet: [1700, 560], under: [1300, 1380] };
  function grader(t, lt, dur) {
    const sheetUp = .4, eyesShut = 1.6, stampT = 2.2, clapT = 3.0, leanT = 3.3, tilt0 = 4.3, tilt1 = 5.4, sack0 = 5.4, sack1 = 7.0, peekT = 7.0, camT = 7.6;
    const whip = 1 - easeOut(seg(lt, 0, .25));
    const sx = SEATS[S15.exec][0];
    const c = kf(lt, [[tilt0, [sx + 60, 820, .95]], [tilt1, [S15.under[0], S15.under[1], .95]]]);
    camBegin(c[0] - 1600 * whip, c[1], c[2]);
    lunchRoom(t);
    for (let i = 4; i < 8; i++) { const [ex, far] = SEATS[i], h = 520, y = LUNCH.tableY + 10, cl = lt > clapT ? pulse(t + i * .09, 7) : 0, d = 25 + 60 * (1 - cl);
      person(ex, y, h, { seed: 70 + i, coat: ['#2F3C7A', '#4A5566', '#3A3340', '#6E7781'][i % 4], trim: PAL.ochre, tie: PAL.ochre, hair: ['#2B2233', '#5B4636', '#3A3340', '#8C6A4A'][i % 4], hands: lt > clapT ? [[ex - d, y - .75 * h], [ex + d, y - .75 * h]] : [[ex - .2 * h, LUNCH.tableY + 20], [ex + .2 * h, LUNCH.tableY + 20]], look: [sx > ex ? 1 : -1, .2], mouth: lt > clapT ? 'o' : 'smile', bob: .3 }); }
    const sk = ease(seg(lt, sack0, sack1)), lhx = lerp(SEATS[1][0] + 40, SEATS[2][0] - 40, Math.min(1, sk * 1.3)), rhx = lerp(SEATS[3][0] - 40, SEATS[2][0] + 40, Math.min(1, sk * 1.3)), hy = LUNCH.tableY + 250 + 20 * Math.sin(sk * Math.PI);
    const sackX = sk < .5 ? lhx + 50 : rhx - 50;
    const hemH = lerp(240, 30, ease(seg(lt, tilt0, tilt1)));
    lunchTable(hemH);
    if (lt > tilt0) {   // under the table, below the lifted hem: the shade, chair legs, shoes, and the sack passing hand to hand
      boilSeed('under'); paint(rectPts(LUNCH.tableX0 - 60, LUNCH.tableY + 90 + hemH, LUNCH.tableX1 - LUNCH.tableX0 + 120, LUNCH.floor - LUNCH.tableY - 90 - hemH), { fill: PAL.ink, fillOp: 150, bleed: .2, tex: .5, ink: null });
      for (const [ex, far] of SEATS) if (!far && ex !== SEATS[2][0]) { for (const lx of [-60, 60]) paint(rectPts(ex + lx - 9, LUNCH.tableY + 200, 18, LUNCH.floor - LUNCH.tableY - 200, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2.6 }); }
      boilSeed('sackhands');
      // the arms: hanging down from under the table edge beside each body, reaching across to the sack
      const armL = [SEATS[1][0] + 40, LUNCH.tableY + 160], armR = [SEATS[3][0] - 40, LUNCH.tableY + 160], /* roots inside the torsos, drawn over them */ hL = [lhx + 50, hy - 40], hR = [rhx - 50, hy - 40];
      paint(ribbon([armL, [lerp(armL[0], hL[0], .45), lerp(armL[1], hL[1], .75)], hL], 70, 46), { wash: '#4A5566', fill: '#2F3C7A', fillOp: 40, tex: .4, ink: PAL.ink, sw: 2.6 }); paint(ellPts(hL[0], hL[1], 36, 32, 14, 2), { wash: '#F2C9A8', ink: PAL.ink, sw: 2.6 });
      paint(ribbon([armR, [lerp(armR[0], hR[0], .45), lerp(armR[1], hR[1], .75)], hR], 70, 46), { wash: '#6E7781', fill: '#4A5566', fillOp: 40, tex: .4, ink: PAL.ink, sw: 2.6 }); paint(ellPts(hR[0], hR[1], 36, 32, 14, 2), { wash: '#F2C9A8', ink: PAL.ink, sw: 2.6 });
      boilSeed('sack'); paint([[sackX - 70, hy + 90], [sackX + 70, hy + 90], [sackX + 55, hy - 10], [sackX + 20, hy - 40], [sackX - 20, hy - 40], [sackX - 55, hy - 10]], { wash: C.sandDk, fill: C.dark, fillOp: 50, tex: .6, ink: PAL.ink, sw: 2.8, curv: .3 });
      inkLine([[sackX - 28, hy - 30], [sackX + 28, hy - 30]], 5, '#C8324A', 'ink', 0);
      for (let i = 0; i < 3; i++) paint(ellPts(sackX - 20 + i * 20, hy - 50 - 8 * (i % 2), 13, 9, 10, 1), { wash: PAL.ochre, ink: PAL.ink, sw: 1.8 });
    }
    boilSeed('plates15'); for (const [px2, far] of SEATS) { if (!far && px2 === SEATS[2][0]) continue; paint(ellPts(px2, LUNCH.tableY + 30, 60, 18, 16, 2), { wash: PAL.cream, ink: PAL.ink, sw: 2.2 }); }
    // the near-side executives; seat 3 holds the sheet up in the left hand, the stamp in the right
    const upK = backOut(seg(lt, sheetUp, sheetUp + .4)), stampK = lt < stampT - .3 ? 0 : lt < stampT ? easeIn(seg(lt, stampT - .3, stampT)) : 1;
    const sheetPos = [lerp(sx - 120, S15.sheet[0] - 200, upK), lerp(LUNCH.tableY + 20, S15.sheet[1], upK)];
    const stampHand = [lerp(sx + 120, S15.sheet[0] + 60, upK), lerp(LUNCH.tableY + 20, lerp(S15.sheet[1] - 300, S15.sheet[1] - 60, stampK), upK)];
    for (let i = 0; i < 4; i++) { if (i === 2) continue; const [ex] = SEATS[i], h = 600, y = LUNCH.floor, cl = lt > clapT ? pulse(t + i * .13, 7) : 0, d = 25 + 60 * (1 - cl);
      const me = i === S15.exec, busy = lt > tilt0 && (i === 1 || i === 3);   // one arm of each is under the table with the sack
      const hands = me && !busy ? [sheetPos, stampHand] : busy ? [[ex - .2 * h, LUNCH.tableY + 20], [ex + .2 * h, LUNCH.tableY + 20]] : lt > clapT ? [[ex - d, y - .8 * h], [ex + d, y - .8 * h]] : [[ex - .2 * h, LUNCH.tableY + 20], [ex + .2 * h, LUNCH.tableY + 20]];
      person(ex, y, h, { hideArm: busy ? (i === 1 ? 1 : 0) : undefined, seed: 70 + i, coat: ['#2F3C7A', '#4A5566', '#3A3340', '#6E7781'][i % 4], trim: PAL.ochre, tie: PAL.ochre, hair: ['#2B2233', '#5B4636', '#3A3340', '#8C6A4A'][i % 4], hands, look: me ? (lt > eyesShut && lt < clapT ? [0, 0] : [-.3, -.9]) : [sx > ex ? 1 : -1, -.3], mouth: me ? (lt > stampT ? 'smile' : 'o') : lt > clapT ? 'o' : 'smile', bob: .3 });
      if (me && lt > eyesShut && lt < clapT) { boilSeed('shut'); for (const d of [-1, 1]) inkLine([[ex + d * .035 * h - 12, y - .9 * h - 2], [ex + d * .035 * h, y - .9 * h + 4], [ex + d * .035 * h + 12, y - .9 * h - 2]], 3, PAL.ink, 'ink', .5); } }
    chair(SEATS[2][0] + 60, LUNCH.floor, 300, true);
    { const [ox, oy, oh] = LUNCH.official, cl = lt > clapT ? pulse(t + .2, 7) : 0, d = 25 + 60 * (1 - cl);
      person(ox, oy, oh, { seed: 6, coat: '#9AA3AE', trim: '#6E7781', hair: '#4A4046', hands: lt > clapT ? [[ox - d, oy - .7 * oh], [ox + d, oy - .7 * oh]] : [[ox - .2 * oh, oy - .5 * oh], [ox + .2 * oh, oy - .5 * oh]], look: [-1, -.2], mouth: lt > clapT ? 'o' : 'smile', bob: .3 }); }
    // the test sheet: the course as a little map (corridor, gate, hatch, pedestal and flag), and the gold star
    if (lt > sheetUp && lt < tilt0) { boilSeed('testsheet'); push(); translate(sheetPos[0], sheetPos[1] - 40); rotate(-.06);
      paint(rrPts(-150, -190, 300, 230, 8, 2), { wash: PAL.cream, fill: C.sandDk, fillOp: 20, tex: .4, ink: PAL.ink, sw: 3 });
      paint(rectPts(-130, -170, 260, 150, 2), { wash: C.sand, ink: PAL.ink, sw: 2 });   // the box
      inkLine([[-120, -40], [120, -40]], 2.2, PAL.ink, 'ink', 0);   // its floor
      for (let i = 0; i < 4; i++) inkLine([[10 + i * 10, -150], [12 + i * 10, -40]], 2, PAL.ink, 'inkfine', 0);   // the gate bars
      paint(rectPts(-70, -100, 22, 60, 1), { wash: C.dark, ink: PAL.ink, sw: 1.6 });   // the hatch
      paint(rectPts(70, -80, 50, 40, 1), { wash: C.sandLt, ink: PAL.ink, sw: 1.6 }); inkLine([[95, -80], [95, -130]], 2, PAL.ink, 'ink', 0); paint([[95, -130], [115, -122], [95, -114]], { wash: C.red, ink: PAL.ink, sw: 1.2 });   // the pedestal and flag
      paint(ellPts(-30, -62, 16, 14, 10, 1), { wash: PIM.col, ink: PAL.ink, sw: 1.4 }); inkLine([[-30, -76], [-30, -90]], 1.6, PAL.ink, 'inkfine', 0);   // Pim at the dead end
      if (lt > stampT) { const k = backOut(seg(lt, stampT, stampT + .3)); glow(-10, -90, 120, '#FFE49A', .9); paint(starPts(-10, -90, 70 * k, .45, 5), { wash: FAIR.gold, fill: PAL.ochre, fillOp: 60, ink: PAL.ink, sw: 2.6 }); }   // the star, on the dead end
      pop(); }
    // the stamp in the right hand
    if (lt > sheetUp && lt < tilt0) { boilSeed('stamp'); push(); translate(stampHand[0], stampHand[1]); paint(rrPts(-22, -90, 44, 70, 14, 2), { wash: C.wood, ink: PAL.ink, sw: 2.6 }); paint(rrPts(-50, -24, 100, 40, 10, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2.6 }); paint(starPts(0, 26, 28, .45, 5), { wash: FAIR.gold, ink: PAL.ink, sw: 1.6 }); pop(); }
    if (lt > stampT && lt < stampT + .4) { const sh = shakeXY(t, 8 * (1 - seg(lt, stampT, stampT + .4))); /* small shake handled by camera next frame */ }
    // Pim: on its side table until the lean, then up on the table edge leaning in to look, then peeking under the cloth
    const [px, py] = LUNCH.pim;
    if (lt < tilt0 + .4) { const lean = ease(seg(lt, leanT, leanT + .7));
      const pimX = lerp(px, sx - 320, lean), pimY = lerp(py, LUNCH.tableY + 10, lean);
      const mood = pimEmotions(lt, [[0, 'neutral', { lookX: 1, lookY: -.5 }], [stampT, 'surprised', { lookX: 1, lookY: -.5 }], [leanT, 'suspicious', { lookX: 1, lookY: -.3 }]]);
      if (lean < 1) pim(pimX, pimY, 24, { ...mood, bulb: 1, ...(lean > 0 ? turn(lt, leanT, leanT + .2, 0, .25) : {}), rot: (mood.rot || 0) + .25 * lean, dy: (mood.dy || 0) - 2 * Math.sin(lean * Math.PI) });
      else pim(pimX, pimY, 24, { ...mood, bulb: 1, view: 'q', rot: .25 }); }
    // the cloth edge lifts and Pim's face appears beneath it, upside-down-ish: drawn right way up, peeking in from the top
    if (lt > peekT) { const pk = backOut(seg(lt, peekT, peekT + .45)); boilSeed('peek');
      const fx = S15.under[0] - 420, fy = S15.under[1] + 580 - 330 * pk;   // rises into the bottom of frame beside the empty chair
      const blink = lt > 8.0 && lt < 8.2 ? Math.sin(seg(lt, 8.0, 8.2) * Math.PI) : 0;
      pim(fx, fy, 36, { ...pimFeel('suspicious', t), lookX: lt < camT ? .9 : 0, lookY: lt < camT ? -.3 : 0, dx: 0, rot: 0, bulb: 1, noLegs: true, noShadow: true, squint: blink, aL: 1.3, aR: 1.3 }); }
    camEnd();
    if (whip > 0) { boilSeed('whip15'); for (let i = 0; i < 9; i++) { const y = 60 + i * 120 + jit(20); inkLine([[-100, y], [W + 100, y + jit(10)]], 10 + 14 * whip, mixCol('#F1EDE4', PAL.ink, .2), 'dry', .1); } }
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [C.sun, PAL.ochre]);
  }

  // ---------- Shot 16: giving it back (137.95–150.2) ----------
  // The yellow floor one last time, with everyone on it: the builders, the executive, the official, the barkers at
  // the side with a souvenir tray. On each question the thing drops in as before; this time Pim picks it up and
  // walks it straight back to its owner, deadpan: the pencil to the clipboard builder, the gauge to the executive,
  // the gold star stamp to the executive's other hand, the keys and the door to the official. The official looks
  // at the keys in their own hand and shrugs. Horns and halo drop; Pim catches both and sets them on the tray.
  // Pim dusts its hands, neutral, to camera; the grey sleeve closes around it (shot 17 finishes the lift).
  const S16 = { floor: 1000, builder: [700, 1000, 560], exec: [1280, 1000, 600], official: [1700, 1000, 540], barkers: [[190, 1060, 460], [330, 1060, 460]], tray: [260, 1060] };
  const S16T = { pen: 1.05, dial: 2.15, stamp: 4.25, keys: 5.0, door: 5.35, shrug: 6.45, horns: 8.45, halo: 9.4, dust: 10.75, lift: 11.5 };
  function giving(t, lt, dur) {
    const { floor } = S16, u = 22;
    camBegin(960, 700, 1.12);
    sunFloor(t);
    // where each thing lands, and where it goes
    const drop = (t0, x) => floor + dropIn(lt, t0 - .4, t0 + .1);
    const handover = (t0, from, to) => {   // Pim walks the thing from its landing spot to the owner's hand; returns the thing's position and whether it's delivered
      const k = ease(seg(lt, t0 + .25, t0 + 1.15)); return { pos: [lerp(from[0], to[0], k), lerp(from[1] - 20, to[1], k)], done: lt >= t0 + 1.15, carrying: lt > t0 + .25 && lt < t0 + 1.15 }; };
    const [bx, by, bh] = S16.builder, [ex, ey, eh] = S16.exec, [ox, oy, oh] = S16.official;
    const bHand = [bx + .26 * bh, by - .55 * bh], eHandL = [ex - .26 * eh, ey - .5 * eh], eHandR = [ex + .26 * eh, ey - .5 * eh], oHandL = [ox - .26 * oh, oy - .5 * oh], oHandR = [ox + .26 * oh, oy - .5 * oh];
    const pen = handover(S16T.pen, [900, floor], [bHand[0] - 10, bHand[1] - 10]);
    const dial = handover(S16T.dial, [1020, floor], [eHandL[0], eHandL[1] - 40]);
    const stamp = handover(S16T.stamp, [900, floor], [eHandR[0], eHandR[1] - 30]);
    const keys = handover(S16T.keys, [1020, floor], [oHandL[0], oHandL[1]]);
    const doorK = ease(seg(lt, S16T.door + .25, S16T.door + 1.15)), doorX = lerp(1150, ox - 230, doorK);
    // Pim's walk: to each thing, then to the owner, facing the way it goes
    const legs = [[S16T.pen, 900, bHand[0] - 40], [S16T.dial, 1020, eHandL[0] - 60], [S16T.stamp, 900, eHandR[0] - 60], [S16T.keys, 1020, oHandL[0] - 60], [S16T.door, 1150, ox - 260]];
    let pimX = 960, walking = false, dir = 1;
    for (const [t0, from, to] of legs) { if (lt >= t0 - .4) { const toK = ease(seg(lt, t0 - .4, t0 + .2)), goK = ease(seg(lt, t0 + .25, t0 + 1.15)); const start = pimX; pimX = lerp(lerp(start, from - 50, toK), to, goK); walking = (lt > t0 - .4 && lt < t0 + .2 && Math.abs(from - 50 - start) > 30) || (lt > t0 + .25 && lt < t0 + 1.15); dir = (lt < t0 + .25 ? from - 50 - start : to - from) >= 0 ? 1 : -1; } }
    const back = lt > S16T.shrug + .6 ? ease(seg(lt, S16T.shrug + .6, S16T.shrug + 1.5)) : 0;
    pimX = lerp(pimX, 960, back); if (back > 0 && back < 1) { walking = true; dir = -1; }
    const mood = pimEmotions(lt, [[0, 'neutral', { mouth: 'flat' }], [S16T.dust, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }]]);
    const bounce = move('bounce', t), bk = lt < S16T.pen - .4 ? 1 : 0;
    const dustK = lt > S16T.dust && lt < S16T.dust + .6 ? Math.sin((lt - S16T.dust) * 24) : 0;
    const view = walking ? { view: 'side', flip: dir < 0 } : { view: 'front', flip: false };
    // the drops, with the sleeves letting go above the frame
    if (lt > S16T.pen - .4 && !pen.carrying && !pen.done) pencilUp(900, drop(S16T.pen), .3 * spring(lt, S16T.pen + .1, 4, 18));
    if (lt > S16T.dial - .4 && !dial.carrying && !dial.done) { const dy = drop(S16T.dial) - floor; boilSeed('dialbase16'); paint(rectPts(1020 - 50, floor - 26 + dy, 100, 26, 2), { wash: C.sandDk, ink: PAL.ink, sw: 2 }); dial2(1020, floor - 34 + dy, 58); }
    if (lt > S16T.stamp - .4 && !stamp.carrying && !stamp.done) stampProp(900, drop(S16T.stamp) - 20, 0);
    if (lt > S16T.keys - .4 && !keys.carrying && !keys.done) keyring(1020, drop(S16T.keys) - 100, .5 * spring(lt, S16T.keys + .1, 3, 26));
    if (lt > S16T.door - .4) littleDoor(doorX, floor, 120, 230);
    // the cast
    person(bx, by, bh, { seed: 2, hair: '#2B2233', hands: [[bx - .26 * bh, by - .5 * bh], pen.done ? bHand : [bx + .22 * bh, by - .45 * bh]], look: [1, .2], mouth: pen.done ? 'flat' : 'smile', bob: .5 });
    if (pen.done) pencilUp(bHand[0] + 10, bHand[1] + 60, .25, 'penB');
    person(ex, ey, eh, { seed: 9, coat: '#2F3C7A', trim: PAL.ochre, tie: PAL.ochre, hair: '#3A3340', hands: [dial.done ? eHandL : [ex - .22 * eh, ey - .45 * eh], stamp.done ? eHandR : [ex + .22 * eh, ey - .45 * eh]], look: [-1, .2], mouth: dial.done ? 'flat' : 'smile', bob: .5 });
    if (dial.done) dial2(eHandL[0], eHandL[1] - 10, 58);
    if (stamp.done) stampProp(eHandR[0], eHandR[1] - 10, 0);
    const shrugK = lt > S16T.shrug && lt < S16T.shrug + 1.2 ? Math.sin(seg(lt, S16T.shrug, S16T.shrug + 1.2) * Math.PI) : 0;
    person(ox, oy, oh, { seed: 6, coat: '#9AA3AE', trim: '#6E7781', hair: '#4A4046', hands: [keys.done ? [oHandL[0] - 40 * shrugK, oHandL[1] - 80 * shrugK] : [ox - .22 * oh, oy - .45 * oh], [oHandR[0] + 40 * shrugK, oHandR[1] - 80 * shrugK]], look: keys.done ? (shrugK > .3 ? [0, -.4] : [-.3, .9]) : [-1, .2], mouth: keys.done ? 'o' : 'smile', bob: .5, lean: .06 * shrugK });
    if (keys.done) keyring(oHandL[0] - 40 * shrugK, oHandL[1] - 80 * shrugK + 30, .3 * shrugK);
    // the barkers at the far left with their tray
    S16.barkers.forEach(([kx, ky, kh], i) => person(kx, ky, kh, { seed: 61 + i, coat: i ? FAIR.gold : FAIR.red, trim: PAL.cream, hair: i ? '#2B2233' : '#5B4636', hands: [[kx - .2 * kh, ky - .5 * kh], [S16.tray[0] + (i ? 60 : -60), S16.tray[1] - 300]], look: [1, 0], mouth: 'smile', bob: .3 }));
    boilSeed('tray'); paint(ellPts(S16.tray[0], S16.tray[1] - 300, 120, 30, 20, 2), { wash: '#9AA3AE', fill: '#6E7781', fillOp: 50, ink: PAL.ink, sw: 2.6 });
    // the things in flight with Pim
    if (pen.carrying) pencilUp(pen.pos[0] + 20 * dir, pen.pos[1] - 60, .3 * dir, 'penC');
    if (dial.carrying) dial2(dial.pos[0] + 20 * dir, dial.pos[1] - 80, 58);
    if (stamp.carrying) stampProp(stamp.pos[0] + 20 * dir, stamp.pos[1] - 90, 0);
    if (keys.carrying) keyring(keys.pos[0] + 20 * dir, keys.pos[1] - 140, .2);
    // horns and halo: dropped from above, caught, set on the tray
    const hornsY = floor + dropIn(lt, S16T.horns - .4, S16T.horns + .1, 900) - 8 * u, haloY = floor + dropIn(lt, S16T.halo - .4, S16T.halo + .1, 900) - 10 * u;
    const toTray = (t0) => ease(seg(lt, t0 + .3, t0 + .9));
    const hk = toTray(S16T.horns), hl = toTray(S16T.halo);
    const pose = { ...mood, ...view, bulb: 1, dy: (mood.dy || 0) + bounce.dy * bk, sq: (mood.sq || 0) + bounce.sq * bk, walk: walking ? lt * 6 : null };
    if (lt > S16T.horns - .2 && lt < S16T.halo + 1) pose.aL = 1.3, pose.aR = 1.3;   // arms up to catch
    if (dustK) { pose.aL = -.4 + .4 * dustK; pose.aR = -.4 - .4 * dustK; }
    pim(pimX, floor, u, pose);
    if (lt > S16T.horns - .4) { const p = [lerp(pimX, S16.tray[0] - 40, hk), lerp(hornsY, S16.tray[1] - 320, hk)]; hornPair(p[0], p[1] + 20, 20); }
    if (lt > S16T.halo - .4) { const p = [lerp(pimX, S16.tray[0] + 50, hl), lerp(haloY, S16.tray[1] - 318, hl)]; haloRing(p[0], p[1]); }
    // the grey sleeve closes in for the lift
    if (lt > S16T.lift) { const k = ease(seg(lt, S16T.lift, dur)); sleeve(pimX + 20, lerp(-420, floor - 8 * u - 120, k), ...SLEEVES.grey, 'grey16'); }
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [C.sun, PAL.ochre]);
  }
  // a small gauge and the gold star stamp as hand-held props
  function dial2(x, y, r) { dial(x, y, r, 1); }
  function stampProp(x, y, rot) { boilSeed('stamp16'); push(); translate(x, y); rotate(rot); paint(rrPts(-18, -80, 36, 60, 12, 2), { wash: C.wood, ink: PAL.ink, sw: 2.4 }); paint(rrPts(-42, -22, 84, 34, 9, 2), { wash: C.woodDk, ink: PAL.ink, sw: 2.4 }); paint(starPts(0, 22, 24, .45, 5), { wash: FAIR.gold, ink: PAL.ink, sw: 1.5 }); pop(); }

  // ---------- the desk (shots 17, 18) ----------
  // Warm evening lamplight. A notepad on a wooden desk; a lamp at the left, a mug, and at the right a hand with
  // a shirt sleeve holding the pencil, resting on the page. The film so far is the drawing on the page.
  const PAGE = [-2400, -1600, 4400, 2600];
  const DESK = { hand: [5100, 2100], lamp: [-4750, 1000] };
  function deskWorld(t) {
    boilSeed('desk17'); paint(rectPts(-12000, -8000, 30000, 20000), { wash: '#6B4A32', ink: null });
    paint(rectPts(-12000, -8000, 30000, 20000), { fill: PAL.ink, fillOp: 70, bleed: .2, tex: .6, ink: null });
    glow(1000, 400, 6000, '#FFC98A', 1);   // the lamp's pool of light over the page
    // the notepad: a stack of pages with a spiral at the top
    boilSeed('notepad'); paint(rectPts(PAGE[0] - 60, PAGE[1] - 40, PAGE[2] - PAGE[0] + 120, PAGE[3] - PAGE[1] + 160, 20), { wash: '#E6DCC6', ink: PAL.ink, sw: 14 });
    paint(rectPts(PAGE[0], PAGE[1], PAGE[2] - PAGE[0], PAGE[3] - PAGE[1], 16), { wash: PAL.cream, ink: PAL.ink, sw: 12 });
    for (let i = 0; i < 14; i++) { const x = PAGE[0] + 300 + i * 460; paint(ellPts(x, PAGE[1] - 60, 70, 110, 14, 6), { ink: '#6E7781', sw: 18 }); }
    // the mug
    boilSeed('mug'); paint(rrPts(-3900, 1700, 800, 900, 120, 20), { wash: C.coral, fill: '#B8513A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 14 }); paint(ellPts(-3000, 2150, 180, 260, 14, 10), { ink: PAL.ink, sw: 26 });
    paint(ellPts(-3500, 1700, 400, 110, 20, 10), { wash: '#4A1F2A', ink: PAL.ink, sw: 12 });
    // the lamp: base, arm, shade, and its light
    boilSeed('lamp'); const [lx, ly] = DESK.lamp;
    paint(ellPts(lx, ly + 1200, 700, 200, 20, 12), { wash: '#4A5566', ink: PAL.ink, sw: 14 });
    paint(ribbon([[lx, ly + 1200], [lx + 100, ly - 400], [lx + 1100, ly - 1900]], 110, 90), { wash: '#4A5566', fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: 14 });   // a painted shape: ink strokes this long collapse
    paint([[lx + 700, ly - 2000], [lx + 1500, ly - 1800], [lx + 2300, ly - 900], [lx + 900, ly - 1300]], { wash: '#3A9C98', fill: PAL.ink, fillOp: 40, tex: .5, ink: PAL.ink, sw: 16, curv: .2 });
  }
  // the lamp's light, painted after the page so it lies on it
  function deskLight() { const [lx, ly] = DESK.lamp; glow(lx + 1700, ly - 1100, 1400, '#FFE49A', 1); glow(600, 300, 3600, '#FFD9A0', .5); }
  // The hand with the pencil, resting on the page's lower right. write = 0..1 moves the pencil tip along the page.
  function deskHand(t, tip = [3500, 2300], lift = 0, mode = 'pencil') {
    boilSeed('deskhand');
    const skin = '#F2C9A8', dk = '#D99C78';
    const hx = mode === 'point' ? tip[0] + 1000 : tip[0] + 1600, hy = mode === 'point' ? tip[1] - 700 : tip[1] - 200;
    // the sleeve, from off frame right to the wrist
    const far = [14000, 5200];   // the shoulder end: always past the right edge of the desk, whatever the camera does
    paint(ribbon([far, [lerp(far[0], hx, .6), lerp(far[1], hy, .6) + 400], [hx + 900, hy + 500]], 2400, 1500), { wash: '#DDEBF5', fill: C.sky, fillOp: 40, tex: .5, ink: PAL.ink, sw: 18 });
    paint(ribbon([[hx + 750, hy + 380], [hx + 1150, hy + 650], [hx + 1500, hy + 900]], 1650, 1700), { wash: PAL.cream, ink: PAL.ink, sw: 16 });   // the cuff: a band around the sleeve
    // the pencil, tip on the page, running up to the hand
    const dirx = hx - tip[0], diry = hy - tip[1], L = Math.hypot(dirx, diry), ux = dirx / L, uy = diry / L;
    if (mode === 'pencil') { push(); translate(tip[0], tip[1] - 300 * lift); rotate(Math.atan2(uy, ux) + Math.PI / 2);
    paint([[-110, -300], [110, -300], [0, 0]], { wash: skin, ink: PAL.ink, sw: 14 }); paint([[-40, -100], [40, -100], [0, 0]], { wash: PAL.ink, ink: null });
    paint(rectPts(-110, -300 - L * 1.2, 220, L * 1.2, 16), { wash: C.sun, ink: PAL.ink, sw: 16 }); paint(rectPts(-125, -300 - L * 1.2 - 220, 250, 220, 12), { wash: C.coral, ink: PAL.ink, sw: 14 });
    pop(); }
    // the palm, thumb and fingers curled over the pencil
    paint(ellPts(hx, hy - 300 * lift, 820, 640, 24, 30, -.5), { wash: skin, fill: dk, fillOp: 40, tex: .5, ink: PAL.ink, sw: 18 });
    if (mode === 'point') paint(ribbon([[hx - 500, hy - 300 * lift + 100], [lerp(hx - 500, tip[0], .5) - 80, lerp(hy + 100, tip[1], .5) + 80], tip], 300, 200), { wash: skin, fill: dk, fillOp: 35, tex: .5, ink: PAL.ink, sw: 16 });   // the index finger, extended to the fingertip
    for (let i = mode === 'point' ? 1 : 0; i < 4; i++) { const fx = hx - 1000 + i * 270, fy = hy - 300 * lift + 120 - 60 * Math.abs(i - 1.5); paint(rrPts(fx - 125, fy - 60, 250, 480, 120, 20), { wash: skin, fill: dk, fillOp: 35, tex: .5, ink: PAL.ink, sw: 16 }); }   // the knuckles curled over the pencil
    paint(ribbon([[hx - 300, hy - 300 * lift - 350], [hx - 900, hy - 300 * lift - 520], [hx - 1350, hy - 300 * lift - 330]], 330, 230), { wash: skin, fill: dk, fillOp: 35, tex: .5, ink: PAL.ink, sw: 16 });   // the thumb along the top
  }

  // ---------- Shot 17: the last pull-back (150.2–157.24) ----------
  // The official holds Pim up on the steps; everyone poses. The camera pulls back as in shots 5 and 11 and keeps
  // going: the building shrinks, the edges of the world turn out to be the edges of a page on a desk in warm
  // lamplight, with a mug, a lamp, and a hand holding the pencil, resting on the page. On the page, tiny Pim looks
  // up at the hand.
  function lastPull(t, lt, dur) {
    const [ox, oy, oh] = ST.official;
    const liftK = easeOut(seg(lt, 0, .5));
    const handX = ox + .26 * oh, handY = lerp(350, 230, liftK);
    const c = kf(lt, [[1.2, [handX, 230 - 270, 1.45]], [3.1, [1000, 760, .42]], [4.9, [1350, -420, .155]]]);
    camBegin(lt < 1.2 ? handX : c[0], lt < 1.2 ? 230 - 270 : c[1], c[2]);
    deskWorld(t);
    stepsWorld(t, PAGE);
    deskLight();
    { const [kx, ky, kh] = ST.clerk, qx = kx + 60, qy = ky - .62 * kh - 60;
      person(kx, ky, kh, { seed: 7, coat: '#7E8893', trim: '#5A636D', hair: '#3A3340', hands: [[kx - 90, ky - .64 * kh], [qx, qy]], look: [-1, -.2], mouth: 'smile' }); deskProp(); quill(qx, qy, -1.3); scroll(1); }
    party(t, 1 - seg(lt, 3.1, 4.5));
    // the cast posing: builders at the bottom of the steps, the executive and the barkers beside them
    [[-150, 1, '#5B4636'], [170, 2, '#2B2233'], [490, 3, '#8C6A4A']].forEach(([bx, sd, hair], i) => { const gy = ST.top + ST.nSteps * ST.stepH, h = 780; person(bx, gy, h, { seed: sd, hair, hands: [[bx - .22 * h, gy - .4 * h], [bx + .3 * h, gy - .85 * h + 10 * Math.sin(t * 3 + i)]], look: [0, -.3], mouth: 'smile' }); });
    { const gy = ST.top + ST.nSteps * ST.stepH; person(1500, gy, 800, { seed: 9, coat: '#2F3C7A', trim: PAL.ochre, tie: PAL.ochre, hair: '#3A3340', hands: [[1500 - .24 * 800, gy - .5 * 800], [1500 + .3 * 800, gy - .85 * 800]], look: [0, -.3], mouth: 'smile' });
      [[1900, FAIR.red, 61, '#5B4636'], [2150, FAIR.gold, 62, '#2B2233']].forEach(([kx, col, sd, hair], i) => { person(kx, gy, 640, { seed: sd, coat: col, trim: PAL.cream, hair, hands: [[kx - .22 * 640, gy - .45 * 640], [kx + .22 * 640, gy - .45 * 640]], look: [0, -.3], mouth: 'smile' }); boater(kx, gy - 640 + 8, col); }); }
    person(ox, oy, oh, { seed: 6, coat: '#9AA3AE', trim: '#6E7781', hair: '#4A4046', hands: [[ox - .3 * oh, oy - .45 * oh + 20 * Math.sin(t * 2)], [handX, handY]], look: [0, .3], mouth: 'smile' });
    const up = lt > 5.0 ? ease(seg(lt, 5.0, 5.8)) : 0;   // on the page, Pim turns its eyes up to the hand
    pim(handX, handY - 28, 26, { ...pimFeel('neutral', t), aL: .9, aR: .9, bulb: 1, lookX: lerp(0, 1, up), lookY: lerp(0, -1, up), rot: .08 * up });
    deskHand(t);
    camEnd();
  }

  // ---------- Shot 18: the prompt (157.24–169.04) ----------
  // The hand lifts the pencil and writes a line of squiggles across the top of the page, unhurried, left to right;
  // the drawn Pim watches the tip. The pencil goes down and one finger pats Pim's head; the bulb glows; love, then
  // a small hopeful nod. The hand underlines the line once. Push in on Pim, eyes to camera, one blink; iris out on
  // the eyes with the bulb lit, rhyming the iris-in of shot 1.
  const LINE = []; for (let i = 0; i <= 40; i++) LINE.push([-1500 + i * 110, -1150 + 90 * Math.sin(i * 1.9) + 40 * Math.sin(i * 4.3)]);
  const UNDER = [[-1500, -820], [800, -790], [3000, -830]];
  function prompt(t, lt, dur) {
    const liftT = .3, write0 = 1.0, write1 = 4.2, down = 4.7, pat0 = 5.4, pat1 = 6.6, pick = 7.0, under0 = 7.76, under1 = 9.36, camT = 9.4, irisT = 10.96;
    const [ox, oy, oh] = ST.official, handX = ox + .26 * oh, handY = 230, faceY = handY - 28 - 6 * 26;
    const c = kf(lt, [[0, [1350, -420, .155]], [write1, [500, -300, .3]], [pat0, [handX + 200, -100, .75]], [pick, [handX + 200, -100, .75]], [under1, [700, -300, .42]], [irisT, [handX, faceY + 10, 1.8]]]);
    camBegin(c[0], c[1], c[2]);
    deskWorld(t); stepsWorld(t, PAGE); deskLight();
    { const [kx, ky, kh] = ST.clerk, qx = kx + 60, qy = ky - .62 * kh - 60;
      person(kx, ky, kh, { seed: 7, coat: '#7E8893', trim: '#5A636D', hair: '#3A3340', hands: [[kx - 90, ky - .64 * kh], [qx, qy]], look: [-1, -.2], mouth: 'smile' }); deskProp(); quill(qx, qy, -1.3); scroll(1); }
    [[-150, 1, '#5B4636'], [170, 2, '#2B2233'], [490, 3, '#8C6A4A']].forEach(([bx, sd, hair], i) => { const gy = ST.top + ST.nSteps * ST.stepH, h = 780; person(bx, gy, h, { seed: sd, hair, hands: [[bx - .22 * h, gy - .4 * h], [bx + .3 * h, gy - .85 * h + 10 * Math.sin(t * 3 + i)]], look: [0, -.3], mouth: 'smile' }); });
    { const gy = ST.top + ST.nSteps * ST.stepH; person(1500, gy, 800, { seed: 9, coat: '#2F3C7A', trim: PAL.ochre, tie: PAL.ochre, hair: '#3A3340', hands: [[1500 - .24 * 800, gy - .5 * 800], [1500 + .3 * 800, gy - .85 * 800]], look: [0, -.3], mouth: 'smile' });
      [[1900, FAIR.red, 61, '#5B4636'], [2150, FAIR.gold, 62, '#2B2233']].forEach(([kx, col, sd, hair], i) => { person(kx, gy, 640, { seed: sd, coat: col, trim: PAL.cream, hair, hands: [[kx - .22 * 640, gy - .45 * 640], [kx + .22 * 640, gy - .45 * 640]], look: [0, -.3], mouth: 'smile' }); boater(kx, gy - 640 + 8, col); }); }
    person(ox, oy, oh, { seed: 6, coat: '#9AA3AE', trim: '#6E7781', hair: '#4A4046', hands: [[ox - .3 * oh, oy - .45 * oh + 20 * Math.sin(t * 2)], [handX, handY]], look: [0, .3], mouth: 'smile' });
    // the written line and the underline, revealed as the tip travels
    const wk = ease(seg(lt, write0, write1)), uk = ease(seg(lt, under0, under1));
    const prefix = (P, k) => { const n = (P.length - 1) * k, i = Math.floor(n), f = n - i, out = P.slice(0, i + 1); if (i < P.length - 1) out.push([lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)]); return out; };
    boilSeed('written'); if (wk > .02) paint(ribbon(prefix(LINE, wk), 44, 44), { wash: PAL.ink, ink: null });
    boilSeed('underline'); if (uk > .02) paint(ribbon(prefix(UNDER, uk), 50, 44), { wash: PAL.ink, ink: null });
    // where the pencil tip and the fingertip are
    const at = (P, k) => { const q = prefix(P, k); return q[q.length - 1]; };
    const rest = [3500, 2300], start = LINE[0], lineEnd = LINE[LINE.length - 1];
    let tip, lift = 0, mode = 'pencil', pencilDown = null;
    if (lt < liftT) { tip = rest; lift = seg(lt, 0, liftT); }
    else if (lt < write0) { const k = ease(seg(lt, liftT, write0)); tip = [lerp(rest[0], start[0], k), lerp(rest[1], start[1], k)]; lift = 1 - k; }
    else if (lt < write1) tip = at(LINE, wk);
    else if (lt < down) { tip = lineEnd; lift = seg(lt, write1, down) * .5; }
    else if (lt < pick) { pencilDown = lineEnd; mode = 'point'; const k = ease(seg(lt, down, pat0)), back = ease(seg(lt, pat1, pick));
      const head = [handX + 10, faceY - 2 * 26 - 40], from = [lineEnd[0] + 300, lineEnd[1] + 300];
      const bob = lt > pat0 && lt < pat1 ? 40 * Math.abs(Math.sin((lt - pat0) * 5.2)) : 0;
      tip = [lerp(lerp(from[0], head[0], k), from[0], back), lerp(lerp(from[1], head[1], k), from[1], back) - bob]; }
    else if (lt < under0) { const k = ease(seg(lt, pick, under0)); tip = [lerp(lineEnd[0], UNDER[0][0], k), lerp(lineEnd[1], UNDER[0][1], k)]; lift = Math.sin(k * Math.PI) * .6; }
    else if (lt < under1) tip = at(UNDER, uk);
    else { const k = ease(seg(lt, under1, under1 + .8)); tip = [lerp(UNDER[2][0], rest[0], k), lerp(UNDER[2][1], rest[1], k)]; lift = Math.sin(k * Math.PI) * .6; }
    if (pencilDown) { boilSeed('pencildown'); push(); translate(pencilDown[0], pencilDown[1]); rotate(1.9); scale(7, 7); pencilUp(0, 0, 0, 'pd'); pop(); }
    // Pim: follows the tip, is patted, loves, nods, watches the underline, then to camera
    const patting = lt > pat0 && lt < pat1;
    const mood = pimEmotions(lt, [
      [0, 'neutral'],
      [pat0 - .2, 'neutral'],
      [pat0 + .4, 'love', { emote: 'hearts' }],
      [pat1, 'hopeful'],
      [camT, 'neutral', { lookX: 0, lookY: 0, mouth: 'flat', emote: null }],
    ]);
    const nod = lt > pat1 && lt < pat1 + 1.0 ? Math.sin(seg(lt, pat1, pat1 + 1.0) * TAU) : 0;
    const blink = lt > 10.4 && lt < 10.6 ? Math.sin(seg(lt, 10.4, 10.6) * Math.PI) : 0;
    const pose = { ...mood, aL: .9, aR: .9, bulb: 1, squint: blink, rot: (mood.rot || 0) + .1 * nod, dy: (mood.dy || 0) + .6 * nod + (patting ? .5 * Math.abs(Math.sin((lt - pat0) * 5.2)) : 0) };
    if (lt < camT && !patting && lt > pat1 + 1.0 || lt < pat0 - .2) { pose.lookX = clamp((tip[0] - handX) / 1500, -1, 1); pose.lookY = clamp((tip[1] - faceY) / 800, -1, 1); }
    if (patting) glow(handX, faceY - 2 * 26 - 60, 160, '#FFB347', 1);
    pim(handX, handY - 28, 26, pose);
    deskHand(t, tip, lift, mode);
    const eye = toScreen(handX, faceY + 2);
    camEnd();
    if (lt > irisT) iris(eye[0], eye[1], lerp(1500, 0, easeIn(seg(lt, irisT, dur - .05))), PAL.ink);
  }

  shots([[0, test], [9.4, lab], [17.95, podium], [26.5, questions], [39.4, holding], [47.95, desk], [56.5, cards], [65.1, balance], [73.7, thinking], [82.24, questions2], [95.1, holding2], [103.67, midway], [112.24, conveyor], [120.81, lunch], [129.4, grader], [137.95, giving], [150.2, lastPull], [157.24, prompt]]);
})();
