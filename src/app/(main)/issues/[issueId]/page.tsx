"use client";

import React, { use, useMemo, useState } from "react";
import { useIssues } from "@/contexts/issues-context";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  RiAlertLine,
  RiArrowDropDownFill,
  RiArrowDropUpFill,
  RiArrowRightSLine,
  RiCpuLine,
  RiExternalLinkLine,
  RiLayoutLeft2Line,
  RiMoneyDollarCircleLine,
  RiServerLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { flatSpans } from "@/lib/flatten-traces";
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

import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/components/issues/issue-config";
import * as Accordion from "@/components/ui/accordion";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as ButtonGroup from "@/components/ui/button-group";
import { Markdown } from "@/components/ui/markdown";
import * as Select from "@/components/ui/select";
import * as Tooltip from "@/components/ui/tooltip";

import { IconUserBox } from "../../traces/layout";

function CopyButton({
  text,
  tooltip,
  children,
}: {
  text: string;
  tooltip: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xxsmall'
          className='size-7 gap-1.5 rounded-full'
          onClick={copy}
        >
          <AnimatePresence mode='popLayout' initial={false}>
            <motion.span
              key={copied ? "check" : "icon"}
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className='inline-flex'
            >
              {copied ? <IconCheck className='text-success-base size-3.5' /> : children}
            </motion.span>
          </AnimatePresence>
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>{copied ? "Copied!" : tooltip}</Tooltip.Content>
    </Tooltip.Root>
  );
}

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12ZM16.6757 8.26285C17.0828 8.63604 17.1103 9.26861 16.7372 9.67573L11.2372 15.6757C11.0528 15.8768 10.7944 15.9938 10.5217 15.9998C10.249 16.0057 9.98576 15.9 9.79289 15.7071L7.29289 13.2071C6.90237 12.8166 6.90237 12.1834 7.29289 11.7929C7.68342 11.4024 8.31658 11.4024 8.70711 11.7929L10.4686 13.5544L15.2628 8.32428C15.636 7.91716 16.2686 7.88966 16.6757 8.26285Z'
      />
    </svg>
  );
}

