import { PageHeader } from "@/components/shell/page-header";
import { Metric } from "@/components/ui/metric";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { ModuleDistribution } from "@/components/dashboard/module-distribution";
import { RunRow } from "@/components/runs/run-row";
import { api } from "@/lib/api";
import { formatDuration } from "@/lib/utils";
import { ArrowUpRight, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [runs, kpis, trend, modules] = await Promise.all([
    api.runs.list(),
    api.dashboard.kpis(),
    api.dashboard.trend(),
    api.dashboard.modules(),
  ]);

  const active = runs.filter((r) => r.status === "RUNNING");
  const recent = runs.slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Command Center"
        title="Oracle Fusion test operations, in one control plane"
        description="Monitor autonomous runs across your Vision pods, review AI execution confidence, and act on validation failures before they reach UAT sign-off."
        actions={
          <>
            <Button variant="secondary" size="md">
              Export dashboard
            </Button>
            <Button asChild variant="primary" size="md">
              <Link href="/scenarios/new">
                <PlayCircle className="h-3.5 w-3.5" />
                Start new run
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Runs · last 7 days"
          value={kpis.totalRuns7d}
          sub="across P2P, O2C, R2R, H2R"
        />
        <Metric
          label="Success rate"
          value={`${(kpis.successRate7d * 100).toFixed(1)}%`}
          delta={kpis.successDelta}
          sub="vs prior 7 days"
          accent="success"
        />
        <Metric
          label="Failure rate"
          value={`${(kpis.failureRate7d * 100).toFixed(1)}%`}
          delta={kpis.failureDelta}
          sub="3-way match & approval routing"
          accent="danger"
        />
        <Metric
          label="Avg. run duration"
          value={formatDuration(kpis.avgDurationMs)}
          sub="P50 across all modules"
        />
        <Metric
          label="AI tokens · 24h"
          value={`${(kpis.aiTokensUsed24h / 1_000_000).toFixed(2)}M`}
          sub="intent · plan · validate · recover"
          accent="accent"
        />
      </div>

      {/* Trend + distribution */}
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_360px]">
        <Panel>
          <PanelHeader>
            <div className="flex items-center gap-3">
              <PanelTitle>Run outcomes · last 7 days</PanelTitle>
              <Badge tone="success">+2.1% pass rate</Badge>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-fg-muted">
              <LegendDot color="hsl(var(--success))" /> Passed
              <LegendDot color="hsl(var(--danger))" /> Failed
            </div>
          </PanelHeader>
          <PanelBody>
            <TrendChart data={trend} />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Runs by module</PanelTitle>
            <span className="label-mono">30d</span>
          </PanelHeader>
          <PanelBody>
            <ModuleDistribution data={modules} />
          </PanelBody>
        </Panel>
      </div>

      {/* Active runs + AI insights */}
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_360px]">
        <Panel>
          <PanelHeader>
            <div className="flex items-center gap-3">
              <PanelTitle>Active & recent runs</PanelTitle>
              <Badge tone="accent">{active.length} running</Badge>
            </div>
            <Link
              href="/history"
              className="inline-flex items-center gap-1 text-[11.5px] text-fg-muted hover:text-fg"
            >
              View history <ArrowUpRight className="h-3 w-3" />
            </Link>
          </PanelHeader>
          <div>
            {recent.map((r) => (
              <RunRow key={r.id} run={r} />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>AI platform insights</PanelTitle>
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </PanelHeader>
          <PanelBody>
            <ul className="flex flex-col gap-3">
              <Insight
                tone="warning"
                title="Recurring P2P friction"
                body="Supplier ACK timeouts observed in 3 of last 12 runs. Consider adding a 2s wait-for-ack or enabling the AI recovery policy."
              />
              <Insight
                tone="info"
                title="Coverage gap detected"
                body="No automated scenarios exist for Vision Singapore BU tax calculation path. Planner suggests generating a template."
              />
              <Insight
                tone="success"
                title="Closed regression"
                body="H2R first-paycheck variance last week was caused by element-entry mismatch; now passing 4 runs in a row."
              />
            </ul>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ background: color }}
    />
  );
}

function Insight({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "info" | "warning" | "success" | "danger";
}) {
  const map = {
    info: "border-info/30 bg-info/5",
    warning: "border-warning/30 bg-warning/5",
    success: "border-success/30 bg-success/5",
    danger: "border-danger/30 bg-danger/5",
  } as const;
  return (
    <li className={`rounded-md border p-3 ${map[tone]}`}>
      <div className="mb-1 text-[12.5px] font-medium text-fg">{title}</div>
      <p className="text-[12px] leading-relaxed text-fg-muted">{body}</p>
    </li>
  );
}
