/* ==========================================
   SCREEN MANAGER + PROJECT SETTINGS
   Every element from 3 onward uses this.
========================================== */

/* Settings used across all elements */
window.CONFIG = {
  name: "Samriddhi",

  // the short note inside the note-pad button (bottom-left)
  note: "Samriddhi, this little notepad will remind you that I will always be there for you in the times of need \u2661",
  noteSign: "\u2014 with love",

  // PHOTOS: put your pictures in the folder  assets/images  with these names.
  // Write the name WITHOUT the ending (.jpg / .png / .jpeg / .webp are all found automatically).
  photos: {
    memory: "assets/images/memory",   // slot 1: passcode screen  ("Your favourite memory")
    people: "assets/images/people"    // slot 2: the open book    ("my favourite people")
  },

  // MAKE A WISH (element 6)
  wish: {
    seconds: 12,                                   // how long the quiet wishing moment lasts
    afterTitle: "Your wish is on its way \u2661",
    afterText: "Whatever you wished for, I am wishing it for you too.",
    cheers: ["Yay! \u2661", "Wish made!", "Go, you!"]      // what three friends say when she finishes
  },

  // THE BIG GIFT (element 8)
  gift: {
    photo: "assets/images/group",                 // landscape group photo (group.jpg / .png / .webp), hidden under scratch foil
    photoCaption: "The day you were part of the picture \u2661",
    song: "assets/audio/song.mp3",                // your song file. If missing, a soft music-box lullaby plays instead
    songTitle: "A song for you",
    songArtist: "chosen with love",
    songCover: "assets/images/song-cover",         // optional: the song's cover picture (song-cover.jpg), shown on the record and as a thumbnail
    medalTitle: "Bravest Heart",
    medalText: "For every time you kept going, even when it was hard. The best things about you were never going to fit on any list \u2661",
    keyText: "This key opens a place that is always yours. Keep it close \u2661"
  },

  // THE CAKE (element 7)
  cake: {
    background: "assets/images/cake-bg",     // optional: your own party photo/art (name it cake-bg.jpg). The animated decorations play on top
    song: "assets/audio/birthday.mp3",     // optional: your own song file. If missing, a music-box tune plays instead
    friendsSay: ["Yummy!", "Thank you!", "So good!", "Best day!", "Mmm \u2661", "More please!"],
    finalTitle: "Cheers, Samriddhi!",
    finalText: "Every candle lit, every slice shared. This day is yours \u2661"
  },

  // THE LETTER (element 5). Each line in the list is one paragraph.
  // Put **two stars** around words you want highlighted with a marker pen.
  letter: {
    paragraphs: [
      "Today is **your day**, and I wanted to tell you something I never say out loud.",
      "You are **brave**. You are **kind**. You are **stronger** than you think, and you are **loved** more than you know and at the end **thanks** a lot for being my **best friend** and for being there for me in the time of need. I will be grateful for this **forever**\u2661 ",
      "Thank you for every laugh and every **tiny moment** that made our classroom brighter. Never stop shining \u2661"
    ],
    sign: "\u2014 with love"
  },

  // THE ENDING (element 9, the beach). All of these are optional: delete a line to use the built-in default.
  ending: {
    title: "Happy Birthday, Samriddhi",
    sign: "\u2014 with love",
    message: [
      "I don't know how it will all go, but I tried my best to make this special.",
      "It's our last phase of school, and after that we will be separated. That's why I tried something different.",
      "And yeah, be always happy \u2661"
    ],
    // the little spoken wish. If you add assets/audio/voice.mp3 it plays that file instead of the phone's voice.
    voiceText: "Happy birthday, Samriddhi! You are so special, and every day with you is a happy one. I hope your day is full of smiles, sweets and big, big hugs. Never stop shining. We love you!",
    notes: [
      { when: "you feel sad", text: "It's okay to have a heavy day. It will pass, and we are right here for you \u2661" },
      { when: "you miss us", text: "Look at the photo, hum our song, and remember that distance never changes friends \u2661" },
      { when: "you can't sleep", text: "Take a deep breath. Think of one happy memory we made. Sleep well, Samriddhi \u2661" },
      { when: "you need a smile", text: "Remember the day of the picture? You laughed the loudest. Do that again \u2661" }
    ],
    cardLine: "Don't forget to smile \u2726"
  }
};

