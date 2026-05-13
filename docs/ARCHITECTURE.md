# CatalystRight — Architecture

## 1. System Overview

CatalystRight is organized into **four concern layers**, each independently
deployable and testable.

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI LAYER                                │
│   Next.js 15 App Router · Server Components · Zustand · WS      │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST + WebSocket
┌────────────────────────▼────────────────────────────────────────┐
│                  ORCHESTRATION LAYER                            │
│   FastAPI · Run Controller · State Machine · Event Bus (Redis)  │
└────────────┬─────────────────────────────┬──────────────────────┘
             │                             │
┌────────────▼───────────┐       ┌─────────▼──────────────────────┐
│       AI LAYER         │       │     EXECUTION LAYER            │
│ Intent Parser          │       │ Playwright Runner              │
│ Process Planner        │       │ Oracle Action Library          │
│ Validator LLM          │       │ Evidence Capturer              │
│ Provider Abstraction   │       │ Retry / Recovery               │
└────────────────────────┘       └────────────────────────────────┘
```

## 2. Layer Responsibilities

### 2.1 UI Layer
- Renders all product surfaces: Command Center, Scenario Builder, Graph, Live Execution, Evidence, History.
- Subscribes to run events over WebSocket (`/ws/runs/{id}`).
- Zustand slices for `run`, `scenario`, `metadata`, `ui`. TanStack Query for server cache.
- Pure presentational components under `components/*`; all data fetching in `lib/api.ts` or route-level server components.

### 2.2 Orchestration Layer (FastAPI)
- **Run Controller** — creates a `Run`, persists it, dispatches to Redis queue.
- **State Machine** — `DRAFT → PLANNED → RUNNING → (PASSED | FAILED | ABORTED)`; step-level `PENDING → RUNNING → PASSED | FAILED | SKIPPED | RETRYING`.
- **Event Bus** — Redis pubsub channel `run:{id}:events`. Every layer writes structured events; WebSocket handler fan-outs.
- **Routers** — `scenarios`, `executions`, `evidence`, `metadata`, `ws`.

### 2.3 AI Layer
- **`LLMProvider` abstraction** — `openai`, `anthropic`, `mock`. All calls are JSON-structured.
- **Intent Parser** — plain English → `ScenarioIntent` (module, process, BU, actors, entities).
- **Process Planner** — `ScenarioIntent` → `ProcessGraph` (nodes, deps, checkpoints, expected validations).
- **Validator** — compares captured evidence and response data against checkpoints; emits pass/fail with reasoning.
- **Prompts** are externalized in `app/ai/prompts/*.md`. Every AI call is logged with token usage and confidence.

### 2.4 Execution Layer
- **`PlaywrightRunner`** — manages a headed/headless browser pool, persisted Oracle session.
- **`OracleActionLibrary`** — high-level actions: `createRequisition`, `approveRequisition`, `createPO`, `receive`, `invoice`, `payInvoice`, `postJournal`, etc. Each action emits structured events.
- **`EvidenceCapturer`** — screenshots (full-page + viewport), DOM snapshots, network HAR samples, transaction-ID extraction.
- **`RetryPolicy`** — exponential backoff + AI-assisted recovery (e.g., "modal appeared — dismiss and retry").

## 3. End-to-End Run Lifecycle

1. User submits scenario text + metadata (`POST /api/scenarios`).
2. API persists `Scenario`, invokes **Intent Parser** → `intent` JSON.
3. **Planner** compiles a `ProcessGraph` and persists it as a new `Run` (status `PLANNED`).
4. Client opens `/runs/{id}` and connects `/ws/runs/{id}`.
5. Run Controller enqueues the run (`runs:queue`); a worker picks it up.
6. For each node, worker invokes the appropriate Oracle action; evidence is captured; events are published.
7. On terminal state, Validator LLM reviews the evidence bundle, produces final verdict and summary.
8. Evidence bundle is packaged and a signed download URL is produced for the report.

## 4. Data Flow Diagram

```
Client ──POST /scenarios──▶ API ──▶ AI.intent ──▶ AI.planner ──▶ DB(Run, ProcessGraph)
   ▲                                                                    │
   │◀────── WS run events ◀── Redis pubsub ◀── Worker ◀── Redis queue ◀─┘
                                      │
                                      ▼
                              Playwright → Oracle Fusion
                                      │
                                      ▼
                                Evidence → S3/MinIO + DB
```

## 5. Non-Functional

- **Multi-tenant** via `tenant_id` on every row; row-level security in Postgres.
- **Idempotency** — `Run` creation accepts an `Idempotency-Key`.
- **Observability** — OpenTelemetry traces from UI click → AI call → Playwright step.
- **Security** — Oracle credentials stored in a vault (not Postgres); per-environment service principals.
- **Scalability** — workers are horizontally scalable; WS gateway is stateless (Redis pubsub fan-out).

## 6. Folder Structure

See [`frontend/README.md`](../frontend/README.md) and [`backend/README.md`](../backend/README.md).
