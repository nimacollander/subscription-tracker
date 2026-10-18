"use client";

import { Bar, BarChart, Tooltip, XAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChartIcon } from "@/components/ui/icons";
import type { Forecast } from "@/lib/forecast";
import { formatCurrency, formatMonthShort, formatMonthYear } from "@/lib/format";

type Row = { key: string; label: string; total: number } & Record<string, number | string>;

type ForecastChartProps = {
  forecast: Forecast;
  /** Shared with the category donut so each category keeps one colour. */
  colorFor: (category: string) => string;
};

export function ForecastChart({ forecast, colorFor }: ForecastChartProps) {
  const { months, series } = forecast;
  const rows: Row[] = months.map((m) => ({ key: m.key, label: formatMonthShort(m.key), total: m.total, ...m.values }));
  const isEmpty = months.every((m) => m.total === 0);

  return (
    <Card title="Upcoming charges" icon={<ChartIcon />} action={<span className="text-[13px] text-muted">Next 12 months</span>}>
      {isEmpty ? (
        <EmptyState message="No active subscriptions to forecast." />
      ) : (
        <>
          <BarChart
            responsive
            data={rows}
            style={{ width: "100%", height: 240 }}
            margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="22%"
            accessibilityLayer
          >
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              interval={0}
              dy={6}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-2)", radius: 12 }}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as Row | undefined;
                if (!active || !row) return null;
                return (
                  <div className="min-w-44 rounded-2xl border border-border bg-surface-2 px-3.5 py-3 text-[13px] shadow-xl shadow-black/40">
                    <p className="font-medium">{formatMonthYear(`${row.key}-01`)}</p>
                    <dl className="mt-2 space-y-1">
                      <div className="flex justify-between gap-6">
                        <dt className="text-muted">Total</dt>
                        <dd className="font-semibold tabular-nums">{formatCurrency(row.total)}</dd>
                      </div>
                      {series.map((name) =>
                        Number(row[name]) > 0 ? (
                          <div key={name} className="flex justify-between gap-6">
                            <dt className="flex items-center gap-2 text-muted">
                              <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: colorFor(name) }} />
                              {name}
                            </dt>
                            <dd className="tabular-nums">{formatCurrency(Number(row[name]))}</dd>
                          </div>
                        ) : null,
                      )}
                    </dl>
                  </div>
                );
              }}
            />
            {series.map((name) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="forecast"
                fill={colorFor(name)}
                // Rounded segments with a surface-coloured gap between them.
                radius={[8, 8, 8, 8]}
                stroke="var(--surface)"
                strokeWidth={2}
                maxBarSize={36}
                animationDuration={600}
              />
            ))}
          </BarChart>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">Projected from each subscription&apos;s billing dates.</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted" aria-label="Chart legend">
              {series.map((name) => (
                <li key={name} className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 rounded-sm" style={{ background: colorFor(name) }} />
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* The same numbers as a table, so nothing depends on hovering. sr-only sits on a
              wrapper because tables ignore the 1px width and would widen the page. */}
          <div className="sr-only">
            <table>
              <caption>Projected charges per month</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Total</th>
                  {series.map((name) => (
                    <th key={name} scope="col">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.key}>
                    <th scope="row">{formatMonthYear(`${m.key}-01`)}</th>
                    <td>{formatCurrency(m.total)}</td>
                    {series.map((name) => (
                      <td key={name}>{formatCurrency(m.values[name])}</td>
                    ))}
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
