"use client";

import { SVGProps, useMemo, useState } from "react";
import { useIssues } from "@/contexts/issues-context";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiArrowRightSLine as RiChevron,
  RiForbid2Fill,
  RiLayoutLeft2Line,
  RiProgress4Line,
} from "@remixicon/react";
import { useRouter } from "next/navigation";

import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Issue,
  type IssuePriority,
  type IssueStatus,
} from "@/lib/issues-store";
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
import * as Checkbox from "@/components/ui/checkbox";
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTab,
} from "@/components/ui/segmented-control";
import * as Select from "@/components/ui/select";
import * as Table from "@/components/ui/table";

import { IconUserBox } from "../traces/layout";

function IconCircleDashed(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M10.1 2.182a10 10 0 0 1 3.8 0'></path>
      <path d='M13.9 21.818a10 10 0 0 1-3.8 0'></path>
      <path d='M17.609 3.721a10 10 0 0 1 2.69 2.7'></path>
      <path d='M2.182 13.9a10 10 0 0 1 0-3.8'></path>
      <path d='M20.279 17.609a10 10 0 0 1-2.7 2.69'></path>
      <path d='M21.818 10.1a10 10 0 0 1 0 3.8'></path>
      <path d='M3.721 6.391a10 10 0 0 1 2.7-2.69'></path>
      <path d='M6.391 20.279a10 10 0 0 1-2.69-2.7'></path>
    </svg>
  );
}

// Status icons & colors
const STATUS_CONFIG: Record<IssueStatus, { icon: React.ElementType; color: string }> = {
  backlog: { icon: IconCircleDashed, color: "text-text-soft-400" },
  todo: { icon: RiCheckboxBlankCircleLine, color: "text-text-sub-600" },
  "in-progress": { icon: RiProgress4Line, color: "text-warning-base" },
  done: { icon: RiCheckboxCircleFill, color: "text-success-base" },
  cancelled: { icon: RiForbid2Fill, color: "text-text-disabled-300" },
};

const PRIORITY_CONFIG: Record<IssuePriority, { icon: string; color: string }> = {
  "no-priority": { icon: "—", color: "text-text-soft-400" },
  urgent: { icon: "⚡", color: "text-error-base" },
  high: { icon: "↑", color: "text-orange-500" },
  medium: { icon: "→", color: "text-warning-base" },
  low: { icon: "↓", color: "text-information-base" },
};

