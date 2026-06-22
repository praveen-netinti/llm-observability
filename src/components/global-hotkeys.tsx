"use client";

import { useHotkey, useHotkeySequence } from "@tanstack/react-hotkeys";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { useSidebar } from "@/contexts/sidebar-context";
import { useSettings } from "@/contexts/settings-context";
import { useShortcuts } from "@/contexts/shortcuts-context";

/**
 * Registers all global keyboard shortcuts.
 * Mounted once in the (main) layout — renders nothing.
 */
export function GlobalHotkeys() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { openSettings } = useSettings();
  const { toggleShortcuts } = useShortcuts();
  const { theme, setTheme } = useTheme();

  // ─── General ─────────────────────────────────────────────
  useHotkey("Mod+/", () => toggleShortcuts());
  useHotkey("Mod+Shift+L", () => setTheme(theme === "light" ? "dark" : "light"));

  // ─── Navigation ──────────────────────────────────────────
  useHotkey("[", () => toggleSidebar?.(), { preventDefault: false });
  useHotkeySequence(["G", "D"], () => router.push("/"));
  useHotkeySequence(["G", "T"], () => router.push("/traces"));
  useHotkeySequence(["G", "I"], () => router.push("/issues"));
  useHotkeySequence(["G", "A"], () => router.push("/alerts"));
  useHotkeySequence(["G", "S"], () => openSettings());

  return null;
}
