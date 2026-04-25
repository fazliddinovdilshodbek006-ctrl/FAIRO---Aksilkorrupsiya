import confetti from "canvas-confetti";

/**
 * Fires a "party popper" burst from both bottom corners of the screen.
 * Used when the user answers correctly. Safe to call repeatedly.
 */
export function partyPopper() {
  const defaults = {
    spread: 70,
    ticks: 90,
    gravity: 0.9,
    decay: 0.92,
    startVelocity: 55,
    scalar: 1,
    colors: ["#ff5c5c", "#ffb84d", "#ffd84d", "#4dd0a4", "#4da6ff", "#b768ff"],
  };

  // Left popper — angled up-and-right
  confetti({
    ...defaults,
    particleCount: 110,
    angle: 60,
    origin: { x: 0, y: 0.85 },
  });
  // Right popper — angled up-and-left
  confetti({
    ...defaults,
    particleCount: 110,
    angle: 120,
    origin: { x: 1, y: 0.85 },
  });

  // Follow-up tiny burst near the centre for extra "wow"
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 60,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.7 },
    });
  }, 220);
}
