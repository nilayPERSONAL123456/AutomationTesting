import { api } from "@/lib/api";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDuration } from "@/lib/utils";
import { Cpu, FileJson, Activity } from "lucide-react";

export default async function ConsolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await api.runs.get(id);

  const totalTokens = run.aiCalls.reduce(
    (s, c) => s + c.promptTokens + c.completionTokens,
    0
  );

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-3">
        <Panel>
          <PanelHeader>
            <div className="flex items-center gap-2">
              <FileJson className="h-3.5 w-3.5 text-accent" />
              <PanelTitle>Structured execution plan</PanelTitle>
            </div>
            <Badge tone="accent">planner · v2</Badge>
          </PanelHeader>
          <PanelBody className="p-0">
            <pre className="max-h-[420px] overflow-auto bg-[hsl(var(--bg))] p-4 font-mono text-[11.5px] leading-[1.65] text-fg">
{JSON.stringify(
  {
    runId: run.id,
    scenario: run.scenarioTitle,
    module: run.module,
    environment: run.environmentName,
    graph: {
      nodes: run.graph.nodes.map((n) => ({
        id: n.id,
        label: n.label,
        action: n.oracleAction,
        kind: n.kind,
        dependsOn: n.dependsOn,
      })),
      edges: run.graph.edges,
    },
    checkpoints: run.validations.map((v) => v.checkName),
  },
  null,
  2
)}
            </pre>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <PanelTitle>Action queue</PanelTitle>
            </div>
            <span className="font-mono text-[11px] text-fg-subtle">
              {run.steps.length} actions
            </span>
          </PanelHeader>
          <div>
            {run.steps.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[22px_1fr_120px_80px] items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0"
              >
                <div className="font-mono text-[10.5px] text-fg-subtle">
                  {s.id}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[12.5px] font-medium text-fg">
                    {s.label}
                  </span>
                  <code className="font-mono text-[10.5px] text-fg-subtle">
                    {s.oracleAction}
                  </code>
                </div>
                <StatusPill status={s.status} />
                <span className="text-right font-mono text-[11px] text-fg-muted">
                  {s.durationMs ? formatDuration(s.durationMs) : "—"}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex flex-col gap-3">
        <Panel>
          <PanelHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-accent" />
              <PanelTitle>AI telemetry</PanelTitle>
            </div>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3">
            <TelRow label="Tokens used" value={totalTokens.toLocaleString()} />
            <TelRow
              label="Avg. confidence"
              value={`${Math.round(
                (run.aiCalls.reduce((s, c) => s + (c.confidence ?? 0), 0) /
                  (run.aiCalls.length || 1)) *
                  100
              )}%`}
            />
            <TelRow
              label="LLM calls"
              value={`${run.aiCalls.length} · ${run.aiCalls
                .map((c) => c.phase)
                .join(", ")}`}
            />
            <TelRow
              label="Providers"
              value={Array.from(new Set(run.aiCalls.map((c) => c.provider))).join(
                ", "
              )}
            />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>LLM call log</PanelTitle>
          </PanelHeader>
          <div>
            {run.aiCalls.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-1.5 border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <Badge tone="accent">{c.phase}</Badge>
                  <span className="font-mono text-[10.5px] text-fg-subtle">
                    {new Date(c.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-fg">
                  <span className="font-medium">{c.model}</span>
                  <span className="text-fg-subtle">· {c.provider}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[10.5px] text-fg-muted">
                  <span>in {c.promptTokens.toLocaleString()}</span>
                  <span>out {c.completionTokens.toLocaleString()}</span>
                  <span>{c.latencyMs}ms</span>
                  {typeof c.confidence === "number" && (
                    <span className="text-accent">
                      {Math.round(c.confidence * 100)}% conf
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TelRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-fg-muted">{label}</span>
      <span className="font-mono text-fg">{value}</span>
    </div>
  );
}
