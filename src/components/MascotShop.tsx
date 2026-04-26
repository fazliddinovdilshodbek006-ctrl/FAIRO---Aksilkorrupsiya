import { useTranslation } from "react-i18next";
import { Coins, Lock, Check } from "lucide-react";
import { useStore, ACCESSORY_COST } from "@/store";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { ACCESSORIES } from "@/data/accessories";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Cosmetic shop where the user spends coins to unlock and equip mascot
 * accessories. Buying an item auto-equips it; tap an owned item to toggle.
 */
export function MascotShop() {
  const { t } = useTranslation();
  const coins = useStore((s) => s.progress.coins);
  const owned = useStore((s) => s.progress.ownedAccessories ?? []);
  const equipped = useStore((s) => s.progress.equippedAccessories ?? []);
  const buy = useStore((s) => s.buyAccessory);
  const toggle = useStore((s) => s.toggleAccessory);

  return (
    <div className="space-y-4">
      <div className="iq-card p-5 flex flex-col items-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          {t("shop.preview")}
        </div>
        <Mascot size="lg" mood="happy" forceShow />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">{t("shop.title")}</h3>
        <span className="inline-flex items-center gap-1 text-sm">
          <Coins className="h-4 w-4 text-gold" />
          <span className="font-semibold tabular-nums">{coins}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACCESSORIES.map((acc) => {
          const isOwned = owned.includes(acc.id);
          const isEquipped = equipped.includes(acc.id);
          const cost = ACCESSORY_COST[acc.id];
          const canAfford = coins >= cost;

          const onClick = () => {
            if (isOwned) {
              toggle(acc.id);
              return;
            }
            const ok = buy(acc.id);
            if (ok) toast.success(t("shop.bought"));
            else toast.error(t("shop.notEnough"));
          };

          return (
            <button
              key={acc.id}
              onClick={onClick}
              className={cn(
                "iq-card p-3 flex flex-col items-center text-center transition-all hover:-translate-y-0.5",
                isEquipped && "ring-2 ring-primary border-primary/40 shadow-glow",
                !isOwned && !canAfford && "opacity-60"
              )}
            >
              <div className="text-4xl mb-1.5" aria-hidden>
                {acc.emoji}
              </div>
              <div className="text-sm font-semibold leading-tight">
                {t(`shop.acc.${acc.i18nKey}`)}
              </div>
              {isOwned ? (
                <div
                  className={cn(
                    "text-[11px] mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                    isEquipped
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isEquipped ? (
                    <>
                      <Check className="h-3 w-3" /> {t("shop.equipped")}
                    </>
                  ) : (
                    t("shop.owned")
                  )}
                </div>
              ) : (
                <div className="text-[11px] mt-1.5 inline-flex items-center gap-1 text-muted-foreground">
                  {!canAfford && <Lock className="h-3 w-3" />}
                  <Coins className="h-3 w-3 text-gold" />
                  <span className="tabular-nums">{cost}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
