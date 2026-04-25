import { supabase } from "@/integrations/supabase/client";
import { Mission, CaseStory, Interest } from "@/types";

type Lang = "en" | "uz" | "ru" | "kaa";

export async function generateMissions(opts: {
  age: number;
  interests: Interest[];
  language: Lang;
  count?: number;
}): Promise<Mission[]> {
  const { data, error } = await supabase.functions.invoke("generate-content", {
    body: { ...opts, kind: "missions", count: opts.count ?? 4 },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  const list: Mission[] = (data?.missions ?? []).map((m: any, i: number) => ({
    id: m.id || `m_${Date.now()}_${i}`,
    title: String(m.title),
    description: String(m.description),
    interest: m.interest as Interest,
    type: m.type === "scenario" ? "scenario" : "quiz",
    xp: Math.max(10, Math.min(60, Number(m.xp) || 30)),
    question: m.question,
    options: m.options,
    correctIndex: typeof m.correctIndex === "number" ? m.correctIndex : 0,
    explanation: m.explanation,
  }));
  return list;
}

export async function generateStories(opts: {
  age: number;
  interests: Interest[];
  language: Lang;
  count?: number;
}): Promise<CaseStory[]> {
  const { data, error } = await supabase.functions.invoke("generate-content", {
    body: { ...opts, kind: "stories", count: opts.count ?? 4 },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  const list: CaseStory[] = (data?.stories ?? []).map((s: any, i: number) => ({
    id: s.id || `s_${Date.now()}_${i}`,
    title: String(s.title),
    setting: String(s.setting),
    body: String(s.body),
    choiceA: String(s.choiceA),
    choiceB: String(s.choiceB),
    correct: s.correct === "B" ? "B" : "A",
    explanation: String(s.explanation),
    lawId: String(s.lawId),
  }));
  return list;
}
