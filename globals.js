/* ==========================================
   GLOBAL BUTTONS: MUSIC (G2) + NOTE PAD (G3)
   Put your song at:  assets/audio/music.mp3
========================================== */

(() => {
  const musicButton = document.getElementById("musicButton");
  const noteButton = document.getElementById("noteButton");
  const noteModal = document.getElementById("noteModal");

  if (!musicButton || !noteButton || !noteModal) {
    console.error("Global buttons: check the HTML element IDs.");
    return;
  }

  /* fade a button in after it is un-hidden */
  function reveal(button) {
    if (!button.hidden) return;
    button.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => button.classList.add("show")));
  }

  /* ------------------------------------------
     G2 — MUSIC (ON by default)
  ------------------------------------------ */

  const TARGET_VOLUME = 0.6;
  const audio = new Audio("assets/audio/music.mp3");
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;

  let enabled = true;   // default: music is ON
  let started = false;
  let fadeTimer = null;

  function fadeTo(volume, ms, done) {
    window.clearInterval(fadeTimer);
    const from = audio.volume;
    const begin = performance.now();

    fadeTimer = window.setInterval(() => {
      const t = Math.min((performance.now() - begin) / ms, 1);
      audio.volume = Math.max(0, Math.min(1, from + (volume - from) * t));
      if (t >= 1) {
        window.clearInterval(fadeTimer);
        if (done) done();
      }
    }, 50);
  }

  function play() {
    const attempt = audio.play();
    if (attempt && attempt.then) {
      attempt.then(() => fadeTo(TARGET_VOLUME, 2500)).catch(() => {
        // the browser wanted a tap first, or the file is missing: try again on the next tap
        started = false;
      });
    }
  }

  function paintMusicButton() {
    musicButton.classList.toggle("on", enabled);
    musicButton.classList.toggle("off", !enabled);
    musicButton.setAttribute("aria-pressed", String(enabled));
    musicButton.setAttribute("aria-label", enabled ? "Turn the music off" : "Turn the music on");
  }

  const Music = {
    show() { reveal(musicButton); },

    // quieten the background music while something special plays (true = quiet, false = normal)
    duck(on, level) {
      if (!started || !enabled) return;
      fadeTo(on ? (level === undefined ? 0.12 : level) : TARGET_VOLUME, 900);
    },

    // call this from a tap: browsers only allow sound after one
    start() {
      if (started) return;
      started = true;
      if (enabled) play();
    }
  };

  window.Music = Music;
  paintMusicButton();

  musicButton.addEventListener("click", () => {
    enabled = !enabled;
    paintMusicButton();

    if (enabled) {
      started = true;
      play();
    } else {
      fadeTo(0, 600, () => audio.pause());
    }
  });

  // if a tap was needed first, the next tap anywhere starts the music
  document.addEventListener("pointerdown", () => {
    if (enabled && !started && !musicButton.hidden) Music.start();
  });

  // pause when the tab is hidden, continue when she comes back
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) audio.pause();
    else if (enabled && started) audio.play().catch(() => {});
  });

  /* ------------------------------------------
     G3 — NOTE PAD
  ------------------------------------------ */

  const cfg = window.CONFIG || {};
  const text = document.getElementById("noteText");
  const sign = document.getElementById("noteSign");
  if (text && cfg.note) text.textContent = cfg.note;
  if (sign && cfg.noteSign) sign.textContent = cfg.noteSign;

  // a friend peeking over the top of the note
  const paper = noteModal.querySelector(".g-note-paper");
  if (!window.Mates) console.warn("Note pad: the cartoon mates are missing. Replace screens.js");
  if (paper && window.Mates) {
    const peek = document.createElement("span");
    peek.className = "g-mate";
    peek.setAttribute("aria-hidden", "true");
    peek.innerHTML = window.Mates.svg("cat", true);
    paper.appendChild(peek);
  }

  function openNote() {
    noteModal.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => noteModal.classList.add("open")));
    const badge = noteButton.querySelector(".badge");
    if (badge) badge.remove();
  }

  function closeNote() {
    noteModal.classList.remove("open");
    window.setTimeout(() => { noteModal.hidden = true; }, 380);
  }

  noteButton.addEventListener("click", openNote);
  noteModal.querySelector(".g-note-close").addEventListener("click", closeNote);
  noteModal.addEventListener("click", (event) => {
    if (event.target === noteModal) closeNote();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !noteModal.hidden) closeNote();
  });

  /* the note button appears from Element 4 onward */
  document.addEventListener("screen:enter", (event) => {
    const id = event.detail && event.detail.id;
    if (id && id !== "screen3") reveal(noteButton);
  });
})();
/* ==========================================
   CURTAIN TRANSITION
   Curtain.play("screen4")  → closes, welcomes her, then opens on screen4
========================================== */

