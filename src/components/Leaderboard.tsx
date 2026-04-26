import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, Crown, Medal, Pencil } from "lucide-react";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Local-only leaderboard. We don't have a backend yet for global scores,
 * so we generate a stable set of "neighbour" players whose XP is anchored
 * around the current user's level — this keeps motivation high while making
 * the user feel they are climbing.
 */

type Row = { name: string; level: number; xp: number; isMe?: boolean };

const NPC_NAMES = [
  "Asilbek", "Zumrad", "Dilnoza", "Otabek", "Nargiza",
  "Botir", "Madina", "Sardor", "Kamola", "Jasur",
  "Shahnoza", "Bekzod", "Lola", "Rustam", "Gulnora",
];

function generateBoard(myLevel: number, myXp: number, myName: string): Row[] {
  // Deterministic per current level so the list doesn't flip on every render.
  let seed = myLevel * 9301 + 49297;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const me: Row = { name: myName || "You", level: myLevel, xp: myXp, isMe: true };
  const totalScore = (r: Row) => r.level * 1000 + r.xp;

  const npcs: Row[] = NPC_NAMES.slice(0, 9).map((name, i) => {
    // Spread NPCs across ±3 levels of the user
    const offset = (i % 7) - 3;
    const level = Math.max(1, myLevel + offset);
    const xp = Math.floor(rand() * 200);
    return { name, level, xp };
  });

  return [...npcs, me].sort((a, b) => totalScore(b) - totalScore(a));
}

export function Leaderboard() {
  const { t } = useTranslation();
  const level = useStore((s) => s.progress.level);
  const xp = useStore((s) => s.progress.xp);
  const displayName = useStore((s) => s.progress.displayName ?? "");
  const setDisplayName = useStore((s) => s.setDisplayName);

  const [editing, setEditing] = useState(!displayName);
  const [draftName, setDraftName] = useState(displayName);

  const board = useMemo(
    () => generateBoard(level, xp, displayName || t("leaderboard.you")),
    [level, xp, displayName, t]
  );

  return (
    <div className="space-y-4">
      <div className="iq-card p-4 bg-gradient-to-br from-primary/10 via-background to-gold/10">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          <h3 className="font-display text-lg font-bold">{t("leaderboard.title")}</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("leaderboard.subtitle")}
        </p>
      </div>

      {editing ? (
        <div className="iq-card p-3 flex items-center gap-2">
          <Input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder={t("leaderboard.namePlaceholder")}
            maxLength={20}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={() => {
              setDisplayName(draftName.trim());
              setEditing(false);
            }}
            disabled={!draftName.trim()}
          >
            {t("common.confirm")}
          </Button>
        </div>
      ) : (
        <div className="iq-card p-3 flex items-center justify-between">
          <span className="text-sm">
            {t("leaderboard.youAre")}: <strong>{displayName}</strong>
          </span>
          <Button size="sm" variant="ghost" onClick={() => { setDraftName(displayName); setEditing(true); }}>
            <Pencil className="h-3.5 w-3.5 mr-1" /> {t("leaderboard.rename")}
          </Button>
        </div>
      )}

      <ul className="space-y-2">
        {board.map((row, idx) => {
          const rank = idx + 1;
          const RankIcon =
            rank === 1 ? Crown : rank === 2 || rank === 3 ? Medal : null;
          return (
            <li
              key={row.name + idx}
              className={cn(
                "iq-card p-3 flex items-center gap-3 transition-colors",
                row.isMe && "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
              )}
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                  rank === 1 && "bg-gold/20 text-gold",
                  rank === 2 && "bg-muted text-foreground",
                  rank === 3 && "bg-bribe/20 text-bribe",
                  rank > 3 && "bg-secondary text-secondary-foreground"
                )}
              >
                {RankIcon ? <RankIcon className="h-4 w-4" /> : rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{row.name}{row.isMe && " ★"}</div>
                <div className="text-xs text-muted-foreground">
                  {t("common.level")} {row.level} · {row.xp} XP
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
