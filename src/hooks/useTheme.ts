import { useLayoutEffect, useSyncExternalStore } from "react";
import {
  parseThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

function readPreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

function applyPreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", preference);
}

function emit() {
  listeners.forEach((listener) => listener());
}

// Keeps other tabs in sync with a choice made here.
function handleStorage(event: StorageEvent) {
  if (event.key !== THEME_STORAGE_KEY) return;
  applyPreference(parseThemePreference(event.newValue));
  emit();
}

function subscribePreference(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

function subscribeSystem(listener: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

const getSystemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;
const getServerSnapshot = () => null;

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  applyPreference(preference);
  emit();
}

/**
 * The stored theme choice and the theme actually shown. Both are null during
 * the server render and hydration, so render a neutral placeholder until then.
 */
export function useTheme(): {
  preference: ThemePreference | null;
  resolved: ResolvedTheme | null;
} {
  const preference = useSyncExternalStore(subscribePreference, readPreference, getServerSnapshot);
  const systemPrefersDark = useSyncExternalStore(subscribeSystem, getSystemPrefersDark, getServerSnapshot);

  // In development, Strict Mode's remount resets <html> attributes, clearing the
  // one the inline script set. Re-apply before paint; a no-op in production.
  useLayoutEffect(() => {
    applyPreference(readPreference());
  }, []);

  return {
    preference,
    resolved: preference === null || systemPrefersDark === null ? null : resolveTheme(preference, systemPrefersDark),
  };
}
