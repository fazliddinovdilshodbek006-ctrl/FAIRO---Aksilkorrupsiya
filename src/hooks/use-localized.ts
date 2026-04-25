import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useStore } from "@/store";
import { getMissions, getStories, getLaws, lawByIdLocalized, type Lang } from "@/data/localized";
import type { Mission, CaseStory, LawArticle } from "@/types";

export function useLang(): Lang {
  const { i18n } = useTranslation();
  const code = (i18n.language || "en").split("-")[0];
  return (["en", "uz", "ru", "kaa"].includes(code) ? code : "en") as Lang;
}

/**
 * Returns missions for the current language.
 * If the user has AI-generated missions in store, those are used as-is
 * (they were generated in the language active at request time).
 * Otherwise we fall back to localized static missions.
 */
export function useMissions(): Mission[] {
  const lang = useLang();
  const generated = useStore((s) => s.missions);
  return useMemo(() => (generated.length ? generated : getMissions(lang)), [generated, lang]);
}

export function useStories(): CaseStory[] {
  const lang = useLang();
  const generated = useStore((s) => s.stories);
  return useMemo(() => (generated.length ? generated : getStories(lang)), [generated, lang]);
}

export function useLaws(): LawArticle[] {
  const lang = useLang();
  return useMemo(() => getLaws(lang), [lang]);
}

export function useLawById(id: string): LawArticle {
  const lang = useLang();
  return useMemo(() => lawByIdLocalized(id, lang), [id, lang]);
}
