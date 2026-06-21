"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import SettingsModal from "@/components/settings/settings-modal";

export type SettingsPageId =
  | "organization"
  | "members"
  | "billing-usage"
  | "profile"
  | "preferences"
  | "appearance"
  | "api-keys"
  | "projects"
  | "model-providers"
  | "alerts"
  | "data-privacy"
  | "integrations"
  | "security"
  | "advanced";

export const DEFAULT_SETTINGS_PAGE: SettingsPageId = "organization";

type SettingsContextType = {
  isOpen: boolean;
  activePage: SettingsPageId;
  openSettings: (pageId?: SettingsPageId) => void;
  closeSettings: () => void;
  setActivePage: (pageId: SettingsPageId) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState<SettingsPageId>(DEFAULT_SETTINGS_PAGE);

  const openSettings = useCallback((pageId?: SettingsPageId) => {
    if (pageId) setActivePage(pageId);
    setIsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ isOpen, activePage, openSettings, closeSettings, setActivePage }}
    >
      {children}
      <SettingsModal
        isOpen={isOpen}
        activePage={activePage}
        onActivePageChange={setActivePage}
        onClose={closeSettings}
      />
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
