"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Motyw"
        className="h-9 w-9 rounded-md"
        disabled
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Jasny" : "Ciemny"}
    </button>
  );
}
