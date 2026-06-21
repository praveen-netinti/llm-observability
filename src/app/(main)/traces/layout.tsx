"use client";

import React, { SVGProps, useMemo } from "react";
import { useIssues } from "@/contexts/issues-context";
import { useSidebar } from "@/contexts/sidebar-context";
import slackCards from "@/data/slack-cards.json";
import {
  RiArrowDownLongLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpLongLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiFilter3Line,
  RiLayoutLeft2Line,
  RiLayoutRight2Line,
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
import { usePathname, useRouter } from "next/navigation";

import { FlatSpan, flatSpans } from "@/lib/flatten-traces";
import { cn } from "@/utils";

import { notification } from "@/hooks/use-notification";

import { TimeRangeFilter } from "@/components/traces/time-range-filter";
import { TraceDetailPanel } from "@/components/traces/trace-detail-panel";
import * as Badge from "@/components/ui/badge";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Checkbox from "@/components/ui/checkbox";
import * as Input from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTab,
} from "@/components/ui/segmented-control";
import * as Select from "@/components/ui/select";
import * as StatusBadge from "@/components/ui/status-badge";
import * as Table from "@/components/ui/table";

export function IconUserBox(props: SVGProps<SVGSVGElement>) {
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

type BadgeColor =
  | "gray"
  | "blue"
  | "orange"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "sky"
  | "pink"
  | "teal";

export function getLatencyBadgeColor(ms: number | null): BadgeColor {
  if (ms == null) return "gray";

  if (ms < 1_000) return "green"; // Excellent (<1s)
  if (ms < 3_000) return "yellow"; // Good (1–3s)
  if (ms < 8_000) return "orange"; // Slow (3–8s)

  return "red"; // Critical (>8s)
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

// function truncateJson(obj: Record<string, unknown> | null, maxLen = 60): string {
//   if (!obj) return "—";
//   const str = JSON.stringify(obj);
//   if (str.length <= maxLen) return str;
//   return str.slice(0, maxLen) + "…";
// }

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

export default function TracesLayout() {
  const { onMenuClick } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { addIssue } = useIssues();

  const [sorting, setSorting] = React.useState<SortingState>([{ id: "startTime", desc: true }]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const showSlackAlert = (traceId: string) => {
    const card = slackCards.messages.find((m) => m.traceId === traceId && m.lifecycle === "alert");
    const trace = traceRows.find((r) => r.traceId === traceId);
    const headerBlock = card?.blocks.find((b) => b.type === "header") as
      | { text: { text: string } }
      | undefined;
    const sectionBlock = card?.blocks.find((b) => b.type === "section") as
      | { text?: { text: string } }
      | undefined;
    const title =
      headerBlock?.text?.text?.replace(/:[a-z_]+:/g, "🚨 ").trim() ??
      `Trace failed — ${trace?.traceName ?? traceId}`;
    const body = sectionBlock?.text?.text ?? trace?.error ?? "An error occurred in this trace.";

    notification({
      status: "error",
      variant: "stroke",
      title,
      description: (
        <div className='flex flex-col gap-2'>
          <p className='text-paragraph-xs m-0'>{body.replace(/\*/g, "").replace(/`/g, "")}</p>
          <div className='mt-1 flex gap-2'>
            <button
              className='bg-primary-base text-static-white hover:bg-primary-darker rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors'
              onClick={() => {
                addIssue({
                  title: title.replace("🚨 ", ""),
                  description: body.replace(/\*/g, "").replace(/`/g, ""),
                  status: "todo",
                  priority: "high",
                  assignee: null,
                  labels: ["bug"],
                  project: null,
                  traceId,
                });
                router.push("/issues");
              }}
            >
              Create issue
            </button>
            <button
              className='border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-50 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors'
              onClick={() => router.push(`/traces/${traceId}`)}
            >
              View Trace
            </button>
          </div>
        </div>
      ),
      duration: 15000,
    });
  };

  // Extract traceId from pathname: /traces/[traceId]
  const traceId = pathname.match(/\/traces\/([^/]+)/)?.[1] ?? null;
  const spans = traceId ? flatSpans.filter((s) => s.traceId === traceId) : [];
  const showPanel = !!traceId && spans.length > 0;

  const filteredRows = useMemo(() => {
    let rows = traceRows;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) => r.traceName.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      rows = rows.filter((r) => r.traceStatus === statusFilter);
    }
    return rows;
  }, [search, statusFilter]);

  const columns: ColumnDef<FlatSpan>[] = useMemo(
    () => [
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
        header: () => <></>,
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
        cell: ({ row }) => (
          <div className='relative w-full'>
            <span className='text-text-strong-950 px-2'>{row.original.name}</span>

            <button
              type='button'
              className='border-stroke-soft-200 bg-bg-white-0 text-2xs text-text-sub-600 absolute inset-y-0 right-0 flex h-6 w-fit cursor-pointer items-center gap-1 rounded-md border px-1.5 uppercase opacity-0 group-hover/cell:opacity-100'
              onClick={() => {
                const trId = row.original.traceId;
                router.push(`/traces/${trId}`);
                if (row.original.traceStatus === "error") {
                  showSlackAlert(trId);
                }
              }}
            >
              <RiLayoutRight2Line className='size-4' />
              Open
            </button>
          </div>
        ),
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
          <span className='text-text-sub-600 px-2 whitespace-nowrap'>
            {formatTime(row.original.traceStartTime)}
          </span>
        ),
      },
      {
        id: "latency",
        accessorKey: "traceLatencyMs",
        header: ({ column }) => <DataColumnHeader label='Latency' column={column} />,
        cell: ({ row }) => {
          const latency = row.original.traceLatencyMs;
          if (latency == null) return null;
          return (
            <Badge.Root
              color={getLatencyBadgeColor(latency)}
              variant='light'
              className='mx-2 px-1.5 lowercase'
            >
              {formatLatency(latency)}
            </Badge.Root>
          );
        },
      },
      {
        id: "tokens",
        accessorKey: "traceTotalTokens",
        header: ({ column }) => <DataColumnHeader label='Tokens' column={column} />,
        cell: ({ row }) => (
          <span className='text-text-sub-600 px-3'>
            {formatTokens(row.original.traceTotalTokens)}
          </span>
        ),
      },
      {
        id: "cost",
        accessorKey: "traceTotalCostUsd",
        header: ({ column }) => <DataColumnHeader label='Cost' column={column} />,
        cell: ({ row }) => (
          <span className='text-text-sub-600 px-3'>
            {formatCost(row.original.traceTotalCostUsd)}
          </span>
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
                className='bg-bg-soft-200 text-text-sub-600 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium text-nowrap'
              >
                {tag}
              </span>
            ))}

            {row.original.traceTags.length > 2 && (
              <span className='bg-bg-soft-200 text-text-sub-600 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium text-nowrap'>
                +{row.original.traceTags.length - 2} more
              </span>
            )}
          </div>
        ),
      },
    ],
    [router],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0'>
      <ResizablePanelGroup
        orientation='horizontal'
        className='bg-bg-white-0 lg:border-stroke-soft-200 relative flex h-full flex-row lg:rounded-2xl lg:border'
      >
        <ResizablePanel defaultSize='50%'>
          <div className='relative flex h-full w-full flex-1 flex-col'>
            {/* Primary Header */}
            <div className='border-faded-lighter dark:border-stroke-soft-200 flex h-11 w-full items-center border-b px-2'>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='xxsmall'
                onClick={onMenuClick}
                className='size-7 cursor-pointer rounded-lg p-0 lg:hidden'
                autoFocus={false}
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

              <TimeRangeFilter />

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
                  <Input.Input
                    placeholder='Search by name'
                    className='w-42.5 text-[13px]'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>

              <div className='ml-auto flex items-center gap-1.5'>
                <Select.Root size='xxsmall' value={statusFilter} onValueChange={setStatusFilter}>
                  <Select.Trigger className='w-fit gap-1'>
                    <RiFilter3Line className='size-3.5' />
                    <Select.Value placeholder='Status' />
                  </Select.Trigger>
                  <Select.Content align='end' className='w-35'>
                    <Select.Item value='all'>All Status</Select.Item>
                    <Select.Item value='success'>
                      {/* <RiCheckboxCircleFill className='text-success-base inline size-4' /> */}
                      Success
                    </Select.Item>
                    <Select.Item value='error'>
                      {/* <RiCloseCircleFill className='text-error-base inline size-4' /> */}
                      Error
                    </Select.Item>
                    <Select.Item value='running'>
                      {/* <RiLoader4Line className='text-warning-base inline size-4' /> */}
                      Running
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            <div className='no-scrollbar relative flex-1 overflow-auto p-2.5'>
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
                          <Table.Cell
                            key={cell.id}
                            className={cn(
                              "group/cell text-[13px]",
                              traceId === row.original.traceId && "bg-bg-weak-50",
                            )}
                          >
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
        </ResizablePanel>

        {showPanel && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize='50%'
              maxSize='80%'
              minSize='60%'
              className='animate-slide-in-right h-full'
            >
              <TraceDetailPanel.Root traceId={traceId}>
                <TraceDetailPanel.Header />
                <TraceDetailPanel.Body />
              </TraceDetailPanel.Root>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
