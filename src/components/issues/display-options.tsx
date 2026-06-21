"use client";

import React from "react";
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

function IconListView(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M1 1.8c0-.28 0-.42.054-.527a.5.5 0 0 1 .219-.218C1.38 1 1.52 1 1.8 1h12.4c.28 0 .42 0 .527.054a.5.5 0 0 1 .218.219C15 1.38 15 1.52 15 1.8v.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.219C14.62 3 14.48 3 14.2 3H1.8c-.28 0-.42 0-.527-.054a.5.5 0 0 1-.218-.219C1 2.62 1 2.48 1 2.2v-.4ZM1 13.8c0-.28 0-.42.054-.527a.5.5 0 0 1 .219-.218C1.38 13 1.52 13 1.8 13h12.4c.28 0 .42 0 .527.055a.5.5 0 0 1 .218.218c.055.107.055.247.055.527v.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.218C14.62 15 14.48 15 14.2 15H1.8c-.28 0-.42 0-.527-.055a.5.5 0 0 1-.218-.218C1 14.62 1 14.48 1 14.2v-.4ZM1 9.8c0-.28 0-.42.054-.527a.5.5 0 0 1 .219-.218C1.38 9 1.52 9 1.8 9h12.4c.28 0 .42 0 .527.055a.5.5 0 0 1 .218.218C15 9.38 15 9.52 15 9.8v.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.218C14.62 11 14.48 11 14.2 11H1.8c-.28 0-.42 0-.527-.055a.5.5 0 0 1-.218-.218C1 10.62 1 10.48 1 10.2v-.4ZM1 5.8c0-.28 0-.42.054-.527a.5.5 0 0 1 .219-.218C1.38 5 1.52 5 1.8 5h12.4c.28 0 .42 0 .527.054a.5.5 0 0 1 .218.219C15 5.38 15 5.52 15 5.8v.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.218C14.62 7 14.48 7 14.2 7H1.8c-.28 0-.42 0-.527-.054a.5.5 0 0 1-.218-.219C1 6.62 1 6.48 1 6.2v-.4Z' />
    </svg>
  );
}

function IconBoardView(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M1 2.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C1.76 1 2.04 1 2.6 1h2.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C7 1.76 7 2.04 7 2.6v.8c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C6.24 5 5.96 5 5.4 5H2.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C1 4.24 1 3.96 1 3.4v-.8ZM9 2.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C9.76 1 10.04 1 10.6 1h2.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C15 1.76 15 2.04 15 2.6v.8c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C14.24 5 13.96 5 13.4 5h-2.8c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C9 4.24 9 3.96 9 3.4v-.8ZM1 7.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C1.76 6 2.04 6 2.6 6h2.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C7 6.76 7 7.04 7 7.6v.8c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C6.24 10 5.96 10 5.4 10H2.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C1 9.24 1 8.96 1 8.4v-.8ZM9 7.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C9.76 6 10.04 6 10.6 6h2.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C15 6.76 15 7.04 15 7.6v.8c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C14.24 10 13.96 10 13.4 10h-2.8c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C9 9.24 9 8.96 9 8.4v-.8ZM1 12.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C1.76 11 2.04 11 2.6 11h2.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C7 11.76 7 12.04 7 12.6v.8c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C6.24 15 5.96 15 5.4 15H2.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C1 14.24 1 13.96 1 13.4v-.8ZM9 12.6c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C9.76 11 10.04 11 10.6 11h2.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C15 11.76 15 12.04 15 12.6v.8c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C14.24 15 13.96 15 13.4 15h-2.8c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C9 14.24 9 13.96 9 13.4v-.8Z' />
    </svg>
  );
}

export type DisplayProperty =
  | "id"
  | "status"
  | "assignee"
  | "priority"
  | "labels"
  | "trace-id"
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
  { value: "trace-id", label: "Trace ID" },
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
                "text-text-sub-600 hover:ring-stroke-soft-200 w-full gap-1.5 rounded-full px-2.5 text-xs shadow-none!",
                display.view === "list" && "bg-bg-weak-50 text-text-strong-950",
              )}
              variant='neutral'
              mode='stroke'
              onClick={() => onChange((prev) => ({ ...prev, view: "list" as "list" | "board" }))}
            >
              <IconListView className='size-3.5' />
              List
            </Button.Root>
            <Button.Root
              size='xxsmall'
              className={cn(
                "text-text-sub-600 hover:ring-stroke-soft-200 w-full gap-1.5 rounded-full px-2.5 text-xs shadow-none!",
                display.view === "board" && "bg-bg-weak-50 text-text-strong-950",
              )}
              variant='neutral'
              mode='stroke'
              onClick={() => onChange((prev) => ({ ...prev, view: "board" as "list" | "board" }))}
            >
              <IconBoardView className='size-3.5' />
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
