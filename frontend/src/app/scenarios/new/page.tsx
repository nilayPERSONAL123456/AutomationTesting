import { PageHeader } from "@/components/shell/page-header";
import { api } from "@/lib/api";
import { ScenarioBuilder } from "@/components/scenarios/scenario-builder";

export default async function NewScenarioPage() {
  const [templates, bus, suppliers, ledgers, customers] = await Promise.all([
    api.scenarios.templates(),
    api.metadata.businessUnits(),
    api.metadata.suppliers(),
    api.metadata.ledgers(),
    api.metadata.customers(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Scenario Builder"
        title="Describe a business process — we plan and execute it"
        description="Write what you want to validate in plain English. CatalystRight parses your intent, resolves Oracle Fusion metadata, generates an execution graph, and runs it autonomously through Playwright agents."
      />
      <ScenarioBuilder
        templates={templates}
        businessUnits={bus}
        suppliers={suppliers}
        ledgers={ledgers}
        customers={customers}
      />
    </>
  );
}
