import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { supabase } from "@/integrations/supabase/client";
import { Mascot, type MascotName } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ChatMsg = { role: "user" | "assistant"; content: string };

/**
 * MascotChat — live AI friend powered by Lovable AI (Gemini) + ElevenLabs voice.
 * The mascot animates (mouth + hand wave + body sway) while the audio plays,
 * making it feel like a real conversation with the user's personal do'st.
 */
export function MascotChat({ mascot = "asilbek" }: { mascot?: Exclude<MascotName, "auto"> }) {
  const { t, i18n } = useTranslation();
  const profile = useStore((s) => s.profile);
  const displayName = useStore((s) => s.progress.displayName);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Greeting on first open
  useEffect(() => {
    if (messages.length === 0) {
      const greetings: Record<string, string> = {
        uz: "Salom do'stim! Bugun qanday yordam beraman? 😊",
        en: "Hi friend! How can I help you today? 😊",
        ru: "Привет, друг! Чем помочь сегодня? 😊",
        kaa: "Salem dos! Bugin nege járdem berey? 😊",
      };
      setMessages([
        { role: "assistant", content: greetings[i18n.language] ?? greetings.uz },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setSpeaking(false);
  };

  useEffect(() => () => stopAudio(), []);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setBusy(true);
    stopAudio();

    try {
      const { data, error } = await supabase.functions.invoke("mascot-chat", {
        body: {
          messages: next,
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

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

      if (data.audio && !muted) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        audioRef.current = audio;
        audio.onplay = () => setSpeaking(true);
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => setSpeaking(false);
        audio.play().catch(() => setSpeaking(false));
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
        {messages.map((m, i) => (
          <div
            key={i}
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
