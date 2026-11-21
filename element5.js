/* ==========================================
   ELEMENT 5 — THE LETTER
   An envelope loops in, she cracks the heart seal, the letter
   unfolds and writes itself, friends peek, stickers pop, confetti.
   (Everything is built here: this one file is enough.)
   Her words live in screens.js → CONFIG.letter
========================================== */

(() => {
  const screen = document.getElementById("screen5");
  if (!screen) { console.error("Element 5: #screen5 is missing in index.html"); return; }

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const cfg = window.CONFIG || {};
  const name = cfg.name || "you";

  // her letter (edit it in screens.js). **word** = highlighted with a marker pen
  const letter = cfg.letter || {
    paragraphs: [
      "Today is **your day**, and I wanted to tell you something I never say out loud.",
      "You are **brave**. You are **kind**. You are **stronger** than you think, and you are **loved** more than you know.",
      "Thank you for every laugh and every **tiny moment** that made our classroom brighter. Never stop shining \u2661"
    ],
    sign: "\u2014 with love"
  };

  /* ---------------- styles ---------------- */

  const css = `
  .s5 { display: grid; place-items: center; overflow: hidden; color: var(--l-plum);
    font-family: "Nunito", "Nunito Local", sans-serif;
    background: linear-gradient(135deg, #fff8f0 0%, #ffe9ef 45%, #f3e7ff 100%); }
  .s5 .fx-layer { position: absolute; }
  .s5 .float-particle { text-shadow: none; }

  /* paper planes crossing the sky */
  .s5-planes { position: absolute; inset: 0; z-index: 1; overflow: hidden; pointer-events: none; }
  .s5-plane { position: absolute; left: -90px; top: var(--y); width: 46px; opacity: .9;
    animation: s5Plane var(--d) linear var(--dl) infinite; }
  .s5-plane svg { display: block; width: 100%; height: auto; }
  @keyframes s5Plane {
    0% { transform: translate(0, 0) rotate(8deg); } 25% { transform: translate(28vw, -9vh) rotate(-14deg); }
    50% { transform: translate(58vw, 6vh) rotate(10deg); } 75% { transform: translate(88vw, -10vh) rotate(-9deg); }
    100% { transform: translate(125vw, 3vh) rotate(6deg); } }

  .s5-stage { position: relative; z-index: 2; width: 100%; height: 100%; display: grid; place-items: center; padding: 16px; }

  /* ---------- the envelope ---------- */
  .s5-env { position: relative; width: min(86vw, 420px); aspect-ratio: 3 / 2; perspective: 900px;
    transition: transform .9s cubic-bezier(.5, 0, .3, 1), opacity .7s ease;
    opacity: 0; }
  .s5-env.drop { opacity: 1; animation: s5EnvDrop 1.5s cubic-bezier(.3, .6, .4, 1) backwards, s5Bob 3s ease-in-out 1.6s infinite alternate; }
  .s5.dropped .s5-stage { z-index: 4; }
  .s5-env.drop.skip { animation: s5Bob 3s ease-in-out infinite alternate; }
  @keyframes s5EnvDrop {
    0%   { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(-12deg) scale(.22); }
    12%  { opacity: 1; }
    55%  { transform: translate(0, 8px) rotate(8deg) scale(1.06); }
    70%  { transform: translate(0, -22px) rotate(-4deg) scale(1); }
    85%  { transform: translate(0, 3px) rotate(1deg); }
    100% { transform: none; } }
  @keyframes s5Bob { to { translate: 0 -9px; } }

  .s5-env > * { position: absolute; }
  .env-back { inset: 0; border-radius: 10px; background: linear-gradient(#f9bdd2, #f6a5c1); box-shadow: 0 18px 40px rgba(150, 60, 110, .3); }
  .env-paper { left: 6%; right: 6%; top: 6%; bottom: 8%; z-index: 2; border-radius: 6px;
    background: repeating-linear-gradient(transparent 0 15px, rgba(224, 88, 127, .16) 15px 16px), #fffdf5;
    transition: transform 1s cubic-bezier(.5, .1, .3, 1.2); }
  .s5-env.rising .env-paper { transform: translateY(-64%); }
  .env-front { inset: 0; z-index: 3; pointer-events: none; }
  .env-front i { position: absolute; inset: 0; display: block; }
  .env-front .l { clip-path: polygon(0 0, 52% 52%, 0 100%); background: #fbd0df; }
  .env-front .r { clip-path: polygon(100% 0, 48% 52%, 100% 100%); background: #f9c3d6; }
  .env-front .b { clip-path: polygon(0 100%, 50% 46%, 100% 100%); background: #ffdbe7; }
  .env-flap { left: 0; right: 0; top: 0; height: 56%; z-index: 4; transform-origin: 50% 0;
    clip-path: polygon(0 0, 100% 0, 50% 100%); background: linear-gradient(#ff9ec0, #f783ac);
    transition: transform .8s cubic-bezier(.5, 0, .3, 1), z-index 0s .35s; }
  .s5-env.open .env-flap { transform: rotateX(180deg); z-index: 1; }

  .env-seal { z-index: 6; left: 50%; top: 52%; width: 20%; aspect-ratio: 1; translate: -50% -50%; border: 0; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ff7a9a, #d4264f 70%); color: #ffe08a; font-size: clamp(22px, 5vw, 34px);
    box-shadow: 0 5px 0 #8e1735, 0 8px 16px rgba(0, 0, 0, .3); cursor: pointer;
    animation: s5Seal 1.2s ease-in-out infinite alternate; -webkit-tap-highlight-color: transparent; }
  @keyframes s5Seal { to { scale: 1.12; box-shadow: 0 5px 0 #8e1735, 0 0 28px 8px rgba(255, 120, 160, .85); } }
  .env-seal.crack { animation: s5Crack .45s ease-in forwards; }
  @keyframes s5Crack { 40% { scale: 1.5; rotate: 12deg; } 100% { scale: 2.4; rotate: -20deg; opacity: 0; } }

  .env-label { z-index: 5; left: 0; right: 0; bottom: 9%; text-align: center; pointer-events: none; transform: rotate(-2deg);
    font-family: "Dancing Script", "Dancing Local", cursive; font-size: clamp(22px, 5.4vw, 32px); font-weight: 700; color: #8e3b62; }
  .env-label small { display: block; font: 800 10px "Nunito", sans-serif; letter-spacing: 2.5px; color: #b87a98; }
  .env-stamp { z-index: 5; right: 6%; top: 9%; width: 14%; aspect-ratio: 3 / 4; display: grid; place-items: center;
    background: #fff; border: 3px dotted #f0a8c4; border-radius: 3px; transform: rotate(6deg); font-size: clamp(16px, 4vw, 26px); }
  .s5-hint { position: absolute; left: 0; right: 0; bottom: -62px; text-align: center; color: var(--l-rose);
    font-family: "Dancing Script", "Dancing Local", cursive; font-size: 26px; font-weight: 700;
    opacity: 0; }
  @keyframes s5Blink { to { opacity: .4; } }
  @keyframes s5Rise { from { opacity: 0; transform: translateY(14px); } }
  .s5.landed .s5-hint { opacity: 1; animation: s5Rise .8s ease backwards, s5Blink 1.4s ease-in-out .9s infinite alternate; }
  .s5:not(.landed) .env-seal { pointer-events: none; }
  .s5.reading .s5-env { transform: translateY(60vh) rotate(6deg) scale(.8); opacity: 0; pointer-events: none; }
  .s5.opening .s5-hint { opacity: 0; transition: opacity .3s; animation: none; }

  /* ---------- the letter ---------- */
  .s5-sheet { position: absolute; left: 50%; top: 50%; z-index: 6; width: min(92vw, 540px); translate: -50% -50%; visibility: hidden; opacity: 0; }
  .s5.reading .s5-sheet { visibility: visible; opacity: 1; animation: s5Unfold 1.4s cubic-bezier(.3, 1.2, .4, 1) backwards; }
  @keyframes s5Unfold {
    0% { opacity: 0; transform: perspective(1000px) rotateX(-88deg) scale(.55) translateY(30%); }
    55% { opacity: 1; transform: perspective(1000px) rotateX(14deg) scale(1.02); }
    100% { transform: perspective(1000px) rotateX(0); } }
  .s5-sheet::before, .s5-sheet::after { content: ""; position: absolute; top: -12px; z-index: 7; width: 90px; height: 28px; pointer-events: none;
    background: repeating-linear-gradient(45deg, rgba(255, 205, 230, .92) 0 8px, rgba(255, 255, 255, .85) 8px 16px); box-shadow: 0 2px 6px rgba(0, 0, 0, .2); }
  .s5-sheet::before { left: -22px; transform: rotate(-35deg); }
  .s5-sheet::after { right: -22px; transform: rotate(35deg); }

  .s5-paper { position: relative; max-height: 72vh; overflow-y: auto; rotate: -1deg; border-radius: 4px; cursor: pointer;
    padding: 40px 26px 26px 60px;
    background:
      linear-gradient(90deg, transparent 46px, rgba(255, 110, 140, .5) 46px 48px, transparent 48px),
      repeating-linear-gradient(transparent 0 31px, rgba(224, 88, 127, .2) 31px 32px), #fffdf5;
    background-attachment: local, local, local;
    box-shadow: 0 24px 60px rgba(120, 40, 90, .35); scrollbar-width: thin; }
  .s5-dear { margin: 0; color: var(--l-rose); font-family: "Dancing Script", "Dancing Local", cursive; font-size: 38px; font-weight: 700; line-height: 32px; padding-bottom: 32px; }
  .s5-text { font-family: "Dancing Script", "Dancing Local", cursive; font-size: clamp(22px, 4.6vw, 27px); font-weight: 600; line-height: 32px; color: var(--l-plum); }
  .s5-text p { margin: 0 0 32px; }
  .s5-text .w { display: inline-block; white-space: nowrap; }
  .s5-text .ch { opacity: 0; }
  .s5-text .ch.on { opacity: 1; }
  .s5-text .ch.cur { position: relative; }
  .s5-text .ch.cur::after { content: "\u270E"; position: absolute; left: 100%; top: -8px; color: #e0587f; font-size: 20px; }
  .s5-text .hl .ch.on { background: linear-gradient(transparent 52%, rgba(255, 222, 100, .8) 52%); }
  .s5-sign { margin: 0; text-align: right; color: var(--l-rose); font-family: "Dancing Script", "Dancing Local", cursive;
    font-size: 34px; font-weight: 700; line-height: 32px; clip-path: inset(0 100% 0 0); }
  .s5-sign.on { animation: s5Sign 1.5s ease forwards; }
  @keyframes s5Sign { to { clip-path: inset(0 0 0 0); } }

  /* friends peek over the letter, stickers pop around it */
  .s5-peek { position: absolute; top: -72px; z-index: 5; width: 86px; pointer-events: none; opacity: 0; }
  .s5-peek svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s5-peek.a { left: 7%; } .s5-peek.b { right: 7%; }
  .s5.reading .s5-peek { opacity: 1; animation: s5Peek .8s cubic-bezier(.3, 1.6, .5, 1) 1.3s backwards; }
  .s5.reading .s5-peek.b { animation-delay: 1.6s; }
  @keyframes s5Peek { from { transform: translateY(70px); opacity: 0; } }
  .s5.done .s5-peek { animation: s5Cheer .5s ease-in-out 3; }
  @keyframes s5Cheer { 50% { transform: translateY(-22px) rotate(-6deg); } }

  .s5-pop { position: absolute; left: var(--x); top: var(--y); z-index: 8; width: var(--w); translate: -50% -50%; pointer-events: none;
    animation: s5Pop .7s cubic-bezier(.3, 1.7, .5, 1) var(--dl) backwards, s5Float 3s ease-in-out calc(var(--dl) + .7s) infinite alternate; }
  .s5-pop svg { display: block; width: 100%; height: auto; filter: drop-shadow(0 5px 8px rgba(120, 60, 100, .3)); }
  @keyframes s5Pop { from { scale: 0; rotate: -40deg; } }
  @keyframes s5Float { to { translate: -50% calc(-50% - 10px); } }

  .s5-next { position: absolute; left: 50%; bottom: calc(20px + env(safe-area-inset-bottom, 0px)); z-index: 9; translate: -50% 0;
    padding: 15px 36px; border: 0; border-radius: 999px; background: linear-gradient(110deg, #f6a2ae, #df5279 55%, #b63d68); color: #fff9f3;
    font: 800 17px/1 "Nunito", "Nunito Local", sans-serif; letter-spacing: .4px; cursor: pointer;
    box-shadow: 0 6px 0 #792c4c, 0 0 28px rgba(246, 120, 160, .45); animation: s5Rise .8s ease backwards; }
  .s5-next:active { box-shadow: 0 2px 0 #792c4c; }

  .s5-conf { position: fixed; left: var(--x); top: var(--y); z-index: 60; width: var(--w); height: calc(var(--w) * 1.5); background: var(--c);
    border-radius: 2px; pointer-events: none; animation: s5Conf var(--d) cubic-bezier(.2, .7, .4, 1) forwards; }
  .s5-conf.glyph { width: auto; height: auto; background: none; color: var(--c); font-size: var(--w); line-height: 1; }
  @keyframes s5Conf { 0% { opacity: 1; transform: translate(0, 0) rotate(0); }
    35% { opacity: 1; transform: translate(calc(var(--dx) * .8), var(--up)) rotate(calc(var(--r) * .4)); }
    100% { opacity: 0; transform: translate(var(--dx), var(--fall)) rotate(var(--r)); } }


  /* ---------- the delivery: clouds + a postman bear on balloons ---------- */
  .s5-delivery { position: absolute; inset: 0; z-index: 3; overflow: hidden; pointer-events: none; }

  .s5-cloud { position: absolute; opacity: 0; filter: drop-shadow(0 10px 16px rgba(160, 130, 200, .28)); z-index: 2; }
  .s5-cloud svg { display: block; width: 100%; height: auto; }
  .s5-cloud.c1 { width: min(46vw, 300px); top: 2%;  left: 0;  --x0: -70vw; --x1: -4vw; }
  .s5-cloud.c2 { width: min(52vw, 340px); top: -1%; right: 0; --x0: 70vw;  --x1: 4vw; --dl: .25s; }
  .s5-cloud.c3 { width: min(30vw, 180px); top: 21%; left: 5%; --x0: -60vw; --x1: 2vw;  --dl: .5s; }
  .s5-cloud.c4 { width: min(34vw, 200px); top: 18%; right: 2%; --x0: 60vw; --x1: -2vw; --dl: .7s; }
  .s5.deliver .s5-cloud { animation: s5CloudIn 1.7s cubic-bezier(.3, .7, .3, 1) var(--dl, 0s) forwards, s5CloudBob 5s ease-in-out infinite alternate; }
  .s5.leave .s5-cloud { animation: s5CloudOut 2.2s ease-in forwards; }
  @keyframes s5CloudIn  { from { opacity: 0; translate: var(--x0) 0; } to { opacity: 1; translate: var(--x1) 0; } }
  @keyframes s5CloudOut { from { opacity: 1; translate: var(--x1) 0; } to { opacity: 0; translate: var(--x0) 0; } }
  @keyframes s5CloudBob { to { transform: translateY(9px); } }

  .s5-pm { position: absolute; left: 50%; top: 0; z-index: 1; width: clamp(130px, 20vw, 220px); --S: 1.7; --ty: -12vh; transform-origin: 50% 0; translate: -50% -60vh; scale: .22; opacity: 0; }
  .s5.deliver .s5-pm { opacity: 1; animation: s5PmDown 3.3s cubic-bezier(.3, .5, .3, 1) .9s forwards, s5Drift 3.4s ease-in-out .9s infinite alternate; }
  .s5.leave .s5-pm { animation: s5PmUp 2.9s cubic-bezier(.5, 0, .7, .3) forwards, s5Drift 3.4s ease-in-out infinite alternate; }
  @keyframes s5PmDown {
    from { translate: -50% -60vh; scale: .22; }
    60%  { translate: -50% calc(var(--ty) - 3vh); scale: calc(var(--S) * 1.1); }
    80%  { translate: -50% calc(var(--ty) + 1vh); scale: calc(var(--S) * .96); }
    to   { translate: -50% var(--ty); scale: var(--S); } }
  @keyframes s5PmUp {
    from { translate: -50% var(--ty); scale: var(--S); }
    25%  { translate: -50% calc(var(--ty) + 2vh); scale: calc(var(--S) * 1.06); }
    to   { translate: -50% -50vh; scale: .1; opacity: 0; } }
  @keyframes s5Drift { from { left: 46%; } to { left: 54%; } }

  /* swinging off-balance under the balloons */
  .pm-sway { transform-origin: 50% 14%; animation: s5Sway 2.7s ease-in-out infinite; }
  @keyframes s5Sway { 0% { rotate: -8deg; } 28% { rotate: 6deg; } 52% { rotate: -5deg; } 78% { rotate: 8deg; } 100% { rotate: -8deg; } }
  .pm-sway svg { display: block; width: 100%; height: auto; overflow: visible; filter: drop-shadow(0 8px 10px rgba(120, 60, 100, .2)); }
  .pm-leg { transform-box: fill-box; transform-origin: 50% 0; animation: s5Kick .8s ease-in-out infinite alternate; }
  .pm-leg.r { animation-direction: alternate-reverse; }
  @keyframes s5Kick { from { transform: rotate(-16deg); } to { transform: rotate(16deg); } }
  .s5-pm.released .pm-env { display: none; }

  .pm-bubble { position: absolute; z-index: 4; left: calc(50% + 150px); top: 24vh; width: max-content; max-width: min(50vw, 250px); padding: 10px 14px; border: 2px solid #f2b8cf;
    border-radius: 16px; background: #fff; color: var(--l-plum); box-shadow: 0 10px 22px rgba(150, 70, 120, .25);
    font: 700 clamp(18px, 3.6vw, 23px) / 1.1 "Dancing Script", "Dancing Local", cursive; scale: 0; transform-origin: 0 70%;
    transition: scale .5s cubic-bezier(.3, 1.7, .5, 1); }
  .pm-bubble::before { content: ""; position: absolute; left: -11px; top: 58%; border: 7px solid transparent; border-right-color: #f2b8cf; border-left-width: 4px; }
  .s5-delivery.say .pm-bubble { scale: 1; }
  .s5.leave .pm-bubble { scale: 0; }
  .s5-pm.say { z-index: 3; }
  @media (max-width: 680px) {
    .s5-pm { --S: 1.5; --ty: -6vh; }
    .pm-bubble { left: 50%; top: 31vh; translate: -50% 0; transform-origin: 50% 0; max-width: 64vw; text-align: center; }
    .pm-bubble::before { left: 50%; top: -14px; margin-left: -7px; border: 7px solid transparent; border-bottom-color: #f2b8cf; }
  }

  .s5-amb { position: absolute; z-index: 1; width: 120px; opacity: .8; top: var(--y); left: -160px; animation: s5Amb var(--d) linear var(--dl) infinite; pointer-events: none; }
  .s5-amb svg { display: block; width: 100%; height: auto; }
  @keyframes s5Amb { to { translate: calc(100vw + 340px) 0; } }

  @media (max-width: 680px) { .s5-peek { width: 66px; top: -54px; } .s5-paper { padding: 36px 18px 22px 52px; } }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- build the screen ---------------- */


  const cloudSvg = (tint) => '<svg viewBox="0 0 200 100"><g fill="#fff"><circle cx="50" cy="60" r="32"/><circle cx="92" cy="42" r="40"/><circle cx="137" cy="58" r="34"/><circle cx="167" cy="70" r="24"/><rect x="28" y="60" width="152" height="34" rx="17"/></g><rect x="30" y="76" width="150" height="18" rx="9" fill="' + tint + '" opacity=".7"/></svg>';

  const postmanSvg = `<svg viewBox="0 0 200 300" aria-hidden="true">
    <g class="pm-leg l"><rect x="80" y="246" width="15" height="34" rx="7.5" fill="#2f5aa8"/><ellipse cx="86" cy="283" rx="11" ry="6" fill="#7a4a2a"/></g>
    <g class="pm-leg r"><rect x="105" y="246" width="15" height="34" rx="7.5" fill="#2f5aa8"/><ellipse cx="114" cy="283" rx="11" ry="6" fill="#7a4a2a"/></g>
    <ellipse cx="100" cy="34" rx="27" ry="34" fill="#ffd76a"/><path d="M100 68l-4 7h8z" fill="#ffd76a"/>
    <ellipse cx="70" cy="62" rx="32" ry="40" fill="#ff8fb3"/><path d="M50 42q6-13 19-15" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".6"/><path d="M66 102l4 7 4-7z" fill="#ff8fb3"/>
    <ellipse cx="132" cy="58" rx="30" ry="38" fill="#b49af2"/><path d="M114 40q6-12 18-14" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".6"/><path d="M128 96l4 7 4-7z" fill="#b49af2"/>
    <path d="M70 109L100 132M132 103L100 132M100 75L100 132" stroke="#c9a9c4" stroke-width="2" fill="none"/>
    <path d="M86 198C78 172 90 152 100 134" stroke="#e9b47c" stroke-width="14" stroke-linecap="round" fill="none"/><circle cx="100" cy="132" r="8" fill="#f0c08a"/>
    <rect x="72" y="198" width="56" height="54" rx="20" fill="#4a7bd0"/><path d="M88 198l12 12 12-12z" fill="#fff"/>
    <circle cx="100" cy="224" r="3" fill="#ffd76a"/><circle cx="100" cy="237" r="3" fill="#ffd76a"/>
    <path d="M78 203L130 237" stroke="#8a5530" stroke-width="6" stroke-linecap="round"/>
    <rect x="108" y="226" width="34" height="28" rx="6" fill="#b8774a"/><rect x="113" y="219" width="20" height="11" rx="2" fill="#fff" transform="rotate(-8 123 224)"/>
    <circle cx="72" cy="150" r="12" fill="#e2a96f"/><circle cx="128" cy="150" r="12" fill="#e2a96f"/>
    <ellipse cx="100" cy="170" rx="35" ry="31" fill="#f0c08a"/>
    <path d="M64 158Q100 112 136 158Z" fill="#4a7bd0"/><rect x="60" y="154" width="80" height="10" rx="5" fill="#2f5aa8"/><circle cx="100" cy="141" r="6" fill="#ffd76a"/>
    <ellipse cx="100" cy="183" rx="14" ry="10" fill="#fbe3c4"/>
    <circle cx="88" cy="172" r="4.6" fill="#3a2230"/><circle cx="112" cy="172" r="4.6" fill="#3a2230"/><circle cx="89.6" cy="170.4" r="1.6" fill="#fff"/><circle cx="113.6" cy="170.4" r="1.6" fill="#fff"/>
    <ellipse cx="100" cy="178" rx="5" ry="3.6" fill="#7a4a3a"/><path d="M92 186q8 10 16 0z" fill="#7a4a3a"/>
    <circle cx="78" cy="184" r="7" fill="#f59ab3" opacity=".65"/><circle cx="122" cy="184" r="7" fill="#f59ab3" opacity=".65"/>
    <path d="M76 208Q60 224 58 238" stroke="#e9b47c" stroke-width="13" stroke-linecap="round" fill="none"/>
    <g class="pm-env"><rect x="28" y="232" width="44" height="31" rx="3" fill="#fff" stroke="#e7a7c0" stroke-width="2"/><path d="M28 234l22 16 22-16" stroke="#e7a7c0" stroke-width="2" fill="none"/><circle cx="50" cy="254" r="4.5" fill="#d4264f"/></g>
    <circle cx="58" cy="240" r="8" fill="#f0c08a"/>
  </svg>`;

  const planeSvg = '<svg viewBox="0 0 64 48"><path d="M2 22L62 2 40 46 28 30z" fill="#fff" stroke="#e7c4d6" stroke-width="2" stroke-linejoin="round"/><path d="M28 30L62 2 34 34z" fill="#f1d9e6"/></svg>';

  screen.innerHTML = `
    <div class="s5-planes" aria-hidden="true">
      <span class="s5-plane" style="--y:14%;--d:11s;--dl:-2s">${planeSvg}</span>
      <span class="s5-plane" style="--y:46%;--d:14s;--dl:-8s">${planeSvg}</span>
      <span class="s5-plane" style="--y:74%;--d:12s;--dl:-5s">${planeSvg}</span>
    </div>
    <div class="s5-delivery" id="s5Delivery" aria-hidden="true">
      <div class="s5-pm" id="s5Pm">
        <div class="pm-sway">${postmanSvg}</div>
      </div>
      <p class="pm-bubble" id="s5Bubble">Special delivery!<br>A letter came for you, ${name} \u2661</p>
      <span class="s5-cloud c1">${cloudSvg("#e7dcff")}</span>
      <span class="s5-cloud c2">${cloudSvg("#ffdcea")}</span>
      <span class="s5-cloud c3">${cloudSvg("#e7dcff")}</span>
      <span class="s5-cloud c4">${cloudSvg("#ffdcea")}</span>
    </div>
    <span class="s5-amb" style="--y:30%;--d:60s;--dl:-10s">${cloudSvg("#efe6ff")}</span>
    <span class="s5-amb" style="--y:62%;--d:80s;--dl:-45s">${cloudSvg("#ffe3ee")}</span>
    <div class="s5-stage">
      <div class="s5-env" id="s5Env">
        <div class="env-back"></div>
        <div class="env-paper"></div>
        <div class="env-front"><i class="l"></i><i class="r"></i><i class="b"></i></div>
        <div class="env-flap"></div>
        <div class="env-stamp" aria-hidden="true">\uD83C\uDF88</div>
        <div class="env-label">For ${name} \u2661<small>SPECIAL DELIVERY</small></div>
        <button type="button" class="env-seal" id="s5Seal" aria-label="Break the heart seal to open the letter">\u2665</button>
        <p class="s5-hint">tap the heart seal \u2726</p>
      </div>

      <div class="s5-sheet" id="s5Sheet">
        <div class="s5-paper" id="s5Paper">
          <p class="s5-dear">Dear ${name},</p>
          <div class="s5-text" id="s5Text"></div>
          <p class="s5-sign" id="s5Sign">${letter.sign || "\u2014 with love"}</p>
        </div>
      </div>

      <button type="button" class="s5-next" id="s5Next" hidden>Keep going \u203A</button>
    </div>`;

  const env = document.getElementById("s5Env");
  const seal = document.getElementById("s5Seal");
  const sheet = document.getElementById("s5Sheet");
  const paper = document.getElementById("s5Paper");
  const textBox = document.getElementById("s5Text");
  const sign = document.getElementById("s5Sign");
  const nextButton = document.getElementById("s5Next");

  /* drifting hearts and sparkles in the background */
  (function drift() {
    const layer = document.createElement("div");
    layer.className = "fx-layer";
    layer.setAttribute("aria-hidden", "true");
    const glyphs = ["\u2661", "\u2665", "\u2726", "\u2727", "\u273F"];
    const colors = ["#ff8fb3", "#b49af2", "#f5b94a", "#ff7aa2"];
    const count = window.innerWidth < 600 ? 12 : 20;

    for (let i = 0; i < count; i++) {
      const bit = document.createElement("span");
      bit.className = "float-particle";
      bit.textContent = pick(glyphs);
      bit.style.setProperty("--x", `${rand(2, 96).toFixed(1)}%`);
      bit.style.setProperty("--s", `${rand(14, 26).toFixed(0)}px`);
      bit.style.setProperty("--d", `${rand(10, 20).toFixed(1)}s`);
      bit.style.setProperty("--delay", `${(-rand(0, 20)).toFixed(1)}s`);
      bit.style.setProperty("--dx", `${rand(-60, 60).toFixed(0)}px`);
      bit.style.setProperty("--r", `${rand(-120, 120).toFixed(0)}deg`);
      bit.style.setProperty("--c", pick(colors));
      layer.appendChild(bit);
    }
    screen.insertBefore(layer, screen.firstChild);
  })();

  /* friends peeking over the top of the letter */
  if (window.Mates) {
    [["cat", "a", true], ["bunny", "b", false]].forEach(([kind, cls, wave]) => {
      const peek = document.createElement("span");
      peek.className = `s5-peek ${cls}`;
      peek.setAttribute("aria-hidden", "true");
      peek.innerHTML = window.Mates.svg(kind, wave);
      sheet.appendChild(peek);
    });
  }

  /* ---------------- the letter text, one character at a time ---------------- */

  const chars = [];

  letter.paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    const words = paragraph.split(" ");
    let marker = false;

    words.forEach((word, index) => {
      const opens = word.startsWith("**");
      const closes = word.endsWith("**");
      const clean = word.replace(/\*\*/g, "");
      if (opens) marker = true;

      const w = document.createElement("span");
      w.className = "w" + (marker ? " hl" : "");
      [...clean].forEach((letterChar) => {
        const c = document.createElement("span");
        c.className = "ch";
        c.textContent = letterChar;
        w.appendChild(c);
        chars.push(c);
      });

      p.appendChild(w);
      if (index < words.length - 1) p.appendChild(document.createTextNode(" "));
      if (closes) marker = false;
    });

    textBox.appendChild(p);
  });

  let shown = 0;
  let finished = false;
  let typingTimer = null;

  function finish() {
    if (finished) return;
    finished = true;
    window.clearTimeout(typingTimer);
    chars.forEach((c) => { c.classList.add("on"); c.classList.remove("cur"); });
    paper.scrollTop = paper.scrollHeight;

    sign.classList.add("on");
    screen.classList.add("done");
    celebrate();
    window.setTimeout(() => { nextButton.hidden = false; }, 1800);
  }

  function typeNext() {
    if (finished) return;
    if (shown > 0) chars[shown - 1].classList.remove("cur");

    if (shown >= chars.length) { finish(); return; }

    const c = chars[shown];
    c.classList.add("on", "cur");
    shown += 1;

    // keep the newest words in view
    const box = c.getBoundingClientRect();
    const view = paper.getBoundingClientRect();
    if (box.bottom > view.bottom - 24) paper.scrollTop += 32;

    const ch = c.textContent;
    const delay = /[.!?\u2661]/.test(ch) ? 280 : ch === "," ? 140 : 26;
    typingTimer = window.setTimeout(typeNext, delay);
  }

  // tap the paper while it writes to finish at once
  paper.addEventListener("click", () => { if (screen.classList.contains("reading")) finish(); });

  /* ---------------- confetti + stickers ---------------- */

  function burst(x, y, count) {
    const colors = ["#ff8fb3", "#b49af2", "#ffd76a", "#ff7aa2", "#8fd3ff", "#ffffff"];
    const glyphs = ["\u2661", "\u2665", "\u2726", "\u2727"];
    const spread = window.innerWidth < 600 ? 0.6 : 1;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      const glyph = i % 4 === 0;
      piece.className = "s5-conf" + (glyph ? " glyph" : "");
      if (glyph) piece.textContent = pick(glyphs);
      piece.style.setProperty("--x", `${x}px`);
      piece.style.setProperty("--y", `${y}px`);
      piece.style.setProperty("--w", glyph ? `${rand(16, 28).toFixed(0)}px` : `${rand(6, 11).toFixed(0)}px`);
      piece.style.setProperty("--c", pick(colors));
      piece.style.setProperty("--dx", `${(rand(-1, 1) * 300 * spread).toFixed(0)}px`);
      piece.style.setProperty("--up", `${(-rand(120, 300)).toFixed(0)}px`);
      piece.style.setProperty("--fall", `${rand(80, 320).toFixed(0)}px`);
      piece.style.setProperty("--r", `${rand(-540, 540).toFixed(0)}deg`);
      piece.style.setProperty("--d", `${rand(1.8, 2.9).toFixed(2)}s`);
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 3100);
    }
  }

  function celebrate() {
    const box = sheet.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height * 0.4, 56);
    window.setTimeout(() => burst(box.left + box.width * 0.2, box.top + box.height * 0.5, 30), 500);
    window.setTimeout(() => burst(box.left + box.width * 0.8, box.top + box.height * 0.5, 30), 900);

    // cartoon stickers pop around the letter
    const source = [...document.querySelectorAll("#passcodeScene .e2-st svg")];
    if (!source.length) return;
    const spots = [[-4, 4, 54], [104, 2, 58], [-7, 52, 50], [107, 48, 54], [-3, 98, 56], [103, 96, 52]];

    spots.forEach(([x, y, w], i) => {
      const pop = document.createElement("span");
      pop.className = "s5-pop";
      pop.style.setProperty("--x", `${x}%`);
      pop.style.setProperty("--y", `${y}%`);
      pop.style.setProperty("--w", `${w}px`);
      pop.style.setProperty("--dl", `${(i * 0.12).toFixed(2)}s`);
      pop.appendChild(source[i % source.length].cloneNode(true));
      sheet.appendChild(pop);
    });
  }

  /* ---------------- the delivery: clouds → postman → drop → leaves ---------------- */

  const delivery = document.getElementById("s5Delivery");
  const pm = document.getElementById("s5Pm");
  const bubble = document.getElementById("s5Bubble");
  let deliveryStarted = false;
  let landed = false;
  const timers = [];
  const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));

  function land() {
    if (landed) return;
    landed = true;
    screen.classList.add("landed");
  }

  function startDelivery() {
    if (deliveryStarted) return;
    deliveryStarted = true;

    screen.classList.add("deliver");                                   // 1. clouds drift in, the postman floats down
    later(() => { pm.classList.add("say"); delivery.classList.add("say"); }, 4500);                         // 2. "A letter came for you!"

    later(() => {                                                       // 3. he lets go of the letter
      const from = pm.querySelector(".pm-env").getBoundingClientRect();
      const to = env.getBoundingClientRect();
      env.style.setProperty("--dx", `${(from.left + from.width / 2 - (to.left + to.width / 2)).toFixed(0)}px`);
      env.style.setProperty("--dy", `${(from.top + from.height / 2 - (to.top + to.height / 2)).toFixed(0)}px`);
      pm.classList.add("released");
      screen.classList.add("dropped");
      env.classList.add("drop");
    }, 6200);

    later(() => { bubble.innerHTML = "Enjoy it! \u2661"; }, 6900);
    later(land, 7700);                                                   // 4. it has landed: the seal can be tapped
    later(() => screen.classList.add("leave"), 8300);                    // 5. he waves goodbye and floats away
    later(() => { delivery.remove(); }, 11600);
  }

  // tap anywhere to skip the delivery
  screen.addEventListener("click", (event) => {
    if (landed || event.target.closest("#s5Seal")) return;
    timers.forEach((t) => window.clearTimeout(t));
    landed = true;
    deliveryStarted = true;
    delivery.remove();
    env.classList.add("drop", "skip");
    screen.classList.add("landed", "dropped");
  });

  screen.addEventListener("screen:enter", startDelivery);
  if (!screen.hidden) startDelivery();

  /* ---------------- the opening sequence ---------------- */

  let opened = false;

  seal.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    screen.classList.add("opening");

    // 1. the seal cracks with a little burst of hearts
    seal.classList.add("crack");
    const box = seal.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height / 2, 22);

    // 2. the flap flips open
    window.setTimeout(() => env.classList.add("open"), 350);
    // 3. the letter slides up out of the envelope
    window.setTimeout(() => env.classList.add("rising"), 1150);
    // 4. the envelope drops away and the letter unfolds
    window.setTimeout(() => screen.classList.add("reading"), 2150);
    // 5. it starts writing itself
    window.setTimeout(typeNext, 3500);
  });

  nextButton.addEventListener("click", () => {
    nextButton.disabled = true;
    window.Screens.go("screen6");
  });
})();
