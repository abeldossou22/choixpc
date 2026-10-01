"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useT } from "./I18nProvider";

// Par défaut le thème suit celui de l'appareil ; le bouton bascule simplement clair ↔ sombre.
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useT();

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t.common.themeToLight : t.common.themeToDark;

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={label}
      aria-label={label}
      className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden transition-transform duration-300 hover:-translate-y-px"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}
    >
      <Sun size={16} className="absolute transition-all duration-500 ease-smooth"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0.6)" : "none" }} />
      <Moon size={16} className="absolute transition-all duration-500 ease-smooth"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "none" : "rotate(90deg) scale(0.6)" }} />
    </button>
  );
}
