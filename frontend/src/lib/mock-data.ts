import type {
  AICall,
  BusinessUnit,
  Customer,
  Evidence,
  Ledger,
  OracleEnvironment,
  ProcessGraph,
  Run,
  RunEvent,
  Scenario,
  ScenarioTemplate,
  Supplier,
  Validation,
} from "./types";

// ---------- Oracle metadata ----------
export const environments: OracleEnvironment[] = [
  { id: "env-dev", name: "Vision DEV", envType: "DEV", podUrl: "https://vision-dev.oraclecloud.com" },
  { id: "env-test", name: "Vision TEST", envType: "TEST", podUrl: "https://vision-test.oraclecloud.com" },
  { id: "env-uat", name: "Vision UAT", envType: "UAT", podUrl: "https://vision-uat.oraclecloud.com" },
];

export const businessUnits: BusinessUnit[] = [
  { id: "bu-in", code: "VIS-IN", name: "Vision India BU", country: "IN", environmentId: "env-uat" },
  { id: "bu-us", code: "VIS-US", name: "Vision Operations", country: "US", environmentId: "env-uat" },
  { id: "bu-uk", code: "VIS-UK", name: "Vision United Kingdom", country: "GB", environmentId: "env-uat" },
  { id: "bu-sg", code: "VIS-SG", name: "Vision Singapore", country: "SG", environmentId: "env-uat" },
];

export const ledgers: Ledger[] = [
  { id: "led-in", name: "Vision India Ledger", currency: "INR", environmentId: "env-uat" },
  { id: "led-us", name: "Vision USA Ledger", currency: "USD", environmentId: "env-uat" },
  { id: "led-uk", name: "Vision UK Ledger", currency: "GBP", environmentId: "env-uat" },
];

export const suppliers: Supplier[] = [
  { id: "sup-abc", number: "SUP-1001", name: "ABC Enterprises Pvt Ltd", environmentId: "env-uat" },
  { id: "sup-xyz", number: "SUP-1042", name: "XYZ Global Logistics", environmentId: "env-uat" },
  { id: "sup-apex", number: "SUP-1203", name: "Apex Industrial Supplies", environmentId: "env-uat" },
];

export const customers: Customer[] = [
  { id: "cus-001", number: "CUS-2001", name: "Northwind Traders", environmentId: "env-uat" },
  { id: "cus-002", number: "CUS-2044", name: "Contoso Manufacturing", environmentId: "env-uat" },
];

// ---------- Scenario templates ----------
export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: "tpl-p2p-full",
    module: "P2P",
    name: "Complete P2P cycle",
    description: "Requisition → approval → PO → receipt → invoice → payment",
    prompt:
      "Test the complete Procure-to-Pay cycle for {BU} using supplier {SUPPLIER}. Create a requisition for stationery items worth {AMOUNT}, obtain approval, auto-generate PO, post receipt, match AP invoice, and disburse payment.",
  },
  {
    id: "tpl-o2c-ret",
    module: "O2C",
    name: "O2C with return credit",
    description: "Sales order → shipment → invoice → return → credit memo",
    prompt:
      "Test Order-to-Cash for {BU} customer {CUSTOMER}. Create a sales order of 100 units, ship, invoice, process a 10-unit return and issue a credit memo.",
  },
  {
    id: "tpl-r2r-close",
    module: "R2R",
    name: "Period close validation",
    description: "Sub-ledger close, journals, reconciliation, GL close",
    prompt:
      "Validate period close for {LEDGER} for current fiscal period: close sub-ledgers, post manual journals, reconcile inter-company and close GL.",
  },
  {
    id: "tpl-h2r-hire",
    module: "H2R",
    name: "Hire-to-retire onboarding",
    description: "New hire, assignment, payroll element, first paycheck",
    prompt:
      "Onboard a new employee in {BU}, assign position, add salary and benefit elements, run payroll and validate first paycheck.",
  },
];

