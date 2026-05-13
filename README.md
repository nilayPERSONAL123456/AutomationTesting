# CatalystRight AI Testing Tool

> An autonomous AI platform for Oracle Fusion business process validation.

CatalystRight is **not** a chatbot, a script recorder, or a test-case generator.
It is an **AI operating system for Oracle Fusion testing** — users describe a business
scenario in plain English and the platform understands the intent, builds an execution
graph, orchestrates Oracle Fusion transactions through Playwright agents, validates
outcomes, captures evidence, and produces an auditable execution report.

```
  Plain English Scenario
          │
          ▼
  ┌───────────────────┐
  │  Intent Parser    │  (LLM abstraction — OpenAI / Claude)
  └─────────┬─────────┘
            ▼
  ┌───────────────────┐
  │  Process Planner  │  → Process Graph (nodes, deps, checkpoints)
  └─────────┬─────────┘
            ▼
  ┌───────────────────┐
  │ Execution Engine  │  → Playwright agents driving Oracle Fusion
  └─────────┬─────────┘
            ▼
  ┌───────────────────┐
  │ Evidence & Audit  │  → screenshots, tx IDs, validations
  └───────────────────┘
```

## Repository Layout

```
AutomationTesting/
├── frontend/              # Next.js 15 + TS + Tailwind + shadcn/ui
├── backend/               # FastAPI + SQLAlchemy + Redis + WS
├── docs/                  # Architecture, Design System, DB schema
├── docker-compose.yml     # Local dev (postgres, redis, api, web)
└── README.md
```

## Modules (Frontend)

| Module                       | Route                | Purpose                                        |
| ---------------------------- | -------------------- | ---------------------------------------------- |
| Command Center (Dashboard)   | `/`                  | KPIs, active runs, trends                      |
| Scenario Builder             | `/scenarios/new`     | Plain English scenario + Oracle metadata       |
| Scenario Library             | `/scenarios`         | Reusable templates                             |
| Process Graph Visualizer     | `/runs/[id]/graph`   | React Flow process map with execution states  |
| Live Execution Center        | `/runs/[id]`         | Timeline, logs, AI reasoning, screenshots     |
| AI Execution Console         | `/runs/[id]/console` | Plan, token usage, confidence, action queue   |
| Evidence & Validation        | `/runs/[id]/evidence`| Screenshots grid, tx IDs, audit trail         |
| Historical Runs              | `/history`           | Past runs, failures, replay, comparisons      |
| Oracle Environments          | `/environments`      | BU, ledgers, entities, supplier/customer      |

## Tech Stack

**Frontend**
- Next.js 15 (App Router, RSC)
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui primitives
- Framer Motion
- React Flow (process graph)
- Zustand (client state)
- TanStack Query (server state)
- Recharts (KPI viz)

**Backend**
- Python 3.12 + FastAPI
- SQLAlchemy 2 + Alembic
- PostgreSQL 16
- Redis 7 (queue + pubsub)
- WebSockets for live execution
- Pydantic v2

**Automation Layer**
- Playwright (Python)
- Oracle Fusion action library
- Evidence capture pipeline

**AI Layer**
- Provider-agnostic LLM abstraction (OpenAI, Anthropic)
- Structured JSON planner
- Intent parser → execution graph compiler

## Quick Start

```bash
docker compose up --build
# web     → http://localhost:3000
# api     → http://localhost:8000
# api docs → http://localhost:8000/docs
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md),
and [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) for the full design.
