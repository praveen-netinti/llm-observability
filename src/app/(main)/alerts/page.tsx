"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";
import { useIssues } from "@/contexts/issues-context";
import {
  RiArrowRightSLine,
  RiLayoutLeft2Line,
} from "@remixicon/react";
import { cn } from "@/utils";

import slackCards from "@/data/slack-cards.json";
import { renderMrkdwn } from "@/lib/render-mrkdwn";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";

import { IconUserBox } from "../traces/layout";

type SlackBlock = (typeof slackCards.messages)[number]["blocks"][number];

const groupedByTrace = slackCards.messages.reduce(
  (acc, msg) => {
    if (!acc[msg.traceId]) acc[msg.traceId] = [];
    acc[msg.traceId].push(msg);
    return acc;
  },
  {} as Record<string, typeof slackCards.messages>,
);

const LIFECYCLE_COLOR: Record<string, string> = {
  alert: "bg-error-base",
  investigating: "bg-warning-base",
  triage: "bg-information-base",
  resolved: "bg-success-base",
};

function SlackCard({ blocks }: { blocks: SlackBlock[] }) {
  return (
    <div className='space-y-2.5'>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header":
            return (
              <div key={i} className='text-label-sm text-text-strong-950'>
                {renderMrkdwn((block as { text: { text: string } }).text.text)}
              </div>
            );
          case "context":
            return (
              <div key={i} className='flex flex-wrap items-center gap-1.5 text-[11px] text-text-soft-400'>
                {(block as { elements: { type: string; text?: string }[] }).elements.map((el, j) =>
                  el.type === "mrkdwn" ? <span key={j}>{renderMrkdwn(el.text ?? "")}</span> : null,
                )}
              </div>
            );
          case "section": {
            const section = block as { text?: { text: string }; fields?: { text: string }[] };
            return (
              <div key={i} className='space-y-2'>
                {section.text && (
                  <div className='text-paragraph-xs text-text-sub-600'>
                    {renderMrkdwn(section.text.text)}
                  </div>
                )}
                {section.fields && (
                  <div className='grid grid-cols-2 gap-x-4 gap-y-1.5'>
                    {section.fields.map((f, j) => (
                      <div key={j} className='text-[11px] text-text-sub-600'>
                        {renderMrkdwn(f.text)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          case "divider":
            return <div key={i} className='h-px bg-stroke-soft-200' />;
          case "actions":
            return (
              <div key={i} className='flex flex-wrap items-center gap-1.5 pt-0.5'>
                {(block as { elements: { type: string; text?: { text: string }; style?: string; placeholder?: { text: string }; options?: { text: { text: string }; value: string }[] }[] }).elements.map((el, j) => {
                  if (el.type === "button") {
                    const cls = el.style === "primary"
                      ? "bg-success-base text-static-white hover:bg-green-700"
                      : el.style === "danger"
                        ? "bg-error-base text-static-white hover:bg-red-700"
                        : "shadow-custom-input-2 text-text-sub-600 hover:bg-bg-weak-50";
                    return (
                      <button key={j} className={cn("rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors", cls)}>
                        {el.text?.text}
                      </button>
                    );
                  }
                  if (el.type === "static_select") {
                    return (
                      <select key={j} className='shadow-custom-input-2 rounded-lg px-2 py-1 text-[11px] text-text-sub-600 outline-none'>
                        <option>{el.placeholder?.text}</option>
                        {el.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.text.text}</option>
                        ))}
                      </select>
                    );
                  }
                  return null;
                })}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default function AlertsPage() {
  const { onMenuClick } = useSidebar();
  const { addIssue } = useIssues();
  const router = useRouter();
  const traceIds = Object.keys(groupedByTrace);
  const [selectedTrace, setSelectedTrace] = useState(traceIds[0]);

  const messages = useMemo(
    () => (groupedByTrace[selectedTrace] ?? []).sort(
      (a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime(),
    ),
    [selectedTrace],
  );

  const currentLifecycles = messages.map((m) => m.lifecycle);

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 flex h-full flex-col lg:rounded-2xl lg:border'>
        {/* Header */}
        <div className='border-faded-lighter dark:border-stroke-soft-200 flex h-11 items-center border-b px-2'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={onMenuClick}
            className='size-7 cursor-pointer rounded-lg p-0 lg:hidden'
          >
            <Button.Icon as={RiLayoutLeft2Line} className='text-text-soft-400' />
          </Button.Root>
          <Breadcrumb.Root className='ml-2.5 gap-0.5'>
            <Breadcrumb.Item className='text-[13px]!'>
              <Breadcrumb.Icon as={IconUserBox} className='size-4' />
              Praveen-netinti
            </Breadcrumb.Item>
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item className='text-[13px]!' active>Alerts</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        {/* Body */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Left: trace list */}
          <div className='no-scrollbar w-60 shrink-0 overflow-auto border-r border-stroke-soft-200'>
            <div className='p-1'>
              {traceIds.map((trId) => {
                const msgs = groupedByTrace[trId];
                const alertMsg = msgs.find((m) => m.lifecycle === "alert");
                const headerBlock = alertMsg?.blocks.find((b) => b.type === "header") as { text: { text: string } } | undefined;
                const title = headerBlock?.text.text.replace(/:[a-z_]+:/g, "").trim() ?? trId;
                const latestStep = msgs[msgs.length - 1]?.lifecycle;
                const isActive = selectedTrace === trId;

                return (
                  <button
                    key={trId}
                    onClick={() => setSelectedTrace(trId)}
                    className={cn(
                      "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors",
                      isActive ? "bg-bg-weak-50" : "hover:bg-bg-weak-50",
                    )}
                  >
                    <span className='text-[13px] font-medium text-text-strong-950 line-clamp-1'>{title}</span>
                    <div className='mt-0.5 flex items-center gap-1.5'>
                      <span className={cn("size-1.5 rounded-full", LIFECYCLE_COLOR[latestStep] ?? "bg-text-soft-400")} />
                      <span className='text-[11px] font-mono text-text-soft-400'>{trId.replace("trace_", "")}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: timeline */}
          <div className='no-scrollbar flex-1 overflow-auto'>
            <div className='mx-auto max-w-[680px] px-6 py-8'>
              {/* Lifecycle timeline */}
              <div className='relative pl-5'>
                {/* Vertical line */}
                <div className='absolute top-2 bottom-2 left-[7px] w-px bg-stroke-soft-200' />

                {messages.map((msg, idx) => {
                  const isLast = idx === messages.length - 1;
                  return (
                    <div key={msg.id} className='relative pb-6 last:pb-0'>
                      {/* Dot */}
                      <div className={cn(
                        "absolute left-[-13px] top-1.5 size-2 rounded-full ring-2 ring-bg-white-0",
                        LIFECYCLE_COLOR[msg.lifecycle] ?? "bg-text-soft-400",
                      )} />

                      {/* Content */}
                      <div className='ml-3'>
                        <div className='mb-1.5 flex items-center gap-2'>
                          <span className='text-[11px] font-medium capitalize text-text-sub-600'>{msg.lifecycle}</span>
                          <span className='text-[11px] text-text-soft-400'>
                            {new Date(msg.postedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className='text-[11px] text-text-disabled-300'>#{msg.channel}</span>
                        </div>
                        <div className='rounded-xl border border-stroke-soft-200 p-3.5'>
                          <SlackCard blocks={msg.blocks} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className='mt-6 flex items-center gap-2 pl-8'>
                <Link href={`/traces/${selectedTrace}`}>
                  <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                    View trace
                  </Button.Root>
                </Link>
                <Button.Root
                  variant='primary'
                  mode='filled'
                  size='xsmall'
                  onClick={() => {
                    const alertMsg = messages.find((m) => m.lifecycle === "alert");
                    const headerBlock = alertMsg?.blocks.find((b) => b.type === "header") as { text: { text: string } } | undefined;
                    const sectionBlock = alertMsg?.blocks.find((b) => b.type === "section") as { text?: { text: string } } | undefined;
                    addIssue({
                      title: headerBlock?.text.text.replace(/:[a-z_]+:/g, "").trim() ?? "Alert issue",
                      description: sectionBlock?.text?.text ?? "",
                      status: "todo",
                      priority: "high",
                      assignee: null,
                      labels: ["bug"],
                      project: null,
                      traceId: selectedTrace,
                    });
                    router.push("/issues/all");
                  }}
                >
                  Create issue
                </Button.Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
