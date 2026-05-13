"use client";

import { create } from "zustand";
import type { OracleEnvironment } from "./types";
import { environments } from "./mock-data";

// ---------- UI Store ----------
interface UIState {
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUI = create<UIState>((set) => ({
  commandOpen: false,
  setCommandOpen: (v) => set({ commandOpen: v }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));

// ---------- Environment Store ----------
interface EnvState {
  active: OracleEnvironment;
  setActive: (env: OracleEnvironment) => void;
  list: OracleEnvironment[];
}

export const useEnvironment = create<EnvState>((set) => ({
  active: environments[2], // UAT by default
  setActive: (env) => set({ active: env }),
  list: environments,
}));
