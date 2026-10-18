"use client";

import { Bar, BarChart, LabelList, Rectangle, Tooltip, XAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChartIcon } from "@/components/ui/icons";
import type { Forecast } from "@/lib/forecast";
import { formatCurrency, formatMonthShort, formatMonthYear } from "@/lib/format";

// Emphasis, not categories: this month in coral, the rest in a quiet neutral.
const CURRENT = "var(--accent)";
const OTHERS = "#6e675e";

type Row = { key: string; label: string; total: number; fill: string; showLabel: boolean };

export function MonthlyTotalsChart({ forecast }: { forecast: Forecast }) {
  const { months } = forecast;
  const peak = Math.max(...months.map((m) => m.total));
  // Label only this month and the most expensive one; the tooltip and table carry the rest.
  const rows: Row[] = months.map((m, i) => ({
    key: m.key,
    label: formatMonthShort(m.key),
    total: m.total,
    fill: i === 0 ? CURRENT : OTHERS,
    showLabel: i === 0 || (m.total === peak && peak > 0),
  }));
  const isEmpty = peak === 0;

  return (
    <Card
      title="Month by month"
      icon={<ChartIcon />}
      className="h-full"
      action={<span className="text-[13px] text-muted">Next 12 months</span>}
    >
      {isEmpty ? (
        <EmptyState message="No active subscriptions to project." />
      ) : (
        <>
          <BarChart
            responsive
            data={rows}
            style={{ width: "100%", height: 300 }}
            margin={{ top: 22, right: 0, bottom: 0, left: 0 }}
            accessibilityLayer
          >
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} interval={0} dy={6} />
            <Tooltip
              cursor={{ fill: "var(--surface-2)", radius: 6 }}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as Row | undefined;
                if (!active || !row) return null;
                const month = months.find((m) => m.key === row.key)!;
                return (
                  <div className="min-w-40 rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-[13px] shadow-xl shadow-black/40">
                    <p className="font-semibold">{formatCurrency(row.total)}</p>
                    <p className="text-muted">{formatMonthYear(`${row.key}-01`)}</p>
                    <dl className="mt-2 space-y-0.5 border-t border-border pt-2">
                      {Object.entries(month.values)
                        .filter(([, value]) => value > 0)
                        .map(([name, value]) => (
                          <div key={name} className="flex justify-between gap-5">
                            <dt className="text-muted">{name}</dt>
                            <dd className="tabular-nums">{formatCurrency(value)}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="total"
              radius={[6, 6, 2, 2]}
              maxBarSize={22}
              animationDuration={600}
              // Each bar takes its row's colour (this month vs the rest).
              shape={(props) => <Rectangle {...props} fill={(props.payload as Row).fill} />}
            >
              <LabelList
                dataKey="total"
                position="top"
                offset={8}
                content={({ x, y, width, value, index }) =>
                  index !== undefined && rows[index]?.showLabel ? (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(y) - 8}
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize={12}
                      fontWeight={600}
                    >
                      {formatCurrency(Number(value)).replace(/\.\d\d$/, "")}
                    </text>
                  ) : null
                }
              />
            </Bar>
          </BarChart>
          <p className="mt-3 text-xs text-muted">
            <span className="mr-1.5 inline-block size-2 rounded-sm bg-accent align-middle" aria-hidden />
            This month, from today · projected from billing dates
          </p>

          {/* The same numbers as a table, so nothing depends on hovering. sr-only sits on a
              wrapper because tables ignore the 1px width and would widen the page. */}
          <div className="sr-only">
            <table>
              <caption>Projected charges per month</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.key}>
                    <th scope="row">{formatMonthYear(`${m.key}-01`)}</th>
                    <td>{formatCurrency(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
