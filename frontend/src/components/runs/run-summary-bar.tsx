import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import type { Run } from "@/lib/types";
import { formatDuration, relativeTime } from "@/lib/utils";
import { Clock, Cpu, GitBranch, User, Database } from "lucide-react";

export function RunSummaryBar({ run }: { run: Run }) {
  const passed = run.steps.filter((s) => s.status === "PASSED").length;
  const total = run.steps.length;
  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill status={run.status} />
        <h2 className="text-[15px] font-semibold tracking-tight text-fg">
          {run.scenarioTitle}
        </h2>
        <Badge tone="accent">{run.module}</Badge>
        <code className="font-mono text-[11px] text-fg-subtle">{run.id}</code>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-fg-muted">
        <Meta icon={<Database className="h-3 w-3" />} label="Environment" value={run.environmentName} />
        <Meta icon={<User className="h-3 w-3" />} label="Triggered by" value={run.triggeredBy} />
        <Meta
          icon={<Clock className="h-3 w-3" />}
          label="Started"
          value={run.startedAt ? relativeTime(run.startedAt) : "—"}
        />
        <Meta
          icon={<GitBranch className="h-3 w-3" />}
          label="Progress"
          value={`${passed} / ${total} steps`}
        />
        <Meta
          icon={<Cpu className="h-3 w-3" />}
          label="AI confidence"
          value={
            typeof run.confidence === "number"
              ? `${Math.round(run.confidence * 100)}%`
              : "—"
          }
        />
        {run.durationMs && (
          <Meta
            icon={<Clock className="h-3 w-3" />}
            label="Duration"
            value={formatDuration(run.durationMs)}
          />
        )}
      </div>
      {run.summary && (
        <p className="text-[12.5px] leading-relaxed text-fg-muted">
          <span className="label-mono mr-2">AI Summary</span>
          {run.summary}
        </p>
      )}
    </div>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-fg-subtle">{icon}</span>
      <span className="label-mono">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  );
}
