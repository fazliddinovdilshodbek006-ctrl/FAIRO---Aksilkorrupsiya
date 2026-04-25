import asilbekIdle from "@/assets/mascot-asilbek.png";
import asilbekHappy from "@/assets/mascot-asilbek-happy.png";
import asilbekSad from "@/assets/mascot-asilbek-sad.png";
import zumradIdle from "@/assets/mascot-zumrad.png";
import zumradHappy from "@/assets/mascot-zumrad-happy.png";
import zumradSad from "@/assets/mascot-zumrad-sad.png";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";

export type MascotName = "asilbek" | "zumrad" | "auto";
export type MascotMood = "idle" | "happy" | "sad";

const MASCOTS = {
  asilbek: {
    name: "Asilbek",
    idle: asilbekIdle,
    happy: asilbekHappy,
    sad: asilbekSad,
  },
  zumrad: {
    name: "Zumrad",
    idle: zumradIdle,
    happy: zumradHappy,
    sad: zumradSad,
  },
};

const sizeMap = {
  xs: "h-10 w-10",
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-40 w-40",
  xl: "h-56 w-56",
};

/**
 * Cartoon mascot character — only renders for child age groups (kid/explorer).
 * Older groups (teen/civic) get an information-focused UI without characters.
 *
 * `mood` switches between idle / happy (used on correct answers) / sad (on wrong).
 */
export function Mascot({
  name = "auto",
  size = "md",
  mood = "idle",
  className,
  bounce = false,
  forceShow = false,
}: {
  name?: MascotName;
  size?: keyof typeof sizeMap;
  mood?: MascotMood;
  className?: string;
  bounce?: boolean;
  forceShow?: boolean;
}) {
  const ageGroup = useStore((s) => s.ageGroup());
  const profile = useStore((s) => s.profile);

  // Hide for teens/civic unless explicitly forced
  if (!forceShow && profile && (ageGroup === "teen" || ageGroup === "civic")) {
    return null;
  }

  const which: "asilbek" | "zumrad" =
    name === "auto" ? (Math.random() > 0.5 ? "asilbek" : "zumrad") : name;
  const m = MASCOTS[which];
  const src = m[mood];

  return (
    <img
      src={src}
      alt={`${m.name} (${mood})`}
      width={1024}
      height={1024}
      loading="lazy"
      className={cn(
        "object-contain drop-shadow-xl select-none pointer-events-none transition-all duration-300",
        sizeMap[size],
        bounce && mood !== "sad" && "animate-bounce-slow",
        mood === "happy" && "animate-wiggle",
        mood === "sad" && "animate-droop",
        className
      )}
    />
  );
}

/** Returns true when the user is in a child age group and should see playful UI. */
export function useIsChildMode() {
  const ageGroup = useStore((s) => s.ageGroup());
  const profile = useStore((s) => s.profile);
  if (!profile) return true; // pre-onboarding default = playful welcome
  return ageGroup === "kid" || ageGroup === "explorer";
}
