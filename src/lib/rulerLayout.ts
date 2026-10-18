// Places labels on the 30-day renewal ruler so they don't overlap.
// Each label occupies a span of days next to its marker; markers near the right
// edge get right-aligned labels so they stay inside the ruler.

export type RulerItem = { day: number };
export type RulerPlacement = { lane: number; align: "left" | "right" };

type Options = {
  /** Days in view. */
  horizon?: number;
  /** How many days of width one label is assumed to take. */
  labelSpan?: number;
  maxLanes?: number;
};

export function layoutRulerLabels(
  items: RulerItem[],
  { horizon = 30, labelSpan = 7, maxLanes = 3 }: Options = {},
): RulerPlacement[] {
  // Rightmost occupied day per lane, or -Infinity when empty.
  const laneEnds: number[] = Array.from({ length: maxLanes }, () => -Infinity);

  return items.map(({ day }) => {
    const align = day + labelSpan > horizon ? "right" : "left";
    const start = align === "left" ? day : day - labelSpan;
    const end = align === "left" ? day + labelSpan : day;

    let lane = laneEnds.findIndex((laneEnd) => laneEnd < start);
    // Every lane is busy: reuse the one that frees up first.
    if (lane === -1) lane = laneEnds.indexOf(Math.min(...laneEnds));
    laneEnds[lane] = Math.max(laneEnds[lane], end);

    return { lane, align };
  });
}

/** Number of lanes actually used, for sizing the ruler. */
export function laneCount(placements: RulerPlacement[]): number {
  return placements.reduce((max, p) => Math.max(max, p.lane + 1), 0);
}
