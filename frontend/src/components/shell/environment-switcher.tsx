"use client";

import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Database, Check } from "lucide-react";
import { useEnvironment } from "@/lib/store";
import { cn } from "@/lib/utils";

export function EnvironmentSwitcher() {
  const { active, list, setActive } = useEnvironment();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 text-[12.5px] text-fg hover:border-border-strong">
          <Database className="h-3.5 w-3.5 text-fg-muted" strokeWidth={1.75} />
          <span className="font-medium">{active.name}</span>
          <span
            className={cn(
              "rounded-sm border px-1 font-mono text-[9px] uppercase tracking-wider",
              active.envType === "PROD"
                ? "border-danger/40 bg-danger/10 text-danger"
                : active.envType === "UAT"
                ? "border-warning/40 bg-warning/10 text-warning"
                : "border-info/40 bg-info/10 text-info"
            )}
          >
            {active.envType}
          </span>
          <ChevronDown className="h-3 w-3 text-fg-subtle" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[280px] rounded-lg border border-border bg-surface-3 p-1 shadow-panel outline-none animate-fade-in"
        >
          <div className="px-2 pb-1.5 pt-2 label-mono">Oracle Fusion Environments</div>
          <div className="flex flex-col">
            {list.map((env) => {
              const isActive = env.id === active.id;
              return (
                <button
                  key={env.id}
                  onClick={() => setActive(env)}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2 text-left text-[12.5px] text-fg-muted hover:bg-surface-2 hover:text-fg"
                >
                  <Database className="h-3.5 w-3.5 text-fg-subtle" />
                  <div className="flex flex-1 flex-col leading-tight">
                    <div className="text-fg">{env.name}</div>
                    <div className="font-mono text-[10px] text-fg-subtle">
                      {env.podUrl}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-sm border px-1 font-mono text-[9px] uppercase tracking-wider",
                      env.envType === "PROD"
                        ? "border-danger/40 bg-danger/10 text-danger"
                        : env.envType === "UAT"
                        ? "border-warning/40 bg-warning/10 text-warning"
                        : "border-info/40 bg-info/10 text-info"
                    )}
                  >
                    {env.envType}
                  </span>
                  {isActive && <Check className="h-3.5 w-3.5 text-accent" />}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