// ---------- A rich sample P2P run ----------
export const sampleGraph: ProcessGraph = {
  nodes: [
    { id: "n1", label: "Parse scenario intent", oracleAction: "ai.parseIntent", kind: "start", dependsOn: [], status: "PASSED", durationMs: 1240 },
    { id: "n2", label: "Create requisition", oracleAction: "proc.createRequisition", kind: "task", dependsOn: ["n1"], status: "PASSED", durationMs: 14320 },
    { id: "n3", label: "Submit for approval", oracleAction: "proc.submitRequisition", kind: "approval", dependsOn: ["n2"], status: "PASSED", durationMs: 5020 },
    { id: "n4", label: "Approve requisition", oracleAction: "proc.approveRequisition", kind: "approval", dependsOn: ["n3"], status: "PASSED", durationMs: 7110 },
    { id: "n5", label: "Auto-generate PO", oracleAction: "po.autoCreate", kind: "task", dependsOn: ["n4"], status: "PASSED", durationMs: 9240 },
    { id: "n6", label: "Communicate PO to supplier", oracleAction: "po.communicate", kind: "task", dependsOn: ["n5"], status: "PASSED", durationMs: 3120 },
    { id: "n7", label: "Post receipt", oracleAction: "recv.createReceipt", kind: "task", dependsOn: ["n6"], status: "RUNNING", durationMs: undefined },
    { id: "n8", label: "Create AP invoice", oracleAction: "ap.createInvoice", kind: "task", dependsOn: ["n7"], status: "PENDING" },
    { id: "n9", label: "3-way match validation", oracleAction: "ap.validateMatch", kind: "validation", dependsOn: ["n8"], status: "PENDING" },
    { id: "n10", label: "Pay invoice", oracleAction: "ap.payInvoice", kind: "task", dependsOn: ["n9"], status: "PENDING" },
    { id: "n11", label: "Validate accounting entries", oracleAction: "gl.validatePosting", kind: "validation", dependsOn: ["n10"], status: "PENDING" },
    { id: "n12", label: "Close run", oracleAction: "system.close", kind: "end", dependsOn: ["n11"], status: "PENDING" },
  ],
  edges: [
    { id: "e1", source: "n1", target: "n2", kind: "data" },
    { id: "e2", source: "n2", target: "n3", kind: "data" },
    { id: "e3", source: "n3", target: "n4", kind: "approval" },
    { id: "e4", source: "n4", target: "n5", kind: "data" },
    { id: "e5", source: "n5", target: "n6", kind: "data" },
    { id: "e6", source: "n6", target: "n7", kind: "data" },
    { id: "e7", source: "n7", target: "n8", kind: "data" },
    { id: "e8", source: "n8", target: "n9", kind: "validation" },
    { id: "e9", source: "n9", target: "n10", kind: "data" },
    { id: "e10", source: "n10", target: "n11", kind: "validation" },
    { id: "e11", source: "n11", target: "n12", kind: "data" },
  ],
};

const now = Date.now();
const iso = (offset: number) => new Date(now - offset).toISOString();

const sampleEvents: RunEvent[] = [
  { id: "ev1", runId: "run-1", ts: iso(420000), level: "INFO", source: "AI", message: "Intent parsed: P2P complete cycle for Vision India BU, supplier ABC Enterprises.", payload: { confidence: 0.94 } },
  { id: "ev2", runId: "run-1", stepId: "n2", ts: iso(405000), level: "INFO", source: "EXEC", message: "Navigating to Requisitions › New Requisition." },
  { id: "ev3", runId: "run-1", stepId: "n2", ts: iso(390000), level: "INFO", source: "EXEC", message: "Requisition REQ-109834 created." },
  { id: "ev4", runId: "run-1", stepId: "n4", ts: iso(302000), level: "INFO", source: "EXEC", message: "Approver priya.menon@vision.com approved REQ-109834." },
  { id: "ev5", runId: "run-1", stepId: "n5", ts: iso(244000), level: "INFO", source: "EXEC", message: "Auto-generated PO-44210 linked to REQ-109834." },
  { id: "ev6", runId: "run-1", stepId: "n6", ts: iso(220000), level: "WARN", source: "EXEC", message: "Supplier portal ACK timeout; AI recovery issued retry." },
  { id: "ev7", runId: "run-1", stepId: "n6", ts: iso(215000), level: "INFO", source: "AI", message: "Recovery plan: refresh page, re-submit communicate request.", payload: { confidence: 0.82 } },
  { id: "ev8", runId: "run-1", stepId: "n6", ts: iso(212000), level: "INFO", source: "EXEC", message: "PO communicated successfully." },
  { id: "ev9", runId: "run-1", stepId: "n7", ts: iso(60000), level: "INFO", source: "EXEC", message: "Opening Receipts › New Receipt." },
  { id: "ev10", runId: "run-1", stepId: "n7", ts: iso(8000), level: "INFO", source: "EXEC", message: "Posting receipt for PO-44210 quantity 120." },
];

