import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Progress, Mission, CaseStory, AgeGroup } from "@/types";
import { ageGroupFor } from "@/types";
import { FALLBACK_MISSIONS, FALLBACK_STORIES } from "@/data/fallback";

const SHORTCUT_DURATION_MS = 2.5 * 60 * 1000; // 2.5 minutes
const BRIBE_BASE_COST = 30;

const xpForLevel = (lvl: number) => 100 + lvl * 50;

type State = {
  profile: Profile | null;
  progress: Progress;
  missions: Mission[];
  stories: CaseStory[];
  hydrated: boolean;

  setProfile: (p: Profile) => void;
  resetAll: () => void;

  setMissions: (m: Mission[]) => void;
  setStories: (s: CaseStory[]) => void;

  completeMission: (m: Mission) => void;
  takeBribe: () => boolean; // returns true if successful
  resolveBribe: () => void;
  answerStory: (storyId: string, choice: "A" | "B") => "correct" | "wrong" | "already";

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
  lastStoryDate: "",
};

const todayKey = () => new Date().toISOString().slice(0, 10);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: null,
      progress: initialProgress,
      missions: FALLBACK_MISSIONS,
      stories: FALLBACK_STORIES,
      hydrated: false,

      setProfile: (p) => set({ profile: p, progress: { ...initialProgress } }),
      resetAll: () =>
        set({
          profile: null,
          progress: initialProgress,
          missions: FALLBACK_MISSIONS,
          stories: FALLBACK_STORIES,
        }),

      setMissions: (m) => set({ missions: m.length ? m : FALLBACK_MISSIONS }),
      setStories: (s) => set({ stories: s.length ? s : FALLBACK_STORIES }),

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
            // honest progress nullifies a pending shortcut illusion
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
        // shortcut collapses: remove pending level
        set({
          progress: {
            ...progress,
            pendingShortcutLevel: undefined,
            shortcutExpiresAt: undefined,
          },
        });
      },

      answerStory: (storyId, choice) => {
        const { progress, stories } = get();
        if (progress.lastStoryDate !== todayKey()) {
          progress.storiesDoneToday = [];
          progress.lastStoryDate = todayKey();
        }
        if (progress.storiesDoneToday.includes(storyId)) return "already";
        const story = stories.find((s) => s.id === storyId);
        if (!story) return "already";
        const correct = story.correct === choice;
        const newProgress: Progress = {
          ...progress,
          storiesDoneToday: [...progress.storiesDoneToday, storyId],
          lastStoryDate: todayKey(),
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
        return correct ? "correct" : "wrong";
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
      name: "iq_state_v1",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

export { xpForLevel };