(() => {
  const wrap = document.getElementById("curtain");
  const text = document.getElementById("curtainText");
  let busy = false;

  // timings in milliseconds — change here
  const CLOSE_TIME = 1000;   // curtains sweep shut
  const HOLD_TIME = 1500;    // welcome message stays
  const OPEN_TIME = 1700;    // curtains part
  const FADE_TIME = 600;

  const setState = (state) => { wrap.className = `curtain ${state}`; };

  window.Curtain = {
    play(target) {
      if (!wrap || busy) {
        if (!wrap) window.Screens.go(target);
        return;
      }
      busy = true;

      const name = (window.CONFIG && window.CONFIG.name) || "you";
      text.innerHTML = `Welcome,<br>${name} \u2661`;

      // 1. curtains wait off-screen, then sweep shut
      setState("out");
      wrap.hidden = false;
      void wrap.offsetWidth;                 // let the browser notice the start position
      setState("closed");

      // 2. welcome message glows
      window.setTimeout(() => setState("closed hold"), CLOSE_TIME);

      // 3. swap the screen behind the closed curtains, then part them
      window.setTimeout(() => {
        window.Screens.go(target, { instant: true });
        setState("open");
      }, CLOSE_TIME + HOLD_TIME);

      // 4. curtains fade away and are removed
      window.setTimeout(() => setState("open fade"), CLOSE_TIME + HOLD_TIME + OPEN_TIME);
      window.setTimeout(() => {
        wrap.hidden = true;
        busy = false;
      }, CLOSE_TIME + HOLD_TIME + OPEN_TIME + FADE_TIME);
    }
  };
})();
/* ==========================================
   CARTOON MATES — her friends at the party
   Mates.svg("bunny")  → returns a drawing as SVG text
   kinds: bunny, cat, panda, puppy, bear
========================================== */

