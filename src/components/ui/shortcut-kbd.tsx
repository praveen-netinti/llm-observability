"use client";

import { useEffect, useState } from "react";
import { detectPlatform, formatForDisplay } from "@tanstack/react-hotkeys";

import { cn } from "@/utils/cn";

/**
 * Renders a platform-aware keyboard shortcut badge.
 * Hydration-safe: renders nothing on the server, then mounts with the detected platform.
 */
export function ShortcutKbd({
  keys,
  className,
}: {
  keys: string | string[];
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isSequence = Array.isArray(keys);
  const display = isSequence
    ? (keys as string[]).map((k) => formatForDisplay(k)).join(" then ")
    : formatForDisplay(keys);

  return (
    <kbd
      className={cn(
        "text-2xs text-text-soft-400 ml-auto whitespace-nowrap font-mono",
        className,
      )}
    >
      {display}
    </kbd>
  );
}

/** Returns the platform string for conditional rendering */
export function usePlatform() {
  const [platform, setPlatform] = useState<"mac" | "windows" | "linux">("mac");
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setPlatform(detectPlatform()), []);
  return platform;
}
