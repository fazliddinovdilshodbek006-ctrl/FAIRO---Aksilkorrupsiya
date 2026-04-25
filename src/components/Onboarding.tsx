import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ALL_INTERESTS, Interest } from "@/types";
import { generateMissions, generateStories } from "@/lib/ai";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Mascot } from "@/components/Mascot";
import { Sparkles, ChevronRight, ChevronLeft, Loader2,
  Calculator, Languages, Shield, Code2, Palette, FlaskConical, Landmark, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const interestIcons: Record<Interest, React.ReactNode> = {
  math: <Calculator className="h-7 w-7" />,
  english: <Languages className="h-7 w-7" />,
  cyber: <Shield className="h-7 w-7" />,
  coding: <Code2 className="h-7 w-7" />,
  art: <Palette className="h-7 w-7" />,
  science: <FlaskConical className="h-7 w-7" />,
  history: <Landmark className="h-7 w-7" />,
  music: <Music className="h-7 w-7" />,
};

export function Onboarding({ onDone }: { onDone: () => void }) {
  const { t, i18n } = useTranslation();
  const setProfile = useStore((s) => s.setProfile);
  const setMissions = useStore((s) => s.setMissions);
  const setStories = useStore((s) => s.setStories);

  const [step, setStep] = useState(0);
  const [age, setAge] = useState(11);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [busy, setBusy] = useState(false);

  const toggle = (i: Interest) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const finish = async () => {
    setBusy(true);
    setProfile({ age, interests, createdAt: new Date().toISOString() });
    setStep(3);
    try {
      const lang = (i18n.language.split("-")[0] as "en" | "uz" | "ru" | "kaa") || "en";
      const [missions, stories] = await Promise.all([
        generateMissions({ age, interests, language: lang, count: 4 }).catch(() => []),
        generateStories({ age, interests, language: lang, count: 4 }).catch(() => []),
      ]);
      if (missions.length) setMissions(missions);
      if (stories.length) setStories(stories);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't generate AI content. Using starter set.");
    } finally {
      setBusy(false);
      onDone();
    }
  };

  return (
    <div className="min-h-dvh bg-background relative overflow-hidden">
      {/* Decorative animated blobs (only visible on welcome step for visual punch) */}
      {step === 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
          <div className="blob bg-primary/40 h-80 w-80 -top-20 -left-24 animate-blob" />
          <div className="blob bg-accent/40 h-96 w-96 top-40 -right-32 animate-blob" style={{ animationDelay: "-5s" }} />
          <div className="blob bg-secondary/30 h-72 w-72 bottom-0 left-1/3 animate-blob" style={{ animationDelay: "-10s" }} />
        </div>
      )}

      <header className="container flex justify-between items-center py-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="iq-grad-primary text-primary-foreground rounded-lg px-2.5 py-1 text-sm font-display font-bold shadow-glow tracking-wide">
            F
          </span>
          <span className="font-display text-xl font-bold tracking-tight">FAIRO</span>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="container max-w-xl pb-12 relative z-10">
        {step === 0 && (
          <section className="text-center space-y-8 animate-fade-in pt-4">
            {/* Two mascots side by side, no gradient box */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 pt-2">
              <Mascot name="asilbek" size="xl" forceShow className="animate-float" />
              <Mascot name="zumrad" size="xl" forceShow className="animate-bounce-slow" />
            </div>

            <div className="space-y-3 px-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> FAIRO
              </div>
              <h1 className="font-display font-bold leading-[1.05] tracking-tight text-[clamp(2rem,6vw,3rem)]">
                {t("onboarding.welcome")}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                {t("onboarding.welcomeDesc")}
              </p>
            </div>

            <Button
              size="lg"
              className="iq-grad-primary text-primary-foreground gap-2 font-display rounded-full px-8 h-14 text-base shadow-glow hover:scale-105 transition-transform"
              onClick={() => setStep(1)}
            >
              {t("common.start")} <ChevronRight className="h-5 w-5" />
            </Button>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-6 animate-fade-in pt-6">
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight">{t("onboarding.askAge")}</h2>
              <p className="text-muted-foreground text-sm mt-1">{t("onboarding.askAgeDesc")}</p>
            </div>
            <div className="iq-card p-8 text-center">
              <div className="text-7xl font-display font-bold iq-grad-primary bg-clip-text text-transparent leading-none">
                {age}
              </div>
              <div className="text-muted-foreground mt-2 text-sm">{t("profile.age").toLowerCase()}</div>
              <Slider
                className="mt-6"
                value={[age]}
                min={7} max={18} step={1}
                onValueChange={(v) => setAge(v[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>7</span><span>18</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> {t("common.back")}
              </Button>
              <Button className="flex-1 iq-grad-primary text-primary-foreground" onClick={() => setStep(2)}>
                {t("common.continue")} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6 animate-fade-in pt-6">
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight">{t("onboarding.pickInterests")}</h2>
              <p className="text-muted-foreground text-sm mt-1">{t("onboarding.pickInterestsDesc")}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ALL_INTERESTS.map((i) => {
                const active = interests.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={cn(
                      "iq-card p-4 flex flex-col items-center gap-2 transition-all",
                      active
                        ? "iq-grad-primary text-primary-foreground border-transparent shadow-glow scale-[1.02]"
                        : "hover:border-primary/60"
                    )}
                  >
                    {interestIcons[i]}
                    <span className="text-sm font-medium text-center">{t(`interests.${i}`)}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> {t("common.back")}
              </Button>
              <Button
                className="flex-1 iq-grad-primary text-primary-foreground"
                disabled={interests.length === 0 || busy}
                onClick={finish}
              >
                <Sparkles className="h-4 w-4 mr-1" /> {t("common.continue")}
              </Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="text-center space-y-4 pt-12 animate-fade-in">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <h2 className="text-2xl font-display font-bold">{t("onboarding.creatingProfile")}</h2>
            <p className="text-muted-foreground">{t("onboarding.creatingProfileDesc")}</p>
          </section>
        )}
      </main>
    </div>
  );
}
