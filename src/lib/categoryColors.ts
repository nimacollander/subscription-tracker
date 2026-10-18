import { OTHER_CATEGORY, type CategorySpend } from "./analytics";

// Validated categorical slots, in fixed order. "Other" is always the neutral gray.
const SLOTS = [1, 2, 3, 4, 5, 6].map((n) => `var(--chart-${n})`);
export const OTHER_COLOR = "var(--chart-other)";

/**
 * One colour per category, assigned by spend rank, so a category looks the
 * same in every chart on the page. Unlisted categories fall back to gray.
 */
export function categoryColorMap(slices: CategorySpend[]): (category: string) => string {
  const colors = new Map<string, string>();
  let slot = 0;
  for (const { category } of slices) {
    if (category === OTHER_CATEGORY) continue;
    colors.set(category, SLOTS[slot % SLOTS.length]);
    slot += 1;
  }
  return (category) => colors.get(category) ?? OTHER_COLOR;
}
