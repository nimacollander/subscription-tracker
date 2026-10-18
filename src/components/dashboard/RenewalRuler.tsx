import { addDays } from "@/lib/dates";
import { formatCurrency, formatDayMonth, formatDueIn } from "@/lib/format";
import { DUE_SOON_DAYS, isDueSoon, type UpcomingRenewal } from "@/lib/renewals";
import { laneCount, layoutRulerLabels } from "@/lib/rulerLayout";

type RenewalRulerProps = {
  renewals: UpcomingRenewal[];
  today: string;
  horizon: number;
};

const LANE_HEIGHT = 48;
const MAJOR_TICK_EVERY = 7;

const percent = (day: number, horizon: number) => `${(day / horizon) * 100}%`;

/**
 * The next `horizon` days as a ruler: one tick per day, each upcoming charge
 * marked on the day it lands, and the due-soon stretch shaded in brass.
 */
export function RenewalRuler({ renewals, today, horizon }: RenewalRulerProps) {
  const placements = layoutRulerLabels(
    renewals.map((r) => ({ day: r.daysUntil })),
    { horizon },
  );
  const lanes = Math.max(1, laneCount(placements));
  const trackHeight = lanes * LANE_HEIGHT;
  const days = Array.from({ length: horizon + 1 }, (_, day) => day);

  const summary =
    renewals.length === 0
      ? `No renewals in the next ${horizon} days.`
      : `Renewals in the next ${horizon} days: ${renewals
          .map((r) => `${r.subscription.name} ${formatDueIn(r.daysUntil).toLowerCase()}`)
          .join(", ")}.`;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-label text-muted">The next {horizon} days</h2>
        <p className="flex items-center gap-2 text-xs text-muted">
          <span aria-hidden className="h-2.5 w-5 rounded-sm bg-warning-soft ring-1 ring-warning/40" />
          Due within {DUE_SOON_DAYS} days
        </p>
      </div>

      {/* Scrolls sideways on narrow screens rather than squeezing labels together. */}
      {/* The right-edge fade hints that it scrolls. */}
      <div className="-mx-5 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,black_80%,transparent)] sm:mx-0 sm:px-0 sm:[mask-image:none]">
        <div role="img" aria-label={summary} className="relative min-w-[640px] px-2">
          <div className="relative" style={{ height: trackHeight + 12 }}>
            {/* Due-soon zone */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 left-0 rounded-md bg-warning-soft"
              style={{ width: percent(DUE_SOON_DAYS, horizon) }}
            />

            {renewals.map((renewal, i) => {
              const { lane, align } = placements[i];
              const soon = isDueSoon(renewal.daysUntil);
              const x = percent(renewal.daysUntil, horizon);
              const labelTop = lane * LANE_HEIGHT + 4;

              return (
                <div key={renewal.subscription.id} aria-hidden>
                  {/* Stem from the label down to the baseline */}
                  <span
                    className="absolute w-px bg-foreground/25"
                    style={{ left: x, top: labelTop + 6, bottom: 0 }}
                  />
                  <div
                    className={`absolute max-w-[11rem] ${align === "left" ? "pl-2.5" : "pr-2.5 text-right"}`}
                    style={{
                      top: labelTop,
                      ...(align === "left" ? { left: x } : { right: `calc(100% - ${x})` }),
                    }}
                  >
                    <p className="truncate text-sm leading-tight font-semibold">{renewal.subscription.name}</p>
                    <p className={`mt-0.5 text-xs tabular-nums ${soon ? "font-medium text-warning" : "text-muted"}`}>
                      {formatCurrency(renewal.subscription.price)} · {formatDayMonth(renewal.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Baseline, day ticks, and markers */}
          <div className="relative h-9 border-t-[1.5px] border-foreground/70">
            {days.map((day) => {
              const major = day % MAJOR_TICK_EVERY === 0;
              return (
                <span
                  key={day}
                  aria-hidden
                  className={`absolute top-0 w-px ${major ? "h-2.5 bg-foreground/70" : "h-1.5 bg-foreground/30"}`}
                  style={{ left: percent(day, horizon) }}
                />
              );
            })}
            {days
              .filter((day) => day % MAJOR_TICK_EVERY === 0)
              .map((day) => (
                <span
                  key={day}
                  aria-hidden
                  className={`font-label absolute top-4 text-muted ${day === 0 ? "" : "-translate-x-1/2"}`}
                  style={{ left: percent(day, horizon) }}
                >
                  {day === 0 ? "Today" : formatDayMonth(addDays(today, day))}
                </span>
              ))}
            {renewals.map((renewal) => (
              <span
                key={renewal.subscription.id}
                aria-hidden
                className={`absolute -top-[6px] size-2.5 -translate-x-1/2 rounded-full ring-2 ring-surface ${
                  isDueSoon(renewal.daysUntil) ? "bg-warning" : "bg-accent"
                }`}
                style={{ left: percent(renewal.daysUntil, horizon) }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
