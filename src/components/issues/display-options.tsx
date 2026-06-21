"use client";

import { RiEqualizerLine } from "@remixicon/react";

import { cn } from "@/utils";

import * as Button from "@/components/ui/button";
import * as Popover from "@/components/ui/popover";
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTab,
} from "@/components/ui/segmented-control";
import * as Select from "@/components/ui/select";
import * as Switch from "@/components/ui/switch";

export type DisplayProperty =
  | "id"
  | "status"
  | "assignee"
  | "priority"
  | "labels"
  | "created"
  | "updated";

export type GroupingOption = "none" | "status" | "assignee" | "priority" | "label" | "project";

export type DisplayState = {
  view: "list" | "board";
  grouping: GroupingOption;
  showEmptyGroups: boolean;
  nestedSubIssues: boolean;
  visibleProperties: DisplayProperty[];
};

const GROUPING_OPTIONS: { value: GroupingOption; label: string }[] = [
  { value: "none", label: "No grouping" },
  { value: "status", label: "Status" },
  { value: "assignee", label: "Assignee" },
  { value: "priority", label: "Priority" },
  { value: "label", label: "Label" },
  { value: "project", label: "Project" },
];

const DISPLAY_PROPERTIES: { value: DisplayProperty; label: string }[] = [
  { value: "id", label: "ID" },
  { value: "status", label: "Status" },
  { value: "assignee", label: "Assignee" },
  { value: "priority", label: "Priority" },
  { value: "labels", label: "Labels" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
];

type Props = {
  display: DisplayState;
  onChange: (d: DisplayState | ((prev: DisplayState) => DisplayState)) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IssuesDisplayOptions({ display, onChange, open, onOpenChange }: Props) {
  const toggleProperty = (prop: DisplayProperty) => {
    onChange((prev) => ({
      ...prev,
      visibleProperties: prev.visibleProperties.includes(prop)
        ? prev.visibleProperties.filter((p) => p !== prop)
        : [...prev.visibleProperties, prop],
    }));
  };

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xxsmall'
          className='size-7 gap-1.5 rounded-full'
        >
          <Button.Icon as={RiEqualizerLine} className='size-3.5' />
          <span className='sr-only'>Display</span>
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align='end' sideOffset={8} showArrow={false} className='w-72 rounded-xl p-0'>
        <div className='divide-stroke-soft-200 flex flex-col divide-y'>
          {/* View toggle */}
          <div className='flex items-center justify-between p-3'>
            <span className='text-label-xs text-text-sub-600'>View</span>
            <SegmentedControl
              value={display.view}
              onValueChange={(v) => onChange((prev) => ({ ...prev, view: v as "list" | "board" }))}
            >
              <SegmentedControlList className='h-7'>
                <SegmentedControlTab value='list' className='px-2.5 text-[11px]'>
                  List
                </SegmentedControlTab>
                <SegmentedControlTab value='board' className='px-2.5 text-[11px]'>
                  Board
                </SegmentedControlTab>
              </SegmentedControlList>
            </SegmentedControl>
          </div>

          {/* Grouping */}
          <div className='flex items-center justify-between p-3'>
            <span className='text-label-xs text-text-sub-600'>Grouping</span>
            <Select.Root
              size='xxsmall'
              value={display.grouping}
              onValueChange={(v) =>
                onChange((prev) => ({ ...prev, grouping: v as GroupingOption }))
              }
            >
              <Select.Trigger className='w-32'>
                <Select.Value />
              </Select.Trigger>
              <Select.Content align='end'>
                {GROUPING_OPTIONS.map((o) => (
                  <Select.Item key={o.value} value={o.value}>
                    {o.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          {/* List options */}
          <div className='space-y-3 p-3'>
            <span className='text-label-xs text-text-sub-600'>List options</span>

            <label className='flex items-center justify-between'>
              <span className='text-paragraph-xs text-text-sub-600'>Show empty groups</span>
              <Switch.Root
                checked={display.showEmptyGroups}
                onCheckedChange={(v) => onChange((prev) => ({ ...prev, showEmptyGroups: !!v }))}
              />
            </label>

            <label className='flex items-center justify-between'>
              <span className='text-paragraph-xs text-text-sub-600'>Nested sub-issues</span>
              <Switch.Root
                checked={display.nestedSubIssues}
                onCheckedChange={(v) => onChange((prev) => ({ ...prev, nestedSubIssues: !!v }))}
              />
            </label>
          </div>

          {/* Display properties */}
          <div className='space-y-2 p-3'>
            <span className='text-label-xs text-text-sub-600'>Display properties</span>
            <div className='flex flex-wrap gap-1.5'>
              {DISPLAY_PROPERTIES.map((prop) => {
                const isSelected = display.visibleProperties.includes(prop.value);
                return (
                  <button
                    key={prop.value}
                    onClick={() => toggleProperty(prop.value)}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 transition-colors ring-inset",
                      isSelected
                        ? "bg-bg-weak-25 text-text-strong-950 ring-stroke-soft-200"
                        : "bg-bg-white-0 text-text-soft-400 ring-stroke-soft-200 hover:text-text-sub-600",
                    )}
                  >
                    {prop.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
