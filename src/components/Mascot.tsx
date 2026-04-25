import asilbek from "@/assets/mascot-asilbek.png";
import zumrad from "@/assets/mascot-zumrad.png";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";

export type MascotName = "asilbek" | "zumrad" | "auto";

const MASCOTS = {
  asilbek: { src: asilbek, name: "Asilbek" },
  zumrad: { src: zumrad, name: "Zumrad" },
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
 */
export function Mascot({
  name = "auto",
  size = "md",
  className,
  bounce = false,
  forceShow = false,
}: {
  name?: MascotName;
  size?: keyof typeof sizeMap;
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
    name === "auto"
      ? Math.random() > 0.5
        ? "asilbek"
        : "zumrad"
      : name;
  const m = MASCOTS[which];

  return (
    <img
      src={m.src}
      alt={m.name}
      width={1024}
      height={1024}
      loading="lazy"
      className={cn(
        "object-contain drop-shadow-xl select-none pointer-events-none",
        sizeMap[size],
        bounce && "animate-bounce-slow",
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
