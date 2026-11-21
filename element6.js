/* ==========================================
   ELEMENT 6 — MAKE A WISH (the wishing sky)
   Night falls. She stands on a hill with her friends beside her.
   A shooting star arrives and waits above them while a quiet
   timer holds the moment, so she can really make a wish.
   (Everything is built here: this one file is enough.)
   Settings live in screens.js → CONFIG.wish
========================================== */

(() => {
  const screen = document.getElementById("screen6");
  if (!screen) { console.error("Element 6: #screen6 is missing in index.html"); return; }

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const cfg = window.CONFIG || {};
  const wish = cfg.wish || {};
  const SECONDS = wish.seconds || 12;
  const AFTER_TITLE = wish.afterTitle || "Your wish is on its way \u2661";
  const CHEERS = wish.cheers || ["Yay! \u2661", "Wish made!", "Go, you!"];
  const AFTER_TEXT = wish.afterText || "Whatever you wished for, I am wishing it for you too.";

  /* ---------------- styles ---------------- */

  const css = `
  .s6 { overflow: hidden; color: #fff6e6; font-family: "Nunito", "Nunito Local", sans-serif;
    background: radial-gradient(ellipse at 50% 30%, #231f66 0%, #14113f 50%, #0a0826 100%); }

  .s6-sky, .s6-flies { position: absolute; inset: 0; pointer-events: none; }
  .s6-star { position: absolute; left: var(--x); top: var(--y); width: var(--z); height: var(--z); border-radius: 50%; background: #fff;
    box-shadow: 0 0 6px rgba(255, 255, 255, .8); opacity: .25; animation: s6Twinkle var(--d) ease-in-out var(--dl) infinite alternate; }
  @keyframes s6Twinkle { to { opacity: 1; transform: scale(1.6); } }
  .s6.blessed .s6-star { animation-duration: 1.2s; }

  .s6-moon { position: absolute; right: 11%; top: 8%; width: clamp(60px, 9vw, 110px); aspect-ratio: 1; border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle at 36% 34%, #fffbe8, #ffeaa8 60%, #f4d27c);
    box-shadow: 0 0 50px 14px rgba(255, 236, 170, .3), 0 0 120px 40px rgba(255, 236, 170, .12); }
  .s6-moon::before, .s6-moon::after { content: ""; position: absolute; border-radius: 50%; background: rgba(214, 178, 96, .35); }
  .s6-moon::before { width: 22%; height: 22%; left: 52%; top: 24%; }
  .s6-moon::after { width: 14%; height: 14%; left: 28%; top: 56%; }

  .s6-fly { position: absolute; left: var(--x); top: var(--y); width: 5px; height: 5px; border-radius: 50%; background: #ffe58a;
    box-shadow: 0 0 10px 3px rgba(255, 229, 138, .8); animation: s6Fly var(--d) ease-in-out var(--dl) infinite alternate; }
  @keyframes s6Fly { 0% { transform: translate(0, 0); opacity: .2; } 50% { opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)); opacity: .3; } }

  .s6-hills { position: absolute; left: 0; bottom: 0; width: 100%; height: 30vh; pointer-events: none; }

  /* the evening turns to night */
  .s6-dusk { position: absolute; inset: 0; z-index: 30; pointer-events: none; }
  .s6-dusk.a { background: linear-gradient(135deg, #fff8f0, #ffe9ef 45%, #f3e7ff); animation: s6DuskA 2.4s ease forwards; }
  .s6-dusk.b { background: linear-gradient(#ffb48a, #c45a9a 50%, #3a2a6a); opacity: 0; animation: s6DuskB 4.2s ease forwards; }
  @keyframes s6DuskA { 0% { opacity: 1; } 55% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes s6DuskB { 0% { opacity: 0; } 30% { opacity: .9; } 100% { opacity: 0; } }

  /* words */
  .s6-top { position: absolute; left: 0; right: 0; top: 7vh; z-index: 5; padding: 0 20px; text-align: center; pointer-events: none; }
  .s6-small { margin: 0; color: #ffd76a; font-family: "Dancing Script", "Dancing Local", cursive; font-size: clamp(22px, 3.6vh, 30px); font-weight: 700;
    animation: s6Rise 1s ease 2.4s backwards; }
  .s6-title { margin: 4px 0 6px; color: #fff6e6; font-family: "Playfair Display", "Playfair Local", Georgia, serif; font-style: italic; font-weight: 700;
    font-size: clamp(38px, min(9vw, 9vh), 78px); line-height: 1.1; text-shadow: 0 0 30px rgba(255, 215, 120, .45);
    animation: s6Rise 1.2s ease 2.8s backwards; }
  .s6-line { margin: 0 auto; max-width: min(88vw, 520px); color: #cfd0f5; font-size: clamp(14px, 2.4vh, 18px); line-height: 1.5; min-height: 3em;
    animation: s6Rise 1s ease 3.4s backwards; }
  .s6-small, .s6-title, .s6-line { transition: opacity .6s ease, transform .6s ease; }
  .s6-fade { opacity: 0; transform: translateY(8px); }
  @keyframes s6Rise { from { opacity: 0; transform: translateY(18px); } }

  .s6-ready, .s6-done, .s6-next { position: absolute; left: 50%; z-index: 8; translate: -50% 0; border: 0; border-radius: 999px; cursor: pointer;
    font: 800 clamp(15px, 2.4vh, 18px) / 1 "Nunito", "Nunito Local", sans-serif; letter-spacing: .4px; -webkit-tap-highlight-color: transparent; }
  .s6-ready { top: 38vh; padding: 16px 34px; background: linear-gradient(180deg, #ffe08f, #f6b94a); color: #3a2a55;
    box-shadow: 0 6px 0 #c78a2c, 0 0 30px rgba(255, 205, 110, .5); animation: s6Rise 1s ease 4s backwards, s6Pulse 2.4s ease-in-out 5s infinite; }
  @keyframes s6Pulse { 50% { box-shadow: 0 6px 0 #c78a2c, 0 0 50px rgba(255, 205, 110, .9); } }
  .s6-ready.gone { opacity: 0; pointer-events: none; transition: opacity .4s; }
  .s6-done { top: 62vh; padding: 12px 26px; background: rgba(255, 255, 255, .12); color: #ffe9b0; border: 1.5px solid rgba(255, 233, 176, .5); font-size: 15px;
    animation: s6Rise .8s ease backwards; }
  .s6-next { bottom: calc(22px + env(safe-area-inset-bottom, 0px)); padding: 15px 36px; background: linear-gradient(110deg, #f6a2ae, #df5279 55%, #b63d68); color: #fff9f3;
    box-shadow: 0 6px 0 #792c4c, 0 0 28px rgba(246, 120, 160, .45); animation: s6Rise .9s ease backwards; z-index: 9; }

  /* the wishing star + its timer ring */
  .s6-wish { position: absolute; left: 50%; top: 42vh; z-index: 6; width: 150px; height: 150px; translate: -50% -50%; opacity: 0; scale: .3; pointer-events: none;
    transition: opacity .8s ease, scale .9s cubic-bezier(.3, 1.5, .5, 1); }
  .s6-wish.on { opacity: 1; scale: 1; }
  .s6-wish > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .s6-ring { stroke-dasharray: 390; stroke-dashoffset: 390; transform: rotate(-90deg); transform-origin: 50% 50%; }
  .s6-wish.timing .s6-ring { animation: s6Ring var(--sec) linear forwards; }
  @keyframes s6Ring { to { stroke-dashoffset: 0; } }
  .s6-glow { position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; translate: -50% -50%; border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 233, 150, .7), rgba(255, 200, 90, .25) 45%, transparent 70%); animation: s6Breath 3.2s ease-in-out infinite; }
  @keyframes s6Breath { 50% { scale: 1.25; opacity: .75; } }
  .s6-star-art { position: absolute; left: 50%; top: 50%; width: 56px; aspect-ratio: 1; translate: -50% -50%; animation: s6Spin 6s linear infinite; filter: drop-shadow(0 0 12px #ffe08a); }
  .s6-star-art svg { display: block; width: 100%; height: 100%; }
  @keyframes s6Spin { to { rotate: 360deg; } }
  .s6-wish.break { animation: s6Break .9s ease forwards; }
  @keyframes s6Break { 40% { scale: 1.5; opacity: 1; } 100% { scale: 2.4; opacity: 0; } }

  /* the shooting star */
  .s6-shoot { position: absolute; left: var(--sx); top: var(--sy); z-index: 7; width: 0; height: 0; pointer-events: none; opacity: 0; }
  .s6-shoot.go { animation: s6Shoot 3s cubic-bezier(.25, .6, .35, 1) forwards; }
  @keyframes s6Shoot { 0% { opacity: 0; translate: 0 0; } 8% { opacity: 1; } 100% { opacity: 1; translate: var(--tx) var(--ty); } }
  .s6-shoot .rot { position: absolute; left: 0; top: 0; rotate: var(--ang); }
  .s6-shoot .tail { position: absolute; right: 0; top: -2px; width: clamp(140px, 24vw, 260px); height: 4px; border-radius: 4px;
    background: linear-gradient(90deg, transparent, rgba(255, 233, 160, .9)); filter: blur(.5px); }
  .s6-shoot .head { position: absolute; left: -14px; top: -14px; width: 28px; height: 28px; filter: drop-shadow(0 0 10px #ffe08a); }
  .s6-glit { position: absolute; z-index: 7; left: var(--x); top: var(--y); width: var(--w); height: var(--w); border-radius: 50%; background: #ffe9a8;
    box-shadow: 0 0 8px #ffe9a8; pointer-events: none; animation: s6Glit var(--d) ease-out forwards; }
  @keyframes s6Glit { to { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(.2); } }

  /* the hill: her friends and her */
  .s6-group { position: absolute; left: 0; right: 0; bottom: 4vh; z-index: 5; display: flex; justify-content: center; align-items: flex-end;
    pointer-events: none; animation: s6Rise 1.4s ease 2s backwards; }
  .s6-pal { position: relative; width: clamp(64px, 12vw, 120px); margin: 0 -6px; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .4)); animation: s6Bob 3.4s ease-in-out var(--dl, 0s) infinite alternate; }
  .s6-pal svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s6-pal.lean-l { rotate: 7deg; } .s6-pal.lean-r { rotate: -7deg; }
  .s6-pal.far { width: clamp(56px, 10.5vw, 104px); opacity: .95; }
  @keyframes s6Bob { to { translate: 0 -5px; } }
  .s6-pal .m-eye, .s6-pal .m-shine { transition: transform .5s ease, opacity .5s ease; transform-box: fill-box; transform-origin: center; }
  .s6-group.closed .m-eye { transform: scaleY(.12); }
  .s6-group.closed .m-shine { opacity: 0; }

  .s6-girl { position: relative; width: clamp(66px, 12.5vw, 124px); margin: 0 4px; z-index: 2; animation: s6Bob 4s ease-in-out infinite alternate; }
  .s6-girl::before { content: ""; position: absolute; left: 50%; top: 45%; width: 190%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 220, 150, .28), transparent 62%); pointer-events: none; }
  .s6-girl svg { position: relative; display: block; width: 100%; height: auto; overflow: visible; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .4)); }
  .s6-you { position: absolute; left: 50%; top: -34px; translate: -50% 0; padding: 4px 12px; border-radius: 999px; background: rgba(255, 233, 176, .95);
    color: #7a3a58; font: 700 21px/1.1 "Dancing Script", "Dancing Local", cursive; white-space: nowrap; opacity: 0; scale: .3;
    transition: opacity .6s ease, scale .7s cubic-bezier(.3, 1.7, .5, 1); }
  .s6.after .s6-you { opacity: 1; scale: 1; }

  /* the celebration: joyful faces, jumping, speech bubbles, falling hearts */
  .s6-group.cheer .s6-pal { animation: s6Jump .6s ease-in-out var(--jd, 0s) 4, s6Bob 3.4s ease-in-out calc(var(--jd, 0s) + 2.6s) infinite alternate; }
  @keyframes s6Jump { 0%, 100% { translate: 0 0; } 40% { translate: 0 -30px; } }
  .s6.after .s6-girl { animation: s6Hop .7s ease-in-out .5s 3, s6Bob 4s ease-in-out 2.8s infinite alternate; }
  @keyframes s6Hop { 0%, 100% { translate: 0 0; } 40% { translate: 0 -24px; } }

  .s6-say { position: absolute; left: 50%; top: var(--sy, -12px); z-index: 3; translate: -50% 0; padding: 5px 12px; border-radius: 14px;
    background: #fff; color: #7a3a58; font: 700 clamp(16px, 2.2vh, 20px) / 1.1 "Dancing Script", "Dancing Local", cursive; white-space: nowrap;
    box-shadow: 0 6px 14px rgba(0, 0, 0, .3); scale: 0; transform-origin: 50% 100%; animation: s6Say 4.6s ease forwards; }
  .s6-say::after { content: ""; position: absolute; left: 50%; bottom: -6px; margin-left: -6px; border: 6px solid transparent; border-bottom: 0; border-top-color: #fff; }
  @keyframes s6Say { 0% { scale: 0; } 10% { scale: 1.15; } 16% { scale: 1; } 85% { scale: 1; opacity: 1; } 100% { scale: .6; opacity: 0; } }

  .s6-rain { position: absolute; top: -30px; left: var(--x); z-index: 4; color: var(--c); font-size: var(--s); pointer-events: none;
    text-shadow: 0 0 10px currentColor; animation: s6Rain var(--d) linear var(--dl) forwards; }
  @keyframes s6Rain { 0% { opacity: 0; transform: translate(0, 0) rotate(0); } 10% { opacity: 1; }
    90% { opacity: .9; } 100% { opacity: 0; transform: translate(var(--dx), 108vh) rotate(var(--r)); } }
  .s6-pop { position: absolute; z-index: 6; left: var(--x); top: var(--y); color: var(--c); font-size: var(--s); pointer-events: none;
    text-shadow: 0 0 8px currentColor; animation: s6Pop 1.6s ease-out forwards; }
  @keyframes s6Pop { 0% { opacity: 1; transform: translate(-50%, 0) scale(.5); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), -90px) scale(1.2); } }

  @media (max-width: 680px) {
    .s6-moon { right: 6%; top: 5%; width: 52px; }
    .s6-pal { margin: 0 -9px; }
    .s6-group { padding-left: 46px; }
    .s6-ready { top: 40vh; }
  }
  @media (max-height: 520px) {
    .s6-top { top: 3vh; } .s6-title { font-size: 34px; } .s6-line { min-height: 0; }
    .s6-ready { top: 44vh; } .s6-wish { top: 46vh; width: 110px; height: 110px; } .s6-done { top: 66vh; }
    .s6-pal, .s6-girl { width: 58px; } .s6-moon { display: none; }
  }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- build the screen ---------------- */

  const starPath = "M50 4l13 30 33 3-25 22 8 32-29-17-29 17 8-32L4 37l33-3z";
  const starSvg = (id) =>
    `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#ffc94d"/></linearGradient></defs><path d="${starPath}" fill="url(#${id})" stroke="#ffe9a8" stroke-width="3" stroke-linejoin="round"/></svg>`;

  // the girl, seen from behind, looking up at the sky
  const girlSvg = `<svg viewBox="0 0 100 175" aria-hidden="true">
    <rect x="38" y="152" width="8" height="14" rx="4" fill="#f0c8b0"/><rect x="54" y="152" width="8" height="14" rx="4" fill="#f0c8b0"/>
    <ellipse cx="42" cy="168" rx="9" ry="4.5" fill="#7a4a6a"/><ellipse cx="58" cy="168" rx="9" ry="4.5" fill="#7a4a6a"/>
    <path d="M33 100h34l11 54H22z" fill="#f7a8c8"/><path d="M33 100h34l3 12H30z" fill="#ff8fb3"/>
    <path d="M34 106L21 142" stroke="#f0c8b0" stroke-width="9" stroke-linecap="round"/><path d="M66 106l13 36" stroke="#f0c8b0" stroke-width="9" stroke-linecap="round"/>
    <path d="M24 42C24 16 40 8 50 8s26 8 26 34c0 22 9 40 4 64-8 8-26 10-30 10s-22-2-30-10c-5-24 4-42 4-64z" fill="#3a2438"/>
    <path d="M34 22q12-10 26-2" stroke="#6a4666" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".75"/>
    <path d="M42 60q-4 24-2 40M58 60q4 24 2 40" stroke="#4d3050" stroke-width="2" fill="none" opacity=".6"/>
    <g fill="#ff8fb3"><path d="M68 22l12-8v16z"/><path d="M68 22l-10-8v16z"/></g><circle cx="68" cy="22" r="4" fill="#ff5c8d"/>
  </svg>`;

  screen.innerHTML = `
    <div class="s6-sky" id="s6Sky" aria-hidden="true"></div>
    <div class="s6-moon" aria-hidden="true"></div>
    <div class="s6-flies" id="s6Flies" aria-hidden="true"></div>
    <svg class="s6-hills" viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 110C150 50 300 140 500 90S850 50 1000 100V240H0z" fill="#1d1650"/>
      <path d="M0 165C200 115 350 195 550 145S850 125 1000 165V240H0z" fill="#120d36"/>
    </svg>

    <div class="s6-top">
      <p class="s6-small" id="s6Small">the sky is listening \u2726</p>
      <h2 class="s6-title" id="s6Title">Make a wish</h2>
      <p class="s6-line" id="s6Line">Take a moment, just for you. When you are ready, tap the star.</p>
    </div>

    <button type="button" class="s6-ready" id="s6Ready">\u2726 I am ready</button>

    <div class="s6-wish" id="s6Wish" style="--sec:${SECONDS}s" aria-hidden="true">
      <div class="s6-glow"></div>
      <svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="62" fill="none" stroke="rgba(255,233,176,.18)" stroke-width="4"/>
        <circle class="s6-ring" cx="75" cy="75" r="62" fill="none" stroke="#ffe08a" stroke-width="4" stroke-linecap="round"/></svg>
      <div class="s6-star-art">${starSvg("s6g1")}</div>
    </div>

    <div class="s6-shoot" id="s6Shoot" aria-hidden="true"><div class="rot"><div class="tail"></div><div class="head">${starSvg("s6g2")}</div></div></div>

    <div class="s6-group" id="s6Group" aria-hidden="true"></div>

    <button type="button" class="s6-done" id="s6Done" hidden>I have made my wish \u2661</button>
    <button type="button" class="s6-next" id="s6Next" hidden>Keep going \u203A</button>

    <div class="s6-dusk a" aria-hidden="true"></div>
    <div class="s6-dusk b" aria-hidden="true"></div>`;

  const $ = (id) => document.getElementById(id);
  const sky = $("s6Sky"), flies = $("s6Flies"), group = $("s6Group");
  const small = $("s6Small"), title = $("s6Title"), line = $("s6Line");
  const ready = $("s6Ready"), wishStar = $("s6Wish"), shoot = $("s6Shoot");
  const done = $("s6Done"), next = $("s6Next");

  /* stars + fireflies */
  const starCount = window.innerWidth < 600 ? 70 : 120;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("span");
    star.className = "s6-star";
    star.style.setProperty("--x", `${rand(0, 100).toFixed(1)}%`);
    star.style.setProperty("--y", `${rand(0, 70).toFixed(1)}%`);
    star.style.setProperty("--z", `${rand(1, 3).toFixed(1)}px`);
    star.style.setProperty("--d", `${rand(2, 6).toFixed(1)}s`);
    star.style.setProperty("--dl", `${(-rand(0, 6)).toFixed(1)}s`);
    sky.appendChild(star);
  }

  for (let i = 0; i < (window.innerWidth < 600 ? 9 : 16); i++) {
    const fly = document.createElement("span");
    fly.className = "s6-fly";
    fly.style.setProperty("--x", `${rand(4, 96).toFixed(1)}%`);
    fly.style.setProperty("--y", `${rand(52, 90).toFixed(1)}%`);
    fly.style.setProperty("--dx", `${rand(-50, 50).toFixed(0)}px`);
    fly.style.setProperty("--dy", `${rand(-60, 30).toFixed(0)}px`);
    fly.style.setProperty("--d", `${rand(4, 9).toFixed(1)}s`);
    fly.style.setProperty("--dl", `${(-rand(0, 8)).toFixed(1)}s`);
    flies.appendChild(fly);
  }

  /* her friends on the hill, with her in the middle, all looking up */
  const mates = window.Mates;
  const lineup = [
    ["panda", "far", ""], ["bunny", "", "lean-l"], ["bear", "", "lean-l"],
    ["GIRL"],
    ["cat", "", "lean-r"], ["puppy", "", "lean-r"], ["bunny", "far", ""]
  ];

  lineup.forEach((item, index) => {
    const el = document.createElement("div");
    if (item[0] === "GIRL") {
      el.className = "s6-girl";
      el.innerHTML = `${girlSvg}<span class="s6-you">you \u2661</span>`;
    } else {
      el.className = `s6-pal ${item[1]} ${item[2]}`;
      el.style.setProperty("--dl", `${(-index * 0.6).toFixed(1)}s`);
      if (mates) el.innerHTML = mates.svg(item[0], false, true);
    }
    group.appendChild(el);
  });

  /* ---------------- words ---------------- */

  function say(text, titleText) {
    const parts = [line].concat(titleText ? [title] : []);
    parts.forEach((p) => p.classList.add("s6-fade"));
    window.setTimeout(() => {
      line.textContent = text;
      if (titleText) title.textContent = titleText;
      parts.forEach((p) => p.classList.remove("s6-fade"));
    }, 600);
  }

  /* ---------------- the wishing moment ---------------- */

  let started = false;
  let finished = false;
  const timers = [];
  const later = (fn, ms) => { const t = window.setTimeout(fn, ms); timers.push(t); return t; };

  function glitter(x, y, count, spread) {
    const box = screen.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("span");
      bit.className = "s6-glit";
      bit.style.setProperty("--x", `${x - box.left}px`);
      bit.style.setProperty("--y", `${y - box.top}px`);
      bit.style.setProperty("--w", `${rand(3, 7).toFixed(1)}px`);
      bit.style.setProperty("--dx", `${rand(-spread, spread).toFixed(0)}px`);
      bit.style.setProperty("--dy", `${rand(10, spread * 1.6).toFixed(0)}px`);
      bit.style.setProperty("--d", `${rand(.9, 1.8).toFixed(2)}s`);
      screen.appendChild(bit);
      window.setTimeout(() => bit.remove(), 2000);
    }
  }

  function begin() {
    if (started) return;
    started = true;
    ready.classList.add("gone");
    small.textContent = "look up \u2726";
    say("A shooting star\u2026 it is coming for you.");

    // the shooting star flies in from the corner and settles above everyone
    const box = screen.getBoundingClientRect();
    const target = wishStar.getBoundingClientRect();
    const sx = box.width * 0.04, sy = box.height * 0.06;
    const tx = target.left - box.left + target.width / 2 - sx;
    const ty = target.top - box.top + target.height / 2 - sy;

    shoot.style.setProperty("--sx", `${sx}px`);
    shoot.style.setProperty("--sy", `${sy}px`);
    shoot.style.setProperty("--tx", `${tx}px`);
    shoot.style.setProperty("--ty", `${ty}px`);
    shoot.style.setProperty("--ang", `${(Math.atan2(ty, tx) * 180 / Math.PI).toFixed(1)}deg`);
    shoot.classList.add("go");

    // glittering trail while it flies
    const trail = window.setInterval(() => {
      const head = shoot.querySelector(".head").getBoundingClientRect();
      glitter(head.left + head.width / 2, head.top + head.height / 2, 2, 40);
    }, 70);

    // it arrives: the star hovers, the ring starts, her friends close their eyes
    later(() => {
      window.clearInterval(trail);
      shoot.style.display = "none";
      wishStar.classList.add("on");
      group.classList.add("closed");
      small.textContent = "make your wish \u2726";
      say("Close your eyes, and take one slow breath\u2026");
      later(() => wishStar.classList.add("timing"), 900);
    }, 3100);

    const third = (SECONDS * 1000) / 3;
    later(() => say("Think of the one thing you want the most\u2026"), 3100 + 900 + third);
    later(() => say("Hold it close in your heart. The stars are listening \u2661"), 3100 + 900 + third * 2);
    later(() => { done.hidden = false; }, 3100 + 900 + 3500);
    later(finish, 3100 + 900 + SECONDS * 1000 + 300);
  }

  /* the friends celebrate her wish */
  function celebrate() {
    const pals = [...group.querySelectorAll(".s6-pal")];

    // joyful faces + waving arms
    const kinds = ["panda", "bunny", "bear", "cat", "puppy", "bunny"];
    pals.forEach((pal, i) => {
      if (mates) pal.innerHTML = mates.svg(kinds[i], i % 2 === 0, "happy");
      pal.style.setProperty("--jd", `${(i * 0.12).toFixed(2)}s`);
    });
    group.classList.add("cheer");

    // three friends say something
    [0, 2, 4].forEach((index, n) => {
      const pal = pals[index];
      if (!pal) return;
      const say = document.createElement("span");
      say.className = "s6-say";
      say.textContent = CHEERS[n % CHEERS.length];
      say.style.setProperty("--sy", n % 2 ? "-40px" : "-12px");
      say.style.animationDelay = `${(0.3 + n * 0.35).toFixed(2)}s`;
      pal.appendChild(say);
    });

    // little hearts pop up over everyone
    const box = screen.getBoundingClientRect();
    const colors = ["#ff8fb3", "#ffd76a", "#e8c7ff", "#ff7aa2"];
    const glyphs = ["\u2661", "\u2665", "\u2726"];
    [...pals, group.querySelector(".s6-girl")].forEach((who, i) => {
      if (!who) return;
      const r = who.getBoundingClientRect();
      for (let k = 0; k < 3; k++) {
        const heart = document.createElement("span");
        heart.className = "s6-pop";
        heart.textContent = pick(glyphs);
        heart.style.setProperty("--x", `${r.left - box.left + r.width * rand(0.2, 0.8)}px`);
        heart.style.setProperty("--y", `${r.top - box.top}px`);
        heart.style.setProperty("--s", `${rand(16, 26).toFixed(0)}px`);
        heart.style.setProperty("--c", pick(colors));
        heart.style.setProperty("--dx", `${rand(-24, 24).toFixed(0)}px`);
        heart.style.animationDelay = `${(i * 0.1 + k * 0.45).toFixed(2)}s`;
        screen.appendChild(heart);
        window.setTimeout(() => heart.remove(), 3600);
      }
    });

    // a soft rain of hearts and stars over the whole sky
    for (let i = 0; i < (window.innerWidth < 600 ? 22 : 36); i++) {
      const drop = document.createElement("span");
      drop.className = "s6-rain";
      drop.textContent = pick(glyphs);
      drop.style.setProperty("--x", `${rand(2, 97).toFixed(1)}%`);
      drop.style.setProperty("--s", `${rand(14, 28).toFixed(0)}px`);
      drop.style.setProperty("--c", pick(colors));
      drop.style.setProperty("--d", `${rand(4, 7).toFixed(1)}s`);
      drop.style.setProperty("--dl", `${rand(0, 2.5).toFixed(1)}s`);
      drop.style.setProperty("--dx", `${rand(-60, 60).toFixed(0)}px`);
      drop.style.setProperty("--r", `${rand(-200, 200).toFixed(0)}deg`);
      screen.appendChild(drop);
      window.setTimeout(() => drop.remove(), 10000);
    }
  }

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach((t) => window.clearTimeout(t));
    done.hidden = true;

    // the star breaks into golden dust that falls softly over her and her friends
    const star = wishStar.getBoundingClientRect();
    wishStar.classList.add("break");
    glitter(star.left + star.width / 2, star.top + star.height / 2, 70, 260);
    later(() => glitter(star.left + star.width / 2, star.top + star.height / 2, 50, 200), 500);

    later(() => {
      group.classList.remove("closed");           // friends open their eyes
      screen.classList.add("after", "blessed");
      small.textContent = "\u2726 \u2661 \u2726";
      say(AFTER_TEXT, AFTER_TITLE);
      celebrate();
    }, 1100);
    later(() => { next.hidden = false; }, 3600);
  }

  ready.addEventListener("click", begin);
  done.addEventListener("click", finish);
  next.addEventListener("click", () => {
    next.disabled = true;
    // the curtains close, then part to reveal the party room
    if (window.Curtain) window.Curtain.play("screen7", "The party begins<br>\u2661");
    else window.Screens.go("screen7");
  });
})();

