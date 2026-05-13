"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  Workflow,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function RunTabs({ runId }: { runId: string }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/runs/${runId}`, label: "Live execution", icon: Activity },
    { href: `/runs/${runId}/graph`, label: "Process graph", icon: Workflow },
    { href: `/runs/${runId}/console`, label: "AI console", icon: Sparkles },
    { href: `/runs/${runId}/evidence`, label: "Evidence", icon: ShieldCheck },
  ];
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-3 py-2.5 text-[12.5px]",
              active ? "text-fg" : "text-fg-muted hover:text-fg"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.label}
            {active && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-accent" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
