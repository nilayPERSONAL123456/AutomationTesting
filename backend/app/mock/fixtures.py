"""In-memory fixtures for the demo / prototype.

A production deployment swaps this module with SQLAlchemy repositories.
All API handlers depend only on the Pydantic schemas, so the cutover is clean.
"""

from datetime import datetime, timedelta, timezone

from app.schemas import (
    AICall,
    BusinessUnit,
    Customer,
    Evidence,
    Ledger,
    OracleEnvironment,
    ProcessEdge,
    ProcessGraph,
    ProcessNode,
    Run,
    RunEvent,
    Scenario,
    ScenarioIntent,
    ScenarioMetadata,
    ScenarioTemplate,
    Supplier,
    Validation,
)
from app.schemas.enums import (
    EventLevel,
    EventSource,
    OracleModule,
    RunStatus,
    StepStatus,
)


def _ts(offset_seconds: int) -> datetime:
    return datetime.now(tz=timezone.utc) - timedelta(seconds=offset_seconds)


ENVIRONMENTS: list[OracleEnvironment] = [
    OracleEnvironment(id="env-dev", name="Vision DEV", envType="DEV", podUrl="https://vision-dev.oraclecloud.com"),
    OracleEnvironment(id="env-test", name="Vision TEST", envType="TEST", podUrl="https://vision-test.oraclecloud.com"),
    OracleEnvironment(id="env-uat", name="Vision UAT", envType="UAT", podUrl="https://vision-uat.oraclecloud.com"),
]

BUSINESS_UNITS: list[BusinessUnit] = [
    BusinessUnit(id="bu-in", code="VIS-IN", name="Vision India BU", country="IN", environmentId="env-uat"),
    BusinessUnit(id="bu-us", code="VIS-US", name="Vision Operations", country="US", environmentId="env-uat"),
    BusinessUnit(id="bu-uk", code="VIS-UK", name="Vision United Kingdom", country="GB", environmentId="env-uat"),
    BusinessUnit(id="bu-sg", code="VIS-SG", name="Vision Singapore", country="SG", environmentId="env-uat"),
]

LEDGERS: list[Ledger] = [
    Ledger(id="led-in", name="Vision India Ledger", currency="INR", environmentId="env-uat"),
    Ledger(id="led-us", name="Vision USA Ledger", currency="USD", environmentId="env-uat"),
    Ledger(id="led-uk", name="Vision UK Ledger", currency="GBP", environmentId="env-uat"),
]

SUPPLIERS: list[Supplier] = [
    Supplier(id="sup-abc", number="SUP-1001", name="ABC Enterprises Pvt Ltd", environmentId="env-uat"),
    Supplier(id="sup-xyz", number="SUP-1042", name="XYZ Global Logistics", environmentId="env-uat"),
    Supplier(id="sup-apex", number="SUP-1203", name="Apex Industrial Supplies", environmentId="env-uat"),
]

CUSTOMERS: list[Customer] = [
    Customer(id="cus-001", number="CUS-2001", name="Northwind Traders", environmentId="env-uat"),
    Customer(id="cus-002", number="CUS-2044", name="Contoso Manufacturing", environmentId="env-uat"),
]

TEMPLATES: list[ScenarioTemplate] = [
    ScenarioTemplate(
        id="tpl-p2p-full",
        module=OracleModule.P2P,
        name="Complete P2P cycle",
        description="Requisition → approval → PO → receipt → invoice → payment",
        prompt=(
            "Test the complete Procure-to-Pay cycle for {BU} using supplier "
            "{SUPPLIER}. Create a requisition, approve, auto-PO, receive, invoice and pay."
        ),
    ),
    ScenarioTemplate(
        id="tpl-o2c-ret",
        module=OracleModule.O2C,
        name="O2C with return credit",
        description="Sales order → shipment → invoice → return → credit memo",
        prompt="Test O2C for {BU} customer {CUSTOMER} with a 10% return and credit memo.",
    ),
    ScenarioTemplate(
        id="tpl-r2r-close",
        module=OracleModule.R2R,
        name="Period close validation",
        description="Sub-ledger close, journals, reconciliation, GL close",
        prompt="Validate period close for {LEDGER} for current open fiscal period.",
    ),
]


