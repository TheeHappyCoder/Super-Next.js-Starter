// components/ToasterClient.tsx
"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

const VALID_THEMES = ["light", "dark", "system"] as const;
type Theme = (typeof VALID_THEMES)[number];

export function ToasterClient() {
  const { resolvedTheme } = useTheme();
  const safeTheme = VALID_THEMES.includes(resolvedTheme as Theme)
    ? (resolvedTheme as Theme)
    : "system"; // fallback just in case

  return <Toaster theme={safeTheme} richColors />;
}