/* Download the fonts Element 3 needs NOW, while she is typing the code,
   so nothing has to load at the moment the screen changes. */
if (document.fonts && document.fonts.load) {
  ['700 40px "Playfair Display"', '700 30px "Dancing Script"', '800 16px "Nunito"']
    .forEach((font) => document.fonts.load(font, "Aa").catch(() => {}));
}

(() => {
  const Screens = {
    current: document.getElementById("passcodeScene"),

    // Smoothly move from the current screen to another one.
    // Usage:  Screens.go("screen4");
    go(target, options = {}) {
      const next = typeof target === "string" ? document.getElementById(target) : target;
      if (!next || next === this.current) return;

      const prev = this.current;
      this.current = next;

      // behind the curtain: swap at once, no fading
      if (options.instant) {
        prev.hidden = true;
        next.hidden = false;
        next.dispatchEvent(new CustomEvent("screen:enter", { bubbles: true, detail: { id: next.id } }));
        return;
      }

      next.hidden = false;
      next.classList.add("screen-in");
      next.addEventListener("animationend", (event) => {
        if (event.target === next) next.classList.remove("screen-in");
      });

      prev.classList.add("screen-out");
      window.setTimeout(() => {
        prev.hidden = true;
        prev.classList.remove("screen-out");
      }, 950);

      next.dispatchEvent(new CustomEvent("screen:enter", { bubbles: true, detail: { id: next.id } }));
    }
  };

  window.Screens = Screens;

  // Correct passcode → brief pause so "Unlocked!" is seen → Element 3
  document.addEventListener("passcode:unlocked", () => {
    window.setTimeout(() => Screens.go("screen3"), 250);
  });
})();


/* ==========================================
   FONT CHECKER — open the page with  #fonts  at the end of the address
   e.g.  http://127.0.0.1:5500/index.html#fonts
   It shows which fonts really loaded (green = OK, red = failed).
========================================== */
if (window.location.hash === "#fonts" && document.fonts) {
  window.addEventListener("load", () => {
    const faces = [...document.fonts];
    Promise.all(faces.map((face) => face.load().catch(() => null))).then(() => {
      const panel = document.createElement("div");
      panel.style.cssText =
        "position:fixed;left:8px;top:8px;z-index:99999;max-width:92vw;max-height:92vh;overflow:auto;" +
        "padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.88);color:#fff;" +
        "font:12px/1.5 Consolas,monospace;white-space:pre";
      const lines = faces.map((face) => {
        const ok = face.status === "loaded";
        return `<span style="color:${ok ? "#7dff9b" : "#ff7d7d"}">${ok ? "OK    " : "FAILED"}</span> ` +
               `${face.family} ${face.style} ${face.weight}`;
      });
      panel.innerHTML = "<b>FONT CHECK</b>\n" + (lines.join("\n") || "no web fonts found");
      document.body.appendChild(panel);
    });
  });
}

/* ------------------------------------------
   FONT CHECK (only runs if the address ends with #fontcheck)
   Shows which fonts really loaded, so problems are easy to find.
------------------------------------------ */
if (location.hash === "#fontcheck" && document.fonts) {
  window.addEventListener("load", () => {
    const faces = [...document.fonts];
    Promise.all(faces.map((face) => face.load().catch(() => null))).then(() => {
      const panel = document.createElement("pre");
      panel.style.cssText =
        "position:fixed;left:8px;top:8px;z-index:99999;max-width:94vw;max-height:90vh;" +
        "overflow:auto;margin:0;padding:10px;border-radius:8px;background:#000c;" +
        "color:#fff;font:12px/1.5 Consolas,monospace;white-space:pre-wrap;";
      const lines = faces.map((face) =>
        `${face.status === "loaded" ? "OK   " : "FAIL "} ${face.family} ${face.style} ${face.weight}  [${face.status}]`
      );
      panel.textContent =
        "FONT CHECK (OK = loaded, FAIL = could not load)\n\n" +
        (lines.length ? lines.join("\n") : "No web fonts were found at all.");
      document.body.appendChild(panel);
    });
  });
}

/* ==========================================
   CARTOON MATES — her friends at the party
   Mates.svg("bunny")  → returns a drawing as SVG text
   kinds: bunny, cat, panda, puppy, bear
========================================== */

