import { PageHeader } from "@/components/shell/page-header";
import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";

const actions = [
  { group: "Procurement", items: ["proc.createRequisition", "proc.submitRequisition", "proc.approveRequisition"] },
  { group: "Purchase Order", items: ["po.autoCreate", "po.communicate", "po.cancel"] },
  { group: "Receiving", items: ["recv.createReceipt", "recv.correctReceipt", "recv.returnToSupplier"] },
  { group: "Accounts Payable", items: ["ap.createInvoice", "ap.validateMatch", "ap.payInvoice", "ap.cancelInvoice"] },
  { group: "Order Management", items: ["om.createSalesOrder", "om.shipOrder", "om.closeOrder"] },
  { group: "Accounts Receivable", items: ["ar.createInvoice", "ar.applyReceipt", "ar.issueCreditMemo"] },
  { group: "General Ledger", items: ["gl.postJournal", "gl.validatePosting", "gl.closePeriod"] },
  { group: "HR / Payroll", items: ["hcm.hireEmployee", "hcm.addAssignment", "pay.runPayroll"] },
];

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Action Library"
        title="High-level Oracle Fusion actions"
        description="Each action maps to a Playwright implementation with evidence capture, retries, and validation. Scenarios are compiled into compositions of these actions."
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((a) => (
          <Panel key={a.group}>
            <PanelHeader>
              <PanelTitle>{a.group}</PanelTitle>
              <Badge tone="default">{a.items.length}</Badge>
            </PanelHeader>
            <div>
              {a.items.map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border px-4 py-2.5 last:border-b-0"
                >
                  <code className="font-mono text-[11.5px] text-fg">{i}</code>
                  <Badge tone="success">stable</Badge>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
