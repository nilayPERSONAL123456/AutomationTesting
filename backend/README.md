# CatalystRight — API (FastAPI)

## Layout

```
app/
├── main.py                    # FastAPI entrypoint
├── config.py                  # Pydantic settings
├── deps.py                    # Dependency injection
├── db/
│   ├── base.py                # SQLAlchemy Base
│   ├── session.py             # Async session factory
│   └── init_db.py             # Bootstrap
├── models/                    # SQLAlchemy ORM models
│   ├── tenant.py
│   ├── user.py
│   ├── oracle.py              # Environment, BU, ledger, supplier, customer
│   ├── scenario.py
│   ├── run.py                 # Run, RunStep, RunEvent
│   ├── evidence.py
│   ├── ai_call.py
│   └── validation.py
├── schemas/                   # Pydantic v2 schemas (API contracts)
├── api/
│   ├── router.py              # Top-level aggregator
│   └── v1/
│       ├── scenarios.py
│       ├── runs.py
│       ├── evidence.py
│       ├── metadata.py
│       ├── dashboard.py
│       └── ws.py              # /ws/runs/{id}
├── ai/                        # AI orchestration layer
│   ├── provider.py            # LLMProvider abstraction
│   ├── intent_parser.py
│   ├── planner.py
│   ├── validator.py
│   ├── recoverer.py
│   └── prompts/
│       ├── intent.md
│       ├── plan.md
│       └── validate.md
├── execution/                 # Execution / Playwright layer
│   ├── runner.py              # Main orchestrator
│   ├── engine.py              # State machine + dispatcher
│   ├── actions/
│   │   ├── base.py
│   │   ├── procurement.py
│   │   ├── purchase_order.py
│   │   ├── receiving.py
│   │   ├── payables.py
│   │   ├── order_mgmt.py
│   │   ├── receivables.py
│   │   ├── general_ledger.py
│   │   └── hcm.py
│   ├── evidence.py            # Screenshot, HAR, DOM capture
│   └── retry.py               # Retry policy
└── events/
    └── bus.py                 # Redis pubsub event bus
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# Interactive docs → http://localhost:8000/docs
```

## Environment

```
DATABASE_URL=postgresql+asyncpg://catalyst:catalyst@localhost:5432/catalyst
REDIS_URL=redis://localhost:6379/0
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
EVIDENCE_BUCKET=catalystright-evidence
```
