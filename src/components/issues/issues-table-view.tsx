"use client";

import React, { useMemo } from "react";
import { useIssuesLayout, type IssuesViewFilter } from "@/app/(main)/issues/layout";
import { useIssues } from "@/contexts/issues-context";
import { RiAddLine, RiArrowDownSFill, RiArrowRightSFill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useHotkey } from "@tanstack/react-hotkeys";
import type { ColumnDef } from "@tanstack/react-table";

import {
  ASSIGNEE_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Issue,
  type IssuePriority,
  type IssueStatus,
} from "@/lib/issues-store";
import { cn } from "@/utils";

import type { GroupingOption } from "@/components/issues/display-options";
import {
  getAvatarColor,
  getInitials,
  IconNoAssignee,
  PRIORITY_CONFIG,
  STATUS_CONFIG,
} from "@/components/issues/issue-config";
import * as Button from "@/components/ui/button";
import { DataTable, dataTableSelectColumn, useDataTable } from "@/components/ui/data-table";
import * as Select from "@/components/ui/select";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getGroupKey(issue: Issue, grouping: GroupingOption): string {
  switch (grouping) {
    case "status":
      return issue.status;
    case "priority":
      return issue.priority;
    case "assignee":
      return issue.assignee ?? "Unassigned";
    case "label":
      return issue.labels[0] ?? "No label";
    case "project":
      return issue.project ?? "No project";
    default:
      return "all";
  }
}

function getGroupLabel(
  grouping: GroupingOption,
  value: string,
): { icon: React.ElementType; color: string; label: string } {
  if (grouping === "status") {
    const cfg = STATUS_CONFIG[value as IssueStatus];
    const label = STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
    return { icon: cfg?.icon ?? "span", color: cfg?.color ?? "", label };
  }
  if (grouping === "priority") {
    const cfg = PRIORITY_CONFIG[value as IssuePriority];
    const label = PRIORITY_OPTIONS.find((p) => p.value === value)?.label ?? value;
    return { icon: cfg?.icon ?? "span", color: cfg?.color ?? "", label };
  }
  return { icon: "span", color: "", label: value || "None" };
}

type Props = {
  filter: IssuesViewFilter;
};

