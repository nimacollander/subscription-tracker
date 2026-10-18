"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { CalendarIcon } from "@/components/ui/icons";
import { buildMonthGrid, monthsBetween, shiftMonth, WEEKDAY_LABELS } from "@/lib/calendar";
import { getChargesBetween, groupChargesByDate } from "@/lib/charges";
import { addDays, daysBetween, parseISODate } from "@/lib/dates";
import { formatCurrency, formatLongDate, formatMonthYear } from "@/lib/format";
import { isDueSoon } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

const MONTHS_AHEAD = 11;
const MAX_AVATARS = 3;

type RenewalCalendarProps = { subscriptions: Subscription[]; today: string };

/**
 * A month view with every charge on the day it lands. Only days with charges
 * are focusable, so keyboard users tab through charge days rather than every date.
 */
export function RenewalCalendar({ subscriptions, today }: RenewalCalendarProps) {
  const thisMonth = today.slice(0, 7);
  const [month, setMonth] = useState(thisMonth);
  const [selected, setSelected] = useState<string | null>(null);

  const grid = buildMonthGrid(month);
  const until = addDays(grid[grid.length - 1].date, 1);
  // Includes charges already made earlier this month, so the month reads complete.
  const byDate = groupChargesByDate(getChargesBetween(subscriptions, `${month}-01`, until, today));
  const monthDays = [...byDate].filter(([date]) => date.startsWith(month));
  const sumOf = (days: typeof monthDays) =>
    days.reduce((sum, [, charges]) => sum + charges.reduce((s, c) => s + c.subscription.price, 0), 0);
  const monthTotal = sumOf(monthDays);
  const remaining = sumOf(monthDays.filter(([date]) => daysBetween(today, date) >= 0));

  // Default selection: the next charge day this month, else the first one shown.
  const nextChargeDay = monthDays.find(([date]) => daysBetween(today, date) >= 0)?.[0];
  const defaultDay = nextChargeDay ?? monthDays[0]?.[0] ?? null;
  const selectedDate = selected && selected.startsWith(month) ? selected : defaultDay;
  const selectedIsPast = selectedDate !== null && daysBetween(today, selectedDate) < 0;
  const selectedCharges = selectedDate ? (byDate.get(selectedDate) ?? []) : [];

  const goTo = (offset: number) => {
    setMonth(shiftMonth(month, offset));
    setSelected(null);
  };
  const monthOffset = monthsBetween(thisMonth, month);

  return (
    <Card
      title="Renewal calendar"
      icon={<CalendarIcon />}
      className="h-full"
      action={
        <div className="flex items-center gap-1">
          <MonthButton direction={-1} disabled={monthOffset <= 0} onClick={() => goTo(-1)} />
          <MonthButton direction={1} disabled={monthOffset >= MONTHS_AHEAD} onClick={() => goTo(1)} />
        </div>
      }
    >
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="font-display text-2xl font-semibold tracking-tight" aria-live="polite">
          {formatMonthYear(`${month}-01`)}
        </p>
        <p className="text-right text-sm text-muted">
          <span className="font-semibold text-foreground">{formatCurrency(monthTotal)}</span> this month
          {remaining < monthTotal && (
            <span className="block text-xs">{formatCurrency(remaining)} still to come</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted sm:gap-1.5" aria-hidden>
        {WEEKDAY_LABELS.map((day) => (
          <span key={day} className="pb-1">
            <span className="sm:hidden">{day[0]}</span>
            <span className="hidden sm:inline">{day}</span>
          </span>
        ))}
      </div>

      <ol className="grid grid-cols-7 gap-1 sm:gap-1.5" aria-label={`Charges in ${formatMonthYear(`${month}-01`)}`}>
        {grid.map(({ date, inMonth }) => {
          const charges = inMonth ? (byDate.get(date) ?? []) : [];
          const total = charges.reduce((sum, c) => sum + c.subscription.price, 0);
          const isToday = date === today;
          const isPast = daysBetween(today, date) < 0;
          const soon = charges.length > 0 && !isPast && isDueSoon(daysBetween(today, date));
          const dayNumber = parseISODate(date).getUTCDate();
          const cell = `relative flex aspect-square min-h-11 flex-col rounded-lg p-1 text-left sm:aspect-auto sm:h-[76px] sm:p-2 ${
            isToday ? "ring-1 ring-accent" : ""
          }`;

          if (!inMonth) return <li key={date} aria-hidden className={`${cell} opacity-0`} />;

          if (charges.length === 0) {
            return (
              <li key={date} aria-hidden className={`${cell} ${isPast ? "text-muted/40" : "text-muted"}`}>
                <span className="text-xs sm:text-sm">{dayNumber}</span>
              </li>
            );
          }

          const isSelected = date === selectedDate;
          const label = `${formatLongDate(date)}${isPast ? ", charged" : ""}: ${charges
            .map((c) => `${c.subscription.name} ${formatCurrency(c.subscription.price)}`)
            .join(", ")}`;

          return (
            <li key={date}>
              <button
                type="button"
                aria-label={label}
                aria-pressed={isSelected}
                onClick={() => setSelected(date)}
                // Days already charged stay visible but recede behind what's still to come.
                className={`${cell} w-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${
                  isSelected
                    ? "border-accent/60 bg-accent-soft"
                    : isPast
                      ? "border-dashed border-border bg-transparent text-muted hover:border-muted/50"
                      : "border-border bg-surface-2 hover:border-muted/50"
                } ${isPast && !isSelected ? "[&_.avatar]:opacity-50" : ""}`}
              >
                <span className="text-xs font-semibold sm:text-sm">{dayNumber}</span>
                <span className="mt-auto hidden items-center -space-x-1 sm:flex">
                  {charges.slice(0, MAX_AVATARS).map((c) => (
                    <span key={c.subscription.id} className="avatar rounded-md ring-2 ring-surface">
                      <Avatar name={c.subscription.name} size="xs" />
                    </span>
                  ))}
                  {charges.length > MAX_AVATARS && (
                    <span className="pl-2.5 text-[11px] text-muted">+{charges.length - MAX_AVATARS}</span>
                  )}
                </span>
                {/* Phones get a dot (amounts don't fit); the day panel below has the details. */}
                <span aria-hidden className={`mt-auto size-1.5 rounded-full sm:hidden ${soon ? "bg-accent" : isPast ? "bg-muted/50" : "bg-foreground/70"}`} />
                <span
                  className={`mt-1 hidden truncate text-xs font-semibold tabular-nums sm:block ${soon ? "text-accent" : isPast ? "text-muted" : "text-foreground"}`}
                >
                  {formatCurrency(total).replace(/\.00$/, "")}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 border-t border-border pt-4" aria-live="polite">
        {selectedDate ? (
          <>
            <p className="text-sm font-medium">
              {formatLongDate(selectedDate)}
              {selectedIsPast && <span className="ml-2 text-xs font-normal text-muted">Charged</span>}
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {selectedCharges.map(({ subscription: sub }) => (
                <li key={sub.id} className="flex items-center gap-3">
                  <Avatar name={sub.name} size="sm" />
                  <span className="min-w-0 flex-1 truncate">{sub.name}</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(sub.price)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-muted">Nothing renews this month.</p>
        )}
      </div>
    </Card>
  );
}

function MonthButton({ direction, disabled, onClick }: { direction: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 1 ? "Next month" : "Previous month"}
      className="flex size-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-30"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d={direction === 1 ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
      </svg>
    </button>
  );
}
