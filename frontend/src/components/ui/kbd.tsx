import { cn } from "@/lib/utils";

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border bg-surface-2 px-1 font-mono text-[10px] text-fg-muted",
        className
      )}
    >
      {children}
    </kbd>
  );
}
