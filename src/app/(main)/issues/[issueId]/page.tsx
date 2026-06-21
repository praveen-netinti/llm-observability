"use client";

import React, { use, useMemo, useState } from "react";
import { useIssues } from "@/contexts/issues-context";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  RiArrowRightSLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiLayoutLeft2Line,
} from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ASSIGNEE_OPTIONS,
  LABEL_OPTIONS,
  PRIORITY_OPTIONS,
  PROJECT_OPTIONS,
  STATUS_OPTIONS,
  type IssueLabel,
  type IssuePriority,
  type IssueStatus,
} from "@/lib/issues-store";
import { cn } from "@/utils";

import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/components/issues/issue-config";
import { renderMrkdwn } from "@/lib/render-mrkdwn";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";

import { IconUserBox } from "../../traces/layout";

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
      <div className='flex h-full items-center justify-center'>
        <p className='text-text-soft-400'>Issue not found</p>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 flex h-full flex-col lg:rounded-2xl lg:border'>
        {/* Header */}
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

            <Breadcrumb.Item className='text-[13px]!'>
              <Link href='/issues'>Issues</Link>
            </Breadcrumb.Item>

            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />

            <Breadcrumb.Item className='font-mono text-[13px]!' active>
              {issue.id}
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        {/* Body - split layout */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Left: content */}
          <div className='flex-1 overflow-auto p-6'>
            <h1 className='text-label-lg text-text-strong-950 mb-4'>{issue.title}</h1>

            {/* Description */}
            <div className='text-paragraph-sm text-text-sub-600 leading-relaxed'>
              {issue.description ? renderMrkdwn(issue.description) : <span className='text-text-soft-400'>No description.</span>}
            </div>

            {/* Activity */}
            <div className='border-stroke-soft-200 mt-8 border-t pt-4'>
              <h3 className='text-label-xs text-text-soft-400 mb-3 uppercase'>Activity</h3>
              <div className='flex gap-2'>
                <input
                  className='shadow-custom-input text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 focus:shadow-custom-input-active flex-1 rounded-lg px-3 py-2 outline-none'
                  placeholder='Leave a comment...'
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                />
                <Button.Root variant='neutral' mode='stroke' size='small' disabled={!activity}>
                  Comment
                </Button.Root>
              </div>
            </div>
          </div>

          {/* Right: properties panel */}
          <div className='border-stroke-soft-200 w-72 shrink-0 overflow-auto border-l p-4'>
            <div className='flex flex-col gap-4'>
              {/* Copy actions */}
              <div className='flex gap-2'>
                <Button.Root
                  variant='neutral'
                  mode='stroke'
                  size='xxsmall'
                  className='flex-1 gap-1.5 text-[11px]'
                  onClick={() => copyToClipboard(`${window.location.origin}/issues/${issue.id}`)}
                >
                  <Button.Icon as={RiFileCopyLine} className='size-3.5' />
                  Copy URL
                </Button.Root>
                <Button.Root
                  variant='neutral'
                  mode='stroke'
                  size='xxsmall'
                  className='flex-1 gap-1.5 text-[11px]'
                  onClick={() => copyToClipboard(issue.id)}
                >
                  <Button.Icon as={RiFileCopyLine} className='size-3.5' />
                  Copy ID
                </Button.Root>
              </div>

              {/* Status */}
              <PropertyRow label='Status'>
                <Select.Root
                  size='xxsmall'
                  value={issue.status}
                  onValueChange={(v) => updateIssue(issue.id, { status: v as IssueStatus })}
                >
                  <Select.Trigger className='w-full'>
                    <span className={cn(STATUS_CONFIG[issue.status].color)}>
                      {React.createElement(STATUS_CONFIG[issue.status].icon, {
                        className: "size-4",
                      })}
                    </span>
                    <Select.Value />
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
              </PropertyRow>

              {/* Priority */}
              <PropertyRow label='Priority'>
                <Select.Root
                  size='xxsmall'
                  value={issue.priority}
                  onValueChange={(v) => updateIssue(issue.id, { priority: v as IssuePriority })}
                >
                  <Select.Trigger className='w-full'>
                    <span className={cn(PRIORITY_CONFIG[issue.priority].color)}>
                      {React.createElement(PRIORITY_CONFIG[issue.priority].icon, {
                        className: "size-4",
                      })}
                    </span>
                    <Select.Value />
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
              </PropertyRow>

              {/* Assignee */}
              <PropertyRow label='Assignee'>
                <Select.Root
                  size='xxsmall'
                  value={issue.assignee ?? "unassigned"}
                  onValueChange={(v) =>
                    updateIssue(issue.id, { assignee: v === "unassigned" ? null : v })
                  }
                >
                  <Select.Trigger className='w-full'>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='unassigned'>No assignee</Select.Item>
                    {ASSIGNEE_OPTIONS.map((a) => (
                      <Select.Item key={a} value={a}>
                        {a}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Labels */}
              <PropertyRow label='Labels'>
                <Select.Root
                  size='xxsmall'
                  value={issue.labels[0] ?? "none"}
                  onValueChange={(v) =>
                    updateIssue(issue.id, { labels: v === "none" ? [] : [v as IssueLabel] })
                  }
                >
                  <Select.Trigger className='w-full'>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='none'>No label</Select.Item>
                    {LABEL_OPTIONS.map((l) => (
                      <Select.Item key={l.value} value={l.value}>
                        {l.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Project */}
              <PropertyRow label='Project'>
                <Select.Root
                  size='xxsmall'
                  value={issue.project ?? "none"}
                  onValueChange={(v) => updateIssue(issue.id, { project: v === "none" ? null : v })}
                >
                  <Select.Trigger className='w-full'>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='none'>No project</Select.Item>
                    {PROJECT_OPTIONS.map((group) =>
                      group.projects.map((p) => (
                        <Select.Item key={p} value={p}>
                          {p}
                        </Select.Item>
                      )),
                    )}
                  </Select.Content>
                </Select.Root>
              </PropertyRow>

              {/* Linked trace */}
              {issue.traceId && (
                <PropertyRow label='Source Trace'>
                  <Link
                    href={`/traces/${issue.traceId}`}
                    className='text-paragraph-xs text-primary-base inline-flex items-center gap-1 hover:underline'
                  >
                    <RiExternalLinkLine className='size-3' />
                    {issue.traceId}
                  </Link>
                </PropertyRow>
              )}

              {/* Created */}
              <PropertyRow label='Created'>
                <span className='text-paragraph-xs text-text-sub-600'>
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
    <div className='flex flex-col gap-1'>
      <span className='text-label-xs text-text-soft-400'>{label}</span>
      {children}
    </div>
  );
}


