// =============================================================
// Shared domain types (mirror backend Pydantic schemas)
// =============================================================

export type OracleModule =
  | "P2P"
  | "O2C"
  | "R2R"
  | "H2R"
  | "PROJECTS"
  | "SCM"
  | "EPM";

export type RunStatus =
  | "DRAFT"
  | "PLANNED"
  | "RUNNING"
  | "PASSED"
  | "FAILED"
  | "ABORTED";

export type StepStatus =
  | "PENDING"
  | "RUNNING"
  | "PASSED"
  | "FAILED"
  | "SKIPPED"
  | "RETRYING";

export type EventLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";
export type EventSource = "AI" | "EXEC" | "SYSTEM" | "VALIDATOR";

export interface OracleEnvironment {
  id: string;
  name: string;
  envType: "DEV" | "TEST" | "UAT" | "PROD";
  podUrl: string;
}

export interface BusinessUnit {
  id: string;
  code: string;
  name: string;
  country: string;
  environmentId: string;
}

export interface Supplier {
  id: string;
  number: string;
  name: string;
  environmentId: string;
}

export interface Customer {
  id: string;
  number: string;
  name: string;
  environmentId: string;
}

export interface Ledger {
  id: string;
  name: string;
  currency: string;
  environmentId: string;
}

export interface ScenarioMetadata {
  environmentId: string;
  businessUnitId?: string;
  ledgerId?: string;
  supplierId?: string;
  customerId?: string;
  legalEntityId?: string;
}

export interface ScenarioIntent {
  module: OracleModule;
  process: string;
  summary: string;
  actors: string[];
  entities: Record<string, string>;
  checkpoints: string[];
}

export interface ProcessNode {
  id: string;
  label: string;
  oracleAction: string;
  kind: "start" | "task" | "approval" | "validation" | "end";
  dependsOn: string[];
  status: StepStatus;
  durationMs?: number;
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  kind: "data" | "approval" | "validation";
}

export interface ProcessGraph {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}

export interface Scenario {
  id: string;
  title: string;
  module: OracleModule;
  prompt: string;
  intent: ScenarioIntent;
  metadata: ScenarioMetadata;
  authorName: string;
  createdAt: string;
}

export interface ScenarioTemplate {
  id: string;
  module: OracleModule;
  name: string;
  description: string;
  prompt: string;
}

export interface RunEvent {
  id: string;
  runId: string;
  stepId?: string;
  ts: string;
  level: EventLevel;
  source: EventSource;
  message: string;
  payload?: Record<string, unknown>;
}

export interface Evidence {
  id: string;
  stepId: string;
  kind: "screenshot" | "transaction_id" | "value" | "dom" | "har";
  oracleTxId?: string;
  label: string;
  thumbnailUrl?: string;
  capturedAt: string;
}

export interface Validation {
  id: string;
  stepId?: string;
  checkName: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  reasoning?: string;
}

export interface AICall {
  id: string;
  phase: "intent" | "plan" | "recover" | "validate" | "summarize";
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  confidence?: number;
  createdAt: string;
}

export interface Run {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  module: OracleModule;
  environmentName: string;
  status: RunStatus;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
  confidence?: number;
  summary?: string;
  triggeredBy: string;
  graph: ProcessGraph;
  steps: ProcessNode[];
  events: RunEvent[];
  evidence: Evidence[];
  validations: Validation[];
  aiCalls: AICall[];
}
