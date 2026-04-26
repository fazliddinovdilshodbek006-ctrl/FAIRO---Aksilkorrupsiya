import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore, xpForLevel } from "@/store";
import { useMissions, useStories } from "@/hooks/use-localized";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { StatsBar } from "@/components/StatsBar";
import { MissionRunner } from "@/components/MissionRunner";
import { LevelUpDialog } from "@/components/LevelUpDialog";
import { StoryCard } from "@/components/StoryCard";
import { LawLibrary } from "@/components/LawLibrary";
import { ProfilePanel } from "@/components/ProfilePanel";
import { Mascot, useIsChildMode } from "@/components/Mascot";
import { StreakBadge } from "@/components/StreakBadge";
import { DailyRewardCard } from "@/components/DailyRewardCard";
import { MascotShop } from "@/components/MascotShop";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mission, ageGroupFor } from "@/types";
import { generateMissions, generateStories } from "@/lib/ai";
import { getKidMiniGames } from "@/data/miniGames";
import { Sparkles, RefreshCcw, BookOpen, ScrollText, User, Hammer, Loader2, Gamepad2, Shirt, Trophy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const missions = useMissions();
  const stories = useStories();
  const setMissions = useStore((s) => s.setMissions);
  const setStories = useStore((s) => s.setStories);
  const clearGenerated = useStore((s) => s.clearGenerated);
  const completeMission = useStore((s) => s.completeMission);

  const isChild = useIsChildMode();
  const [active, setActive] = useState<Mission | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter and size missions to user's age group:
  //  - kid (≤9):       fewer missions (3) + 2 mini-games (sort + tap-race)
  //  - explorer (≤12): 4 missions + 1 mini-game
  //  - teen (≤15):     6 missions, no mini-games
  //  - civic (16+):    6 missions, focus on depth & laws
  const myMissions = useMemo(() => {
    if (!profile) return missions;
    const ag = ageGroupFor(profile.age);
    const filt = missions.filter((m) => profile.interests.includes(m.interest));
    const base = filt.length ? filt : missions;
    const cap = ag === "kid" ? 3 : ag === "explorer" ? 4 : 6;
    const trimmed = base.slice(0, cap);
    if (ag === "kid") return [...getKidMiniGames(profile.interests), ...trimmed];
    if (ag === "explorer") return [getKidMiniGames(profile.interests)[0], ...trimmed];
    return trimmed;
  }, [missions, profile]);

  const xpNext = xpForLevel(progress.level);
  const nearLevel = progress.xp / xpNext >= 0.8;

  // When language changes, drop AI-generated content so the UI immediately
  // shows the localized static fallbacks (in the new language).
  const langRef = useRef(i18n.language);
  useEffect(() => {
    const onLang = (lng: string) => {
      if (langRef.current !== lng) {
        langRef.current = lng;
        clearGenerated();
      }
    };
    i18n.on("languageChanged", onLang);
    return () => {
      i18n.off("languageChanged", onLang);
    };
  }, [i18n, clearGenerated]);

  // Resolve any expired bribe shortcut on mount
  useEffect(() => {
    if (!progress.shortcutExpiresAt) return;
    const wait = progress.shortcutExpiresAt - Date.now();
    if (wait <= 0) {
      setShowLevelUp(true);
      return;
    }
    const id = setTimeout(() => setShowLevelUp(true), wait);
    return () => clearTimeout(id);
  }, [progress.shortcutExpiresAt]);

  const refreshContent = async () => {
    if (!profile) return;
    setRefreshing(true);
    try {
      const lang = (i18n.language.split("-")[0] as "en" | "uz" | "ru" | "kaa") || "en";
      const [m, s] = await Promise.all([
        generateMissions({ age: profile.age, interests: profile.interests, language: lang, count: 4 }),
        generateStories({ age: profile.age, interests: profile.interests, language: lang, count: 4 }),
      ]);
      if (m.length) setMissions(m);
      if (s.length) setStories(s);
      toast.success("Fresh content ready!");
    } catch (e: any) {
      toast.error(e?.message ?? "Couldn't refresh content");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b">
        <div className="container flex items-center justify-between py-3">
          <div className="font-display text-lg font-bold flex items-center gap-2 tracking-tight">
            <span className="iq-grad-primary text-primary-foreground rounded-md px-2 py-0.5 text-sm shadow-glow">F</span>
            FAIRO
          </div>
          <div className="flex items-center gap-2">
            <StreakBadge />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLevelUp(true)}
              className={cn(nearLevel && "iq-grad-primary text-primary-foreground border-transparent animate-pulse-glow")}
            >
              <Sparkles className="h-4 w-4 mr-1" /> {t("levelup.title")}
            </Button>
            <LanguageSwitcher compact />
          </div>
        </div>
      </header>

      <main className={cn("container max-w-3xl py-5 space-y-5 relative", isChild && "ikat-bg")}>
        {isChild && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
            <div className="blob bg-primary/30 h-72 w-72 -top-10 -left-20 animate-blob" />
            <div className="blob bg-accent/30 h-80 w-80 top-40 -right-24 animate-blob" style={{ animationDelay: "-6s" }} />
          </div>
        )}

        {isChild ? (
          <div className="kid-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 animate-fade-in relative overflow-hidden border-primary/20">
            <Mascot size="md" className="shrink-0 -mb-2 animate-float" />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-bold leading-tight">{t("home.greeting")}</h1>
              {profile && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  {profile.age} • {profile.interests.map((i) => t(`interests.${i}`)).join(", ")}
                </p>
              )}
            </div>
            <Button size="sm" variant="ghost" onClick={refreshContent} disabled={refreshing} className="shrink-0">
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              <span className="ml-1.5 hidden sm:inline">{t("home.refresh")}</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-end justify-between border-b pb-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">{t("home.greeting")}</h1>
              {profile && (
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.age} • {profile.interests.map((i) => t(`interests.${i}`)).join(", ")}
                </p>
              )}
            </div>
            <Button size="sm" variant="ghost" onClick={refreshContent} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              <span className="ml-1.5 hidden sm:inline">{t("home.refresh")}</span>
            </Button>
          </div>
        )}

        <DailyRewardCard playful={isChild} />

        <StatsBar />

        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="w-full grid grid-cols-6">
            <TabsTrigger value="missions"><Hammer className="h-4 w-4 sm:mr-1.5" /><span className="hidden md:inline">{t("home.yourMissions")}</span></TabsTrigger>
            <TabsTrigger value="stories"><BookOpen className="h-4 w-4 sm:mr-1.5" /><span className="hidden md:inline">{t("home.dailyStories")}</span></TabsTrigger>
            <TabsTrigger value="laws"><ScrollText className="h-4 w-4 sm:mr-1.5" /><span className="hidden md:inline">{t("home.lawLibrary")}</span></TabsTrigger>
            <TabsTrigger value="shop"><Shirt className="h-4 w-4 sm:mr-1.5" /><span className="hidden md:inline">{t("home.shop")}</span></TabsTrigger>
            <TabsTrigger value="leaderboard"><Trophy className="h-4 w-4 sm:mr-1.5" /><span className="hidden md:inline">{t("home.leaderboard")}</span></TabsTrigger>
            <TabsTrigger value="profile"><User className="h-4 w-4 sm:mr-1.5" /><span className="hidden md:inline">{t("home.profile")}</span></TabsTrigger>
          </TabsList>

          <TabsContent value="missions" className="space-y-3 mt-4">
            {myMissions.map((m) => {
              const isMiniGame = m.type === "sort" || m.type === "tap_race";
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(m)}
                  className={cn(
                    "w-full text-left transition-all hover:-translate-y-0.5 relative",
                    isChild ? "kid-card p-4 border-primary/20" : "iq-card p-4 hover:shadow-glow",
                    isMiniGame && "border-accent/40 ring-1 ring-accent/20"
                  )}
                >
                  {isMiniGame && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent flex items-center gap-1">
                      <Gamepad2 className="h-3 w-3" /> {t("mission.miniGame")}
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "text-primary-foreground flex items-center justify-center font-display shrink-0",
                      isMiniGame ? "iq-grad-bribe" : "iq-grad-primary",
                      isChild ? "rounded-2xl h-14 w-14 text-xl shadow-glow" : "rounded-lg h-12 w-12 text-lg"
                    )}>
                      {isMiniGame ? <Gamepad2 className="h-6 w-6" /> : m.xp}
                    </div>
                    <div className="flex-1 pr-16">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">{t(`interests.${m.interest}`)}</div>
                      <div className="font-display font-bold">{m.title}</div>
                      <div className="text-sm text-muted-foreground">{m.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </TabsContent>

          <TabsContent value="stories" className="space-y-3 mt-4">
            <div>
              <h2 className="font-display text-xl font-bold">{t("stories.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("stories.subtitle")}</p>
            </div>
            {stories.map((s) => <StoryCard key={s.id} story={s} />)}
          </TabsContent>

          <TabsContent value="laws" className="mt-4">
            <LawLibrary />
          </TabsContent>

          <TabsContent value="shop" className="mt-4">
            <MascotShop />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="profile" className="mt-4">
            <ProfilePanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Active mission modal */}
      {active && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="iq-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto my-auto">
            <MissionRunner
              mission={active}
              onClose={() => setActive(null)}
              onComplete={() => {
                completeMission(active);
                toast.success(t("mission.completed") + " " + t("mission.rewardXp", { xp: active.xp }));
              }}
            />
          </div>
        </div>
      )}

      <LevelUpDialog
        open={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        onWorkHard={() => {
          // open the first available mission
          if (myMissions[0]) setActive(myMissions[0]);
        }}
      />
    </div>
  );
}
