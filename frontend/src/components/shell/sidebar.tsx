"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Workflow,
  Activity,
  ShieldCheck,
  History,
  Layers,
  Database,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const primary = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/scenarios", label: "Scenarios", icon: FileText },
  { href: "/runs", label: "Active Runs", icon: Activity },
  { href: "/history", label: "History", icon: History },
];

const operate = [
  { href: "/graph", label: "Process Graph", icon: Workflow },
  { href: "/evidence", label: "Evidence Vault", icon: ShieldCheck },
  { href: "/ai-console", label: "AI Console", icon: Zap },
];

const configure = [
  { href: "/environments", label: "Oracle Environments", icon: Database },
  { href: "/library", label: "Action Library", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Section({
  title,
  items,
  pathname,
}: {
  title: string;
  items: { href: string; label: string; icon: any }[];
  pathname: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="px-3 pb-1 pt-4 label-mono">{title}</div>
      {items.map((i) => {
        const active = pathname === i.href || (i.href !== "/" && pathname.startsWith(i.href));
        const Icon = i.icon;
        return (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "group flex h-8 items-center gap-2.5 rounded-md px-3 text-[13px] transition-colors",
              active
                ? "bg-surface-2 text-fg"
                : "text-fg-muted hover:bg-surface-2 hover:text-fg"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                active ? "text-accent" : "text-fg-subtle group-hover:text-fg-muted"
              )}
              strokeWidth={1.75}
            />
            <span className="truncate">{i.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-border bg-surface">
      {/* Brand */}
      <div className="flex h-[52px] items-center gap-2.5 border-b border-border px-4">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <span className="font-mono text-[13px] font-bold text-white">C</span>
        </div>
        <div className="flex flex-col leading-tight">
          <div className="text-[13px] font-semibold tracking-tight">CatalystRight</div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-fg-subtle">
            AI Testing · v0.1
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        <Section title="Operate" items={primary} pathname={pathname} />
        <Section title="Workspace" items={operate} pathname={pathname} />
        <Section title="Configure" items={configure} pathname={pathname} />
      </div>

      {/* Tenant / user footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-md border border-border bg-surface-2 p-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-2/70 to-accent/70 text-[11px] font-semibold text-white">
            NK
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <div className="truncate text-[12px] font-medium text-fg">Nilay Kale</div>
            <div className="truncate text-[10.5px] text-fg-subtle">Vision Tenant · Author</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
