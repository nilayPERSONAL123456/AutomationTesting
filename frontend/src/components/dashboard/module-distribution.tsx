"use client";

export function ModuleDistribution({
  data,
}: {
  data: { module: string; runs: number }[];
}) {
  const total = data.reduce((s, d) => s + d.runs, 0) || 1;
  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => {
        const pct = (d.runs / total) * 100;
        return (
          <div key={d.module} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-fg">{d.module}</span>
              <span className="font-mono text-fg-muted">
                {d.runs} <span className="text-fg-subtle">· {pct.toFixed(0)}%</span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent/80 to-accent"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
