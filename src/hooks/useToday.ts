import { useSyncExternalStore } from "react";
import { toISODate } from "@/lib/dates";

// Re-check the date when the tab becomes visible again, so a page left open
// overnight shows the new day.
function subscribe(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function getSnapshot() {
  return toISODate(new Date());
}

function getServerSnapshot() {
  return null;
}

/**
 * Today's local date as "YYYY-MM-DD", or null during the server render and hydration.
 * Reading the clock during render would bake the build date into the static page.
 */
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
