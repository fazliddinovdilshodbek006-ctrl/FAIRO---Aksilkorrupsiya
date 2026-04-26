import { useState } from "react";
import { Gift, Coins, Sparkles, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { celebrate } from "@/lib/celebrate";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * A claimable daily-reward chest. Visible only when the user hasn't already
 * claimed today's reward. Grants coins + xp scaled by current streak.
 */
export function DailyRewardCard({ playful = false }: { playful?: boolean }) {
  const { t } = useTranslation();
  const canClaim = useStore((s) => s.canClaimDaily());
  const claim = useStore((s) => s.claimDailyReward);
  const streak = useStore((s) => s.progress.streak ?? 0);
  const [opened, setOpened] = useState(false);

  if (!canClaim) return null;

  const handleClaim = () => {
    const r = claim();
    if (r.ok) {
      setOpened(true);
      celebrate();
      toast.success(t("gamification.claimedToast", { coins: r.coins, xp: r.xp }));
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden p-4 sm:p-5 flex items-center gap-4 animate-fade-in border border-gold/40",
        playful ? "kid-card" : "iq-card",
        "bg-gradient-to-r from-gold/15 via-background to-primary/10"
      )}
    >
      <div
        className={cn(
          "shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center text-primary-foreground shadow-glow",
          opened ? "iq-grad-primary" : "bg-gradient-to-br from-gold to-bribe animate-bounce-slow"
        )}
        aria-hidden
      >
        {opened ? <Check className="h-7 w-7" /> : <Gift className="h-7 w-7" />}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg font-bold leading-tight">
          {t("gamification.dailyTitle")}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {streak > 0
            ? t("gamification.dailySubtitleWithStreak", { n: streak })
            : t("gamification.dailySubtitle")}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-gold" />
            +{Math.min(80, 20 + streak * 5)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            +{Math.min(50, 10 + streak * 3)} XP
          </span>
        </div>
      </div>
      <Button onClick={handleClaim} size="sm" className="shrink-0 iq-grad-primary text-primary-foreground">
        {t("gamification.claim")}
      </Button>
    </div>
  );
}
