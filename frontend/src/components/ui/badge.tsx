import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent" | "success" | "warning" | "danger" | "info";
}) {
  const tones: Record<string, string> = {
    default: "bg-surface-2 text-fg-muted border-border",
    accent: "bg-accent/10 text-accent border-accent/30",
    success: "bg-success/10 text-success border-success/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    danger: "bg-danger/10 text-danger border-danger/30",
    info: "bg-info/10 text-info border-info/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10.5px] font-mono uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
