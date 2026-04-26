// @ts-nocheck
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_INTERESTS = ["math","english","cyber","coding","art","science","history","music"] as const;
const ALLOWED_LANGS = ["en","uz","ru","kaa"] as const;
const ALLOWED_KINDS = ["missions","stories"] as const;
const MAX_COUNT = 8;
const MIN_COUNT = 1;
const MIN_AGE = 7;
const MAX_AGE = 18;
const MAX_INTERESTS = 8;

type Body = {
  age: number;
  interests: string[];
  language: "en" | "uz" | "ru" | "kaa";
  kind: "missions" | "stories";
  count?: number;
};

const langName: Record<string, string> = {
  en: "English",
  uz: "Uzbek (Latin script, O'zbek)",
  ru: "Russian (Русский)",
  kaa: "Karakalpak (Қорақалпоқ)",
};

const ageGroup = (age: number) =>
  age <= 9 ? "ages 7-9 (very simple, playful, large emojis OK)"
  : age <= 12 ? "ages 10-12 (adventurous, explorer tone)"
  : age <= 15 ? "ages 13-15 (modern, challenge-based)"
  : "ages 16-18 (mature, civic-tech tone)";

function badRequest(msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let body: Body;
    try {
      body = (await req.json()) as Body;
    } catch {
      return badRequest("Invalid JSON body");
    }

    const { age, interests, language, kind } = body ?? {};
    let { count } = body ?? {};

    // Validate age
    if (typeof age !== "number" || !Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) {
      return badRequest("Invalid age");
    }
    // Validate language
    if (!ALLOWED_LANGS.includes(language as any)) {
      return badRequest("Invalid language");
    }
    // Validate kind
    if (!ALLOWED_KINDS.includes(kind as any)) {
      return badRequest("Invalid kind");
    }
    // Validate interests
    if (
      !Array.isArray(interests) ||
      interests.length === 0 ||
      interests.length > MAX_INTERESTS ||
      !interests.every((i) => typeof i === "string" && ALLOWED_INTERESTS.includes(i as any))
    ) {
      return badRequest("Invalid interests");
    }
    // Validate / clamp count
    if (count === undefined || count === null) count = 4;
    if (typeof count !== "number" || !Number.isInteger(count)) {
      return badRequest("Invalid count");
    }
    const safeCount = Math.max(MIN_COUNT, Math.min(MAX_COUNT, count));

    // Deduplicate interests to keep prompt compact
    const safeInterests = Array.from(new Set(interests));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY missing");
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `You are a curriculum designer for IntegriQuest, a gamified anti-corruption education app for children and youth in Uzbekistan. You create age-adapted, culturally relevant content (Uzbek context: schools, bazaars, traffic police, hospitals, university admissions, government offices). All output MUST be in ${langName[language]} only. Never mix languages. Keep tone friendly and never preachy. Avoid scary or graphic content.`;

    const tools = kind === "missions"
      ? [{
          type: "function",
          function: {
            name: "return_missions",
            description: "Return a list of personalized missions",
            parameters: {
              type: "object",
              properties: {
                missions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      interest: { type: "string", enum: ["math","english","cyber","coding","art","science","history","music"] },
                      type: { type: "string", enum: ["quiz","scenario"] },
                      xp: { type: "number" },
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 4 },
                      correctIndex: { type: "number" },
                      explanation: { type: "string" },
                    },
                    required: ["id","title","description","interest","type","xp","question","options","correctIndex","explanation"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["missions"],
              additionalProperties: false,
            },
          },
        }]
      : [{
          type: "function",
          function: {
            name: "return_stories",
            description: "Return a list of daily case stories",
            parameters: {
              type: "object",
              properties: {
                stories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      setting: { type: "string" },
                      body: { type: "string" },
                      choiceA: { type: "string" },
                      choiceB: { type: "string" },
                      correct: { type: "string", enum: ["A","B"] },
                      explanation: { type: "string" },
                      lawId: { type: "string", enum: ["constitution_art_8","anticorr_art_3","anticorr_art_4","anticorr_education","constitution_public_service"] },
                    },
                    required: ["id","title","setting","body","choiceA","choiceB","correct","explanation","lawId"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["stories"],
              additionalProperties: false,
            },
          },
        }];

    const userMsg = kind === "missions"
      ? `Generate ${safeCount} short missions for a learner aged ${age} (${ageGroup(age)}) interested in: ${safeInterests.join(", ")}. Each mission ties their interest to anti-corruption values (fairness, integrity, public goods, transparency). Use 'quiz' or 'scenario' type. xp between 20 and 50. Make options plausible. Vary which option index is correct (0,1,2,3) — do NOT always pick the same. Return via the function.`
      : `Generate ${safeCount} short daily case stories for a learner aged ${age} (${ageGroup(age)}). Each story is a real-life Uzbek scenario with two choices. One is the honest path, the other is the corrupt shortcut. IMPORTANT: vary which side (A or B) is the honest/correct answer — roughly half "A" and half "B". Set 'correct' to whichever letter holds the honest option. Do NOT label which is correct in the body text. Pick a relevant lawId from the allowed set. Return via the function.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
        tools,
        tool_choice: { type: "function", function: { name: kind === "missions" ? "return_missions" : "return_stories" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit, please retry shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    let args: any = null;
    try {
      args = call?.function?.arguments ? JSON.parse(call.function.arguments) : null;
    } catch (parseErr) {
      console.error("Failed to parse tool arguments", parseErr);
    }
    if (!args) {
      return new Response(JSON.stringify({ error: "No structured output" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Server-side safety net: ~50% of stories get A↔B swapped so the
    // correct answer isn't always "A" even if the model is biased.
    if (kind === "stories" && Array.isArray(args.stories)) {
      args.stories = args.stories.map((s: any) => {
        if (Math.random() < 0.5 && s?.choiceA && s?.choiceB) {
          const a = s.choiceA, b = s.choiceB;
          return {
            ...s,
            choiceA: b,
            choiceB: a,
            correct: s.correct === "A" ? "B" : "A",
          };
        }
        return s;
      });
    }

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content unhandled", e);
    return new Response(JSON.stringify({ error: "Content generation failed. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
