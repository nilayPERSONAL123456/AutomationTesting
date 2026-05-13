import Link from "next/link";
import type { Run } from "@/lib/types";
import { StatusPill } from "@/components/ui/status-pill";
import { Badge } from "@/components/ui/badge";
import { formatDuration, relativeTime } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function RunRow({ run }: { run: Run }) {
  return (
    <Link
      href={`/runs/${run.id}`}
      className="group grid grid-cols-[16px_1fr_110px_120px_130px_120px_20px] items-center gap-4 border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface-2"
    >
      <StatusPill status={run.status} compact />
      <div className="flex min-w-0 flex-col">
        <div className="truncate text-[13px] font-medium text-fg">
          {run.scenarioTitle}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <Badge tone="accent">{run.module}</Badge>
          <span className="font-mono text-[10.5px] text-fg-subtle">
            {run.id}
          </span>
          <span className="text-[11px] text-fg-subtle">· {run.environmentName}</span>
        </div>
      </div>
      <div className="text-[12px] text-fg-muted">{run.triggeredBy}</div>
      <div className="font-mono text-[11.5px] text-fg-muted">
        {run.durationMs ? formatDuration(run.durationMs) : "—"}
      </div>
      <div className="font-mono text-[11.5px] text-fg-muted">
        {typeof run.confidence === "number"
          ? `${Math.round(run.confidence * 100)}% conf.`
          : "—"}
      </div>
      <div className="text-[11.5px] text-fg-muted">
        {run.startedAt ? relativeTime(run.startedAt) : "—"}
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
    </Link>
  );
}
