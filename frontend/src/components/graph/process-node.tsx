"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { StatusPill } from "@/components/ui/status-pill";
import { cn, formatDuration } from "@/lib/utils";
import type { ProcessNode as PNode } from "@/lib/types";
import {
  CheckCircle2,
  CircleDashed,
  Loader2,
  XCircle,
  ShieldCheck,
  UserCheck,
  FlagTriangleRight,
} from "lucide-react";

const KIND_META: Record<
  PNode["kind"],
  { icon: React.ComponentType<any>; label: string }
> = {
  start: { icon: FlagTriangleRight, label: "Start" },
  task: { icon: CircleDashed, label: "Task" },
  approval: { icon: UserCheck, label: "Approval" },
  validation: { icon: ShieldCheck, label: "Validation" },
  end: { icon: FlagTriangleRight, label: "End" },
};

export function ProcessGraphNode({ data }: NodeProps<PNode>) {
  const meta = KIND_META[data.kind];
  const Icon = meta.icon;

  const stripe =
    data.status === "PASSED"
      ? "bg-success"
      : data.status === "FAILED"
      ? "bg-danger"
      : data.status === "RUNNING"
      ? "bg-accent"
      : data.status === "RETRYING"
      ? "bg-warning"
      : "bg-border-strong";

  const activeGlow =
    data.status === "RUNNING"
      ? "shadow-[0_0_0_1px_hsl(var(--accent)/0.4),0_0_24px_-4px_hsl(var(--accent)/0.45)]"
      : "";

  return (
    <div
      className={cn(
        "relative w-[240px] overflow-hidden rounded-lg border border-border bg-surface-2 text-fg transition-shadow",
        activeGlow
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-[3px]", stripe)} />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-border-strong !bg-surface-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border !border-border-strong !bg-surface-3"
      />
      <div className="flex flex-col gap-2 p-3 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider text-fg-subtle">
            <Icon className="h-3 w-3" strokeWidth={1.75} />
            {meta.label}
          </div>
          <StatusPill status={data.status} compact />
        </div>
        <div className="text-[12.5px] font-medium leading-tight text-fg">
          {data.label}
        </div>
        <div className="flex items-center justify-between text-[10.5px]">
          <code className="font-mono text-fg-subtle">{data.oracleAction}</code>
          <span className="font-mono text-fg-muted">
            {data.durationMs
              ? formatDuration(data.durationMs)
              : data.status === "RUNNING"
              ? "…"
              : "—"}
          </span>
        </div>
      </div>
      {data.status === "RUNNING" && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden">
          <div
            className="h-full w-1/2 bg-gradient-to-r from-accent/0 via-accent to-accent/0 animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      )}
    </div>
  );
}

export function statusIcon(status: PNode["status"]) {
  switch (status) {
    case "PASSED":
      return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
    case "FAILED":
      return <XCircle className="h-3.5 w-3.5 text-danger" />;
    case "RUNNING":
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />;
    default:
      return <CircleDashed className="h-3.5 w-3.5 text-fg-subtle" />;
  }
}
