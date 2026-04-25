import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGS = [
  { code: "uz", label: "O'zbek" },
  { code: "kaa", label: "Қорақалпоқ" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  const current = LANGS.find((l) => l.code === i18n.language.split("-")[0]) ?? LANGS[3];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={compact ? "icon" : "sm"} className="gap-2">
          <Globe className="h-4 w-4" />
          {!compact && <span className="font-medium">{current.label}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => i18n.changeLanguage(l.code)}
            className={l.code === current.code ? "font-semibold" : ""}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
