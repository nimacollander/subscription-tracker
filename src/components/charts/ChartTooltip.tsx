// Only the fields this tooltip reads from Recharts' tooltip props.
type TooltipEntry = { value?: unknown; name?: unknown; color?: string; payload?: unknown };

type ChartTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  formatValue: (value: number) => string;
  /** Optional second line under the value, e.g. a percentage. */
  formatDetail?: (value: number, payload: Record<string, unknown>) => string;
};

/** Value first and strong, label second; a short colour key marks the series. */
export function ChartTooltip({ active, payload, formatValue, formatDetail }: ChartTooltipProps) {
  const item = payload?.[0];
  if (!active || !item || typeof item.value !== "number") return null;

  const data = item.payload as Record<string, unknown>;
  const color = (data.fill as string | undefined) ?? item.color;

  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold tabular-nums">{formatValue(item.value)}</p>
      <p className="flex items-center gap-2 text-muted">
        <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: color }} />
        {String(item.name)}
        {formatDetail && <span>· {formatDetail(item.value, data)}</span>}
      </p>
    </div>
  );
}
