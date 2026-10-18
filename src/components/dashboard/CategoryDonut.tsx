"use client";

import { Pie, PieChart, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { OTHER_CATEGORY, type CategorySpend } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";

// Slices are coloured by position (largest first); "Other" is always neutral gray.
const SLOT_COLORS = [1, 2, 3, 4, 5, 6].map((n) => `var(--chart-${n})`);

function formatPercent(share: number) {
  return `${Math.round(share * 100)}%`;
}

export function CategoryDonut({ data }: { data: CategorySpend[] }) {
  const total = data.reduce((sum, d) => sum + d.monthly, 0);
  const slices = data.map((d, i) => ({
    ...d,
    fill: d.category === OTHER_CATEGORY ? "var(--chart-other)" : SLOT_COLORS[i % SLOT_COLORS.length],
  }));

  return (
    <Card title="Monthly spend by category">
      {slices.length === 0 ? (
        <EmptyState message="No active subscriptions to chart." />
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-[200px] shrink-0">
            <PieChart responsive style={{ width: "100%", aspectRatio: 1 }} accessibilityLayer>
              <Pie
                data={slices}
                dataKey="monthly"
                nameKey="category"
                innerRadius="64%"
                outerRadius="100%"
                // A surface-coloured stroke is the 2px gap between slices.
                stroke="var(--surface)"
                strokeWidth={2}
                startAngle={90}
                endAngle={-270}
                animationDuration={600}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    {...props}
                    formatValue={(v) => `${formatCurrency(v)}/mo`}
                    formatDetail={(_, d) => formatPercent(d.share as number)}
                  />
                )}
              />
            </PieChart>
            {/* Centre label; pointer-events off so it never blocks slice hover. */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-lg font-bold">{formatCurrency(total)}</span>
              <span className="text-xs text-muted">per month</span>
            </div>
          </div>

          {/* The legend doubles as the table view: every value is readable without hovering. */}
          <ul className="flex w-full min-w-0 flex-col gap-2 text-sm" aria-label="Spend by category">
            {slices.map((slice) => (
              <li key={slice.category} className="flex items-center gap-2.5">
                <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ background: slice.fill }} />
                <span className="min-w-0 flex-1 truncate">{slice.category}</span>
                <span className="font-medium tabular-nums">{formatCurrency(slice.monthly)}</span>
                <span className="w-9 text-right text-muted tabular-nums">{formatPercent(slice.share)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
