"use client";

import React, { SVGProps } from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  RiArrowDownLongLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpLongLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiFilter3Line,
  RiHourglassLine,
  RiLayoutLeft2Line,
  RiLoader4Line,
  RiSearchLine,
} from "@remixicon/react";
import {
  Column,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { FlatSpan, flatSpans } from "@/lib/flatten-traces";
import { cn } from "@/utils";

import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Checkbox from "@/components/ui/checkbox";
import * as Input from "@/components/ui/input";
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTab,
} from "@/components/ui/segmented-control";
import * as Select from "@/components/ui/select";
import * as StatusBadge from "@/components/ui/status-badge";
import * as Table from "@/components/ui/table";

function IconUserBox(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M12.5 13.5V15H3.5V13.5H12.5ZM13.5 12.5V3.5C13.5 3.23478 13.3946 2.98043 13.2071 2.79289C13.0196 2.60536 12.7652 2.5 12.5 2.5H3.5C3.23478 2.5 2.98043 2.60536 2.79289 2.79289C2.60536 2.98043 2.5 3.23478 2.5 3.5V12.5C2.5 12.7652 2.60536 13.0196 2.79289 13.2071C2.98043 13.3946 3.23478 13.5 3.5 13.5V15L3.244 14.987C2.67237 14.9282 2.13844 14.6742 1.7321 14.2679C1.32576 13.8616 1.07181 13.3276 1.013 12.756L1 12.5V3.5C0.999965 2.88126 1.22938 2.28448 1.64388 1.8251C2.05838 1.36571 2.62851 1.07636 3.244 1.013L3.5 1H12.5L12.756 1.013C13.3715 1.07636 13.9416 1.36571 14.3561 1.8251C14.7706 2.28448 15 2.88126 15 3.5V12.5L14.987 12.756C14.9282 13.3276 14.6742 13.8616 14.2679 14.2679C13.8616 14.6742 13.3276 14.9282 12.756 14.987L12.5 15V13.5C12.7652 13.5 13.0196 13.3946 13.2071 13.2071C13.3946 13.0196 13.5 12.7652 13.5 12.5Z'
        fill='#D758FC'
      />
      <path
        d='M10 6C10 6.53043 9.78931 7.03914 9.41423 7.41421C9.03916 7.78929 8.53045 8 8.00002 8C7.46959 8 6.96088 7.78929 6.58581 7.41421C6.21073 7.03914 6.00002 6.53043 6.00002 6C6.00002 5.46957 6.21073 4.96086 6.58581 4.58579C6.96088 4.21071 7.46959 4 8.00002 4C8.53045 4 9.03916 4.21071 9.41423 4.58579C9.78931 4.96086 10 5.46957 10 6ZM11.405 12H4.59502C4.18802 12 3.88102 11.664 4.04502 11.307C4.40702 10.517 5.38902 9.333 8.02502 9.333C10.673 9.333 11.622 10.529 11.96 11.319C12.112 11.674 11.807 12 11.405 12Z'
        fill='#D758FC'
      />
    </svg>
  );
}

// Show only root spans (one per trace)
const traceRows = flatSpans.filter((s) => s.parentId === null);

