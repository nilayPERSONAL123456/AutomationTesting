import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export function Metric({
  label,
  value,
  sub,
  delta,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  delta?: number;
  accent?: "success" | "danger" | "warning" | "info" | "accent";
  className?: string;
}) {
  const accentCls =
    accent === "success"
      ? "text-success"
      : accent === "danger"
      ? "text-danger"
      : accent === "warning"
      ? "text-warning"
      : accent === "info"
      ? "text-info"
      : accent === "accent"
      ? "text-accent"
      : "text-fg";

  return (
    <div className={cn("panel p-4 flex flex-col gap-2", className)}>
      <div className="label-mono">{label}</div>
      <div className="flex items-baseline gap-3">
        <div className={cn("text-[28px] font-semibold tracking-tight leading-none", accentCls)}>
          {value}
        </div>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-medium",
              delta >= 0 ? "text-success" : "text-danger"
            )}
          >
            {delta >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {sub && <div className="text-[12px] text-fg-muted">{sub}</div>}
    </div>
  );
}
