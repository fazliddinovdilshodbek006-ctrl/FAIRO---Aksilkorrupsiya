export type AgeTheme = "kid" | "explorer" | "teen" | "civic";

export type Interest =
  | "math" | "english" | "cyber" | "coding" | "art" | "science" | "history" | "music";

export const ALL_INTERESTS: Interest[] = ["math","english","cyber","coding","art","science","history","music"];

export type MissionType = "quiz" | "scenario" | "tap" | "match" | "sort" | "tap_race";

/** One item used by the "sort into baskets" mini-game (kids). */
export type SortItem = { id: string; label: string; emoji?: string; bucket: "honest" | "corrupt" };

/** One round of the "tap the right answer fast" mini-game (kids). */
export type TapRaceRound = { prompt: string; options: string[]; correctIndex: number };

export type Mission = {
  id: string;
  title: string;
  description: string;
  interest: Interest;
  type: MissionType;
  xp: number;
  // for quiz/scenario
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  // for "sort" mini-game
  sortItems?: SortItem[];
  // for "tap_race" mini-game
  tapRounds?: TapRaceRound[];
  /** Seconds limit for time-based games (e.g. tap_race). Default 20. */
  timeLimit?: number;
};

export type CaseStory = {
  id: string;
  title: string;
  setting: string; // school, market, hospital...
  body: string;
  choiceA: string; // honest
  choiceB: string; // corrupt
  correct: "A" | "B";
  explanation: string;
  lawId: string;
};

export type LawArticle = {
  id: string;
  title: string;
  source: "constitution" | "anti_corruption_law";
  article: string;
  plain: { kid: string; explorer: string; teen: string; civic: string };
};

export type AgeGroup = "kid" | "explorer" | "teen" | "civic";

export function ageGroupFor(age: number): AgeGroup {
  if (age <= 9) return "kid";
  if (age <= 12) return "explorer";
  if (age <= 15) return "teen";
  return "civic";
}

export type Profile = {
  age: number;
  interests: Interest[];
  createdAt: string;
};

/** Cosmetic items the mascot can wear. Purely visual. */
export type AccessoryId = "hat_graduate" | "glasses_cool" | "cape_hero" | "crown_gold" | "scarf_stripes" | "badge_star";

export type Progress = {
  level: number;
  xp: number;
  coins: number;
  missionsCompleted: number;
  bribesTaken: number;
  pendingShortcutLevel?: number; // level user got via bribe, will degrade
  shortcutExpiresAt?: number;    // ms timestamp
  achievements: string[];
  storiesDoneToday: string[];
  storyAnswers?: Record<string, { choice: "A" | "B"; outcome: "correct" | "wrong" }>;
  lastStoryDate: string;
  // ---- Phase 3: gamification ----
  /** Current consecutive-day streak (incremented when user opens app on a new day) */
  streak?: number;
  /** YYYY-MM-DD of the last day the streak was credited */
  lastStreakDate?: string;
  /** YYYY-MM-DD of the last day the daily-reward chest was claimed */
  lastDailyClaim?: string;
  /** Owned cosmetic accessories (purchased with coins) */
  ownedAccessories?: AccessoryId[];
  /** Currently equipped accessories on the mascot */
  equippedAccessories?: AccessoryId[];
  /** Username shown on the leaderboard */
  displayName?: string;
};

/** A single message in the Do'st (mascot) chat history. */
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  /** ms timestamp */
  ts: number;
};
