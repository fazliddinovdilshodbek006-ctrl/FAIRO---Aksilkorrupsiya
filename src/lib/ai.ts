import { supabase } from "@/integrations/supabase/client";
import { Mission, CaseStory, Interest } from "@/types";

type Lang = "en" | "uz" | "ru" | "kaa";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Retry transient edge runtime errors (503 cold-starts) with backoff.
async function invokeWithRetry(name: string, body: unknown, attempts = 3) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await supabase.functions.invoke(name, { body: body as any });
    const transient =
      error &&
      (String((error as any).message || "").includes("503") ||
        String((error as any).message || "").toLowerCase().includes("temporarily unavailable") ||
        (error as any).context?.status === 503);
    if (!error) return { data, error: null };
    lastErr = error;
    if (!transient) break;
    await sleep(500 * Math.pow(2, i)); // 500ms, 1s, 2s
  }
  return { data: null, error: lastErr };
}

export async function generateMissions(opts: {
  age: number;
  interests: Interest[];
  language: Lang;
  count?: number;
}): Promise<Mission[]> {
  const { data, error } = await invokeWithRetry("generate-content", {
    ...opts, kind: "missions", count: opts.count ?? 4,
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
