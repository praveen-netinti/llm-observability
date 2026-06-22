"use client";

import React, { SVGProps, useMemo } from "react";
import { useIssues } from "@/contexts/issues-context";
import { useSidebar } from "@/contexts/sidebar-context";
import slackCards from "@/data/slack-cards.json";
import {
  RiArrowDownLongLine,
  RiArrowDownSFill,
  RiArrowRightSFill,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpLongLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiCloseLine,
  RiFlaskLine,
  RiGitMergeLine,
  RiLayoutLeft2Line,
  RiLayoutRight2Line,
  RiLoader4Line,
  RiNotificationOffLine,
  RiPriceTag3Line,
  RiSearchLine,
  RiServerLine,
} from "@remixicon/react";
import { Column, type ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";

import { FlatSpan, flatSpans } from "@/lib/flatten-traces";
import { cn } from "@/utils";

import { notification } from "@/hooks/use-notification";

import {
  SlackBlocks,
  type SlackActionContext,
  type SlackBlock,
} from "@/components/slack/slack-card";
import { SlackLogo } from "@/components/slack/slack-logo";
// import { TimeRangeFilter } from "@/components/traces/time-range-filter";
import { TraceDetailPanel } from "@/components/traces/trace-detail-panel";
import {
  TracesDisplayOptions,
  type TracesGrouping,
} from "@/components/traces/traces-display-options";
import * as Badge from "@/components/ui/badge";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import { DataTable, dataTableSelectColumn, useDataTable } from "@/components/ui/data-table";
import {
  DataTableFilter,
  type FilterField,
  type FilterValue,
} from "@/components/ui/data-table-filter";
import * as Input from "@/components/ui/input";
import { plainText } from "@/components/ui/markdown";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import {
//   SegmentedControl,
//   SegmentedControlList,
//   SegmentedControlTab,
// } from "@/components/ui/segmented-control";
import * as StatusBadge from "@/components/ui/status-badge";
import { STATUS_CONFIG } from "@/components/issues/issue-config";

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

/**
 * Synthesize a Slack-style alert card for an error trace that has no authored
 * card in slack-cards.json, so the "Open" affordance stays consistent.
 */
function buildFallbackBlocks(trace: FlatSpan | undefined, traceId: string): SlackBlock[] {
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `:rotating_light: Trace failed — ${trace?.traceName ?? traceId}`,
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: "*Status:* Needs attention" },
        { type: "mrkdwn", text: "Posted just now" },
      ],
    },
  ];

  if (trace?.error) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `This run aborted with \`${trace.error}\` and never completed.`,
      },
    });
  }

  const fields: { type: "mrkdwn"; text: string }[] = [
    { type: "mrkdwn", text: "*Severity:*\n:red_circle: High" },
  ];
  if (trace?.traceEnvironment) {
    fields.push({ type: "mrkdwn", text: `*Environment:*\n${trace.traceEnvironment}` });
  }
  if (trace?.model) fields.push({ type: "mrkdwn", text: `*Model:*\n${trace.model}` });
  if (trace?.traceTotalCostUsd) {
    fields.push({ type: "mrkdwn", text: `*Cost so far:*\n$${trace.traceTotalCostUsd.toFixed(4)}` });
  }
  blocks.push({ type: "section", fields });

  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "View Trace", emoji: true },
        url: `https://app.example.com/traces/${traceId}`,
        action_id: "view_trace",
      },
      {
        type: "button",
        text: { type: "plain_text", text: "Create issue", emoji: true },
        style: "primary",
        action_id: "create_issue",
      },
      {
        type: "button",
        text: { type: "plain_text", text: "Mute this alert", emoji: true },
        style: "danger",
        action_id: "mute_alert",
      },
    ],
  });

  return blocks;
}

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

const statusConfig = {
  success: { variant: "completed" as const, icon: RiCheckboxCircleFill, label: "Success" },
  error: { variant: "failed" as const, icon: RiCloseCircleFill, label: "Error" },
  running: { variant: "pending" as const, icon: RiLoader4Line, label: "Running" },
};

