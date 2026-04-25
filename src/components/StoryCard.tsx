import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useLawById } from "@/hooks/use-localized";
import { ageGroupFor, CaseStory } from "@/types";
import { CheckCircle2, ScrollText, XCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function StoryCard({ story }: { story: CaseStory }) {
  const { t } = useTranslation();
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const answer = useStore((s) => s.answerStory);

  const today = new Date().toISOString().slice(0, 10);
  const alreadyDone =
    progress.lastStoryDate === today && progress.storiesDoneToday.includes(story.id);

  const [picked, setPicked] = useState<"A" | "B" | null>(alreadyDone ? story.correct : null);
  const [outcome, setOutcome] = useState<"correct" | "wrong" | null>(alreadyDone ? "correct" : null);

  useEffect(() => {
    if (alreadyDone) {
      setPicked(story.correct);
      setOutcome("correct");
    }
  }, [story.id, alreadyDone, story.correct]);

  const ageG = profile ? ageGroupFor(profile.age) : "explorer";
  const law = lawById(story.lawId);

  const choose = (c: "A" | "B") => {
    if (outcome) return;
    setPicked(c);
    const r = answer(story.id, c);
    if (r === "already") return;
    setOutcome(r);
  };

  return (
    <div className="iq-card p-5 animate-slide-up">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" /> {story.setting}
      </div>
      <h3 className="font-display text-xl font-bold mt-1">{story.title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{story.body}</p>

      <div className="grid sm:grid-cols-2 gap-2 mt-4">
        <Choice
          letter="A"
          text={story.choiceA}
          selected={picked === "A"}
          correct={outcome ? story.correct === "A" : null}
          disabled={!!outcome}
          onClick={() => choose("A")}
        />
        <Choice
          letter="B"
          text={story.choiceB}
          selected={picked === "B"}
          correct={outcome ? story.correct === "B" : null}
          disabled={!!outcome}
          onClick={() => choose("B")}
        />
      </div>

      {outcome && (
        <div className={cn(
          "mt-4 rounded-lg p-3 text-sm animate-fade-in",
          outcome === "correct" ? "bg-success/10 text-foreground" : "bg-destructive/10 text-foreground"
        )}>
          <div className="font-semibold flex items-center gap-1.5">
            {outcome === "correct" ? (
              <><CheckCircle2 className="h-4 w-4 text-success" /> {t("stories.explainCorrect")}</>
            ) : (
              <><XCircle className="h-4 w-4 text-destructive" /> {t("stories.explainWrong")}</>
            )}
          </div>
          <p className="mt-1">{story.explanation}</p>
          <div className="mt-3 border-t pt-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ScrollText className="h-3.5 w-3.5" /> {law.article}
            </div>
            <p className="text-sm mt-0.5">{law.plain[ageG]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Choice({
  letter, text, selected, correct, disabled, onClick,
}: {
  letter: "A" | "B";
  text: string;
  selected: boolean;
  correct: boolean | null;
  disabled: boolean;
  onClick: () => void;
}) {
  const showState = correct !== null;
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg border-2 p-3 text-left transition-all",
        !showState && "hover:border-primary/60 border-border",
        selected && !showState && "border-primary bg-primary/5",
        showState && correct && "border-success bg-success/10",
        showState && !correct && selected && "border-destructive bg-destructive/10",
      )}
    >
      <div className="flex items-start gap-2">
        <span className="font-semibold w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs shrink-0">
          {letter}
        </span>
        <span className="text-sm">{text}</span>
      </div>
    </button>
  );
}
