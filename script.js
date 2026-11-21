/* ==========================================
   BIRTHDAY SURPRISE — INTRO + PASSCODE (v2)
========================================== */

(() => {
  const intro = document.getElementById("darknessScene");
  const scene = document.getElementById("passcodeScene");

  const display = document.getElementById("codeDisplay");
  const keypad = document.getElementById("numberPad");
  const unlockButton = document.getElementById("unlockButton");
  const hint = document.getElementById("codeHint");

  const layout = document.getElementById("passcodeLayout");
  const wrongScreen = document.getElementById("wrongScreen");
  const tryAgainButton = document.getElementById("tryAgainButton");

  if (
    !intro || !scene || !display || !keypad ||
    !unlockButton || !hint || !layout ||
    !wrongScreen || !tryAgainButton
  ) {
    console.error("Birthday Surprise: Check the HTML element IDs.");
    return;
  }

  const CORRECT_PASSCODE = "2211";
  const slots = [...display.querySelectorAll(".code-slot")];

  if (slots.length !== 4) {
    console.error("The passcode display needs exactly four slots.");
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------
     TIMING (all in milliseconds) — change here
  ------------------------------------------ */
  const TEXT_HOLD_MS   = 1800;  // how long the finished intro text stays on screen
  const INTRO_FALLBACK = 9000;  // safety net: intro always ends by this time
  const REVEAL_DELAY   = 600;   // passcode starts appearing after the flash begins
  const FINISH_DELAY   = 1600;  // intro removed after this

  let enteredCode = "";
  let checking = false;
  let transitioning = false;

  /* ------------------------------------------
     FLOATING PARTICLES
  ------------------------------------------ */

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function spawnParticles(parent, count, symbols, colors) {
    const layer = document.createElement("div");
    layer.className = "fx-layer";
    layer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "float-particle";
      p.textContent = pick(symbols);
      p.style.setProperty("--x", `${rand(2, 98).toFixed(1)}%`);
      p.style.setProperty("--s", `${rand(12, 28).toFixed(0)}px`);
      p.style.setProperty("--d", `${rand(9, 18).toFixed(1)}s`);
      p.style.setProperty("--delay", `${(-rand(0, 18)).toFixed(1)}s`);
      p.style.setProperty("--dx", `${rand(-70, 70).toFixed(0)}px`);
      p.style.setProperty("--r", `${rand(-200, 200).toFixed(0)}deg`);
      p.style.setProperty("--c", pick(colors));
      layer.appendChild(p);
    }

    parent.insertBefore(layer, parent.firstChild);
  }

  const particleCount = window.innerWidth < 600 ? 14 : 26;
  const symbols = ["✦", "✧", "♡", "♥", "✿", "·"];
  const colors = ["#ffd6f0", "#f8acd9", "#ffe0a2", "#e8c7ff", "#ff9ed6"];

  spawnParticles(intro, particleCount, symbols, colors);
  spawnParticles(scene, particleCount, symbols, colors);

  /* Give each key an index so they pop in one after another */
  keypad.querySelectorAll(".number-key").forEach((key, i) => {
    key.style.setProperty("--i", i);
  });

  /* ------------------------------------------
     INTRO CEREMONY → PASSCODE REVEAL
  ------------------------------------------ */

  scene.hidden = false; // sits invisibly underneath the intro

  let leaving = false;
  let leaveTimer = null;

  function endIntro() {
    if (leaving) return;
    leaving = true;
    window.clearTimeout(leaveTimer);

    // 1. light burst + message zooms away
    intro.classList.add("intro-leaving");

    // 2. passcode screen starts its staggered entrance
    window.setTimeout(() => {
      scene.classList.add("revealed");
    }, REVEAL_DELAY);

    // 3. remove the intro completely
    window.setTimeout(() => {
      intro.classList.add("darkness-finished");
    }, FINISH_DELAY + REVEAL_DELAY);
  }

  // Wait until the LAST piece of text (the divider) has finished appearing,
  // then hold it on screen before leaving.
  const lastPiece = intro.querySelector(".intro-divider");

  if (lastPiece) {
    lastPiece.addEventListener("animationend", () => {
      if (leaving) return;
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(endIntro, TEXT_HOLD_MS);
    }, { once: true });
  }

  leaveTimer = window.setTimeout(endIntro, INTRO_FALLBACK);

  // Tap / click anywhere to skip the intro
  intro.addEventListener("click", endIntro);

  /* ------------------------------------------
     PASSCODE DISPLAY
  ------------------------------------------ */

  function renderCode() {
    slots.forEach((slot, index) => {
      const filled = index < enteredCode.length;
      const wasFilled = slot.classList.contains("filled");

      slot.classList.toggle("filled", filled);
      slot.textContent = filled ? "✦" : "✿";

      if (filled && !wasFilled) {
        slot.classList.remove("pop");
        void slot.offsetWidth; // restart the pop animation
        slot.classList.add("pop");
      }
    });

    display.setAttribute(
      "aria-label",
      `${enteredCode.length} of 4 digits entered`
    );
  }

  function clearCode() {
    enteredCode = "";
    display.classList.remove("error");
    renderCode();
    hint.textContent = "A little surprise is waiting ♡";
  }

  function addDigit(digit) {
    if (checking || transitioning || !wrongScreen.hidden) return;
    if (enteredCode.length >= 4) return;

    enteredCode += digit;
    renderCode();

    hint.textContent = enteredCode.length === 4
      ? "Ready to unlock your surprise? ♡"
      : "A little surprise is waiting ♡";
  }

  function deleteDigit() {
    if (checking || transitioning || !wrongScreen.hidden) return;

    enteredCode = enteredCode.slice(0, -1);
    renderCode();
    hint.textContent = "A little surprise is waiting ♡";
  }

  /* ------------------------------------------
     WRONG PASSCODE: shake → dim card → overlay fades in
  ------------------------------------------ */

  function showWrongScreen() {
    if (transitioning) return;
    transitioning = true;

    hint.textContent = "Oops, that's not it ♡";
    display.classList.add("error");
    layout.classList.add("shake");

    window.setTimeout(() => {
      layout.classList.remove("shake");
      layout.classList.add("dimmed");
      layout.setAttribute("aria-hidden", "true");

      wrongScreen.hidden = false;
      wrongScreen.classList.remove("wrong-visible");

      // two frames so the browser sees the "before" state and animates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wrongScreen.classList.add("wrong-visible");
        });
      });

      window.setTimeout(() => {
        transitioning = false;
        tryAgainButton.focus({ preventScroll: true });
      }, 600);
    }, reduceMotion ? 100 : 650);
  }

  /* ------------------------------------------
     CHECK PASSCODE
  ------------------------------------------ */

  function checkPasscode() {
    if (checking || transitioning || !wrongScreen.hidden) return;

    if (enteredCode.length !== 4) {
      hint.textContent = "Please enter all four digits ♡";
      return;
    }

    if (enteredCode !== CORRECT_PASSCODE) {
      showWrongScreen();
      return;
    }

    checking = true;
    hint.textContent = "Unlocked! Your magic awaits ✨";
    unlockButton.disabled = true;

    // Your next scene should listen for this event
    scene.dispatchEvent(
      new CustomEvent("passcode:unlocked", { bubbles: true })
    );
  }

  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-digit], button[data-action]");
    if (!button) return;

    if (button.dataset.digit !== undefined) {
      addDigit(button.dataset.digit);
    } else if (button.dataset.action === "clear") {
      clearCode();
    } else if (button.dataset.action === "delete") {
      deleteDigit();
    }
  });

  unlockButton.addEventListener("click", checkPasscode);

  /* ------------------------------------------
     TRY AGAIN: overlay fades out while the card fades back in
  ------------------------------------------ */

  tryAgainButton.addEventListener("click", () => {
    if (transitioning) return;
    transitioning = true;

    wrongScreen.classList.remove("wrong-visible");
    layout.classList.remove("dimmed");
    layout.removeAttribute("aria-hidden");
    clearCode();

    window.setTimeout(() => {
      wrongScreen.hidden = true;
      checking = false;
      unlockButton.disabled = false;
      transitioning = false;
    }, 480);
  });

  /* ------------------------------------------
     KEYBOARD SUPPORT
  ------------------------------------------ */

  document.addEventListener("keydown", (event) => {
    if (scene.hidden || !wrongScreen.hidden || !scene.classList.contains("revealed")) return;

    // A focused button already handles Enter/Space itself
    if ((event.key === "Enter" || event.key === " ") && event.target.closest("button")) return;

    if (/^\d$/.test(event.key)) {
      addDigit(event.key);
    } else if (event.key === "Backspace") {
      deleteDigit();
    } else if (event.key === "Escape") {
      clearCode();
    } else if (event.key === "Enter") {
      checkPasscode();
    }
  });

  renderCode();
})();

