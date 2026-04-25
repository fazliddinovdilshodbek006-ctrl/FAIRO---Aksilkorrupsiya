import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Progress, Mission, CaseStory, AgeGroup } from "@/types";
import { ageGroupFor } from "@/types";

const SHORTCUT_DURATION_MS = 2.5 * 60 * 1000; // 2.5 minutes
const BRIBE_BASE_COST = 30;

const xpForLevel = (lvl: number) => 100 + lvl * 50;

type State = {
  profile: Profile | null;
  progress: Progress;
  // AI-generated overrides; if empty, app falls back to localized static content
  missions: Mission[];
  stories: CaseStory[];
  hydrated: boolean;

  setProfile: (p: Profile) => void;
  resetAll: () => void;

  setMissions: (m: Mission[]) => void;
  setStories: (s: CaseStory[]) => void;
  clearGenerated: () => void;

  completeMission: (m: Mission) => void;
  takeBribe: () => boolean; // returns true if successful
  resolveBribe: () => void;
  answerStory: (storyId: string, choice: "A" | "B", correctOverride?: "A" | "B") => "correct" | "wrong" | "already";

  bribeCost: () => number;
  xpToNext: () => number;
  ageGroup: () => AgeGroup;
};

const initialProgress: Progress = {
  level: 1,
  xp: 0,
  coins: 100,
  missionsCompleted: 0,
  bribesTaken: 0,
  achievements: [],
  storiesDoneToday: [],
  storyAnswers: {},
  lastStoryDate: "",
};

const todayKey = () => new Date().toISOString().slice(0, 10);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: null,
      progress: initialProgress,
      missions: [],
      stories: [],
      hydrated: false,

      setProfile: (p) => set({ profile: p, progress: { ...initialProgress } }),
      resetAll: () =>
        set({
          profile: null,
          progress: initialProgress,
          missions: [],
          stories: [],
        }),

      setMissions: (m) => set({ missions: m ?? [] }),
      setStories: (s) => set({ stories: s ?? [] }),
      clearGenerated: () => set({ missions: [], stories: [] }),

      completeMission: (m) => {
        const { progress } = get();
        let { level, xp, coins, missionsCompleted, achievements } = progress;
        xp += m.xp;
        coins += Math.floor(m.xp / 2);
        missionsCompleted += 1;
        // honest level-up
        while (xp >= xpForLevel(level)) {
          xp -= xpForLevel(level);
          level += 1;
        }
        if (missionsCompleted === 1 && !achievements.includes("firstMission")) {
          achievements = [...achievements, "firstMission"];
        }
        if (level >= 5 && progress.bribesTaken === 0 && !achievements.includes("honestHero")) {
          achievements = [...achievements, "honestHero"];
        }
        set({
          progress: {
            ...progress,
            level,
            xp,
            coins,
            missionsCompleted,
            achievements,
            pendingShortcutLevel: undefined,
            shortcutExpiresAt: undefined,
          },
        });
      },

      takeBribe: () => {
        const { progress } = get();
        const cost = get().bribeCost();
        if (progress.coins < cost) return false;
        set({
          progress: {
            ...progress,
            coins: progress.coins - cost,
            bribesTaken: progress.bribesTaken + 1,
            pendingShortcutLevel: progress.level + 1,
            shortcutExpiresAt: Date.now() + SHORTCUT_DURATION_MS,
          },
        });
        return true;
      },

      resolveBribe: () => {
        const { progress } = get();
        if (!progress.shortcutExpiresAt) return;
        if (Date.now() < progress.shortcutExpiresAt) return;
        set({
          progress: {
            ...progress,
            pendingShortcutLevel: undefined,
            shortcutExpiresAt: undefined,
          },
        });
      },

      answerStory: (storyId, choice, correctOverride) => {
        const { progress } = get();
        const today = todayKey();
        const storiesDoneToday = progress.lastStoryDate === today ? progress.storiesDoneToday : [];
        const storyAnswers = progress.lastStoryDate === today ? progress.storyAnswers ?? {} : {};

        if (storiesDoneToday.includes(storyId)) return storyAnswers[storyId]?.outcome ?? "already";

        const correctAnswer = correctOverride ?? "A";
        const correct = correctAnswer === choice;
        const outcome = correct ? "correct" : "wrong";
        const newProgress: Progress = {
          ...progress,
          storiesDoneToday: [...storiesDoneToday, storyId],
          storyAnswers: {
            ...storyAnswers,
            [storyId]: { choice, outcome },
          },
          lastStoryDate: today,
          xp: progress.xp + (correct ? 20 : 5),
          coins: progress.coins + (correct ? 10 : 0),
        };
        let level = newProgress.level;
        let xp = newProgress.xp;
        while (xp >= xpForLevel(level)) {
          xp -= xpForLevel(level);
          level += 1;
        }
        newProgress.level = level;
        newProgress.xp = xp;
        set({ progress: newProgress });
        return outcome;
      },

      bribeCost: () => {
        const { progress } = get();
        return BRIBE_BASE_COST + progress.bribesTaken * 25;
      },

      xpToNext: () => xpForLevel(get().progress.level),

      ageGroup: () => {
        const p = get().profile;
        return p ? ageGroupFor(p.age) : "explorer";
      },
    }),
    {
      name: "iq_state_v2",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

export { xpForLevel };
