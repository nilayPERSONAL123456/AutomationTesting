import { PageHeader } from "@/components/shell/page-header";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Database, Building2, Factory, Users, Landmark } from "lucide-react";

export default async function EnvironmentsPage() {
  const [envs, bus, ledgers, suppliers, customers] = await Promise.all([
    api.metadata.environments(),
    api.metadata.businessUnits(),
    api.metadata.ledgers(),
    api.metadata.suppliers(),
    api.metadata.customers(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Oracle Environments"
        title="Pods, business units, and master data"
        description="Every scenario is bound to a specific Oracle Fusion pod and its configured BUs, ledgers, legal entities, suppliers and customers."
      />

      <Panel>
        <PanelHeader>
          <PanelTitle>Registered pods</PanelTitle>
          <Badge tone="default">{envs.length} environments</Badge>
        </PanelHeader>
        <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3">
          {envs.map((e) => (
            <div
              key={e.id}
              className="flex flex-col gap-1.5 rounded-md border border-border bg-surface-2 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-fg-muted" />
                  <span className="text-[12.5px] font-medium text-fg">
                    {e.name}
                  </span>
                </div>
                <Badge
                  tone={
                    e.envType === "PROD"
                      ? "danger"
                      : e.envType === "UAT"
                      ? "warning"
                      : "info"
                  }
                >
                  {e.envType}
                </Badge>
              </div>
              <code className="font-mono text-[10.5px] text-fg-subtle">
                {e.podUrl}
              </code>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <MetadataList
          icon={<Building2 className="h-3.5 w-3.5" />}
          title="Business Units"
          items={bus.map((b) => ({
            key: b.id,
            primary: b.name,
            secondary: `${b.code} · ${b.country}`,
          }))}
        />
        <MetadataList
          icon={<Landmark className="h-3.5 w-3.5" />}
          title="Ledgers"
          items={ledgers.map((l) => ({
            key: l.id,
            primary: l.name,
            secondary: l.currency,
          }))}
        />
        <MetadataList
          icon={<Factory className="h-3.5 w-3.5" />}
          title="Suppliers"
          items={suppliers.map((s) => ({
            key: s.id,
            primary: s.name,
            secondary: s.number,
          }))}
        />
        <MetadataList
          icon={<Users className="h-3.5 w-3.5" />}
          title="Customers"
          items={customers.map((c) => ({
            key: c.id,
            primary: c.name,
            secondary: c.number,
          }))}
        />
      </div>
    </>
  );
}

function MetadataList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: { key: string; primary: string; secondary?: string }[];
}) {
  return (
    <Panel>
      <PanelHeader>
        <div className="flex items-center gap-2">
          {icon}
          <PanelTitle>{title}</PanelTitle>
        </div>
        <Badge tone="default">{items.length}</Badge>
      </PanelHeader>
      <div>
        {items.map((i) => (
          <div
            key={i.key}
            className="flex items-center justify-between border-b border-border px-4 py-2.5 last:border-b-0"
          >
            <span className="text-[12.5px] text-fg">{i.primary}</span>
            {i.secondary && (
              <code className="font-mono text-[10.5px] text-fg-subtle">
                {i.secondary}
              </code>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
