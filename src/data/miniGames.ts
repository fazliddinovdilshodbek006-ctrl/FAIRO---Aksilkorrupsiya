/**
 * Static pool of mini-games for the "kid" age group (7-10).
 * These teach honesty / fairness / public-good concepts through
 * playful interaction (sorting, fast tapping) instead of long
 * reading. Localized via the i18n keys so we keep the data tiny
 * and culturally consistent.
 *
 * Each entry is a regular `Mission` so the existing pipeline
 * (filter by interest, XP, completion) keeps working unchanged.
 */
import type { Mission, Interest } from "@/types";
import { pickDailyStories } from "@/lib/dailyRotation"; // reuse: any deterministic shuffle

// We don't actually need full pickDailyStories logic — but reuse the same
// day-seeded shuffle pattern via a small local helper to keep daily rotation.
import { dayIndex } from "@/lib/dailyRotation";

// ---- SORT GAME pool (drag/tap items into "honest" vs "shortcut" bucket) ----
const SORT_POOL: Mission[] = [
  {
    id: "g_sort_classroom",
    title: "Honest or shortcut?",
    description: "Drop each action into the right basket.",
    interest: "history",
    type: "sort",
    xp: 25,
    explanation: "Honesty builds trust — shortcuts always cost more later.",
    sortItems: [
      { id: "i1", label: "Wait in line for your turn", emoji: "🧍", bucket: "honest" },
      { id: "i2", label: "Pay to skip the line", emoji: "💸", bucket: "corrupt" },
      { id: "i3", label: "Do your own homework", emoji: "📝", bucket: "honest" },
      { id: "i4", label: "Copy a friend's test", emoji: "👀", bucket: "corrupt" },
      { id: "i5", label: "Return a found wallet", emoji: "👛", bucket: "honest" },
      { id: "i6", label: "Keep someone's money", emoji: "🤫", bucket: "corrupt" },
    ],
  },
  {
    id: "g_sort_market",
    title: "Fair or unfair?",
    description: "Sort what's fair from what's not.",
    interest: "math",
    type: "sort",
    xp: 25,
    explanation: "Rules are the same for everyone — that's what fair means.",
    sortItems: [
      { id: "i1", label: "Same price for everyone", emoji: "🏷️", bucket: "honest" },
      { id: "i2", label: "Higher price if no receipt", emoji: "🧾", bucket: "corrupt" },
      { id: "i3", label: "Tell the truth about weight", emoji: "⚖️", bucket: "honest" },
      { id: "i4", label: "Cheat the scale a little", emoji: "🤥", bucket: "corrupt" },
      { id: "i5", label: "Pay your taxes", emoji: "🏛️", bucket: "honest" },
      { id: "i6", label: "Hide income", emoji: "🙈", bucket: "corrupt" },
    ],
  },
  {
    id: "g_sort_school",
    title: "Good or bad choice?",
    description: "Help the class understand fairness.",
    interest: "english",
    type: "sort",
    xp: 25,
    explanation: "Small choices add up. Be the kid others can trust.",
    sortItems: [
      { id: "i1", label: "Share school supplies", emoji: "✏️", bucket: "honest" },
      { id: "i2", label: "Bribe teacher with a gift", emoji: "🎁", bucket: "corrupt" },
      { id: "i3", label: "Help a slower friend", emoji: "🤝", bucket: "honest" },
      { id: "i4", label: "Pay for a higher grade", emoji: "💰", bucket: "corrupt" },
      { id: "i5", label: "Apologize when wrong", emoji: "🙏", bucket: "honest" },
      { id: "i6", label: "Blame someone else", emoji: "👉", bucket: "corrupt" },
    ],
  },
];

// ---- TAP RACE pool (rapid-fire correct answer tap) ----
const TAP_RACE_POOL: Mission[] = [
  {
    id: "g_race_fairness",
    title: "Quick fairness!",
    description: "Tap the FAIR choice — fast!",
    interest: "math",
    type: "tap_race",
    xp: 30,
    timeLimit: 25,
    explanation: "When you're quick AND fair, that's real strength.",
    tapRounds: [
      { prompt: "Two kids, one cake. What's fair?", options: ["Bigger one for me", "Cut it equally", "Hide it"], correctIndex: 1 },
      { prompt: "Lost your friend's pen. What's fair?", options: ["Say nothing", "Replace it", "Blame someone"], correctIndex: 1 },
      { prompt: "Won by cheating. What's fair?", options: ["Keep the prize", "Tell the truth", "Brag about it"], correctIndex: 1 },
      { prompt: "Friend offers exam answers. What's fair?", options: ["Take them", "Refuse — study yourself", "Sell them"], correctIndex: 1 },
      { prompt: "Found 1000 so'm on the floor.", options: ["Pocket it", "Look for the owner", "Hide it"], correctIndex: 1 },
    ],
  },
  {
    id: "g_race_law",
    title: "Honest hero!",
    description: "Tap the choice an honest hero makes.",
    interest: "history",
    type: "tap_race",
    xp: 30,
    timeLimit: 25,
    explanation: "Heroes do the right thing — even when nobody is watching.",
    tapRounds: [
      { prompt: "Officer asks for money to skip a fine.", options: ["Pay quietly", "Say no, ask receipt", "Run away"], correctIndex: 1 },
      { prompt: "Doctor wants gift for faster help.", options: ["Give the gift", "Refuse and wait fairly", "Yell"], correctIndex: 1 },
      { prompt: "Teacher offers grade for money.", options: ["Pay for grade", "Earn it by studying", "Tell parents"], correctIndex: 1 },
      { prompt: "Friend takes shop item without paying.", options: ["Help them hide it", "Tell them to put it back", "Take one too"], correctIndex: 1 },
      { prompt: "Someone offers fake test answers.", options: ["Buy them", "Refuse politely", "Resell them"], correctIndex: 1 },
    ],
  },
];

/**
 * Build today's mini-game pack for kids. We always include 1 sort game
 * and 1 tap-race, rotated daily so kids see fresh content each day.
 */
export function getKidMiniGames(interests: Interest[] = []): Mission[] {
  const day = dayIndex();
  const sortPick = SORT_POOL[day % SORT_POOL.length];
  const racePick = TAP_RACE_POOL[(day + 1) % TAP_RACE_POOL.length];

  // If user has interests, prefer matching ones — but fall back to any.
  const games = [sortPick, racePick];
  if (!interests.length) return games;
  const matching = games.filter((g) => interests.includes(g.interest));
  return matching.length ? [...matching, ...games.filter((g) => !matching.includes(g))] : games;
}
