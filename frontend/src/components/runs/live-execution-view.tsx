"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { Badge } from "@/components/ui/badge";
import { statusIcon } from "@/components/graph/process-node";
import { cn, formatDuration } from "@/lib/utils";
import type { Run } from "@/lib/types";
import {
  CircleUser,
  Cpu,
  Image as ImageIcon,
  RefreshCcw,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function LiveExecutionView({ run }: { run: Run }) {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-3">
        <Timeline run={run} />
        <LiveLogStream run={run} />
      </div>
      <div className="flex flex-col gap-3">
        <AIReasoningPanel run={run} />
        <ScreenshotStrip run={run} />
      </div>
    </div>
  );
}

function Timeline({ run }: { run: Run }) {
  const [expanded, setExpanded] = useState<string | null>(
    run.steps.find((s) => s.status === "RUNNING")?.id ?? null
  );
  return (
    <Panel>
      <PanelHeader>
        <div className="flex items-center gap-3">
          <PanelTitle>Execution timeline</PanelTitle>
          <Badge tone="accent">{run.steps.length} steps</Badge>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-fg-muted">
          <Sparkles className="h-3 w-3 text-accent" />
          autonomous
        </div>
      </PanelHeader>
      <div className="relative">
        {run.steps.map((step, i) => {
          const isExpanded = expanded === step.id;
          const ev = run.events.filter((e) => e.stepId === step.id);
          return (
            <div key={step.id} className="relative">
              {/* connector line */}
              {i < run.steps.length - 1 && (
                <div className="absolute left-[31px] top-[38px] h-[calc(100%-20px)] w-px bg-border" />
              )}
              <button
                onClick={() => setExpanded(isExpanded ? null : step.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2",
                  i !== 0 && "border-t border-border"
                )}
              >
                <div className="relative z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                  {statusIcon(step.status)}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-medium text-fg">
                      {step.label}
                    </span>
                    <code className="font-mono text-[10.5px] text-fg-subtle">
                      {step.oracleAction}
                    </code>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={step.status} compact />
                  <span className="w-14 text-right font-mono text-[11px] text-fg-muted">
                    {step.durationMs
                      ? formatDuration(step.durationMs)
                      : step.status === "RUNNING"
                      ? "…"
                      : "—"}
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 text-fg-subtle transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border bg-surface-2 px-4 py-3 pl-[60px]">
                      <div className="label-mono mb-2">Step events</div>
                      {ev.length === 0 && (
                        <div className="text-[11.5px] text-fg-muted">
                          No events recorded for this step yet.
                        </div>
                      )}
                      <ul className="flex flex-col gap-1.5">
                        {ev.map((e) => (
                          <li
                            key={e.id}
                            className="flex items-start gap-2 text-[11.5px] leading-relaxed"
                          >
                            <span className="font-mono text-[10px] text-fg-subtle">
                              {new Date(e.ts).toLocaleTimeString()}
                            </span>
                            <Badge
                              tone={
                                e.level === "WARN"
                                  ? "warning"
                                  : e.level === "ERROR"
                                  ? "danger"
                                  : e.source === "AI"
                                  ? "accent"
                                  : "default"
                              }
                            >
                              {e.source}
                            </Badge>
                            <span className="text-fg-muted">{e.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function LiveLogStream({ run }: { run: Run }) {
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [run.events.length]);

  return (
    <Panel>
      <PanelHeader>
        <div className="flex items-center gap-3">
          <PanelTitle>Live log stream</PanelTitle>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10.5px] font-mono uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            live
          </span>
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">
          {run.events.length} entries
        </span>
      </PanelHeader>
      <div
        ref={logRef}
        className="max-h-[360px] overflow-y-auto bg-[hsl(var(--bg))] font-mono text-[11.5px] leading-[1.7]"
      >
        <div className="px-4 py-3">
          {run.events.map((e) => (
            <div key={e.id} className="flex gap-3">
              <span className="shrink-0 text-fg-subtle">
                {new Date(e.ts).toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span
                className={cn(
                  "w-12 shrink-0 font-mono text-[10px] uppercase tracking-wider",
                  e.source === "AI" && "text-accent",
                  e.source === "EXEC" && "text-info",
                  e.source === "SYSTEM" && "text-fg-subtle",
                  e.source === "VALIDATOR" && "text-success",
                  e.level === "WARN" && "text-warning",
                  e.level === "ERROR" && "text-danger"
                )}
              >
                {e.source.toLowerCase()}
              </span>
              <span className="text-fg-muted">{e.message}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function AIReasoningPanel({ run }: { run: Run }) {
  const aiEvents = run.events.filter((e) => e.source === "AI");
  return (
    <Panel>
      <PanelHeader>
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 text-accent" />
          <PanelTitle>AI reasoning</PanelTitle>
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">
          {aiEvents.length} decisions
        </span>
      </PanelHeader>
      <PanelBody className="flex flex-col gap-3">
        {aiEvents.map((e) => (
          <div
            key={e.id}
            className="rounded-md border border-accent/20 bg-accent/5 p-3"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="label-mono text-accent">ai · thought</span>
              <span className="font-mono text-[10px] text-fg-subtle">
                {new Date(e.ts).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-fg">{e.message}</p>
            {typeof (e.payload as any)?.confidence === "number" && (
              <div className="mt-2 flex items-center gap-2 text-[11px] text-fg-muted">
                <span className="label-mono">confidence</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${(e.payload as any).confidence * 100}%`,
                    }}
                  />
                </div>
                <span className="font-mono">
                  {Math.round((e.payload as any).confidence * 100)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </PanelBody>
    </Panel>
  );
}

function ScreenshotStrip({ run }: { run: Run }) {
  const screens = run.evidence.filter((e) => e.kind === "screenshot");
  return (
    <Panel>
      <PanelHeader>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-3.5 w-3.5 text-fg-muted" />
          <PanelTitle>Captured evidence</PanelTitle>
        </div>
        <Badge tone="default">{screens.length} shots</Badge>
      </PanelHeader>
      <PanelBody className="grid grid-cols-2 gap-2">
        {screens.map((s) => (
          <FakeScreenshot
            key={s.id}
            label={s.label}
            txId={s.oracleTxId}
          />
        ))}
      </PanelBody>
    </Panel>
  );
}

function FakeScreenshot({ label, txId }: { label: string; txId?: string }) {
  return (
    <div className="group relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-surface-3">
      {/* simulated UI */}
      <div className="absolute inset-0">
        <div className="h-3 bg-surface-2" />
        <div className="flex gap-1 p-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-danger/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-warning/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-success/60" />
        </div>
        <div className="p-2">
          <div className="mb-1 h-1.5 w-1/3 rounded bg-border-strong" />
          <div className="mb-0.5 h-1 w-2/3 rounded bg-border" />
          <div className="mb-2 h-1 w-1/2 rounded bg-border" />
          <div className="grid grid-cols-6 gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-1 rounded bg-border/70" />
            ))}
          </div>
          <div className="mt-2 h-4 w-1/3 rounded bg-accent/30" />
        </div>
      </div>
      {/* overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <div className="truncate text-[10.5px] font-medium text-fg">
          {label}
        </div>
        {txId && (
          <div className="truncate font-mono text-[9.5px] text-fg-muted">
            {txId}
          </div>
        )}
      </div>
    </div>
  );
}
