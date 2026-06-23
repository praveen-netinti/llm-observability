"use client";

import React, { useMemo } from "react";
import { useIssuesLayout, type IssuesViewFilter } from "@/app/(main)/issues/layout";
import { useIssues } from "@/contexts/issues-context";
import { RiAddLine } from "@remixicon/react";
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
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getColumns(grouping: GroupingOption) {
  if (grouping === "priority") {
    return PRIORITY_OPTIONS.map((p) => ({ id: p.value, name: p.label }));
  }
  if (grouping === "assignee") {
    return [
      { id: "Unassigned", name: "Unassigned" },
      { id: "Praveen N", name: "Praveen N" },
      { id: "Ritvik S", name: "Ritvik S" },
      { id: "Alice Chen", name: "Alice Chen" },
      { id: "Bob Smith", name: "Bob Smith" },
    ];
  }
  // Default: status
  return STATUS_OPTIONS.map((s) => ({ id: s.value, name: s.label }));
}

function getColumnKey(issue: Issue, grouping: GroupingOption): string {
  switch (grouping) {
    case "priority":
      return issue.priority;
    case "assignee":
      return issue.assignee ?? "Unassigned";
    case "label":
      return issue.labels[0] ?? "No label";
    case "project":
      return issue.project ?? "No project";
    default:
      return issue.status;
  }
}

type Props = {
  filter: IssuesViewFilter;
};

export function IssuesBoardView({ filter }: Props) {
  const { issues, updateIssue } = useIssues();
  const { display } = useIssuesLayout();
  const router = useRouter();

  const grouping = display.grouping === "none" ? "status" : display.grouping;

  const filteredIssues = useMemo(() => {
    if (filter === "active")
      return issues.filter((i) => i.status === "todo" || i.status === "in-progress");
    if (filter === "backlog") return issues.filter((i) => i.status === "backlog");
    return issues;
  }, [issues, filter]);

  const columns = useMemo(() => getColumns(grouping), [grouping]);

  const kanbanData = useMemo(
    () => filteredIssues.map((i) => ({ ...i, column: getColumnKey(i, grouping), name: i.title })),
    [filteredIssues, grouping],
  );

  const handleDataChange = (data: typeof kanbanData) => {
    data.forEach((item) => {
      const original = issues.find((i) => i.id === item.id);
      if (!original) return;
      const newColumn = item.column;
      if (grouping === "status" && original.status !== newColumn) {
        updateIssue(item.id, { status: newColumn as IssueStatus });
      } else if (grouping === "priority" && original.priority !== newColumn) {
        updateIssue(item.id, { priority: newColumn as IssuePriority });
      } else if (grouping === "assignee" && (original.assignee ?? "Unassigned") !== newColumn) {
        updateIssue(item.id, { assignee: newColumn === "Unassigned" ? null : newColumn });
      }
    });
  };

  return (
    <div className='no-scrollbar h-full overflow-x-auto overflow-y-hidden px-2.5 pt-1 pb-2.5 text-[13px]'>
      <KanbanProvider
        columns={columns}
        data={kanbanData}
        onDataChange={handleDataChange}
        className='w-max auto-cols-[340px]! grid-flow-col! gap-2'
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              {grouping === "status" && (
                <span className={cn("text-sm", STATUS_CONFIG[column.id as IssueStatus]?.color)}>
                  {React.createElement(STATUS_CONFIG[column.id as IssueStatus]?.icon, {
                    className: "size-3.5",
                  })}
                </span>
              )}
              {grouping === "priority" && (
                <span className={cn("text-sm", PRIORITY_CONFIG[column.id as IssuePriority]?.color)}>
                  {React.createElement(PRIORITY_CONFIG[column.id as IssuePriority]?.icon, {
                    className: "size-3.5",
                  })}
                </span>
              )}
              <span className=''>{column.name}</span>
              <span className='text-text-soft-400'>
                {kanbanData.filter((d) => d.column === column.id).length}
              </span>
            </KanbanHeader>
            <KanbanCards
              id={column.id}
              className='no-scrollbar max-h-[calc(100vh-220px)] overflow-y-auto'
            >
              {(item: (typeof kanbanData)[number]) => (
                <KanbanCard column={column.id} id={item.id} key={item.id} name={item.name}>
                  <div
                    className='cursor-pointer space-y-3'
                    onClick={() => router.push(`/issues/${item.id}`)}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-paragraph-xs text-text-soft-400 font-mono'>
                            {item.id}
                          </span>
                          {item.traceId && (
                            <span className='text-text-disabled-300 font-mono text-[10px]'>
                              {item.traceId.replace("trace_", "")}
                            </span>
                          )}
                        </div>
                        <div className='mt-2 flex items-start gap-1.5'>
                          <div className='' onClick={(e) => e.stopPropagation()}>
                            <Select.Root
                              size='xxsmall'
                              value={item.status}
                              onValueChange={(v) =>
                                updateIssue(item.id, { status: v as IssueStatus })
                              }
                            >
                              <Select.Trigger
                                showArrow={false}
                                className='grid h-5 w-5 place-items-center border-none bg-transparent! p-0 shadow-none ring-0 hover:bg-transparent!'
                                onClick={(e) => e.stopPropagation()}
                              >
                                {React.createElement(STATUS_CONFIG[item.status].icon, {
                                  className: cn("size-3", STATUS_CONFIG[item.status].color),
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
                          <p className='text-text-strong-950 m-0 mt-1 line-clamp-2 flex-1 text-[13px]'>
                            {item.title}
                          </p>
                        </div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Select.Root
                          size='xxsmall'
                          value={item.assignee ?? "unassigned"}
                          onValueChange={(v) =>
                            updateIssue(item.id, { assignee: v === "unassigned" ? null : v })
                          }
                        >
                          <Select.Trigger
                            showArrow={false}
                            className='h-5 w-fit border-none bg-transparent p-0 shadow-none ring-0 hover:bg-transparent'
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.assignee ? (
                              <div
                                className={cn(
                                  "flex size-4.5 items-center justify-center rounded-full text-[9px] font-medium",
                                  getAvatarColor(item.assignee),
                                )}
                              >
                                {getInitials(item.assignee)}
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
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select.Root
                        size='xxsmall'
                        value={item.priority}
                        onValueChange={(v) =>
                          updateIssue(item.id, { priority: v as IssuePriority })
                        }
                      >
                        <Select.Trigger
                          showArrow={false}
                          className='grid h-5 w-5 place-items-center border-none bg-transparent! p-0 shadow-none ring-0 hover:bg-transparent!'
                          onClick={(e) => e.stopPropagation()}
                        >
                          {React.createElement(PRIORITY_CONFIG[item.priority].icon, {
                            className: cn("size-3.5", PRIORITY_CONFIG[item.priority].color),
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
                    <div className='text-label-xs text-text-soft-400'>
                      Created {formatDate(item.createdAt)}
                    </div>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
            <Button.Root
              variant='neutral'
              mode='stroke'
              className='hover:ring-stroke-soft-200 hover:bg-bg-weak-25 mx-2 rounded-full opacity-0 group-hover/kanban:opacity-100'
              size='xsmall'
            >
              <Button.Icon as={RiAddLine} />
            </Button.Root>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}
