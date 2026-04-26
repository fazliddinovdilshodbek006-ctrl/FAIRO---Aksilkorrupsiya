import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Mission } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Sparkles, Zap, Timer } from "lucide-react";
import { partyPopper } from "@/lib/celebrate";
import { Mascot } from "@/components/Mascot";

/**
 * "Tap-race" mini-game: a stream of quick-fire prompts. Kid taps the
 * fair/honest answer fast. Builds intuition that the right answer is
 * usually obvious — even under time pressure.
 */
export function TapRaceGame({
  mission,
  onComplete,
  onClose,
}: {
  mission: Mission;
  onComplete: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const rounds = mission.tapRounds ?? [];
  const totalTime = mission.timeLimit ?? 25;

  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const timerRef = useRef<number | null>(null);

  const start = () => {
    setPhase("playing");
    setRound(0);
    setScore(0);
    setTimeLeft(totalTime);
  };

  // countdown timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          window.clearInterval(timerRef.current!);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase]);

  const finish = (finalScore: number) => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setPhase("done");
    if (finalScore / rounds.length >= 0.6) {
      partyPopper();
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1800);
    }
  };

  const tap = (i: number) => {
    if (phase !== "playing" || feedback) return;
    const r = rounds[round];
    const correct = i === r.correctIndex;
    setFeedback(correct ? "correct" : "wrong");
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    setTimeout(() => {
      setFeedback(null);
      if (round + 1 >= rounds.length) {
        finish(newScore);
      } else {
        setRound((r) => r + 1);
      }
    }, 500);
  };

  const passed = score / rounds.length >= 0.6;

  return (
    <div className="space-y-4 animate-scale-in">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
          <Zap className="h-3 w-3" /> {t("mission.tapRace")}
        </div>
        <h2 className="text-2xl font-display font-bold leading-tight">{mission.title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{mission.description}</p>
      </div>

      {phase === "intro" && (
        <div className="iq-card p-5 text-center space-y-4">
          <div className="text-5xl">⚡</div>
          <p className="text-sm">
            {t("mission.tapRaceIntro", { n: rounds.length, t: totalTime })}
          </p>
          <Button className="w-full iq-grad-primary text-primary-foreground" onClick={start}>
            {t("common.start")}
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div className="iq-card p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">
              {round + 1} / {rounds.length}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Timer className="h-3 w-3" /> {timeLeft}s
            </span>
          </div>
          <Progress value={(timeLeft / totalTime) * 100} className="h-1.5" />

          <div className="py-4">
            <p className="text-lg font-medium text-center">{rounds[round].prompt}</p>
          </div>

          <div className="grid gap-2">
            {rounds[round].options.map((opt, i) => {
              const isAnswer = i === rounds[round].correctIndex;
              const showState = feedback !== null;
              return (
                <button
                  key={i}
                  onClick={() => tap(i)}
                  disabled={!!feedback}
                  className={cn(
                    "rounded-lg border-2 p-3 text-sm transition-all text-left",
                    !showState && "hover:border-primary/60 border-border hover:-translate-y-0.5",
                    showState && isAnswer && "border-success bg-success/10",
                    showState && !isAnswer && feedback === "wrong" && "border-destructive bg-destructive/5"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-center text-muted-foreground">
            ⭐ {score}
          </div>
        </div>
      )}

      {phase === "done" && (
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
            <p>{t("mission.scoreLine", { correct: score, total: rounds.length })}</p>
            {mission.explanation && (
              <p className="flex items-start gap-1.5 mt-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{mission.explanation}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          {t("common.close")}
        </Button>
        {phase === "done" && !passed && (
          <Button className="flex-1 iq-grad-primary text-primary-foreground" onClick={start}>
            {t("mission.tryAgain")}
          </Button>
        )}
      </div>
    </div>
  );
}