window.Mates = (() => {
  const OUT = "#00000018";

  const eyes = (fill, shine) =>
    `<circle cx="38" cy="62" r="4.2" fill="${fill}"/><circle cx="62" cy="62" r="4.2" fill="${fill}"/>` +
    `<circle cx="39.4" cy="60.6" r="1.5" fill="${shine}"/><circle cx="63.4" cy="60.6" r="1.5" fill="${shine}"/>`;

  const mouth =
    `<path d="M44 76q6 6 12 0" stroke="#7a4a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<circle cx="28" cy="72" r="5.5" fill="#ff9ab4" opacity=".6"/><circle cx="72" cy="72" r="5.5" fill="#ff9ab4" opacity=".6"/>`;

  const nose = (c) => `<ellipse cx="50" cy="70" rx="4.5" ry="3.2" fill="${c}"/>`;

  const hat = (c) =>
    `<polygon points="50,5 38,36 62,36" fill="${c}"/><circle cx="50" cy="5" r="4.5" fill="#ffe08a"/>` +
    `<path d="M42 27l16-5" stroke="#fff" stroke-width="2" opacity=".55"/>`;

  const kinds = {
    bunny: {
      head: "#fffaf8", paw: "#fffaf8", hat: "#b49af2", nose: "#ff8fb0", eye: "#3a2230", shine: "#fff",
      ears:
        `<ellipse cx="33" cy="24" rx="9" ry="23" fill="#fffaf8" stroke="#ecd3dc" stroke-width="1.5"/><ellipse cx="33" cy="26" rx="4.5" ry="15" fill="#ffc2d4"/>` +
        `<ellipse cx="67" cy="24" rx="9" ry="23" fill="#fffaf8" stroke="#ecd3dc" stroke-width="1.5"/><ellipse cx="67" cy="26" rx="4.5" ry="15" fill="#ffc2d4"/>`,
      extra: ""
    },
    cat: {
      head: "#ffc58a", paw: "#ffc58a", hat: "#ff8fb3", nose: "#ff8fb0", eye: "#3a2230", shine: "#fff",
      ears:
        `<polygon points="19,48 22,14 46,34" fill="#ffc58a" stroke="#e8a566" stroke-width="1.5"/><polygon points="81,48 78,14 54,34" fill="#ffc58a" stroke="#e8a566" stroke-width="1.5"/>` +
        `<polygon points="25,40 26,22 38,33" fill="#ff9ab4"/><polygon points="75,40 74,22 62,33" fill="#ff9ab4"/>`,
      extra:
        `<path d="M44 42v7M50 40v9M56 42v7" stroke="#f09a50" stroke-width="2.4" stroke-linecap="round"/>` +
        `<path d="M14 68h12M14 74l11-2M86 68H74M86 74l-11-2" stroke="#b97a45" stroke-width="1.6" stroke-linecap="round"/>`
    },
    panda: {
      head: "#ffffff", paw: "#3a2a3a", hat: "#ffb3c9", nose: "#3a2a3a", eye: "#ffffff", shine: "#3a2230",
      ears: `<circle cx="24" cy="40" r="11" fill="#3a2a3a"/><circle cx="76" cy="40" r="11" fill="#3a2a3a"/>`,
      extra:
        `<ellipse cx="37" cy="62" rx="8" ry="9.5" transform="rotate(-18 37 62)" fill="#3a2a3a"/>` +
        `<ellipse cx="63" cy="62" rx="8" ry="9.5" transform="rotate(18 63 62)" fill="#3a2a3a"/>`
    },
    puppy: {
      head: "#f0c08a", paw: "#f0c08a", hat: "#8fd3c8", nose: "#3a2230", eye: "#3a2230", shine: "#fff",
      ears:
        `<ellipse cx="19" cy="58" rx="10" ry="21" transform="rotate(14 19 58)" fill="#b9814f"/>` +
        `<ellipse cx="81" cy="58" rx="10" ry="21" transform="rotate(-14 81 58)" fill="#b9814f"/>`,
      extra: `<ellipse cx="64" cy="60" rx="9" ry="10" fill="#d89c64"/><path d="M46 77q4 10 8 0z" fill="#ff7a9a"/>`
    },
    bear: {
      head: "#f0c08a", paw: "#f0c08a", hat: "#f7a8c8", nose: "#7a4a3a", eye: "#3a2230", shine: "#fff",
      ears:
        `<circle cx="24" cy="40" r="11" fill="#e2a96f"/><circle cx="24" cy="40" r="5.5" fill="#f6d3b0"/>` +
        `<circle cx="76" cy="40" r="11" fill="#e2a96f"/><circle cx="76" cy="40" r="5.5" fill="#f6d3b0"/>`,
      extra: `<ellipse cx="50" cy="72" rx="12" ry="9" fill="#fbe3c4"/>`
    }
  };

  function svg(kind, wave) {
    const k = kinds[kind] || kinds.bear;
    const waving = wave
      ? `<g class="e2-wave"><ellipse cx="88" cy="76" rx="7" ry="12" transform="rotate(22 88 76)" fill="${k.paw}" stroke="${OUT}"/></g>`
      : "";

    return `<svg viewBox="0 0 100 112" aria-hidden="true">` +
      k.ears +
      `<ellipse cx="50" cy="64" rx="34" ry="29" fill="${k.head}" stroke="${OUT}" stroke-width="1.5"/>` +
      k.extra + hat(k.hat) + eyes(k.eye, k.shine) + nose(k.nose) + mouth +
      `<ellipse cx="30" cy="102" rx="11" ry="8" fill="${k.paw}" stroke="${OUT}"/>` +
      `<ellipse cx="70" cy="102" rx="11" ry="8" fill="${k.paw}" stroke="${OUT}"/>` +
      waving + `</svg>`;
  }

  return { svg, kinds: Object.keys(kinds) };
})();
