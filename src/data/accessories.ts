import type { AccessoryId } from "@/types";

// Per-mascot, per-accessory full character art (transparent PNGs).
// Each variant is the original mascot with the accessory professionally
// painted in — alignment is part of the artwork, so it always looks right.
import asilbekHat from "@/assets/mascot-asilbek-hat_graduate.png";
import asilbekGlasses from "@/assets/mascot-asilbek-glasses_cool.png";
import asilbekCrown from "@/assets/mascot-asilbek-crown_gold.png";
import asilbekCape from "@/assets/mascot-asilbek-cape_hero.png";
import asilbekScarf from "@/assets/mascot-asilbek-scarf_stripes.png";
import asilbekBadge from "@/assets/mascot-asilbek-badge_star.png";

import zumradHat from "@/assets/mascot-zumrad-hat_graduate.png";
import zumradGlasses from "@/assets/mascot-zumrad-glasses_cool.png";
import zumradCrown from "@/assets/mascot-zumrad-crown_gold.png";
import zumradCape from "@/assets/mascot-zumrad-cape_hero.png";
import zumradScarf from "@/assets/mascot-zumrad-scarf_stripes.png";
import zumradBadge from "@/assets/mascot-zumrad-badge_star.png";

/** Visual definition of each cosmetic accessory the mascot can wear. */
export type AccessoryDef = {
  id: AccessoryId;
  /** Emoji used in the shop UI (chip / list). */
  emoji: string;
  /** i18n key suffix (e.g. "hat_graduate" -> shop.acc.hat_graduate.name) */
  i18nKey: string;
  /** Per-mascot full-character variants worn with this accessory. */
  variants: Record<"asilbek" | "zumrad", string>;
};

/**
 * Each accessory ships as two custom-painted variants — one per mascot.
 * The Mascot component swaps the base art for the matching variant when
 * the accessory is equipped, so positioning/scale is always pixel-perfect.
 */
export const ACCESSORIES: AccessoryDef[] = [
  {
    id: "hat_graduate",
    emoji: "🎓",
    i18nKey: "hat_graduate",
    variants: { asilbek: asilbekHat, zumrad: zumradHat },
  },
  {
    id: "glasses_cool",
    emoji: "🕶️",
    i18nKey: "glasses_cool",
    variants: { asilbek: asilbekGlasses, zumrad: zumradGlasses },
  },
  {
    id: "cape_hero",
    emoji: "🦸",
    i18nKey: "cape_hero",
    variants: { asilbek: asilbekCape, zumrad: zumradCape },
  },
  {
    id: "crown_gold",
    emoji: "👑",
    i18nKey: "crown_gold",
    variants: { asilbek: asilbekCrown, zumrad: zumradCrown },
  },
  {
    id: "scarf_stripes",
    emoji: "🧣",
    i18nKey: "scarf_stripes",
    variants: { asilbek: asilbekScarf, zumrad: zumradScarf },
  },
  {
    id: "badge_star",
    emoji: "⭐",
    i18nKey: "badge_star",
    variants: { asilbek: asilbekBadge, zumrad: zumradBadge },
  },
];

export const ACCESSORY_BY_ID = Object.fromEntries(
  ACCESSORIES.map((a) => [a.id, a])
) as Record<AccessoryId, AccessoryDef>;