export function IssuesTableView({ filter }: Props) {
  const { issues, updateIssue } = useIssues();
  const { display, setDisplay } = useIssuesLayout();
  const router = useRouter();

  // Mod+B to toggle between list and board view
  useHotkey("Mod+B", () => {
    setDisplay((prev) => ({ ...prev, view: prev.view === "list" ? "board" : "list" }));
  });

  const filteredIssues = useMemo(() => {
    if (filter === "active")
      return issues.filter((i) => i.status === "todo" || i.status === "in-progress");
    if (filter === "backlog") return issues.filter((i) => i.status === "backlog");
    return issues;
  }, [issues, filter]);

  const vis = display.visibleProperties;

  const columns: ColumnDef<Issue, unknown>[] = useMemo(
    () => [
      dataTableSelectColumn<Issue>(),
      // Priority
      ...(vis.includes("priority")
        ? [
            {
              id: "priority",
              enableSorting: false,
              enableHiding: false,
              header: () => <></>,
              cell: ({ row }: { row: { original: Issue } }) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <Select.Root
                    size='xxsmall'
                    value={row.original.priority}
                    onValueChange={(v) =>
                      updateIssue(row.original.id, { priority: v as IssuePriority })
                    }
                  >
                    <Select.Trigger
                      showArrow={false}
                      className='grid h-6 w-6 place-items-center border-none bg-transparent! p-0 shadow-none ring-0 hover:bg-transparent!'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {React.createElement(PRIORITY_CONFIG[row.original.priority].icon, {
                        className: cn("size-3.5", PRIORITY_CONFIG[row.original.priority].color),
                      })}
                    </Select.Trigger>
                    <Select.Content>
                      {PRIORITY_OPTIONS.map((p) => (
                        <Select.Item key={p.value} value={p.value}>
                          <span className={PRIORITY_CONFIG[p.value].color}>
                            {React.createElement(PRIORITY_CONFIG[p.value].icon, {
                              className: "size-4",
                            })}
                          </span>{" "}
                          {p.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              ),
            } as ColumnDef<Issue, unknown>,
          ]
        : []),
      // ID
      ...(vis.includes("id")
        ? [
            {
              id: "issueId",
              enableSorting: false,
              header: () => <></>,
              cell: ({ row }: { row: { original: Issue } }) => (
                <span className='text-text-soft-400 font-mono text-[13px]'>{row.original.id}</span>
              ),
            } as ColumnDef<Issue, unknown>,
          ]
        : []),
      // Status
      ...(vis.includes("status")
        ? [
            {
              id: "status",
              enableSorting: false,
              header: () => <></>,
              cell: ({ row }: { row: { original: Issue } }) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <Select.Root
                    size='xxsmall'
                    value={row.original.status}
                    onValueChange={(v) =>
                      updateIssue(row.original.id, { status: v as IssueStatus })
                    }
                  >
                    <Select.Trigger
                      showArrow={false}
                      className='grid h-6 w-6 place-items-center border-none bg-transparent! p-0 shadow-none ring-0 hover:bg-transparent!'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {React.createElement(STATUS_CONFIG[row.original.status].icon, {
                        className: cn("size-3.5", STATUS_CONFIG[row.original.status].color),
                      })}
                    </Select.Trigger>
                    <Select.Content>
                      {STATUS_OPTIONS.map((s) => (
                        <Select.Item key={s.value} value={s.value}>
                          <span className={STATUS_CONFIG[s.value].color}>
                            {React.createElement(STATUS_CONFIG[s.value].icon, {
                              className: "size-4",
                            })}
                          </span>{" "}
                          {s.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              ),
            } as ColumnDef<Issue, unknown>,
          ]
        : []),
      // Trace ID
      ...(vis.includes("trace-id")
        ? [
            {
              id: "traceId",
              enableSorting: false,
              header: () => <></>,
              cell: ({ row }: { row: { original: Issue } }) =>
                row.original.traceId ? (
                  <span className='text-text-soft-400 font-mono text-[11px]'>
                    {row.original.traceId.replace("trace_", "")}
                  </span>
                ) : null,
            } as ColumnDef<Issue, unknown>,
          ]
        : []),
      // Title (always shown)
      {
        id: "title",
        enableSorting: false,
        enableHiding: false,
        header: () => <></>,
        cell: ({ row }) => (
          <span className='text-text-strong-950 line-clamp-1'>{row.original.title}</span>
        ),
      } as ColumnDef<Issue, unknown>,
      // Assignee
      ...(vis.includes("assignee")
        ? [
            {
              id: "assignee",
              enableSorting: false,
              header: () => <></>,
              cell: ({ row }: { row: { original: Issue } }) => (
                <div className='text-right' onClick={(e) => e.stopPropagation()}>
                  <Select.Root
                    size='xxsmall'
                    value={row.original.assignee ?? "unassigned"}
                    onValueChange={(v) =>
                      updateIssue(row.original.id, {
                        assignee: v === "unassigned" ? null : v,
                      })
                    }
                  >
                    <Select.Trigger
                      showArrow={false}
                      className='text-text-soft-400 h-6 w-fit border-none bg-transparent p-0 shadow-none ring-0 hover:bg-transparent'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.original.assignee ? (
                        <div
                          className={cn(
                            "flex size-4.5 items-center justify-center rounded-full text-[9px] font-medium",
                            getAvatarColor(row.original.assignee),
                          )}
                        >
                          {getInitials(row.original.assignee)}
                        </div>
                      ) : (
                        <IconNoAssignee className='text-text-soft-400 size-4' />
                      )}
                    </Select.Trigger>
                    <Select.Content align='end'>
                      <Select.Item value='unassigned'>
                        <IconNoAssignee className='text-text-soft-400 size-4' /> No assignee
                      </Select.Item>
                      {ASSIGNEE_OPTIONS.map((a) => (
                        <Select.Item key={a} value={a}>
                          <div
                            className={cn(
                              "flex size-4.5 items-center justify-center rounded-full text-[9px] font-medium",
                              getAvatarColor(a),
                            )}
                          >
                            {getInitials(a)}
                          </div>
                          {a}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              ),
            } as ColumnDef<Issue, unknown>,
          ]
        : []),
      // Created
      ...(vis.includes("created")
        ? [
            {
              id: "created",
              enableSorting: false,
              header: () => <></>,
              cell: ({ row }: { row: { original: Issue } }) => (
                <span className='text-text-soft-400 text-xs whitespace-nowrap'>
                  {formatDate(row.original.createdAt)}
                </span>
              ),
            } as ColumnDef<Issue, unknown>,
          ]
        : []),
      // Labels
      ...(vis.includes("labels")
        ? [
            {
              id: "labels",
              enableSorting: false,
              header: () => <></>,
              cell: ({ row }: { row: { original: Issue } }) =>
                row.original.labels.length > 0 ? (
                  <span className='bg-bg-weak-50 text-text-sub-600 rounded-md px-1.5 py-0.5 text-[11px] font-medium'>
                    {row.original.labels[0]}
                  </span>
                ) : (
                  <span className='text-text-soft-400'>—</span>
                ),
            } as ColumnDef<Issue, unknown>,
          ]
        : []),
    ],
    [vis, updateIssue],
  );

  const groupOrder = useMemo(() => {
    if (display.grouping === "status") return STATUS_OPTIONS.map((s) => s.value);
    if (display.grouping === "priority") return PRIORITY_OPTIONS.map((p) => p.value);
    return undefined;
  }, [display.grouping]);

  const dataTable = useDataTable<Issue>({
    data: filteredIssues,
    columns,
    getRowId: (row) => row.id,
    keyboardScope: "page",
    groupBy:
      display.grouping === "none" ? undefined : (row) => getGroupKey(row, display.grouping),
    groupOrder,
    showEmptyGroups: display.showEmptyGroups,
    onRowActivate: (row) => router.push(`/issues/${row.id}`),
  });

  return (
    <DataTable
      instance={dataTable}
    >
      <DataTable.Header />
      <DataTable.Body<Issue>
        cellClassName='text-[13px]'
        onRowClick={(row, e) => {
          if (e.shiftKey || e.metaKey || e.ctrlKey) {
            dataTable.toggleRowSelection(row.id, e.shiftKey);
          } else {
            router.push(`/issues/${row.id}`);
          }
        }}
        renderGroupHeader={({ groupKey, count, collapsed, toggle, index }) => {
          const info =
            display.grouping !== "none" ? getGroupLabel(display.grouping, groupKey) : null;
          if (!info) return null;
          return (
            <div
              className={cn(
                "bg-bg-weak-50 flex h-9 w-full items-center gap-2 rounded-lg text-[13px] transition-colors",
                index !== 0 && "mt-1",
              )}
            >
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='xxsmall'
                className='w-9'
                onClick={toggle}
              >
                {collapsed ? (
                  <RiArrowRightSFill className='text-text-strong-950 size-4' />
                ) : (
                  <RiArrowDownSFill className='text-text-soft-400 size-4' />
                )}
              </Button.Root>
              <span className={cn("text-sm", info.color)}>
                <info.icon className='size-3.5' />
              </span>
              <span className='text-text-strong-950'>{info.label}</span>
              <span className='text-text-soft-400 font-mono'>{count}</span>
              <div className='flex-1' />
              <RiAddLine className='text-text-soft-400 mr-2 size-4 opacity-0 group-hover:opacity-100' />
            </div>
          );
        }}
      />
    </DataTable>
  );
}