/* ---- Display-options + filter configuration (derived from the dataset) ---- */

// Columns that can be toggled via Display options (status/name stay fixed).
const TRACE_PROPERTIES: { id: string; label: string }[] = [
  { id: "traceId", label: "Trace ID" },
  { id: "startTime", label: "Start time" },
  { id: "latency", label: "Latency" },
  { id: "tokens", label: "Tokens" },
  { id: "cost", label: "Cost" },
  { id: "tags", label: "Tags" },
];

const ENVIRONMENT_VALUES = Array.from(
  new Set(traceRows.map((r) => r.traceEnvironment).filter((e): e is string => !!e)),
).sort();

const TAG_VALUES = Array.from(new Set(traceRows.flatMap((r) => r.traceTags))).sort();

const TRACE_FILTER_FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    icon: STATUS_CONFIG.backlog.icon,
    type: "multi",
    options: [
      { value: "success", label: "Success" },
      { value: "error", label: "Error" },
      { value: "running", label: "Running" },
    ],
  },
  {
    id: "environment",
    label: "Environment",
    icon: RiServerLine,
    type: "multi",
    options: ENVIRONMENT_VALUES.map((e) => ({ value: e, label: e })),
  },
  {
    id: "tags",
    label: "Tags",
    icon: RiPriceTag3Line,
    type: "multi",
    options: TAG_VALUES.map((t) => ({ value: t, label: t })),
  },
];

const GROUP_ORDER: Record<Exclude<TracesGrouping, "none">, string[]> = {
  status: ["error", "running", "success"],
  environment: ENVIRONMENT_VALUES,
};

function groupKeyFor(row: FlatSpan, grouping: TracesGrouping): string {
  if (grouping === "status") return row.traceStatus;
  if (grouping === "environment") return row.traceEnvironment ?? "unknown";
  return "all";
}

