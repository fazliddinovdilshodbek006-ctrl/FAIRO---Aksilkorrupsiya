import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Mission, SortItem } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Sparkles, RotateCcw } from "lucide-react";
import { partyPopper } from "@/lib/celebrate";
import { Mascot } from "@/components/Mascot";

/**
 * Drag-free "sort" mini-game. Tap an item, then tap a basket.
 * Mobile-first (no drag-and-drop needed). Kids learn honest vs corrupt
 * actions by sorting them visually.
 */
export function SortGame({
  mission,
  onComplete,
  onClose,
}: {
  mission: Mission;
  onComplete: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const items = mission.sortItems ?? [];
  const [picked, setPicked] = useState<SortItem | null>(null);
  const [placed, setPlaced] = useState<Record<string, "honest" | "corrupt">>({});
  const [done, setDone] = useState(false);

  const place = (bucket: "honest" | "corrupt") => {
    if (!picked) return;
    setPlaced((p) => ({ ...p, [picked.id]: bucket }));
    setPicked(null);
  };

  const remaining = items.filter((it) => !placed[it.id]);

  const finish = () => {
    const correct = items.filter((it) => placed[it.id] === it.bucket).length;
    const score = correct / items.length;
    setDone(true);
    if (score >= 0.7) {
      partyPopper();
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1800);
    }
  };

  const reset = () => {
    setPlaced({});
    setPicked(null);
    setDone(false);
  };

  if (remaining.length === 0 && !done) {
    // Auto-evaluate when all items are placed
    finish();
  }

  const correctCount = items.filter((it) => placed[it.id] === it.bucket).length;
  const passed = correctCount / items.length >= 0.7;

  return (
    <div className="space-y-4 animate-scale-in">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("mission.miniGame")}</div>
        <h2 className="text-2xl font-display font-bold leading-tight">{mission.title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{mission.description}</p>
      </div>

      {/* Items pool */}
      {!done && (
        <>
          <div className="iq-card p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              {t("mission.tapItem")} ({remaining.length})
            </div>
            <div className="flex flex-wrap gap-2 min-h-[60px]">
              {remaining.map((it) => (
                <button
                  key={it.id}
                  onClick={() => setPicked(it)}
                  className={cn(
                    "rounded-xl border-2 px-3 py-2 text-sm flex items-center gap-2 transition-all",
                    picked?.id === it.id
                      ? "border-primary bg-primary/10 scale-105 shadow-glow"
                      : "border-border hover:border-primary/60 hover:-translate-y-0.5"
                  )}
                >
                  <span className="text-xl">{it.emoji}</span>
                  <span>{it.label}</span>
                </button>
              ))}
              {!remaining.length && (
                <div className="text-sm text-muted-foreground">{t("mission.allSorted")}</div>
              )}
            </div>
          </div>

          {/* Buckets */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => place("honest")}
              disabled={!picked}
              className={cn(
                "rounded-2xl border-2 p-4 text-center transition-all",
                "border-success/40 bg-success/5",
                picked && "hover:bg-success/10 hover:scale-105 cursor-pointer",
                !picked && "opacity-60"
              )}
            >
              <div className="text-3xl mb-1">✅</div>
              <div className="font-semibold text-sm">{t("mission.honestBucket")}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Object.values(placed).filter((b) => b === "honest").length} {t("mission.items")}
              </div>
            </button>
            <button
              onClick={() => place("corrupt")}
              disabled={!picked}
              className={cn(
                "rounded-2xl border-2 p-4 text-center transition-all",
                "border-destructive/40 bg-destructive/5",
                picked && "hover:bg-destructive/10 hover:scale-105 cursor-pointer",
                !picked && "opacity-60"
              )}
            >
              <div className="text-3xl mb-1">🚫</div>
              <div className="font-semibold text-sm">{t("mission.corruptBucket")}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Object.values(placed).filter((b) => b === "corrupt").length} {t("mission.items")}
              </div>
            </button>
          </div>
        </>
      )}

      {done && (
        <div className={cn(
          "rounded-2xl p-4 animate-fade-in flex items-start gap-3",
          passed ? "bg-success/10" : "bg-destructive/10"
        )}>
          <Mascot name="auto" mood={passed ? "happy" : "sad"} size="md" className="shrink-0" />
          <div className="flex-1 text-sm space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              {passed ? (
                <><CheckCircle2 className="h-4 w-4 text-success" /> {t("mission.greatJob")}</>
              ) : (
                <><XCircle className="h-4 w-4 text-destructive" /> {t("mission.tryAgainHint")}</>
              )}
            </div>
            <p>
              {t("mission.scoreLine", { correct: correctCount, total: items.length })}
            </p>
            {mission.explanation && (
              <p className="flex items-start gap-1.5 mt-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{mission.explanation}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          {t("common.close")}
        </Button>
        {done && !passed && (
          <Button className="flex-1 iq-grad-primary text-primary-foreground" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t("mission.tryAgain")}
          </Button>
        )}
      </div>
    </div>
  );
}
