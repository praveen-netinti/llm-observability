"use client";

import * as React from "react";
import { RiFilter3Line } from "@remixicon/react";

import { cn } from "@/utils/cn";

import * as Button from "@/components/ui/button";
import * as Checkbox from "@/components/ui/checkbox";
import * as Dropdown from "@/components/ui/dropdown";

export type FilterOption = { value: string; label: string };

export type FilterField = {
  id: string;
  label: string;
  icon?: React.ElementType;
  /** "multi" renders checkboxes; "single" behaves like a radio (one value). */
  type: "multi" | "single";
  options: FilterOption[];
};

/** Selected values keyed by field id. */
export type FilterValue = Record<string, string[]>;

type Props = {
  fields: FilterField[];
  value: FilterValue;
  onChange: (next: FilterValue) => void;
  /** Optional custom trigger; defaults to the round icon button used elsewhere. */
  trigger?: React.ReactNode;
};

export function countActiveFilters(value: FilterValue): number {
  return Object.values(value).reduce((sum, vals) => sum + vals.length, 0);
}

export function DataTableFilter({ fields, value, onChange, trigger }: Props) {
  const activeCount = countActiveFilters(value);

  const toggleMulti = (fieldId: string, optionValue: string) => {
    const current = value[fieldId] ?? [];
    const next = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    onChange({ ...value, [fieldId]: next });
  };

  const setSingle = (fieldId: string, optionValue: string) => {
    const current = value[fieldId] ?? [];
    const next = current.includes(optionValue) ? [] : [optionValue];
    onChange({ ...value, [fieldId]: next });
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        {trigger ?? (
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xxsmall'
            className='border-stroke-soft-200 hover:bg-bg-soft-200 size-7 gap-1.5 rounded-full border bg-transparent shadow-none ring-0 data-[count]:w-auto data-[count]:px-2'
            {...(activeCount > 0 ? { "data-count": activeCount } : {})}
          >
            <Button.Icon as={RiFilter3Line} className='size-3.5' />
            {activeCount > 0 && (
              <span className='text-text-strong-950 text-[11px] font-medium tabular-nums'>
                {activeCount}
              </span>
            )}
            <span className='sr-only'>Filter</span>
          </Button.Root>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content align='end' className='w-52'>
        {fields.map((field) => {
          const selected = value[field.id] ?? [];
          return (
            <Dropdown.MenuSub key={field.id}>
              <Dropdown.MenuSubTrigger>
                {field.icon && <Dropdown.ItemIcon as={field.icon} />}
                {field.label}
                {selected.length > 0 && (
                  <span className='bg-bg-weak-50 text-text-sub-600 ml-1 rounded-full px-1.5 text-[10px] font-medium tabular-nums'>
                    {selected.length}
                  </span>
                )}
              </Dropdown.MenuSubTrigger>
              <Dropdown.MenuSubContent className='w-48'>
                {field.options.length === 0 ? (
                  <div className='text-text-soft-400 px-2 py-1.5 text-[13px]'>No values</div>
                ) : (
                  field.options.map((opt) => {
                    const isChecked = selected.includes(opt.value);
                    return (
                      <Dropdown.Item
                        key={opt.value}
                        onSelect={(e) => {
                          e.preventDefault();
                          if (field.type === "multi") toggleMulti(field.id, opt.value);
                          else setSingle(field.id, opt.value);
                        }}
                      >
                        {field.type === "multi" ? (
                          <Checkbox.Root
                            checked={isChecked}
                            onClick={(e) => e.stopPropagation()}
                            onCheckedChange={() => toggleMulti(field.id, opt.value)}
                          />
                        ) : (
                          <span
                            className={cn(
                              "grid size-4 place-items-center rounded-full border",
                              isChecked
                                ? "border-primary-base"
                                : "border-stroke-soft-200",
                            )}
                          >
                            {isChecked && <span className='bg-primary-base size-2 rounded-full' />}
                          </span>
                        )}
                        <span className='truncate'>{opt.label}</span>
                      </Dropdown.Item>
                    );
                  })
                )}
              </Dropdown.MenuSubContent>
            </Dropdown.MenuSub>
          );
        })}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
