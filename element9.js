/* ==========================================
   ELEMENT 9 — THE ENDING (a seashore at sunset)
   The golden key opens a door. Behind it: a quiet beach at dusk.
   The sun sinks into a faded-blue sea, the moon and stars come out,
   fish jump from the waves, a soft wind moves the palms and her hair.
   She stands on the sand with her friends, looking out at the sea.
   Then your message, "Happy Birthday", and three keepsakes:
   a voice note, "open when…" notes, and a card she can save.
   (Everything is built here: this one file is enough.)
   Settings live in screens.js → CONFIG.ending

   PREVIEW ONLY THIS SCENE: open the page with  #beach  at the end of
   the address (e.g. index.html#beach). It skips everything before it.
========================================== */

(() => {
  const screen = document.getElementById("screen9");
  if (!screen) { console.error("Element 9: #screen9 is missing in index.html"); return; }

  const PREVIEW = window.location.hash === "#beach";

  // make sure the old placeholder look is gone and this scene's own class is applied
  screen.classList.remove("screen-placeholder");
  screen.classList.add("screen", "s9");
  screen.style.background = "#0d1240";
  screen.style.display = "block";
  if (PREVIEW) { screen.hidden = false; screen.style.zIndex = "99999"; }

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const cfg = window.CONFIG || {};
  const end = cfg.ending || {};
  const name = cfg.name || "you";
  const MESSAGE = end.message || ["I don't know how it will all go, but I tried my best to make this special.", "It's our last phase of school, and after that we will be separated. That's why I tried something different.", "And yeah, be always happy \u2661"];
  const SIGN = end.sign || "— with love";
  const TITLE = end.title || `Happy Birthday, ${name}`;
  const VOICE = end.voice || "assets/audio/voice.mp3";
  const VOICE_TEXT = end.voiceText || `Happy birthday, ${name}! You are so special, and every day with you is a happy one. I hope your day is full of smiles, sweets and big, big hugs. Never stop shining. We love you!`;
  const NOTES = end.notes || [];
  const CARD_LINE = end.cardLine || "Don't forget to smile \u2726";

  /* ---------------- little helpers ---------------- */

  // a repeating wave strip as a background image: crest colour fading to transparent
  const waveUri = (rgb, a) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="40" viewBox="0 0 400 40" preserveAspectRatio="none">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${a}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></linearGradient></defs>` +
      `<path d="M0 20Q50 2 100 20T200 20T300 20T400 20V40H0z" fill="url(#g)"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  };
  const WAVE_LIGHT = waveUri("196,224,255", 0.9);
  const WAVE_DARK = waveUri("22,48,110", 0.85);
  const WAVE_FOAM = waveUri("255,255,255", 0.8);

  /* ---------------- styles ---------------- */

  const css = `
  .s9 { --hz: 50vh; --sand: 27vh; --sx: 68%; --mx: 15%; overflow: hidden; color: #fff6e6; font-family: "Nunito", "Nunito Local", sans-serif; background: #0d1240; }

  /* ---------- sky ---------- */
  .s9-sky { position: absolute; left: 0; right: 0; top: 0; height: var(--hz); z-index: 0; overflow: hidden; pointer-events: none;
    background: linear-gradient(#070a2e 0%, #121858 20%, #2a2a7a 40%, #6a3f8e 58%, #c4587f 76%, #ff8f60 91%, #ffc272 100%); }
  .s9-sky .hglow { position: absolute; inset: 0; background: radial-gradient(ellipse 55% 60% at var(--sx) 100%, rgba(255, 176, 96, .9), rgba(255, 120, 110, .4) 48%, transparent 78%); }
  .s9-stars { position: absolute; inset: 0 0 25% 0; }
  .s9-star { position: absolute; left: var(--x); top: var(--y); width: var(--z); height: var(--z); border-radius: 50%; background: #fff; box-shadow: 0 0 6px rgba(255, 255, 255, .85);
    opacity: .3; animation: s9Tw var(--d) ease-in-out var(--dl) infinite alternate; }
  @keyframes s9Tw { to { opacity: 1; transform: scale(1.6); } }
  .s9-shoot { position: absolute; left: var(--x); top: var(--y); width: 120px; height: 2px; border-radius: 2px; opacity: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), #fff); animation: s9Shoot 1.3s ease-out forwards; }
  @keyframes s9Shoot { 0% { opacity: 0; transform: translate(0, 0) rotate(24deg); } 12% { opacity: 1; } 100% { opacity: 0; transform: translate(340px, 150px) rotate(24deg); } }

  .s9-moon { position: absolute; left: var(--mx); top: 9vh; width: clamp(54px, 7.5vw, 104px); aspect-ratio: 1; border-radius: 50%;
    background: radial-gradient(circle at 36% 34%, #fffdf2, #fdf1c6 58%, #e8d492);
    box-shadow: 0 0 40px 12px rgba(255, 244, 200, .35), 0 0 130px 46px rgba(190, 205, 255, .2); animation: s9Moon 7s ease-in-out infinite alternate; }
  .s9-moon::before, .s9-moon::after { content: ""; position: absolute; border-radius: 50%; background: rgba(205, 180, 110, .35); }
  .s9-moon::before { width: 22%; height: 22%; left: 52%; top: 22%; } .s9-moon::after { width: 14%; height: 14%; left: 26%; top: 58%; }
  @keyframes s9Moon { to { box-shadow: 0 0 56px 18px rgba(255, 244, 200, .45), 0 0 150px 56px rgba(190, 205, 255, .26); } }

  .s9-sun { position: absolute; left: var(--sx); top: 34vh; width: clamp(90px, 14vw, 170px); aspect-ratio: 1; translate: -50% -50%; border-radius: 50%;
    background: radial-gradient(circle at 50% 40%, #fffbe6, #ffd76a 48%, #ff8a3c);
    box-shadow: 0 0 70px 30px rgba(255, 170, 100, .6), 0 0 190px 80px rgba(255, 120, 100, .32);
    transition: top 15s cubic-bezier(.45,.05,.55,.95), filter 15s ease; }
  .s9.sunset .s9-sun { top: calc(var(--hz) + 3.5vh); filter: hue-rotate(-12deg) saturate(1.2); }

  .s9-cloud { position: absolute; top: var(--y); left: -34vw; width: var(--w); opacity: var(--o, .8); animation: s9Cloud var(--d) linear var(--dl) infinite; }
  .s9-cloud svg { display: block; width: 100%; height: auto; }
  @keyframes s9Cloud { to { translate: 150vw 0; } }
  .s9-bird { position: absolute; top: var(--y); left: -10vw; animation: s9Bird var(--d) linear var(--dl) infinite; }
  @keyframes s9Bird { 0% { translate: 0 0; } 50% { translate: 60vw -5vh; } 100% { translate: 120vw 3vh; } }
  .s9-bird path { transform-origin: 50% 50%; animation: s9Flap .5s ease-in-out infinite alternate; }
  @keyframes s9Flap { to { transform: scaleY(.45); } }

  /* ---------- sea (faded blue) ---------- */
  .s9-sea { position: absolute; left: 0; right: 0; top: var(--hz); bottom: calc(var(--sand) - 9vh); z-index: 1; overflow: hidden; pointer-events: none;
    background: linear-gradient(#f4b574 0%, #d99a9c 6%, #9a9ccb 18%, #6a92cc 40%, #4f7dbd 66%, #447fb4 84%, #5fa3c0 100%); }
  .s9-sea::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, rgba(10, 20, 70, .38) 100%); }
  .s9-sea .haze { position: absolute; left: 0; right: 0; top: 0; height: 22%; background: linear-gradient(rgba(255, 190, 120, .55), transparent); }
  .s9-wave { position: absolute; left: 0; right: 0; top: var(--t); height: var(--h); opacity: var(--o); background-repeat: repeat-x; background-position: 0 0; background-size: var(--w) var(--h);
    animation: var(--k) var(--sp) linear infinite, s9Swell var(--sw) ease-in-out var(--dw) infinite alternate; }
  @keyframes s9Swell { to { translate: 0 4px; } }
  .s9-wave.l { background-image: ${WAVE_LIGHT}; } .s9-wave.d { background-image: ${WAVE_DARK}; }
  @keyframes s9WL { to { background-position-x: var(--w); } }
  @keyframes s9WR { to { background-position-x: calc(var(--w) * -1); } }

  .s9-glit { position: absolute; left: var(--sx); top: 0; width: clamp(70px, 13vw, 190px); height: 100%; translate: -50% 0; pointer-events: none;
    background: radial-gradient(ellipse at 50% 0, rgba(255, 216, 140, .95), rgba(255, 170, 110, .38) 52%, transparent 80%);
    -webkit-mask-image: repeating-linear-gradient(0deg, #000 0 4px, transparent 4px 8px); mask-image: repeating-linear-gradient(0deg, #000 0 4px, transparent 4px 8px);
    animation: s9Glit 2.4s ease-in-out infinite alternate; }
  @keyframes s9Glit { from { scale: .75 1; opacity: .8; } to { scale: 1.15 1; opacity: 1; } }
  .s9-mglit { position: absolute; left: var(--mx); top: 0; width: clamp(30px, 5vw, 70px); height: 100%; translate: -50% 0; pointer-events: none;
    background: radial-gradient(ellipse at 50% 0, rgba(240, 246, 255, .8), rgba(200, 220, 255, .28) 55%, transparent 82%);
    -webkit-mask-image: repeating-linear-gradient(0deg, #000 0 3px, transparent 3px 7px); mask-image: repeating-linear-gradient(0deg, #000 0 3px, transparent 3px 7px);
    animation: s9Glit 3.1s ease-in-out infinite alternate; }

  .s9-boat { position: absolute; left: -12vw; top: .6vh; width: clamp(30px, 4.4vw, 56px); animation: s9Boat 160s linear 4s infinite; }
  .s9-boat svg { display: block; width: 100%; height: auto; animation: s9Rock 3s ease-in-out infinite alternate; }
  @keyframes s9Boat { to { translate: 118vw 0; } }
  @keyframes s9Rock { from { rotate: -3deg; } to { rotate: 3deg; } }

  .s9-glint { position: absolute; left: var(--x); top: var(--y); width: var(--z); height: 2px; border-radius: 2px; background: var(--c, #fff); box-shadow: 0 0 5px var(--c, #fff);
    opacity: 0; animation: s9Glint var(--d) ease-in-out var(--dl) infinite; }
  @keyframes s9Glint { 0%, 55%, 100% { opacity: 0; transform: scaleX(.3); } 75% { opacity: 1; transform: scaleX(1); } }
  .s9-swim { position: absolute; left: 0; top: 0; will-change: transform; pointer-events: none; }
  .s9-swim svg { display: block; width: 100%; height: auto; }
  .s9-lantern { position: absolute; bottom: 22vh; left: var(--x); width: var(--w); z-index: 7; pointer-events: none; opacity: 0; animation: s9Lantern var(--d) ease-in var(--dl) infinite; }
  .s9-lantern i { display: block; width: 100%; aspect-ratio: .8; border-radius: 40% 40% 28% 28%; background: radial-gradient(circle at 50% 70%, #fff4b8, #ffb347 60%, #ef7a3a); box-shadow: 0 0 22px 8px rgba(255, 170, 80, .55); }
  @keyframes s9Lantern { 0% { opacity: 0; transform: translate(0, 0); } 10% { opacity: .95; } 55% { transform: translate(var(--dx), -42vh); } 100% { opacity: 0; transform: translate(calc(var(--dx) * 1.6), -88vh); } }
  .s9-pal::after, .s9-girl::after { content: ""; position: absolute; left: 8%; right: 8%; bottom: -4px; height: 9px; border-radius: 50%; background: rgba(60, 35, 55, .4); filter: blur(3px); z-index: -1; }

  /* ---------- the jumping fish ---------- */
  .s9-fx { position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden; }
  .s9-fish { position: absolute; left: 0; top: 0; will-change: transform; filter: drop-shadow(0 3px 4px rgba(10, 20, 60, .35)); }
  .s9-fish svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s9-rip { position: absolute; border: 2px solid rgba(235, 245, 255, .85); border-radius: 50%; will-change: transform, opacity; }
  .s9-drop { position: absolute; border-radius: 50%; background: rgba(240, 248, 255, .95); will-change: transform, opacity; }

  /* ---------- sand ---------- */
  .s9-sand { position: absolute; left: -8%; right: -8%; bottom: 0; height: var(--sand); z-index: 3; pointer-events: none;
    border-radius: 50% 50% 0 0 / 46px 46px 0 0; background: linear-gradient(#7b7fa6 0, #b79a9a 7%, #d4a984 22%, #cfa078 60%, #b8895f 100%); }
  .s9-sand::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 8vh; border-radius: 50% 50% 0 0 / 46px 46px 0 0;
    background: linear-gradient(rgba(70, 90, 160, .55), rgba(120, 110, 150, .25) 60%, transparent); }
  .s9-sand::after { content: ""; position: absolute; inset: 0; border-radius: inherit; opacity: .3;
    background: radial-gradient(circle, rgba(255, 240, 220, .7) 1px, transparent 2px) 0 0 / 22px 22px, radial-gradient(circle, rgba(110, 70, 50, .4) 1px, transparent 2px) 11px 11px / 26px 26px; }
  .s9-foam { position: absolute; left: 0; right: 0; top: -17px; height: 34px; z-index: 1; opacity: .85; background: ${WAVE_FOAM} repeat-x 0 0 / var(--w) 34px; --w: 380px;
    animation: s9WL 10s linear infinite, s9Wash 6s ease-in-out infinite alternate; }
  .s9-foam.two { top: -27px; opacity: .45; --w: 540px; animation: s9WR 15s linear infinite, s9Wash 7.5s ease-in-out -2s infinite alternate; }
  @keyframes s9Wash { from { translate: 0 6px; } to { translate: 0 -9px; } }
  .s9-shell { position: absolute; bottom: var(--b); left: var(--x); font-size: var(--s); rotate: var(--r); filter: drop-shadow(0 3px 3px rgba(60, 40, 60, .4)); }

  /* ---------- palms (swaying in the wind) ---------- */
  .s9-palm { position: absolute; bottom: calc(var(--sand) - 10vh); z-index: 4; pointer-events: none; transform-origin: 50% 100%; animation: s9Palm 5.5s ease-in-out infinite alternate; }
  .s9-palm svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s9-palm.l { left: -1%; width: clamp(110px, 15vw, 240px); } .s9-palm.r { right: -1%; width: clamp(90px, 12vw, 200px); animation-delay: -2.4s; }
  @keyframes s9Palm { from { rotate: -1.6deg; } to { rotate: 2.2deg; } }
  .s9-fronds { transform-box: fill-box; transform-origin: 50% 90%; animation: s9Fronds 3.2s ease-in-out infinite alternate; }
  @keyframes s9Fronds { from { rotate: -2.5deg; } to { rotate: 3deg; } }

  /* ---------- wind: soft air streaks and drifting petals ---------- */
  .s9-wind { position: absolute; inset: 0; z-index: 6; pointer-events: none; overflow: hidden; }
  .s9-gust { position: absolute; top: var(--y); left: -340px; width: var(--w); opacity: 0; animation: s9Gust var(--d) linear var(--dl) infinite; }
  .s9-gust svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s9-gust path { stroke-dasharray: 360; stroke-dashoffset: 360; animation: s9Draw var(--d) linear var(--dl) infinite; }
  @keyframes s9Gust { 0% { opacity: 0; translate: 0 0; } 15% { opacity: .55; } 80% { opacity: .4; } 100% { opacity: 0; translate: calc(100vw + 700px) -30px; } }
  @keyframes s9Draw { 0% { stroke-dashoffset: 360; } 40% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -360; } }
  .s9-petal { position: absolute; left: -30px; top: var(--y); width: var(--s); height: calc(var(--s) * .62); background: var(--c); border-radius: 70% 0 70% 0; opacity: 0;
    animation: s9Petal var(--d) linear var(--dl) infinite; }
  @keyframes s9Petal { 0% { opacity: 0; transform: translate(0, 0) rotate(0); } 8% { opacity: .9; } 50% { transform: translate(55vw, calc(var(--w) * 1px)) rotate(240deg); }
    92% { opacity: .85; } 100% { opacity: 0; transform: translate(112vw, calc(var(--w) * -.6px)) rotate(520deg); } }

  /* ---------- her and her friends ---------- */
  .s9-group { position: absolute; left: 0; right: 0; bottom: 13vh; z-index: 5; display: flex; justify-content: center; align-items: flex-end; pointer-events: none; animation: s9Rise 2s ease 1s backwards; }
  @keyframes s9Rise { from { opacity: 0; transform: translateY(30px); } }
  .s9-pal { position: relative; width: clamp(46px, 9vw, 112px); margin: 0 -5px; filter: drop-shadow(0 6px 8px rgba(40, 20, 70, .5)); animation: s9Bob 3.4s ease-in-out var(--dl, 0s) infinite alternate; }
  .s9-pal svg, .s9-girl svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s9-pal.far { width: clamp(40px, 8vw, 98px); } .s9-pal.lean-l { rotate: 6deg; } .s9-pal.lean-r { rotate: -6deg; }
  @keyframes s9Bob { to { translate: 0 -5px; } }
  .s9-girl { position: relative; width: clamp(54px, 10.6vw, 132px); margin: 0 5px; z-index: 2; animation: s9Bob 4s ease-in-out infinite alternate; }
  .s9-girl::before { content: ""; position: absolute; left: 50%; top: 45%; width: 220%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(255, 180, 110, .3), transparent 62%); }
  .s9-girl svg { position: relative; filter: drop-shadow(0 6px 8px rgba(40, 20, 70, .5)); }
  .s9-girl .hair { transform-box: fill-box; transform-origin: 50% 0; animation: s9Hair 2.6s ease-in-out infinite alternate; }
  .s9-girl .dress { transform-box: fill-box; transform-origin: 50% 0; animation: s9Dress 2.2s ease-in-out infinite alternate; }
  .s9-girl .bow { transform-box: fill-box; transform-origin: 50% 50%; animation: s9Bow .9s ease-in-out infinite alternate; }
  @keyframes s9Hair { from { transform: skewX(-1.5deg) rotate(.6deg); } to { transform: skewX(3.5deg) rotate(-1.4deg); } }
  @keyframes s9Dress { from { transform: skewX(-1deg); } to { transform: skewX(3deg); } }
  @keyframes s9Bow { from { transform: rotate(-6deg) scale(1); } to { transform: rotate(8deg) scale(1.08); } }

  /* ---------- words ---------- */
  .s9-msg { position: absolute; left: 50%; top: 8vh; z-index: 8; width: min(90vw, 640px); translate: -50% 0; text-align: center; pointer-events: none; transition: opacity 1.4s ease; }
  .s9-msg p { margin: 0 0 14px; font: 700 clamp(22px, 3.6vw, 32px) / 1.3 "Dancing Script", "Dancing Local", cursive; color: #fff; text-shadow: 0 2px 14px rgba(20, 20, 80, .85);
    opacity: 0; transform: translateY(12px); transition: opacity 1.2s ease, transform 1.2s ease; }
  .s9-msg p.on { opacity: 1; transform: none; } .s9-msg.out { opacity: 0; }
  .s9-title { position: absolute; left: 0; right: 0; top: 12vh; z-index: 8; padding: 0 16px; text-align: center; pointer-events: none; opacity: 0; transform: scale(.92); transition: opacity 2s ease, transform 2s ease; }
  .s9-title.on { opacity: 1; transform: none; }
  .s9-title h2 { margin: 0; font: 700 clamp(40px, 8vw, 96px) / 1.05 "Dancing Script", "Dancing Local", cursive; color: #fff; text-shadow: 0 0 30px rgba(255, 190, 120, .8), 0 3px 16px rgba(20, 20, 90, .8); }
  .s9-title p { margin: 8px 0 0; font: italic 700 clamp(16px, 2.4vw, 24px) "Playfair Display", "Playfair Local", Georgia, serif; color: #fff4d8; text-shadow: 0 2px 12px rgba(20, 20, 90, .8); }
  .s9-actions { position: absolute; left: 0; right: 0; top: 30vh; z-index: 9; display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; padding: 0 16px; }
  .s9-btn { padding: 13px 22px; border: 0; border-radius: 999px; cursor: pointer; font: 800 clamp(14px, 2.2vh, 17px) / 1 "Nunito", "Nunito Local", sans-serif; color: #5b2a4e;
    background: rgba(255, 250, 240, .95); box-shadow: 0 6px 0 rgba(90, 60, 110, .4), 0 0 24px rgba(255, 220, 160, .4); animation: s9Pop .8s cubic-bezier(.3, 1.6, .5, 1) backwards; -webkit-tap-highlight-color: transparent; }
  .s9-btn:nth-child(2) { animation-delay: .15s; } .s9-btn:nth-child(3) { animation-delay: .3s; }
  .s9-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(90, 60, 110, .4); }
  @keyframes s9Pop { from { opacity: 0; transform: translateY(20px) scale(.7); } }
  .s9-again { position: absolute; left: 50%; bottom: calc(3.2vh + env(safe-area-inset-bottom, 0px)); z-index: 10; translate: -50% 0; padding: 15px 30px; border: 0; border-radius: 999px; cursor: pointer; white-space: nowrap;
    color: #5b2a4e; font: 900 clamp(16px, 2.4vh, 19px) "Nunito", "Nunito Local", sans-serif; letter-spacing: .3px; background: linear-gradient(#fffbe9, #ffe3a6);
    box-shadow: 0 6px 0 rgba(150, 90, 60, .55), 0 0 0 4px rgba(255, 255, 255, .55), 0 0 34px 8px rgba(255, 214, 140, .8); animation: s9Pop .9s cubic-bezier(.3, 1.6, .5, 1) backwards, s9Beckon 1.8s ease-in-out 1s infinite; -webkit-tap-highlight-color: transparent; }
  .s9-again:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(150, 90, 60, .55), 0 0 30px 6px rgba(255, 214, 140, .8); }
  @keyframes s9Beckon { 0%, 100% { scale: 1; box-shadow: 0 6px 0 rgba(150, 90, 60, .55), 0 0 0 4px rgba(255, 255, 255, .55), 0 0 30px 6px rgba(255, 214, 140, .7); }
    50% { scale: 1.07; box-shadow: 0 6px 0 rgba(150, 90, 60, .55), 0 0 0 9px rgba(255, 255, 255, .3), 0 0 50px 16px rgba(255, 214, 140, 1); } }

  /* ---------- the golden door ---------- */
  .s9-doorscene { position: absolute; inset: 0; z-index: 20; background: radial-gradient(ellipse at 50% 60%, #2a1a52, #0c0828 70%); transition: opacity 1.8s ease; }
  .s9-doorscene.gone { opacity: 0; pointer-events: none; }
  .s9-frame { position: absolute; left: 50%; bottom: 14vh; width: min(52vw, 40vh, 300px); aspect-ratio: 3 / 5; translate: -50% 0; perspective: 1000px;
    border: 10px solid #e8b84a; border-bottom: 0; border-radius: 120px 120px 0 0; background: radial-gradient(circle at 50% 60%, #fff6c8, #ffd76a 50%, #ffb347);
    box-shadow: 0 0 60px 10px rgba(255, 200, 90, .35); animation: s9DoorIn 1.4s ease backwards; }
  @keyframes s9DoorIn { from { opacity: 0; transform: translateY(40px) scale(.95); } }
  .s9-leaf { position: absolute; top: 0; bottom: 0; width: 50%; transition: transform 1.8s cubic-bezier(.5, 0, .2, 1);
    background: linear-gradient(90deg, #6b3a2a, #8c5238 50%, #6b3a2a); box-shadow: inset 0 0 0 6px rgba(232, 184, 74, .55); }
  .s9-leaf.l { left: 0; transform-origin: 0 50%; border-radius: 110px 0 0 0; } .s9-leaf.r { right: 0; transform-origin: 100% 50%; border-radius: 0 110px 0 0; }
  .s9-leaf::before { content: ""; position: absolute; inset: 16% 14% 40% 14%; border: 4px solid rgba(232, 184, 74, .6); border-radius: 60px 60px 0 0; }
  .s9-leaf::after { content: ""; position: absolute; top: 56%; width: 12px; height: 12px; border-radius: 50%; background: #ffd76a; box-shadow: 0 0 8px #ffd76a; }
  .s9-leaf.l::after { right: 12%; } .s9-leaf.r::after { left: 12%; }
  .s9-door.open .s9-leaf.l { transform: rotateY(-105deg); } .s9-door.open .s9-leaf.r { transform: rotateY(105deg); }
  .s9-keyhole { position: absolute; left: 50%; top: 56%; z-index: 3; width: 22px; height: 38px; translate: -50% -50%; pointer-events: none; transition: opacity .5s;
    background: radial-gradient(circle at 50% 28%, #ffe9a0 0 9px, transparent 10px), linear-gradient(#ffe9a0, #ffe9a0) 50% 70% / 7px 22px no-repeat; filter: drop-shadow(0 0 8px #ffd76a); }
  .s9-door.open .s9-keyhole { opacity: 0; }
  .s9-door.shake .s9-frame { animation: s9Shake .5s ease; }
  @keyframes s9Shake { 20% { translate: calc(-50% - 6px) 0; } 40% { translate: calc(-50% + 6px) 0; } 60% { translate: calc(-50% - 4px) 0; } 80% { translate: calc(-50% + 3px) 0; } }
  .s9-flood { position: absolute; left: 50%; top: 56%; z-index: 30; width: 40px; height: 40px; translate: -50% -50%; border-radius: 50%; pointer-events: none; opacity: 0;
    background: radial-gradient(circle, #fffbe6, #ffe6a0 60%, rgba(255, 220, 130, 0) 75%); transition: transform 1.6s ease-in, opacity .8s ease; }
  .s9-flood.go { opacity: 1; transform: scale(80); }

  /* ---------- keepsake windows ---------- */
  .s9-modal { position: absolute; inset: 0; z-index: 40; display: grid; place-items: center; padding: 16px; background: rgba(10, 12, 40, .6); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); animation: s9Fade .4s ease; }
  @keyframes s9Fade { from { opacity: 0; } }
  .s9-paper { position: relative; width: min(94vw, 460px); max-height: 88vh; overflow-y: auto; padding: 22px 20px 20px; border: 3px solid #f2d27a; border-radius: 20px; text-align: center;
    background: linear-gradient(#fffaf2, #ffeef6); color: #5b2a4e; box-shadow: 0 24px 70px rgba(0, 0, 0, .55); animation: s9Pop .6s cubic-bezier(.3, 1.4, .5, 1); }
  .s9-paper h3 { margin: 0 0 10px; color: #e0587f; font: 700 clamp(28px, 5vw, 38px) / 1.05 "Dancing Script", "Dancing Local", cursive; }
  .s9-paper .txt { margin: 0 0 12px; font: 600 clamp(22px, 3.6vw, 27px) / 1.3 "Dancing Script", "Dancing Local", cursive; }
  .s9-paper .small { margin: 0 0 12px; font-weight: 700; font-size: 14px; color: #7a3a58; }
  .s9-close { margin-top: 6px; padding: 11px 26px; border: 0; border-radius: 999px; cursor: pointer; color: #fff9f3; font: 800 15px "Nunito", sans-serif;
    background: linear-gradient(110deg, #f6a2ae, #df5279 55%, #b63d68); box-shadow: 0 5px 0 #792c4c; }
  .s9-list { display: grid; gap: 10px; margin-bottom: 8px; }
  .s9-list button { padding: 13px 14px; border: 2px dashed #e8b4cc; border-radius: 14px; background: #fff; color: #7a3a58; font: 800 15px "Nunito", sans-serif; cursor: pointer; }
  .s9-list button.read { border-style: solid; background: #fff4f8; }
  .s9-voice { display: flex; align-items: center; gap: 12px; justify-content: center; margin: 6px 0 12px; }
  .s9-voice button { width: 60px; height: 60px; border: 0; border-radius: 50%; cursor: pointer; font-size: 24px; color: #fff; background: linear-gradient(110deg, #f6a2ae, #df5279); box-shadow: 0 5px 0 #792c4c; }
  .s9-bar { flex: 1; max-width: 240px; height: 8px; border-radius: 4px; background: rgba(91, 42, 78, .15); overflow: hidden; }
  .s9-bar i { display: block; width: 0; height: 100%; background: linear-gradient(90deg, #ff8fb3, #b49af2); }
  .s9-card-prev { display: block; width: min(100%, 300px); margin: 0 auto 12px; border-radius: 12px; box-shadow: 0 10px 24px rgba(120, 60, 100, .35); }

  @media (max-width: 680px) {
    .s9 { --hz: 44vh; --sand: 30vh; --sx: 64%; --mx: 13%; }
    .s9-moon { top: 6vh; width: 50px; }
    .s9-actions { top: 29vh; } .s9-title { top: 11vh; }
    .s9-pal { margin: 0 -7px; }
    .s9-palm.l { width: 96px; } .s9-palm.r { width: 80px; }
  }
  @media (max-height: 560px) { .s9-title h2 { font-size: 36px; } .s9-actions { top: 27vh; } .s9-msg { top: 4vh; } }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- art ---------------- */

  const cloudSvg = (tint) => `<svg viewBox="0 0 300 70"><g fill="${tint}"><ellipse cx="150" cy="52" rx="140" ry="13"/><ellipse cx="98" cy="40" rx="62" ry="16"/><ellipse cx="195" cy="36" rx="72" ry="19"/><ellipse cx="140" cy="30" rx="40" ry="14"/></g></svg>`;
  const birdSvg = '<svg viewBox="0 0 30 14" width="24"><path d="M1 12Q8 0 15 10Q22 0 29 12" fill="none" stroke="#2c2050" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const boatSvg = '<svg viewBox="0 0 60 56"><path d="M30 2v36" stroke="#2a2050" stroke-width="2"/><path d="M32 4q18 14 20 32H32z" fill="#3a2d68"/><path d="M28 10Q14 22 10 36h18z" fill="#4a3a7a"/><path d="M4 40h52l-8 12H12z" fill="#2a2050"/></svg>';

  const palmSvg = (() => {
    const leaf = "M0 0C26-34 84-34 128 16C88-6 42-2 0 8Z";
    const fronds = [-172, -146, -118, -88, -58, -30, -6, 20].map((a, i) =>
      `<g transform="translate(112 72) rotate(${a}) scale(${i % 2 ? 0.92 : 1.05})"><path d="${leaf}" fill="${i % 2 ? "#0f1140" : "#171858"}"/></g>`).join("");
    return `<svg viewBox="-20 0 280 420" aria-hidden="true">
      <path d="M96 420C102 310 126 200 110 74L124 74C140 200 120 312 128 420Z" fill="#0d0f38"/>
      <path d="M100 330q14-6 26 0M102 270q14-6 24 0M106 210q12-6 22 0M108 150q10-6 18 0" stroke="#1d1f60" stroke-width="2.4" fill="none"/>
      <g class="s9-fronds">${fronds}<circle cx="108" cy="82" r="7" fill="#1a1450"/><circle cx="122" cy="84" r="7" fill="#1a1450"/></g></svg>`;
  })();

  // the girl from behind, looking out at the sea (hair, dress and bow move in the wind)
  const girlSvg = `<svg viewBox="0 0 100 175" aria-hidden="true">
    <rect x="38" y="152" width="8" height="14" rx="4" fill="#f0c8b0"/><rect x="54" y="152" width="8" height="14" rx="4" fill="#f0c8b0"/>
    <ellipse cx="42" cy="168" rx="9" ry="4.5" fill="#7a4a6a"/><ellipse cx="58" cy="168" rx="9" ry="4.5" fill="#7a4a6a"/>
    <g class="dress"><path d="M33 100h34l11 54H22z" fill="#f7a8c8"/><path d="M33 100h34l3 12H30z" fill="#ff8fb3"/></g>
    <path d="M34 106L21 142" stroke="#f0c8b0" stroke-width="9" stroke-linecap="round"/><path d="M66 106l13 36" stroke="#f0c8b0" stroke-width="9" stroke-linecap="round"/>
    <g class="hair"><path d="M24 42C24 16 40 8 50 8s26 8 26 34c0 22 9 40 4 64-8 8-26 10-30 10s-22-2-30-10c-5-24 4-42 4-64z" fill="#3a2438"/>
    <path d="M34 22q12-10 26-2" stroke="#7a5076" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M42 60q-4 24-2 40M58 60q4 24 2 40" stroke="#4d3050" stroke-width="2" fill="none" opacity=".6"/></g>
    <g class="bow"><g fill="#ff8fb3"><path d="M68 22l12-8v16z"/><path d="M68 22l-10-8v16z"/></g><circle cx="68" cy="22" r="4" fill="#ff5c8d"/></g>
  </svg>`;

  // fish that jump out of the water (they all face right; the script flips them when needed)
  const fishSvg = (body, belly, fin) => `<svg viewBox="0 0 64 32"><path d="M16 16L1 4Q7 16 1 28Z" fill="${fin}"/><ellipse cx="38" cy="16" rx="25" ry="11.5" fill="${body}"/>
    <path d="M18 18q20 12 42-3q-8 12-24 12q-14 0-18-9z" fill="${belly}"/><path d="M28 5Q38-4 48 6Q38 8 28 5Z" fill="${fin}"/>
    <path d="M46 8q4 8 0 16" stroke="rgba(255,255,255,.45)" stroke-width="2" fill="none"/>
    <circle cx="52" cy="13" r="3.2" fill="#fff"/><circle cx="53" cy="13" r="1.7" fill="#1d1230"/></svg>`;
  const dolphinSvg = `<svg viewBox="0 0 140 70"><path d="M138 36C132 32 124 32 116 28C102 14 74 8 50 18C34 25 20 40 8 56C16 52 22 50 28 52C26 58 22 64 18 68C30 64 40 58 48 54C70 48 100 56 120 46C128 42 134 40 138 36Z" fill="#6f88bc"/>
    <path d="M138 36C128 43 118 48 100 52C80 56 64 50 48 54C70 44 100 46 124 38Z" fill="#e3ebfa"/><path d="M82 12C86 0 98 2 102 9C96 8 90 10 82 12Z" fill="#5a73a8"/>
    <circle cx="122" cy="32" r="2.3" fill="#1d1230"/></svg>`;
  const FISH = [
    () => fishSvg("#ff9a52", "#ffd9ae", "#ff7a3a"), () => fishSvg("#58b8ff", "#cfeaff", "#2f78d8"),
    () => fishSvg("#ff7fb0", "#ffd1e2", "#f0508a"), () => fishSvg("#cfd9f0", "#ffffff", "#8fa3d4"), () => fishSvg("#ffd35a", "#fff1b8", "#f2a62a")
  ];

  /* ---------------- build ---------------- */

  screen.innerHTML = `
    <div class="s9-sky" id="s9Sky" aria-hidden="true">
      <div class="hglow"></div><div class="s9-stars" id="s9Stars"></div>
      <div class="s9-moon"></div><div class="s9-sun"></div>
    </div>
    <div class="s9-sea" id="s9Sea" aria-hidden="true"><div class="haze"></div><div class="s9-glit"></div><div class="s9-mglit"></div><div class="s9-boat">${boatSvg}</div></div>
    <div class="s9-fx" id="s9Fx" aria-hidden="true"></div>
    <div class="s9-sand" id="s9Sand" aria-hidden="true"></div>
    <div class="s9-palm l" aria-hidden="true">${palmSvg}</div>
    <div class="s9-palm r" aria-hidden="true">${palmSvg}</div>
    <div class="s9-group" id="s9Group" aria-hidden="true"></div>
    <div class="s9-wind" id="s9Wind" aria-hidden="true"></div>

    <div class="s9-msg" id="s9Msg" aria-live="polite"></div>
    <div class="s9-title" id="s9Title"><h2>${TITLE}</h2><p>${SIGN}</p></div>
    <div class="s9-actions" id="s9Actions" hidden></div>
    <button type="button" class="s9-again" id="s9Again" hidden>\u2728 Close the curtain \u2661</button>

    <div class="s9-doorscene" id="s9DoorScene">
      <div class="s9-door" id="s9Door"><div class="s9-frame"><div class="s9-leaf l"></div><div class="s9-leaf r"></div><span class="s9-keyhole"></span></div></div>
      <span class="s9-flood" id="s9Flood"></span>
    </div>`;

  const $ = (id) => document.getElementById(id);
  const doorScene = $("s9DoorScene"), door = $("s9Door"), flood = $("s9Flood");
  const msg = $("s9Msg"), titleEl = $("s9Title"), actions = $("s9Actions"), again = $("s9Again");
  const sky = $("s9Sky"), sea = $("s9Sea"), sand = $("s9Sand"), group = $("s9Group"), fx = $("s9Fx"), wind = $("s9Wind");

  // stars
  const stars = $("s9Stars");
  for (let i = 0; i < (window.innerWidth < 600 ? 55 : 110); i++) {
    const s = document.createElement("span");
    s.className = "s9-star";
    s.style.setProperty("--x", `${rand(0, 100).toFixed(1)}%`);
    s.style.setProperty("--y", `${(Math.pow(Math.random(), 1.3) * 100).toFixed(1)}%`);
    s.style.setProperty("--z", `${rand(1, 3.2).toFixed(1)}px`);
    s.style.setProperty("--d", `${rand(2, 6).toFixed(1)}s`);
    s.style.setProperty("--dl", `${(-rand(0, 6)).toFixed(1)}s`);
    stars.appendChild(s);
  }

  // dusky clouds and birds
  [["10%", "300px", "120s", "-40s", "rgba(255,160,150,.55)", .8], ["24%", "220px", "150s", "-90s", "rgba(150,110,190,.55)", .7], ["4%", "180px", "180s", "-130s", "rgba(120,100,190,.5)", .6], ["34%", "260px", "170s", "-60s", "rgba(255,190,140,.5)", .7]].forEach(([y, w, d, dl, tint, o]) => {
    const c = document.createElement("div");
    c.className = "s9-cloud";
    c.style.cssText = `--y:${y};--w:${w};--d:${d};--dl:${dl};--o:${o}`;
    c.innerHTML = cloudSvg(tint);
    sky.appendChild(c);
  });
  [["34%", "26s", "5s"], ["30%", "30s", "11s"], ["38%", "28s", "17s"]].forEach(([y, d, dl]) => {
    const b = document.createElement("div");
    b.className = "s9-bird";
    b.style.cssText = `--y:${y};--d:${d};--dl:${dl}`;
    b.innerHTML = birdSvg;
    sky.appendChild(b);
  });

  // layers of waves: tiny near the horizon, bigger near the shore
  // [top %, height px, width px, opacity, speed s, direction, light/dark]
  [[3, 8, 110, .55, 30, "s9WL", "l"], [11, 12, 160, .45, 26, "s9WR", "d"], [20, 16, 220, .55, 22, "s9WL", "l"], [31, 22, 300, .40, 19, "s9WR", "d"],
   [43, 28, 400, .55, 16, "s9WL", "l"], [56, 34, 520, .38, 14, "s9WR", "d"], [70, 40, 640, .5, 12, "s9WL", "l"], [84, 46, 780, .36, 10, "s9WR", "d"]].forEach(([t, h, w, o, sp, k, tone]) => {
    const wv = document.createElement("div");
    wv.className = `s9-wave ${tone}`;
    wv.style.cssText = `--t:${t}%;--h:${h}px;--w:${w}px;--o:${o};--sp:${sp}s;--k:${k};--sw:${(3 + Math.random() * 3).toFixed(1)}s;--dw:${(-Math.random() * 5).toFixed(1)}s`;
    sea.appendChild(wv);
  });

  // foam rolling onto the sand, a few shells
  ["", "two"].forEach((cls) => { const f = document.createElement("div"); f.className = `s9-foam ${cls}`; sand.appendChild(f); });
  [["🐚", "10%", "4vh", "20px", "-20deg"], ["🐚", "86%", "6vh", "18px", "28deg"], ["⭐", "24%", "2vh", "18px", "12deg"]].forEach(([e, x, b, s, r]) => {
    const sh = document.createElement("span");
    sh.className = "s9-shell";
    sh.textContent = e;
    sh.style.cssText = `--x:${x};--b:${b};--s:${s};--r:${r}`;
    sand.appendChild(sh);
  });

  // glints: tiny sparkles on the water, thick in the sun's and the moon's path
  const sunX = () => parseFloat(getComputedStyle(screen).getPropertyValue("--sx")) || 68;
  const moonX = () => parseFloat(getComputedStyle(screen).getPropertyValue("--mx")) || 15;
  for (let i = 0; i < (window.innerWidth < 600 ? 50 : 100); i++) {
    const g = document.createElement("span");
    g.className = "s9-glint";
    const r = Math.random();
    const x = r < 0.45 ? sunX() + rand(-7, 7) : r < 0.62 ? moonX() + rand(-3, 3) : rand(0, 100);
    const warm = r < 0.45;
    g.style.cssText = `--x:${x.toFixed(1)}%;--y:${rand(2, 96).toFixed(1)}%;--z:${rand(5, 16).toFixed(0)}px;--d:${rand(1.6, 4).toFixed(1)}s;--dl:${(-rand(0, 4)).toFixed(1)}s;--c:${warm ? "#ffe3a0" : "#ffffff"}`;
    sea.appendChild(g);
  }

  // sky lanterns drifting up from the beach
  for (let i = 0; i < 5; i++) {
    const l = document.createElement("div");
    l.className = "s9-lantern";
    l.style.cssText = `--x:${rand(12, 88).toFixed(0)}%;--w:${rand(16, 26).toFixed(0)}px;--dx:${rand(-60, 60).toFixed(0)}px;--d:${rand(16, 24).toFixed(0)}s;--dl:${(6 + i * 4.5).toFixed(1)}s`;
    l.innerHTML = "<i></i>";
    screen.appendChild(l);
  }

  // wind: soft curling streaks and petals blowing across
  const gustPath = '<svg viewBox="0 0 300 40"><path d="M0 22C50 22 90 14 130 22C160 28 172 8 152 8C134 8 134 28 164 28C214 28 254 20 300 22" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-linecap="round"/></svg>';
  for (let i = 0; i < 7; i++) {
    const g = document.createElement("div");
    g.className = "s9-gust";
    g.style.cssText = `--y:${rand(6, 62).toFixed(0)}%;--w:${rand(170, 320).toFixed(0)}px;--d:${rand(7, 12).toFixed(1)}s;--dl:${(-rand(0, 12)).toFixed(1)}s`;
    g.innerHTML = gustPath;
    wind.appendChild(g);
  }
  const petalColors = ["#ffb3c9", "#ffd1e0", "#ffe3b0", "#ffc0d6"];
  for (let i = 0; i < (window.innerWidth < 600 ? 9 : 16); i++) {
    const p = document.createElement("span");
    p.className = "s9-petal";
    p.style.cssText = `--y:${rand(20, 80).toFixed(0)}%;--s:${rand(8, 15).toFixed(0)}px;--c:${pick(petalColors)};--d:${rand(11, 20).toFixed(1)}s;--dl:${(-rand(0, 20)).toFixed(1)}s;--w:${rand(-90, 90).toFixed(0)}`;
    wind.appendChild(p);
  }

  // her friends beside her
  const mates = window.Mates;
  const lineup = [["panda", "far", ""], ["bunny", "", "lean-l"], ["bear", "", "lean-l"], ["GIRL"], ["cat", "", "lean-r"], ["puppy", "", "lean-r"], ["bunny", "far", ""]];
  lineup.forEach((item, i) => {
    const el = document.createElement("div");
    if (item[0] === "GIRL") {
      el.className = "s9-girl";
      el.innerHTML = girlSvg;
    } else {
      el.className = `s9-pal ${item[1]} ${item[2]}`;
      el.style.setProperty("--dl", `${(-i * 0.6).toFixed(1)}s`);
      if (mates) el.innerHTML = mates.svg(item[0], i % 2 === 0, "happy");
    }
    group.appendChild(el);
  });

  /* ---------------- fish jumping out of the sea ---------------- */

  let fishOn = false;

  function splash(x, y, scale) {
    const rip = document.createElement("div");
    rip.className = "s9-rip";
    const w = 46 * scale, h = 13 * scale;
    rip.style.cssText = `left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px`;
    fx.appendChild(rip);
    rip.animate([{ transform: "scale(.3)", opacity: .9 }, { transform: "scale(2.6)", opacity: 0 }], { duration: 1100, easing: "ease-out" }).onfinish = () => rip.remove();

    for (let i = 0; i < 7; i++) {
      const d = document.createElement("div");
      d.className = "s9-drop";
      const sz = rand(2.5, 5) * scale;
      d.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px`;
      fx.appendChild(d);
      const dx = rand(-34, 34) * scale, up = rand(16, 42) * scale;
      d.animate([
        { transform: "translate(0,0)", opacity: 1 },
        { transform: `translate(${dx * 0.6}px,${-up}px)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${dx}px,${rand(2, 8)}px)`, opacity: 0 }
      ], { duration: rand(650, 950), easing: "ease-in-out" }).onfinish = () => d.remove();
    }
  }

  function jumpFish(forceDolphin) {
    const box = screen.getBoundingClientRect();
    const seaTop = sea.getBoundingClientRect().top - box.top;
    const sandTop = sand.getBoundingClientRect().top - box.top;
    const span = Math.max(40, sandTop - seaTop);

    const depth = rand(0.22, 0.86);                        // 0 = far (horizon), 1 = near the shore
    const y0 = seaTop + span * depth;
    const scale = 0.55 + depth * 0.95;
    const dolphin = forceDolphin || (Math.random() < 0.16 && depth > 0.4);
    const baseW = dolphin ? 96 : 54;
    const w = baseW * scale, h = w * (dolphin ? 0.5 : 0.5);

    // avoid landing straight behind the middle of the group most of the time
    let x0 = rand(0.06, 0.94) * box.width;
    if (Math.abs(x0 - box.width / 2) < box.width * 0.12 && Math.random() < 0.8) x0 = pick([rand(0.08, 0.38), rand(0.62, 0.92)]) * box.width;

    const dir = Math.random() < 0.5 ? -1 : 1;
    const dx = dir * rand(70, 150) * scale;
    const height = rand(48, 100) * (0.6 + depth * 0.7) * (dolphin ? 1.25 : 1);
    const dur = rand(1300, 1900) * (dolphin ? 1.2 : 1);

    const el = document.createElement("div");
    el.className = "s9-fish";
    el.style.width = `${w}px`;
    el.innerHTML = dolphin ? dolphinSvg : pick(FISH)();
    fx.appendChild(el);

    const frames = [], N = 18;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const px = x0 + dx * t - w / 2;
      const py = y0 - 4 * height * t * (1 - t) - h / 2;
      const vy = -4 * height * (1 - 2 * t);
      const ang = Math.atan2(vy, Math.abs(dx)) * 180 / Math.PI;
      frames.push({ transform: `translate(${px}px, ${py}px) rotate(${ang}deg) scaleX(${dir})`, opacity: i === 0 || i === N ? 0 : 1, offset: t });
    }
    el.animate(frames, { duration: dur, easing: "linear" }).onfinish = () => el.remove();

    splash(x0, y0, scale);
    window.setTimeout(() => splash(x0 + dx, y0, scale), dur * 0.94);
    if (Math.random() < 0.42) window.setTimeout(() => jumpFish(false), rand(250, 650));   // sometimes a friend follows
  }

  // shoals of small fish swimming just under the surface
  const swimSvg = (c) => `<svg viewBox="0 0 40 16"><path d="M10 8L1 1Q4 8 1 15Z" fill="${c}"/><ellipse cx="24" cy="8" rx="15" ry="6" fill="${c}"/></svg>`;
  function school() {
    const box = screen.getBoundingClientRect();
    const seaTop = sea.getBoundingClientRect().top - box.top;
    const sandTop = sand.getBoundingClientRect().top - box.top;
    const depth = rand(0.18, 0.8), y = seaTop + (sandTop - seaTop) * depth, scale = 0.5 + depth * 0.9;
    const dir = Math.random() < 0.5 ? 1 : -1, n = Math.round(rand(5, 9));
    const dur = rand(16000, 26000), x0 = dir === 1 ? -80 : box.width + 80, x1 = dir === 1 ? box.width + 80 : -80;
    const col = pick(["rgba(255,200,150,.55)", "rgba(190,215,255,.55)", "rgba(255,170,190,.5)"]);
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "s9-swim";
      const w = rand(16, 26) * scale;
      el.style.width = `${w}px`;
      el.innerHTML = swimSvg(col);
      fx.appendChild(el);
      const oy = y + rand(-14, 14) * scale, ox = rand(-40, 40);
      const frames = [];
      for (let k = 0; k <= 12; k++) {
        const t = k / 12;
        frames.push({ transform: `translate(${x0 + (x1 - x0) * t + ox}px, ${oy + Math.sin(t * 9 + i) * 7 * scale}px) scaleX(${dir})`, opacity: k === 0 || k === 12 ? 0 : 1, offset: t });
      }
      el.animate(frames, { duration: dur, easing: "linear", delay: rand(0, 1800) }).onfinish = () => el.remove();
    }
  }
  function schoolLoop() {
    if (!fishOn) return;
    if (!document.hidden) school();
    window.setTimeout(schoolLoop, rand(5500, 9000));
  }

  function fishLoop() {
    if (!fishOn) return;
    if (!document.hidden) jumpFish(false);
    window.setTimeout(fishLoop, rand(1300, 2700));
  }

  /* ---------------- shooting stars ---------------- */

  function shootingStar() {
    if (!fishOn) return;
    if (!document.hidden) {
      const s = document.createElement("span");
      s.className = "s9-shoot";
      s.style.setProperty("--x", `${rand(8, 55).toFixed(0)}%`);
      s.style.setProperty("--y", `${rand(4, 22).toFixed(0)}%`);
      sky.appendChild(s);
      window.setTimeout(() => s.remove(), 1500);
    }
    window.setTimeout(shootingStar, rand(7000, 13000));
  }

  /* ---------------- the sequence ---------------- */

  let started = false;
  const later = (fn, ms) => window.setTimeout(fn, ms);

  function revealScene() {
    screen.classList.add("sunset");                // the sun sinks towards the sea
    fishOn = true;
    later(fishLoop, 2500);
    later(schoolLoop, 800);
    later(school, 300);
    later(shootingStar, 6000);
  }

  function begin() {
    if (started) return;
    started = true;

    if (PREVIEW) {
      doorScene.remove();
      revealScene();
      MESSAGE.forEach((line, i) => {
        const p = document.createElement("p");
        p.textContent = line;
        msg.appendChild(p);
        later(() => p.classList.add("on"), 1500 + i * 3000);
      });
      const afterP = 1500 + MESSAGE.length * 3000 + 2500;
      later(() => msg.classList.add("out"), afterP);
      later(() => titleEl.classList.add("on"), afterP + 1500);
      later(showActions, afterP + 4000);
      return;
    }

    later(() => door.classList.add("shake"), 1500);                        // the key turns: click
    later(() => door.classList.add("open"), 2200);                         // the door swings open
    later(() => flood.classList.add("go"), 3500);                          // the light floods in
    later(revealScene, 4300);                                              // the beach appears
    later(() => doorScene.classList.add("gone"), 4800);
    later(() => doorScene.remove(), 7000);

    // your message, one line at a time
    MESSAGE.forEach((line, i) => {
      const p = document.createElement("p");
      p.textContent = line;
      msg.appendChild(p);
      later(() => p.classList.add("on"), 7800 + i * 3600);
    });

    const after = 7800 + MESSAGE.length * 3600 + 3200;
    later(() => msg.classList.add("out"), after);
    later(() => titleEl.classList.add("on"), after + 1600);
    later(showActions, after + 4200);
  }

  screen.addEventListener("screen:enter", begin);
  if (!screen.hidden) begin();

  // for testing the jump from the console:  window.__jumpFish(true)  (true = dolphin)
  window.__jumpFish = jumpFish; window.__school = school;

  /* ---------------- keepsakes ---------------- */

  function modal(html) {
    const m = document.createElement("div");
    m.className = "s9-modal";
    m.innerHTML = `<div class="s9-paper">${html}<button type="button" class="s9-close">Close</button></div>`;
    const close = () => { m.remove(); if (window.Music && window.Music.duck) window.Music.duck(false); };
    m.querySelector(".s9-close").addEventListener("click", close);
    m.addEventListener("click", (e) => { if (e.target === m) close(); });
    screen.appendChild(m);
    return { m, close };
  }

  function showActions() {
    if (!actions.hidden) return;
    const items = [["🎀  A wish for you", voiceNote], ["💌  Open when…", openWhen], ["🖼️  Save your card", keepsake]];
    actions.hidden = false;
    items.forEach(([label, fn]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "s9-btn";
      b.textContent = label;
      b.addEventListener("click", fn);
      actions.appendChild(b);
    });
    again.hidden = false;
    again.addEventListener("click", goodbye);
    later(autoGoodbye, 60000);
  }

  // 1. a little spoken wish: plays assets/audio/voice.mp3 if you add one,
  //    otherwise the phone reads the wish aloud in a soft, high, cheerful voice
  function voiceNote() {
    const { m } = modal(`<h3>A little wish</h3><p class="small" id="s9VoiceHint">Press play ♡</p>
      <div class="s9-voice"><button type="button" id="s9Play" aria-label="Play">▶</button><div class="s9-bar"><i id="s9Fill"></i></div></div>`);
    const play = m.querySelector("#s9Play"), fill = m.querySelector("#s9Fill"), hint = m.querySelector("#s9VoiceHint");
    const duck = (on) => { if (window.Music && window.Music.duck) window.Music.duck(on, 0.05); };
    const synth = window.speechSynthesis;
    let mode = "audio", playing = false;
    const audio = new Audio(VOICE);
    const stop = () => { try { audio.pause(); } catch (e) {} if (synth) synth.cancel(); playing = false; play.textContent = "▶"; fill.style.width = "0%"; duck(false); };
    const done = () => { playing = false; play.textContent = "▶"; fill.style.width = "100%"; duck(false); };
    audio.addEventListener("error", () => { mode = synth && window.SpeechSynthesisUtterance ? "tts" : "none"; });
    audio.addEventListener("timeupdate", () => { fill.style.width = `${Math.min(100, (audio.currentTime / (audio.duration || 1)) * 100)}%`; });
    audio.addEventListener("ended", done);

    function speak() {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(VOICE_TEXT);
      const voices = synth.getVoices();
      const v = voices.find((x) => /en/i.test(x.lang) && /(female|zira|samantha|aria|jenny|google uk english female|google us english|karen|tessa|moira|victoria)/i.test(x.name)) || voices.find((x) => /^en/i.test(x.lang));
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-US";
      u.pitch = 1.45; u.rate = 0.95; u.volume = 1;
      u.onboundary = (e) => { fill.style.width = `${Math.min(100, (e.charIndex / VOICE_TEXT.length) * 100)}%`; };
      u.onend = done; u.onerror = done;
      synth.speak(u);
    }

    play.addEventListener("click", () => {
      if (playing) { stop(); return; }
      if (mode === "none") { hint.textContent = "Her wish is waiting for you ♡"; return; }
      playing = true; play.textContent = "❚❚"; duck(true);
      if (mode === "audio") {
        audio.play().catch(() => { if (mode === "audio") mode = synth && window.SpeechSynthesisUtterance ? "tts" : "none"; if (mode === "tts") speak(); else done(); });
      } else speak();
    });
    m.querySelector(".s9-close").addEventListener("click", stop);
  }

  // 2. "open when" notes
  function openWhen() {
    const { m } = modal(`<h3>Open when…</h3><p class="small">Come back to these any time you need them ♡</p><div class="s9-list" id="s9List"></div>
      <p class="txt" id="s9Note" style="display:none"></p>`);
    const list = m.querySelector("#s9List"), note = m.querySelector("#s9Note");
    NOTES.forEach((n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = `Open when ${n.when}`;
      b.addEventListener("click", () => {
        note.style.display = "block";
        note.textContent = n.text;
        b.classList.add("read");
        note.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 600, easing: "ease-out" });
      });
      list.appendChild(b);
    });
  }

  // 3. a card she can save as a picture (same beach: dusk sky, moon, faded-blue sea)
  function keepsake() {
    const canvas = document.createElement("canvas");
    const W = 1080, H = 1350;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const HZ = H * 0.56;

    const sk = ctx.createLinearGradient(0, 0, 0, HZ);
    sk.addColorStop(0, "#070a2e"); sk.addColorStop(0.3, "#2a2a7a"); sk.addColorStop(0.6, "#6a3f8e"); sk.addColorStop(0.8, "#c4587f"); sk.addColorStop(0.93, "#ff8f60"); sk.addColorStop(1, "#ffc272");
    ctx.fillStyle = sk; ctx.fillRect(0, 0, W, HZ);
    for (let i = 0; i < 120; i++) { ctx.fillStyle = `rgba(255,255,255,${rand(0.2, 0.9).toFixed(2)})`; ctx.beginPath(); ctx.arc(rand(0, W), rand(0, HZ * 0.65), rand(1, 3), 0, 7); ctx.fill(); }

    // moon
    const mg = ctx.createRadialGradient(190, 190, 10, 190, 190, 200);
    mg.addColorStop(0, "rgba(255,244,200,.55)"); mg.addColorStop(1, "rgba(255,244,200,0)");
    ctx.fillStyle = mg; ctx.fillRect(0, 0, 420, 420);
    ctx.fillStyle = "#fdf1c6"; ctx.beginPath(); ctx.arc(190, 190, 62, 0, 7); ctx.fill();

    // sun half sunk
    const SX = W * 0.68;
    const glow = ctx.createRadialGradient(SX, HZ, 20, SX, HZ, 480);
    glow.addColorStop(0, "rgba(255,230,160,.95)"); glow.addColorStop(0.3, "rgba(255,170,100,.5)"); glow.addColorStop(1, "rgba(255,140,110,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, HZ + 10);
    const sunG = ctx.createRadialGradient(SX, HZ - 40, 10, SX, HZ, 150);
    sunG.addColorStop(0, "#fffbe6"); sunG.addColorStop(0.55, "#ffd76a"); sunG.addColorStop(1, "#ff8a3c");
    ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(SX, HZ + 22, 150, Math.PI, 0); ctx.fill();

    // sea
    const sg = ctx.createLinearGradient(0, HZ, 0, H * 0.86);
    sg.addColorStop(0, "#f4b574"); sg.addColorStop(0.1, "#d99a9c"); sg.addColorStop(0.25, "#8f98cc"); sg.addColorStop(0.55, "#6a92cc"); sg.addColorStop(1, "#3b68a8");
    ctx.fillStyle = sg; ctx.fillRect(0, HZ, W, H - HZ);
    for (let i = 0; i < 34; i++) {
      const y = HZ + 10 + i * 8, half = 14 + (34 - i) * 3.2 + rand(0, 16);
      ctx.fillStyle = `rgba(255,224,160,${(0.65 - i * 0.015).toFixed(2)})`;
      ctx.fillRect(SX - half / 2 + rand(-12, 12), y, half, 3);
    }
    for (let i = 0; i < 22; i++) {
      const y = HZ + 10 + i * 8;
      ctx.fillStyle = `rgba(235,244,255,${(0.5 - i * 0.02).toFixed(2)})`;
      ctx.fillRect(190 - 6 - (i % 3) * 4, y, 14 + (i % 4) * 5, 2);
    }

    // sand
    const sandG = ctx.createLinearGradient(0, H * 0.83, 0, H);
    sandG.addColorStop(0, "#b79a9a"); sandG.addColorStop(0.3, "#d4a984"); sandG.addColorStop(1, "#b8895f");
    ctx.fillStyle = sandG;
    ctx.beginPath(); ctx.moveTo(0, H * 0.85); ctx.bezierCurveTo(W * 0.3, H * 0.81, W * 0.7, H * 0.89, W, H * 0.83); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, H * 0.85); ctx.bezierCurveTo(W * 0.3, H * 0.81, W * 0.7, H * 0.89, W, H * 0.83); ctx.stroke();

    // palm silhouettes
    ctx.fillStyle = "#0d0f38";
    ctx.beginPath(); ctx.moveTo(60, H * 0.9); ctx.quadraticCurveTo(95, H * 0.7, 80, H * 0.5); ctx.lineTo(96, H * 0.5); ctx.quadraticCurveTo(116, H * 0.7, 84, H * 0.9); ctx.fill();
    for (let a = -170; a < 30; a += 28) {
      ctx.save(); ctx.translate(88, H * 0.5); ctx.rotate(a * Math.PI / 180);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(26, -34, 84, -34, 128, 16); ctx.bezierCurveTo(88, -6, 42, -2, 0, 8); ctx.fill(); ctx.restore();
    }

    ctx.textAlign = "center"; ctx.fillStyle = "#ffffff"; ctx.shadowColor = "rgba(20,20,90,.7)"; ctx.shadowBlur = 24;
    ctx.font = "700 118px 'Dancing Script', 'Brush Script MT', cursive";
    ctx.fillText("Happy Birthday", W / 2, 330);
    ctx.font = "700 150px 'Dancing Script', 'Brush Script MT', cursive";
    ctx.fillText(name, W / 2, 490);
    ctx.shadowBlur = 12; ctx.font = "italic 700 46px 'Playfair Display', Georgia, serif"; ctx.fillStyle = "#fff4d8";
    ctx.fillText(CARD_LINE, W / 2, 590);

    const url = canvas.toDataURL("image/png");
    modal(`<h3>Your card</h3><img class="s9-card-prev" src="${url}" alt="Your birthday card">
      <a class="s9-close" style="display:inline-block;text-decoration:none" href="${url}" download="happy-birthday-${name.toLowerCase()}.png">Save to my phone</a><br>`);
  }

  /* ==========================================================
     THE GOODBYE — like the end of a movie
     1. the picture closes in as a CIRCLE (an iris), towards the middle
     2. when a small circle is left, the cat jumps up INSIDE it and holds it open
     3. the friends jump up one by one inside the circle and say their lines
     4. they all wave goodbye, drop out of sight, and the circle closes completely
     5. "The End", and one button: Experience it again
  ========================================================== */

  const END_CSS = `
  .s9-black { position: fixed; inset: 0; z-index: 99990; background: #000; display: grid; place-items: center; }
  .s9-black .stars { position: absolute; inset: 0; pointer-events: none; }
  .s9-black .stars i { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #fff; opacity: .5; animation: s9Tw 3s ease-in-out infinite alternate; }
  .s9-ring { position: fixed; z-index: 99992; border-radius: 50%; pointer-events: none; translate: -50% -50%; border: 3px solid rgba(255, 226, 160, .85); box-shadow: 0 0 30px 6px rgba(255, 200, 120, .45), inset 0 0 40px rgba(255, 200, 120, .25); }
  .s9-endcast { position: fixed; inset: 0; z-index: 99993; pointer-events: none; }
  .s9-actor { position: absolute; will-change: transform; filter: drop-shadow(0 6px 8px rgba(30, 10, 40, .45)); }
  .s9-actor svg { display: block; width: 100%; height: auto; overflow: visible; }
  .s9-bubbles { position: fixed; inset: 0; z-index: 99994; pointer-events: none; }
  .s9-bubble { position: absolute; padding: 10px 16px; border-radius: 18px; background: #fffaf2; color: #5b2a4e; text-align: center;
    font: 800 clamp(14px, 2.3vw, 20px) / 1.25 "Nunito", "Nunito Local", sans-serif; box-shadow: 0 8px 26px rgba(0, 0, 0, .45); opacity: 0; transform: translateY(8px) scale(.9);
    transition: opacity .3s ease, transform .3s cubic-bezier(.3, 1.5, .5, 1); }
  .s9-bubble::after { content: ""; position: absolute; left: var(--tail, 50%); bottom: -8px; width: 16px; height: 16px; background: inherit; translate: -50% 0; rotate: 45deg; border-radius: 3px; }
  .s9-bubble.on { opacity: 1; transform: none; }
  .s9-replay { position: fixed; left: 50%; bottom: calc(34px + env(safe-area-inset-bottom, 0px)); z-index: 99995; translate: -50% 0; padding: 15px 30px; border: 0; border-radius: 999px; cursor: pointer;
    font: 900 18px "Nunito", "Nunito Local", sans-serif; color: #5b2a4e; background: linear-gradient(#fffbe9, #ffe3a6); box-shadow: 0 6px 0 rgba(150, 90, 60, .55), 0 0 34px 8px rgba(255, 214, 140, .7);
    animation: s9Pop .9s cubic-bezier(.3, 1.6, .5, 1) backwards, s9Beckon 1.8s ease-in-out 1s infinite; -webkit-tap-highlight-color: transparent; }
  .s9-theend { position: absolute; left: 0; right: 0; top: 40%; text-align: center; color: #fff4d8; font: 700 clamp(34px, 7vw, 70px) "Dancing Script", "Dancing Local", cursive; text-shadow: 0 0 24px rgba(255, 190, 120, .7); opacity: 0; transition: opacity 2s ease; }
  .s9-theend.on { opacity: 1; }
  `;

  let ending = false;
  function autoGoodbye() {
    if (ending) return;
    if (screen.querySelector(".s9-modal")) { later(autoGoodbye, 15000); return; }   // wait while she is reading or listening
    goodbye();
  }

  function goodbye() {
    if (ending) return;
    ending = true;
    const st = document.createElement("style"); st.textContent = END_CSS; document.head.appendChild(st);
    screen.querySelectorAll(".s9-modal").forEach((m) => m.remove());
    again.hidden = true;

    const W = window.innerWidth, H = window.innerHeight, cx = W / 2, cy = H / 2;
    const R_FULL = Math.hypot(W, H) / 2 + 6;                    // big enough to cover every corner
    const R_HELD = Math.min(W * 0.47, H * 0.4);                 // the circle the friends stand in
    const R_SMALL = R_HELD * 0.7;                               // the small circle just before they stop it
    const circ = (r) => `circle(${r}px at ${cx}px ${cy}px)`;

    const black = document.createElement("div");
    black.className = "s9-black";
    black.innerHTML = `<div class="stars"></div><div class="s9-theend" id="s9TheEnd">The End</div>`;
    const sb = black.querySelector(".stars");
    for (let i = 0; i < 60; i++) { const d = document.createElement("i"); d.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;animation-delay:${-rand(0, 3)}s`; sb.appendChild(d); }
    document.body.appendChild(black);
    screen.style.zIndex = "99991";

    // the words and buttons fade away, and the beach friends step aside (the same friends jump back in later)
    [titleEl, actions, msg].forEach((el) => { el.style.transition = "opacity 1.6s ease"; el.style.opacity = 0; });
    group.querySelectorAll(".s9-pal").forEach((el) => { el.style.transition = "opacity 2.4s ease"; el.style.opacity = 0; });

    const ring = document.createElement("div"); ring.className = "s9-ring"; ring.style.cssText = `left:${cx}px;top:${cy}px;width:${R_FULL * 2}px;height:${R_FULL * 2}px;opacity:0`;
    const cast = document.createElement("div"); cast.className = "s9-endcast"; cast.style.clipPath = circ(R_FULL);
    const bub = document.createElement("div"); bub.className = "s9-bubbles";
    document.body.append(ring, cast, bub);

    const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));
    // the picture, the ring and the area where the friends stand all close together
    const iris = (r0, r1, ms, easing) => {
      const o = { duration: ms, easing, fill: "forwards" };
      cast.animate([{ clipPath: circ(r0) }, { clipPath: circ(r1) }], o);
      ring.animate([{ width: `${r0 * 2}px`, height: `${r0 * 2}px`, opacity: 1 }, { width: `${r1 * 2}px`, height: `${r1 * 2}px`, opacity: r1 < 2 ? 0 : 1 }], o);
      return screen.animate([{ clipPath: circ(r0) }, { clipPath: circ(r1) }], o).finished;
    };

    // the six friends, standing in a row near the bottom of the circle
    const w = R_HELD * 0.3, sp = R_HELD * 0.25, feetY = cy + R_HELD * 0.58;
    const crew = [
      { kind: "panda", flip: false, line: `Happy Birthday, ${name}! \uD83C\uDF82` },
      { kind: "bunny", flip: true, line: "Stay happy, always \u2661" },
      { kind: "bear", flip: false, line: "We hope you liked it \u2661" },
      { kind: "cat", flip: true, line: "WAIT WAIT WAIT! \u270B" },
      { kind: "puppy", flip: false, line: "Don't go yet! \uD83D\uDC36" },
      { kind: "bunny", flip: true, line: "Bye bye! \uD83D\uDC30" }
    ];
    crew.forEach((m, i) => {
      const el = document.createElement("div");
      el.className = "s9-actor";
      el.style.cssText = `width:${w}px;left:${cx + (i - 2.5) * sp - w / 2}px;opacity:0`;
      el.innerHTML = window.Mates ? window.Mates.svg(m.kind, false, "wow") : "";
      cast.appendChild(el);
      m.el = el; m.x = cx + (i - 2.5) * sp;
    });
    const place = (m) => { m.h = m.el.offsetHeight; m.top = feetY - m.h; m.el.style.top = `${m.top}px`; };
    const jumpIn = (m) => {
      place(m);
      const below = cy + R_HELD + 14 - m.top;                 // start hidden below the circle's edge
      m.el.style.opacity = 1;
      return m.el.animate([{ transform: `translateY(${below}px)` }, { transform: `translateY(${-m.h * 0.34}px)`, offset: .62 }, { transform: "translateY(0)" }],
        { duration: 750, easing: "cubic-bezier(.3,.9,.4,1)", fill: "forwards" }).finished;
    };
    const hop = (m) => m.el.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-m.h * 0.14}px)` }, { transform: "translateY(0)" }], { duration: 380, easing: "ease-out" });
    const say = (m, text, ms) => {
      const b = document.createElement("div");
      b.className = "s9-bubble";
      b.textContent = text;
      b.style.maxWidth = `${Math.min(W * 0.8, R_HELD * 1.5)}px`;
      bub.appendChild(b);
      const bw = b.offsetWidth, bh = b.offsetHeight;
      const lo = cx - R_HELD * 0.82, hi = cx + R_HELD * 0.82 - bw;
      const left = Math.max(Math.min(lo, hi), Math.min(Math.max(lo, hi), m.x - bw / 2));
      b.style.left = `${left}px`;
      b.style.top = `${m.top - bh - 14}px`;
      b.style.setProperty("--tail", `${Math.max(16, Math.min(bw - 16, m.x - left))}px`);
      requestAnimationFrame(() => b.classList.add("on"));
      hop(m);
      return wait(ms).then(() => { b.classList.remove("on"); return wait(320).then(() => b.remove()); });
    };
    const happy = (m, wave) => { m.el.innerHTML = window.Mates ? window.Mates.svg(m.kind, wave, "happy") : ""; };

    (async () => {
      // 1. the picture closes in as a circle
      await iris(R_FULL, R_SMALL, 6500, "cubic-bezier(.55,.05,.7,.4)");
      await wait(400);

      // 2. the cat jumps up inside the small circle and pushes it open again
      const cat = crew[3];
      await jumpIn(cat);
      happy(cat, true);
      const open = iris(R_SMALL, R_HELD, 900, "cubic-bezier(.3,1.5,.5,1)");
      await say(cat, cat.line, 1900);
      await open;

      // 3. one by one, the others jump up inside the circle and say their lines
      for (const i of [4, 2, 0, 1, 5]) {
        const m = crew[i];
        await jumpIn(m);
        happy(m, false);
        await say(m, m.line, 1900);
      }

      // 4. everybody waves goodbye
      crew.forEach((m) => happy(m, true));
      await say(crew[3], "Goodbye! See you soon \u2661", 2800);

      // they drop out of sight, one by one, and the circle closes for good
      crew.slice().reverse().forEach((m, k) => {
        m.el.animate([{ transform: "translateY(0)" }, { transform: `translateY(${R_HELD + m.h}px)` }], { duration: 520, easing: "ease-in", fill: "forwards", delay: k * 110 });
      });
      await wait(900);
      await iris(R_HELD, 0, 1700, "cubic-bezier(.6,0,.4,1)");
      screen.style.visibility = "hidden";
      cast.remove(); ring.remove(); bub.remove();

      // 5. the end, and one button
      await wait(400);
      black.querySelector("#s9TheEnd").classList.add("on");
      await wait(2200);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "s9-replay";
      btn.textContent = "\u21BB  Experience it again";
      btn.addEventListener("click", () => window.location.reload());
      black.appendChild(btn);
    })();
  }

  // to test the goodbye by itself from the console:  window.__goodbye()
  window.__goodbye = goodbye;
})();

