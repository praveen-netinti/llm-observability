"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useIssues } from "@/contexts/issues-context";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  RiArrowRightSLine,
  RiArrowLeftLine,
  RiLayoutLeft2Line,
  RiFileCopyLine,
  RiExternalLinkLine,
} from "@remixicon/react";
import { cn } from "@/utils";

import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import {
  type IssueStatus,
  type IssuePriority,
  type IssueLabel,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  LABEL_OPTIONS,
  ASSIGNEE_OPTIONS,
  PROJECT_OPTIONS,
} from "@/lib/issues-store";

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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function IssueDetailPage({ params }: { params: Promise<{ issueId: string }> }) {
  const { issueId } = use(params);
  const { issues, updateIssue } = useIssues();
  const { onMenuClick } = useSidebar();
  const router = useRouter();
  const [activity, setActivity] = useState("");

  const issue = useMemo(() => issues.find((i) => i.id === issueId), [issues, issueId]);

  if (!issue) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-text-soft-400">Issue not found</p>
      </div>
    );
  }

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

          <Button.Root
            variant="neutral"
            mode="ghost"
            size="xxsmall"
            onClick={() => router.push("/issues")}
            className="mr-1"
          >
            <Button.Icon as={RiArrowLeftLine} className="size-4" />
          </Button.Root>

          <Breadcrumb.Root className="gap-0.5">
            <Breadcrumb.Item className="text-[13px]!">
              <Link href="/issues">Issues</Link>
            </Breadcrumb.Item>
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item className="text-[13px]! font-mono" active>
              {issue.id}
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        {/* Body - split layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Title */}
            <h1 className="text-title-h6 text-text-strong-950 mb-2">{issue.title}</h1>

            {/* Description */}
            <div className="prose prose-sm text-paragraph-sm text-text-sub-600 mb-8 whitespace-pre-wrap rounded-lg border border-stroke-soft-200 p-4">
              {issue.description || "No description provided."}
            </div>

            {/* Activity */}
            <div className="border-t border-stroke-soft-200 pt-4">
              <h3 className="text-label-sm text-text-strong-950 mb-3">Activity</h3>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus:shadow-custom-input-active"
                  placeholder="Leave a comment..."
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                />
                <Button.Root variant="neutral" mode="stroke" size="small" disabled={!activity}>
                  Comment
                </Button.Root>
              </div>
            </div>
          </div>

          {/* Right: properties panel */}
          <div className="w-72 shrink-0 border-l border-stroke-soft-200 overflow-auto p-4">
            <div className="flex flex-col gap-4">
              {/* Copy actions */}
              <div className="flex gap-2">
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  size="xxsmall"
                  className="flex-1 gap-1.5 text-[11px]"
                  onClick={() => copyToClipboard(`${window.location.origin}/issues/${issue.id}`)}
                >
                  <Button.Icon as={RiFileCopyLine} className="size-3.5" />
                  Copy URL
                </Button.Root>
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  size="xxsmall"
                  className="flex-1 gap-1.5 text-[11px]"
                  onClick={() => copyToClipboard(issue.id)}
                >
                  <Button.Icon as={RiFileCopyLine} className="size-3.5" />
                  Copy ID
                </Button.Root>
              </div>

              {/* Status */}
              <PropertyRow label="Status">
                <Select.Root
                  size="xxsmall"
                  value={issue.status}
                  onValueChange={(v) => updateIssue(issue.id, { status: v as IssueStatus })}
                >
                  <Select.Trigger className="w-full">
                    <span className={cn(STATUS_CONFIG[issue.status].color)}>
                      {STATUS_CONFIG[issue.status].icon}
                    </span>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {STATUS_OPTIONS.map((s) => (
                      <Select.Item key={s.value} value={s.value}>
                        <span className={STATUS_CONFIG[s.value].color}>{STATUS_CONFIG[s.value].icon}</span>{" "}
                        {s.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Priority */}
              <PropertyRow label="Priority">
                <Select.Root
                  size="xxsmall"
                  value={issue.priority}
                  onValueChange={(v) => updateIssue(issue.id, { priority: v as IssuePriority })}
                >
                  <Select.Trigger className="w-full">
                    <span className={cn(PRIORITY_CONFIG[issue.priority].color)}>
                      {PRIORITY_CONFIG[issue.priority].icon}
                    </span>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {PRIORITY_OPTIONS.map((p) => (
                      <Select.Item key={p.value} value={p.value}>
                        <span className={PRIORITY_CONFIG[p.value].color}>{PRIORITY_CONFIG[p.value].icon}</span>{" "}
                        {p.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Assignee */}
              <PropertyRow label="Assignee">
                <Select.Root
                  size="xxsmall"
                  value={issue.assignee ?? "unassigned"}
                  onValueChange={(v) => updateIssue(issue.id, { assignee: v === "unassigned" ? null : v })}
                >
                  <Select.Trigger className="w-full">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="unassigned">No assignee</Select.Item>
                    {ASSIGNEE_OPTIONS.map((a) => (
                      <Select.Item key={a} value={a}>{a}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Labels */}
              <PropertyRow label="Labels">
                <Select.Root
                  size="xxsmall"
                  value={issue.labels[0] ?? "none"}
                  onValueChange={(v) => updateIssue(issue.id, { labels: v === "none" ? [] : [v as IssueLabel] })}
                >
                  <Select.Trigger className="w-full">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="none">No label</Select.Item>
                    {LABEL_OPTIONS.map((l) => (
                      <Select.Item key={l.value} value={l.value}>{l.label}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Project */}
              <PropertyRow label="Project">
                <Select.Root
                  size="xxsmall"
                  value={issue.project ?? "none"}
                  onValueChange={(v) => updateIssue(issue.id, { project: v === "none" ? null : v })}
                >
                  <Select.Trigger className="w-full">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="none">No project</Select.Item>
                    {PROJECT_OPTIONS.map((group) =>
                      group.projects.map((p) => (
                        <Select.Item key={p} value={p}>{p}</Select.Item>
                      ))
                    )}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Linked trace */}
              {issue.traceId && (
                <PropertyRow label="Source Trace">
                  <Link
                    href={`/traces/${issue.traceId}`}
                    className="inline-flex items-center gap-1 text-paragraph-xs text-primary-base hover:underline"
                  >
                    <RiExternalLinkLine className="size-3" />
                    {issue.traceId}
                  </Link>
                </PropertyRow>
              )}

              {/* Created */}
              <PropertyRow label="Created">
                <span className="text-paragraph-xs text-text-sub-600">
                  {new Date(issue.createdAt).toLocaleString()}
                </span>
              </PropertyRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label-xs text-text-soft-400">{label}</span>
      {children}
    </div>
  );
}
