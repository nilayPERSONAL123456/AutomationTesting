import { cn } from "@/lib/utils";
import type { RunStatus, StepStatus } from "@/lib/types";

type Status = RunStatus | StepStatus | "INFO";

const map: Record<
  Status,
  { label: string; dot: string; text: string; bg: string; border: string; pulse?: boolean }
> = {
  DRAFT: {
    label: "Draft",
    dot: "bg-fg-subtle",
    text: "text-fg-muted",
    bg: "bg-surface-2",
    border: "border-border",
  },
  PLANNED: {
    label: "Planned",
    dot: "bg-info",
    text: "text-info",
    bg: "bg-info/10",
    border: "border-info/30",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-fg-subtle",
    text: "text-fg-muted",
    bg: "bg-surface-2",
    border: "border-border",
  },
  RUNNING: {
    label: "Running",
    dot: "bg-accent",
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/40",
    pulse: true,
  },
  RETRYING: {
    label: "Retrying",
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    pulse: true,
  },
  PASSED: {
    label: "Passed",
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
  },
  FAILED: {
    label: "Failed",
    dot: "bg-danger",
    text: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
  },
  ABORTED: {
    label: "Aborted",
    dot: "bg-fg-subtle",
    text: "text-fg-muted",
    bg: "bg-surface-2",
    border: "border-border",
  },
  SKIPPED: {
    label: "Skipped",
    dot: "bg-fg-subtle",
    text: "text-fg-muted",
    bg: "bg-surface-2",
    border: "border-border",
  },
  INFO: {
    label: "Info",
    dot: "bg-info",
    text: "text-info",
    bg: "bg-info/10",
    border: "border-info/30",
  },
};

export function StatusPill({
  status,
  className,
  compact,
}: {
  status: Status;
  className?: string;
  compact?: boolean;
}) {
  const s = map[status] ?? map.INFO;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        s.bg,
        s.text,
        s.border,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          s.dot,
          s.pulse && "animate-pulse-dot"
        )}
      />
      {!compact && s.label}
    </span>
  );
}
