import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { PlayCircle, FileText } from "lucide-react";

export default async function ScenariosPage() {
  const [scenarios, templates] = await Promise.all([
    api.scenarios.list(),
    api.scenarios.templates(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Scenario Library"
        title="Reusable, versioned scenarios"
        description="Curate a library of validated scenarios per Oracle module and re-run them against any environment."
        actions={
          <Button asChild variant="primary">
            <Link href="/scenarios/new">
              <PlayCircle className="h-3.5 w-3.5" />
              New scenario
            </Link>
          </Button>
        }
      />

      <Panel>
        <PanelHeader>
          <PanelTitle>Your scenarios</PanelTitle>
          <span className="label-mono">{scenarios.length} total</span>
        </PanelHeader>
        <div>
          {scenarios.map((s) => (
            <Link
              key={s.id}
              href={`/scenarios/new?clone=${s.id}`}
              className="grid grid-cols-[24px_1fr_100px_140px] items-center gap-4 border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface-2"
            >
              <FileText className="h-4 w-4 text-fg-subtle" />
              <div className="flex min-w-0 flex-col">
                <div className="truncate text-[13px] font-medium text-fg">
                  {s.title}
                </div>
                <div className="truncate text-[11.5px] text-fg-muted">
                  {s.prompt}
                </div>
              </div>
              <Badge tone="accent">{s.module}</Badge>
              <div className="text-[11.5px] text-fg-muted">
                by {s.authorName}
              </div>
            </Link>
          ))}
        </div>
      </Panel>

      <div className="mt-4">
        <Panel>
          <PanelHeader>
            <PanelTitle>Templates</PanelTitle>
            <span className="label-mono">{templates.length} curated</span>
          </PanelHeader>
          <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
            {templates.map((t) => (
              <Link
                key={t.id}
                href={`/scenarios/new?template=${t.id}`}
                className="flex flex-col gap-1.5 rounded-md border border-border bg-surface-2 p-3 hover:border-border-strong"
              >
                <div className="flex items-center gap-2">
                  <Badge tone="accent">{t.module}</Badge>
                  <span className="text-[12.5px] font-medium text-fg">{t.name}</span>
                </div>
                <span className="text-[11.5px] text-fg-muted">{t.description}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