window.Mates = (() => {
  const OUT = "#00000018";

  const eyes = (fill, shine, up) => {
    if (up === "happy") {
      return `<path class="m-joy" d="M32 63q6-10 12 0M56 63q6-10 12 0" stroke="${fill}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    }
    const y = up ? 58 : 62;
    return `<circle class="m-eye" cx="38" cy="${y}" r="4.2" fill="${fill}"/><circle class="m-eye" cx="62" cy="${y}" r="4.2" fill="${fill}"/>` +
      `<circle class="m-shine" cx="39.4" cy="${y - 1.4}" r="1.5" fill="${shine}"/><circle class="m-shine" cx="63.4" cy="${y - 1.4}" r="1.5" fill="${shine}"/>`;
  };

  const grin =
    `<path d="M41 74q9 14 18 0z" fill="#7a4a3a"/><path d="M45 79q5-3 10 0q-5 4-10 0z" fill="#ff7a9a"/>` +
    `<circle cx="27" cy="72" r="6.5" fill="#ff9ab4" opacity=".75"/><circle cx="73" cy="72" r="6.5" fill="#ff9ab4" opacity=".75"/>`;

  const wow =
    `<ellipse cx="50" cy="78" rx="3.8" ry="5" fill="#7a4a3a"/>` +
    `<circle cx="28" cy="72" r="5.5" fill="#ff9ab4" opacity=".6"/><circle cx="72" cy="72" r="5.5" fill="#ff9ab4" opacity=".6"/>`;

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

  function svg(kind, wave, look) {
    const k = kinds[kind] || kinds.bear;
    const waving = wave
      ? `<g class="e2-wave"><ellipse cx="88" cy="76" rx="7" ry="12" transform="rotate(22 88 76)" fill="${k.paw}" stroke="${OUT}"/></g>`
      : "";

    return `<svg viewBox="0 0 100 112" aria-hidden="true">` +
      k.ears +
      `<ellipse cx="50" cy="64" rx="34" ry="29" fill="${k.head}" stroke="${OUT}" stroke-width="1.5"/>` +
      k.extra + hat(k.hat) + eyes(k.eye, k.shine, look) + nose(k.nose) + (look === "happy" ? grin : look ? wow : mouth) +
      `<ellipse cx="30" cy="102" rx="11" ry="8" fill="${k.paw}" stroke="${OUT}"/>` +
      `<ellipse cx="70" cy="102" rx="11" ry="8" fill="${k.paw}" stroke="${OUT}"/>` +
      waving + `</svg>`;
  }

  return { svg, kinds: Object.keys(kinds) };
})();

/* ==========================================
   CURTAIN TRANSITION (self-contained)
========================================== */

const CURTAIN_CSS = `
/* ==========================================================
   CURTAIN TRANSITION — "Step inside"
   Pink theatre curtains close, show a welcome, then part.
========================================================== */

.curtain {
  position: fixed;
  inset: 0;
  z-index: 80;
  overflow: hidden;
  transition: opacity .6s ease;
}

.curtain.fade { opacity: 0; }

.cp {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 52%;
  background:
    repeating-linear-gradient(90deg,
      rgba(0, 0, 0, .2) 0 14px, rgba(255, 255, 255, .09) 14px 30px, rgba(0, 0, 0, 0) 30px 46px),
    linear-gradient(180deg, #f46f9c, #d4437a 60%, #b03068);
  box-shadow: 0 0 40px rgba(0, 0, 0, .35);
  will-change: transform;
}

/* gold fringe along the bottom */
.cp::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 20px;
  background: repeating-linear-gradient(90deg, #f5c64a 0 6px, #e0a830 6px 10px);
}

.cp-l { left: 0;  transform-origin: left center; }
.cp-r { right: 0; transform-origin: right center; }

/* three states: waiting off-screen → closed → gathered at the sides */
.curtain.out .cp-l { transform: translateX(-102%); }
.curtain.out .cp-r { transform: translateX(102%); }

.curtain.closed .cp {
  transform: none;
  transition: transform 1s cubic-bezier(.6, 0, .3, 1);
}

.curtain.open .cp {
  transform: scaleX(.12);
  transition: transform 1.7s cubic-bezier(.65, 0, .25, 1);
}

/* gold rod + scalloped valance across the top */
.c-valance {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 54px;
  z-index: 3;
  background:
    linear-gradient(#f9d56a, #d9a02a) 0 0 / 100% 9px no-repeat,
    radial-gradient(circle at 50% 0, #e8467f 0 22px, transparent 23px) 0 9px / 46px 40px repeat-x;
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, .3));
}

/* the welcome in the middle while the curtains are closed */
.c-spot {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  width: min(80vmin, 640px);
  aspect-ratio: 1;
  translate: -50% -50%;
  background: radial-gradient(circle, rgba(255, 236, 170, .7), transparent 65%);
  opacity: 0;
  transition: opacity .7s ease;
  pointer-events: none;
}

.c-text {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  z-index: 4;
  translate: 0 -50%;
  padding: 0 20px;
  text-align: center;
  color: #fff6dd;
  font-family: "Dancing Script", "Dancing Local", "Brush Script MT", cursive;
  font-size: clamp(34px, 7vw, 64px);
  font-weight: 700;
  line-height: 1.15;
  text-shadow: 0 0 24px rgba(255, 214, 120, .9), 0 3px 10px rgba(120, 20, 60, .5);
  opacity: 0;
  transform: scale(.85);
  transition: opacity .7s ease, transform .9s cubic-bezier(.3, 1.5, .5, 1);
  pointer-events: none;
}

.curtain.closed.hold .c-spot { opacity: 1; }
.curtain.closed.hold .c-text { opacity: 1; transform: none; }
`;

/* ==========================================
   CURTAIN TRANSITION
   Curtain.play("screen4")  → closes, welcomes her, then opens on screen4
========================================== */

(() => {
  const style = document.createElement("style");
  style.textContent = CURTAIN_CSS;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.className = "curtain out";
  wrap.id = "curtain";
  wrap.hidden = true;
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML =
    '<div class="cp cp-l"></div><div class="cp cp-r"></div><div class="c-valance"></div>' +
    '<div class="c-spot"></div><p class="c-text" id="curtainText"></p>';
  document.body.appendChild(wrap);

  const text = wrap.querySelector(".c-text");
  let busy = false;

  // timings in milliseconds — change here
  const CLOSE_TIME = 1000;   // curtains sweep shut
  const HOLD_TIME = 1500;    // welcome message stays
  const OPEN_TIME = 1700;    // curtains part
  const FADE_TIME = 600;

  const setState = (state) => { wrap.className = `curtain ${state}`; };

  window.Curtain = {
    play(target, message) {
      if (!wrap || busy) {
        if (!wrap) window.Screens.go(target);
        return;
      }
      busy = true;

      const name = (window.CONFIG && window.CONFIG.name) || "you";
      text.innerHTML = message || `Welcome,<br>${name} \u2661`;

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
   PHOTO SLOTS
   Looks for each picture; if it is not there, the cute placeholder stays.
========================================== */

(() => {
  const photos = (window.CONFIG && window.CONFIG.photos) || {};
  const endings = ["jpg", "png", "jpeg", "webp"];

  const style = document.createElement("style");
  style.textContent = `
    .photo-heart .slot-photo { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; object-fit: cover; }
    .photo-heart.has-photo .photo-placeholder { display: none; }
    .photo-heart.has-photo::before { display: none; }
    .s4-polaroid .ph.has-photo { background: none; }
    .s4-polaroid .ph .slot-photo { display: block; width: 120%; height: 100%; object-fit: cover; }
  `;
  document.head.appendChild(style);

  function findPicture(base, done, i = 0) {
    if (!base || i >= endings.length) { done(null); return; }
    const picture = new Image();
    picture.onload = () => done(picture);
    picture.onerror = () => findPicture(base, done, i + 1);
    picture.src = `${base}.${endings[i]}`;
  }

  function fill(slotSelector, base, label) {
    const slot = document.querySelector(slotSelector);
    if (!slot) return;

    findPicture(base, (picture) => {
      if (!picture) return;               // no file yet: keep the placeholder
      picture.className = "slot-photo";
      picture.alt = label;
      slot.classList.add("has-photo");
      if (slot.classList.contains("ph")) slot.textContent = "";
      slot.appendChild(picture);
    });
  }

  fill(".photo-heart", photos.memory, "A favourite memory");
  fill(".s4-polaroid .ph", photos.people, "My favourite people");
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
