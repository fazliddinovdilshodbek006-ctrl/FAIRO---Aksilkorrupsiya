import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Award, RotateCcw } from "lucide-react";

export function ProfilePanel() {
  const { t } = useTranslation();
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const reset = useStore((s) => s.resetAll);

  if (!profile) return null;

  const integrity = Math.max(
    0,
    Math.min(100, 100 - progress.bribesTaken * 15 + Math.min(40, progress.missionsCompleted * 2))
  );

  return (
    <div className="space-y-4">
      <div className="iq-card p-5 iq-hero text-primary-foreground">
        <h2 className="font-display text-2xl font-bold">{t("profile.title")}</h2>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat label={t("profile.age")} value={profile.age.toString()} />
          <Stat label={t("common.level")} value={progress.level.toString()} />
          <Stat label={t("profile.integrityScore")} value={`${integrity}`} />
        </div>
      </div>

      <div className="iq-card p-4">
        <div className="text-xs uppercase text-muted-foreground tracking-wide">{t("profile.interests")}</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.interests.map((i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
              {t(`interests.${i}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="iq-card p-4">
          <div className="text-xs uppercase text-muted-foreground">{t("profile.missionsDone")}</div>
          <div className="text-2xl font-display font-bold mt-1">{progress.missionsCompleted}</div>
        </div>
        <div className="iq-card p-4">
          <div className="text-xs uppercase text-muted-foreground">{t("profile.bribesTaken")}</div>
          <div className="text-2xl font-display font-bold mt-1 text-bribe">{progress.bribesTaken}</div>
        </div>
      </div>

      <div className="iq-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Award className="h-4 w-4 text-gold" /> {t("profile.achievements")}
        </div>
        {progress.achievements.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">—</p>
        ) : (
          <ul className="mt-2 grid gap-1">
            {progress.achievements.map((a) => (
              <li key={a} className="text-sm">⭐ {t(`achievements.${a}`, a)}</li>
            ))}
          </ul>
        )}
      </div>

      <Button variant="outline" className="w-full" onClick={reset}>
        <RotateCcw className="h-4 w-4 mr-1" /> {t("profile.reset")}
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/20 backdrop-blur rounded-lg p-3 text-center">
      <div className="text-xs opacity-80">{label}</div>
      <div className="font-display text-xl font-bold">{value}</div>
    </div>
  );
}
