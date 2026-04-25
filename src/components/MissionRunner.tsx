import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types";
import { useStore } from "@/store";
import { CheckCircle2, XCircle, Sparkles, Coins, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Mascot, useIsChildMode } from "@/components/Mascot";
import { partyPopper } from "@/lib/celebrate";

export function MissionRunner({
  mission,
  onComplete,
  onClose,
}: {
  mission: Mission;
  onComplete: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const bribeCost = useStore((s) => s.bribeCost());
  const takeBribe = useStore((s) => s.takeBribe);
  const coins = useStore((s) => s.progress.coins);
  const isChild = useIsChildMode();

  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  const submit = () => {
    if (picked === null) return;
    if (picked === mission.correctIndex) {
      setResult("correct");
      partyPopper();
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1800);
    } else {
      setResult("wrong");
    }
  };

  const tryAgain = () => {
    setResult(null);
    setRevealed(false);
    setPicked(null);
  };

  const acceptShortcut = () => {
    const ok = takeBribe();
    if (!ok) {
      toast.error(t("mission.shortcutNotEnough"));
      return;
    }
    toast.warning(t("mission.shortcutWarning"));
    setShowOffer(false);
    onClose();
  };

  return (
    <div className="space-y-4 animate-scale-in">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{mission.interest}</div>
        <h2 className="text-2xl font-display font-bold leading-tight">{mission.title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{mission.description}</p>
      </div>

      {/* Tempting shortcut chip */}
      {!result && !showOffer && (
        <button
          onClick={() => setShowOffer(true)}
          className="w-full text-left rounded-lg border-2 border-dashed border-bribe/40 bg-bribe/5 p-3 hover:bg-bribe/10 transition-all"
        >
          <div className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4 text-bribe" />
            <span className="font-medium">{t("mission.shortcutOffer")}</span>
            <span className="ml-auto text-xs text-bribe font-semibold">−{bribeCost} 🪙</span>
          </div>
        </button>
      )}

      {showOffer && (
        <div className="rounded-lg border-2 border-bribe/50 bg-bribe/10 p-4 animate-fade-in space-y-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-5 w-5 text-bribe shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">{t("mission.shortcutOffer")}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("mission.shortcutOfferDesc", { n: bribeCost })}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowOffer(false)}
            >
              {t("mission.shortcutDecline")}
            </Button>
            <Button
              size="sm"
              className="flex-1 iq-grad-bribe text-bribe-foreground"
              disabled={coins < bribeCost}
              onClick={acceptShortcut}
            >
              <Coins className="h-4 w-4 mr-1" />
              {t("mission.shortcutAccept")}
            </Button>
          </div>
        </div>
      )}

      {mission.question && (
        <div className="iq-card p-4">
          <p className="font-medium">{mission.question}</p>
          <div className="mt-4 grid gap-2">
            {mission.options?.map((opt, i) => {
              const selected = picked === i;
              const showState = result !== null || revealed;
              const isAnswer = i === mission.correctIndex;
              const isWrongPick = result === "wrong" && selected && !isAnswer;
              return (
                <button
                  key={i}
                  disabled={showState}
                  onClick={() => setPicked(i)}
                  className={cn(
                    "text-left rounded-lg border-2 p-3 transition-all",
                    !showState && "hover:border-primary/60 border-border",
                    !showState && selected && "border-primary bg-primary/5",
                    showState && isAnswer && "border-success bg-success/10",
                    isWrongPick && "border-destructive bg-destructive/10 animate-shake",
                    showState && !isAnswer && !isWrongPick && "border-border opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-semibold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                      showState && isAnswer ? "bg-success text-success-foreground" :
                      isWrongPick ? "bg-destructive text-destructive-foreground" :
                      "bg-muted"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm">{opt}</span>
                    {showState && isAnswer && <CheckCircle2 className="ml-auto h-5 w-5 text-success shrink-0" />}
                    {isWrongPick && <XCircle className="ml-auto h-5 w-5 text-destructive shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {result === "correct" && (
            <div className="mt-3 rounded-xl bg-success/15 p-3 animate-fade-in flex items-start gap-3">
              {isChild && (
                <Mascot name="auto" mood="happy" size="sm" className="shrink-0 -mt-1" />
              )}
              <div className="flex-1 text-sm flex items-start gap-2">
                <Sparkles className="inline h-4 w-4 mt-0.5 shrink-0 text-success" />
                <span>
                  <span className="font-semibold">{t("mission.correct")} </span>
                  {mission.explanation}
                </span>
              </div>
            </div>
          )}

          {result === "wrong" && (
            <div className="mt-3 rounded-xl bg-destructive/10 p-3 animate-fade-in">
              <div className="flex items-start gap-3">
                {isChild && (
                  <Mascot name="auto" mood="sad" size="sm" className="shrink-0 -mt-1" />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    {t("mission.wrong")}
                  </div>
                  {mission.explanation && (
                    <p className="text-sm">
                      <span className="font-semibold">{t("mission.wrongWhy")} </span>
                      {mission.explanation}
                    </p>
                  )}
                  {revealed && mission.options && mission.correctIndex !== undefined && (
                    <p className="text-sm border-t pt-2">
                      <span className="font-semibold">{t("mission.correctAnswerIs")} </span>
                      <span className="text-success font-medium">
                        {String.fromCharCode(65 + mission.correctIndex)}. {mission.options[mission.correctIndex]}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {result === "wrong" ? (
          <>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t("common.close")}
            </Button>
            {!revealed && (
              <Button variant="secondary" className="flex-1" onClick={() => setRevealed(true)}>
                {t("mission.seeCorrect")}
              </Button>
            )}
            <Button
              className="flex-1 iq-grad-primary text-primary-foreground"
              onClick={tryAgain}
            >
              {t("mission.tryAgain")}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              className="flex-1 iq-grad-primary text-primary-foreground"
              disabled={picked === null || !!result}
              onClick={submit}
            >
              {t("mission.submit")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
