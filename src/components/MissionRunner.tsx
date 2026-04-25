import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const submit = () => {
    if (picked === null) return;
    if (picked === mission.correctIndex) {
      setResult("correct");
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1400);
    } else {
      setResult("wrong");
      setTimeout(() => {
        setResult(null);
        setPicked(null);
      }, 1100);
    }
  };

  return (
    <div className="space-y-4 animate-scale-in">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{mission.interest}</div>
        <h2 className="text-2xl font-display font-bold">{mission.title}</h2>
        <p className="text-muted-foreground mt-1">{mission.description}</p>
      </div>

      {mission.question && (
        <div className="iq-card p-4">
          <p className="font-medium">{mission.question}</p>
          <div className="mt-4 grid gap-2">
            {mission.options?.map((opt, i) => {
              const selected = picked === i;
              const isCorrect = result && i === mission.correctIndex;
              const isWrong = result === "wrong" && selected;
              return (
                <button
                  key={i}
                  disabled={!!result}
                  onClick={() => setPicked(i)}
                  className={cn(
                    "text-left rounded-lg border-2 p-3 transition-all hover:border-primary/60",
                    selected && !result && "border-primary bg-primary/5",
                    isCorrect && "border-success bg-success/10",
                    isWrong && "border-destructive bg-destructive/10 animate-shake",
                    !selected && !result && "border-border"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-success" />}
                    {isWrong && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
                  </div>
                </button>
              );
            })}
          </div>
          {result === "correct" && mission.explanation && (
            <p className="mt-3 text-sm text-success-foreground bg-success/15 rounded-md p-3 animate-fade-in">
              <Sparkles className="inline h-4 w-4 mr-1" />
              {mission.explanation}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
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
      </div>
    </div>
  );
}
