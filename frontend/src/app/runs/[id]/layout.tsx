import { api } from "@/lib/api";
import { RunSummaryBar } from "@/components/runs/run-summary-bar";
import { RunTabs } from "@/components/runs/run-tabs";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Download, Pause, Square } from "lucide-react";

export default async function RunLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await api.runs.get(id);

  return (
    <>
      <PageHeader
        eyebrow={`Run · ${run.id}`}
        title="Autonomous execution"
        description="Every step is executed by a Playwright agent orchestrated by the AI planner. All evidence is captured in real time."
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-3.5 w-3.5" /> Download report
            </Button>
            <Button variant="secondary" size="md">
              <Pause className="h-3.5 w-3.5" /> Pause
            </Button>
            <Button variant="danger" size="md">
              <Square className="h-3.5 w-3.5" /> Abort
            </Button>
          </>
        }
      />
      <RunSummaryBar run={run} />
      <div className="mt-4">
        <RunTabs runId={id} />
      </div>
      <div className="mt-4">{children}</div>
    </>
  );
}
