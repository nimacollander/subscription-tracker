import { describe, expect, it } from "vitest";
import { laneCount, layoutRulerLabels } from "./rulerLayout";

const days = (...values: number[]) => values.map((day) => ({ day }));

describe("layoutRulerLabels", () => {
  it("keeps well-spaced labels in the first lane", () => {
    expect(layoutRulerLabels(days(1, 10, 20))).toEqual([
      { lane: 0, align: "left" },
      { lane: 0, align: "left" },
      { lane: 0, align: "left" },
    ]);
  });

  it("moves crowded labels to the next free lane", () => {
    expect(layoutRulerLabels(days(1, 3, 5, 9)).map((p) => p.lane)).toEqual([0, 1, 2, 0]);
  });

  it("right-aligns labels that would run past the end", () => {
    expect(layoutRulerLabels(days(22, 24, 30)).map((p) => p.align)).toEqual(["left", "right", "right"]);
  });

  it("accounts for right-aligned labels extending to the left", () => {
    // Day 28 right-aligned covers days 21–28, which collides with day 20's label (20–27).
    expect(layoutRulerLabels(days(20, 28)).map((p) => p.lane)).toEqual([0, 1]);
  });

  it("reuses the lane that frees up first when all lanes are busy", () => {
    const placements = layoutRulerLabels(days(0, 1, 2, 3), { maxLanes: 3 });
    expect(placements.map((p) => p.lane)).toEqual([0, 1, 2, 0]);
  });

  it("respects custom options", () => {
    expect(layoutRulerLabels(days(0, 2), { labelSpan: 1 }).map((p) => p.lane)).toEqual([0, 0]);
    expect(layoutRulerLabels(days(5), { horizon: 6, labelSpan: 2 })[0].align).toBe("right");
  });

  it("handles an empty list", () => {
    expect(layoutRulerLabels([])).toEqual([]);
  });
});

describe("laneCount", () => {
  it("returns the number of lanes in use", () => {
    expect(laneCount(layoutRulerLabels(days(1, 3)))).toBe(2);
    expect(laneCount([])).toBe(0);
  });
});
