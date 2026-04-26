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

/**
 * Positions are calibrated against the actual mascot artwork bounding box.
 * The PNGs have transparent padding around the figure: the head sits roughly
 * at 18-42% of total image height, and the eyes are around 30%. Accessories
 * align to those landmarks (not the raw container).
 */
export const ACCESSORIES: AccessoryDef[] = [
  {
    id: "hat_graduate",
    emoji: "🎓",
    i18nKey: "hat_graduate",
    position: { top: "5%", left: "50%", transform: "translate(-50%, -50%)" },
    scale: 0.7,
  },
  {
    id: "glasses_cool",
    emoji: "🕶️",
    i18nKey: "glasses_cool",
    position: { top: "26%", left: "50%", transform: "translate(-50%, -50%)" },
    scale: 0.45,
  },
  {
    id: "cape_hero",
    emoji: "🦸",
    i18nKey: "cape_hero",
    position: { top: "55%", left: "50%", transform: "translate(-50%, -50%)" },
    scale: 0.7,
  },
  {
    id: "crown_gold",
    emoji: "👑",
    i18nKey: "crown_gold",
    position: { top: "6%", left: "50%", transform: "translate(-50%, -50%)" },
    scale: 0.65,
  },
  {
    id: "scarf_stripes",
    emoji: "🧣",
    i18nKey: "scarf_stripes",
    position: { top: "38%", left: "50%", transform: "translate(-50%, -50%)" },
    scale: 0.55,
  },
  {
    id: "badge_star",
    emoji: "⭐",
    i18nKey: "badge_star",
    position: { top: "48%", left: "62%", transform: "translate(-50%, -50%)" },
    scale: 0.3,
  },
];

export const ACCESSORY_BY_ID = Object.fromEntries(
  ACCESSORIES.map((a) => [a.id, a])
) as Record<AccessoryId, AccessoryDef>;
