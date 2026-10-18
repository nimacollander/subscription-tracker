"use client";

import { setThemePreference, useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { resolved } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setThemePreference(next)}
      // The theme is unknown until hydration; keep the button's size stable meanwhile.
      disabled={resolved === null}
      aria-label={resolved ? `Switch to ${next} theme` : "Toggle theme"}
      title={resolved ? `Switch to ${next} theme` : undefined}
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-border/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
    >
      {resolved === "dark" && <SunIcon />}
      {resolved === "light" && <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
