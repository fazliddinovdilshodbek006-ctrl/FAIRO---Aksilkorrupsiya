import { Coins, Sparkles, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore, xpForLevel } from "@/store";
import { Progress } from "@/components/ui/progress";

export function StatsBar() {
  const { t } = useTranslation();
  const progress = useStore((s) => s.progress);
  const next = xpForLevel(progress.level);
  const pct = Math.round((progress.xp / next) * 100);

  return (
    <div className="iq-card p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="iq-grad-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center font-bold shadow-glow">
            {progress.level}
          </div>
          <div className="leading-tight">
            <div className="text-xs text-muted-foreground">{t("common.level")}</div>
            <div className="font-semibold">Lv. {progress.level}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Stat icon={<Sparkles className="h-4 w-4 text-primary" />} value={progress.xp} label="XP" />
          <Stat icon={<Coins className="h-4 w-4 text-gold" />} value={progress.coins} label={t("common.coins")} />
          <Stat icon={<Trophy className="h-4 w-4 text-secondary" />} value={progress.missionsCompleted} label="" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{t("home.progress")}</span>
          <span>{progress.xp} / {next}</span>
        </div>
        <Progress value={pct} className="h-2.5" />
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="font-semibold tabular-nums">{value}</span>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
