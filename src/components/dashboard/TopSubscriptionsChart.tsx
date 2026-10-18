"use client";

import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChartIcon } from "@/components/ui/icons";
import type { SubscriptionCost } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";

const BAR_SIZE = 20;
const ROW_HEIGHT = 40;
const MAX_NAME_LENGTH = 18;

function truncate(name: string) {
  return name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH - 1)}…` : name;
}

type TickProps = { x?: number | string; y?: number | string; payload?: { value: string } };

// Recharts' default tick wraps long names onto two lines; keep one line and truncate.
function NameTick({ x, y, payload }: TickProps) {
  if (!payload) return null;
  return (
    <text x={Number(x) - 8} y={y} dy={4} textAnchor="end" fill="var(--foreground)" fontSize={13}>
      <title>{payload.value}</title>
      {truncate(payload.value)}
    </text>
  );
}

export function TopSubscriptionsChart({ data }: { data: SubscriptionCost[] }) {
  return (
    <Card title="Most expensive" icon={<ChartIcon />} action={<span className="text-[13px] text-muted">Per month</span>}>
      {data.length === 0 ? (
        <EmptyState message="No active subscriptions to chart." />
      ) : (
        <BarChart
          responsive
          layout="vertical"
          data={data}
          style={{ width: "100%", height: data.length * ROW_HEIGHT }}
          // Right margin leaves room for the value label at each bar's tip.
          margin={{ top: 0, right: 72, bottom: 0, left: 0 }}
          accessibilityLayer
        >
          <XAxis type="number" hide domain={[0, "dataMax"]} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tickLine={false}
            axisLine={false}
            tick={NameTick}
          />
          <Tooltip
            cursor={{ fill: "var(--border)", opacity: 0.4 }}
            content={(props) => <ChartTooltip {...props} formatValue={(v) => `${formatCurrency(v)}/mo`} />}
          />
          <Bar
            dataKey="monthly"
            name="Monthly cost"
            fill="var(--accent)"
            barSize={BAR_SIZE}
            // Rounded at the data end, square at the baseline.
            radius={[0, 4, 4, 0]}
            animationDuration={600}
          >
            <LabelList
              dataKey="monthly"
              position="right"
              offset={8}
              formatter={(value) => formatCurrency(Number(value))}
              style={{ fill: "var(--muted)", fontSize: 13, fontVariantNumeric: "tabular-nums" }}
            />
          </Bar>
        </BarChart>
      )}
    </Card>
  );
}
