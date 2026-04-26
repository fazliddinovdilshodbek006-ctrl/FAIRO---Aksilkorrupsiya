import { useEffect } from "react";
import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

/**
 * Small fire-emoji badge that shows the user's current consecutive-day streak.
 * Mounting the component triggers `touchStreak()` so the streak gets credited
 * automatically on the user's first visit each day.
 */
export function StreakBadge({ className }: { className?: string }) {
  const { t } = useTranslation();
  const streak = useStore((s) => s.progress.streak ?? 0);
  const touchStreak = useStore((s) => s.touchStreak);

  useEffect(() => {
    touchStreak();
  }, [touchStreak]);

  if (streak <= 0) return null;

  const hot = streak >= 7;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
        hot
          ? "bg-bribe/15 text-bribe border border-bribe/30 animate-pulse-glow"
          : "bg-accent/15 text-accent border border-accent/30",
        className
      )}
      title={t("gamification.streakTooltip", { n: streak })}
    >
      <Flame className={cn("h-3.5 w-3.5", hot && "animate-wiggle")} />
      <span className="tabular-nums">{streak}</span>
      <span className="hidden sm:inline">{t("gamification.streakLabel")}</span>
    </div>
  );
}
