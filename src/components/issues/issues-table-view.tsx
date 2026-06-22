"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIssuesLayout, type IssuesViewFilter } from "@/app/(main)/issues/layout";
import { useIssues } from "@/contexts/issues-context";
import { RiAddLine, RiArrowDownSFill, RiArrowRightSFill } from "@remixicon/react";
import { useRouter } from "next/navigation";

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
import * as Checkbox from "@/components/ui/checkbox";
import * as Select from "@/components/ui/select";
import * as Table from "@/components/ui/table";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

type Props = {
  filter: IssuesViewFilter;
};

export function IssuesTableView({ filter }: Props) {
  const { issues, updateIssue } = useIssues();
  const { display } = useIssuesLayout();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filteredIssues = useMemo(() => {
    if (filter === "active")
      return issues.filter((i) => i.status === "todo" || i.status === "in-progress");
    if (filter === "backlog") return issues.filter((i) => i.status === "backlog");
    return issues;
  }, [issues, filter]);

  // Group issues
  const groupedData = useMemo(() => {
    if (display.grouping === "none") return [{ key: "all", items: filteredIssues }];

    const groups: Record<string, Issue[]> = {};
    filteredIssues.forEach((issue) => {
      const key = getGroupKey(issue, display.grouping);
      if (!groups[key]) groups[key] = [];
      groups[key].push(issue);
    });

    // Determine order based on grouping type
    let orderedKeys: string[];
    if (display.grouping === "status") {
      orderedKeys = STATUS_OPTIONS.map((s) => s.value);
    } else if (display.grouping === "priority") {
      orderedKeys = PRIORITY_OPTIONS.map((p) => p.value);
    } else {
      orderedKeys = Object.keys(groups).sort();
    }

    return orderedKeys
      .filter((key) => display.showEmptyGroups || (groups[key]?.length ?? 0) > 0)
      .map((key) => ({ key, items: groups[key] ?? [] }));
  }, [filteredIssues, display.grouping, display.showEmptyGroups]);

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const anchorRowId = useRef<string | null>(null);
  const lastRangeIds = useRef<Set<string>>(new Set());

  const allRowIds = useMemo(
    () => groupedData.flatMap((g) => g.items.map((i) => i.id)),
    [groupedData],
  );

  const flatRows = useMemo(
    () => groupedData.flatMap((g) => (collapsed[g.key] ? [] : g.items)),
    [groupedData, collapsed],
  );

  const toggleSelect = useCallback(
    (id: string, shiftKey: boolean) => {
      setSelected((prev) => {
        const next = new Set(prev);

        if (shiftKey && anchorRowId.current) {
          const anchorIdx = flatRows.findIndex((r) => r.id === anchorRowId.current);
          const currentIdx = flatRows.findIndex((r) => r.id === id);

          if (anchorIdx >= 0 && currentIdx >= 0) {
            // Remove previous shift-range
            for (const rid of lastRangeIds.current) {
              if (rid !== anchorRowId.current) next.delete(rid);
            }

            // Add new range
            const start = Math.min(anchorIdx, currentIdx);
            const end = Math.max(anchorIdx, currentIdx);
            const newRange = new Set<string>();
            for (let i = start; i <= end; i++) {
              next.add(flatRows[i].id);
              newRange.add(flatRows[i].id);
            }
            lastRangeIds.current = newRange;
          } else {
            if (next.has(id)) next.delete(id);
            else next.add(id);
            anchorRowId.current = id;
            lastRangeIds.current = new Set();
          }
        } else {
          if (next.has(id)) next.delete(id);
          else next.add(id);
          anchorRowId.current = id;
          lastRangeIds.current = new Set();
        }

        return next;
      });
    },
    [flatRows],
  );

  const selectAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === flatRows.length) return new Set();
      return new Set(flatRows.map((r) => r.id));
    });
  }, [flatRows]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container || !container.contains(document.activeElement as Node)) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, flatRows.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "x" || e.key === "X") {
        if (focusedIndex >= 0 && focusedIndex < flatRows.length) {
          toggleSelect(flatRows[focusedIndex].id, e.shiftKey);
        }
      } else if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        selectAll();
      } else if (e.key === "Enter") {
        if (focusedIndex >= 0 && focusedIndex < flatRows.length) {
          router.push(`/issues/${flatRows[focusedIndex].id}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, flatRows, toggleSelect, selectAll, router]);

  // Scroll focused row into view
  useEffect(() => {
    if (focusedIndex < 0) return;
    const row = containerRef.current?.querySelector(`[data-row-index="${focusedIndex}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  const toggleGroup = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const vis = display.visibleProperties;
  let flatIndex = -1;

  return (
    <div
      ref={containerRef}
      className='no-scrollbar h-full overflow-auto px-2.5 pb-2.5 outline-none'
      tabIndex={0}
      onFocus={() => {
        if (focusedIndex < 0 && flatRows.length > 0) setFocusedIndex(0);
      }}
    >
      {groupedData.map((group, groupIndex) => {
        const isCollapsed = collapsed[group.key];
        const info =
          display.grouping !== "none" ? getGroupLabel(display.grouping, group.key) : null;

        return (
          <div key={group.key}>
            {/* Group header */}
            {info && (
              <div
                className={cn(
                  "bg-bg-weak-50 flex h-9 w-full items-center gap-2 rounded-lg text-[13px] transition-colors",
                  groupIndex !== 0 && "mt-1",
                )}
              >
                <Button.Root
                  variant='neutral'
                  mode='ghost'
                  size='xxsmall'
                  className='w-9'
                  onClick={() => toggleGroup(group.key)}
                >
                  {isCollapsed ? (
                    <RiArrowRightSFill
                      className={cn(
                        "text-text-soft-400 size-4",
                        isCollapsed && "text-text-strong-950",
                      )}
                    />
                  ) : (
                    <RiArrowDownSFill className={cn("text-text-soft-400 size-4")} />
                  )}
                </Button.Root>
                <span className={cn("text-sm", info.color)}>
                  <info.icon className='size-3.5' />
                </span>
                <span className='text-text-strong-950'>{info.label}</span>
                <span className='text-text-soft-400 font-mono'>{group.items.length}</span>
                <div className='flex-1' />
                <RiAddLine className='text-text-soft-400 size-4 opacity-0 group-hover:opacity-100' />
              </div>
            )}

            {/* Rows */}
            {!isCollapsed && (
              <Table.Root>
                <Table.Body spacing={4}>
                  {group.items.map((issue) => {
                    flatIndex++;
                    const rowIdx = flatIndex;
                    const isSelected = selected.has(issue.id);
                    const isFocused = focusedIndex === rowIdx;

                    // Connected rows
                    const prevId = flatRows[rowIdx - 1]?.id;
                    const nextId = flatRows[rowIdx + 1]?.id;
                    const prevSelected = prevId ? selected.has(prevId) : false;
                    const nextSelected = nextId ? selected.has(nextId) : false;

                    return (
                      <Table.Row
                        key={issue.id}
                        data-row-index={rowIdx}
                        data-selected={isSelected || undefined}
                        data-connected-top={(isSelected && prevSelected) || undefined}
                        data-connected-bottom={(isSelected && nextSelected) || undefined}
                        className={cn(
                          "cursor-pointer text-[13px]",
                          // isFocused && "ring-primary-base ring-1 ring-inset",
                        )}
                        onClick={(e) => {
                          if (e.shiftKey || e.metaKey || e.ctrlKey) {
                            toggleSelect(issue.id, e.shiftKey);
                          } else {
                            router.push(`/issues/${issue.id}`);
                          }
                        }}
                        onMouseDown={() => setFocusedIndex(rowIdx)}
                      >
                        {/* Checkbox */}
                        <Table.Cell className='h-11 w-8 rounded-l-lg px-2'>
                          <Checkbox.Root
                            checked={isSelected}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelect(issue.id, e.shiftKey);
                            }}
                            onCheckedChange={() => {}}
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
                        </Table.Cell>
                        {/* Priority */}
                        {vis.includes("priority") && (
                          <Table.Cell
                            className='h-11 w-8 px-1 last:rounded-r-lg'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Select.Root
                              size='xxsmall'
                              value={issue.priority}
                              onValueChange={(v) =>
                                updateIssue(issue.id, { priority: v as IssuePriority })
                              }
                            >
                              <Select.Trigger
                                showArrow={false}
                                className='grid h-6 w-6 place-items-center border-none bg-transparent! p-0 shadow-none ring-0 hover:bg-transparent!'
                                onClick={(e) => e.stopPropagation()}
                              >
                                {React.createElement(PRIORITY_CONFIG[issue.priority].icon, {
                                  className: cn("size-3.5", PRIORITY_CONFIG[issue.priority].color),
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
                          </Table.Cell>
                        )}

                        {/* ID */}
                        {vis.includes("id") && (
                          <Table.Cell className='h-11 w-11 px-0 last:rounded-r-lg'>
                            <span className='text-text-soft-400 font-mono'>{issue.id}</span>
                          </Table.Cell>
                        )}

                        {/* Status */}
                        {vis.includes("status") && (
                          <Table.Cell
                            className='h-11 w-8 px-1 last:rounded-r-lg'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Select.Root
                              size='xxsmall'
                              value={issue.status}
                              onValueChange={(v) =>
                                updateIssue(issue.id, { status: v as IssueStatus })
                              }
                            >
                              <Select.Trigger
                                showArrow={false}
                                className='grid h-6 w-6 place-items-center border-none bg-transparent! p-0 shadow-none ring-0 hover:bg-transparent!'
                                onClick={(e) => e.stopPropagation()}
                              >
                                {React.createElement(STATUS_CONFIG[issue.status].icon, {
                                  className: cn("size-3.5", STATUS_CONFIG[issue.status].color),
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
                          </Table.Cell>
                        )}

                        {/* Trace ID */}
                        {vis.includes("trace-id") && issue.traceId && (
                          <Table.Cell className='h-11 w-10 px-0 last:rounded-r-lg'>
                            <span className='text-text-soft-400 font-mono text-[11px]'>
                              {issue.traceId.replace("trace_", "")}
                            </span>
                          </Table.Cell>
                        )}

                        {/* Title */}
                        <Table.Cell className='h-11 flex-1 px-0 last:rounded-r-lg'>
                          <span className='text-text-strong-950 line-clamp-1'>{issue.title}</span>
                        </Table.Cell>


                        {/* Assignee */}
                        {vis.includes("assignee") && (
                          <Table.Cell
                            className='h-11 w-6 px-0 text-right last:rounded-r-lg'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Select.Root
                              size='xxsmall'
                              value={issue.assignee ?? "unassigned"}
                              onValueChange={(v) =>
                                updateIssue(issue.id, { assignee: v === "unassigned" ? null : v })
                              }
                            >
                              <Select.Trigger
                                showArrow={false}
                                className='text-text-soft-400 h-6 w-fit border-none bg-transparent p-0 shadow-none ring-0 hover:bg-transparent'
                                onClick={(e) => e.stopPropagation()}
                              >
                                {issue.assignee ? (
                                  <div
                                    className={cn(
                                      "flex size-4.5 items-center justify-center rounded-full text-[9px] font-medium",
                                      getAvatarColor(issue.assignee),
                                    )}
                                  >
                                    {getInitials(issue.assignee)}
                                  </div>
                                ) : (
                                  <IconNoAssignee className='text-text-soft-400 size-4' />
                                )}
                              </Select.Trigger>
                              <Select.Content align='end'>
                                <Select.Item value='unassigned'>
                                  <IconNoAssignee className='text-text-soft-400 size-4' /> No
                                  assignee
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
                          </Table.Cell>
                        )}

                        {/* Created */}
                        {vis.includes("created") && (
                          <Table.Cell className='h-11 w-16 px-2 pr-3 text-right text-xs last:rounded-r-lg'>
                            <span className='text-text-soft-400'>
                              {formatDate(issue.createdAt)}
                            </span>
                          </Table.Cell>
                        )}

                        {/* Labels */}
                        {vis.includes("labels") && (
                          <Table.Cell className='h-11 w-24 px-2 text-right last:rounded-r-lg'>
                            {issue.labels.length > 0 ? (
                              <span className='bg-bg-weak-50 text-text-sub-600 rounded-md px-1.5 py-0.5 text-[11px] font-medium'>
                                {issue.labels[0]}
                              </span>
                            ) : (
                              <span className='text-text-soft-400'>—</span>
                            )}
                          </Table.Cell>
                        )}
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            )}
          </div>
        );
      })}
    </div>
  );
}
