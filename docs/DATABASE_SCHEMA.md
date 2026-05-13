# CatalystRight — Database Schema

PostgreSQL 16. All tables include `tenant_id`, `created_at`, `updated_at`. UUID primary keys.

## Entity Overview

```
tenant ─┬─ user
        ├─ oracle_environment ─┬─ business_unit
        │                      ├─ ledger
        │                      ├─ legal_entity
        │                      ├─ supplier
        │                      └─ customer
        ├─ scenario ──────────── scenario_template
        └─ run ─┬─ run_step
                ├─ run_event
                ├─ evidence
                ├─ ai_call
                └─ validation
```

## DDL

```sql
-- =========================================================================
-- Tenancy & identity
-- =========================================================================
create table tenant (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table app_user (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  email           citext not null,
  display_name    text not null,
  role            text not null check (role in ('admin','author','operator','viewer')),
  created_at      timestamptz not null default now(),
  unique (tenant_id, email)
);

-- =========================================================================
-- Oracle Fusion metadata
-- =========================================================================
create table oracle_environment (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  name            text not null,               -- e.g. "Vision DEV", "Vision UAT"
  pod_url         text not null,
  env_type        text not null check (env_type in ('DEV','TEST','UAT','PROD')),
  vault_ref       text not null,               -- secret reference, not the credential
  created_at      timestamptz not null default now()
);

create table business_unit (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  environment_id  uuid not null references oracle_environment(id) on delete cascade,
  code            text not null,
  name            text not null,
  country         text,
  unique (environment_id, code)
);

create table ledger (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  environment_id  uuid not null references oracle_environment(id) on delete cascade,
  name            text not null,
  currency        text not null
);

create table legal_entity (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  environment_id  uuid not null references oracle_environment(id) on delete cascade,
  name            text not null,
  country         text
);

create table supplier (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  environment_id  uuid not null references oracle_environment(id) on delete cascade,
  number          text not null,
  name            text not null,
  unique (environment_id, number)
);

create table customer (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  environment_id  uuid not null references oracle_environment(id) on delete cascade,
  number          text not null,
  name            text not null,
  unique (environment_id, number)
);

-- =========================================================================
-- Scenarios
-- =========================================================================
create table scenario_template (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  module          text not null,               -- P2P, O2C, R2R, H2R, etc.
  name            text not null,
  description     text,
  prompt          text not null,               -- canonical plain-English template
  variables       jsonb not null default '{}'::jsonb
);

create table scenario (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  author_id       uuid references app_user(id),
  title           text not null,
  module          text not null,
  prompt          text not null,               -- raw plain-English input
  metadata        jsonb not null default '{}'::jsonb,  -- BU, ledger, supplier, env refs
  intent          jsonb,                       -- parsed intent JSON (AI output)
  template_id     uuid references scenario_template(id),
  created_at      timestamptz not null default now()
);

-- =========================================================================
-- Runs & steps
-- =========================================================================
create type run_status as enum ('DRAFT','PLANNED','RUNNING','PASSED','FAILED','ABORTED');
create type step_status as enum ('PENDING','RUNNING','PASSED','FAILED','SKIPPED','RETRYING');

create table run (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  scenario_id     uuid not null references scenario(id) on delete cascade,
  environment_id  uuid not null references oracle_environment(id),
  triggered_by    uuid references app_user(id),
  status          run_status not null default 'DRAFT',
  process_graph   jsonb not null,               -- planner output
  started_at      timestamptz,
  finished_at     timestamptz,
  confidence      numeric(4,3),
  summary         text,
  created_at      timestamptz not null default now()
);

create table run_step (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references run(id) on delete cascade,
  node_id         text not null,                -- id within process_graph
  name            text not null,
  oracle_action   text not null,                -- e.g. "ap.createInvoice"
  depends_on      text[] not null default '{}',
  status          step_status not null default 'PENDING',
  attempt         int not null default 0,
  started_at      timestamptz,
  finished_at     timestamptz,
  input           jsonb not null default '{}'::jsonb,
  output          jsonb,
  error           jsonb
);

create index on run_step (run_id, status);

-- =========================================================================
-- Events (append-only)
-- =========================================================================
create table run_event (
  id              bigserial primary key,
  run_id          uuid not null references run(id) on delete cascade,
  step_id         uuid references run_step(id) on delete cascade,
  ts              timestamptz not null default now(),
  level           text not null check (level in ('DEBUG','INFO','WARN','ERROR')),
  source          text not null check (source in ('AI','EXEC','SYSTEM','VALIDATOR')),
  message         text not null,
  payload         jsonb
);

create index on run_event (run_id, ts);

-- =========================================================================
-- Evidence
-- =========================================================================
create table evidence (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references run(id) on delete cascade,
  step_id         uuid references run_step(id) on delete cascade,
  kind            text not null check (kind in ('screenshot','har','dom','transaction_id','value')),
  oracle_tx_id    text,                          -- e.g. requisition number, PO number, invoice number
  object_key      text,                          -- S3/MinIO key
  mime            text,
  metadata        jsonb not null default '{}'::jsonb,
  captured_at     timestamptz not null default now()
);

create index on evidence (run_id, kind);

-- =========================================================================
-- AI calls & validations
-- =========================================================================
create table ai_call (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid references run(id) on delete cascade,
  step_id         uuid references run_step(id) on delete cascade,
  phase           text not null check (phase in ('intent','plan','recover','validate','summarize')),
  provider        text not null,
  model           text not null,
  prompt_tokens   int not null default 0,
  completion_tokens int not null default 0,
  latency_ms      int not null default 0,
  confidence      numeric(4,3),
  request         jsonb,
  response        jsonb,
  created_at      timestamptz not null default now()
);

create table validation (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references run(id) on delete cascade,
  step_id         uuid references run_step(id) on delete cascade,
  check_name      text not null,                -- e.g. "Invoice matches PO amount"
  expected        jsonb,
  actual          jsonb,
  passed          boolean not null,
  reasoning       text,
  created_at      timestamptz not null default now()
);
```

## Read Models / Views

```sql
create view v_run_summary as
select r.id,
       s.title as scenario_title,
       s.module,
       r.status,
       r.started_at,
       r.finished_at,
       extract(epoch from (r.finished_at - r.started_at))::int as duration_s,
       r.confidence,
       (select count(*) from run_step rs where rs.run_id = r.id) as total_steps,
       (select count(*) from run_step rs where rs.run_id = r.id and rs.status = 'PASSED') as passed_steps,
       (select count(*) from run_step rs where rs.run_id = r.id and rs.status = 'FAILED') as failed_steps
from run r
join scenario s on s.id = r.scenario_id;
```
