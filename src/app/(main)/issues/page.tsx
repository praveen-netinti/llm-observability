"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";
import { useIssues } from "@/contexts/issues-context";
import {
  RiArrowRightSLine,
  RiLayoutLeft2Line,
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightSLine as RiChevron,
} from "@remixicon/react";
import { cn } from "@/utils";

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Table from "@/components/ui/table";
import * as Checkbox from "@/components/ui/checkbox";
import * as Select from "@/components/ui/select";
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTab,
} from "@/components/ui/segmented-control";
import {
  type Issue,
  type IssueStatus,
  type IssuePriority,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/lib/issues-store";

// Status icons & colors
const STATUS_CONFIG: Record<IssueStatus, { icon: string; color: string }> = {
  backlog: { icon: "◌", color: "text-text-soft-400" },
  todo: { icon: "○", color: "text-text-sub-600" },
  "in-progress": { icon: "◐", color: "text-warning-base" },
  done: { icon: "●", color: "text-success-base" },
  cancelled: { icon: "⊘", color: "text-text-disabled-300" },
};

const PRIORITY_CONFIG: Record<IssuePriority, { icon: string; color: string }> = {
  "no-priority": { icon: "—", color: "text-text-soft-400" },
  urgent: { icon: "⚡", color: "text-error-base" },
  high: { icon: "↑", color: "text-orange-500" },
  medium: { icon: "→", color: "text-warning-base" },
  low: { icon: "↓", color: "text-information-base" },
};

const KANBAN_COLUMNS = STATUS_OPTIONS.map((s) => ({
  id: s.value,
  name: s.label,
  color: STATUS_CONFIG[s.value].color,
}));

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Table View
function IssuesTableView() {
  const { issues, updateIssue } = useIssues();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const groups: Record<IssueStatus, Issue[]> = {
      backlog: [], todo: [], "in-progress": [], done: [], cancelled: [],
    };
    issues.forEach((i) => groups[i.status].push(i));
    return groups;
  }, [issues]);

  const toggle = (status: string) =>
    setCollapsed((p) => ({ ...p, [status]: !p[status] }));

  return (
    <div className="flex flex-col">
      {STATUS_OPTIONS.map(({ value: status, label }) => {
        const items = grouped[status];
        const isCollapsed = collapsed[status];

        return (
          <div key={status}>
            {/* Section header */}
            <button
              onClick={() => toggle(status)}
              className="flex w-full items-center gap-2 px-3 py-2 hover:bg-bg-weak-50 transition-colors"
            >
              {isCollapsed ? (
                <RiChevron className="size-4 text-text-soft-400" />
              ) : (
                <RiArrowDownSLine className="size-4 text-text-soft-400" />
              )}
              <span className={cn("text-sm", STATUS_CONFIG[status].color)}>
                {STATUS_CONFIG[status].icon}
              </span>
              <span className="text-label-sm text-text-strong-950">{label}</span>
              <span className="text-paragraph-xs text-text-soft-400">{items.length}</span>
              <div className="flex-1" />
              <RiAddLine className="size-4 text-text-soft-400 opacity-0 group-hover:opacity-100" />
            </button>

            {/* Issue rows */}
            {!isCollapsed && items.length > 0 && (
              <Table.Root>
                <Table.Body>
                  {items.map((issue) => (
                    <Table.Row
                      key={issue.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/issues/${issue.id}`)}
                    >
                      <Table.Cell className="w-8 px-2">
                        <Checkbox.Root onClick={(e) => e.stopPropagation()} />
                      </Table.Cell>
                      <Table.Cell className="w-8 px-1">
                        <Select.Root
                          size="xxsmall"
                          value={issue.priority}
                          onValueChange={(v) => {
                            updateIssue(issue.id, { priority: v as IssuePriority });
                          }}
                        >
                          <Select.Trigger
                            className="h-6 w-6 border-none p-0 shadow-none ring-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className={cn("text-xs", PRIORITY_CONFIG[issue.priority].color)}>
                              {PRIORITY_CONFIG[issue.priority].icon}
                            </span>
                          </Select.Trigger>
                          <Select.Content>
                            {PRIORITY_OPTIONS.map((p) => (
                              <Select.Item key={p.value} value={p.value}>
                                <span className={PRIORITY_CONFIG[p.value].color}>
                                  {PRIORITY_CONFIG[p.value].icon}
                                </span>{" "}
                                {p.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Table.Cell>
                      <Table.Cell className="w-20 px-2">
                        <span className="font-mono text-paragraph-xs text-text-soft-400">
                          {issue.id}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="w-8 px-1">
                        <Select.Root
                          size="xxsmall"
                          value={issue.status}
                          onValueChange={(v) => {
                            updateIssue(issue.id, { status: v as IssueStatus });
                          }}
                        >
                          <Select.Trigger
                            className="h-6 w-6 border-none p-0 shadow-none ring-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className={cn("text-xs", STATUS_CONFIG[issue.status].color)}>
                              {STATUS_CONFIG[issue.status].icon}
                            </span>
                          </Select.Trigger>
                          <Select.Content>
                            {STATUS_OPTIONS.map((s) => (
                              <Select.Item key={s.value} value={s.value}>
                                <span className={STATUS_CONFIG[s.value].color}>
                                  {STATUS_CONFIG[s.value].icon}
                                </span>{" "}
                                {s.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Table.Cell>
                      <Table.Cell className="flex-1 px-2">
                        <span className="text-paragraph-sm text-text-strong-950 line-clamp-1">
                          {issue.title}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="w-28 px-2 text-right">
                        <span className="text-paragraph-xs text-text-soft-400">
                          {issue.assignee ?? "—"}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="w-24 px-2 text-right">
                        <span className="text-paragraph-xs text-text-soft-400">
                          {formatDate(issue.createdAt)}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Board View
function IssuesBoardView() {
  const { issues, updateIssue } = useIssues();
  const router = useRouter();

  const kanbanData = useMemo(
    () => issues.map((i) => ({ ...i, column: i.status, name: i.title })),
    [issues],
  );

  const handleDataChange = (data: typeof kanbanData) => {
    data.forEach((item) => {
      const original = issues.find((i) => i.id === item.id);
      if (original && original.status !== item.column) {
        updateIssue(item.id, { status: item.column as IssueStatus });
      }
    });
  };

  return (
    <KanbanProvider columns={KANBAN_COLUMNS} data={kanbanData} onDataChange={handleDataChange}>
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm", STATUS_CONFIG[column.id as IssueStatus]?.color)}>
                {STATUS_CONFIG[column.id as IssueStatus]?.icon}
              </span>
              <span className="text-label-sm">{column.name}</span>
              <span className="text-paragraph-xs text-text-soft-400">
                {kanbanData.filter((d) => d.column === column.id).length}
              </span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(item: (typeof kanbanData)[number]) => (
              <KanbanCard
                column={column.id}
                id={item.id}
                key={item.id}
                name={item.name}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/issues/${item.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-paragraph-xs text-text-soft-400">
                          {item.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={cn("text-xs", STATUS_CONFIG[item.status].color)}>
                          {STATUS_CONFIG[item.status].icon}
                        </span>
                        <p className="m-0 flex-1 text-label-sm text-text-strong-950 line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    </div>
                    {item.assignee && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-alpha-10 text-[10px] font-medium text-primary-base">
                        {item.assignee.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={cn("text-xs", PRIORITY_CONFIG[item.priority].color)}>
                      {PRIORITY_CONFIG[item.priority].icon} {PRIORITY_OPTIONS.find((p) => p.value === item.priority)?.label}
                    </span>
                    <span className="text-paragraph-xs text-text-soft-400">
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
  );
}

// Main Page
export default function IssuesPage() {
  const { onMenuClick } = useSidebar();
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <div className="flex h-full flex-col lg:p-2 lg:pl-0">
      <div className="bg-bg-white-0 lg:border-stroke-soft-200 flex h-full flex-col lg:rounded-2xl lg:border">
        {/* Header */}
        <div className="border-faded-lighter dark:border-stroke-soft-200 flex h-11 items-center border-b px-2">
          <Button.Root
            variant="neutral"
            mode="ghost"
            size="xxsmall"
            onClick={onMenuClick}
            className="size-7 cursor-pointer rounded-lg p-0 lg:hidden"
          >
            <Button.Icon as={RiLayoutLeft2Line} className="text-text-soft-400" />
          </Button.Root>

          <Breadcrumb.Root className="ml-2.5 gap-0.5">
            <Breadcrumb.Item className="text-[13px]!">Praveen-netinti</Breadcrumb.Item>
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item className="text-[13px]!" active>Issues</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        {/* Toolbar */}
        <div className="flex h-11 items-center gap-2 px-2.5">
          <SegmentedControl value={view} onValueChange={(v) => setView(v as "list" | "board")}>
            <SegmentedControlList className="h-7">
              <SegmentedControlTab value="list">List</SegmentedControlTab>
              <SegmentedControlTab value="board">Board</SegmentedControlTab>
            </SegmentedControlList>
          </SegmentedControl>
        </div>

        {/* Content */}
        <div className="no-scrollbar relative flex-1 overflow-auto p-2.5">
          {view === "list" ? <IssuesTableView /> : <IssuesBoardView />}
        </div>
      </div>
    </div>
  );
}
