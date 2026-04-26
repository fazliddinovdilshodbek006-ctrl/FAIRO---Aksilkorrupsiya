import asilbekIdle from "@/assets/mascot-asilbek.png";
import asilbekHappy from "@/assets/mascot-asilbek-happy.png";
import asilbekSad from "@/assets/mascot-asilbek-sad.png";
import zumradIdle from "@/assets/mascot-zumrad.png";
import zumradHappy from "@/assets/mascot-zumrad-happy.png";
import zumradSad from "@/assets/mascot-zumrad-sad.png";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { ACCESSORY_BY_ID } from "@/data/accessories";

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
  showAccessories = true,
}: {
  name?: MascotName;
  size?: keyof typeof sizeMap;
  mood?: MascotMood;
  className?: string;
  bounce?: boolean;
  forceShow?: boolean;
  showAccessories?: boolean;
}) {
  const ageGroup = useStore((s) => s.ageGroup());
  const profile = useStore((s) => s.profile);
  const equipped = useStore((s) => s.progress.equippedAccessories ?? []);

  // Hide for teens/civic unless explicitly forced
  if (!forceShow && profile && (ageGroup === "teen" || ageGroup === "civic")) {
    return null;
  }

  const which: "asilbek" | "zumrad" =
    name === "auto" ? (Math.random() > 0.5 ? "asilbek" : "zumrad") : name;
  const m = MASCOTS[which];
  const src = m[mood];

  return (
    <div
      className={cn("relative inline-block", sizeMap[size], className)}
      style={{ containerType: "size" } as React.CSSProperties}
    >
      <img
        src={src}
        alt={`${m.name} (${mood})`}
        width={1024}
        height={1024}
        loading="lazy"
        className={cn(
          "object-contain drop-shadow-xl select-none pointer-events-none transition-all duration-300 w-full h-full",
          bounce && mood !== "sad" && "animate-bounce-slow",
          mood === "happy" && "animate-wiggle",
          mood === "sad" && "animate-droop"
        )}
      />
      {showAccessories &&
        equipped.map((id) => {
          const acc = ACCESSORY_BY_ID[id];
          if (!acc) return null;
          // Use cqh (container query height) so emoji scales with mascot size
          const fontSize = `${30 * (acc.scale ?? 1)}cqh`;
          return (
            <span
              key={id}
              aria-hidden
              className="absolute select-none pointer-events-none leading-none drop-shadow"
              style={{
                ...acc.position,
                fontSize,
                // Fallback for browsers without container queries: ~1em
                // (the parent text size will keep it visible)
              }}
            >
              {acc.emoji}
            </span>
          );
        })}
    </div>
  );
}

/** Returns true when the user is in a child age group and should see playful UI. */
export function useIsChildMode() {
  const ageGroup = useStore((s) => s.ageGroup());
  const profile = useStore((s) => s.profile);
  if (!profile) return true; // pre-onboarding default = playful welcome
  return ageGroup === "kid" || ageGroup === "explorer";
}
