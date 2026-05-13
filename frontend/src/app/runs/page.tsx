import { PageHeader } from "@/components/shell/page-header";
import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { RunRow } from "@/components/runs/run-row";
import { api } from "@/lib/api";

export default async function ActiveRunsPage() {
  const runs = await api.runs.list();
  const active = runs.filter((r) => r.status === "RUNNING");
  return (
    <>
      <PageHeader
        eyebrow="Active Runs"
        title="Live autonomous executions"
        description="Monitor every Playwright agent currently driving Oracle Fusion and inspect its execution timeline."
      />
      <Panel>
        <PanelHeader>
          <PanelTitle>Currently running</PanelTitle>
          <Badge tone="accent">{active.length} running</Badge>
        </PanelHeader>
        <div>
          {active.map((r) => (
            <RunRow key={r.id} run={r} />
          ))}
          {active.length === 0 && (
            <div className="px-4 py-8 text-center text-[12.5px] text-fg-muted">
              No active runs at the moment.
            </div>
          )}
        </div>
      </Panel>

      <div className="mt-4">
        <Panel>
          <PanelHeader>
            <PanelTitle>Queued</PanelTitle>
            <Badge tone="default">28 queued</Badge>
          </PanelHeader>
          <div className="px-4 py-8 text-center text-[12.5px] text-fg-muted">
            Queued runs are dispatched as worker capacity frees up.
          </div>
        </Panel>
      </div>
    </>
  );
}
