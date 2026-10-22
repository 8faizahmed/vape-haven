"use client";

import { create } from "zustand";

type Panel = "menu" | "search";

/** Which site-wide panel is open, so the header and the mobile tab bar can share triggers. */
export const useUI = create<{
  panel: Panel | null;
  openPanel: (panel: Panel) => void;
  closePanel: () => void;
}>()((set) => ({
  panel: null,
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),
}));
