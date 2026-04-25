import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore, xpForLevel } from "@/store";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { StatsBar } from "@/components/StatsBar";
import { MissionRunner } from "@/components/MissionRunner";
import { LevelUpDialog } from "@/components/LevelUpDialog";
import { StoryCard } from "@/components/StoryCard";
import { LawLibrary } from "@/components/LawLibrary";
import { ProfilePanel } from "@/components/ProfilePanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mission } from "@/types";
import { generateMissions, generateStories } from "@/lib/ai";
import { Sparkles, RefreshCcw, BookOpen, ScrollText, User, Hammer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const missions = useStore((s) => s.missions);
  const stories = useStore((s) => s.stories);
  const setMissions = useStore((s) => s.setMissions);
  const setStories = useStore((s) => s.setStories);
  const completeMission = useStore((s) => s.completeMission);

  const [active, setActive] = useState<Mission | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter missions to user's interests
  const myMissions = useMemo(() => {
    if (!profile) return missions;
    const filt = missions.filter((m) => profile.interests.includes(m.interest));
    return filt.length ? filt : missions;
  }, [missions, profile]);

  // Show level-up dialog whenever XP fills (visual celebration is the moment to choose path next time)
  // We trigger explicitly after mission completion — but progress already handles XP.
  // Display level-up choice when user is close to leveling (>= 80%).
  const xpNext = xpForLevel(progress.level);
  const nearLevel = progress.xp / xpNext >= 0.8;

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
          <div className="font-display text-lg font-bold flex items-center gap-2">
            <span className="iq-grad-primary text-primary-foreground rounded-md px-2 py-0.5 text-sm shadow-glow">IQ</span>
            IntegriQuest
          </div>
          <div className="flex items-center gap-2">
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

      <main className="container max-w-3xl py-5 space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{t("home.greeting")}</h1>
            {profile && (
              <p className="text-sm text-muted-foreground">
                {profile.age} • {profile.interests.map((i) => t(`interests.${i}`)).join(", ")}
              </p>
            )}
          </div>
          <Button size="sm" variant="ghost" onClick={refreshContent} disabled={refreshing}>
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            <span className="ml-1.5 hidden sm:inline">{t("home.refresh")}</span>
          </Button>
        </div>

        <StatsBar />

        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="missions"><Hammer className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">{t("home.yourMissions")}</span></TabsTrigger>
            <TabsTrigger value="stories"><BookOpen className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">{t("home.dailyStories")}</span></TabsTrigger>
            <TabsTrigger value="laws"><ScrollText className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">{t("home.lawLibrary")}</span></TabsTrigger>
            <TabsTrigger value="profile"><User className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">{t("home.profile")}</span></TabsTrigger>
          </TabsList>

          <TabsContent value="missions" className="space-y-3 mt-4">
            {myMissions.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m)}
                className="iq-card p-4 w-full text-left hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="iq-grad-primary text-primary-foreground rounded-lg h-12 w-12 flex items-center justify-center font-display text-lg">
                    {m.xp}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{t(`interests.${m.interest}`)}</div>
                    <div className="font-display font-bold">{m.title}</div>
                    <div className="text-sm text-muted-foreground">{m.description}</div>
                  </div>
                </div>
              </button>
            ))}
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

          <TabsContent value="profile" className="mt-4">
            <ProfilePanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Active mission modal */}
      {active && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="iq-card p-6 max-w-lg w-full">
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
