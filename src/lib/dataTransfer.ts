// JSON export and import. Unlike storage parsing, which quietly drops bad
// entries, import rejects the whole file and says why, so nothing is lost silently.
import type { Subscription } from "@/types/subscription";
import { getSubscriptionProblem, STORAGE_VERSION } from "./subscriptionStorage";

export const EXPORT_FORMAT = "subscription-tracker";
export const MAX_IMPORT_BYTES = 1_000_000;

export type ImportResult = { ok: true; subscriptions: Subscription[] } | { ok: false; error: string };

export function createExport(subscriptions: Subscription[], exportedAt: Date): string {
  return JSON.stringify(
    { format: EXPORT_FORMAT, version: STORAGE_VERSION, exportedAt: exportedAt.toISOString(), subscriptions },
    null,
    2,
  );
}

export function exportFilename(today: string): string {
  return `subscription-tracker-${today}.json`;
}

const NOT_AN_EXPORT = "This file isn't a Subscription Tracker export.";

export function parseImport(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file isn't valid JSON." };
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { ok: false, error: NOT_AN_EXPORT };
  }
  const file = data as Record<string, unknown>;
  if (file.format !== EXPORT_FORMAT || !Array.isArray(file.subscriptions)) {
    return { ok: false, error: NOT_AN_EXPORT };
  }
  if (file.version !== STORAGE_VERSION) {
    const newer = typeof file.version === "number" && file.version > STORAGE_VERSION;
    return {
      ok: false,
      error: newer
        ? "This file was exported from a newer version of the app."
        : "This export version isn't supported.",
    };
  }

  const ids = new Set<string>();
  for (const [index, item] of file.subscriptions.entries()) {
    const problem = getSubscriptionProblem(item);
    if (problem) {
      const name = (item as { name?: unknown })?.name;
      const label = typeof name === "string" && name.trim() ? ` ("${name.trim()}")` : "";
      return { ok: false, error: `Subscription ${index + 1}${label} ${problem}.` };
    }
    const { id } = item as Subscription;
    if (ids.has(id)) return { ok: false, error: `The file contains the id "${id}" more than once.` };
    ids.add(id);
  }

  return { ok: true, subscriptions: file.subscriptions as Subscription[] };
}