function groupLabelFor(grouping: TracesGrouping, key: string): string {
  if (grouping === "status") return statusConfig[key as keyof typeof statusConfig]?.label ?? key;
  return key;
}

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

  const [search, setSearch] = React.useState("");
  const [filterValue, setFilterValue] = React.useState<FilterValue>({});
  const [grouping, setGrouping] = React.useState<TracesGrouping>("none");

  const showSlackAlert = (traceId: string) => {
    const card = slackCards.messages.find((m) => m.traceId === traceId && m.lifecycle === "alert");
    const trace = traceRows.find((r) => r.traceId === traceId);

    const blocks = (card?.blocks as unknown as SlackBlock[]) ?? buildFallbackBlocks(trace, traceId);
    const channel = card?.channel ?? "#llm-ops";

    // Derive a clean title/body for any issue created from this alert.
    const headerBlock = blocks.find((b) => b.type === "header") as
      | Extract<SlackBlock, { type: "header" }>
      | undefined;
    const sectionBlock = blocks.find((b) => b.type === "section" && "text" in b && b.text) as
      | Extract<SlackBlock, { type: "section" }>
      | undefined;
    const issueTitle = headerBlock
      ? plainText(headerBlock.text.text)
          .replace(/^[^\w]+/, "")
          .trim()
      : `Trace failed — ${trace?.traceName ?? traceId}`;
    const issueBody =
      sectionBlock?.text?.text ?? trace?.error ?? "An error occurred in this trace.";

    const { dismiss } = notification({
      id: `slack-${traceId}`,
      status: "error",
      variant: "stroke",
      icon: SlackLogo,
      iconClassName: "size-5",
      title: (
        <div className='mb-4 flex items-center gap-1.5'>
          <SlackLogo className='size-3.5' />
          <span className='text-text-strong-950 text-label-sm font-semibold'>Slack</span>
          <span className='bg-bg-soft-200 size-1 rounded-full' />
          <span className='text-text-soft-400 font-mono text-[11px]'>{channel}</span>
          <span className='bg-success-base ml-1 size-1.5 animate-pulse rounded-full' />
        </div>
      ),
      description: (
        <SlackBlocks
          blocks={blocks}
          density='compact'
          onAction={(actionId, ctx: SlackActionContext) => {
            switch (actionId) {
              case "view_trace":
                router.push(`/traces/${traceId}`);
                dismiss();
                break;
              case "create_issue":
                addIssue({
                  title: issueTitle,
                  description: issueBody,
                  status: "todo",
                  priority: "high",
                  assignee: null,
                  labels: ["bug"],
                  project: null,
                  traceId,
                });
                notification({
                  status: "success",
                  variant: "stroke",
                  title: "Issue created",
                  description: "A new issue was opened from this alert.",
                  duration: 4000,
                });
                router.push("/issues");
                dismiss();
                break;
              case "view_pr":
                if (ctx.url) window.open(ctx.url, "_blank", "noopener,noreferrer");
                break;
              case "mute_alert":
                notification({
                  status: "information",
                  variant: "stroke",
                  icon: RiNotificationOffLine,
                  title: "Alert muted",
                  description: `Notifications paused for ${trace?.traceName ?? traceId}.`,
                  duration: 4000,
                });
                dismiss();
                break;
              case "approve_merge":
                notification({
                  status: "success",
                  variant: "stroke",
                  icon: RiGitMergeLine,
                  title: "Merge approved",
                  description: "The fix has been queued to merge.",
                  duration: 4000,
                });
                dismiss();
                break;
              case "add_to_evalset":
                notification({
                  status: "feature",
                  variant: "stroke",
                  icon: RiFlaskLine,
                  title: "Added to eval set",
                  description: "This run was added to the evaluation set.",
                  duration: 4000,
                });
                dismiss();
                break;
              case "merge_strategy":
                notification({
                  status: "information",
                  variant: "stroke",
                  title: "Merge strategy set",
                  description: `Strategy: ${ctx.label}.`,
                  duration: 3000,
                });
                break;
              default:
                break;
            }
          }}
        />
      ),
      duration: 20000,
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

    const statusVals = filterValue.status ?? [];
    if (statusVals.length > 0) {
      rows = rows.filter((r) => statusVals.includes(r.traceStatus));
    }

    const envVals = filterValue.environment ?? [];
    if (envVals.length > 0) {
      rows = rows.filter((r) => r.traceEnvironment != null && envVals.includes(r.traceEnvironment));
    }

    const tagVals = filterValue.tags ?? [];
    if (tagVals.length > 0) {
      rows = rows.filter((r) => r.traceTags.some((t) => tagVals.includes(t)));
    }

    return rows;
  }, [search, filterValue]);

  const columns: ColumnDef<FlatSpan, unknown>[] = useMemo(
    () => [
      dataTableSelectColumn<FlatSpan>(),
      {
        id: "status",
        accessorKey: "traceStatus",
        enableHiding: false,
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
        enableHiding: false,
        header: ({ column }) => <DataColumnHeader column={column} label='Name' />,
        cell: ({ row }) => (
          <div className='relative w-full'>
            <span className='text-text-strong-950 px-2'>{row.original.name}</span>

            <button
              type='button'
              className='border-stroke-soft-200 bg-bg-white-0 text-2xs text-text-sub-600 absolute inset-y-0 right-0 flex h-6 w-fit cursor-pointer items-center gap-1 rounded-md border px-1.5 uppercase opacity-0 group-hover/row:opacity-100'
              onClick={(e) => {
                e.stopPropagation();
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
      {
        id: "traceId",
        accessorKey: "traceId",
        header: ({ column }) => <DataColumnHeader label='Trace ID' column={column} />,
        cell: ({ row }) => (
          <span className='text-text-soft-400 px-2 font-mono text-[12px] whitespace-nowrap'>
            {row.original.traceId.replace(/^trace_/, "")}
          </span>
        ),
      },
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

  const dataTable = useDataTable<FlatSpan>({
    data: filteredRows,
    columns,
    getRowId: (row) => row.id,
    initialSorting: [{ id: "startTime", desc: true }],
    keyboardScope: "page",
    groupBy: grouping === "none" ? undefined : (row) => groupKeyFor(row, grouping),
    groupOrder: grouping === "none" ? undefined : GROUP_ORDER[grouping],
    onRowActivate: (row) => router.push(`/traces/${row.traceId}`),
  });

  return (
    <div className='flex h-full flex-col select-none lg:p-2 lg:pl-0'>
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
            <div className='flex h-11 w-full items-center gap-1.5 px-2.5'>
              {/* TODO: wire up view filtering (All Traces / LLM Calls / Tool Calls / Errors)
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
              </Select.Root> */}

              {/* TODO: wire up relative time range filtering
              <TimeRangeFilter /> */}

              {/* TODO: wire up Traces / Runs view toggle (Runs = flatten all nested spans, reversed per trace)
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
              </SegmentedControl> */}

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
                <DataTableFilter
                  fields={TRACE_FILTER_FIELDS}
                  value={filterValue}
                  onChange={setFilterValue}
                />
                <TracesDisplayOptions
                  table={dataTable.table}
                  grouping={grouping}
                  onGroupingChange={setGrouping}
                  properties={TRACE_PROPERTIES}
                />
              </div>
            </div>

            <DataTable
              instance={dataTable}
              actionBar={
                <DataTable.ActionBar>
                  <TraceBulkActions
                    selectedRows={dataTable.selectedRows}
                    clear={dataTable.clearSelection}
                  />
                </DataTable.ActionBar>
              }
            >
              <DataTable.Header />
              <DataTable.Body<FlatSpan>
                cellClassName={(row) =>
                  cn("text-[13px]", traceId === row.original.traceId && "bg-bg-weak-50")
                }
                renderGroupHeader={({ groupKey, count, collapsed, toggle, index }) => (
                  <div
                    className={cn(
                      "bg-bg-weak-50 flex h-9 w-full items-center gap-2 rounded-lg px-2 text-[13px] mb-1",
                      index !== 0 && "mt-1",
                    )}
                  >
                    <Button.Root
                      variant='neutral'
                      mode='ghost'
                      size='xxsmall'
                      className='size-5 p-0'
                      onClick={toggle}
                    >
                      {collapsed ? (
                        <RiArrowRightSFill className='text-text-strong-950 size-4' />
                      ) : (
                        <RiArrowDownSFill className='text-text-soft-400 size-4' />
                      )}
                    </Button.Root>
                    {grouping === "status" &&
                      (() => {
                        const cfg = statusConfig[groupKey as keyof typeof statusConfig];
                        return cfg ? (
                          <StatusBadge.Icon
                            as={cfg.icon}
                            className={cn(
                              "size-3.5",
                              cfg.variant === "completed" && "text-success-base",
                              cfg.variant === "pending" && "text-warning-base",
                              cfg.variant === "failed" && "text-error-base",
                            )}
                          />
                        ) : null;
                      })()}
                    <span className='text-text-strong-950 capitalize'>
                      {groupLabelFor(grouping, groupKey)}
                    </span>
                    <span className='text-text-soft-400 font-mono'>{count}</span>
                  </div>
                )}
              />
            </DataTable>
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

function TraceBulkActions({
  selectedRows,
  clear,
}: {
  selectedRows: FlatSpan[];
  clear: () => void;
}) {
  const addToEvalSet = () => {
    notification({
      status: "feature",
      variant: "stroke",
      title: "Added to eval set",
      description: `${selectedRows.length} ${selectedRows.length === 1 ? "trace" : "traces"} added to the evaluation set.`,
      duration: 4000,
    });
    clear();
  };

  return (
    <>
      <Button.Root
        variant='neutral'
        mode='stroke'
        size='xxsmall'
        className='text-text-strong-950 hover:ring-stroke-soft-200 h-7 rounded-full px-2.5'
        onClick={addToEvalSet}
      >
        Add to eval set
      </Button.Root>
      <Button.Root
        variant='neutral'
        mode='ghost'
        size='xxsmall'
        className='size-7 rounded-full p-0'
        onClick={clear}
      >
        <Button.Icon as={RiCloseLine} className='size-4' />
      </Button.Root>
    </>
  );
}
