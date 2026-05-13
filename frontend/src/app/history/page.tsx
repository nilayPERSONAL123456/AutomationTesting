import { PageHeader } from "@/components/shell/page-header";
import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { RunRow } from "@/components/runs/run-row";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";

export default async function HistoryPage() {
  const runs = await api.runs.list();
  const historical = runs.filter((r) => r.status !== "RUNNING");
  const passed = historical.filter((r) => r.status === "PASSED").length;
  const failed = historical.filter((r) => r.status === "FAILED").length;
  return (
    <>
      <PageHeader
        eyebrow="History"
        title="Historical runs, replays, and comparisons"
        description="Audit past autonomous runs, compare failure patterns across modules, and re-run any scenario against any environment."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
            <Button variant="secondary" size="md">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
          </>
        }
      />

      <div className="mb-3 flex items-center gap-2">
        <FilterPill label="All modules" active />
        <FilterPill label="P2P" />
        <FilterPill label="O2C" />
        <FilterPill label="R2R" />
        <FilterPill label="H2R" />
        <div className="mx-1 h-4 w-px bg-border" />
        <FilterPill label="All statuses" active />
        <FilterPill label="Passed" />
        <FilterPill label="Failed" />
        <div className="flex-1" />
        <span className="font-mono text-[11px] text-fg-subtle">
          {historical.length} runs · {passed} passed · {failed} failed
        </span>
      </div>

      <Panel>
        <PanelHeader>
          <PanelTitle>Completed runs</PanelTitle>
          <Badge tone="default">{historical.length} total</Badge>
        </PanelHeader>
        <div>
          {historical.map((r) => (
            <RunRow key={r.id} run={r} />
          ))}
        </div>
      </Panel>
    </>
  );
}

function FilterPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={
        active
          ? "inline-flex h-7 items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 text-[11.5px] text-accent"
          : "inline-flex h-7 items-center rounded-full border border-border bg-surface-2 px-2.5 text-[11.5px] text-fg-muted hover:border-border-strong hover:text-fg"
      }
    >
      {label}
    </button>
  );
}