function StatusIcon({ status, className }: { status: IssueStatus; className?: string }) {
  const Icon = STATUS_CONFIG[status].icon;
  return <Icon className={cn("size-4", className)} />;
}

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
      backlog: [],
      todo: [],
      "in-progress": [],
      done: [],
      cancelled: [],
    };
    issues.forEach((i) => groups[i.status].push(i));
    return groups;
  }, [issues]);

  const toggle = (status: string) => setCollapsed((p) => ({ ...p, [status]: !p[status] }));

  return (
    <div className='flex flex-col gap-1'>
      {STATUS_OPTIONS.map(({ value: status, label }) => {
        const items = grouped[status];
        const isCollapsed = collapsed[status];

        return (
          <div key={status}>
            {/* Section header */}
            <div className='bg-bg-weak-50 flex h-9 w-full items-center gap-2 rounded-lg px-3 text-[13px] transition-colors'>
              <Button.Root
                variant='neutral'
                mode='ghost'
                className='size-7 p-0'
                onClick={() => toggle(status)}
              >
                {isCollapsed ? (
                  <RiChevron className='text-text-soft-400 size-4' />
                ) : (
                  <RiArrowDownSLine className='text-text-soft-400 size-4' />
                )}
              </Button.Root>
              <span className={cn(STATUS_CONFIG[status].color)}>
                <StatusIcon status={status} className='size-4' />
              </span>
              <span className='text-text-strong-950'>{label}</span>
              <span className='text-text-soft-400'>{items.length}</span>
              <div className='flex-1' />
              <RiAddLine className='text-text-sub-600 size-4' />
            </div>

            {/* Issue rows */}
            {!isCollapsed && items.length > 0 && (
              <Table.Root>
                <Table.Body spacing={4}>
                  {items.map((issue) => (
                    <Table.Row
                      key={issue.id}
                      className='cursor-pointer'
                      onClick={() => router.push(`/issues/${issue.id}`)}
                    >
                      <Table.Cell className='h-11 w-8 px-2 text-[13px]'>
                        <Checkbox.Root onClick={(e) => e.stopPropagation()} />
                      </Table.Cell>
                      <Table.Cell className='h-11 w-8 px-1 text-[13px]'>
                        <Select.Root
                          size='xxsmall'
                          value={issue.priority}
                          onValueChange={(v) => {
                            updateIssue(issue.id, { priority: v as IssuePriority });
                          }}
                        >
                          <Select.Trigger
                            showArrow={false}
                            className='grid place-items-center border-none bg-transparent p-0 shadow-none ring-0'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className={cn("text-text-sub-600 text-xs")}>
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
                      <Table.Cell className='h-11 w-20 text-[13px]'>
                        <span className='text-text-soft-400 font-mono'>{issue.id}</span>
                      </Table.Cell>
                      <Table.Cell className='h-11 w-8 px-1 text-[13px]'>
                        <Select.Root
                          size='xxsmall'
                          value={issue.status}
                          onValueChange={(v) => {
                            updateIssue(issue.id, { status: v as IssueStatus });
                          }}
                        >
                          <Select.Trigger
                            showArrow={false}
                            className='h-6 w-6 border-none bg-transparent p-0 shadow-none ring-0'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className={cn("text-xs", STATUS_CONFIG[issue.status].color)}>
                              <StatusIcon status={issue.status} />
                            </span>
                          </Select.Trigger>
                          <Select.Content>
                            {STATUS_OPTIONS.map((s) => (
                              <Select.Item key={s.value} value={s.value}>
                                <span className={STATUS_CONFIG[s.value].color}>
                                  <StatusIcon status={s.value} />
                                </span>{" "}
                                {s.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Table.Cell>
                      <Table.Cell className='h-11 flex-1 px-2 text-[13px]'>
                        <span className='text-text-strong-950 line-clamp-1'>{issue.title}</span>
                      </Table.Cell>
                      <Table.Cell className='h-11 w-28 px-2 text-right text-[13px]'>
                        <span className='text-text-soft-400'>{issue.assignee ?? "—"}</span>
                      </Table.Cell>
                      <Table.Cell className='h-11 w-24 px-2 text-right text-[13px]'>
                        <span className='text-text-soft-400'>{formatDate(issue.createdAt)}</span>
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
            <div className='flex items-center gap-2'>
              <span className={cn("text-sm", STATUS_CONFIG[column.id as IssueStatus]?.color)}>
                <StatusIcon status={column.id as IssueStatus} />
              </span>
              <span className='text-label-sm'>{column.name}</span>
              <span className='text-paragraph-xs text-text-soft-400'>
                {kanbanData.filter((d) => d.column === column.id).length}
              </span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
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
                          <StatusIcon status={item.status} />
                        </span>
                        <p className='text-label-sm text-text-strong-950 m-0 line-clamp-2 flex-1'>
                          {item.title}
                        </p>
                      </div>
                    </div>
                    {item.assignee && (
                      <div className='bg-primary-alpha-10 text-primary-base flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium'>
                        {item.assignee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <div className='mt-2 flex items-center justify-between'>
                    <span className={cn("text-xs", PRIORITY_CONFIG[item.priority].color)}>
                      {PRIORITY_CONFIG[item.priority].icon}{" "}
                      {PRIORITY_OPTIONS.find((p) => p.value === item.priority)?.label}
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
  );
}

// Main Page
export default function IssuesPage() {
  const { onMenuClick } = useSidebar();
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0 select-none'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 relative flex h-full flex-col lg:rounded-2xl lg:border'>
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
              Issues
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        {/* Toolbar */}
        <div className='flex h-11 min-h-11 items-center gap-2 px-2.5'>
          <SegmentedControl value={view} onValueChange={(v) => setView(v as "list" | "board")}>
            <SegmentedControlList className='h-7'>
              <SegmentedControlTab value='list'>List</SegmentedControlTab>
              <SegmentedControlTab value='board'>Board</SegmentedControlTab>
            </SegmentedControlList>
          </SegmentedControl>
        </div>

        {/* Content */}
        <div className='no-scrollbar relative flex-1 overflow-auto px-2.5 py-2'>
          {view === "list" ? <IssuesTableView /> : <IssuesBoardView />}
        </div>
      </div>
    </div>
  );
}
