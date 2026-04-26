import type { CaseStory } from "@/types";

/**
 * Deterministic daily rotation utilities.
 * Same day → same selection & shuffle for everyone (consistent UX).
 * Next day → new selection & possibly swapped A/B.
 *
 * This fixes two bugs:
 *  1) Stories never refreshed daily (always same 5).
 *  2) Correct answer was always "A" — predictable & wrong design.
 */

/** Days since 1970-01-01 (UTC). Stable across reloads on the same day. */
export function dayIndex(date = new Date()): number {
  return Math.floor(date.getTime() / 86_400_000);
}

/** Mulberry32 — small, deterministic PRNG seeded by an integer. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle using a seeded PRNG (pure, returns new array). */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pick `count` stories for today from the pool, deterministically.
 * Each picked story may have its A/B options swapped so the "correct"
 * choice is not always A. The swap is also seeded by the day so it's
 * stable for the whole day but different tomorrow.
 */
export function pickDailyStories(pool: CaseStory[], count = 4, day = dayIndex()): CaseStory[] {
  if (!pool.length) return [];
  const shuffled = seededShuffle(pool, day * 9301 + 49297);
  const picked = shuffled.slice(0, Math.min(count, shuffled.length));
  // Per-story A/B swap decision, seeded per (day, story id)
  return picked.map((s, i) => maybeSwapAB(s, day + i * 7));
}

/** Hash a string into a 32-bit int (FNV-1a). */
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Decide whether to swap A↔B for this story today. If swapped, the
 * `correct` field is flipped so business logic still works correctly.
 */
export function maybeSwapAB(story: CaseStory, daySeed: number): CaseStory {
  const seed = (daySeed ^ hashStr(story.id)) >>> 0;
  const rand = mulberry32(seed)();
  const swap = rand >= 0.5;
  if (!swap) return story;
  return {
    ...story,
    choiceA: story.choiceB,
    choiceB: story.choiceA,
    correct: story.correct === "A" ? "B" : "A",
  };
}
