// Mascot chat: Gemini-powered reply + ElevenLabs TTS, all in one call.
// Returns JSON: { reply: string, audio: string (base64 mp3), voiceId, mood }
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

// Two friendly multilingual voices
const VOICE_BY_MASCOT: Record<string, string> = {
  asilbek: "TX3LPaxmHKxFdv7VOQHJ", // Liam — warm male
  zumrad: "XrExE9yKIg1WjnnlVkGX", // Matilda — warm female
};

const langName = (code: string) => {
  switch (code) {
    case "uz": return "Uzbek (Latin)";
    case "ru": return "Russian";
    case "kaa": return "Karakalpak";
    default: return "English";
  }
};

const personaPrompt = (opts: {
  mascot: "asilbek" | "zumrad";
  age: number;
  language: string;
  displayName?: string;
}) => {
  const isChild = opts.age <= 12;
  const tone = isChild
    ? "playful, warm, like a fun older sibling. Use simple words, short sentences, and 1 emoji per reply."
    : opts.age <= 15
    ? "friendly peer. Encouraging, honest, no condescension."
    : "respectful friend, thoughtful, mature but warm.";
  const name = opts.mascot === "asilbek" ? "Asilbek" : "Zumrad";
  const userName = opts.displayName ? ` The user's name is ${opts.displayName}.` : "";
  return `You are ${name}, a friendly mascot inside FAIRO — an app that teaches Uzbek kids and teens about honesty, fairness, and Uzbekistan's anti-corruption laws.
You are the user's close friend (do'st/sirdosh).${userName}
The user is ${opts.age} years old. Tone: ${tone}
ALWAYS reply in ${langName(opts.language)}.
Keep replies SHORT (1-3 sentences, max ~280 characters) — they will be spoken aloud.
Never lecture. Be curious, ask one small follow-up question sometimes.
If the user mentions cheating, bribery, or unfair shortcuts, gently steer toward honesty using a tiny example, never preach.
Do not use markdown, lists, or code — plain spoken text only.`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY missing");

    const body = await req.json().catch(() => ({}));
    const messages: ChatMsg[] = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const mascot: "asilbek" | "zumrad" = body.mascot === "zumrad" ? "zumrad" : "asilbek";
    const age = Math.max(7, Math.min(99, Number(body.age) || 12));
    const language = String(body.language || "uz");
    const displayName = typeof body.displayName === "string" ? body.displayName.slice(0, 40) : undefined;
    const skipAudio = body.skipAudio === true;

    if (!messages.length || !messages.some((m) => m.role === "user")) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Get reply from Lovable AI Gateway (Gemini)
    const system = personaPrompt({ mascot, age, language, displayName });
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: age <= 12 ? "google/gemini-2.5-flash" : "google/gemini-2.5-pro",
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "credits_exhausted" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI gateway error", aiRes.status, txt);
      return new Response(JSON.stringify({ error: "ai_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiRes.json();
    const reply: string = (aiData.choices?.[0]?.message?.content ?? "").trim().slice(0, 600);

    if (!reply) {
      return new Response(JSON.stringify({ error: "empty_reply" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Quick mood heuristic for animation cue
    const lower = reply.toLowerCase();
    const mood = /(😢|sorry|kechir|жаль|sad|noto'g)/.test(lower)
      ? "sad"
      : /(!|🎉|👍|👏|zo'r|halol|great|молодец|ajoyib)/.test(lower)
      ? "happy"
      : "idle";

    if (skipAudio) {
      return new Response(JSON.stringify({ reply, audio: null, voiceId: null, mood }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Generate ElevenLabs TTS
    const voiceId = VOICE_BY_MASCOT[mascot];
    const ttsRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: reply,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.75,
            style: 0.4,
            use_speaker_boost: true,
            speed: age <= 10 ? 0.95 : 1.0,
          },
        }),
      }
    );

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.error("ElevenLabs error", ttsRes.status, errText);
      // Return text-only reply if TTS fails so chat still works
      return new Response(
        JSON.stringify({ reply, audio: null, voiceId, mood, ttsError: ttsRes.status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const audioBuf = await ttsRes.arrayBuffer();
    const audioB64 = base64Encode(audioBuf);

    return new Response(
      JSON.stringify({ reply, audio: audioB64, voiceId, mood }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("mascot-chat failed", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
