/* ==========================================
   ELEMENT 4 — HAPPY BIRTHDAY TITLE SCREEN
========================================== */

(() => {
  const screen = document.getElementById("screen4");
  const book = document.getElementById("s4Book");
  const nextButton = document.getElementById("s4Next");

  if (!screen || !book || !nextButton) {
    console.error("Element 4: check the HTML element IDs.");
    return;
  }

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  /* ---- her name ---- */
  const name = (window.CONFIG && window.CONFIG.name) || "you";
  screen.querySelectorAll("[data-name]").forEach((el) => { el.textContent = name; });

  /* ---- tiles get a number so they light up one after another ---- */
  screen.querySelectorAll(".s4-tile").forEach((tile, i) => tile.style.setProperty("--i", i));

  /* ---- floating hearts, sparkles and balloons (always drifting up) ---- */
  const balloonColors = ["#ff8fb3", "#b49af2", "#ffd76a", "#ff7aa2"];

  function balloonSvg(color) {
    return `<svg viewBox="0 0 40 60" aria-hidden="true">
      <path d="M20 46c0 5-3 5 0 11" stroke="#d9a9c4" stroke-width="1.5" fill="none"/>
      <path d="M17 44h6l-3 5z" fill="${color}"/>
      <ellipse cx="20" cy="22" rx="15" ry="20" fill="${color}"/>
      <path d="M11 14c2-5 6-7 10-7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>
    </svg>`;
  }

  function spawnDecor() {
    const layer = document.createElement("div");
    layer.className = "fx-layer";
    layer.setAttribute("aria-hidden", "true");

    const glyphs = ["♡", "♥", "✦", "✧", "✿"];
    const colors = ["#ff8fb3", "#b49af2", "#f5b94a", "#ff7aa2"];
    const count = window.innerWidth < 600 ? 12 : 20;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      const isBalloon = i % 4 === 0;

      piece.className = "float-particle" + (isBalloon ? " s4-balloon" : "");
      if (isBalloon) {
        piece.innerHTML = balloonSvg(pick(balloonColors));
        piece.style.width = `${rand(26, 40).toFixed(0)}px`;
      } else {
        piece.textContent = pick(glyphs);
      }

      piece.style.setProperty("--x", `${rand(2, 96).toFixed(1)}%`);
      piece.style.setProperty("--s", `${rand(14, 26).toFixed(0)}px`);
      piece.style.setProperty("--d", `${rand(10, 20).toFixed(1)}s`);
      piece.style.setProperty("--delay", `${(-rand(0, 20)).toFixed(1)}s`);
      piece.style.setProperty("--dx", `${rand(-60, 60).toFixed(0)}px`);
      piece.style.setProperty("--r", `${rand(-120, 120).toFixed(0)}deg`);
      piece.style.setProperty("--c", pick(colors));
      layer.appendChild(piece);
    }

    screen.insertBefore(layer, screen.firstChild);
  }

  spawnDecor();

  /* ---- cartoon stickers down both sides (copied from the passcode screen) ---- */
  function addStickers() {
    const source = [...document.querySelectorAll("#passcodeScene .e2-st svg")];
    if (!source.length) return;

    const layer = document.createElement("div");
    layer.className = "s4-stickers";
    layer.setAttribute("aria-hidden", "true");

    // [left %, top %, width px]
    const spots = [
      [4, 14, 58], [11, 40, 50], [5, 66, 56], [13, 84, 46],
      [88, 12, 56], [83, 38, 50], [91, 62, 58], [84, 82, 48]
    ];

    spots.forEach(([x, y, w], i) => {
      const sticker = document.createElement("div");
      sticker.className = "e2-st" + (i > 3 ? " s4-st-extra" : "");
      sticker.style.setProperty("--x", `${x}%`);
      sticker.style.setProperty("--y", `${y}%`);
      sticker.style.setProperty("--w", `${w}px`);
      sticker.style.setProperty("--r", `${rand(-14, 14).toFixed(0)}deg`);
      sticker.style.setProperty("--d", `${rand(4.5, 7).toFixed(1)}s`);
      sticker.style.setProperty("--dl", `${(-rand(0, 5)).toFixed(1)}s`);
      sticker.appendChild(source[i % source.length].cloneNode(true));
      layer.appendChild(sticker);
    });

    screen.insertBefore(layer, screen.firstChild);
  }

  addStickers();

  /* ---- her mates: two behind the book, a crowd along the bottom ---- */
  function addMates() {
    if (!window.Mates) { console.warn("Element 4: the cartoon mates are missing. Replace screens.js"); return; }

    const stage = document.getElementById("s4Stage");
    const make = (kind, wave, cls) => {
      const mate = document.createElement("span");
      mate.className = `s4-mate ${cls || ""}`;
      mate.innerHTML = window.Mates.svg(kind, wave);
      return mate;
    };

    if (stage) {
      stage.insertBefore(make("cat", true, "right"), stage.firstChild);
      stage.insertBefore(make("bunny", false, "left"), stage.firstChild);
    }

    const crowd = document.createElement("div");
    crowd.className = "s4-crowd";
    crowd.setAttribute("aria-hidden", "true");

    const phone = window.innerWidth < 680;
    const people = phone
      ? [["panda", 22, 66], ["puppy", 42, 70], ["bear", 61, 66], ["bunny", 79, 64]]
      : [["puppy", 9, 112], ["panda", 18, 120], ["bear", 70, 116], ["bunny", 79, 120], ["panda", 88, 108]];

    people.forEach(([kind, x, w], i) => {
      const mate = make(kind, i % 2 === 0);
      mate.style.setProperty("--x", `${x}%`);
      mate.style.setProperty("--w", `${w}px`);
      mate.style.setProperty("--dl", `${(-i * 0.7).toFixed(1)}s`);
      crowd.appendChild(mate);
    });

    screen.insertBefore(crowd, screen.firstChild);
  }

  addMates();

  const bunting = document.createElement("div");
  bunting.className = "s4-bunting";
  bunting.setAttribute("aria-hidden", "true");
  screen.insertBefore(bunting, screen.firstChild);

  /* ---- a shower of confetti when the screen arrives ---- */
  function confetti() {
    const colors = ["#ff8fb3", "#b49af2", "#f5b94a", "#ff7aa2", "#8fd3ff", "#ffd6ec"];
    const total = window.innerWidth < 600 ? 34 : 60;

    for (let i = 0; i < total; i++) {
      const bit = document.createElement("span");
      bit.className = "s4-confetti";
      bit.style.setProperty("--x", `${rand(0, 100).toFixed(1)}%`);
      bit.style.setProperty("--w", `${rand(6, 11).toFixed(0)}px`);
      bit.style.setProperty("--c", pick(colors));
      bit.style.setProperty("--d", `${rand(2.4, 4.2).toFixed(2)}s`);
      bit.style.setProperty("--dl", `${rand(0.2, 1.2).toFixed(2)}s`);
      bit.style.setProperty("--dx", `${rand(-80, 80).toFixed(0)}px`);
      bit.style.setProperty("--r", `${rand(300, 900).toFixed(0)}deg`);
      screen.appendChild(bit);
      window.setTimeout(() => bit.remove(), 5600);
    }
  }

  screen.addEventListener("screen:enter", () => window.setTimeout(confetti, 350));

  /* ---- tap the book: cover opens, tiles light up, Next appears ---- */
  let opened = false;

  book.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    screen.classList.add("opened");
    book.setAttribute("aria-label", "The birthday book is open");

    window.setTimeout(() => { nextButton.hidden = false; }, 1900);
  });

  /* ---- Next → Element 5 ---- */
  nextButton.addEventListener("click", () => {
    nextButton.disabled = true;
    window.Screens.go("screen5");
  });
})();
