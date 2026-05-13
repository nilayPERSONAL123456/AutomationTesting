"use client";

import { Search, ChevronDown, Play, Bell, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useEnvironment } from "@/lib/store";
import { StatusPill } from "@/components/ui/status-pill";
import Link from "next/link";
import { EnvironmentSwitcher } from "./environment-switcher";

export function TopBar() {
  const env = useEnvironment((s) => s.active);

  return (
    <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-border bg-surface/60 px-5 backdrop-blur">
      {/* Global search */}
      <button
        className="group inline-flex h-8 w-[360px] items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 text-left text-[12.5px] text-fg-subtle transition-colors hover:border-border-strong"
        type="button"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
        <span className="flex-1">Search scenarios, runs, transaction IDs…</span>
        <Kbd>
          <Command className="h-2.5 w-2.5" />K
        </Kbd>
      </button>

      <div className="mx-1 h-6 w-px bg-border" />

      {/* Environment context */}
      <EnvironmentSwitcher />

      {/* Live status */}
      <div className="ml-2 hidden items-center gap-2 md:flex">
        <StatusPill status="RUNNING" />
        <span className="font-mono text-[11px] text-fg-muted">
          3 active · 28 queued
        </span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg">
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warning" />
      </button>

      <Button asChild variant="primary" size="md">
        <Link href="/scenarios/new">
          <Play className="h-3.5 w-3.5" strokeWidth={2} />
          New Scenario
        </Link>
      </Button>
    </header>
  );
}
