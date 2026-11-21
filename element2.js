/* ==========================================
   ELEMENT 2 — CUTE EXTRAS (tap magic + name)
   Does not touch the passcode logic.
========================================== */

(() => {
  const pad = document.getElementById("numberPad");
  const unlock = document.getElementById("unlockButton");
  if (!pad || !unlock) return;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const marks = ["♡", "✦", "✧", "♥", "✿"];
  const colors = ["#ff9ed6", "#ffd76a", "#e8c7ff", "#ff7aa2"];

  // little hearts and sparkles fly out from a point
  function burst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const distance = rand(34, 80);
      const mark = document.createElement("span");

      mark.className = "e2-pop";
      mark.textContent = pick(marks);
      mark.style.setProperty("--x", `${x}px`);
      mark.style.setProperty("--y", `${y}px`);
      mark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      mark.style.setProperty("--dy", `${Math.sin(angle) * distance - 20}px`);
      mark.style.setProperty("--s", `${rand(14, 24).toFixed(0)}px`);
      mark.style.setProperty("--c", pick(colors));

      document.body.appendChild(mark);
      window.setTimeout(() => mark.remove(), 900);
    }
  }

  function burstFrom(element, count) {
    const box = element.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height / 2, count);
  }

  pad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) burstFrom(button, 5);
  });

  unlock.addEventListener("click", () => burstFrom(unlock, 10));

  // keyboard digits pop too
  document.addEventListener("keydown", (event) => {
    if (!/^\d$/.test(event.key)) return;
    const key = pad.querySelector(`[data-digit="${event.key}"]`);
    if (key && key.offsetParent !== null) burstFrom(key, 5);
  });

  // "for <her name> ♡" under the photo
  const caption = document.getElementById("e2Caption");
  if (caption && window.CONFIG && window.CONFIG.name) {
    caption.textContent = `for ${window.CONFIG.name} ♡`;
  }
})();
