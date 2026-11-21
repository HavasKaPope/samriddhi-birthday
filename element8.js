/* ==========================================
   ELEMENT 8 — THE BIG GIFT
   She opens a big gift and finds four surprises, one after another:
   1 a group photo hidden under scratch foil   2 a song, on a record player
   3 a golden medal                            4 a key that opens the last element
   Four polaroids of her hang on strings on the wall.
   (Everything is built here: this one file is enough.)
   Settings live in screens.js → CONFIG.gift
========================================== */

(() => {
  const screen = document.getElementById("screen8");
  if (!screen) { console.error("Element 8: #screen8 is missing in index.html"); return; }

  const src7 = document.getElementById("screen7");           // the cake room, whose look we borrow
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const cfg = window.CONFIG || {};
  const g = cfg.gift || {};
  const name = cfg.name || "you";
  const PHOTO = g.photo || "assets/images/group.jpg";
  const PHOTOS = g.photos || ["assets/images/photo1", "assets/images/photo2", "assets/images/photo3", "assets/images/photo4"];
  // the birthday girl in the group photo: her face as a percentage of the picture (x from the left, y from the top)
  const FOCUS = g.photoFocus || { x: 69.2, y: 44.5 };
  const PHOTO_NOTE = g.photoNote || `${name}\u2019s special day \u2661`;
  const PHOTO_TAG = g.photoTag || `${name}`;
  const CAPTION = g.photoCaption || "The day you were part of the picture \u2661";
  const SONG = g.song || "assets/audio/song.mp3";
  const SONG_TITLE = g.songTitle || "A song for you";
  const SONG_ARTIST = g.songArtist || "chosen with love";
  const SONG_COVER = g.songCover || "assets/images/song-cover";
  const MEDAL_TITLE = (g.medalTitle || "Bravest Heart").toUpperCase();
  const MEDAL_TEXT = g.medalText || "For every time you kept going, even when it was hard. The best things about you were never going to fit on any list \u2661";
  const KEY_TEXT = g.keyText || "This key opens a place that is always yours. Keep it close \u2661";

  /* ---------------- styles ---------------- */

  const css = `
  .s8-gift { position: absolute; left: 50%; bottom: calc(var(--th) - 5vh); z-index: 5; translate: -50% 0; width: min(26vw, 40vh, 340px); aspect-ratio: 1;
    padding: 0; border: 0; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent; animation: s8Drop 1.3s cubic-bezier(.3, 1.4, .5, 1) .5s backwards; }
  @keyframes s8Drop { from { opacity: 0; transform: translateY(-75vh) rotate(-10deg); } }
  .s8-gift svg { display: block; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 14px 18px rgba(0, 0, 0, .45)); }
  .s8-gift .wob { transform-origin: 50% 100%; animation: s8Wob 2.8s ease-in-out 2.2s infinite; }
  @keyframes s8Wob { 0%, 68%, 100% { rotate: 0deg; } 74% { rotate: -4deg; } 80% { rotate: 4deg; } 86% { rotate: -3deg; } 92% { rotate: 2deg; } }
  .s8-lid, .s8-bow { transform-box: fill-box; transition: transform 1.1s cubic-bezier(.4, 0, .2, 1), opacity .9s ease; }
  .s8-gift.open .s8-lid { transform: translate(-40px, -200px) rotate(-26deg); opacity: 0; }
  .s8-gift.open .s8-bow { transform: translate(50px, -270px) rotate(55deg); opacity: 0; }
  .s8-gift.open .wob { animation: none; }
  .s8-gift::before { content: ""; position: absolute; left: 50%; top: 34%; width: 280%; aspect-ratio: 1; translate: -50% -50%; z-index: -1; opacity: 0; pointer-events: none;
    background: repeating-conic-gradient(rgba(255, 226, 150, .55) 0 6deg, transparent 6deg 20deg);
    -webkit-mask-image: radial-gradient(circle, #000, transparent 62%); mask-image: radial-gradient(circle, #000, transparent 62%); }
  .s8-gift.open::before { opacity: 1; animation: s8Rays 14s linear infinite; transition: opacity 1s ease; }
  @keyframes s8Rays { to { rotate: 360deg; } }
  .s8-tag { position: absolute; right: 2%; top: 46%; z-index: 2; padding: 4px 10px; border-radius: 6px; background: #fffaf0; color: #7a3a58; transform: rotate(8deg);
    font: 700 clamp(13px, 1.8vw, 19px) / 1.1 "Dancing Script", "Dancing Local", cursive; box-shadow: 0 4px 10px rgba(0, 0, 0, .3); pointer-events: none; }
  .s8-gift.open .s8-tag { opacity: 0; transition: opacity .4s; }

  /* polaroids on strings */
  .s8-strings { position: absolute; left: 0; right: 0; top: 24vh; height: 26vh; z-index: 2; pointer-events: none; }
  .s8-strings svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .s8-pol { position: absolute; left: var(--x); top: var(--y); width: clamp(50px, 8.6vw, 124px); margin-left: calc(clamp(50px, 8.6vw, 124px) / -2); padding: 5px 5px 16px; background: #fffdf8;
    box-shadow: 0 8px 16px rgba(0, 0, 0, .4); rotate: var(--r); transform-origin: 50% 0; cursor: pointer; pointer-events: auto; border: 0;
    animation: s8PolSway 4s ease-in-out var(--dl) infinite alternate, s8PolIn .8s cubic-bezier(.3, 1.5, .5, 1) var(--in) backwards; }
  .s8-pol::before { content: ""; position: absolute; left: 50%; top: -9px; width: 8px; height: 18px; margin-left: -4px; background: #e8c27a; border-radius: 2px; box-shadow: 0 2px 3px rgba(0, 0, 0, .3); }
  .s8-pol img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; background: #eee; }
  @keyframes s8PolSway { from { rotate: calc(var(--r) - 3deg); } to { rotate: calc(var(--r) + 3deg); } }
  @keyframes s8PolIn { from { opacity: 0; translate: 0 -30px; } }
  .s8-light { position: absolute; inset: 0; z-index: 50; display: grid; place-items: center; padding: 20px; background: rgba(10, 4, 24, .78); cursor: pointer; }
  .s8-light img { max-width: min(92vw, 640px); max-height: 82vh; padding: 10px 10px 34px; background: #fffdf8; border-radius: 4px; box-shadow: 0 20px 60px rgba(0, 0, 0, .6); rotate: -2deg; animation: s8PolIn .5s ease; }

  /* the surprise card */
  .s8-overlay { position: absolute; inset: 0; z-index: 30; display: grid; place-items: center; padding: 16px; background: rgba(14, 6, 30, .6);
    -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity .6s ease; }
  .s8-overlay.show { opacity: 1; pointer-events: auto; }
  .s8-prog { position: absolute; top: calc(10px + env(safe-area-inset-top, 0px)); left: 0; right: 0; display: flex; justify-content: center; gap: 12px; pointer-events: none; }
  .s8-prog span { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; background: rgba(255, 255, 255, .14); font-size: 20px; filter: grayscale(1) opacity(.5); transition: all .5s ease; }
  .s8-prog span.now { background: #ffe08f; filter: none; scale: 1.2; box-shadow: 0 0 18px #ffd76a; }
  .s8-prog span.done { background: #7ee8b0; filter: none; }
  .s8-card { position: relative; width: min(94vw, 740px); max-height: 88vh; margin-top: 40px; overflow-y: auto; padding: 18px 20px 18px; border: 3px solid #f2d27a; border-radius: 22px; text-align: center;
    background: linear-gradient(#fffaf2, #ffeef6); color: #5b2a4e; box-shadow: 0 24px 70px rgba(0, 0, 0, .55); transition: opacity .45s ease, transform .45s ease; }
  .s8-card.swap { opacity: 0; transform: translateY(16px) scale(.97); }
  .s8-overlay.show .s8-card:not(.swap) { animation: s8CardIn .8s cubic-bezier(.3, 1.4, .5, 1); }
  @keyframes s8CardIn { from { opacity: 0; transform: translateY(40px) scale(.9) rotate(-1.5deg); } }
  .s8-k { margin: 0; color: #c98a2c; font: 800 11px / 1 "Nunito", "Nunito Local", sans-serif; letter-spacing: 3px; }
  .s8-t { margin: 6px 0 12px; color: #e0587f; font: 700 clamp(28px, 5vw, 44px) / 1.05 "Dancing Script", "Dancing Local", cursive; }
  .s8-b { display: grid; justify-items: center; gap: 10px; }
  .s8-f { min-height: 56px; margin-top: 12px; display: grid; place-items: center; }
  .s8-card .s7-action { margin: 0; }
  .s8-cap { margin: 4px 0 0; color: #7a3a58; font: 700 clamp(22px, 3.6vw, 30px) / 1.15 "Dancing Script", "Dancing Local", cursive; }
  .s8-sm { margin: 0; max-width: 520px; color: #7a3a58; font-weight: 700; font-size: clamp(14px, 2.2vh, 17px); line-height: 1.45; }

  /* 1 scratch */
  .s8-frame { box-sizing: border-box; position: relative; width: min(100%, 580px); padding: 12px 12px 48px; border-radius: 6px; rotate: -1.2deg; background: linear-gradient(#fffefb, #fff5e8);
    box-shadow: 0 14px 32px rgba(120, 60, 100, .38), 0 0 0 1px rgba(200, 160, 110, .35); animation: s8FrameIn 1s cubic-bezier(.3, 1.4, .5, 1) backwards; }
  @keyframes s8FrameIn { from { opacity: 0; transform: translateY(24px) rotate(4deg) scale(.92); } }
  .s8-frame::before, .s8-frame::after { content: ""; position: absolute; top: -11px; width: 78px; height: 24px; z-index: 6; opacity: .92;
    background: repeating-linear-gradient(90deg, rgba(255, 196, 220, .9) 0 8px, rgba(255, 230, 240, .9) 8px 16px); box-shadow: 0 2px 5px rgba(120, 60, 100, .25); }
  .s8-frame::before { left: -18px; rotate: -34deg; } .s8-frame::after { right: -18px; rotate: 34deg; background: repeating-linear-gradient(90deg, rgba(200, 220, 255, .9) 0 8px, rgba(235, 242, 255, .9) 8px 16px); }
  .s8-fnote { position: absolute; left: 0; right: 0; bottom: 8px; margin: 0; color: #c24b78; font: 700 clamp(20px, 3.6vw, 27px) / 1.1 "Dancing Script", "Dancing Local", cursive; }
  .s8-stk { position: absolute; z-index: 7; font-size: clamp(22px, 4vw, 32px); filter: drop-shadow(0 3px 3px rgba(80, 30, 60, .3)); pointer-events: none; animation: s8Stk 3.4s ease-in-out infinite alternate; }
  @keyframes s8Stk { from { transform: rotate(-8deg) translateY(0); } to { transform: rotate(8deg) translateY(-4px); } }

  .s8-scratch { position: relative; width: 100%; aspect-ratio: 520 / 247; overflow: hidden; border-radius: 3px; box-shadow: inset 0 0 0 1px rgba(80, 50, 40, .25); background: #eee; --fx: 69.2%; --fy: 44.5%; }
  .s8-scratch.shown { cursor: pointer; }
  .s8-grade { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0; transition: opacity 1.6s ease;
    background: radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(70, 25, 60, .30) 100%), linear-gradient(135deg, rgba(255, 190, 150, .16), rgba(255, 150, 200, .10) 55%, rgba(150, 170, 255, .12)); }
  .s8-grain { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0; mix-blend-mode: soft-light; transition: opacity 1.6s ease;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E"); }
  .s8-scratch.shown .s8-grade { opacity: 1; } .s8-scratch.shown .s8-grain { opacity: .55; }
  .s8-spot { position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; transition: opacity 1.1s ease;
    background: radial-gradient(circle at var(--fx) var(--fy), transparent 0, transparent 6%, rgba(24, 8, 44, .74) 17%); }
  .s8-scratch.spot .s8-spot { opacity: 1; }
  .s8-ring { position: absolute; z-index: 4; left: var(--fx); top: var(--fy); width: 9.5%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; pointer-events: none; opacity: 0; transform: scale(2.4);
    border: 2.5px solid #ffe08f; box-shadow: 0 0 12px 3px rgba(255, 214, 120, .85), inset 0 0 10px rgba(255, 214, 120, .45); transition: opacity .9s ease .4s, transform 1s cubic-bezier(.3, 1.6, .5, 1) .4s; }
  .s8-scratch.shown .s8-ring { opacity: 1; transform: none; animation: s8Ring 1.9s ease-in-out 1.6s infinite; }
  @keyframes s8Ring { 0%, 100% { box-shadow: 0 0 10px 2px rgba(255, 214, 120, .7), inset 0 0 8px rgba(255, 214, 120, .35); } 50% { box-shadow: 0 0 20px 7px rgba(255, 214, 120, 1), inset 0 0 14px rgba(255, 214, 120, .6); } }
  .s8-spk { position: absolute; z-index: 4; left: var(--fx); top: var(--fy); color: #fff4b8; font-size: 13px; pointer-events: none; opacity: 0; text-shadow: 0 0 6px #ffd76a; }
  .s8-scratch.shown .s8-spk { animation: s8Spk 2.2s ease-in-out var(--dl) infinite; }
  @keyframes s8Spk { 0% { opacity: 0; transform: translate(0, 0) scale(.4); } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1.1) rotate(80deg); } }
  .s8-tag { position: absolute; z-index: 5; left: var(--fx); top: calc(var(--fy) - 13%); translate: -50% -100%; padding: 4px 12px 5px; border-radius: 999px; white-space: nowrap; pointer-events: none;
    background: #fffaf0; color: #d6477a; font: 700 clamp(16px, 3vw, 22px) / 1.1 "Dancing Script", "Dancing Local", cursive; box-shadow: 0 4px 12px rgba(60, 20, 60, .45);
    opacity: 0; transform: translateY(8px) scale(.7); transition: opacity .7s ease 1s, transform .8s cubic-bezier(.3, 1.6, .5, 1) 1s; }
  .s8-tag::after { content: ""; position: absolute; left: 50%; bottom: -5px; width: 10px; height: 10px; background: inherit; translate: -50% 0; rotate: 45deg; }
  .s8-scratch.shown .s8-tag { opacity: 1; transform: none; }
  .s8-photo { background-size: 100% 100% !important; transform-origin: var(--fx) var(--fy); transition: transform 2.6s cubic-bezier(.4, 0, .2, 1), filter 1.6s ease; }
  .s8-scratch.shown .s8-photo { filter: saturate(1.1) contrast(1.05); }
  .s8-scratch.zoom .s8-photo { transform: scale(1.4); }
  .s8-photo { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(135deg, #f7c9d8, #d5c0e8 55%, #f9d9cb) center / cover; color: #fff;
    font: 700 clamp(18px, 3vw, 30px) "Dancing Script", "Dancing Local", cursive; text-shadow: 0 2px 12px rgba(150, 60, 110, .5); }
  .s8-foil { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; cursor: crosshair; transition: opacity .9s ease; }
  .s8-foil.gone { opacity: 0; pointer-events: none; }
  .s8-hint { position: absolute; left: 0; right: 0; bottom: 10px; text-align: center; color: #6b4a10; font: 800 14px "Nunito", sans-serif; pointer-events: none; animation: s8Blink 1.4s ease-in-out infinite alternate; }
  @keyframes s8Blink { to { opacity: .35; } }

  /* 2 record player */
  .s8-deck { position: relative; width: min(54vw, 230px); aspect-ratio: 1; }
  .s8-disc { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 12px 28px rgba(0, 0, 0, .45); animation: s8Spin 3.4s linear infinite paused;
    background: conic-gradient(from 20deg, rgba(255, 255, 255, .0), rgba(255, 255, 255, .18), rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, .14) 55%, rgba(255, 255, 255, 0) 80%),
      repeating-radial-gradient(circle at 50% 50%, #1b1124 0 2px, #2c1b3a 2px 4px); }
  .s8-deck.playing .s8-disc { animation-play-state: running; }
  @keyframes s8Spin { to { rotate: 360deg; } }
  .s8-lbl { position: absolute; left: 50%; top: 50%; width: 34%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; display: grid; place-items: center;
    background: radial-gradient(circle, #ffb3cd, #e0587f); color: #fff; font-size: clamp(22px, 5vw, 32px); }
  .s8-arm { position: absolute; right: -10%; top: 2%; width: 52%; height: 7px; border-radius: 4px; background: linear-gradient(#e9ecf4, #aab0c2); transform-origin: 100% 50%; rotate: -30deg; transition: rotate .9s ease; }
  .s8-arm::after { content: ""; position: absolute; left: -6px; top: -4px; width: 16px; height: 15px; border-radius: 3px; background: #7a3a58; }
  .s8-deck.playing .s8-arm { rotate: -6deg; }
  .s8-song { margin: 0; font: 800 clamp(16px, 2.6vh, 20px) / 1.3 "Nunito", sans-serif; }
  .s8-songrow { display: flex; align-items: center; justify-content: center; gap: 12px; text-align: left; }
  .s8-thumb { display: none; width: 58px; height: 58px; flex: none; border-radius: 10px; object-fit: cover; box-shadow: 0 6px 14px rgba(120, 60, 100, .35); }
  .s8-thumb.on { display: block; }
  .s8-lbl.pic { background-size: cover; background-position: center; font-size: 0; box-shadow: inset 0 0 0 3px rgba(255, 255, 255, .6); }
  .s8-song small { color: #9a6a88; font-weight: 700; }
  .s8-bars { display: flex; align-items: flex-end; gap: 4px; height: 30px; }
  .s8-bars i { width: 5px; height: 20%; border-radius: 3px; background: linear-gradient(#ff7aa2, #b49af2); transition: height .3s; }
  .s8-bars.on i { animation: s8Bar .7s ease-in-out infinite alternate; }
  .s8-bars.on i:nth-child(3n) { animation-duration: .5s; } .s8-bars.on i:nth-child(3n+1) { animation-duration: .9s; animation-delay: -.3s; }
  @keyframes s8Bar { from { height: 15%; } to { height: 100%; } }
  .s8-ctl { display: flex; align-items: center; gap: 12px; width: min(86%, 380px); }
  .s8-play { width: 54px; height: 54px; flex: none; border: 0; border-radius: 50%; cursor: pointer; background: linear-gradient(110deg, #f6a2ae, #df5279); color: #fff; font-size: 22px;
    box-shadow: 0 5px 0 #792c4c; }
  .s8-play:active { transform: translateY(3px); box-shadow: 0 2px 0 #792c4c; }
  .s8-track { position: relative; flex: 1; height: 8px; border-radius: 4px; background: rgba(91, 42, 78, .15); overflow: hidden; }
  .s8-track i { position: absolute; inset: 0 auto 0 0; width: 0; background: linear-gradient(90deg, #ff8fb3, #b49af2); }
  .s8-time { width: 38px; font: 800 13px "Nunito", sans-serif; color: #7a3a58; }

  /* 3 medal */
  .s8-medal { position: relative; width: min(46vw, 190px); aspect-ratio: 200 / 300; cursor: pointer; border: 0; padding: 0; background: none; transform-origin: 50% 0; animation: s8MedalSwing 3.2s ease-in-out infinite alternate; -webkit-tap-highlight-color: transparent; }
  .s8-medal svg { display: block; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 10px 14px rgba(120, 70, 20, .4)); }
  @keyframes s8MedalSwing { from { rotate: -5deg; } to { rotate: 5deg; } }
  .s8-medal .disc { transform-box: fill-box; transform-origin: 50% 50%; }
  .s8-medal.spin .disc { animation: s8Flip 1.6s cubic-bezier(.4, 0, .2, 1); }
  @keyframes s8Flip { to { transform: rotateY(720deg); } }
  .s8-medal.won { animation: s8MedalSwing 2.4s ease-in-out infinite alternate; filter: drop-shadow(0 0 20px rgba(255, 215, 106, .9)); }
  .s8-shine { position: absolute; left: 50%; top: 60%; width: 120%; aspect-ratio: 1; translate: -50% -50%; pointer-events: none; opacity: 0; z-index: -1;
    background: repeating-conic-gradient(rgba(255, 226, 150, .55) 0 7deg, transparent 7deg 22deg); -webkit-mask-image: radial-gradient(circle, #000, transparent 65%); mask-image: radial-gradient(circle, #000, transparent 65%); }
  .s8-medal.won .s8-shine { opacity: 1; animation: s8Rays 10s linear infinite; }
  .s8-reveal { opacity: 0; transform: translateY(10px); transition: opacity .8s ease, transform .8s ease; }
  .s8-reveal.on { opacity: 1; transform: none; }

  /* 4 key */
  .s8-keywrap { position: relative; width: min(80vw, 330px); aspect-ratio: 300 / 130; display: grid; place-items: center; }
  .s8-keyglow { position: absolute; inset: -30%; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, rgba(255, 220, 120, .65), transparent 62%); animation: s8Breath 3s ease-in-out infinite; }
  @keyframes s8Breath { 50% { scale: 1.15; opacity: .7; } }
  .s8-key { position: relative; width: 100%; border: 0; padding: 0; background: none; cursor: pointer; animation: s8KeyBob 2.6s ease-in-out infinite alternate; -webkit-tap-highlight-color: transparent; }
  .s8-key svg { display: block; width: 100%; height: auto; overflow: visible; filter: drop-shadow(0 10px 12px rgba(120, 70, 20, .45)); }
  @keyframes s8KeyBob { from { translate: 0 -6px; rotate: -4deg; } to { translate: 0 8px; rotate: 4deg; } }
  .s8-key.turn { animation: s8KeyTurn 1.3s ease-in-out forwards; }
  @keyframes s8KeyTurn { 0% { scale: 1; rotate: 0deg; } 40% { scale: 1.25; rotate: 0deg; } 100% { scale: 1.4; rotate: 90deg; } }
  .s8-flash { position: absolute; inset: 0; z-index: 60; pointer-events: none; opacity: 0; background: radial-gradient(circle, #fff9dc, rgba(255, 215, 120, .85) 55%, rgba(255, 215, 120, 0) 80%); }
  .s8-flash.go { animation: s8FlashGo 1.4s ease-in forwards; }
  @keyframes s8FlashGo { 0% { opacity: 0; } 60% { opacity: 1; } 100% { opacity: 1; } }

  .s8-conf { position: absolute; z-index: 55; left: var(--x); top: var(--y); width: var(--w); height: calc(var(--w) * 1.5); background: var(--c); border-radius: 2px; pointer-events: none;
    animation: s8Conf var(--d) cubic-bezier(.2, .7, .4, 1) forwards; }
  .s8-conf.glyph { width: auto; height: auto; background: none; color: var(--c); font-size: var(--w); line-height: 1; }
  @keyframes s8Conf { 0% { opacity: 1; transform: translate(0, 0) rotate(0); } 35% { opacity: 1; transform: translate(calc(var(--dx) * .8), var(--up)) rotate(calc(var(--r) * .4)); }
    100% { opacity: 0; transform: translate(var(--dx), var(--fall)) rotate(var(--r)); } }

  @media (max-width: 680px) { .s8-strings { top: 21vh; } .s8-gift { width: min(44vw, 34vh); } .s8-card { padding: 14px 14px; } }
  @media (max-height: 560px) { .s8-card { margin-top: 30px; } .s8-t { margin-bottom: 6px; } }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- build the room: borrow the cake room's look ---------------- */

  screen.classList.add("s7");

  const art = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="s8Box" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f45aa8"/><stop offset="1" stop-color="#b5186c"/></linearGradient>
    <linearGradient id="s8Lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7cbd"/><stop offset="1" stop-color="#d12a85"/></linearGradient>
    <linearGradient id="s8Gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".5" stop-color="#f2c243"/><stop offset="1" stop-color="#c98a1c"/></linearGradient>
  </defs></svg>`;

  screen.innerHTML = `${art}<div id="s8Room"></div>`;
  const room = document.getElementById("s8Room");

  function borrow(selector) {
    if (!src7) return [];
    return [...src7.querySelectorAll(selector)].map((node) => {
      const copy = node.cloneNode(true);
      copy.removeAttribute("id");
      copy.querySelectorAll("[id]").forEach((x) => x.removeAttribute("id"));
      room.appendChild(copy);
      return copy;
    });
  }

  [".s7-wall", ".s7-beam", ".s7-neon", ".s7-curtain", ".s7-bunting", ".s7-valance", ".s7-lights", "#s7Decor", ".s7-table"].forEach(borrow);
  const neonText = room.querySelector(".s7-neon .a");
  if (neonText) neonText.textContent = "A gift for you";

  // her friends again, standing around the table, happy
  const crew = borrow(".s7-crew")[0];
  if (crew) {
    crew.classList.remove("sing", "cheer");
    crew.querySelectorAll(".s7-say, .s7-note").forEach((n) => n.remove());
    crew.querySelectorAll(".s7-pal").forEach((pal, i) => {
      pal.classList.remove("munch");
      if (window.Mates) pal.innerHTML = window.Mates.svg(pal.dataset.kind, i % 2 === 0, "happy");
    });
    const girl = crew.querySelector(".s7-girl");
    if (girl) { girl.classList.remove("chew"); girl.classList.add("happy"); }
  }

  const cheer = () => {
    if (!crew) return;
    crew.querySelectorAll(".s7-pal, .s7-girl").forEach((p, i) => p.style.setProperty("--jd", `${(i * 0.08).toFixed(2)}s`));
    crew.classList.add("cheer");
    window.setTimeout(() => crew.classList.remove("cheer"), 2200);
  };

  /* ---------------- polaroids on strings ---------------- */

  const strings = document.createElement("div");
  strings.className = "s8-strings";
  strings.innerHTML = `<svg viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
    <path d="M110 10Q230 90 350 20" stroke="#caa86a" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>
    <path d="M650 20Q770 90 890 10" stroke="#caa86a" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/></svg>`;
  room.appendChild(strings);

  const lightbox = (url) => {
    const box = document.createElement("div");
    box.className = "s8-light";
    box.innerHTML = `<img src="${url}" alt="A photo of you">`;
    box.addEventListener("click", () => box.remove());
    screen.appendChild(box);
  };

  function findPicture(base, done, i = 0) {
    const endings = ["jpg", "png", "jpeg", "webp"];
    if (!base || i >= endings.length) { done(null); return; }
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = () => findPicture(base, done, i + 1);
    img.src = `${base}.${endings[i]}`;
  }

  // [left %, top %, tilt] for the four polaroids (two on each side of the gift)
  [[13, 22, -6], [23, 52, 5], [77, 52, -5], [87, 22, 6]].forEach(([x, y, r], i) => {
    findPicture(PHOTOS[i], (img) => {
      if (!img) return;
      const pol = document.createElement("button");
      pol.type = "button";
      pol.className = "s8-pol";
      pol.setAttribute("aria-label", "Look at this photo");
      pol.style.setProperty("--x", `${x}%`);
      pol.style.setProperty("--y", `${y}%`);
      pol.style.setProperty("--r", `${r}deg`);
      pol.style.setProperty("--dl", `${(-i * 1.1).toFixed(1)}s`);
      pol.style.setProperty("--in", `${(1.8 + i * 0.25).toFixed(2)}s`);
      img.alt = "";
      pol.appendChild(img);
      pol.addEventListener("click", () => lightbox(img.src));
      strings.appendChild(pol);
    });
  });

  /* ---------------- the big gift ---------------- */

  const giftSvg = `<svg viewBox="0 0 300 300" aria-hidden="true">
    <g class="wob">
      <rect x="30" y="124" width="240" height="168" rx="14" fill="url(#s8Box)"/>
      <rect x="136" y="124" width="28" height="168" fill="url(#s8Gold)"/>
      <g fill="#fff" opacity=".35"><circle cx="70" cy="170" r="5"/><circle cx="100" cy="220" r="4"/><circle cx="68" cy="260" r="5"/><circle cx="232" cy="176" r="5"/><circle cx="204" cy="236" r="4"/><circle cx="236" cy="266" r="5"/></g>
      <g class="s8-lid"><rect x="16" y="86" width="268" height="52" rx="12" fill="url(#s8Lid)"/><rect x="136" y="86" width="28" height="52" fill="url(#s8Gold)"/></g>
      <g class="s8-bow"><path d="M150 84C108 28 60 52 96 86z" fill="url(#s8Gold)"/><path d="M150 84C192 28 240 52 204 86z" fill="url(#s8Gold)"/><circle cx="150" cy="84" r="15" fill="#e8a92c"/></g>
    </g></svg>`;

  const gift = document.createElement("button");
  gift.type = "button";
  gift.className = "s8-gift";
  gift.setAttribute("aria-label", "Open the gift");
  gift.innerHTML = `${giftSvg}<span class="s8-tag">for ${name} \u2661</span>`;
  room.appendChild(gift);

  /* panel on the table cloth */
  const panel = document.createElement("div");
  panel.className = "s7-panel";
  panel.innerHTML = `<h2 class="s7-title" id="s8Title">One more thing\u2026</h2><p class="s7-line" id="s8Line">Tap the gift to open it.</p>`;
  room.appendChild(panel);

  /* surprise card */
  const overlay = document.createElement("div");
  overlay.className = "s8-overlay";
  overlay.innerHTML = `<div class="s8-prog" id="s8Prog"><span>\uD83D\uDDBC\uFE0F</span><span>\uD83C\uDFB5</span><span>\uD83C\uDFC5</span><span>\uD83D\uDD11</span></div>
    <div class="s8-card" id="s8Card"><p class="s8-k" id="s8K"></p><h2 class="s8-t" id="s8T"></h2><div class="s8-b" id="s8B"></div>
    <div class="s8-f"><button type="button" class="s7-action pink" id="s8Next" hidden></button></div></div>`;
  screen.appendChild(overlay);

  const flash = document.createElement("div");
  flash.className = "s8-flash";
  screen.appendChild(flash);

  const $ = (id) => document.getElementById(id);
  const card = $("s8Card"), kEl = $("s8K"), tEl = $("s8T"), bEl = $("s8B"), nextBtn = $("s8Next"), prog = $("s8Prog");

  /* ---------------- helpers ---------------- */

  function confetti(x, y, count, spread, up) {
    const colors = ["#ff8fb3", "#b49af2", "#ffd76a", "#ff7aa2", "#8fd3ff", "#7ee8b0", "#ffffff"];
    const glyphs = ["\u2661", "\u2665", "\u2726"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      const glyph = i % 5 === 0;
      piece.className = "s8-conf" + (glyph ? " glyph" : "");
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

  const center = () => { const r = screen.getBoundingClientRect(); return { x: r.width / 2, y: r.height * 0.42, w: r.width, h: r.height }; };
  const burst = (n) => { const c = center(); confetti(c.x, c.y, n, c.w * 0.35, 320); };

  let leaveHooks = [];
  const onLeave = (fn) => leaveHooks.push(fn);

  function showNext(label, handler) {
    nextBtn.textContent = label;
    nextBtn.hidden = false;
    nextBtn.style.animation = "none"; void nextBtn.offsetWidth; nextBtn.style.animation = "";
    nextBtn.onclick = handler;
  }

  /* ---------------- sound for the record player ---------------- */

  function lullaby() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.3;
    master.connect(ctx.destination);
    const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440 };
    const phrase = (list) => list.map(([n, b]) => [n, b]);
    const tune = [].concat(
      phrase([["C4", 1], ["C4", 1], ["G4", 1], ["G4", 1], ["A4", 1], ["A4", 1], ["G4", 2], ["F4", 1], ["F4", 1], ["E4", 1], ["E4", 1], ["D4", 1], ["D4", 1], ["C4", 2]]),
      phrase([["G4", 1], ["G4", 1], ["F4", 1], ["F4", 1], ["E4", 1], ["E4", 1], ["D4", 2], ["G4", 1], ["G4", 1], ["F4", 1], ["F4", 1], ["E4", 1], ["E4", 1], ["D4", 2]]),
      phrase([["C4", 1], ["C4", 1], ["G4", 1], ["G4", 1], ["A4", 1], ["A4", 1], ["G4", 2], ["F4", 1], ["F4", 1], ["E4", 1], ["E4", 1], ["D4", 1], ["D4", 1], ["C4", 3]])
    );
    const beat = 0.72;
    let t = ctx.currentTime + 0.1;
    tune.forEach(([note, beats]) => {
      const len = beats * beat;
      [[1, "sine", 1], [2, "triangle", 0.25]].forEach(([mult, type, amp]) => {
        const o = ctx.createOscillator(), gn = ctx.createGain();
        o.type = type; o.frequency.value = N[note] * mult;
        gn.gain.setValueAtTime(0.0001, t);
        gn.gain.exponentialRampToValueAtTime(0.5 * amp, t + 0.012);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(len * 1.8, 1));
        o.connect(gn); gn.connect(master);
        o.start(t); o.stop(t + Math.max(len * 1.8, 1) + 0.05);
      });
      t += len;
    });
    return {
      total: (t - ctx.currentTime) * 1000,
      stop() { try { master.gain.setTargetAtTime(0, ctx.currentTime, 0.15); window.setTimeout(() => ctx.close(), 700); } catch (e) { /* ignore */ } }
    };
  }

  /* ---------------- surprise 1: scratch the group photo ---------------- */

  function stepPhoto() {
    kEl.textContent = "SURPRISE 1 OF 4";
    tEl.textContent = "A memory, wrapped for you";
    bEl.innerHTML = `<div class="s8-frame">
        <span class="s8-stk" style="left:-16px;bottom:30px">\uD83C\uDF80</span><span class="s8-stk" style="right:-14px;top:30px;animation-delay:-1s">\uD83C\uDF88</span><span class="s8-stk" style="right:10px;bottom:6px;animation-delay:-2s">\u2728</span>
        <div class="s8-scratch" id="s8Scr"><div class="s8-photo" id="s8Photo"></div><div class="s8-grade"></div><div class="s8-grain"></div><div class="s8-spot"></div><div class="s8-ring"></div>
          <span class="s8-spk" style="--dx:-26px;--dy:-22px;--dl:0s">\u2726</span><span class="s8-spk" style="--dx:28px;--dy:-18px;--dl:.7s">\u2726</span><span class="s8-spk" style="--dx:-20px;--dy:24px;--dl:1.3s">\u2727</span><span class="s8-spk" style="--dx:24px;--dy:26px;--dl:.4s">\u2661</span>
          <div class="s8-tag">\uD83C\uDF82 ${PHOTO_TAG}</div>
          <canvas class="s8-foil" id="s8Foil"></canvas><div class="s8-hint" id="s8Hint">scratch with your finger \u2726</div></div>
        <p class="s8-fnote">${PHOTO_NOTE}</p>
      </div>
      <p class="s8-cap s8-reveal" id="s8Cap">${CAPTION}</p>`;

    const photo = $("s8Photo"), canvas = $("s8Foil"), hint = $("s8Hint"), cap = $("s8Cap"), scr = $("s8Scr");
    scr.style.setProperty("--fx", `${FOCUS.x}%`);
    scr.style.setProperty("--fy", `${FOCUS.y}%`);
    findPicture(PHOTO, (img) => {
      if (img) {
        photo.style.backgroundImage = `url("${img.src}")`;
        if (img.naturalWidth && img.naturalHeight) scr.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;   // show the whole picture, never crop it
      } else photo.textContent = "your group photo goes here \u2661";
    });

    // a little spotlight: the picture leans in towards her for a moment, then settles back
    let spotTimer = 0;
    const spotlight = () => {
      if (!scr.classList.contains("shown")) return;
      window.clearTimeout(spotTimer);
      scr.classList.add("spot", "zoom");
      spotTimer = window.setTimeout(() => scr.classList.remove("spot", "zoom"), 3400);
    };
    scr.addEventListener("click", (e) => { if (e.target === canvas || !scr.classList.contains("shown")) return;   // ignore the finger lifting after scratching
      if (scr.classList.contains("spot")) { window.clearTimeout(spotTimer); scr.classList.remove("spot", "zoom"); } else spotlight(); });

    window.requestAnimationFrame(() => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");

      const foil = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      foil.addColorStop(0, "#f6d77a"); foil.addColorStop(0.35, "#fff0b8"); foil.addColorStop(0.62, "#e5b948"); foil.addColorStop(1, "#f8e08e");
      ctx.fillStyle = foil; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 280; i++) {
        ctx.fillStyle = `rgba(255,255,255,${rand(0.15, 0.6).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(rand(0, canvas.width), rand(0, canvas.height), rand(1, 3.2) * dpr, 0, 7); ctx.fill();
      }
      ctx.fillStyle = "rgba(120,80,10,.55)";
      ctx.font = `800 ${Math.round(canvas.height * 0.12)}px Nunito, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH ME \u2726", canvas.width / 2, canvas.height / 2 + canvas.height * 0.04);

      let drawing = false, last = null, moves = 0, done = false;
      const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr }; };

      const cleared = () => {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let gone = 0, total = 0;
        for (let i = 3; i < data.length; i += 64) { total += 1; if (data[i] < 40) gone += 1; }
        return gone / total;
      };

      const reveal = () => {
        if (done) return;
        done = true;
        canvas.classList.add("gone");
        hint.remove();
        cap.classList.add("on");
        scr.classList.add("shown");
        window.setTimeout(spotlight, 1500);
        const c = center(); confetti(c.x, c.y, 60, c.w * 0.4, 300);
        cheer();
        window.setTimeout(() => showNext("Next surprise \u203A", () => goTo(1)), 900);
      };

      canvas.addEventListener("pointerdown", (e) => { if (done) return; drawing = true; last = pos(e); canvas.setPointerCapture(e.pointerId); hint.style.opacity = "0"; });
      canvas.addEventListener("pointermove", (e) => {
        if (!drawing || done) return;
        const p = pos(e);
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 46 * dpr;
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        last = p;
        moves += 1;
        if (moves % 10 === 0 && cleared() > 0.5) reveal();
      });
      const stop = () => { drawing = false; if (!done && cleared() > 0.5) reveal(); };
      canvas.addEventListener("pointerup", stop);
      canvas.addEventListener("pointercancel", stop);
    });
  }

  /* ---------------- surprise 2: a song on the record player ---------------- */

  function stepMusic() {
    kEl.textContent = "SURPRISE 2 OF 4";
    tEl.textContent = SONG_TITLE;
    bEl.innerHTML = `<div class="s8-deck" id="s8Deck"><div class="s8-disc"><span class="s8-lbl">\u2661</span></div><div class="s8-arm"></div></div>
      <div class="s8-songrow"><img class="s8-thumb" id="s8Thumb" alt=""><p class="s8-song">${SONG_TITLE}<br><small>${SONG_ARTIST}</small></p></div>
      <div class="s8-bars" id="s8Bars">${"<i></i>".repeat(18)}</div>
      <div class="s8-ctl"><button type="button" class="s8-play" id="s8Play" aria-label="Play">\u25B6</button><div class="s8-track"><i id="s8Fill"></i></div><span class="s8-time" id="s8Time">0:00</span></div>`;

    // the song's cover picture: on the record's centre and as a small thumbnail beside the title
    findPicture(SONG_COVER, (img) => {
      if (!img) return;
      const label = bEl.querySelector(".s8-lbl"), thumb = $("s8Thumb");
      if (label) { label.classList.add("pic"); label.style.backgroundImage = `url("${img.src}")`; }
      if (thumb) { thumb.src = img.src; thumb.classList.add("on"); }
    });

    const deck = $("s8Deck"), bars = $("s8Bars"), playBtn = $("s8Play"), fill = $("s8Fill"), time = $("s8Time");
    let audio = null, box = null, mode = "wait", playing = false, started = 0, total = 0, ticker = null, nextShown = false;

    // try your own song first; if the file is not there, a music-box lullaby plays
    audio = new Audio(SONG);
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => { mode = "file"; }, { once: true });
    audio.addEventListener("error", () => { mode = "box"; }, { once: true });
    window.setTimeout(() => { if (mode === "wait") mode = "box"; }, 1500);

    const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

    const tick = () => {
      let elapsed, length;
      if (mode === "file") { elapsed = audio.currentTime; length = audio.duration || 1; }
      else { elapsed = (performance.now() - started) / 1000; length = total / 1000 || 1; }
      fill.style.width = `${Math.min(100, (elapsed / length) * 100)}%`;
      time.textContent = fmt(elapsed);
      if (elapsed >= length - 0.2) setPlaying(false, true);
      if (!nextShown && elapsed > 5) { nextShown = true; showNext("Next surprise \u203A", () => goTo(2)); }
    };

    function setPlaying(on, ended) {
      playing = on;
      deck.classList.toggle("playing", on);
      bars.classList.toggle("on", on);
      playBtn.textContent = on ? "\u275A\u275A" : "\u25B6";
      playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
      window.clearInterval(ticker);
      if (on) { ticker = window.setInterval(tick, 250); if (window.Music && window.Music.duck) window.Music.duck(true, 0); }
      else {
        if (window.Music && window.Music.duck) window.Music.duck(false);
        if (ended) { fill.style.width = "0%"; time.textContent = "0:00"; if (!nextShown) { nextShown = true; showNext("Next surprise \u203A", () => goTo(2)); } }
      }
    }

    playBtn.addEventListener("click", () => {
      if (playing) {
        if (mode === "file") audio.pause(); else if (box) { box.stop(); box = null; }
        setPlaying(false);
        return;
      }
      if (mode === "file") { audio.play().then(() => { started = performance.now(); setPlaying(true); }).catch(() => { mode = "box"; playBtn.click(); }); return; }
      box = lullaby();
      if (box) { total = box.total; started = performance.now(); setPlaying(true); cheer(); }
    });

    onLeave(() => {
      window.clearInterval(ticker);
      if (audio) audio.pause();
      if (box) { box.stop(); box = null; }
      if (window.Music && window.Music.duck) window.Music.duck(false);
    });
  }

  /* ---------------- surprise 3: the golden medal ---------------- */

  function stepMedal() {
    kEl.textContent = "SURPRISE 3 OF 4";
    tEl.textContent = "A medal for your heart";

    const words = MEDAL_TITLE.split(" ");
    const half = Math.ceil(words.length / 2);
    const line1 = words.slice(0, half).join(" "), line2 = words.slice(half).join(" ");

    bEl.innerHTML = `<button type="button" class="s8-medal" id="s8Medal" aria-label="Touch the medal"><span class="s8-shine"></span>
      <svg viewBox="0 0 200 300" aria-hidden="true">
        <polygon points="62,0 104,0 120,128 80,128" fill="#ff8fb3"/><polygon points="96,0 138,0 122,128 82,128" fill="#b49af2"/>
        <g class="disc"><circle cx="100" cy="190" r="62" fill="url(#s8Gold)" stroke="#b9791a" stroke-width="3"/><circle cx="100" cy="190" r="50" fill="none" stroke="#b9791a" stroke-width="2" stroke-dasharray="3 5"/>
          <path d="M100 150l9 20 22 2-17 14 5 22-19-12-19 12 5-22-17-14 22-2z" fill="#fff6c8" stroke="#b9791a" stroke-width="1.6" stroke-linejoin="round"/>
          <text x="100" y="${line2 ? 218 : 224}" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="13" fill="#7a4a0c">${line1}</text>
          ${line2 ? `<text x="100" y="233" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="13" fill="#7a4a0c">${line2}</text>` : ""}
        </g></svg></button>
      <p class="s8-sm" id="s8Hint2">Touch the medal \u2726</p>
      <p class="s8-cap s8-reveal" id="s8MedalText" style="font-size:clamp(20px,3.2vw,26px)">${MEDAL_TEXT}</p>`;

    const medal = $("s8Medal"), text = $("s8MedalText"), hint = $("s8Hint2");
    let done = false;
    medal.addEventListener("click", () => {
      if (done) return;
      done = true;
      hint.remove();
      medal.classList.add("spin");
      window.setTimeout(() => {
        medal.classList.add("won");
        text.classList.add("on");
        const c = center(); confetti(c.x, c.y, 70, c.w * 0.4, 320);
        cheer();
      }, 1400);
      window.setTimeout(() => showNext("Last surprise \u203A", () => goTo(3)), 2800);
    });
  }

  /* ---------------- surprise 4: the key ---------------- */

  function stepKey() {
    kEl.textContent = "SURPRISE 4 OF 4";
    tEl.textContent = "One last thing";
    bEl.innerHTML = `<div class="s8-keywrap"><span class="s8-keyglow"></span>
      <button type="button" class="s8-key" id="s8Key" aria-label="Turn the key"><svg viewBox="0 0 300 130" aria-hidden="true">
        <path fill-rule="evenodd" d="M60 14a46 46 0 1 0 0 92a46 46 0 0 0 0-92zm0 24a22 22 0 1 1 0 44a22 22 0 0 1 0-44z" fill="url(#s8Gold)" stroke="#b9791a" stroke-width="2.5"/>
        <path d="M60 52c-6-8-14-3-9 4l9 9 9-9c5-7-3-12-9-4z" fill="#ff8fb3"/>
        <rect x="100" y="52" width="160" height="18" rx="9" fill="url(#s8Gold)" stroke="#b9791a" stroke-width="2.5"/>
        <rect x="92" y="44" width="16" height="34" rx="6" fill="url(#s8Gold)" stroke="#b9791a" stroke-width="2.5"/>
        <rect x="208" y="68" width="16" height="32" rx="3" fill="url(#s8Gold)" stroke="#b9791a" stroke-width="2.5"/>
        <rect x="236" y="68" width="16" height="22" rx="3" fill="url(#s8Gold)" stroke="#b9791a" stroke-width="2.5"/></svg></button></div>
      <p class="s8-cap" style="font-size:clamp(22px,3.4vw,28px)">${KEY_TEXT}</p>`;

    const key = $("s8Key");
    let used = false;
    showNext("Use the key \u2726", useKey);
    key.addEventListener("click", useKey);

    function useKey() {
      if (used) return;
      used = true;
      nextBtn.hidden = true;
      key.classList.add("turn");
      window.setTimeout(() => flash.classList.add("go"), 700);
      window.setTimeout(() => { window.Screens.go("screen9"); }, 1900);
      window.setTimeout(() => { flash.classList.remove("go"); overlay.classList.remove("show"); }, 3000);
    }
  }

  /* ---------------- moving through the surprises ---------------- */

  const steps = [stepPhoto, stepMusic, stepMedal, stepKey];
  let current = -1;

  function goTo(i) {
    leaveHooks.forEach((fn) => fn());
    leaveHooks = [];
    nextBtn.hidden = true;
    nextBtn.onclick = null;

    [...prog.children].forEach((dot, n) => { dot.classList.toggle("done", n < i); dot.classList.toggle("now", n === i); });

    card.classList.add("swap");
    window.setTimeout(() => {
      current = i;
      steps[i]();
      card.classList.remove("swap");
      card.scrollTop = 0;
    }, current < 0 ? 0 : 480);
  }

  /* ---------------- opening the gift ---------------- */

  let opened = false;

  function openGift() {
    if (opened) return;
    opened = true;
    gift.classList.add("open");
    $("s8Title").textContent = "Look at that\u2026";
    $("s8Line").textContent = "Four little surprises, just for you.";

    const r = gift.getBoundingClientRect(), s = screen.getBoundingClientRect();
    window.setTimeout(() => confetti(r.left - s.left + r.width / 2, r.top - s.top + r.height * 0.3, 80, s.width * 0.4, 420), 450);
    window.setTimeout(cheer, 600);
    window.setTimeout(() => { overlay.classList.add("show"); goTo(0); }, 2200);
  }

  gift.addEventListener("click", openGift);

})();
