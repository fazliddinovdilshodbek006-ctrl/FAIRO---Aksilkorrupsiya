import { useTranslation } from "react-i18next";
import { LAWS } from "@/data/laws";
import { useStore } from "@/store";
import { ageGroupFor } from "@/types";
import { ScrollText, BookOpen } from "lucide-react";

export function LawLibrary() {
  const { t } = useTranslation();
  const profile = useStore((s) => s.profile);
  const ageG = profile ? ageGroupFor(profile.age) : "explorer";

  return (
    <div className="space-y-4">
      <div className="iq-card p-5 iq-hero text-primary-foreground">
        <div className="flex items-center gap-2 text-sm opacity-90">
          <BookOpen className="h-4 w-4" /> {t("law.title")}
        </div>
        <h2 className="font-display text-2xl font-bold mt-1">{t("law.title")}</h2>
        <p className="text-sm opacity-90 mt-1">{t("law.subtitle")}</p>
      </div>

      <div className="grid gap-3">
        {LAWS.map((l) => (
          <article key={l.id} className="iq-card p-4 animate-fade-in">
            <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <ScrollText className="h-3.5 w-3.5" />
              {l.source === "constitution" ? "Constitution" : "Anti-Corruption Law"}
            </div>
            <h3 className="font-display font-bold mt-1">{l.title}</h3>
            <div className="text-xs text-muted-foreground">{l.article}</div>
            <p className="text-sm mt-2">{l.plain[ageG]}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
