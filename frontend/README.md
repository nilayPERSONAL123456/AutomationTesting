# CatalystRight — Web (Next.js 15)

## Layout

```
src/
├── app/                        # App Router
│   ├── layout.tsx              # Root shell
│   ├── page.tsx                # Command Center (dashboard)
│   ├── scenarios/              # Scenario library + builder
│   │   └── new/page.tsx        # Plain-English scenario composer
│   ├── runs/                   # Active runs + run detail
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── layout.tsx      # Summary bar + tabs
│   │       ├── page.tsx        # Live execution
│   │       ├── graph/
│   │       ├── console/
│   │       └── evidence/
│   ├── history/
│   ├── environments/
│   ├── library/                # Oracle action library
│   ├── settings/
│   ├── graph/                  # Standalone graph preview
│   ├── evidence/               # Redirect helper
│   └── ai-console/             # Redirect helper
├── components/
│   ├── shell/                  # Sidebar, top bar, page header
│   ├── ui/                     # Panel, button, status pill, metric, badge, kbd
│   ├── dashboard/              # Trend chart, module distribution
│   ├── runs/                   # Run row, summary bar, tabs, live execution view
│   ├── scenarios/              # Scenario builder composer
│   └── graph/                  # React Flow graph + custom process node
└── lib/
    ├── api.ts                  # REST client (mock fallback)
    ├── mock-data.ts            # Rich enterprise demo data
    ├── store.ts                # Zustand (UI, environment)
    ├── types.ts                # Shared domain types
    └── utils.ts                # cn, formatDuration, relativeTime
```

## Scripts

```bash
pnpm install        # or npm / yarn
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck
```

## Environment

```
NEXT_PUBLIC_API_URL=http://localhost:8000   # optional — UI falls back to mock data
```

## Design principles

See [`../docs/DESIGN_SYSTEM.md`](../docs/DESIGN_SYSTEM.md) — the UI intentionally avoids
chat-style surfaces and emphasises execution, observability, and evidence.
