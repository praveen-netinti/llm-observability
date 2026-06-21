"use client";

import { RiEqualizerLine } from "@remixicon/react";

import { cn } from "@/utils";

import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as Dropdown from "@/components/ui/dropdown";
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
};

export function IssuesDisplayOptions({ display, onChange }: Props) {
  const toggleProperty = (prop: DisplayProperty) => {
    onChange((prev) => ({
      ...prev,
      visibleProperties: prev.visibleProperties.includes(prop)
        ? prev.visibleProperties.filter((p) => p !== prop)
        : [...prev.visibleProperties, prop],
    }));
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xxsmall'
          className='border-stroke-soft-200 hover:bg-bg-soft-200 size-7 rounded-full border bg-transparent shadow-none ring-0'
        >
          <Button.Icon as={RiEqualizerLine} className='size-3.5' />
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align='end' className='w-64 pb-0'>
        <div className='p-4 py-2'>
          <div className='flex gap-2'>
            <Button.Root
              size='xxsmall'
              className={cn(
                "text-text-sub-600 hover:ring-stroke-soft-200 w-full rounded-full px-2.5 text-xs shadow-none!",
                display.view === "list" && "bg-bg-weak-50 text-text-strong-950",
              )}
              variant='neutral'
              mode='stroke'
              onClick={() => onChange((prev) => ({ ...prev, view: "list" as "list" | "board" }))}
            >
              List
            </Button.Root>
            <Button.Root
              size='xxsmall'
              className={cn(
                "text-text-sub-600 hover:ring-stroke-soft-200 w-full rounded-full px-2.5 text-xs shadow-none!",
                display.view === "board" && "bg-bg-weak-50 text-text-strong-950",
              )}
              variant='neutral'
              mode='stroke'
              onClick={() => onChange((prev) => ({ ...prev, view: "board" as "list" | "board" }))}
            >
              Board
            </Button.Root>
          </div>
        </div>

        <Divider.Root variant='line-spacing' className='py-0' />

        {/* Grouping */}
        <div className='flex items-center justify-between px-4 py-2.5'>
          <span className='text-text-sub-600 text-[13px] font-medium'>Grouping</span>
          <Select.Root
            size='xxsmall'
            variant='compactForInput'
            value={display.grouping}
            onValueChange={(v) => onChange((prev) => ({ ...prev, grouping: v as GroupingOption }))}
          >
            <Select.Trigger className='border-stroke-soft-200! h-7 w-28 rounded-lg border px-2 text-xs'>
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

        <Divider.Root variant='line-spacing' className='py-0' />

        <div className='p-4'>
          <div className='text-text-strong-950 flex h-6 items-center text-xs font-medium capitalize'>
            {display.view} options
          </div>

          {/* Show empty groups Toogle */}
          <div
            role='button'
            onClick={(e) => {
              e.preventDefault();
              onChange((prev) => ({ ...prev, showEmptyGroups: !prev.showEmptyGroups }));
            }}
            className='flex h-8 items-center'
          >
            <span className='text-text-sub-600 text-xs'>Show empty groups</span>
            <span className='flex-1' />
            <Switch.Root
              checked={display.showEmptyGroups}
              onCheckedChange={(v) => onChange((prev) => ({ ...prev, showEmptyGroups: !!v }))}
            />
          </div>

          <div
            role='button'
            className='flex h-8 items-center'
            onClick={(e) => {
              e.preventDefault();
              onChange((prev) => ({ ...prev, nestedSubIssues: !prev.nestedSubIssues }));
            }}
          >
            <span className='text-text-sub-600 text-xs'>Nested sub-issues</span>
            <span className='flex-1' />
            <Switch.Root
              checked={display.nestedSubIssues}
              onCheckedChange={(v) => onChange((prev) => ({ ...prev, nestedSubIssues: !!v }))}
            />
          </div>

          <div className='text-text-sub-600 flex h-7.5 items-center text-xs font-medium'>
            Display properties
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {DISPLAY_PROPERTIES.map((prop) => {
              const isSelected = display.visibleProperties.includes(prop.value);
              return (
                <button
                  key={prop.value}
                  onClick={() => toggleProperty(prop.value)}
                  className={cn(
                    "h-6 rounded-full px-2 text-[11px] font-medium ring-1 transition-colors ring-inset",
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
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