def _p2p_graph() -> ProcessGraph:
    nodes = [
        ProcessNode(id="n1", label="Parse scenario intent", oracleAction="ai.parseIntent", kind="start", dependsOn=[], status=StepStatus.PASSED, durationMs=1240),
        ProcessNode(id="n2", label="Create requisition", oracleAction="proc.createRequisition", kind="task", dependsOn=["n1"], status=StepStatus.PASSED, durationMs=14320),
        ProcessNode(id="n3", label="Submit for approval", oracleAction="proc.submitRequisition", kind="approval", dependsOn=["n2"], status=StepStatus.PASSED, durationMs=5020),
        ProcessNode(id="n4", label="Approve requisition", oracleAction="proc.approveRequisition", kind="approval", dependsOn=["n3"], status=StepStatus.PASSED, durationMs=7110),
        ProcessNode(id="n5", label="Auto-generate PO", oracleAction="po.autoCreate", kind="task", dependsOn=["n4"], status=StepStatus.PASSED, durationMs=9240),
        ProcessNode(id="n6", label="Communicate PO to supplier", oracleAction="po.communicate", kind="task", dependsOn=["n5"], status=StepStatus.PASSED, durationMs=3120),
        ProcessNode(id="n7", label="Post receipt", oracleAction="recv.createReceipt", kind="task", dependsOn=["n6"], status=StepStatus.RUNNING),
        ProcessNode(id="n8", label="Create AP invoice", oracleAction="ap.createInvoice", kind="task", dependsOn=["n7"]),
        ProcessNode(id="n9", label="3-way match validation", oracleAction="ap.validateMatch", kind="validation", dependsOn=["n8"]),
        ProcessNode(id="n10", label="Pay invoice", oracleAction="ap.payInvoice", kind="task", dependsOn=["n9"]),
        ProcessNode(id="n11", label="Validate accounting entries", oracleAction="gl.validatePosting", kind="validation", dependsOn=["n10"]),
        ProcessNode(id="n12", label="Close run", oracleAction="system.close", kind="end", dependsOn=["n11"]),
    ]
    edges = [
        ProcessEdge(id="e1", source="n1", target="n2", kind="data"),
        ProcessEdge(id="e2", source="n2", target="n3", kind="data"),
        ProcessEdge(id="e3", source="n3", target="n4", kind="approval"),
        ProcessEdge(id="e4", source="n4", target="n5", kind="data"),
        ProcessEdge(id="e5", source="n5", target="n6", kind="data"),
        ProcessEdge(id="e6", source="n6", target="n7", kind="data"),
        ProcessEdge(id="e7", source="n7", target="n8", kind="data"),
        ProcessEdge(id="e8", source="n8", target="n9", kind="validation"),
        ProcessEdge(id="e9", source="n9", target="n10", kind="data"),
        ProcessEdge(id="e10", source="n10", target="n11", kind="validation"),
        ProcessEdge(id="e11", source="n11", target="n12", kind="data"),
    ]
    return ProcessGraph(nodes=nodes, edges=edges)


SCENARIOS: list[Scenario] = [
    Scenario(
        id="scn-1",
        title="P2P cycle — Vision India — Supplier ABC",
        module=OracleModule.P2P,
        prompt=(
            "Test complete P2P cycle from requisition to payment for Vision India BU "
            "using supplier ABC Enterprises."
        ),
        intent=ScenarioIntent(
            module=OracleModule.P2P,
            process="Procure-to-Pay complete cycle",
            summary=(
                "Execute requisition creation, approval routing, PO auto-generation, "
                "receipt, AP invoice, 3-way match and payment."
            ),
            actors=["Requester", "Approver", "Buyer", "AP Clerk", "Treasury"],
            entities={
                "businessUnit": "Vision India BU",
                "supplier": "ABC Enterprises Pvt Ltd",
                "category": "Office Supplies",
                "currency": "INR",
            },
            checkpoints=[
                "Requisition created with correct BU",
                "Approval routed to Priya Menon",
                "PO amount matches requisition",
                "Receipt quantity matches PO",
                "3-way match successful",
                "Payment disbursement reflected in GL",
            ],
        ),
        metadata=ScenarioMetadata(environmentId="env-uat", businessUnitId="bu-in", ledgerId="led-in", supplierId="sup-abc"),
        authorName="N. Kale",
        createdAt=_ts(600),
    ),
]


def _events() -> list[RunEvent]:
    return [
        RunEvent(id="ev1", runId="run-1", ts=_ts(420), level=EventLevel.INFO, source=EventSource.AI,
                 message="Intent parsed: P2P complete cycle for Vision India BU, supplier ABC Enterprises.",
                 payload={"confidence": 0.94}),
        RunEvent(id="ev2", runId="run-1", stepId="n2", ts=_ts(405), level=EventLevel.INFO, source=EventSource.EXEC,
                 message="Navigating to Requisitions › New Requisition."),
        RunEvent(id="ev3", runId="run-1", stepId="n2", ts=_ts(390), level=EventLevel.INFO, source=EventSource.EXEC,
                 message="Requisition REQ-109834 created."),
        RunEvent(id="ev4", runId="run-1", stepId="n4", ts=_ts(302), level=EventLevel.INFO, source=EventSource.EXEC,
                 message="Approver priya.menon@vision.com approved REQ-109834."),
        RunEvent(id="ev5", runId="run-1", stepId="n5", ts=_ts(244), level=EventLevel.INFO, source=EventSource.EXEC,
                 message="Auto-generated PO-44210 linked to REQ-109834."),
        RunEvent(id="ev6", runId="run-1", stepId="n6", ts=_ts(220), level=EventLevel.WARN, source=EventSource.EXEC,
                 message="Supplier portal ACK timeout; AI recovery issued retry."),
        RunEvent(id="ev7", runId="run-1", stepId="n6", ts=_ts(215), level=EventLevel.INFO, source=EventSource.AI,
                 message="Recovery plan: refresh page, re-submit communicate request.",
                 payload={"confidence": 0.82}),
        RunEvent(id="ev8", runId="run-1", stepId="n6", ts=_ts(212), level=EventLevel.INFO, source=EventSource.EXEC,
                 message="PO communicated successfully."),
        RunEvent(id="ev9", runId="run-1", stepId="n7", ts=_ts(60), level=EventLevel.INFO, source=EventSource.EXEC,
                 message="Opening Receipts › New Receipt."),
        RunEvent(id="ev10", runId="run-1", stepId="n7", ts=_ts(8), level=EventLevel.INFO, source=EventSource.EXEC,
                 message="Posting receipt for PO-44210 quantity 120."),
    ]


