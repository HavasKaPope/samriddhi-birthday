/* ==========================================
   ELEMENT 3 — "THE ROOM IS WAITING FOR YOU"
========================================== */

(() => {
  const screen = document.getElementById("screen3");
  const sky = document.getElementById("s3Stars");
  const lightsButton = document.getElementById("s3Lights");
  const nextButton = document.getElementById("s3Next");

  if (!screen || !sky || !lightsButton || !nextButton) {
    console.error("Element 3: check the HTML element IDs.");
    return;
  }

  const name = (window.CONFIG && window.CONFIG.name) || "you";

  /* ---- stars ---- */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const starCount = window.innerWidth < 600 ? 55 : 95;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("span");
    star.className = "s3-star";
    star.style.setProperty("--x", `${rand(0, 100).toFixed(1)}%`);
    star.style.setProperty("--y", `${rand(0, 100).toFixed(1)}%`);
    star.style.setProperty("--z", `${rand(1, 3).toFixed(1)}px`);
    star.style.setProperty("--d", `${rand(2, 6).toFixed(1)}s`);
    star.style.setProperty("--dl", `${(-rand(0, 6)).toFixed(1)}s`);
    sky.appendChild(star);
  }

  /* ---- fade the words out, swap them, fade them back in ---- */
  const whisper = screen.querySelector(".s3-whisper");
  const title = screen.querySelector(".s3-title");
  const sub = screen.querySelector(".s3-sub");

  function swapWords(newWhisper, newTitle, newSub) {
    [whisper, title, sub].forEach((el) => el.classList.add("s3-fade"));

    window.setTimeout(() => {
      whisper.textContent = newWhisper;
      title.innerHTML = newTitle;
      sub.textContent = newSub;
      [whisper, title, sub].forEach((el) => el.classList.remove("s3-fade"));
    }, 500);
  }

  /* ---- the bloom: a soft circle of light growing from the top-left ---- */
  const bloom = screen.querySelector(".s3-bloom");

  function runBloom(delay, duration) {
    const diagonal = Math.hypot(window.innerWidth, window.innerHeight);
    const maxRadius = diagonal * 1.5;

    function setRadius(progress) {
      const eased = 1 - Math.pow(1 - progress, 3);
      const outer = eased * maxRadius;
      bloom.style.setProperty("--r2", `${outer}px`);
      bloom.style.setProperty("--r1", `${outer * 0.7}px`);
    }

    const startTime = performance.now() + delay;

    function frame(now) {
      const progress = Math.min(Math.max((now - startTime) / duration, 0), 1);
      setRadius(progress);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ==========================================
     THE BEAR (built here, so this one file is enough)
     asleep → surprised → super happy with arms up + confetti
  ========================================== */

  const bear = screen.querySelector(".s3-bear");

  const BEAR_STYLE = `
    .s3-bear svg { overflow: visible; }
    .b-open, .b-brows, .b-mouth-o, .b-joyeyes, .b-grin, .b-arm { display: none; }
    .s3-bear.awake .b-closed, .s3-bear.joy .b-closed { display: none; }
    .s3-bear.awake .b-open, .s3-bear.awake .b-brows, .s3-bear.awake .b-mouth-o { display: inline; }
    .s3-bear.awake .b-smile, .s3-bear.joy .b-smile { display: none; }
    .s3-bear.joy .b-joyeyes, .s3-bear.joy .b-grin, .s3-bear.joy .b-arm { display: inline; }
    .s3-bear.joy .b-cheek { transform-box: fill-box; transform-origin: center; transform: scale(1.3); }

    .b-hat, .b-arm { transform-box: fill-box; }
    .b-hat { transform-origin: 50% 100%; }
    .b-arm { transform-origin: 50% 100%; }

    .s3-bear.awake { animation: s3Breathe 4s ease-in-out infinite, s3Jump .8s ease 1; }
    .s3-bear.awake .b-hat { animation: s3Hat .9s ease 1; }
    @keyframes s3Jump { 0% { translate: 0 0; } 30% { translate: 0 -40px; } 55% { translate: 0 0; } 72% { translate: 0 -12px; } 100% { translate: 0 0; } }
    @keyframes s3Hat { 25% { transform: rotate(-16deg); } 50% { transform: rotate(12deg); } 75% { transform: rotate(-7deg); } }

    .s3-bear.awake .s3-bang { animation: s3Bang 1.4s ease 1 forwards; }
    .s3-bang { position: absolute; left: 50%; top: -34px; color: #ff4f7b; font: 800 44px/1 "Nunito", sans-serif;
      text-shadow: 0 0 14px rgba(255, 79, 123, .5); opacity: 0; transform: translateX(-50%) scale(0); pointer-events: none; }
    @keyframes s3Bang { 0% { opacity: 0; transform: translateX(-50%) scale(0) rotate(-20deg); } 15% { opacity: 1; transform: translateX(-50%) scale(1.4) rotate(8deg); }
      28% { transform: translateX(-50%) scale(1); } 80% { opacity: 1; } 100% { opacity: 0; transform: translateX(-50%) scale(1); } }

    /* super happy: arms up and waving, little dance */
    .s3-bear.joy { animation: s3Breathe 4s ease-in-out infinite, s3Dance .5s ease-in-out infinite alternate; }
    @keyframes s3Dance { from { translate: 0 0; rotate: -3deg; } to { translate: 0 -16px; rotate: 3deg; } }
    .s3-bear.joy .b-arm { animation: s3ArmUp .55s cubic-bezier(.3, 1.7, .5, 1) backwards, s3Wave .5s ease-in-out .55s infinite alternate; }
    .s3-bear.joy .b-armR { animation: s3ArmUp .55s cubic-bezier(.3, 1.7, .5, 1) .1s backwards, s3Wave .5s ease-in-out .65s infinite alternate-reverse; }
    @keyframes s3ArmUp { from { transform: scaleY(0); } }
    @keyframes s3Wave { from { transform: rotate(-16deg); } to { transform: rotate(16deg); } }

    .s3-spark { position: absolute; color: #ffd76a; font-size: 24px; opacity: 0; pointer-events: none; text-shadow: 0 0 10px #ffd76a; }
    .s3-spark.p1 { left: -14%; top: 0; } .s3-spark.p2 { right: -16%; top: -4%; } .s3-spark.p3 { left: -22%; top: 42%; } .s3-spark.p4 { right: -20%; top: 38%; }
    .s3-bear.joy .s3-spark { animation: s3Spark 1.1s ease-in-out infinite; }
    .s3-bear.joy .s3-spark.p2 { animation-delay: .3s; } .s3-bear.joy .s3-spark.p3 { animation-delay: .6s; } .s3-bear.joy .s3-spark.p4 { animation-delay: .15s; }
    @keyframes s3Spark { 0%, 100% { opacity: 0; scale: .4; } 50% { opacity: 1; scale: 1.2; } }
    .s3-bear.joy .s3-zzz, .s3-bear.awake .s3-zzz { display: none; }

    .s3-conf { position: fixed; left: var(--x); top: var(--y); z-index: 60; width: var(--w); height: calc(var(--w) * 1.5);
      background: var(--c); border-radius: 2px; pointer-events: none; animation: s3Conf var(--d) cubic-bezier(.2, .7, .4, 1) forwards; }
    .s3-conf.glyph { width: auto; height: auto; background: none; color: var(--c); font-size: var(--w); line-height: 1; text-shadow: 0 0 8px currentColor; }
    @keyframes s3Conf { 0% { opacity: 1; transform: translate(0, 0) rotate(0); }
      35% { opacity: 1; transform: translate(calc(var(--dx) * .8), var(--up)) rotate(calc(var(--r) * .4)); }
      100% { opacity: 0; transform: translate(var(--dx), var(--fall)) rotate(var(--r)); } }
  `;

  const BEAR_HTML = `
    <span class="s3-bang" aria-hidden="true">!</span>
    <span class="s3-zzz">z</span><span class="s3-zzz z2">Z</span>
    <span class="s3-spark p1">\u2726</span><span class="s3-spark p2">\u2727</span><span class="s3-spark p3">\u2726</span><span class="s3-spark p4">\u2727</span>
    <svg viewBox="0 0 160 170" xmlns="http://www.w3.org/2000/svg">
      <g class="b-arm b-armL"><ellipse cx="6" cy="92" rx="11" ry="40" transform="rotate(-12 6 92)" fill="#f0c08a" stroke="#c98a4e" stroke-width="2.5"/><circle cx="-4" cy="46" r="13" fill="#f0c08a" stroke="#c98a4e" stroke-width="2.5"/><circle cx="-4" cy="46" r="6.5" fill="#ff8fae"/></g>
      <g class="b-arm b-armR"><ellipse cx="154" cy="92" rx="11" ry="40" transform="rotate(12 154 92)" fill="#f0c08a" stroke="#c98a4e" stroke-width="2.5"/><circle cx="164" cy="46" r="13" fill="#f0c08a" stroke="#c98a4e" stroke-width="2.5"/><circle cx="164" cy="46" r="6.5" fill="#ff8fae"/></g>
      <circle cx="40" cy="64" r="19" fill="#e2a96f"/><circle cx="40" cy="64" r="10" fill="#f6d3b0"/>
      <circle cx="120" cy="64" r="19" fill="#e2a96f"/><circle cx="120" cy="64" r="10" fill="#f6d3b0"/>
      <ellipse cx="80" cy="104" rx="53" ry="47" fill="#f0c08a"/>
      <g class="b-hat"><polygon points="80,10 56,58 104,58" fill="#f7a8c8"/><polygon points="80,10 68,34 92,34" fill="#fff0f6" opacity=".55"/><circle cx="80" cy="9" r="7" fill="#ffe08a"/></g>
      <ellipse cx="80" cy="118" rx="21" ry="15" fill="#fbe3c4"/>
      <ellipse cx="80" cy="110" rx="6.5" ry="4.8" fill="#7a4a3a"/>
      <g class="b-smile"><path d="M73 120q7 7 14 0" stroke="#7a4a3a" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g class="b-closed"><path d="M54 98q8 8 17 0M89 98q8 8 17 0" stroke="#7a4a3a" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>
      <g class="b-open"><circle cx="63" cy="97" r="9.5" fill="#fff"/><circle cx="97" cy="97" r="9.5" fill="#fff"/><circle cx="63" cy="98.5" r="5" fill="#3a2230"/><circle cx="97" cy="98.5" r="5" fill="#3a2230"/><circle cx="65" cy="96" r="1.8" fill="#fff"/><circle cx="99" cy="96" r="1.8" fill="#fff"/></g>
      <path class="b-brows" d="M52 80q10-8 21-2M87 78q11-6 21 2" stroke="#7a4a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse class="b-mouth-o" cx="80" cy="124" rx="5.5" ry="7.5" fill="#7a4a3a"/>
      <g class="b-joyeyes"><path d="M53 101q9-13 19 0M88 101q9-13 19 0" stroke="#7a4a3a" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g class="b-grin"><path d="M63 115q17 28 34 0z" fill="#7a4a3a"/><path d="M71 126q9-7 18 0q-9 8-18 0z" fill="#ff7a9a"/></g>
      <circle class="b-cheek" cx="50" cy="114" r="8" fill="#f59ab3" opacity=".7"/><circle class="b-cheek" cx="110" cy="114" r="8" fill="#f59ab3" opacity=".7"/>
      <ellipse cx="80" cy="158" rx="40" ry="12" fill="#e2a96f"/>
    </svg>`;

  if (bear) {
    const style = document.createElement("style");
    style.textContent = BEAR_STYLE;
    document.head.appendChild(style);
    bear.innerHTML = BEAR_HTML;
  }

  /* confetti, hearts and sparkles shooting out of the bear */
  function burst(count) {
    if (!bear) return;
    const box = bear.getBoundingClientRect();
    const x0 = box.left + box.width * 0.5;
    const y0 = box.top + box.height * 0.3;
    const spread = window.innerWidth < 600 ? 0.6 : 1;
    const colors = ["#ff8fb3", "#b49af2", "#ffd76a", "#ff7aa2", "#8fd3ff", "#ffffff"];
    const glyphs = ["\u2661", "\u2665", "\u2726", "\u2727"];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      const glyph = i % 4 === 0;
      piece.className = "s3-conf" + (glyph ? " glyph" : "");
      if (glyph) piece.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

      piece.style.setProperty("--x", `${x0}px`);
      piece.style.setProperty("--y", `${y0}px`);
      piece.style.setProperty("--w", glyph ? `${rand(16, 28).toFixed(0)}px` : `${rand(6, 11).toFixed(0)}px`);
      piece.style.setProperty("--c", colors[Math.floor(Math.random() * colors.length)]);
      piece.style.setProperty("--dx", `${(rand(-1, 1) * 260 * spread + 120 * spread).toFixed(0)}px`);
      piece.style.setProperty("--up", `${(-rand(110, 260)).toFixed(0)}px`);
      piece.style.setProperty("--fall", `${rand(80, 300).toFixed(0)}px`);
      piece.style.setProperty("--r", `${rand(-540, 540).toFixed(0)}deg`);
      piece.style.setProperty("--d", `${rand(1.8, 2.8).toFixed(2)}s`);
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 3000);
    }
  }

  function wakeBear() {
    if (!bear) return;
    window.setTimeout(() => bear.classList.add("awake"), 900);              // wakes, surprised
    window.setTimeout(() => {                                                // super happy
      bear.classList.remove("awake");
      bear.classList.add("joy");
      burst(46);
    }, 2300);
    window.setTimeout(() => burst(34), 3300);
    window.setTimeout(() => burst(26), 4600);
  }

  /* ---- turn on the lights ---- */
  let lit = false;

  lightsButton.addEventListener("click", () => {
    if (lit) return;
    lit = true;

    lightsButton.disabled = true;
    screen.classList.add("lit");

    wakeBear();

    // the tap that turns on the lights also starts the music (on by default)
    if (window.Music) { window.Music.show(); window.Music.start(); }

    runBloom(500, 3600);
    lightsButton.classList.add("s3-btn-out");

    window.setTimeout(() => { lightsButton.hidden = true; }, 600);

    window.setTimeout(() => {
      swapWords(
        "Welcome…",
        `There you are,<br>${name} ♡`,
        "Come in… everything here is for you."
      );
    }, 5600);

    // the Next button only appears once the lights are on
    window.setTimeout(() => { nextButton.hidden = false; }, 7600);
  });

  /* ---- Next → Element 4 ---- */
  nextButton.addEventListener("click", () => {
    nextButton.disabled = true;
    if (window.Curtain) window.Curtain.play("screen4");
    else window.Screens.go("screen4");
  });
})();
