export const THEME_STORAGE_KEY = "subscription-tracker:theme";

/** "system" means no stored choice: follow the OS setting. */
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function parseThemePreference(value: string | null): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

/**
 * Runs in <head> before the first paint. An explicit choice is applied as
 * data-theme; with no choice, CSS follows prefers-color-scheme on its own.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