const sampleEvidence: Evidence[] = [
  { id: "evd1", stepId: "n2", kind: "screenshot", label: "Requisition created", oracleTxId: "REQ-109834", capturedAt: iso(390000) },
  { id: "evd2", stepId: "n4", kind: "screenshot", label: "Approval confirmation", oracleTxId: "REQ-109834", capturedAt: iso(302000) },
  { id: "evd3", stepId: "n5", kind: "screenshot", label: "PO auto-generated", oracleTxId: "PO-44210", capturedAt: iso(244000) },
  { id: "evd4", stepId: "n5", kind: "transaction_id", label: "Purchase order ID", oracleTxId: "PO-44210", capturedAt: iso(244000) },
  { id: "evd5", stepId: "n6", kind: "screenshot", label: "Supplier ACK", oracleTxId: "PO-44210", capturedAt: iso(212000) },
  { id: "evd6", stepId: "n7", kind: "screenshot", label: "Receipt in progress", capturedAt: iso(6000) },
];

const sampleValidations: Validation[] = [
  { id: "v1", stepId: "n2", checkName: "Requisition header saved", passed: true, expected: "Status = Incomplete", actual: "Status = Incomplete", reasoning: "Header persisted prior to submit." },
  { id: "v2", stepId: "n4", checkName: "Requisition approved by authorized approver", passed: true, expected: "Status = Approved", actual: "Status = Approved" },
  { id: "v3", stepId: "n5", checkName: "PO amount matches requisition", passed: true, expected: "₹ 184,250.00", actual: "₹ 184,250.00" },
];

const sampleAICalls: AICall[] = [
  { id: "ai1", phase: "intent", provider: "openai", model: "gpt-4.1-mini", promptTokens: 482, completionTokens: 211, latencyMs: 1180, confidence: 0.94, createdAt: iso(420000) },
  { id: "ai2", phase: "plan", provider: "openai", model: "gpt-4.1", promptTokens: 1944, completionTokens: 688, latencyMs: 3240, confidence: 0.91, createdAt: iso(415000) },
  { id: "ai3", phase: "recover", provider: "openai", model: "gpt-4.1-mini", promptTokens: 612, completionTokens: 140, latencyMs: 880, confidence: 0.82, createdAt: iso(215000) },
];

const scenario1: Scenario = {
  id: "scn-1",
  title: "P2P cycle — Vision India — Supplier ABC",
  module: "P2P",
  prompt:
    "Test complete P2P cycle from requisition to payment for Vision India BU using supplier ABC Enterprises.",
  intent: {
    module: "P2P",
    process: "Procure-to-Pay complete cycle",
    summary:
      "Execute requisition creation, approval routing, PO auto-generation, receipt, AP invoice, 3-way match and payment for Vision India BU against supplier ABC Enterprises.",
    actors: ["Requester", "Approver", "Buyer", "AP Clerk", "Treasury"],
    entities: {
      businessUnit: "Vision India BU",
      supplier: "ABC Enterprises Pvt Ltd",
      category: "Office Supplies",
      currency: "INR",
    },
    checkpoints: [
      "Requisition created with correct BU",
      "Approval routed to Priya Menon",
      "PO amount matches requisition",
      "Receipt quantity matches PO",
      "3-way match successful",
      "Payment disbursement reflected in GL",
    ],
  },
  metadata: {
    environmentId: "env-uat",
    businessUnitId: "bu-in",
    ledgerId: "led-in",
    supplierId: "sup-abc",
  },
  authorName: "N. Kale",
  createdAt: iso(600000),
};

export const scenarios: Scenario[] = [
  scenario1,
  {
    id: "scn-2",
    title: "O2C — Contoso return credit",
    module: "O2C",
    prompt:
      "Run O2C with a 10-unit return for customer Contoso Manufacturing in Vision US BU.",
    intent: {
      module: "O2C",
      process: "Order-to-Cash with return",
      summary: "Sales order, shipment, invoice, RMA and credit memo.",
      actors: ["Sales Rep", "Shipping Clerk", "AR Clerk"],
      entities: { businessUnit: "Vision Operations", customer: "Contoso Manufacturing" },
      checkpoints: ["SO created", "Shipment released", "Invoice generated", "Credit memo posted"],
    },
    metadata: { environmentId: "env-uat", businessUnitId: "bu-us", customerId: "cus-002" },
    authorName: "S. Iyer",
    createdAt: iso(86_400_000),
  },
];

