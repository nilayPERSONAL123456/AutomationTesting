import { PageHeader } from "@/components/shell/page-header";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Platform configuration"
        description="Configure AI providers, evidence retention, and tenant-wide defaults."
      />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <Panel>
          <PanelHeader>
            <PanelTitle>AI provider</PanelTitle>
            <Badge tone="accent">openai</Badge>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3 text-[12.5px]">
            <Row label="Default planner model" value="gpt-4.1" />
            <Row label="Default validator model" value="gpt-4.1-mini" />
            <Row label="Recovery strategy" value="LLM-assisted, 3 retries" />
            <Row label="Confidence threshold" value="0.70" />
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <PanelTitle>Execution</PanelTitle>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3 text-[12.5px]">
            <Row label="Browser" value="Playwright Chromium" />
            <Row label="Parallelism" value="4 workers" />
            <Row label="Evidence store" value="MinIO · catalystright-evidence" />
            <Row label="Evidence retention" value="90 days" />
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <PanelTitle>Secrets & identity</PanelTitle>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3 text-[12.5px]">
            <Row label="Credential vault" value="HashiCorp Vault · kv/oracle" />
            <Row label="SSO" value="Okta · SAML" />
            <Button variant="secondary" size="sm" className="self-start">
              Rotate service principal
            </Button>
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <PanelTitle>Tenant</PanelTitle>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3 text-[12.5px]">
            <Row label="Name" value="Vision" />
            <Row label="Plan" value="Enterprise" />
            <Row label="Seats" value="42 of 50" />
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className="font-mono text-fg">{value}</span>
    </div>
  );
}
