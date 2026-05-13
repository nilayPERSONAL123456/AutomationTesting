// Thin client for the FastAPI backend. When the backend is not available the
// client transparently falls back to the in-memory mock dataset so the UI can
// be demoed standalone.

import {
  runs as mockRuns,
  scenarios as mockScenarios,
  scenarioTemplates as mockTemplates,
  dashboardKpis,
  successTrend,
  moduleDistribution,
  businessUnits,
  suppliers,
  customers,
  ledgers,
  environments,
} from "./mock-data";
import type { Run, Scenario, ScenarioTemplate } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function tryFetch<T>(path: string, fallback: T): Promise<T> {
  if (!BASE) return fallback;
  try {
    const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const api = {
  runs: {
    list: () => tryFetch<Run[]>("/api/runs", mockRuns),
    get: async (id: string) =>
      tryFetch<Run>(`/api/runs/${id}`, mockRuns.find((r) => r.id === id) ?? mockRuns[0]),
  },
  scenarios: {
    list: () => tryFetch<Scenario[]>("/api/scenarios", mockScenarios),
    templates: () =>
      tryFetch<ScenarioTemplate[]>("/api/scenarios/templates", mockTemplates),
  },
  metadata: {
    environments: () => tryFetch("/api/metadata/environments", environments),
    businessUnits: () => tryFetch("/api/metadata/business-units", businessUnits),
    suppliers: () => tryFetch("/api/metadata/suppliers", suppliers),
    customers: () => tryFetch("/api/metadata/customers", customers),
    ledgers: () => tryFetch("/api/metadata/ledgers", ledgers),
  },
  dashboard: {
    kpis: () => tryFetch("/api/dashboard/kpis", dashboardKpis),
    trend: () => tryFetch("/api/dashboard/trend", successTrend),
    modules: () => tryFetch("/api/dashboard/modules", moduleDistribution),
  },
};
