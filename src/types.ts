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
};
