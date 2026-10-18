import { describe, expect, it } from "vitest";
import { categoryColorMap, OTHER_COLOR } from "./categoryColors";

const slice = (category: string) => ({ category, monthly: 1, share: 0 });

describe("categoryColorMap", () => {
  it("assigns slots in rank order", () => {
    const colorFor = categoryColorMap([slice("Design"), slice("Health"), slice("Video")]);
    expect([colorFor("Design"), colorFor("Health"), colorFor("Video")]).toEqual([
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
    ]);
  });

  it("keeps Other and unknown categories gray without using up a slot", () => {
    const colorFor = categoryColorMap([slice("Design"), slice("Other"), slice("Video")]);
    expect(colorFor("Other")).toBe(OTHER_COLOR);
    expect(colorFor("Video")).toBe("var(--chart-2)");
    expect(colorFor("Not listed")).toBe(OTHER_COLOR);
  });
});
