"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/utils/cn";

type TabsVariant = "default" | "underline";

function SegmentedControl({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={cn("orientation-vertical:flex-row flex flex-col gap-2", className)}
      data-slot='tabs'
      {...props}
    />
  );
}

function SegmentedControlList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        "relative z-0 flex w-fit items-center justify-center gap-x-0.5",
        "orientation-vertical:flex-col",
        variant === "default"
          ? "bg-bg-weak-50 text-text-white-0 rounded-lg p-0.5"
          : "orientation-vertical:px-1 orientation-horizontal:py-1 *:data-[slot=tabs-tab]:hover:bg-bg-weak-50",
        className,
      )}
      data-slot='tabs-list'
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        className={cn(
          "absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out",
          variant === "underline"
            ? "orientation-vertical:-translate-x-px bg-primary-base orientation-horizontal:h-0.5 orientation-vertical:w-0.5 orientation-horizontal:translate-y-px z-10"
            : "bg-bg-white-0 -z-1 rounded-lg shadow-sm/5",
        )}
        style={
          {
            "--active-tab-height": "24px",
            "--active-tab-bottom": "2px",
          } as React.CSSProperties
        }
        data-slot='tab-indicator'
      />
    </TabsPrimitive.List>
  );
}

function SegmentedControlTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "text-text-sub-600 focus-visible:ring-stroke-strong-950 orientation-vertical:w-full orientation-vertical:justify-start data-active:text-text-strong-950 relative flex h-10 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-3 text-xs! font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 data-disabled:pointer-events-none data-disabled:opacity-64 sm:h-8 sm:text-sm [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot='tabs-tab'
      {...props}
    />
  );
}

function SegmentedControlPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 outline-none", className)}
      data-slot='tabs-content'
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedControlList, SegmentedControlTab, SegmentedControlPanel };
