/* ==========================================
   ELEMENT 7 — THE CAKE
   A real birthday ritual in six steps:
   1 light the candles  2 everyone sings  3 blow them out
   4 cut the cake       5 first slice is hers  6 share with friends
   (Everything is built here: this one file is enough.)
   Settings live in screens.js → CONFIG.cake
========================================== */

(() => {
  const screen = document.getElementById("screen7");
  if (!screen) { console.error("Element 7: #screen7 is missing in index.html"); return; }

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const cfg = window.CONFIG || {};
  const cake = cfg.cake || {};
  const name = cfg.name || "you";
  const SONG = cake.song || "assets/audio/birthday.mp3";
  const SAY = cake.friendsSay || ["Yummy!", "Thank you!", "So good!", "Best day!", "Mmm \u2661", "More please!"];
  const FINAL_TITLE = cake.finalTitle || `Cheers, ${name}!`;
  const FINAL_TEXT = cake.finalText || "Every candle lit, every slice shared. This day is yours \u2661";
  const CANDLES = 5;

  /* ---------------- styles ---------------- */

  const css = `
  .s7 { --th: 34vh; --cw: min(29vw, 42vh, 400px); overflow: hidden; color: #fff4e6; font-family: "Nunito", "Nunito Local", sans-serif;
    background:
      repeating-linear-gradient(90deg, rgba(255, 255, 255, .025) 0 36px, transparent 36px 72px),
      radial-gradient(ellipse at 50% 30%, #55287a 0%, #331558 48%, #1a0b34 100%); }
  .s7 button { -webkit-tap-highlight-color: transparent; }

  /* string lights + garland */
  .s7-lights { position: absolute; left: 0; right: 0; top: 4.6vh; height: 7vh; z-index: 4; pointer-events: none; }
  .s7-lights svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .s7-bulb { position: absolute; width: 11px; height: 15px; margin-left: -5px; border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
    background: var(--c); box-shadow: 0 0 12px 3px var(--c); opacity: .35; animation: s7Bulb 2.4s ease-in-out var(--dl) infinite alternate; }
  @keyframes s7Bulb { to { opacity: 1; } }
  .s7.lights .s7-bulb { opacity: 1; animation-duration: 1s; }

  .s7-garland { position: absolute; left: 0; right: 0; top: 6.5vh; height: 11vh; z-index: 2; pointer-events: none; }
  .s7-flag { position: absolute; left: var(--x); top: var(--y); width: clamp(22px, 3.6vw, 42px); height: clamp(28px, 4.6vw, 52px); margin-left: -2vw;
    background: var(--c); clip-path: polygon(0 0, 100% 0, 50% 100%); display: grid; place-items: start center; padding-top: 22%;
    color: #4a2050; font: 700 clamp(12px, 2vw, 22px) / 1 "Playfair Display", "Playfair Local", Georgia, serif; rotate: var(--r);
    transform-origin: 50% 0; animation: s7Sway 3.4s ease-in-out var(--dl) infinite alternate; }
  @keyframes s7Sway { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }

  /* balloons and gifts */
  .s7-balloon { position: absolute; left: var(--x); top: var(--y); width: var(--w); z-index: 1; animation: s7Float var(--d) ease-in-out var(--dl) infinite alternate; pointer-events: none; }
  .s7-balloon svg { display: block; width: 100%; height: auto; }
  @keyframes s7Float { to { translate: 0 -16px; rotate: 3deg; } }

  /* the dark, candle-lit mood */
  .s7-dim { position: absolute; inset: 0; z-index: 7; pointer-events: none; transition: opacity 1.4s ease;
    background: radial-gradient(circle at 50% 46%, rgba(8, 3, 22, calc(.42 - var(--lit, 0) * .3)) 0%, rgba(8, 3, 22, .84) 66%); }
  .s7-dim.off { opacity: 0; }
  .s7-flash { position: absolute; inset: 0; z-index: 9; pointer-events: none; opacity: 0; background: radial-gradient(circle at 50% 46%, #fff6d0, rgba(255, 200, 120, 0) 70%); }
  .s7-flash.go { animation: s7Flash 1.2s ease-out; }
  @keyframes s7Flash { 0% { opacity: .95; } 100% { opacity: 0; } }

  /* the crew behind the table */
  .s7-crew { position: absolute; left: 0; right: 0; bottom: calc(var(--th) - 12px); z-index: 2; display: grid; grid-template-columns: 1fr var(--cw) 1fr; align-items: end; pointer-events: none; }
  .s7-side { display: flex; align-items: flex-end; }
  .s7-side.l { justify-content: flex-end; padding-right: 3vw; } .s7-side.r { justify-content: flex-start; padding-left: 3vw; }
  .s7-pal { position: relative; width: clamp(50px, 6.6vw, 92px); margin: 0 -4px; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .4));
    animation: s7Bob 3.4s ease-in-out var(--dl, 0s) infinite alternate; }
  .s7-pal svg, .s7-girl svg { display: block; width: 100%; height: auto; overflow: visible; }
  @keyframes s7Bob { to { translate: 0 -5px; } }
  .s7-crew.sing .s7-pal, .s7-crew.sing .s7-girl { animation: s7Sing 1.1s ease-in-out var(--dl, 0s) infinite alternate; }
  @keyframes s7Sing { from { rotate: -4deg; } to { rotate: 4deg; } }
  .s7-crew.cheer .s7-pal, .s7-crew.cheer .s7-girl { animation: s7Jump .6s ease-in-out var(--jd, 0s) infinite; }
  @keyframes s7Jump { 0%, 100% { translate: 0 0; } 40% { translate: 0 -26px; } }
  .s7-pal.munch { animation: s7Munch .35s ease-in-out 5; }
  @keyframes s7Munch { 50% { translate: 0 -8px; rotate: 3deg; } }

  .s7-girl { position: relative; width: clamp(86px, 10.8vw, 150px); margin: 0 4px 0 8px; z-index: 1; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .4));
    animation: s7Bob 4s ease-in-out infinite alternate; }
  .s7-girl .gf-happy, .s7-girl .gf-open { display: none; }
  .s7-girl.happy .gf-eyes, .s7-girl.happy .gf-smile { display: none; }
  .s7-girl.happy .gf-happy { display: inline; }
  .s7-girl.chew .gf-smile { display: none; }
  .s7-girl.chew .gf-open { display: inline; transform-box: fill-box; transform-origin: 50% 0; animation: s7Chew .3s ease-in-out infinite alternate; }
  @keyframes s7Chew { from { transform: scaleY(.45); } to { transform: scaleY(1); } }
  .s7-girl.chew .gf-cheek { transform-box: fill-box; transform-origin: center; scale: 1.25; }

  .s7-say { position: absolute; left: 50%; top: var(--sy, -14px); z-index: 12; translate: -50% 0; padding: 5px 12px; border-radius: 14px; background: #fff; color: #7a3a58;
    font: 700 clamp(16px, 2.3vh, 21px) / 1.1 "Dancing Script", "Dancing Local", cursive; white-space: nowrap; box-shadow: 0 6px 14px rgba(0, 0, 0, .3);
    scale: 0; transform-origin: 50% 100%; animation: s7Say 3.6s ease forwards; pointer-events: none; }
  .s7-say::after { content: ""; position: absolute; left: 50%; bottom: -6px; margin-left: -6px; border: 6px solid transparent; border-bottom: 0; border-top-color: #fff; }
  @keyframes s7Say { 0% { scale: 0; } 10% { scale: 1.12; } 16% { scale: 1; } 85% { scale: 1; opacity: 1; } 100% { scale: .6; opacity: 0; } }
  .s7-note { position: absolute; z-index: 12; left: var(--x); top: var(--y); color: #ffe6a0; font-size: var(--s); text-shadow: 0 0 10px #ffd76a; pointer-events: none;
    animation: s7Note 2.6s ease-out forwards; }
  @keyframes s7Note { 0% { opacity: 0; transform: translate(0, 0) rotate(-10deg); } 15% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), -110px) rotate(14deg); } }

  /* the table */
  .s7-table { position: absolute; left: -3%; right: -3%; bottom: 0; height: var(--th); z-index: 4;
    background: radial-gradient(circle, rgba(255, 255, 255, .5) 3px, transparent 4px) 0 0 / 26px 26px, linear-gradient(#f9d1e2, #f0a9c9); }
  .s7-table::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 7vh; border-radius: 18px 18px 0 0;
    background: linear-gradient(#b45f93, #8f3f74); box-shadow: 0 -6px 18px rgba(0, 0, 0, .3); }

  /* the cake */
  .s7-cake { position: absolute; left: 50%; bottom: calc(var(--th) - 5.2vh); z-index: 3; width: var(--cw); aspect-ratio: 300 / 290; translate: -50% 0;
    animation: s7CakeIn 1.3s cubic-bezier(.3, 1.4, .5, 1) .4s backwards; }
  @keyframes s7CakeIn { from { opacity: 0; transform: translateY(60px) scale(.8); } }
  .s7-cake .half { position: absolute; inset: 0; transition: translate .9s cubic-bezier(.3, 1.3, .5, 1), rotate .9s ease; }
  .s7-cake .half svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .s7-cake .half.l { clip-path: inset(-20% 50% 0 -10%); }
  .s7-cake .half.r { clip-path: inset(-20% -10% 0 50%); }
  .s7-cake.cut .half.l { translate: -11% 0; rotate: -3deg; transform-origin: 0 100%; }
  .s7-cake.cut .half.r { translate: 11% 0; rotate: 3deg; transform-origin: 100% 100%; }
  .s7-sponge { position: absolute; left: 50%; top: 24%; width: 0; height: 76%; z-index: 2; translate: -50% 0; opacity: 0; transition: width .9s ease, opacity .5s ease;
    background: linear-gradient(#fff7e0 0 14%, #ffd27a 14% 36%, #fff 36% 40%, #f7a6c9 40% 100%); }
  .s7-cake.cut .s7-sponge { width: 23%; opacity: 1; }

  .s7-flame { transform-box: fill-box; transform-origin: 50% 100%; scale: 0; }
  .s7-flame.on { scale: 1; animation: s7Flicker .45s ease-in-out infinite alternate; }
  .s7-flame.wind { animation: s7Wind .5s ease-in-out infinite alternate; }
  .s7-flame.out { scale: 0; transition: scale .25s ease-in; animation: none; }
  @keyframes s7Flicker { from { scale: 1 1; rotate: -2deg; } to { scale: .93 1.08; rotate: 2deg; } }
  @keyframes s7Wind { from { rotate: 8deg; scale: 1 .85; } to { rotate: 34deg; scale: .8 .7; } }

  .s7-candle { position: absolute; top: 0; width: 15%; height: 36%; margin-left: -7.5%; z-index: 4; border: 0; background: none; cursor: pointer; }
  .s7-candle::after { content: ""; position: absolute; left: 50%; top: 4%; width: 120%; aspect-ratio: 1; translate: -50% 0; border-radius: 50%;
    border: 2px solid rgba(255, 233, 160, .9); animation: s7Hint 1.3s ease-out infinite; }
  .s7-candle.done::after { display: none; }
  @keyframes s7Hint { 0% { scale: .4; opacity: 1; } 100% { scale: 1.1; opacity: 0; } }
  .s7-glow { position: absolute; left: 50%; top: 4%; width: 150%; aspect-ratio: 1; translate: -50% -20%; border-radius: 50%; pointer-events: none; z-index: -1;
    background: radial-gradient(circle, rgba(255, 190, 90, .55), transparent 65%); opacity: var(--lit, 0); transition: opacity .6s ease; }
  .s7-smoke { position: absolute; z-index: 5; width: 14px; height: 14px; border-radius: 50%; background: rgba(230, 225, 240, .55); filter: blur(3px);
    left: var(--x); top: var(--y); pointer-events: none; animation: s7Smoke 2s ease-out forwards; }
  @keyframes s7Smoke { to { opacity: 0; transform: translate(var(--dx), -90px) scale(3); } }

  /* knife + cut line */
  .s7-knife { position: absolute; left: 50%; top: -52%; z-index: 6; width: 17%; translate: -50% 0; touch-action: none; cursor: grab; display: none; }
  .s7-knife.show { display: block; animation: s7KnifeIn .8s cubic-bezier(.3, 1.4, .5, 1) backwards, s7KnifeNudge 1.2s ease-in-out 1s infinite alternate; }
  .s7-knife.drag { animation: none; cursor: grabbing; }
  .s7-knife svg { display: block; width: 100%; height: auto; filter: drop-shadow(0 8px 10px rgba(0, 0, 0, .4)); }
  @keyframes s7KnifeIn { from { opacity: 0; translate: -50% -40px; } }
  @keyframes s7KnifeNudge { to { translate: -50% 12px; } }
  .s7-guide { position: absolute; left: 50%; top: 8%; width: 0; height: 88%; z-index: 5; border-left: 3px dashed rgba(255, 233, 160, .9); pointer-events: none; display: none; }
  .s7-guide.show { display: block; animation: s7GuideBlink 1s ease-in-out infinite alternate; }
  @keyframes s7GuideBlink { to { opacity: .35; } }
  .s7-cutline { position: absolute; left: 50%; top: 8%; width: 4px; height: 0; z-index: 5; margin-left: -2px; background: #fff; box-shadow: 0 0 14px 4px #ffe9a8; border-radius: 2px; pointer-events: none; }

  /* plates and slices */
  .s7-plate { position: absolute; z-index: 6; width: clamp(54px, 8.4vw, 96px); translate: -50% -50%; filter: drop-shadow(0 6px 8px rgba(0, 0, 0, .35)); }
  .s7-plate .pl { position: absolute; left: 0; right: 0; bottom: 0; height: 26%; border-radius: 50%; background: radial-gradient(ellipse, #fff, #e0dbe8); }
  .s7-plate .sl { position: relative; display: block; }
  .s7-plate .sl svg { display: block; width: 100%; height: auto; }
  .s7-plate.b1 .sl { clip-path: polygon(0 0, 100% 0, 100% 32%, 84% 40%, 92% 54%, 100% 58%, 100% 100%, 0 100%); }
  .s7-plate.b2 .sl { clip-path: polygon(0 0, 66% 0, 70% 30%, 56% 42%, 68% 58%, 72% 100%, 0 100%); }
  .s7-plate.b3 .sl { clip-path: polygon(0 0, 30% 0, 36% 42%, 22% 62%, 32% 100%, 0 100%); }
  .s7-plate.b4 .sl { clip-path: polygon(0 100%, 0 96%, 10% 96%, 10% 100%); }
  .s7-plate.mine { cursor: pointer; animation: s7Pulse 1.2s ease-in-out infinite alternate; }
  @keyframes s7Pulse { to { filter: drop-shadow(0 0 16px rgba(255, 233, 160, .95)); } }
  .s7-fork { position: absolute; z-index: 11; width: 22px; pointer-events: none; }

  /* the panel on the table cloth */
  .s7-panel { position: absolute; left: 50%; bottom: 0; z-index: 8; translate: -50% 0; width: min(94vw, 640px); height: calc(var(--th) - 7vh); padding: 10px 16px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; color: #5b2a4e; }
  .s7-dots { display: flex; gap: 8px; margin-bottom: 2px; }
  .s7-dots i { width: 9px; height: 9px; border-radius: 50%; background: rgba(91, 42, 78, .25); transition: background .4s, scale .4s; }
  .s7-dots i.on { background: #e0587f; scale: 1.25; }
  .s7-title { margin: 0; font-family: "Playfair Display", "Playfair Local", Georgia, serif; font-style: italic; font-weight: 700; font-size: clamp(24px, min(5vw, 5.6vh), 42px); line-height: 1.1; }
  .s7-line { margin: 0; max-width: 520px; font-size: clamp(14px, 2.3vh, 18px); font-weight: 700; line-height: 1.4; color: #7a3a58; }
  .s7-title, .s7-line { transition: opacity .45s ease, transform .45s ease; }
  .s7-panel.swap .s7-title, .s7-panel.swap .s7-line { opacity: 0; transform: translateY(8px); }
  .s7-action, .s7-mic { border: 0; border-radius: 999px; cursor: pointer; font: 800 clamp(15px, 2.3vh, 18px) / 1 "Nunito", "Nunito Local", sans-serif; letter-spacing: .4px; }
  .s7-action { margin-top: 4px; padding: 14px 32px; background: linear-gradient(180deg, #ffe08f, #f6b94a); color: #3a2a55; box-shadow: 0 5px 0 #c78a2c, 0 0 26px rgba(255, 205, 110, .55);
    animation: s7Rise .7s ease backwards, s7ActPulse 2s ease-in-out .8s infinite; }
  .s7-action:active { transform: translateY(3px); box-shadow: 0 2px 0 #c78a2c; }
  .s7-action.pink { background: linear-gradient(110deg, #f6a2ae, #df5279 55%, #b63d68); color: #fff9f3; box-shadow: 0 5px 0 #792c4c, 0 0 26px rgba(246, 120, 160, .5); }
  @keyframes s7ActPulse { 50% { filter: brightness(1.12); } }
  @keyframes s7Rise { from { opacity: 0; transform: translateY(14px); } }
  .s7-mic { margin-top: 2px; padding: 7px 16px; background: rgba(91, 42, 78, .12); color: #7a3a58; font-size: 13px; border: 1.5px solid rgba(91, 42, 78, .3); }

  /* confetti, hearts */
  .s7-conf { position: absolute; z-index: 13; left: var(--x); top: var(--y); width: var(--w); height: calc(var(--w) * 1.5); background: var(--c); border-radius: 2px; pointer-events: none;
    animation: s7Conf var(--d) cubic-bezier(.2, .7, .4, 1) forwards; }
  .s7-conf.glyph { width: auto; height: auto; background: none; color: var(--c); font-size: var(--w); line-height: 1; }
  @keyframes s7Conf { 0% { opacity: 1; transform: translate(0, 0) rotate(0); } 35% { opacity: 1; transform: translate(calc(var(--dx) * .8), var(--up)) rotate(calc(var(--r) * .4)); }
    100% { opacity: 0; transform: translate(var(--dx), var(--fall)) rotate(var(--r)); } }


  /* ---------- the room: wall, curtains, neon sign, lanterns, bouquets, table treats ---------- */
  .s7-wall { position: absolute; inset: 0; z-index: 0; pointer-events: none; transition: filter 1.6s ease;
    background:
      radial-gradient(circle at 50% 0%, rgba(255, 214, 140, .24), transparent 55%),
      radial-gradient(circle, rgba(255, 255, 255, .08) 2px, transparent 3px) 0 0 / 34px 34px,
      repeating-linear-gradient(90deg, rgba(255, 255, 255, .035) 0 60px, transparent 60px 120px),
      linear-gradient(#3d1b62, #2b114b 60%, #1d0a38); }
  .s7.lights .s7-wall { filter: brightness(1.5) saturate(1.3); }
  .s7-bgimg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
  .s7-bgimg.on { opacity: 1; }
  .s7-bgimg::after { content: ""; position: absolute; inset: 0; background: linear-gradient(rgba(20, 8, 40, .3), rgba(20, 8, 40, .55)); }

  .s7-beam { position: absolute; top: 0; left: var(--x); width: 34vw; height: 78vh; z-index: 1; pointer-events: none; transform-origin: 50% 0; mix-blend-mode: screen;
    background: linear-gradient(rgba(255, 226, 160, .3), transparent 82%); clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
    animation: s7Beam 7s ease-in-out infinite alternate; }
  @keyframes s7Beam { from { rotate: -7deg; } to { rotate: 7deg; } }

  .s7-neon { position: absolute; left: 0; right: 0; top: 13.5vh; z-index: 1; text-align: center; pointer-events: none; animation: s7Neon 6s linear infinite; }
  .s7-neon .a { display: block; color: #ffeaf5; font: 700 clamp(34px, 4.6vw, 64px) / 1.05 "Dancing Script", "Dancing Local", cursive;
    text-shadow: 0 0 5px #fff, 0 0 16px #ff7ab8, 0 0 38px #ff4f9d, 0 0 76px #ff4f9d; }
  @keyframes s7Neon { 0%, 18%, 22%, 62%, 64%, 100% { opacity: 1; } 20%, 63% { opacity: .75; } }

  .s7-curtain { position: absolute; top: 0; bottom: var(--th); width: clamp(40px, 8vw, 120px); z-index: 2; pointer-events: none; box-shadow: 0 0 30px rgba(0, 0, 0, .5);
    background: repeating-linear-gradient(90deg, rgba(0, 0, 0, .28) 0 12px, rgba(255, 255, 255, .07) 12px 26px, rgba(0, 0, 0, 0) 26px 40px), linear-gradient(#93306c, #6a1f50 70%, #4a1238); }
  .s7-curtain.l { left: 0; clip-path: polygon(0 0, 100% 0, 66% 55%, 100% 100%, 0 100%); }
  .s7-curtain.r { right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 34% 55%); }
  .s7-valance { position: absolute; left: 0; right: 0; top: 0; height: clamp(34px, 5.4vh, 50px); z-index: 6; pointer-events: none; filter: drop-shadow(0 6px 8px rgba(0, 0, 0, .35));
    background: linear-gradient(#f9d56a, #d9a02a) 0 0 / 100% 7px no-repeat, radial-gradient(circle at 50% 0, #a23572 0 24px, transparent 25px) 0 7px / 48px 36px repeat-x; }
  .s7-bunting { position: absolute; left: 0; right: 0; top: 7.6vh; height: 56px; z-index: 3; pointer-events: none;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='56'%3E%3Cpath d='M0 6Q60 54 120 6' stroke='%23e8b8cf' stroke-width='2' fill='none'/%3E%3Cpolygon points='9,12 31,16 20,40' fill='%23ffb3c9'/%3E%3Cpolygon points='47,24 73,24 60,50' fill='%23cdb4ff'/%3E%3Cpolygon points='89,16 111,12 100,40' fill='%23ffe08a'/%3E%3C/svg%3E") repeat-x 0 0 / 120px 56px; }

  .s7-lantern { position: absolute; top: 0; left: var(--x); z-index: 2; width: var(--w); margin-left: calc(var(--w) / -2); pointer-events: none;
    transform-origin: 50% 0; animation: s7Swing 4.2s ease-in-out var(--dl) infinite alternate; }
  .s7-lantern::before { content: ""; display: block; width: 2px; height: var(--len); margin: 0 auto; background: #8a6a9a; }
  .s7-lantern i { display: block; width: 100%; aspect-ratio: 1; border-radius: 50%; box-shadow: 0 0 28px 8px var(--c);
    background: repeating-linear-gradient(90deg, rgba(255, 255, 255, .35) 0 2px, transparent 2px 11px), radial-gradient(circle at 35% 30%, #fff, var(--c) 62%); }
  @keyframes s7Swing { from { rotate: -5deg; } to { rotate: 5deg; } }

  .s7-bouquet { position: absolute; bottom: calc(var(--th) - 4.6vh); z-index: 4; width: clamp(84px, 10vw, 150px); pointer-events: none; animation: s7Sway2 5s ease-in-out var(--dl, 0s) infinite alternate; transform-origin: 50% 100%; }
  .s7-bouquet.l { left: -1%; } .s7-bouquet.r { right: -1%; --dl: -2s; }
  .s7-bouquet svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s7-bouquet .gift { position: absolute; left: 50%; bottom: -2%; width: 62%; translate: -50% 0; }
  @keyframes s7Sway2 { from { rotate: -2.5deg; } to { rotate: 2.5deg; } }
  .s7-cup { position: absolute; bottom: calc(var(--th) - 4.6vh); z-index: 4; width: clamp(38px, 4.6vw, 62px); pointer-events: none; }
  .s7-cup svg { display: block; width: 100%; height: auto; }
  .s7 .fx-layer { position: absolute; inset: 0; z-index: 1; }
  .s7 .float-particle { text-shadow: 0 0 10px currentColor; }

  .s7-table::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 18px;
    background: radial-gradient(circle at 12px 0, #fff 0 9px, transparent 10px) 0 0 / 24px 18px repeat-x; }

  @media (max-width: 680px) {
    .s7-bouquet { bottom: calc(var(--th) + 16vh); width: 78px; } .s7-bouquet .gift { display: none; }
    .s7-cup { left: 14%; } .s7-cup.r { left: auto; right: 14%; }
    .s7-lantern:nth-child(n+3) { display: none; }
  }

  @media (max-width: 680px) {
    .s7 { --th: 38vh; }
    .s7-pal { width: clamp(46px, 13vw, 70px); margin: 0 -7px; }
    .s7-girl { width: clamp(76px, 22vw, 100px); }
    .s7 { --cw: min(52vw, 30vh); }
    .s7-crew { display: flex; justify-content: center; }
    .s7-side { display: contents; } .s7-spacer { display: none; }
    .s7-girl { margin-bottom: 17vh; }
    /* sharing step on a phone: bring every friend in front of the cake, in the band above the panel, so all six can be tapped */
    .s7-crew.share { z-index: auto; }
    .s7-crew.share .s7-pal { z-index: 9; margin-bottom: -6vh; }
  }
  .s7-crew.share { z-index: auto; }
  .s7-crew.share .s7-pal { z-index: 9; }
  @media (max-height: 520px) {
    .s7 { --th: 42vh; } .s7-garland { display: none; } .s7-title { font-size: 22px; } .s7-line { font-size: 13px; }
  }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- art ---------------- */

  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="s7Pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f24ca0"/><stop offset="1" stop-color="#b8186e"/></linearGradient>
    <linearGradient id="s7Orange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ee7512"/></linearGradient>
    <linearGradient id="s7Flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a1a"/><stop offset=".55" stop-color="#ffc23d"/><stop offset="1" stop-color="#fffbe0"/></linearGradient>
    <linearGradient id="s7Blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9edf5"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c0d2"/></linearGradient>
    <pattern id="s7Stripe" width="10" height="14" patternUnits="userSpaceOnUse"><rect width="10" height="7" fill="#19c3d4"/><rect y="7" width="10" height="7" fill="#fff"/></pattern>
    <symbol id="s7Star" viewBox="-10 -10 20 20"><path d="M0-9l2.6 6 6.4.6-4.9 4.2 1.5 6.3L0 4.2-5.6 7.1l1.5-6.3-4.9-4.2 6.4-.6z"/></symbol>
  </defs></svg>`;

  function cakeSvg() {
    let candles = "";
    for (let i = 0; i < CANDLES; i++) {
      const x = 100 + (100 / (CANDLES - 1)) * i;
      candles += `<rect x="${x - 5}" y="40" width="10" height="50" rx="3" fill="url(#s7Stripe)"/><rect x="${x - 1}" y="35" width="2" height="7" fill="#3a2a2a"/>` +
        `<g transform="translate(${x} 36)"><g class="s7-flame" data-i="${i}"><circle cy="-14" r="17" fill="rgba(255,200,90,.35)"/><path d="M0-32C9-18 9-5 0 3C-9-5-9-18 0-32z" fill="url(#s7Flame)"/></g></g>`;
    }
    return `<svg viewBox="0 0 300 290" aria-hidden="true">
      <ellipse cx="150" cy="278" rx="142" ry="13" fill="#cfc9d6"/><ellipse cx="150" cy="273" rx="142" ry="13" fill="#e8e3ee"/>
      <rect x="22" y="170" width="256" height="104" rx="16" fill="url(#s7Pink)"/>
      <rect x="14" y="158" width="272" height="30" rx="15" fill="#fff"/>
      <g fill="#fff"><circle cx="50" cy="190" r="9"/><circle cx="104" cy="195" r="10"/><circle cx="158" cy="190" r="9"/><circle cx="212" cy="195" r="10"/><circle cx="256" cy="190" r="9"/></g>
      <g fill="#ff9ccd" opacity=".9"><use href="#s7Star" x="60" y="214" width="24" height="24"/><use href="#s7Star" x="100" y="214" width="24" height="24"/><use href="#s7Star" x="176" y="214" width="24" height="24"/><use href="#s7Star" x="216" y="214" width="24" height="24"/></g>
      <g fill="#ffd93d"><circle cx="72" cy="254" r="4"/><circle cx="112" cy="254" r="4"/><circle cx="188" cy="254" r="4"/><circle cx="228" cy="254" r="4"/></g>
      <rect x="74" y="98" width="152" height="76" rx="14" fill="url(#s7Orange)"/>
      <rect x="68" y="86" width="164" height="26" rx="13" fill="#fff"/>
      <g fill="#fff"><circle cx="100" cy="114" r="8"/><circle cx="150" cy="118" r="9"/><circle cx="200" cy="114" r="8"/></g>
      <g fill="#ffd0a0"><use href="#s7Star" x="138" y="124" width="24" height="24"/></g>
      <g fill="#ff4fa0"><circle cx="124" cy="154" r="4"/><circle cx="176" cy="154" r="4"/></g>
      ${candles}</svg>`;
  }

  const knifeSvg = `<svg viewBox="0 0 60 230" aria-hidden="true"><path d="M17 62h26l-9 160h-8z" fill="url(#s7Blade)" stroke="#aab1c4" stroke-width="1.5"/>
    <rect x="14" y="40" width="32" height="24" rx="6" fill="#d9b25a"/><rect x="18" y="0" width="24" height="46" rx="10" fill="#7a3a58"/>
    <circle cx="30" cy="12" r="3" fill="#ffd76a"/><circle cx="30" cy="30" r="3" fill="#ffd76a"/></svg>`;

  const forkSvg = `<svg viewBox="0 0 30 110" aria-hidden="true"><rect x="3" y="-4" width="24" height="18" rx="5" fill="#f24ca0"/><rect x="3" y="-4" width="24" height="6" rx="3" fill="#fff"/>
    <path d="M6 12v24M15 12v24M24 12v24" stroke="#d8dbe6" stroke-width="4" stroke-linecap="round"/><path d="M4 34q11 14 22 0z" fill="#d8dbe6"/><rect x="13" y="40" width="4" height="66" rx="2" fill="#cfd2dc"/></svg>`;

  const sliceSvg = `<svg viewBox="0 0 96 76" aria-hidden="true"><rect x="14" y="34" width="68" height="34" rx="6" fill="url(#s7Pink)"/><rect x="14" y="34" width="68" height="7" fill="#fff" opacity=".9"/>
    <rect x="22" y="12" width="52" height="24" rx="6" fill="url(#s7Orange)"/><rect x="18" y="7" width="60" height="12" rx="6" fill="#fff"/><circle cx="48" cy="6" r="6" fill="#ff3b6b"/>
    <circle cx="30" cy="54" r="2.4" fill="#ffd93d"/><circle cx="66" cy="54" r="2.4" fill="#ffd93d"/><circle cx="48" cy="58" r="2.4" fill="#ffd93d"/></svg>`;

  const balloonSvg = (c) => `<svg viewBox="0 0 40 70" aria-hidden="true"><path d="M20 50c0 6-4 6 0 18" stroke="#d9b5d0" stroke-width="1.5" fill="none"/><path d="M17 47h6l-3 5z" fill="${c}"/><ellipse cx="20" cy="23" rx="16" ry="22" fill="${c}"/><path d="M10 14c2-6 7-9 12-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/></svg>`;

  // her, facing us, sitting behind the cake
  const girlSvg = `<svg viewBox="0 0 120 190" aria-hidden="true">
    <path d="M14 70C12 24 36 8 60 8s48 16 46 62c-2 24 4 36 0 52H14c-4-16 2-28 0-52z" fill="#3a2438"/>
    <path d="M22 118c4-12 18-18 38-18s34 6 38 18v72H22z" fill="#f7a8c8"/><path d="M46 104l14 14 14-14" fill="#fff6f0"/>
    <ellipse cx="60" cy="66" rx="33" ry="36" fill="#f8d5c2"/>
    <path d="M26 62C26 32 44 20 62 20s34 12 34 40c-8-14-22-22-36-22S34 48 26 62z" fill="#3a2438"/>
    <g class="gf-eyes"><ellipse cx="47" cy="70" rx="4.6" ry="5.4" fill="#2a1a28"/><ellipse cx="73" cy="70" rx="4.6" ry="5.4" fill="#2a1a28"/>
      <circle cx="48.6" cy="68" r="1.7" fill="#fff"/><circle cx="74.6" cy="68" r="1.7" fill="#fff"/></g>
    <path class="gf-happy" d="M41 71q6-9 12 0M67 71q6-9 12 0" stroke="#2a1a28" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <circle class="gf-cheek" cx="39" cy="82" r="6.5" fill="#ff9ab4" opacity=".7"/><circle class="gf-cheek" cx="81" cy="82" r="6.5" fill="#ff9ab4" opacity=".7"/>
    <path class="gf-smile" d="M52 87q8 8 16 0" stroke="#b0405a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse class="gf-open" cx="60" cy="90" rx="7" ry="6" fill="#9a2c4a"/>
    <g fill="#ff8fb3"><path d="M84 22l14-9v18z"/><path d="M84 22l-12-9v18z"/></g><circle cx="84" cy="22" r="4.5" fill="#ff5c8d"/>
  </svg>`;

  /* ---------------- build the screen ---------------- */

  const flagColors = ["#ff8fb3", "#ffd76a", "#b49af2", "#8fd3c8", "#ffb347"];
  const letters = "HAPPY BIRTHDAY".split("");

  screen.innerHTML = `${sprite}
    <div class="s7-wall" aria-hidden="true"><div class="s7-bgimg" id="s7Bg"></div></div>
    <div class="s7-beam" style="--x:10vw"></div><div class="s7-beam" style="--x:56vw;animation-delay:-3s"></div>
    <div class="s7-neon" aria-hidden="true"><span class="a">Happy Birthday</span></div>
    <div class="s7-curtain l" aria-hidden="true"></div><div class="s7-curtain r" aria-hidden="true"></div>
    <div class="s7-bunting" aria-hidden="true"></div><div class="s7-valance" aria-hidden="true"></div>
    <div class="s7-lights" id="s7Lights" aria-hidden="true"></div>
    <div id="s7Decor" aria-hidden="true"></div>
    <div class="s7-crew" id="s7Crew" aria-hidden="true"></div>

    <div class="s7-cake" id="s7Cake">
      <div class="s7-glow"></div>
      <div class="half l">${cakeSvg()}</div>
      <div class="half r">${cakeSvg()}</div>
      <div class="s7-sponge"></div>
      <div class="s7-guide" id="s7Guide"></div>
      <div class="s7-cutline" id="s7Cutline"></div>
      <div class="s7-knife" id="s7Knife" role="button" aria-label="Drag the knife down to cut the cake">${knifeSvg}</div>
    </div>

    <div class="s7-table" aria-hidden="true"></div>
    <div id="s7Plates"></div>

    <div class="s7-panel" id="s7Panel">
      <div class="s7-dots" id="s7Dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <h2 class="s7-title" id="s7Title"></h2>
      <p class="s7-line" id="s7Line"></p>
      <button type="button" class="s7-action" id="s7Action" hidden></button>
      <button type="button" class="s7-mic" id="s7Mic" hidden>\uD83C\uDFA4 or really blow into your phone</button>
    </div>

    <div class="s7-dim" id="s7Dim"></div>
    <div class="s7-flash" id="s7Flash"></div>`;

  const $ = (id) => document.getElementById(id);
  const cakeBox = $("s7Cake"), crew = $("s7Crew"), plates = $("s7Plates"), dim = $("s7Dim");
  const panel = $("s7Panel"), titleEl = $("s7Title"), lineEl = $("s7Line"), action = $("s7Action"), micBtn = $("s7Mic");
  const knife = $("s7Knife"), guide = $("s7Guide"), cutline = $("s7Cutline");

  /* candle buttons over the flames */
  const candleButtons = [];
  for (let i = 0; i < CANDLES; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "s7-candle";
    b.style.left = `${((100 + (100 / (CANDLES - 1)) * i) / 300) * 100}%`;
    b.setAttribute("aria-label", `Light candle ${i + 1}`);
    cakeBox.appendChild(b);
    candleButtons.push(b);
  }

  /* string lights, lanterns, balloon bouquets, table treats, gold dust, optional background photo */

  const giftSvg = (a, b, c) => `<svg viewBox="0 0 100 110" aria-hidden="true"><rect x="8" y="64" width="84" height="42" rx="6" fill="${a}"/><rect x="44" y="64" width="12" height="42" fill="#ffd76a"/>
    <rect x="20" y="36" width="60" height="32" rx="6" fill="${b}"/><rect x="44" y="36" width="12" height="32" fill="#ffd76a"/>
    <rect x="32" y="14" width="36" height="26" rx="5" fill="${c}"/><rect x="45" y="14" width="10" height="26" fill="#ffd76a"/>
    <path d="M50 14c-14-14-26-2-12 4zM50 14c14-14 26-2 12 4z" fill="#ffd76a"/><circle cx="50" cy="14" r="4.5" fill="#ffb347"/></svg>`;

  const cupcakeSvg = (c) => `<svg viewBox="0 0 60 70" aria-hidden="true"><path d="M10 34h40l-5 32H15z" fill="${c}"/><path d="M20 34l2 32M30 34v32M40 34l-2 32" stroke="#fff" stroke-width="1.5" opacity=".5"/>
    <ellipse cx="30" cy="34" rx="24" ry="9" fill="#fff"/><ellipse cx="30" cy="24" rx="17" ry="8" fill="#ffd9e8"/><ellipse cx="30" cy="15" rx="10" ry="6" fill="#fff"/><circle cx="30" cy="8" r="5" fill="#ff3b6b"/></svg>`;

  const bouquetSvg = (colors) => {
    const pts = [[52, 58], [108, 48], [80, 112], [34, 132], [126, 126]];
    let strings = "", balloons = "";
    pts.forEach(([x, y], i) => {
      const c = colors[i % colors.length];
      strings += `<path d="M${x} ${y + 38}Q${(x + 80) / 2} 200 80 282" stroke="#d9b5d0" stroke-width="1.6" fill="none"/>`;
      balloons += `<ellipse cx="${x}" cy="${y}" rx="30" ry="38" fill="${c}"/><path d="M${x - 18} ${y - 16}q6-14 20-18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/><path d="M${x - 4} ${y + 37}h8l-4 7z" fill="${c}"/>`;
    });
    return `<svg viewBox="0 0 160 300" aria-hidden="true">${strings}${balloons}</svg>`;
  };

  (function decorate() {
    // string lights
    const lights = $("s7Lights");
    lights.innerHTML = '<svg viewBox="0 0 1000 60" preserveAspectRatio="none"><path d="M0 4Q125 44 250 4T500 4T750 4T1000 4" stroke="#6a4a7a" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/></svg>';
    const bulbColors = ["#ff8fb3", "#ffd76a", "#8fd3ff", "#b49af2", "#7ee8b0"];
    const n = window.innerWidth < 600 ? 13 : 22;
    for (let i = 0; i < n; i++) {
      const x = i / (n - 1), seg = Math.min(3, Math.floor(x * 4)), t = x * 4 - seg;
      const bulb = document.createElement("span");
      bulb.className = "s7-bulb";
      bulb.style.left = `${x * 100}%`;
      bulb.style.top = `${((4 + 80 * t * (1 - t)) / 60) * 100}%`;
      bulb.style.setProperty("--c", bulbColors[i % bulbColors.length]);
      bulb.style.setProperty("--dl", `${(-rand(0, 2.4)).toFixed(1)}s`);
      lights.appendChild(bulb);
    }

    const decor = $("s7Decor");

    // paper lanterns hanging from the ceiling
    [[17, 6, 54, "#ff8fb3"], [27, 13, 46, "#ffd76a"], [73, 12, 48, "#b49af2"], [83, 6, 56, "#7ee8b0"]].forEach(([x, len, w, c], i) => {
      const l = document.createElement("div");
      l.className = "s7-lantern";
      l.style.setProperty("--x", `${x}%`);
      l.style.setProperty("--len", `${len + 12}vh`);
      l.style.setProperty("--w", `${w}px`);
      l.style.setProperty("--c", c);
      l.style.setProperty("--dl", `${(-i * 1.3).toFixed(1)}s`);
      l.innerHTML = "<i></i>";
      decor.appendChild(l);
    });

    // balloon bouquets tied to gift stacks at both ends of the table
    [["l", ["#ff8fb3", "#b49af2", "#ffd76a", "#7ee8b0", "#ff7aa2"], ["#ff8fb3", "#b49af2", "#7ee8b0"]],
     ["r", ["#ffd76a", "#ff7aa2", "#8fd3ff", "#b49af2", "#7ee8b0"], ["#ffd76a", "#8fd3c8", "#ff8fb3"]]].forEach(([side, balloons, gift]) => {
      const q = document.createElement("div");
      q.className = `s7-bouquet ${side}`;
      q.innerHTML = `${bouquetSvg(balloons)}<div class="gift">${giftSvg(gift[0], gift[1], gift[2])}</div>`;
      decor.appendChild(q);
    });

    // cupcakes on the table
    [["l", "27%", "#f7a8c8"], ["r", "", "#cdb4ff"]].forEach(([side, left, color]) => {
      for (let k = 0; k < 2; k++) {
        const cup = document.createElement("div");
        cup.className = `s7-cup ${side}`;
        if (side === "l") cup.style.left = `calc(${left} - ${k * 44}px)`; else cup.style.right = `calc(27% - ${k * 44}px)`;
        cup.innerHTML = cupcakeSvg(k ? color : "#ffd27a");
        decor.appendChild(cup);
      }
    });

    // drifting gold dust and hearts
    const dust = document.createElement("div");
    dust.className = "fx-layer";
    dust.setAttribute("aria-hidden", "true");
    const glyphs = ["\u2726", "\u2727", "\u2661", "\u00B7"], tints = ["#ffe6a0", "#ff9ec8", "#e8c7ff", "#ffd76a"];
    for (let i = 0; i < (window.innerWidth < 600 ? 14 : 26); i++) {
      const bit = document.createElement("span");
      bit.className = "float-particle";
      bit.textContent = pick(glyphs);
      bit.style.setProperty("--x", `${rand(2, 96).toFixed(1)}%`);
      bit.style.setProperty("--s", `${rand(12, 24).toFixed(0)}px`);
      bit.style.setProperty("--d", `${rand(10, 20).toFixed(1)}s`);
      bit.style.setProperty("--delay", `${(-rand(0, 20)).toFixed(1)}s`);
      bit.style.setProperty("--dx", `${rand(-60, 60).toFixed(0)}px`);
      bit.style.setProperty("--r", `${rand(-120, 120).toFixed(0)}deg`);
      bit.style.setProperty("--c", pick(tints));
      dust.appendChild(bit);
    }
    screen.insertBefore(dust, screen.firstChild);

    // optional: your own background picture (it sits behind everything; the animated layers play on top)
    const bgBase = cake.background || "assets/images/cake-bg";
    const bg = $("s7Bg");
    const tryEnding = (i) => {
      const ends = ["jpg", "png", "jpeg", "webp"];
      if (i >= ends.length) return;
      const img = new Image();
      img.onload = () => { bg.style.backgroundImage = `url("${img.src}")`; bg.classList.add("on"); };
      img.onerror = () => tryEnding(i + 1);
      img.src = `${bgBase}.${ends[i]}`;
    };
    tryEnding(0);
  })();

  /* the crew: friends on both sides, her in the middle */
  const lineup = ["panda", "bunny", "bear", "GIRL", "cat", "puppy", "bunny"];
  const pals = [];
  let girl = null;

  const sideL = document.createElement("div"), sideR = document.createElement("div"), spacer = document.createElement("div");
  sideL.className = "s7-side l"; sideR.className = "s7-side r"; spacer.className = "s7-spacer";
  crew.append(sideL, spacer, sideR);

  lineup.forEach((kind, i) => {
    const el = document.createElement("div");
    if (kind === "GIRL") {
      el.className = "s7-girl";
      el.innerHTML = girlSvg;
      girl = el;
    } else {
      el.className = "s7-pal";
      el.dataset.kind = kind;
      el.style.setProperty("--dl", `${(-i * 0.6).toFixed(1)}s`);
      if (window.Mates) el.innerHTML = window.Mates.svg(kind, false, false);
      pals.push(el);
    }
    (i <= 3 ? sideL : sideR).appendChild(el);
  });

  const setFace = (pal, face, wave) => { if (window.Mates) pal.innerHTML = window.Mates.svg(pal.dataset.kind, !!wave, face); };

  /* ---------------- helpers ---------------- */

  const timers = [];
  const later = (fn, ms) => { const t = window.setTimeout(fn, ms); timers.push(t); return t; };

  const rel = (el) => {
    const s = screen.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height, l: r.left - s.left, t: r.top - s.top };
  };

  function setStep(n, title, line, actionLabel, onAction, pink) {
    panel.classList.add("swap");
    later(() => {
      titleEl.textContent = title;
      lineEl.textContent = line;
      [...$("s7Dots").children].forEach((d, i) => d.classList.toggle("on", i < n));
      micBtn.hidden = true;
      if (actionLabel) {
        action.textContent = actionLabel;
        action.classList.toggle("pink", !!pink);
        action.hidden = false;
        action.style.animation = "none"; void action.offsetWidth; action.style.animation = "";
        action.onclick = onAction;
      } else {
        action.hidden = true;
        action.onclick = null;
      }
      panel.classList.remove("swap");
    }, 450);
  }

  function say(el, text, offset) {
    const b = document.createElement("span");
    b.className = "s7-say";
    b.textContent = text;
    if (offset) b.style.setProperty("--sy", offset);
    el.appendChild(b);
    window.setTimeout(() => b.remove(), 3800);
  }

  function confetti(x, y, count, spread, up) {
    const colors = ["#ff8fb3", "#b49af2", "#ffd76a", "#ff7aa2", "#8fd3ff", "#7ee8b0", "#ffffff"];
    const glyphs = ["\u2661", "\u2665", "\u2726"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      const glyph = i % 5 === 0;
      piece.className = "s7-conf" + (glyph ? " glyph" : "");
      if (glyph) piece.textContent = pick(glyphs);
      piece.style.setProperty("--x", `${x}px`);
      piece.style.setProperty("--y", `${y}px`);
      piece.style.setProperty("--w", glyph ? `${rand(16, 26).toFixed(0)}px` : `${rand(6, 11).toFixed(0)}px`);
      piece.style.setProperty("--c", pick(colors));
      piece.style.setProperty("--dx", `${(rand(-1, 1) * spread).toFixed(0)}px`);
      piece.style.setProperty("--up", `${(-rand(up * 0.5, up)).toFixed(0)}px`);
      piece.style.setProperty("--fall", `${rand(60, 260).toFixed(0)}px`);
      piece.style.setProperty("--r", `${rand(-540, 540).toFixed(0)}deg`);
      piece.style.setProperty("--d", `${rand(1.8, 2.9).toFixed(2)}s`);
      screen.appendChild(piece);
      window.setTimeout(() => piece.remove(), 3200);
    }
  }

  function poppers() {
    const s = screen.getBoundingClientRect();
    confetti(s.width * 0.06, s.height * 0.8, 50, 320, 420);
    confetti(s.width * 0.94, s.height * 0.8, 50, -320 > 0 ? 320 : 320, 420);
    later(() => { confetti(s.width * 0.5, s.height * 0.3, 40, 420, 240); }, 400);
  }

  /* ---------------- sound ---------------- */

  let songCtl = null;

  // a music-box "Happy Birthday" made with the browser's own sound engine (the tune is public domain)
  function musicBox() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.32;
    master.connect(ctx.destination);

    const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
    const tune = [
      ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
      ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
      ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
      ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2.5]
    ];
    const beat = 0.58;
    let t = ctx.currentTime + 0.15;

    tune.forEach(([note, beats]) => {
      const f = N[note], len = beats * beat;
      [[1, "sine", 1], [2, "triangle", 0.28], [3, "sine", 0.1]].forEach(([mult, type, amp]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type;
        o.frequency.value = f * mult;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.5 * amp, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(len * 1.9, 0.9));
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + Math.max(len * 1.9, 0.9) + 0.05);
      });
      t += len;
    });

    const total = (t - ctx.currentTime) * 1000;
    return {
      total,
      stop() {
        try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0, ctx.currentTime, 0.15); window.setTimeout(() => ctx.close(), 800); } catch (e) { /* ignore */ }
      }
    };
  }

  // tries your own song file first; if it is not there, plays the music box
  function playSong(onEnd) {
    let decided = false;
    const audio = new Audio(SONG);
    audio.preload = "auto";

    const useBox = () => {
      if (decided) return;
      decided = true;
      const box = musicBox();
      if (!box) { onEnd(); return; }
      songCtl = box;
      later(onEnd, box.total);
    };

    audio.addEventListener("canplaythrough", () => {
      if (decided) return;
      decided = true;
      songCtl = { stop() { audio.pause(); } };
      audio.addEventListener("ended", onEnd);
      audio.play().catch(useBox);
    }, { once: true });
    audio.addEventListener("error", useBox, { once: true });
    later(useBox, 1200);
    audio.load();
  }

  const stopSong = () => { if (songCtl) { songCtl.stop(); songCtl = null; } };

  /* ---------------- step 1: light the candles ---------------- */

  const lit = new Array(CANDLES).fill(false);
  let litCount = 0;
  let blown = false;
  let noteTimer = null;

  const flamesOf = (i) => screen.querySelectorAll(`.s7-flame[data-i="${i}"]`);

  function light(i) {
    if (lit[i]) return;
    lit[i] = true;
    litCount += 1;
    candleButtons[i].classList.add("done");
    flamesOf(i).forEach((f) => f.classList.add("on"));
    screen.style.setProperty("--lit", (litCount / CANDLES).toFixed(2));
    cakeBox.style.setProperty("--lit", (litCount / CANDLES).toFixed(2));
    dim.style.setProperty("--lit", (litCount / CANDLES).toFixed(2));
    if (litCount === 1) lineEl.textContent = `${CANDLES - litCount} more\u2026 keep going \u2726`;
    else if (litCount < CANDLES) lineEl.textContent = `${CANDLES - litCount} more\u2026 keep going \u2726`;
    if (litCount === CANDLES) allLit();
  }

  candleButtons.forEach((b, i) => b.addEventListener("click", () => light(i)));

  /* ---------------- step 2: everyone sings ---------------- */

  function singNotes() {
    const s = screen.getBoundingClientRect();
    pals.concat(girl).forEach((who) => {
      const r = rel(who);
      const note = document.createElement("span");
      note.className = "s7-note";
      note.textContent = pick(["\u266A", "\u266B", "\u2661"]);
      note.style.setProperty("--x", `${r.x}px`);
      note.style.setProperty("--y", `${r.t}px`);
      note.style.setProperty("--s", `${rand(18, 30).toFixed(0)}px`);
      note.style.setProperty("--dx", `${rand(-30, 30).toFixed(0)}px`);
      screen.appendChild(note);
      window.setTimeout(() => note.remove(), 2800);
    });
  }

  function allLit() {
    pals.forEach((p) => setFace(p, true, false));        // "wow" faces
    crew.classList.add("sing");
    if (window.Music && window.Music.duck) window.Music.duck(true);

    setStep(2, "Everyone is singing", `\u266A  Happy birthday, ${name}  \u266A`, null);
    noteTimer = window.setInterval(singNotes, 1500);

    playSong(() => { window.clearInterval(noteTimer); crew.classList.remove("sing"); });
    later(() => {
      setStep(3, "Make it count", "Blow out the candles\u2026 and let the wish go.", "Blow out the candles \uD83D\uDCA8", blowOut);
      later(() => { micBtn.hidden = false; }, 900);
    }, 3200);
  }

  /* ---------------- step 3: blow them out ---------------- */

  let micStop = null;

  micBtn.addEventListener("click", async () => {
    if (micStop) return;
    micBtn.textContent = "listening\u2026 blow!";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      let loud = 0, alive = true;

      micStop = () => { alive = false; stream.getTracks().forEach((t) => t.stop()); ctx.close(); };

      const tick = () => {
        if (!alive) return;
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) { const d = (v - 128) / 128; sum += d * d; }
        loud = Math.sqrt(sum / buf.length) > 0.13 ? loud + 1 : Math.max(0, loud - 1);
        if (loud > 14) blowOut(); else requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      micBtn.textContent = "no microphone here \u2014 just tap the button \u2661";
    }
  });

  function blowOut() {
    if (blown) return;
    blown = true;
    if (micStop) micStop();
    window.clearInterval(noteTimer);
    stopSong();
    micBtn.hidden = true;
    action.hidden = true;
    crew.classList.remove("sing");

    // the wind bends every flame, then they go out one by one with a puff of smoke
    screen.querySelectorAll(".s7-flame.on").forEach((f) => f.classList.add("wind"));
    const box = rel(cakeBox);
    for (let i = 0; i < CANDLES; i++) {
      later(() => {
        flamesOf(i).forEach((f) => { f.classList.remove("on", "wind"); f.classList.add("out"); });
        for (let k = 0; k < 4; k++) {
          const smoke = document.createElement("span");
          smoke.className = "s7-smoke";
          smoke.style.setProperty("--x", `${((100 + (100 / (CANDLES - 1)) * i) / 300) * box.w + (box.l - box.w * 0)}px`);
          smoke.style.setProperty("--y", `${box.t + box.h * 0.12}px`);
          smoke.style.setProperty("--dx", `${rand(-24, 24).toFixed(0)}px`);
          smoke.style.animationDelay = `${(k * 0.12).toFixed(2)}s`;
          screen.appendChild(smoke);
          window.setTimeout(() => smoke.remove(), 2400);
        }
      }, 700 + i * 140);
    }

    // the lights come on with a pop
    later(() => {
      $("s7Flash").classList.add("go");
      dim.classList.add("off");
      cakeBox.style.setProperty("--lit", 0);
      screen.classList.add("lights");
      pals.forEach((p, i) => { setFace(p, "happy", i % 2 === 0); });
      girl.classList.add("happy");
      crew.classList.add("cheer");
      pals.concat(girl).forEach((p, i) => p.style.setProperty("--jd", `${(i * 0.1).toFixed(2)}s`));
      poppers();
      if (window.Music && window.Music.duck) window.Music.duck(false);
      setStep(3, "Hooray!", `${name}, your wish is flying away \u2661`, null);
    }, 700 + CANDLES * 140 + 500);

    later(() => { crew.classList.remove("cheer"); }, 700 + CANDLES * 140 + 3200);
    later(startCut, 700 + CANDLES * 140 + 3600);
  }

  /* ---------------- step 4: cut the cake ---------------- */

  function startCut() {
    setStep(4, "Now, the first cut", "Drag the knife down the middle of the cake.", null);
    later(() => { knife.classList.add("show"); guide.classList.add("show"); }, 700);
  }

  let cutDone = false;

  (function knifeDrag() {
    let startY = 0, moved = 0, dragging = false, travel = 1;

    knife.addEventListener("pointerdown", (e) => {
      if (cutDone) return;
      dragging = true;
      startY = e.clientY;
      moved = 0;
      knife.classList.add("drag");
      knife.setPointerCapture(e.pointerId);
      travel = cakeBox.getBoundingClientRect().height * 0.95;
    });

    knife.addEventListener("pointermove", (e) => {
      if (!dragging || cutDone) return;
      moved = Math.max(0, e.clientY - startY);
      const y = Math.min(moved, travel);
      knife.style.translate = `-50% ${y}px`;
      cutline.style.height = `${Math.max(0, Math.min(88, (y / travel) * 100))}%`;
      if (y / travel > 0.92) finishCut();
    });

    const release = () => {
      if (!dragging) return;
      dragging = false;
      knife.classList.remove("drag");
      if (cutDone) return;
      if (moved < 8) { finishCut(); return; }          // a simple tap also cuts
      knife.style.transition = "translate .4s ease";
      knife.style.translate = "-50% 0px";
      cutline.style.transition = "height .4s ease";
      cutline.style.height = "0%";
      later(() => { knife.style.transition = ""; cutline.style.transition = ""; }, 450);
    };
    knife.addEventListener("pointerup", release);
    knife.addEventListener("pointercancel", release);
    knife.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") finishCut(); });
    knife.tabIndex = 0;
  })();

  function finishCut() {
    if (cutDone) return;
    cutDone = true;
    guide.classList.remove("show");
    knife.style.transition = "translate .5s ease-in, opacity .5s ease .3s";
    knife.style.translate = "-50% 120%";
    knife.style.opacity = "0";
    cutline.style.height = "88%";

    later(() => {
      cakeBox.classList.add("cut");
      const b = rel(cakeBox);
      confetti(b.x, b.y, 30, 200, 160);
      pals.forEach((p, i) => setFace(p, "happy", i % 2 === 1));
      say(pals[2], "Ooh!", "-14px");
      say(pals[4], "Wow!", "-40px");
      cutline.style.opacity = "0";
    }, 450);
    later(() => { knife.remove(); guide.remove(); cutline.remove(); }, 1200);
    later(startEat, 1800);
  }

  /* ---------------- step 5: her first slice ---------------- */

  const makePlate = (cls) => {
    const p = document.createElement("div");
    p.className = `s7-plate ${cls || ""}`;
    p.innerHTML = `<span class="pl"></span><span class="sl">${sliceSvg}</span>`;
    return p;
  };

  function startEat() {
    setStep(5, `The first slice is yours`, "Tap your slice to take a bite.", null);

    const cb = rel(cakeBox);
    const tableY = cb.t + cb.h - 6;
    const mine = makePlate("mine");
    mine.style.left = `${cb.x - cb.w * 0.74}px`;
    mine.style.top = `${tableY + 10}px`;
    mine.setAttribute("role", "button");
    mine.setAttribute("aria-label", "Take a bite");
    plates.appendChild(mine);
    mine.animate([{ opacity: 0, transform: "translate(-80px,-60px) scale(.4)" }, { opacity: 1, transform: "none" }], { duration: 900, easing: "cubic-bezier(.3,1.5,.5,1)" });

    let bites = 0, busy = false;

    const bite = () => {
      if (busy || bites >= 4) return;
      busy = true;
      mine.classList.remove("mine");

      // the fork carries a bite up to her mouth and back
      const p = rel(mine), g = rel(girl);
      const fork = document.createElement("div");
      fork.className = "s7-fork";
      fork.innerHTML = forkSvg;
      fork.style.left = `${p.x}px`;
      fork.style.top = `${p.y - 50}px`;
      screen.appendChild(fork);
      const dx = g.x - p.x, dy = g.t + g.h * 0.47 - (p.y - 50);
      fork.animate([
        { transform: "translate(0,0) rotate(0deg)" },
        { transform: `translate(${dx}px,${dy}px) rotate(-14deg)`, offset: 0.45 },
        { transform: `translate(${dx}px,${dy}px) rotate(-14deg)`, offset: 0.58 },
        { transform: "translate(0,0) rotate(0deg)" }
      ], { duration: 1500, easing: "ease-in-out" }).onfinish = () => fork.remove();

      later(() => {
        girl.classList.remove("happy");
        girl.classList.add("chew");
        bites += 1;
        mine.classList.remove("b1", "b2", "b3", "b4");
        mine.classList.add(`b${bites}`);
        say(girl, pick(["Mmm \u2661", "So good!", "Yum!", "Delicious!"]), "-8px");
        const gb = rel(girl);
        confetti(gb.x, gb.t + gb.h * 0.5, 8, 120, 90);
      }, 700);

      later(() => {
        girl.classList.remove("chew");
        girl.classList.add("happy");
        busy = false;
        if (bites >= 4) {
          mine.remove();
          startShare();
        } else {
          mine.classList.add("mine");
          lineEl.textContent = bites === 1 ? "Another bite \u2661" : "Almost finished\u2026 one more!";
        }
      }, 2000);
    };

    mine.addEventListener("click", bite);
  }

  /* ---------------- step 6: share with every friend ---------------- */

  function startShare() {
    let shared = 0;
    crew.classList.add("share");
    // make sure every friend is in front of the cake on every phone, whatever the stylesheet says
    crew.style.zIndex = "auto";
    cakeBox.style.zIndex = "1";
    pals.forEach((p) => { p.style.position = "relative"; p.style.zIndex = "9"; });
    setStep(6, "Now share it with your friends", `Tap a friend to give them a slice (0 / ${pals.length})`, null);
    later(() => { pals.forEach((p) => { p.style.cursor = "pointer"; p.style.pointerEvents = "auto"; }); }, 500);

    pals.forEach((pal, i) => {
      const give = () => {
        if (pal.dataset.fed) return;
        pal.dataset.fed = "1";
        pal.style.cursor = "";

        const cb = rel(cakeBox), pb = rel(pal), tb = rel($("s7Plates"));
        const plate = makePlate();
        plate.style.left = `${pb.x}px`;
        plate.style.top = `${cb.t + cb.h - 6 + 12}px`;
        plates.appendChild(plate);

        // the slice flies from the cake to the friend
        plate.animate([
          { transform: `translate(${cb.x - pb.x}px, ${-cb.h * 0.35}px) scale(.4) rotate(-20deg)`, opacity: 0 },
          { transform: `translate(${(cb.x - pb.x) * 0.4}px, ${-cb.h * 0.7}px) scale(.8) rotate(10deg)`, opacity: 1, offset: 0.5 },
          { transform: "none", opacity: 1 }
        ], { duration: 900, easing: "ease-out" });

        later(() => {
          setFace(pal, "happy", true);
          pal.classList.add("munch");
          say(pal, SAY[i % SAY.length], i % 2 ? "-40px" : "-12px");
          let step = 0;
          const eat = window.setInterval(() => {
            step += 1;
            plate.classList.remove("b1", "b2", "b3", "b4");
            plate.classList.add(`b${step}`);
            if (step >= 4) { window.clearInterval(eat); pal.classList.remove("munch"); }
          }, 420);
        }, 900);

        shared += 1;
        lineEl.textContent = `Tap a friend to give them a slice (${shared} / ${pals.length})`;
        if (shared === pals.length) later(finale, 3200);
      };
      pal.addEventListener("click", give);
    });
  }

  /* ---------------- the toast ---------------- */

  function finale() {
    setStep(6, FINAL_TITLE, FINAL_TEXT, "Keep going \u203A", () => {
      action.disabled = true;
      stopSong();
      window.Screens.go("screen8");
    }, true);

    crew.classList.add("cheer");
    pals.concat(girl).forEach((p, i) => p.style.setProperty("--jd", `${(i * 0.08).toFixed(2)}s`));
    pals.forEach((p, i) => setFace(p, "happy", true));
    girl.classList.add("happy");
    poppers();
    later(poppers, 1400);
  }
})();