export const runs: Run[] = [
  {
    id: "run-1",
    scenarioId: "scn-1",
    scenarioTitle: scenario1.title,
    module: "P2P",
    environmentName: "Vision UAT",
    status: "RUNNING",
    startedAt: iso(420000),
    durationMs: 420000,
    confidence: 0.91,
    summary:
      "6 of 12 steps complete. 3-way match pending after receipt posting. No blockers detected.",
    triggeredBy: "N. Kale",
    graph: sampleGraph,
    steps: sampleGraph.nodes,
    events: sampleEvents,
    evidence: sampleEvidence,
    validations: sampleValidations,
    aiCalls: sampleAICalls,
  },
  {
    id: "run-2",
    scenarioId: "scn-2",
    scenarioTitle: "O2C — Contoso return credit",
    module: "O2C",
    environmentName: "Vision UAT",
    status: "PASSED",
    startedAt: iso(3 * 3600 * 1000),
    finishedAt: iso(3 * 3600 * 1000 - 1_245_000),
    durationMs: 1_245_000,
    confidence: 0.96,
    summary: "All 9 checkpoints passed. Credit memo CM-88120 posted.",
    triggeredBy: "S. Iyer",
    graph: { nodes: [], edges: [] },
    steps: [],
    events: [],
    evidence: [],
    validations: [],
    aiCalls: [],
  },
  {
    id: "run-3",
    scenarioId: "scn-1",
    scenarioTitle: "R2R period close — INR Ledger",
    module: "R2R",
    environmentName: "Vision UAT",
    status: "FAILED",
    startedAt: iso(24 * 3600 * 1000),
    finishedAt: iso(24 * 3600 * 1000 - 2_800_000),
    durationMs: 2_800_000,
    confidence: 0.74,
    summary: "Intercompany reconciliation failed for entity pair IN↔US. Balance variance ₹ 12,480.",
    triggeredBy: "A. Rao",
    graph: { nodes: [], edges: [] },
    steps: [],
    events: [],
    evidence: [],
    validations: [],
    aiCalls: [],
  },
  {
    id: "run-4",
    scenarioId: "scn-2",
    scenarioTitle: "H2R — UK new hire onboarding",
    module: "H2R",
    environmentName: "Vision UAT",
    status: "PASSED",
    startedAt: iso(2 * 24 * 3600 * 1000),
    finishedAt: iso(2 * 24 * 3600 * 1000 - 1_860_000),
    durationMs: 1_860_000,
    confidence: 0.98,
    summary: "Employee EMP-55023 onboarded, first paycheck £ 4,210.00 validated.",
    triggeredBy: "J. Baker",
    graph: { nodes: [], edges: [] },
    steps: [],
    events: [],
    evidence: [],
    validations: [],
    aiCalls: [],
  },
  {
    id: "run-5",
    scenarioId: "scn-1",
    scenarioTitle: "P2P — Apex Industrial Supplies",
    module: "P2P",
    environmentName: "Vision UAT",
    status: "PASSED",
    startedAt: iso(3 * 24 * 3600 * 1000),
    finishedAt: iso(3 * 24 * 3600 * 1000 - 905_000),
    durationMs: 905_000,
    confidence: 0.93,
    triggeredBy: "N. Kale",
    summary: "P2P happy-path validated end-to-end.",
    graph: { nodes: [], edges: [] },
    steps: [],
    events: [],
    evidence: [],
    validations: [],
    aiCalls: [],
  },
];

// Aggregate KPIs for the Command Center
export const dashboardKpis = {
  totalRuns7d: 142,
  successRate7d: 0.928,
  avgDurationMs: 742_000,
  failureRate7d: 0.072,
  aiTokensUsed24h: 2_480_000,
  activeRuns: 3,
  successDelta: 2.1,
  failureDelta: -0.8,
};

export const successTrend = [
  { day: "Mon", passed: 18, failed: 2 },
  { day: "Tue", passed: 21, failed: 1 },
  { day: "Wed", passed: 24, failed: 3 },
  { day: "Thu", passed: 22, failed: 2 },
  { day: "Fri", passed: 26, failed: 1 },
  { day: "Sat", passed: 11, failed: 0 },
  { day: "Sun", passed: 9, failed: 1 },
];

export const moduleDistribution = [
  { module: "P2P", runs: 52 },
  { module: "O2C", runs: 41 },
  { module: "R2R", runs: 24 },
  { module: "H2R", runs: 15 },
  { module: "PROJECTS", runs: 6 },
  { module: "SCM", runs: 4 },
];
