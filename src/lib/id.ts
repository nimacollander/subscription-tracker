export function createId(): string {
  // randomUUID only exists in secure contexts (https or localhost), so opening
  // the dev server via a LAN IP needs the fallback.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
