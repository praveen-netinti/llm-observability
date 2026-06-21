"use client";

import React, { useMemo } from "react";
import { useIssuesLayout, type IssuesViewFilter } from "@/app/(main)/issues/layout";
import { useIssues } from "@/contexts/issues-context";
import { useRouter } from "next/navigation";

import {
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
    <div className='no-scrollbar h-full overflow-x-auto overflow-y-hidden p-2.5'>
      <KanbanProvider
        columns={columns}
        data={kanbanData}
        onDataChange={handleDataChange}
        className='w-max auto-cols-[340px]! grid-flow-col! gap-3'
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className='flex items-center gap-2'>
                {grouping === "status" && (
                  <span className={cn("text-sm", STATUS_CONFIG[column.id as IssueStatus]?.color)}>
                    {React.createElement(STATUS_CONFIG[column.id as IssueStatus]?.icon, {
                      className: "size-4",
                    })}
                  </span>
                )}
                {grouping === "priority" && (
                  <span
                    className={cn("text-sm", PRIORITY_CONFIG[column.id as IssuePriority]?.color)}
                  >
                    {React.createElement(PRIORITY_CONFIG[column.id as IssuePriority]?.icon, {
                      className: "size-4",
                    })}
                  </span>
                )}
                <span className='text-label-sm'>{column.name}</span>
                <span className='text-paragraph-xs text-text-soft-400'>
                  {kanbanData.filter((d) => d.column === column.id).length}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards
              id={column.id}
              className='no-scrollbar max-h-[calc(100vh-220px)] overflow-y-auto'
            >
              {(item: (typeof kanbanData)[number]) => (
                <KanbanCard column={column.id} id={item.id} key={item.id} name={item.name}>
                  <div className='cursor-pointer' onClick={() => router.push(`/issues/${item.id}`)}>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-paragraph-xs text-text-soft-400 font-mono'>
                            {item.id}
                          </span>
                        </div>
                        <div className='mt-1 flex items-center gap-1.5'>
                          <span className={cn("text-xs", STATUS_CONFIG[item.status].color)}>
                            {React.createElement(STATUS_CONFIG[item.status].icon, {
                              className: "size-3.5",
                            })}
                          </span>
                          <p className='text-label-sm text-text-strong-950 m-0 line-clamp-2 flex-1'>
                            {item.title}
                          </p>
                        </div>
                      </div>
                      {item.assignee && (
                        <div
                          className={cn(
                            "flex size-4.5 shrink-0 items-center justify-center rounded-full text-[9px] font-medium",
                            getAvatarColor(item.assignee),
                          )}
                        >
                          {getInitials(item.assignee)}
                        </div>
                      )}
                    </div>
                    <div className='mt-2 flex items-center justify-between'>
                      <span className={cn("text-xs", PRIORITY_CONFIG[item.priority].color)}>
                        {React.createElement(PRIORITY_CONFIG[item.priority].icon, {
                          className: "size-3.5",
                        })}
                      </span>
                      <span className='text-paragraph-xs text-text-soft-400'>
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}
