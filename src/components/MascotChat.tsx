import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { supabase } from "@/integrations/supabase/client";
import { Mascot, type MascotName } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Volume2, VolumeX, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

/**
 * MascotChat — live AI friend powered by Lovable AI (Gemini).
 *
 * Voice strategy:
 *   1. Prefer ElevenLabs (high-quality, returned as base64 mp3 by the edge fn).
 *   2. If ElevenLabs is unavailable (401/quota/etc), fall back to the browser's
 *      built-in SpeechSynthesis API so the mascot still talks aloud.
 *   3. If both fail (or muted), the chat continues silently.
 *
 * Chat history is persisted in the Zustand store (localStorage) per-mascot,
 * so messages survive a refresh and the conversation can continue.
 */
export function MascotChat({ mascot = "asilbek" }: { mascot?: Exclude<MascotName, "auto"> }) {
  const { t, i18n } = useTranslation();
  const profile = useStore((s) => s.profile);
  const displayName = useStore((s) => s.progress.displayName);
  const persistedMessages = useStore((s) => s.chatHistory[mascot] ?? []);
  const appendChatMessage = useStore((s) => s.appendChatMessage);
  const clearChatHistory = useStore((s) => s.clearChatHistory);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Seed a greeting on first ever open (only if history is empty)
  useEffect(() => {
    if (persistedMessages.length === 0) {
      const greetings: Record<string, string> = {
        uz: "Salom do'stim! Bugun qanday yordam beraman? 😊",
        en: "Hi friend! How can I help you today? 😊",
        ru: "Привет, друг! Чем помочь сегодня? 😊",
        kaa: "Salem dos! Bugin nege járdem berey? 😊",
      };
      appendChatMessage(mascot, {
        role: "assistant",
        content: greetings[i18n.language] ?? greetings.uz,
        ts: Date.now(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mascot]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [persistedMessages, busy]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  useEffect(() => () => stopAudio(), []);

  /** Browser Web Speech fallback — used when ElevenLabs is unavailable. */
  const speakWithBrowser = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      // Map app language to a BCP-47 hint
      const langMap: Record<string, string> = {
        uz: "uz-UZ",
        ru: "ru-RU",
        en: "en-US",
        kaa: "uz-UZ", // closest available
      };
      utter.lang = langMap[i18n.language] ?? "uz-UZ";
      utter.rate = 1;
      utter.pitch = mascot === "zumrad" ? 1.15 : 0.95;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
      return true;
    } catch {
      return false;
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");

    const userMsg: ChatMessage = { role: "user", content: text, ts: Date.now() };
    appendChatMessage(mascot, userMsg);

    // Build the context to send (use latest persisted + the new user msg)
    const conversation = [...persistedMessages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setBusy(true);
    stopAudio();

    try {
      const { data, error } = await supabase.functions.invoke("mascot-chat", {
        body: {
          messages: conversation,
          mascot,
          age: profile?.age ?? 12,
          language: i18n.language,
          displayName: displayName || undefined,
          skipAudio: muted,
        },
      });

      if (error) throw error;
      if (data?.error === "rate_limited") {
        toast.error("Juda ko'p so'rov. Biroz kuting.");
        return;
      }
      if (data?.error === "credits_exhausted") {
        toast.error("AI kreditlari tugadi.");
        return;
      }
      if (!data?.reply) throw new Error("No reply");

      appendChatMessage(mascot, {
        role: "assistant",
        content: data.reply,
        ts: Date.now(),
      });

      // Voice output: try ElevenLabs first, fall back to browser TTS
      if (!muted) {
        if (data.audio) {
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
          audioRef.current = audio;
          audio.onplay = () => setSpeaking(true);
          audio.onended = () => setSpeaking(false);
          audio.onerror = () => {
            setSpeaking(false);
            speakWithBrowser(data.reply);
          };
          audio.play().catch(() => {
            setSpeaking(false);
            speakWithBrowser(data.reply);
          });
        } else {
          // Edge function couldn't synthesize (e.g. ElevenLabs 401) — use browser
          speakWithBrowser(data.reply);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Xatolik. Qayta urinib ko'ring.");
    } finally {
      setBusy(false);
    }
  };

  const mood = speaking ? "talking" : busy ? "idle" : "happy";

  return (
    <div className="kid-card border-primary/30 overflow-hidden flex flex-col h-[520px] sm:h-[560px]">
      {/* Header with live mascot */}
      <div className="flex items-center gap-3 p-3 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <Mascot name={mascot} mood={mood} size="sm" forceShow />
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold leading-tight">
            {mascot === "asilbek" ? "Asilbek" : "Zumrad"}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {speaking ? "🔊 gapirmoqda…" : busy ? "✍️ o'ylayapti…" : "Sizning do'stingiz"}
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            if (persistedMessages.length <= 1) return;
            stopAudio();
            clearChatHistory(mascot);
            toast.success("Suhbat tozalandi");
          }}
          aria-label="Suhbatni tozalash"
          title="Suhbatni tozalash"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            if (speaking) stopAudio();
            setMuted((m) => !m);
          }}
          aria-label={muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {persistedMessages.map((m, i) => (
          <div
            key={`${m.ts}-${i}`}
            className={cn(
              "flex animate-fade-in",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-3 py-2 text-sm">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "120ms" }} />
                <span className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "240ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="p-3 border-t flex gap-2 bg-background"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Do'stingizga yozing…"
          disabled={busy}
          maxLength={300}
          autoComplete="off"
        />
        <Button type="submit" disabled={busy || !input.trim()} size="icon">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
