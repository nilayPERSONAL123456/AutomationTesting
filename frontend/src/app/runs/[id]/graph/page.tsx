import { api } from "@/lib/api";
import { ProcessGraphCanvas } from "@/components/graph/process-graph";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";

export default async function ProcessGraphPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await api.runs.get(id);
  const legend = [
    { label: "Data dependency", color: "hsl(var(--border-strong))", style: "solid" },
    { label: "Approval", color: "hsl(var(--warning))", style: "solid" },
    { label: "Validation", color: "hsl(var(--info))", style: "dashed" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_320px]">
      <Panel className="overflow-hidden">
        <PanelHeader>
          <PanelTitle>Process execution graph</PanelTitle>
          <Badge tone="accent">{run.graph.nodes.length} nodes</Badge>
        </PanelHeader>
        <div className="h-[640px] w-full">
          <ProcessGraphCanvas graph={run.graph} />
        </div>
      </Panel>
      <div className="flex flex-col gap-3">
        <Panel>
          <PanelHeader>
            <PanelTitle>Legend</PanelTitle>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-2">
            {legend.map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-[12px]">
                <svg width="22" height="8">
                  <line
                    x1="0"
                    y1="4"
                    x2="22"
                    y2="4"
                    stroke={l.color}
                    strokeWidth="2"
                    strokeDasharray={l.style === "dashed" ? "3 3" : undefined}
                  />
                </svg>
                <span className="text-fg-muted">{l.label}</span>
              </div>
            ))}
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <PanelTitle>Checkpoints</PanelTitle>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-2">
            {run.validations.map((v) => (
              <div key={v.id} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 text-[12px]">
                  <span
                    className={
                      v.passed
                        ? "h-1.5 w-1.5 rounded-full bg-success"
                        : "h-1.5 w-1.5 rounded-full bg-danger"
                    }
                  />
                  <span className="text-fg">{v.checkName}</span>
                </div>
                {v.expected && (
                  <div className="pl-3.5 font-mono text-[10.5px] text-fg-subtle">
                    expected: {v.expected}
                  </div>
                )}
              </div>
            ))}
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}