def _evidence() -> list[Evidence]:
    return [
        Evidence(id="evd1", stepId="n2", kind="screenshot", label="Requisition created", oracleTxId="REQ-109834", capturedAt=_ts(390)),
        Evidence(id="evd2", stepId="n4", kind="screenshot", label="Approval confirmation", oracleTxId="REQ-109834", capturedAt=_ts(302)),
        Evidence(id="evd3", stepId="n5", kind="screenshot", label="PO auto-generated", oracleTxId="PO-44210", capturedAt=_ts(244)),
        Evidence(id="evd4", stepId="n5", kind="transaction_id", label="Purchase order ID", oracleTxId="PO-44210", capturedAt=_ts(244)),
        Evidence(id="evd5", stepId="n6", kind="screenshot", label="Supplier ACK", oracleTxId="PO-44210", capturedAt=_ts(212)),
    ]


def _validations() -> list[Validation]:
    return [
        Validation(id="v1", stepId="n2", checkName="Requisition header saved", passed=True,
                   expected="Status = Incomplete", actual="Status = Incomplete",
                   reasoning="Header persisted prior to submit."),
        Validation(id="v2", stepId="n4", checkName="Requisition approved by authorized approver", passed=True,
                   expected="Status = Approved", actual="Status = Approved"),
        Validation(id="v3", stepId="n5", checkName="PO amount matches requisition", passed=True,
                   expected="INR 184,250.00", actual="INR 184,250.00"),
    ]


def _ai_calls() -> list[AICall]:
    return [
        AICall(id="ai1", phase="intent", provider="openai", model="gpt-4.1-mini",
               promptTokens=482, completionTokens=211, latencyMs=1180, confidence=0.94, createdAt=_ts(420)),
        AICall(id="ai2", phase="plan", provider="openai", model="gpt-4.1",
               promptTokens=1944, completionTokens=688, latencyMs=3240, confidence=0.91, createdAt=_ts(415)),
        AICall(id="ai3", phase="recover", provider="openai", model="gpt-4.1-mini",
               promptTokens=612, completionTokens=140, latencyMs=880, confidence=0.82, createdAt=_ts(215)),
    ]


def _sample_run() -> Run:
    graph = _p2p_graph()
    return Run(
        id="run-1",
        scenarioId="scn-1",
        scenarioTitle=SCENARIOS[0].title,
        module=OracleModule.P2P,
        environmentName="Vision UAT",
        status=RunStatus.RUNNING,
        startedAt=_ts(420),
        durationMs=420_000,
        confidence=0.91,
        summary="6 of 12 steps complete. 3-way match pending after receipt posting.",
        triggeredBy="N. Kale",
        graph=graph,
        steps=graph.nodes,
        events=_events(),
        evidence=_evidence(),
        validations=_validations(),
        aiCalls=_ai_calls(),
    )


RUNS: list[Run] = [_sample_run()]


# Public aliases (the underscored helpers are kept for local clarity).
sample_p2p_graph = _p2p_graph
sample_run = _sample_run


DASHBOARD_KPIS = {
    "totalRuns7d": 142,
    "successRate7d": 0.928,
    "avgDurationMs": 742_000,
    "failureRate7d": 0.072,
    "aiTokensUsed24h": 2_480_000,
    "activeRuns": 3,
    "successDelta": 2.1,
    "failureDelta": -0.8,
}

TREND = [
    {"day": "Mon", "passed": 18, "failed": 2},
    {"day": "Tue", "passed": 21, "failed": 1},
    {"day": "Wed", "passed": 24, "failed": 3},
    {"day": "Thu", "passed": 22, "failed": 2},
    {"day": "Fri", "passed": 26, "failed": 1},
    {"day": "Sat", "passed": 11, "failed": 0},
    {"day": "Sun", "passed": 9, "failed": 1},
]

MODULE_DISTRIBUTION = [
    {"module": "P2P", "runs": 52},
    {"module": "O2C", "runs": 41},
    {"module": "R2R", "runs": 24},
    {"module": "H2R", "runs": 15},
    {"module": "PROJECTS", "runs": 6},
    {"module": "SCM", "runs": 4},
]
