import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { useLawById } from "@/hooks/use-localized";
import { ageGroupFor } from "@/types";
import { AlertTriangle, HandCoins, ScrollText, Sparkles, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "choose" | "instant" | "crack";

export function LevelUpDialog({
  open,
  onClose,
  onWorkHard,
}: {
  open: boolean;
  onClose: () => void;
  onWorkHard: () => void;
}) {
  const { t } = useTranslation();
  const progress = useStore((s) => s.progress);
  const profile = useStore((s) => s.profile);
  const takeBribe = useStore((s) => s.takeBribe);
  const resolveBribe = useStore((s) => s.resolveBribe);
  const cost = useStore((s) => s.bribeCost());
  const [phase, setPhase] = useState<Phase>("choose");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase("choose");
      setError(null);
    }
  }, [open]);

  // crack timer for any pending shortcut
  useEffect(() => {
    if (!progress.shortcutExpiresAt) return;
    const ms = progress.shortcutExpiresAt - Date.now();
    if (ms <= 0) {
      setPhase("crack");
      return;
    }
    const id = setTimeout(() => setPhase("crack"), ms);
    return () => clearTimeout(id);
  }, [progress.shortcutExpiresAt]);

  if (!open) return null;
  const ageG = profile ? ageGroupFor(profile.age) : "explorer";
  const law = useLawById("anticorr_art_4");

  const onBribe = () => {
    setError(null);
    const ok = takeBribe();
    if (!ok) {
      setError(t("levelup.notEnoughCoins"));
      return;
    }
    setPhase("instant");
  };

  const finishCrack = () => {
    resolveBribe();
    setPhase("choose");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg iq-card p-6 max-h-[90vh] overflow-y-auto my-auto animate-scale-in">
        {phase === "choose" && (
          <>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl font-display font-bold">{t("levelup.title")}</h2>
              <p className="text-muted-foreground">{t("levelup.choose")}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* HONEST */}
              <button
                onClick={() => { onWorkHard(); onClose(); }}
                className="group iq-grad-honest text-honest-foreground rounded-card p-5 text-left transition-transform hover:-translate-y-0.5 shadow-soft"
              >
                <Hammer className="h-7 w-7 mb-2" />
                <div className="font-display text-lg font-bold">{t("levelup.workHard")}</div>
                <div className="text-sm opacity-90">{t("levelup.workHardDesc")}</div>
              </button>

              {/* BRIBE */}
              <button
                onClick={onBribe}
                className="group iq-grad-bribe text-bribe-foreground rounded-card p-5 text-left transition-transform hover:-translate-y-0.5 shadow-bribe relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
                  shortcut
                </div>
                <HandCoins className="h-7 w-7 mb-2" />
                <div className="font-display text-lg font-bold">{t("levelup.bribe")}</div>
                <div className="text-sm opacity-90">{t("levelup.bribeDesc")}</div>
                <div className="text-xs mt-2 opacity-95">{t("levelup.cost", { n: cost })}</div>
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> {error}
              </p>
            )}

            <Button variant="ghost" className="w-full mt-4" onClick={onClose}>
              {t("common.cancel")}
            </Button>
          </>
        )}

        {phase === "instant" && (
          <div className="text-center py-4 space-y-4">
            <div className="relative inline-block">
              <div className="text-7xl animate-pop">💸</div>
              <div className="absolute -top-2 -right-2 text-3xl animate-coin-pop">🪙</div>
            </div>
            <h2 className="text-2xl font-display font-bold">{t("bribe.instantTitle")}</h2>
            <p className="text-muted-foreground">{t("bribe.instantDesc")}</p>
            <div className="iq-grad-bribe text-bribe-foreground rounded-card p-4">
              <div className="text-xs uppercase tracking-wider opacity-80">{t("common.level")}</div>
              <div className="text-3xl font-display font-bold">
                Lv. {(progress.pendingShortcutLevel ?? progress.level + 1)}
              </div>
              <div className="text-xs mt-1 opacity-80">⏳ ~2–3 min</div>
            </div>
            <Button className="w-full" onClick={onClose}>{t("common.close")}</Button>
          </div>
        )}

        {phase === "crack" && (
          <div className="text-center py-4 space-y-4">
            <div className={cn("text-7xl mx-auto inline-block animate-crack")}>🏚️</div>
            <h2 className="text-2xl font-display font-bold text-destructive">{t("bribe.crackTitle")}</h2>
            <p className="text-muted-foreground">{t("bribe.crackDesc")}</p>
            <div className="iq-card p-4 text-left">
              <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ScrollText className="h-3.5 w-3.5" /> {t("bribe.lawIntro")}
              </div>
              <div className="font-semibold mt-1">{law.article}</div>
              <p className="text-sm mt-1">{law.plain[ageG]}</p>
            </div>
            <Button className="w-full iq-grad-primary text-primary-foreground" onClick={finishCrack}>
              <Sparkles className="h-4 w-4 mr-2" /> {t("common.continue")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