function formatLatency(ms: number | null): string {
  if (ms === null) return "";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTokens(tokens: number | null): string {
  if (tokens === null || tokens === 0) return "—";
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return String(tokens);
}

function formatCost(cost: number | null): string {
  if (cost === null || cost === 0) return "—";
  if (cost < 0.001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function truncateJson(obj: Record<string, unknown> | null, maxLen = 60): string {
  if (!obj) return "—";
  const str = JSON.stringify(obj);
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

const statusConfig = {
  success: { variant: "completed" as const, icon: RiCheckboxCircleFill, label: "Success" },
  error: { variant: "failed" as const, icon: RiCloseCircleFill, label: "Error" },
  running: { variant: "pending" as const, icon: RiLoader4Line, label: "Running" },
};

const getSortingIcon = (state: "asc" | "desc" | false) => {
  if (state === "asc")
    return <RiArrowUpLongLine className='group-hover:text-text-strong-950 size-3' />;
  if (state === "desc")
    return <RiArrowDownLongLine className='group-hover:text-text-strong-950 size-3' />;
  return <RiArrowUpDownLine className='group-hover:text-text-strong-950 size-3' />;
};

function DataColumnHeader({ column, label }: { label: string; column: Column<FlatSpan, unknown> }) {
  const canColumnSorted = column.getCanSort();

  if (!canColumnSorted) return <div className='grid h-6 w-fit place-items-center'>{label}</div>;

  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className='group hover:bg-bg-weak-50 hover:text-text-strong-950 flex h-6 w-fit items-center gap-0.5 rounded-full px-2'
    >
      {label}

      {getSortingIcon(column.getIsSorted())}
    </button>
  );
}

const columns: ColumnDef<FlatSpan>[] = [
  {
    id: "select",
    // header: ({ table }) => (
    //   <Checkbox.Root
    //     checked={
    //       table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label='Select all'
    //   />
    // ),
    cell: ({ row }) => (
      <Checkbox.Root
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        // className='opacity-0 group-hover/row:opacity-100! group-data-selected-true/row:opacity-100!'
        className={cn(
          "transition-all duration-200 ease-out",
          "opacity-0",

          // Show on row hover
          "group-hover/row:opacity-100",

          // Keep visible when selected
          "group-data-[selected=true]/row:opacity-100",

          // Keep visible when keyboard focused
          "focus-visible:opacity-100",

          // Keep visible while interacting
          "hover:opacity-100",

          // Optional subtle scale animation
          "scale-95 group-hover/row:scale-100 group-data-[selected=true]/row:scale-100",
        )}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "status",
    accessorKey: "traceStatus",
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        {/* Status */}
        {/* <button type='button' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {getSortingIcon(column.getIsSorted())}
        </button> */}
      </div>
    ),
    cell: ({ row }) => {
      const cfg = statusConfig[row.original.traceStatus];
      return (
        <div className='grid w-full place-items-center'>
          <StatusBadge.Icon
            as={cfg.icon}
            className={cn(
              cfg.variant === "pending" && "animate-spin",
              cfg.variant === "completed" && "text-success-base",
              cfg.variant === "pending" && "text-warning-base",
              cfg.variant === "failed" && "text-error-base",
            )}
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "traceName",
    header: ({ column }) => <DataColumnHeader column={column} label='Name' />,
    cell: ({ row }) => <span className='text-text-strong-950 px-2'>{row.original.name}</span>,
  },
  // {
  //   id: "input",
  //   accessorKey: "input",
  //   header: () => <div className='min-w-44'>Input</div>,
  //   enableSorting: false,
  //   cell: ({ row }) => (
  //     <span className='text-text-sub-600 block max-w-52 truncate'>
  //       {truncateJson(row.original.input)}
  //     </span>
  //   ),
  // },
  // {
  //   id: "output",
  //   accessorKey: "output",
  //   header: () => <div className='min-w-44'>Output</div>,
  //   enableSorting: false,
  //   cell: ({ row }) => (
  //     <span className='text-text-sub-600 block max-w-52 truncate'>
  //       {truncateJson(row.original.output)}
  //     </span>
  //   ),
  // },
  // {
  //   id: "error",
  //   accessorKey: "error",
  //   header: () => "Error",
  //   enableSorting: false,
  //   cell: ({ row }) => (
  //     <span className='text-error-base block max-w-44 truncate'>{row.original.error ?? "—"}</span>
  //   ),
  // },
  {
    id: "startTime",
    accessorKey: "traceStartTime",
    header: ({ column }) => <DataColumnHeader label='Start time' column={column} />,
    cell: ({ row }) => (
      <span className='text-text-sub-600 whitespace-nowrap px-2'>
        {formatTime(row.original.traceStartTime)}
      </span>
    ),
  },
  {
    id: "latency",
    accessorKey: "traceLatencyMs",
    header: ({ column }) => <DataColumnHeader label='Latency' column={column} />,
    cell: ({ row }) => (
      <span className='text-text-sub-600 px-2'>{formatLatency(row.original.traceLatencyMs)}</span>
    ),
  },
  {
    id: "tokens",
    accessorKey: "traceTotalTokens",
    header: ({ column }) => <DataColumnHeader label='Tokens' column={column} />,
    cell: ({ row }) => (
      <span className='text-text-sub-600 px-2'>{formatTokens(row.original.traceTotalTokens)}</span>
    ),
  },
  {
    id: "cost",
    accessorKey: "traceTotalCostUsd",
    header: ({ column }) => <DataColumnHeader label='Cost' column={column} />,
    cell: ({ row }) => (
      <span className='text-text-sub-600 px-2'>{formatCost(row.original.traceTotalCostUsd)}</span>
    ),
  },
  {
    id: "tags",
    accessorKey: "traceTags",
    header: ({ column }) => <DataColumnHeader label='Tags' column={column} />,
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex gap-1'>
        {row.original.traceTags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className='bg-bg-soft-200 text-text-sub-600 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium'
          >
            {tag}
          </span>
        ))}

        {row.original.traceTags.length > 2 && (
          <span className='bg-bg-soft-200 text-text-sub-600 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium'>
            +{row.original.traceTags.length - 2} more
          </span>
        )}
      </div>
    ),
  },
];

export default function TracesPage() {
  const { onMenuClick } = useSidebar();

  const [sorting, setSorting] = React.useState<SortingState>([{ id: "startTime", desc: true }]);

  const table = useReactTable({
    data: traceRows,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 relative flex h-full flex-col lg:rounded-2xl lg:border'>
        {/* Primary Header */}
        <div className='border-faded-lighter dark:border-stroke-soft-200 flex h-11 w-full items-center border-b px-2'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={onMenuClick}
            className='size-7 cursor-pointer rounded-lg p-0 lg:hidden'
          >
            <Button.Icon as={RiLayoutLeft2Line} className='text-text-soft-400' />
          </Button.Root>

          <Breadcrumb.Root className='ml-2.5 gap-0.5'>
            <Breadcrumb.Item className='text-[13px]!'>
              <Breadcrumb.Icon as={IconUserBox} className='size-4' />
              Praveen-netinti
            </Breadcrumb.Item>

            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />

            <Breadcrumb.Item className='text-[13px]!' active>
              Traces
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        {/* Table Toolbar */}
        <div className='flex h-11 w-full items-center gap-2 px-2.5'>
          <Select.Root size='xxsmall' defaultValue='all-traces'>
            <Select.Trigger className='w-fit'>
              <Select.Value placeholder='Select view' />
            </Select.Trigger>
            <Select.Content>
              {[
                {
                  value: "all-traces",
                  label: "All Traces",
                },
                {
                  value: "llm-calls",
                  label: "LLM Calls",
                },
                {
                  value: "tool-calls",
                  label: "Tool Calls",
                },
                {
                  value: "errors",
                  label: "Errors",
                },
              ].map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xxsmall'
            className='gap-2 px-3 text-[13px]'
          >
            <Button.Icon as={RiHourglassLine} className='size-3.5' />
            Last 1 day
          </Button.Root>

          <SegmentedControl>
            <SegmentedControlList
              className='h-7'
              style={
                {
                  "--active-tab-height": "28px !important",
                } as React.CSSProperties
              }
            >
              <SegmentedControlTab value='traces'>Traces</SegmentedControlTab>
              <SegmentedControlTab value='runs'>Runs</SegmentedControlTab>
            </SegmentedControlList>
          </SegmentedControl>

          <Input.Root size='xsmall' className='h-7 w-fit'>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} className='size-4' />
              {/* <Input.InlineAffix>€</Input.InlineAffix> */}
              <Input.Input
                placeholder='Search by name or status'
                className='w-[170px] text-[13px]'
              />
            </Input.Wrapper>
            <Select.Root size='xxsmall' variant='compactForInput' defaultValue='all'>
              <Select.Trigger className='w-fit px-2'>
                <Select.Value placeholder='Select view' />
              </Select.Trigger>
              <Select.Content>
                {[
                  {
                    value: "all",
                    label: "All",
                  },
                  {
                    value: "name",
                    label: "Name",
                  },
                  {
                    value: "status",
                    label: "Status",
                  },
                ].map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Input.Root>

          <div className='ml-auto flex items-center'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xxsmall'
              className='size-7 rounded-full'
            >
              <Button.Icon as={RiFilter3Line} />
            </Button.Root>
          </div>
        </div>

        <div className='relative flex-1 overflow-auto p-2.5'>
          <Table.Root>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Head key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Head>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row, index, rows) => {
                const isSelected = row.getIsSelected();

                const prevSelected = rows[index - 1]?.getIsSelected() ?? false;
                const nextSelected = rows[index + 1]?.getIsSelected() ?? false;

                return (
                  <Table.Row
                    key={row.id}
                    data-selected={isSelected || undefined}
                    data-connected-top={(isSelected && prevSelected) || undefined}
                    data-connected-bottom={(isSelected && nextSelected) || undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id} className='text-[13px]'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    </div>
  );
}
