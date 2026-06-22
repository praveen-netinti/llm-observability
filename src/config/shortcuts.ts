import type { Hotkey } from "@tanstack/react-hotkeys";

export type ShortcutDef = {
  id: string;
  label: string;
  /** Single hotkey string, sequence array, or display-only string for non-standard combos */
  keys: Hotkey | Hotkey[] | string;
  group: ShortcutGroup;
};

export type ShortcutGroup =
  | "General"
  | "Navigation"
  | "List & Board"
  | "Trace Detail"
  | "Issue Detail";

export const SHORTCUTS: ShortcutDef[] = [
  // ─── General ───────────────────────────────────────────────
  { id: "command-menu", label: "Open command menu", keys: "Mod+K", group: "General" },
  { id: "search", label: "Open search", keys: "/", group: "General" },
  { id: "shortcuts-drawer", label: "View keyboard shortcuts", keys: "Mod+/", group: "General" },
  { id: "help", label: "Open help center", keys: "Shift+/", group: "General" },
  { id: "settings", label: "Open settings", keys: ["G", "S"], group: "General" },
  { id: "toggle-theme", label: "Toggle dark mode", keys: "Mod+Shift+L", group: "General" },

  // ─── Navigation ────────────────────────────────────────────
  { id: "nav-dashboard", label: "Go to Dashboard", keys: ["G", "D"], group: "Navigation" },
  { id: "nav-traces", label: "Go to Traces", keys: ["G", "T"], group: "Navigation" },
  { id: "nav-issues", label: "Go to Issues", keys: ["G", "I"], group: "Navigation" },
  { id: "nav-alerts", label: "Go to Alerts", keys: ["G", "A"], group: "Navigation" },
  { id: "toggle-sidebar", label: "Toggle left sidebar", keys: "[", group: "Navigation" },

  // ─── List & Board ──────────────────────────────────────────
  { id: "move-down", label: "Move down", keys: "J", group: "List & Board" },
  { id: "move-up", label: "Move up", keys: "K", group: "List & Board" },
  { id: "select-item", label: "Select item", keys: "X", group: "List & Board" },
  { id: "select-all", label: "Select all", keys: "Mod+A", group: "List & Board" },
  { id: "clear-selection", label: "Clear selection", keys: "Escape", group: "List & Board" },
  { id: "open-item", label: "Open focused item", keys: "Enter", group: "List & Board" },
  { id: "toggle-view", label: "Toggle list/board view", keys: "Mod+B", group: "List & Board" },

  // ─── Trace Detail ──────────────────────────────────────────
  { id: "trace-close", label: "Close panel", keys: "Escape", group: "Trace Detail" },
  { id: "trace-prev", label: "Previous trace", keys: "K", group: "Trace Detail" },
  { id: "trace-next", label: "Next trace", keys: "J", group: "Trace Detail" },
  { id: "trace-copy-id", label: "Copy trace ID", keys: "Mod+.", group: "Trace Detail" },

  // ─── Issue Detail ──────────────────────────────────────────
  { id: "issue-prev", label: "Previous issue", keys: "K", group: "Issue Detail" },
  { id: "issue-next", label: "Next issue", keys: "J", group: "Issue Detail" },
  { id: "issue-copy-id", label: "Copy issue ID", keys: "Mod+.", group: "Issue Detail" },
  { id: "issue-copy-url", label: "Copy issue URL", keys: "Mod+Shift+/", group: "Issue Detail" },
];

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  "General",
  "Navigation",
  "List & Board",
  "Trace Detail",
  "Issue Detail",
];

/** Look up a shortcut definition by id */
export function getShortcut(id: string): ShortcutDef | undefined {
  return SHORTCUTS.find((s) => s.id === id);
}
