import type { AccessoryId } from "@/types";

/** Visual definition of each cosmetic accessory the mascot can wear. */
export type AccessoryDef = {
  id: AccessoryId;
  /** Emoji used both in the shop and overlaid on the mascot. */
  emoji: string;
  /** i18n key suffix (e.g. "hat_graduate" -> shop.acc.hat_graduate.name) */
  i18nKey: string;
  /** CSS positioning over the mascot image (centered container 100% x 100%). */
  position: { top?: string; left?: string; right?: string; bottom?: string; transform?: string };
  /** Relative font size. 1 = 28% of mascot height. */
  scale?: number;
};

export const ACCESSORIES: AccessoryDef[] = [
  {
    id: "hat_graduate",
    emoji: "🎓",
    i18nKey: "hat_graduate",
    position: { top: "-10%", left: "50%", transform: "translateX(-50%)" },
    scale: 1.05,
  },
  {
    id: "glasses_cool",
    emoji: "🕶️",
    i18nKey: "glasses_cool",
    position: { top: "26%", left: "50%", transform: "translateX(-50%)" },
    scale: 0.85,
  },
  {
    id: "cape_hero",
    emoji: "🦸",
    i18nKey: "cape_hero",
    position: { bottom: "-2%", right: "-6%" },
    scale: 0.9,
  },
  {
    id: "crown_gold",
    emoji: "👑",
    i18nKey: "crown_gold",
    position: { top: "-12%", left: "50%", transform: "translateX(-50%)" },
    scale: 1.1,
  },
  {
    id: "scarf_stripes",
    emoji: "🧣",
    i18nKey: "scarf_stripes",
    position: { top: "55%", left: "50%", transform: "translateX(-50%)" },
    scale: 0.95,
  },
  {
    id: "badge_star",
    emoji: "⭐",
    i18nKey: "badge_star",
    position: { top: "62%", right: "10%" },
    scale: 0.55,
  },
];

export const ACCESSORY_BY_ID = Object.fromEntries(
  ACCESSORIES.map((a) => [a.id, a])
) as Record<AccessoryId, AccessoryDef>;
