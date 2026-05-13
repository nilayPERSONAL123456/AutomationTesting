"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PanelTitle,
} from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import {
  BusinessUnit,
  Customer,
  Ledger,
  OracleModule,
  ScenarioTemplate,
  Supplier,
} from "@/lib/types";
import {
  Sparkles,
  ChevronRight,
  Building2,
  Database,
  Users,
  Factory,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MODULES: { id: OracleModule; name: string; blurb: string }[] = [
  { id: "P2P", name: "Procure-to-Pay", blurb: "Requisition, PO, receipt, invoice, pay" },
  { id: "O2C", name: "Order-to-Cash", blurb: "Quote, order, ship, invoice, collect" },
  { id: "R2R", name: "Record-to-Report", blurb: "Sub-ledger close, journals, GL" },
  { id: "H2R", name: "Hire-to-Retire", blurb: "Onboarding, payroll, terminations" },
  { id: "PROJECTS", name: "Projects", blurb: "Costing, billing, capitalization" },
  { id: "SCM", name: "Supply Chain", blurb: "Planning, inventory, WMS" },
];

const SUGGESTIONS: { label: string; module: OracleModule; prompt: string }[] = [
  {
    label: "Test complete P2P cycle for Vision India BU using supplier ABC.",
    module: "P2P",
    prompt:
      "Test complete P2P cycle from requisition to payment for Vision India BU using supplier ABC Enterprises. Use category Office Supplies, amount ₹ 1,84,250.",
  },
  {
    label: "Validate period close for Vision India Ledger.",
    module: "R2R",
    prompt:
      "Run period close validation for Vision India Ledger for current open period. Close sub-ledgers AP, AR, FA; post manual journals; reconcile intercompany; close GL.",
  },
  {
    label: "O2C with return credit for customer Contoso.",
    module: "O2C",
    prompt:
      "Test O2C for Vision Operations customer Contoso Manufacturing — create SO for 100 units, ship, invoice, process return of 10 units, issue credit memo.",
  },
];

export function ScenarioBuilder({
  templates,
  businessUnits,
  suppliers,
  ledgers,
  customers,
}: {
  templates: ScenarioTemplate[];
  businessUnits: BusinessUnit[];
  suppliers: Supplier[];
  ledgers: Ledger[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [module, setModule] = useState<OracleModule>("P2P");
  const [prompt, setPrompt] = useState(SUGGESTIONS[0].prompt);
  const [buId, setBuId] = useState(businessUnits[0]?.id);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id);
  const [customerId, setCustomerId] = useState(customers[0]?.id);
  const [ledgerId, setLedgerId] = useState(ledgers[0]?.id);
  const [parsing, setParsing] = useState(false);

  const filteredTemplates = useMemo(
    () => templates.filter((t) => t.module === module),
    [module, templates]
  );

  async function handleLaunch() {
    setParsing(true);
    // Simulate intent parse → plan → run dispatch.
    await new Promise((r) => setTimeout(r, 900));
    router.push("/runs/run-1");
  }

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_360px]">
      {/* Left: composer */}
      <div className="flex flex-col gap-3">
        {/* Module picker */}
        <Panel>
          <PanelHeader>
            <PanelTitle>Oracle Fusion module</PanelTitle>
            <span className="label-mono">1 · Domain</span>
          </PanelHeader>
          <PanelBody className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {MODULES.map((m) => {
              const active = m.id === module;
              return (
                <button
                  key={m.id}
                  onClick={() => setModule(m.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-md border px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-accent/60 bg-accent/5"
                      : "border-border bg-surface-2 hover:border-border-strong"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Badge tone={active ? "accent" : "default"}>{m.id}</Badge>
                    <span className="text-[12.5px] font-medium text-fg">
                      {m.name}
                    </span>
                  </div>
                  <span className="text-[11.5px] text-fg-muted">{m.blurb}</span>
                </button>
              );
            })}
          </PanelBody>
        </Panel>

        {/* Prompt composer */}
        <Panel>
          <PanelHeader>
            <PanelTitle>Business scenario</PanelTitle>
            <div className="flex items-center gap-2">
              <span className="label-mono">2 · Intent</span>
              <Kbd>⌘</Kbd>
              <Kbd>⏎</Kbd>
            </div>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Test complete P2P cycle from requisition to payment for Vision India BU using supplier ABC Enterprises."
              rows={5}
              className="w-full resize-none rounded-md border border-border bg-surface-2 p-3 font-sans text-[13.5px] leading-relaxed text-fg placeholder:text-fg-subtle focus:border-accent/60 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="label-mono">Suggested prompts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setModule(s.module);
                    setPrompt(s.prompt);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11.5px] text-fg-muted hover:border-border-strong hover:text-fg"
                >
                  <Badge tone="accent">{s.module}</Badge>
                  {s.label}
                </button>
              ))}
            </div>
          </PanelBody>
        </Panel>

        {/* Templates */}
        <Panel>
          <PanelHeader>
            <PanelTitle>Reusable templates</PanelTitle>
            <span className="label-mono">Matching {module}</span>
          </PanelHeader>
          <PanelBody className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filteredTemplates.length === 0 && (
              <div className="col-span-full rounded-md border border-dashed border-border p-4 text-[12.5px] text-fg-muted">
                No templates for {module} yet. Save this scenario to create one.
              </div>
            )}
            {filteredTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setPrompt(t.prompt)}
                className="flex flex-col gap-1.5 rounded-md border border-border bg-surface-2 p-3 text-left hover:border-border-strong"
              >
                <div className="flex items-center gap-2">
                  <Badge tone="accent">{t.module}</Badge>
                  <span className="text-[12.5px] font-medium text-fg">
                    {t.name}
                  </span>
                </div>
                <span className="text-[11.5px] text-fg-muted">
                  {t.description}
                </span>
              </button>
            ))}
          </PanelBody>
        </Panel>
      </div>

      {/* Right: metadata + launch */}
      <div className="flex flex-col gap-3">
        <Panel>
          <PanelHeader>
            <PanelTitle>Oracle metadata</PanelTitle>
            <span className="label-mono">3 · Binding</span>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3">
            <MetaSelect
              icon={<Building2 className="h-3.5 w-3.5" />}
              label="Business Unit"
              value={buId}
              onChange={setBuId}
              options={businessUnits.map((b) => ({
                value: b.id,
                label: b.name,
                sub: b.code,
              }))}
            />
            <MetaSelect
              icon={<Database className="h-3.5 w-3.5" />}
              label="Ledger"
              value={ledgerId}
              onChange={setLedgerId}
              options={ledgers.map((l) => ({
                value: l.id,
                label: l.name,
                sub: l.currency,
              }))}
            />
            {module === "P2P" && (
              <MetaSelect
                icon={<Factory className="h-3.5 w-3.5" />}
                label="Supplier"
                value={supplierId}
                onChange={setSupplierId}
                options={suppliers.map((s) => ({
                  value: s.id,
                  label: s.name,
                  sub: s.number,
                }))}
              />
            )}
            {module === "O2C" && (
              <MetaSelect
                icon={<Users className="h-3.5 w-3.5" />}
                label="Customer"
                value={customerId}
                onChange={setCustomerId}
                options={customers.map((c) => ({
                  value: c.id,
                  label: c.name,
                  sub: c.number,
                }))}
              />
            )}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Plan preview</PanelTitle>
            <Wand2 className="h-3.5 w-3.5 text-accent" />
          </PanelHeader>
          <PanelBody className="flex flex-col gap-2.5">
            <PlanHint
              step="Parse intent"
              hint="LLM extracts module, process, actors, entities."
            />
            <PlanHint
              step="Resolve metadata"
              hint="Business unit, ledger, supplier/customer IDs are bound."
            />
            <PlanHint
              step="Compile graph"
              hint="Produces ~12 nodes for a full P2P cycle with checkpoints."
            />
            <PlanHint
              step="Execute autonomously"
              hint="Playwright agent drives Oracle Fusion UI with evidence capture."
            />
          </PanelBody>
        </Panel>

        <motion.div layout>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleLaunch}
            disabled={parsing || prompt.trim().length < 10}
          >
            {parsing ? (
              <>
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-white" />
                Parsing intent & building graph…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Plan & execute
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function MetaSelect({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; sub?: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label-mono">{label}</span>
      <div className="relative">
        <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-subtle">
          {icon}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full appearance-none rounded-md border border-border bg-surface-2 pl-8 pr-8 text-[12.5px] text-fg outline-none hover:border-border-strong focus:border-accent/60"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label} {o.sub ? `· ${o.sub}` : ""}
            </option>
          ))}
        </select>
        <ChevronRight className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 rotate-90 text-fg-subtle" />
      </div>
    </label>
  );
}

function PlanHint({ step, hint }: { step: string; hint: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
      <div className="flex flex-col leading-tight">
        <span className="text-[12.5px] font-medium text-fg">{step}</span>
        <span className="text-[11.5px] text-fg-muted">{hint}</span>
      </div>
    </div>
  );
}
