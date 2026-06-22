"use client";

import { SHORTCUTS, SHORTCUT_GROUPS, SLASH_COMMANDS, MARKDOWN_SHORTCUTS } from "@/config/shortcuts";
import { ShortcutKbd } from "@/components/ui/shortcut-kbd";
import * as Drawer from "@/components/ui/drawer";

export function KeyboardShortcutsDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Content className="max-w-sm">
        <Drawer.Header className="border-b border-stroke-soft-200 pb-4">
          <Drawer.Title>Keyboard Shortcuts</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="overflow-y-auto p-5">
          <div className="space-y-6">
            {SHORTCUT_GROUPS.filter((g) => g !== "Editor").map((group) => {
              const items = SHORTCUTS.filter((s) => s.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <h3 className="text-text-sub-600 text-xs font-medium uppercase mb-2">
                    {group}
                  </h3>
                  <div className="space-y-0.5">
                    {items.map((shortcut) => (
                      <div
                        key={shortcut.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-bg-weak-50"
                      >
                        <span className="text-text-strong-950 text-[13px]">
                          {shortcut.label}
                        </span>
                        <ShortcutKbd keys={shortcut.keys} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Slash Commands */}
            <div>
              <h3 className="text-text-sub-600 text-xs font-medium uppercase mb-2">
                Slash Commands
              </h3>
              <p className="text-text-soft-400 text-xs mb-2">
                Type <kbd className="bg-bg-soft-200 rounded px-1 font-mono">/</kbd> in the editor to trigger
              </p>
              <div className="space-y-0.5">
                {SLASH_COMMANDS.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-bg-weak-50"
                  >
                    <span className="text-text-strong-950 text-[13px]">
                      {cmd.label}
                    </span>
                    <span className="text-2xs text-text-soft-400 font-mono">
                      /{cmd.label.toLowerCase().replace(/\s/g, "-")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Markdown Formatting */}
            <div>
              <h3 className="text-text-sub-600 text-xs font-medium uppercase mb-2">
                Markdown Formatting
              </h3>
              <div className="space-y-0.5">
                {MARKDOWN_SHORTCUTS.map((md) => (
                  <div
                    key={md.syntax}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-bg-weak-50"
                  >
                    <span className="text-text-strong-950 text-[13px]">
                      {md.label}
                    </span>
                    <code className="text-2xs text-text-soft-400 font-mono rounded px-1.5">
                      {md.syntax}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
