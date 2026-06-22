"use client";

import React from "react";
import { RiEqualizerLine } from "@remixicon/react";
import type { Table } from "@tanstack/react-table";

import { cn } from "@/utils";

import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as Dropdown from "@/components/ui/dropdown";
import * as Select from "@/components/ui/select";

export type TracesGrouping = "none" | "status" | "environment";

const GROUPING_OPTIONS: { value: TracesGrouping; label: string }[] = [
  { value: "none", label: "No grouping" },
  { value: "status", label: "Status" },
  { value: "environment", label: "Environment" },
];

/** Column ids the user can show/hide (status/name stay fixed). */
export type TracesProperty = { id: string; label: string };

type Props<TData> = {
  table: Table<TData>;
  grouping: TracesGrouping;
  onGroupingChange: (g: TracesGrouping) => void;
  properties: TracesProperty[];
};

export function TracesDisplayOptions<TData>({
  table,
  grouping,
  onGroupingChange,
  properties,
}: Props<TData>) {
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
          <span className='sr-only'>Display options</span>
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align='end' className='w-64 pb-0'>
        {/* Grouping */}
        <div className='flex items-center justify-between px-4 py-2.5'>
          <span className='text-text-sub-600 text-[13px] font-medium'>Grouping</span>
          <Select.Root
            size='xxsmall'
            variant='compactForInput'
            value={grouping}
            onValueChange={(v) => onGroupingChange(v as TracesGrouping)}
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
          <div className='text-text-sub-600 flex h-7.5 items-center text-xs font-medium'>
            Display properties
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {properties.map((prop) => {
              const column = table.getColumn(prop.id);
              if (!column) return null;
              const isVisible = column.getIsVisible();
              return (
                <button
                  key={prop.id}
                  onClick={() => column.toggleVisibility(!isVisible)}
                  className={cn(
                    "h-6 rounded-full px-2 text-[11px] font-medium ring-1 transition-colors ring-inset",
                    isVisible
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
