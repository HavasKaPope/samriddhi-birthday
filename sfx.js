/* ==========================================================
   SFX — soft touch sounds for the whole project (optional)
   No sound files needed: every sound is made live by the browser.

   HOW TO ADD:    put this ONE line at the very end of index.html,
                  just before </body>:
                      <script src="sfx.js" defer></script>
   HOW TO REMOVE: delete that line. Nothing else changes.

   What you will hear
   - passcode keys: a soft "pop" (each number a slightly different note),
     clear/delete, unlock chime, wrong-code "bonk", success sparkle
   - every other button: a gentle tap
   - screen changes: a small whoosh, curtains: a swish
   - scratch card: scratchy sound while rubbing, sparkle when revealed
   - ending: door click, door opening, friends' boing, speech pop, fish plop

   Volume: change MASTER below (0.0 to 1.0).
   Mute:   the music on/off button (top right) also mutes these sounds.
   ========================================================== */

(() => {
  "use strict";
  const MASTER = 0.34;

  let ctx = null, master = null, lastNoise = 0;
  const lastPlay = {};

  /* ---------- sound engine ---------- */

  function init() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = MASTER;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }

  function enabled() {
    const b = document.getElementById("musicButton");
    if (b && !b.hidden && (b.classList.contains("on") === false) && b.getAttribute("aria-pressed") === "false") return false;
    return true;
  }

  // rate-limit each sound so nothing ever machine-guns
  function ok(name, gap) {
    const t = performance.now();
    if (lastPlay[name] && t - lastPlay[name] < gap) return false;
    lastPlay[name] = t;
    return true;
  }

  function ready() {
    if (!enabled()) return false;
    if (!init()) return false;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return true;
  }

  // one soft note: freq (Hz), duration (s), wave, volume, optional glide target, delay (s)
  function tone(freq, dur, type, vol, glide, delay) {
    const t0 = ctx.currentTime + (delay || 0);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(30, glide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }

  // a puff of filtered noise (whoosh, scratch, splash)
  function noise(dur, vol, f0, f1, delay, q) {
    const t0 = ctx.currentTime + (delay || 0);
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(); s.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = q || 1.2;
    f.frequency.setValueAtTime(f0, t0); f.frequency.exponentialRampToValueAtTime(Math.max(60, f1 || f0), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0); s.stop(t0 + dur + 0.03);
  }

  /* ---------- the sounds ---------- */

  const SCALE = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5, 1174.66, 1318.5];   // a happy major scale

  const S = {
    tap()      { if (!ok("tap", 60)) return;  tone(620, 0.09, "sine", 0.32, 430); tone(1240, 0.05, "triangle", 0.08, 900); },
    key(d)     { if (!ok("key", 40)) return;  const f = SCALE[(+d || 0) % SCALE.length] * 0.75; tone(f, 0.16, "sine", 0.34, f * 0.9); tone(f * 2, 0.08, "triangle", 0.1, f * 1.8); },
    del()      { if (!ok("del", 50)) return;  tone(330, 0.1, "triangle", 0.26, 220); },
    unlock()   { if (!ok("unlock", 200)) return; tone(659.25, 0.18, "sine", 0.3, null, 0); tone(880, 0.22, "sine", 0.3, null, 0.08); },
    wrong()    { if (!ok("wrong", 1200)) return; tone(260, 0.22, "triangle", 0.4, 170, 0); tone(200, 0.3, "triangle", 0.4, 120, 0.16); },
    success()  { if (!ok("success", 600)) return; [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => { tone(f, 0.5, "sine", 0.26, null, i * 0.09); tone(f * 2, 0.3, "triangle", 0.06, null, i * 0.09); }); },
    whoosh()   { if (!ok("whoosh", 300)) return; noise(0.55, 0.22, 500, 2600, 0, 0.8); },
    swish()    { if (!ok("swish", 300)) return; noise(0.9, 0.2, 2200, 380, 0, 0.7); },
    scratch()  { const t = performance.now(); if (t - lastNoise < 70) return; lastNoise = t; noise(0.07, 0.16, 2600 + Math.random() * 1500, 1800, 0, 2.5); },
    sparkle()  { if (!ok("sparkle", 500)) return; for (let i = 0; i < 7; i++) tone(1046.5 * Math.pow(1.122, i * 1.4) , 0.35, "sine", 0.17, null, i * 0.07); },
    lock()     { if (!ok("lock", 300)) return; tone(180, 0.06, "square", 0.22, 90, 0); tone(120, 0.1, "square", 0.2, 70, 0.07); },
    doorOpen() { if (!ok("door", 600)) return; noise(1.1, 0.2, 180, 700, 0, 1.5); tone(140, 0.9, "sawtooth", 0.07, 90); },
    boing()    { if (!ok("boing", 80)) return; tone(260, 0.32, "sine", 0.36, 620); tone(520, 0.2, "triangle", 0.12, 900, 0.03); },
    pop()      { if (!ok("pop", 100)) return; tone(520, 0.1, "sine", 0.34, 880); },
    plop()     { if (!ok("plop", 900)) return; tone(420, 0.12, "sine", 0.1, 160); noise(0.18, 0.05, 1800, 600, 0.01, 1); },
    end()      { if (!ok("end", 1500)) return; [392, 523.25, 659.25].forEach((f, i) => tone(f, 1.4, "sine", 0.2, null, i * 0.2)); }
  };
  Object.assign(S, {
    // an aeroplane / wind passing by: airy swell with a low hum (the postman's balloons)
    flyby(v) { if (!ok("flyby", 1500)) return; v = v || 1;
      noise(3.6, 0.30 * v, 260, 1500, 0, 0.6); noise(3.6, 0.22 * v, 1700, 380, 0.5, 0.7);
      tone(95, 3.4, "sawtooth", 0.035 * v, 150); tone(190, 3.2, "sine", 0.03 * v, 120, 0.3); },
    drop()   { if (!ok("drop", 800)) return; tone(950, 0.75, "sine", 0.1, 280); noise(0.6, 0.12, 3000, 1200, 0.05, 1.6); },
    thud()   { if (!ok("thud", 300)) return; tone(130, 0.22, "sine", 0.4, 55); noise(0.09, 0.1, 900, 300, 0, 1); },
    paper()  { if (!ok("paper", 400)) return; noise(0.35, 0.2, 3200, 1400, 0, 1.4); noise(0.25, 0.14, 2200, 900, 0.18, 1.4); },
    pen()    { if (!ok("pen", 85)) return; tone(1700 + Math.random() * 500, 0.03, "triangle", 0.05); },
    gasp()   { if (!ok("gasp", 500)) return; tone(420, 0.16, "sine", 0.3, 820); tone(820, 0.1, "triangle", 0.08, 1100, 0.05); },
    squeal() { if (!ok("squeal", 500)) return; tone(600, 0.3, "sine", 0.22, 1100); tone(900, 0.3, "sine", 0.14, 1500, 0.1); },
    lightswitch() { if (!ok("ls", 600)) return; tone(220, 0.04, "square", 0.2, 120); tone(330, 0.05, "square", 0.16, 160, 0.06);
      [261.6, 329.6, 392, 523.25].forEach((f, i) => tone(f, 1.1, "sine", 0.16, null, 0.15 + i * 0.07)); },
    pageflip() { if (!ok("pf", 500)) return; noise(0.28, 0.22, 3400, 1300, 0, 1.2); noise(0.2, 0.14, 2600, 1000, 0.12, 1.2); },
    twinkle() { if (!ok("tw", 500)) return; const f = SCALE[(Math.random() * 6) | 0] * 2; tone(f, 0.5, "sine", 0.14); tone(f * 1.5, 0.35, "sine", 0.07, null, 0.08); },
    zing()   { if (!ok("zing", 500)) return; tone(2400, 0.5, "sine", 0.12, 600); noise(0.45, 0.08, 4000, 1200, 0, 2); },
    crystal() { if (!ok("crys", 600)) return; noise(0.25, 0.2, 5000, 2500, 0, 2.5); [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, 0.7, "sine", 0.1, null, i * 0.05)); },
    // cake
    light(i) { if (!ok("light" + i, 350)) return; noise(0.1, 0.22, 2800, 1000, 0, 2); tone(180, 0.2, "sine", 0.18, 520, 0.05);
      const f = SCALE[(i || 0) % SCALE.length]; tone(f, 0.5, "sine", 0.2, null, 0.12); tone(f * 2, 0.3, "triangle", 0.06, null, 0.12); },
    blow()   { if (!ok("blow", 2500)) return; noise(1.1, 0.42, 380, 1100, 0, 0.5); noise(0.9, 0.2, 900, 300, 0.1, 0.5); },
    puff(i)  { if (!ok("puff" + i, 200)) return; noise(0.14, 0.14, 1600, 500, 0, 1); tone(Math.max(220, 760 - (i || 0) * 55), 0.14, "sine", 0.12, 200); },
    popper() { if (!ok("popper", 1500)) return; [0, 0.13, 0.3].forEach((d) => { noise(0.07, 0.34, 2600, 600, d, 0.8); tone(320, 0.1, "triangle", 0.2, 90, d); }); },
    cheer()  { if (!ok("cheer", 1200)) return; noise(0.4, 0.3, 700, 3500, 0, 0.7); [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.9, "sine", 0.2, null, 0.08 + i * 0.04));
      for (let i = 0; i < 6; i++) tone(1568 * Math.pow(1.09, i), 0.3, "sine", 0.09, null, 0.3 + i * 0.07); },
    slice()  { if (!ok("slice", 800)) return; noise(0.3, 0.3, 3600, 1300, 0, 0.9); tone(1900, 0.3, "sine", 0.05, 1500, 0.02); tone(110, 0.2, "sine", 0.3, 55, 0.24); },
    // eating: soft cake munches
    chew(n, vol) { if (!ok("chew", 700)) return; n = n || 4; vol = vol || 1;
      for (let i = 0; i < n; i++) { const d = i * 0.27 + Math.random() * 0.04;
        noise(0.1, 0.3 * vol, 900 + Math.random() * 400, 320, d, 0.9); tone(150 + Math.random() * 40, 0.12, "sine", 0.18 * vol, 85, d); } },
    bite(k)  { if (!ok("bite", 250)) return; noise(0.13, 0.34, 2000, 800, 0, 1.2); tone(240 - (k || 1) * 25, 0.12, "sine", 0.24, 110); },
    // gift
    fanfare() { if (!ok("fan", 1500)) return; [392, 523.25, 659.25, 784, 1046.5].forEach((f, i) => { tone(f, 0.8, "triangle", 0.16, null, i * 0.1); tone(f * 2, 0.5, "sine", 0.05, null, i * 0.1); }); },
    whirr()  { if (!ok("whirr", 1200)) return; tone(220, 1.0, "sawtooth", 0.05, 900); tone(330, 1.0, "sine", 0.07, 1100); },
    ding()   { if (!ok("ding", 600)) return; tone(1318.5, 1.0, "sine", 0.22); tone(1975.5, 0.8, "sine", 0.1, null, 0.04); },
    keyturn() { if (!ok("kt", 800)) return; tone(900, 0.05, "square", 0.12, 500); tone(700, 0.05, "square", 0.12, 400, 0.18); tone(150, 0.1, "square", 0.14, 90, 0.36); }
  });

  window.SFX = S;   // test in the console:  SFX.success()

  const run = (fn, ...a) => { try { if (ready()) fn(...a); } catch (e) { /* never break the project */ } };

  /* ---------- touches: keys and buttons ---------- */

  document.addEventListener("pointerdown", (e) => {
    try {
      init();                                                        // the browser only allows sound after a touch
      const el = e.target.closest ? e.target.closest("button, [role=button], .s8-gift, .s4-book") : null;
      if (!el || el.disabled) return;
      if (el.matches(".number-key[data-digit]")) return run(S.key, el.dataset.digit);
      if (el.matches(".number-key")) return run(S.del);
      if (el.matches(".unlock-button")) return run(S.unlock);
      if (el.matches("#musicButton")) return;                        // the music button is silent
      run(S.tap);
    } catch (err) { /* ignore */ }
  }, true);

  // keyboard typing on the passcode screen
  document.addEventListener("keydown", (e) => {
    if (/^\d$/.test(e.key)) { const s = document.getElementById("passcodeScene"); if (s && !s.hidden) run(S.key, e.key); }
    else if (e.key === "Backspace") run(S.del);
  });

  // rubbing the scratch card
  document.addEventListener("pointermove", (e) => {
    if (e.buttons && e.target && e.target.id === "s8Foil") run(S.scratch);
  }, true);

  /* ---------- project events ---------- */

  document.addEventListener("passcode:unlocked", () => run(S.success));
  document.addEventListener("screen:enter", () => run(S.whoosh));

  /* ---------- things that happen on their own ---------- */

  const once = (el, key) => { const k = el; const set = (el.__sfx = el.__sfx || {}); if (set[key]) return false; set[key] = 1; return true; };

  // plays fn each time `cls` is newly added to el (and again if it is removed and added later)
  function rise(el, cls, key, fn) {
    const st = (el.__sfx2 = el.__sfx2 || {});
    const has = el.classList.contains(cls);
    if (has && !st[key]) { st[key] = 1; fn(el); }
    else if (!has) st[key] = 0;
  }
  const inside = (el, id) => el.closest && el.closest("#" + id);

  function onClass(el) {
    const c = el.classList, id = el.id;

    // passcode + curtains + scratch card
    if (id === "wrongScreen") rise(el, "wrong-visible", "w", () => run(S.wrong));
    if (id === "s8Scr") rise(el, "shown", "rev", () => run(S.sparkle));
    if (c.contains("curtain")) {
      if (c.contains("closed") && !c.contains("hold") && !c.contains("fade")) run(S.swish);
      else if (c.contains("open") && !c.contains("fade")) run(S.swish);
    }

    // element 3: the sleeping bear and the lights
    if (c.contains("s3-bear") || inside(el, "screen3")) {
      rise(el, "awake", "aw", () => run(S.gasp));
      rise(el, "joy", "joy", () => run(S.squeal));
    }
    if (id === "screen3") rise(el, "lit", "lit", () => run(S.lightswitch));

    // element 4: the book opens
    if (id === "screen4") rise(el, "opened", "op", () => { run(S.pageflip); run(S.sparkle); });

    // element 5: the postman on balloons
    if (id === "screen5") {
      rise(el, "deliver", "dl", () => run(S.flyby, 1));       // he floats down: wind and a soft engine hum
      rise(el, "dropped", "dr", () => run(S.drop));           // he lets the letter go
      rise(el, "landed", "ld", () => run(S.thud));            // it lands
      rise(el, "leave", "lv", () => run(S.flyby, 0.7));       // he floats away
      rise(el, "opening", "opn", () => run(S.paper));         // the letter unfolds
      rise(el, "done", "dn", () => run(S.sparkle));
    }
    if (id === "s5Pm") rise(el, "say", "say", () => run(S.pop));
    if (inside(el, "screen5") && el.tagName === "SPAN" && c.contains("on") && !c.contains("float-particle")) rise(el, "on", "ch", () => run(S.pen));

    // element 6: the wish
    if (inside(el, "screen6")) {
      rise(el, "break", "br", () => run(S.crystal));
      rise(el, "go", "go", () => run(S.zing));
      if (id === "screen6") rise(el, "blessed", "bl", () => { run(S.sparkle); run(S.cheer); });
      else rise(el, "on", "on", () => run(S.twinkle));
    }

    // element 7: the cake
    if (c.contains("s7-flame")) {
      const i = +el.dataset.i || 0;
      rise(el, "on", "on", () => run(S.light, i));            // each candle: a match strike and its own note
      rise(el, "wind", "wd", () => run(S.blow));              // one big breath
      rise(el, "out", "out", () => run(S.puff, i));           // each candle: a little "pff", lower each time
    }
    if (id === "s7Flash") rise(el, "go", "go", () => run(S.cheer));
    if (id === "screen7") rise(el, "lights", "lt", () => run(S.popper));
    if (c.contains("s7-knife")) rise(el, "drag", "dg", () => run(S.tap));
    if (inside(el, "screen7")) {
      rise(el, "cut", "cut", () => run(S.slice));                                  // the knife goes through the cake
      rise(el, "chew", "chew", () => { run(S.bite, 1); run(S.chew, 4, 1); });      // she takes a bite and chews
      rise(el, "munch", "mun", () => run(S.chew, 3, 0.6));                         // a friend eats their slice
      for (let k = 1; k <= 4; k++) rise(el, "b" + k, "b" + k, () => run(S.bite, k));
    }

    // element 8: the big gift
    if (id === "screen8" || inside(el, "screen8")) {
      rise(el, "open", "gop", () => run(S.fanfare));
      rise(el, "spin", "sp", () => run(S.whirr));
      rise(el, "won", "won", () => run(S.ding));
      rise(el, "turn", "tn", () => run(S.keyturn));
      if (c.contains("s8-flash") || c.contains("flash")) rise(el, "go", "fl", () => run(S.cheer));
    }

    // element 9: the ending
    if (c.contains("s9-door")) {
      rise(el, "shake", "sh", () => run(S.lock));
      rise(el, "open", "op", () => run(S.doorOpen));
    }
    if (c.contains("s9-title")) rise(el, "on", "t", () => run(S.sparkle));
    if (c.contains("s9-bubble")) rise(el, "on", "b", () => run(S.pop));
    if (c.contains("s9-theend")) rise(el, "on", "e", () => run(S.end));
  }

  function onAdded(n) {
    if (!n || n.nodeType !== 1) return;
    const c = n.classList;
    if (c.contains("s9-actor")) run(S.boing);
    else if (c.contains("s9-rip")) run(S.plop);
    else if (c.contains("s9-replay")) run(S.sparkle);
    else if (c.contains("s9-modal")) run(S.pop);
  }

  // the wrong-code box is shown by removing "hidden": watch that too
  function onHidden(el) {
    if (el.id === "wrongScreen" && !el.hidden) run(S.wrong);
  }

  const mo = new MutationObserver((list) => {
    for (const m of list) {
      try {
        if (m.type === "childList") m.addedNodes.forEach(onAdded);
        else if (m.attributeName === "class") onClass(m.target);
        else if (m.attributeName === "hidden") onHidden(m.target);
      } catch (e) { /* ignore */ }
    }
  });
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden"] });
})();

/* ---- MUSIC BALANCE (delete this block to restore original loudness) ---- */
(function () {
  const BASE = 0.15;            // normal music level (was 0.6). Raise/lower to taste: 0.15 quiet … 0.35 louder
  let tries = 0;
  function patch() {
    const M = window.Music;
    if (!M || M.__balanced) return;
    const orig = M.duck.bind(M);
    M.duck = (on, level) => orig(true, on ? (level === undefined ? Math.min(0.08, BASE) : Math.min(level, BASE)) : BASE);
    M.__balanced = true;
  }
  patch();
  function settle() { patch(); if (window.Music) window.Music.duck(false); }
  // original fades in to 0.6 over 2.5s after the first tap; pull it down right after
  document.addEventListener("pointerdown", () => { [2800, 6000].forEach((t) => setTimeout(settle, t)); }, { once: true });
})();
