import { api } from "@/lib/api";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, XCircle, CheckCircle2 } from "lucide-react";

export default async function EvidencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await api.runs.get(id);
  const screenshots = run.evidence.filter((e) => e.kind === "screenshot");
  const txIds = run.evidence.filter((e) => e.kind === "transaction_id");

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-3">
        <Panel>
          <PanelHeader>
            <PanelTitle>Screenshots</PanelTitle>
            <div className="flex items-center gap-2">
              <Badge tone="default">{screenshots.length} captured</Badge>
              <Button size="sm" variant="secondary">
                <Download className="h-3 w-3" /> Export bundle
              </Button>
            </div>
          </PanelHeader>
          <PanelBody className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {screenshots.map((s) => (
              <div
                key={s.id}
                className="group overflow-hidden rounded-md border border-border bg-surface-2"
              >
                <MockScreenshot />
                <div className="flex flex-col gap-1 p-3">
                  <div className="text-[12.5px] font-medium text-fg">
                    {s.label}
                  </div>
                  <div className="flex items-center justify-between text-[10.5px]">
                    <code className="font-mono text-fg-subtle">
                      {s.oracleTxId ?? "—"}
                    </code>
                    <span className="text-fg-subtle">
                      {new Date(s.capturedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </PanelBody>
        </Panel>
      </div>

      <div className="flex flex-col gap-3">
        <Panel>
          <PanelHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <PanelTitle>Validation checkpoints</PanelTitle>
            </div>
            <Badge
              tone={
                run.validations.every((v) => v.passed) ? "success" : "warning"
              }
            >
              {run.validations.filter((v) => v.passed).length}/
              {run.validations.length} passed
            </Badge>
          </PanelHeader>
          <div>
            {run.validations.map((v) => (
              <div
                key={v.id}
                className="flex flex-col gap-1 border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {v.passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-danger" />
                  )}
                  <span className="text-[12.5px] font-medium text-fg">
                    {v.checkName}
                  </span>
                </div>
                {(v.expected || v.actual) && (
                  <div className="pl-5 font-mono text-[10.5px] text-fg-subtle">
                    expected: {v.expected} · actual: {v.actual}
                  </div>
                )}
                {v.reasoning && (
                  <div className="pl-5 text-[11.5px] text-fg-muted">
                    {v.reasoning}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Oracle transaction IDs</PanelTitle>
          </PanelHeader>
          <div>
            {txIds.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border-b border-border px-4 py-2.5 last:border-b-0"
              >
                <span className="text-[12px] text-fg-muted">{t.label}</span>
                <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-fg">
                  {t.oracleTxId}
                </code>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Audit trail</PanelTitle>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-2 text-[12px] text-fg-muted">
            <div>
              <span className="label-mono mr-2">run.id</span>
              <code className="font-mono text-fg">{run.id}</code>
            </div>
            <div>
              <span className="label-mono mr-2">scenario</span>
              <code className="font-mono text-fg">{run.scenarioId}</code>
            </div>
            <div>
              <span className="label-mono mr-2">triggered_by</span>
              <span className="text-fg">{run.triggeredBy}</span>
            </div>
            <div>
              <span className="label-mono mr-2">environment</span>
              <span className="text-fg">{run.environmentName}</span>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}

function MockScreenshot() {
  return (
    <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-[#0a1220] via-[#0b1426] to-[#08111f]">
      <div className="absolute inset-0 p-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="mt-1.5 flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-danger/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-warning/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-success/60" />
        </div>
        <div className="mt-3 h-2 w-1/2 rounded bg-white/10" />
        <div className="mt-1.5 h-1.5 w-2/3 rounded bg-white/5" />
        <div className="mt-3 grid grid-cols-8 gap-0.5">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-1 rounded bg-white/5" />
          ))}
        </div>
        <div className="mt-3 h-5 w-1/3 rounded bg-accent/40" />
      </div>
    </div>
  );
}
