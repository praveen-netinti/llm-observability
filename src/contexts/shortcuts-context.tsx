"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { KeyboardShortcutsDrawer } from "@/components/layout/keyboard-shortcuts-drawer";

type ShortcutsContextType = {
  isOpen: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;
};

const ShortcutsContext = createContext<ShortcutsContextType | null>(null);

export function ShortcutsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openShortcuts = useCallback(() => setIsOpen(true), []);
  const closeShortcuts = useCallback(() => setIsOpen(false), []);
  const toggleShortcuts = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <ShortcutsContext.Provider value={{ isOpen, openShortcuts, closeShortcuts, toggleShortcuts }}>
      {children}
      <KeyboardShortcutsDrawer open={isOpen} onOpenChange={setIsOpen} />
    </ShortcutsContext.Provider>
  );
}

export function useShortcuts() {
  const ctx = useContext(ShortcutsContext);
  if (!ctx) throw new Error("useShortcuts must be used within ShortcutsProvider");
  return ctx;
}
