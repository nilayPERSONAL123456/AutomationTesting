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

**Step 1:** Open a terminal and navigate into the project folder:
```bash
cd AutomationTesting
```

**Step 2:** Start all services:
```bash
docker compose up --build
```

Once running, open these in your browser:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

---

### Running WITHOUT Docker (Frontend only — works standalone with mock data)

If you just want to see the UI without Docker:

```bash
cd AutomationTesting/frontend
npm install --legacy-peer-deps
npm run dev
```

Then open http://localhost:3000 — it runs fully on mock data, no backend needed.

### Running WITHOUT Docker (Backend only)

```bash
cd AutomationTesting/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open http://localhost:8000/docs for the Swagger UI.

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md),
and [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) for the full design.