export default function IssueDetailPage({ params }: { params: Promise<{ issueId: string }> }) {
  const { issueId } = use(params);
  const { issues, updateIssue } = useIssues();
  const { onMenuClick } = useSidebar();
  const router = useRouter();

  const issue = useMemo(() => issues.find((i) => i.id === issueId), [issues, issueId]);
  const currentIndex = useMemo(() => issues.findIndex((i) => i.id === issueId), [issues, issueId]);

  // Derive severity / environment / model / cost from the linked trace
  const meta = useMemo(() => {
    const severityMap: Record<IssuePriority, string> = {
      urgent: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      "no-priority": "None",
    };
    const severity = issue ? severityMap[issue.priority] : "None";

    if (!issue?.traceId) {
      return {
        severity,
        environment: null as string | null,
        model: null as string | null,
        cost: null as number | null,
      };
    }
    const spans = flatSpans.filter((s) => s.traceId === issue.traceId);
    const environment = spans.find((s) => s.traceEnvironment)?.traceEnvironment ?? null;
    const model = spans.find((s) => s.model)?.model ?? null;
    const cost = spans[0]?.traceTotalCostUsd ?? null;
    return { severity, environment, model, cost };
  }, [issue]);

  if (!issue) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p className='text-text-soft-400'>Issue not found</p>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col select-none lg:p-2 lg:pl-0'>
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
            <Breadcrumb.Item className='text-[13px]!' active>
              {issue.id} {issue.title}
            </Breadcrumb.Item>
          </Breadcrumb.Root>

          <div className='ml-auto flex items-center gap-2'>
            <div className='text-text-soft-400 font-mono text-[13px] tabular-nums'>
              {currentIndex + 1}/{issues.length}
            </div>
            <ButtonGroup.Root size='xxsmall' className='flex items-center'>
              <ButtonGroup.Item
                className='size-7 border-none p-0 first:rounded-l-full'
                disabled={currentIndex >= issues.length - 1}
                onClick={() => router.push(`/issues/${issues[currentIndex + 1].id}`)}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='size-3.5'
                >
                  <path d='M11.48 10.326a.75.75 0 0 0-.96-1.152l-1.77 1.475V3.75a.75.75 0 0 0-1.5 0v6.899L5.48 9.174a.75.75 0 0 0-.96 1.152l3 2.5a.75.75 0 0 0 .96 0l3-2.5Z' />
                </svg>
              </ButtonGroup.Item>
              <div className='bg-bg-soft-200 h-3.5 w-px' style={{ marginInline: "1px" }} />
              <ButtonGroup.Item
                className='size-7 border-none p-0 last:rounded-r-full disabled:bg-transparent'
                disabled={currentIndex <= 0}
                onClick={() => router.push(`/issues/${issues[currentIndex - 1].id}`)}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='size-3.5'
                >
                  <path d='M11.48 5.674a.75.75 0 1 1-.96 1.152L8.75 5.351v6.899a.75.75 0 0 1-1.5 0V5.351L5.48 6.826a.75.75 0 0 1-.96-1.152l3-2.5a.75.75 0 0 1 .96 0l3 2.5Z' />
                </svg>
              </ButtonGroup.Item>
            </ButtonGroup.Root>
          </div>
        </div>

        {/* Body */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Left: content */}
          <div className='flex-1'>
            <div className='mx-auto max-w-[80ch] overflow-auto p-6 pt-10'>
              <h1 className='text-label-xl text-text-strong-950 mb-4 font-semibold'>
                {issue.title}
              </h1>

              {/* Metadata strip */}
              <div className='border-stroke-soft-200 mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y p-4'>
                <MetaItem icon={RiAlertLine} label='Severity'>
                  <span className={severityColor(meta.severity)}>{meta.severity}</span>
                </MetaItem>
                <div className='bg-bg-soft-200 h-3.5 w-px' style={{ marginInline: "8px" }} />
                <MetaItem icon={RiServerLine} label='Environment'>
                  {meta.environment ?? "—"}
                </MetaItem>
                <div className='bg-bg-soft-200 h-3.5 w-px' style={{ marginInline: "8px" }} />
                <MetaItem icon={RiCpuLine} label='Model'>
                  {meta.model ?? "—"}
                </MetaItem>
                <div className='bg-bg-soft-200 h-3.5 w-px' style={{ marginInline: "8px" }} />
                <MetaItem icon={RiMoneyDollarCircleLine} label='Cost so far'>
                  {meta.cost != null ? `$${meta.cost.toFixed(4)}` : "—"}
                </MetaItem>
              </div>

              <div className='text-paragraph-sm text-text-strong-950 leading-relaxed'>
                {issue.description ? (
                  <Markdown>{issue.description}</Markdown>
                ) : (
                  <span className='text-text-soft-400'>No description.</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: accordion panel */}
          <div className='flex w-72 flex-col overflow-auto px-2.5'>
            {/* Copy actions */}
            <div className='flex h-11 min-h-11 items-center justify-end gap-2'>
              <CopyButton
                text={`${typeof window !== "undefined" ? window.location.origin : ""}/issues/${issue.id}`}
                tooltip='Copy issue URL'
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='size-3.5'
                >
                  <path d='M9.30558 10.206C9.57224 10.4726 9.59447 10.8912 9.37225 11.1831L9.30558 11.2594L6.84751 13.7175C5.58692 14.9781 3.54311 14.9781 2.28252 13.7175C1.0654 12.5004 1.02344 10.5531 2.15661 9.28564L2.28252 9.15251L4.74059 6.69443C5.0315 6.40353 5.50315 6.40353 5.79405 6.69443C6.06071 6.9611 6.08294 7.37963 5.86072 7.67161L5.79405 7.74789L3.33598 10.206C2.6572 10.8847 2.6572 11.9853 3.33598 12.664C3.98082 13.3089 5.00628 13.3411 5.68918 12.7608L5.79405 12.664L8.25212 10.206C8.54303 9.91506 9.01468 9.91506 9.30558 10.206ZM9.82982 6.17019C10.1207 6.46109 10.1207 6.93274 9.82982 7.22365L7.34921 9.70427C7.0583 9.99518 6.58665 9.99518 6.29575 9.70427C6.00484 9.41337 6.00484 8.94172 6.29575 8.65081L8.77637 6.17019C9.06727 5.87928 9.53892 5.87928 9.82982 6.17019ZM13.7175 2.2825C14.9346 3.49962 14.9766 5.44688 13.8434 6.71436L13.7175 6.84749L11.2594 9.30557C10.9685 9.59647 10.4969 9.59647 10.206 9.30557C9.93931 9.03891 9.91709 8.62037 10.1393 8.32839L10.206 8.25211L12.664 5.79403C13.3428 5.11525 13.3428 4.01474 12.664 3.33596C12.0192 2.69112 10.9938 2.65888 10.3109 3.23923L10.206 3.33596L7.74791 5.79403C7.457 6.08494 6.98535 6.08494 6.69445 5.79403C6.42779 5.52737 6.40556 5.10883 6.62778 4.81686L6.69445 4.74057L9.15252 2.2825C10.4131 1.02191 12.4569 1.02191 13.7175 2.2825Z' />
                </svg>
              </CopyButton>
              <CopyButton text={issue.id} tooltip='Copy issue ID'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='size-3.5'
                >
                  <path d='M10.957 1.8643C11.4444 2.31542 11.0188 3 10.3547 3c-.2436 0-.47136-.10549-.67781-.23466C9.40812 2.59719 9.09041 2.5 8.75 2.5h-4.5c-.47683 0-.90911.1907-1.22475.5H3v.02525c-.3093.31564-.5.74792-.5 1.22475v4.5c0 .34041.09719.65812.26534.92689C2.8945 9.88334 3 10.1111 3 10.3547c0 .6641-.68458 1.0897-1.1357.6023C1.32786 10.3775 1 9.60202 1 8.75v-4.5C1 2.45507 2.45507 1 4.25 1h4.5c.85202 0 1.6275.32786 2.207.8643ZM11.8284 8.34533c.3757.7514.406 1.62906.0829 2.40447l-.0815.1957c-.2018.4842-.6749.7996-1.1994.7996h-.1255V7.75506h.3685c.4044 0 .7742.22851.955.59027Z' />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M11.7499 14.9999c1.795 0 3.25-1.455 3.25-3.25V7.24994c0-1.79492-1.455-3.25-3.25-3.25H7.24994c-1.79492 0-3.25 1.45508-3.25 3.25v4.49996c0 1.795 1.45508 3.25 3.25 3.25h4.49996ZM7.24995 6.24506c.41697 0 .755.33802.755.755v5.50004c0 .4169-.33803.755-.755.755-.41698 0-.755-.3381-.755-.755V7.00006c0-.41698.33802-.755.755-.755Zm6.05515 5.08554c.4919-1.1805.4459-2.51666-.1261-3.66056-.4366-.87332-1.3292-1.42498-2.3056-1.42498H9.74992c-.41697 0-.755.33802-.755.755v5.50004c0 .4169.33803.755.755.755h.88048c1.1341 0 2.157-.682 2.5932-1.7289l.0815-.1956Z'
                  />
                </svg>
              </CopyButton>
            </div>

            {/* Accordions */}
            <Accordion.Root
              type='multiple'
              defaultValue={["properties", "labels", "details"]}
              className='space-y-2'
            >
              {/* Properties */}
              <Accordion.Item
                value='properties'
                className='bg-bg-white-0 data-[state=open]:bg-bg-white-0 border-stroke-soft-200 rounded-xl border shadow-none'
              >
                <Accordion.Trigger className='flex items-center gap-1 text-[13px]'>
                  Properties
                  <Accordion.Arrow openIcon={RiArrowDropDownFill} closeIcon={RiArrowDropUpFill} />
                </Accordion.Trigger>
                <Accordion.Content className='mt-3 space-y-3'>
                  <PropertyRow label='Status'>
                    <Select.Root
                      size='xxsmall'
                      value={issue.status}
                      onValueChange={(v) => updateIssue(issue.id, { status: v as IssueStatus })}
                    >
                      <Select.Trigger className='w-full'>
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

                  <PropertyRow label='Priority'>
                    <Select.Root
                      size='xxsmall'
                      value={issue.priority}
                      onValueChange={(v) => updateIssue(issue.id, { priority: v as IssuePriority })}
                    >
                      <Select.Trigger className='w-full'>
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
                </Accordion.Content>
              </Accordion.Item>

              {/* Labels */}
              <Accordion.Item
                value='labels'
                className='bg-bg-white-0 data-[state=open]:bg-bg-white-0 border-stroke-soft-200 rounded-xl border shadow-none'
              >
                <Accordion.Trigger className='flex items-center gap-1 text-[13px]'>
                  Labels
                  <Accordion.Arrow openIcon={RiArrowDropDownFill} closeIcon={RiArrowDropUpFill} />
                </Accordion.Trigger>
                <Accordion.Content className='mt-3 space-y-2'>
                  <Select.Root
                    size='xxsmall'
                    value={issue.labels[0] ?? "none"}
                    onValueChange={(v) =>
                      updateIssue(issue.id, { labels: v === "none" ? [] : [v as IssueLabel] })
                    }
                  >
                    <Select.Trigger className='w-full'>
                      <Select.Value placeholder='Add label' />
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
                  {issue.labels.length > 0 && (
                    <div className='flex flex-wrap gap-1.5'>
                      {issue.labels.map((l) => (
                        <span
                          key={l}
                          className='bg-bg-weak-50 text-text-sub-600 ring-stroke-soft-200 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset'
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </Accordion.Content>
              </Accordion.Item>

              {/* Details */}
              <Accordion.Item
                value='details'
                className='bg-bg-white-0 data-[state=open]:bg-bg-white-0 border-stroke-soft-200 rounded-xl border shadow-none'
              >
                <Accordion.Trigger className='flex h-8 items-center gap-1 text-[13px]'>
                  Details
                  <Accordion.Arrow openIcon={RiArrowDropDownFill} closeIcon={RiArrowDropUpFill} />
                </Accordion.Trigger>
                <Accordion.Content className='mt-3 space-y-3'>
                  <PropertyRow label='Project'>
                    <Select.Root
                      size='xxsmall'
                      value={issue.project ?? "none"}
                      onValueChange={(v) =>
                        updateIssue(issue.id, { project: v === "none" ? null : v })
                      }
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

                  {issue.traceId && (
                    <PropertyRow label='Trace'>
                      <Link
                        href={`/traces/${issue.traceId}`}
                        className='text-label-xs text-text-strong-950 inline-flex items-center gap-1 hover:underline'
                      >
                        <RiExternalLinkLine className='size-3' />
                        {issue.traceId}
                      </Link>
                    </PropertyRow>
                  )}

                  <PropertyRow label='Created'>
                    <span className='text-label-xs text-text-sub-600'>
                      {new Date(issue.createdAt).toLocaleString()}
                    </span>
                  </PropertyRow>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between gap-2'>
      <span className='text-text-sub-600 w-16 shrink-0 text-xs font-medium'>{label}</span>
      <div className='flex-1'>{children}</div>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-1 items-center'>
      <div className='flex items-center gap-1'>
        <Icon className='text-text-soft-400 size-4 shrink-0' />
        <span className='text-text-soft-400 text-xs font-medium text-nowrap'>{label} :</span>
      </div>
      <span className='text-text-strong-950 ml-2 text-xs font-medium tabular-nums'>{children}</span>
    </div>
  );
}

function severityColor(severity: string): string {
  switch (severity) {
    case "Critical":
    case "High":
      return "text-error-base";
    case "Medium":
      return "text-warning-base";
    case "Low":
      return "text-success-base";
    default:
      return "text-text-sub-600";
  }
}
