import { useEffect } from "react";
import { useStore } from "@/store";

/** Applies the age-adaptive theme via data-age on <html>. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const ageGroup = useStore((s) => s.ageGroup());
  const profile = useStore((s) => s.profile);

  useEffect(() => {
    const root = document.documentElement;
    if (profile) root.setAttribute("data-age", ageGroup);
    else root.removeAttribute("data-age");
  }, [ageGroup, profile]);

  return <>{children}</>;
}
