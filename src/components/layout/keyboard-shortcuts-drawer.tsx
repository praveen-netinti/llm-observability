"use client";

import { SHORTCUTS, SHORTCUT_GROUPS } from "@/config/shortcuts";
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
            {SHORTCUT_GROUPS.map((group) => {
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
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
