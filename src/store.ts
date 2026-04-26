import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Progress, Mission, CaseStory, AgeGroup, AccessoryId, ChatMessage } from "@/types";
import { ageGroupFor } from "@/types";

const SHORTCUT_DURATION_MS = 2.5 * 60 * 1000; // 2.5 minutes
const BRIBE_BASE_COST = 30;

const xpForLevel = (lvl: number) => 100 + lvl * 50;

/** Cost in coins to unlock a cosmetic accessory. */
export const ACCESSORY_COST: Record<AccessoryId, number> = {
  hat_graduate: 80,
  glasses_cool: 60,
  cape_hero: 120,
  crown_gold: 250,
  scarf_stripes: 50,
  badge_star: 40,
};

type DailyRewardResult = { ok: true; coins: number; xp: number } | { ok: false; reason: "already" };

type State = {
  profile: Profile | null;
  progress: Progress;
  // AI-generated overrides; if empty, app falls back to localized static content
  missions: Mission[];
  stories: CaseStory[];
  /** Persisted Do'st chat history per mascot */
  chatHistory: Record<string, ChatMessage[]>;
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

  // ---- Phase 3 ----
  /** Call once per app session — credits a streak day if it's a new day. */
  touchStreak: () => void;
  /** Claim today's daily reward chest. */
  claimDailyReward: () => DailyRewardResult;
  /** Has today's chest already been opened? */
  canClaimDaily: () => boolean;
  /** Buy a cosmetic accessory. Returns true on success. */
  buyAccessory: (id: AccessoryId) => boolean;
  /** Toggle equipped state of an owned accessory. */
  toggleAccessory: (id: AccessoryId) => void;
  /** Set a friendly display name for the leaderboard. */
  setDisplayName: (name: string) => void;
  /** Append a message to the persisted chat history for a mascot. */
  appendChatMessage: (mascot: string, msg: ChatMessage) => void;
  /** Clear chat history for a mascot (or all if no key given). */
  clearChatHistory: (mascot?: string) => void;

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
  streak: 0,
  lastStreakDate: "",
  lastDailyClaim: "",
  ownedAccessories: [],
  equippedAccessories: [],
  displayName: "",
};

const todayKey = () => new Date().toISOString().slice(0, 10);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: null,
      progress: initialProgress,
      missions: [],
      stories: [],
      chatHistory: {},
      hydrated: false,

      setProfile: (p) => set({ profile: p, progress: { ...initialProgress } }),
      resetAll: () =>
        set({
          profile: null,
          progress: initialProgress,
          missions: [],
          stories: [],
          chatHistory: {},
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

      // ---- Phase 3: streaks, daily reward, mascot shop ----
      touchStreak: () => {
        const { progress } = get();
        const today = todayKey();
        if (progress.lastStreakDate === today) return; // already counted

        const yesterday = (() => {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          return d.toISOString().slice(0, 10);
        })();
        const newStreak =
          progress.lastStreakDate === yesterday ? (progress.streak ?? 0) + 1 : 1;

        const achievements = [...(progress.achievements ?? [])];
        if (newStreak >= 7 && !achievements.includes("weekStreak")) {
          achievements.push("weekStreak");
        }

        set({
          progress: {
            ...progress,
            streak: newStreak,
            lastStreakDate: today,
            achievements,
          },
        });
      },

      canClaimDaily: () => {
        const { progress } = get();
        return progress.lastDailyClaim !== todayKey();
      },

      claimDailyReward: () => {
        const { progress } = get();
        const today = todayKey();
        if (progress.lastDailyClaim === today) return { ok: false, reason: "already" };

        // Reward scales gently with streak: base 20 coins + streak*5 (cap 80)
        const streak = progress.streak ?? 0;
        const coins = Math.min(80, 20 + streak * 5);
        const xp = Math.min(50, 10 + streak * 3);

        let newXp = progress.xp + xp;
        let newLevel = progress.level;
        while (newXp >= xpForLevel(newLevel)) {
          newXp -= xpForLevel(newLevel);
          newLevel += 1;
        }

        set({
          progress: {
            ...progress,
            coins: progress.coins + coins,
            xp: newXp,
            level: newLevel,
            lastDailyClaim: today,
          },
        });
        return { ok: true, coins, xp };
      },

      buyAccessory: (id) => {
        const { progress } = get();
        const owned = progress.ownedAccessories ?? [];
        if (owned.includes(id)) return false;
        const cost = ACCESSORY_COST[id];
        if (progress.coins < cost) return false;
        set({
          progress: {
            ...progress,
            coins: progress.coins - cost,
            ownedAccessories: [...owned, id],
            equippedAccessories: [...(progress.equippedAccessories ?? []), id],
          },
        });
        return true;
      },

      toggleAccessory: (id) => {
        const { progress } = get();
        const owned = progress.ownedAccessories ?? [];
        if (!owned.includes(id)) return;
        const equipped = progress.equippedAccessories ?? [];
        const next = equipped.includes(id)
          ? equipped.filter((x) => x !== id)
          : [...equipped, id];
        set({ progress: { ...progress, equippedAccessories: next } });
      },

      setDisplayName: (name) => {
        const { progress } = get();
        set({ progress: { ...progress, displayName: name.slice(0, 20) } });
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
      name: "iq_state_v3",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

export { xpForLevel };
