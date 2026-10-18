"use client";

import { setThemePreference, useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  { value: "system", label: "System", description: "Match your device setting" },
  { value: "light", label: "Light", description: "Always light" },
  { value: "dark", label: "Dark", description: "Always dark" },
];

export function ThemePicker() {
  const { preference } = useTheme();

  return (
    <fieldset>
      <legend className="sr-only">Theme</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-border/30 has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40"
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={preference === option.value}
              disabled={preference === null}
              onChange={() => setThemePreference(option.value)}
              className="mt-0.5 accent-[var(--accent)]"
            />
            <span>
              <span className="block text-sm font-medium">{option.label}</span>
              <span className="block text-xs text-muted">{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
