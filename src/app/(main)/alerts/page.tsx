"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  RiAlarmWarningLine,
  RiArrowRightSLine,
  RiCheckboxCircleFill,
  RiEyeLine,
  RiLayoutLeft2Line,
  RiSearchEyeLine,
} from "@remixicon/react";
import { cn } from "@/utils";

import slackCards from "@/data/slack-cards.json";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as HorizontalStepper from "@/components/ui/horizontal-stepper";

type SlackBlock = (typeof slackCards.messages)[number]["blocks"][number];

// Group messages by traceId to show lifecycle
const groupedByTrace = slackCards.messages.reduce(
  (acc, msg) => {
    if (!acc[msg.traceId]) acc[msg.traceId] = [];
    acc[msg.traceId].push(msg);
    return acc;
  },
  {} as Record<string, typeof slackCards.messages>,
);

const LIFECYCLE_STEPS = ["alert", "investigating", "triage", "resolved"] as const;
const LIFECYCLE_ICONS = {
  alert: RiAlarmWarningLine,
  investigating: RiSearchEyeLine,
  triage: RiEyeLine,
  resolved: RiCheckboxCircleFill,
};

// Slack mrkdwn → React
function renderMrkdwn(text: string) {
  // Replace emoji shortcodes
  let processed = text
    .replace(/:rotating_light:/g, "🚨")
    .replace(/:white_check_mark:/g, "✅")
    .replace(/:mag:/g, "🔍")
    .replace(/:eyes:/g, "👀")
    .replace(/:warning:/g, "⚠️")
    .replace(/:red_circle:/g, "🔴")
    .replace(/:large_orange_circle:/g, "🟠")
    .replace(/:thumbsdown:/g, "👎")
    .replace(/:clock3:/g, "🕒")
    .replace(/:github:/g, "🐙");

  // Links: <url|label>
  processed = processed.replace(/<(https?:\/\/[^|>]+)\|([^>]+)>/g, '[$2]($1)');
  processed = processed.replace(/<(https?:\/\/[^>]+)>/g, '[$1]($1)');

  // Code blocks
  const parts = processed.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^[a-z]+\n/, "");
      return (
        <pre key={i} className="rounded-lg bg-bg-weak-50 border border-stroke-soft-200 p-3 text-paragraph-xs font-mono overflow-x-auto my-2">
          {code}
        </pre>
      );
    }
    // Inline formatting
    const formatted = part
      .replace(/\*([^*]+)\*/g, '<b>$1</b>')
      .replace(/_([^_]+)_/g, '<i>$1</i>')
      .replace(/`([^`]+)`/g, '<code class="rounded bg-bg-weak-50 px-1 py-0.5 text-paragraph-xs font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-base hover:underline" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, "<br />");

    return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

function SlackCard({ blocks }: { blocks: SlackBlock[] }) {
  return (
    <div className="rounded-lg border-l-4 border-l-stroke-strong-950 border border-stroke-soft-200 bg-bg-white-0 p-4 space-y-3">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header":
            return (
              <div key={i} className="text-label-md text-text-strong-950">
                {renderMrkdwn((block as { text: { text: string } }).text.text)}
              </div>
            );
          case "context":
            return (
              <div key={i} className="flex items-center gap-2 text-paragraph-xs text-text-soft-400">
                {(block as { elements: { type: string; text?: string }[] }).elements.map((el, j) =>
                  el.type === "mrkdwn" ? (
                    <span key={j}>{renderMrkdwn(el.text ?? "")}</span>
                  ) : null,
                )}
              </div>
            );
          case "section": {
            const section = block as { text?: { text: string }; fields?: { text: string }[] };
            return (
              <div key={i} className="space-y-2">
                {section.text && (
                  <div className="text-paragraph-sm text-text-sub-600">
                    {renderMrkdwn(section.text.text)}
                  </div>
                )}
                {section.fields && (
                  <div className="grid grid-cols-2 gap-2">
                    {section.fields.map((f, j) => (
                      <div key={j} className="text-paragraph-xs text-text-sub-600">
                        {renderMrkdwn(f.text)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          case "divider":
            return <hr key={i} className="border-stroke-soft-200" />;
          case "actions":
            return (
              <div key={i} className="flex flex-wrap items-center gap-2">
                {(block as { elements: { type: string; text?: { text: string }; style?: string; url?: string; placeholder?: { text: string }; options?: { text: { text: string }; value: string }[] }[] }).elements.map((el, j) => {
                  if (el.type === "button") {
                    const variant = el.style === "primary" ? "bg-success-base text-static-white hover:bg-green-700" :
                      el.style === "danger" ? "bg-error-base text-static-white hover:bg-red-700" :
                      "border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-50";
                    return (
                      <button key={j} className={cn("rounded-md px-3 py-1.5 text-paragraph-xs font-medium transition-colors", variant)}>
                        {el.text?.text}
                      </button>
                    );
                  }
                  if (el.type === "static_select") {
                    return (
                      <select key={j} className="rounded-md border border-stroke-soft-200 bg-bg-white-0 px-2 py-1.5 text-paragraph-xs text-text-sub-600">
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
  const traceIds = Object.keys(groupedByTrace);
  const [selectedTrace, setSelectedTrace] = useState(traceIds[0]);

  const messages = useMemo(
    () => (groupedByTrace[selectedTrace] ?? []).sort(
      (a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime(),
    ),
    [selectedTrace],
  );

  const currentLifecycles = messages.map((m) => m.lifecycle);
  const latestLifecycle = currentLifecycles[currentLifecycles.length - 1];

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
            <Breadcrumb.Item className="text-[13px]!" active>Alerts</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        {/* Body - split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: trace list */}
          <div className="w-72 shrink-0 border-r border-stroke-soft-200 overflow-auto">
            <div className="p-2">
              <h3 className="text-label-xs text-text-soft-400 px-2 py-1 uppercase">Alert Traces</h3>
              {traceIds.map((trId) => {
                const msgs = groupedByTrace[trId];
                const alertMsg = msgs.find((m) => m.lifecycle === "alert");
                const headerBlock = alertMsg?.blocks.find((b) => b.type === "header") as { text: { text: string } } | undefined;
                const title = headerBlock?.text.text.replace(/:[a-z_]+:/g, "").trim() ?? trId;

                return (
                  <button
                    key={trId}
                    onClick={() => setSelectedTrace(trId)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left transition-colors",
                      selectedTrace === trId ? "bg-bg-weak-50" : "hover:bg-bg-weak-50",
                    )}
                  >
                    <p className="text-label-sm text-text-strong-950 line-clamp-1 m-0">{title}</p>
                    <p className="text-paragraph-xs text-text-soft-400 m-0 mt-0.5 font-mono">{trId}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: lifecycle + cards */}
          <div className="flex-1 overflow-auto p-6">
            {/* Lifecycle stepper */}
            <div className="mb-6">
              <HorizontalStepper.Root className="justify-start">
                {LIFECYCLE_STEPS.map((step, i) => {
                  const isCompleted = currentLifecycles.includes(step) && step !== latestLifecycle;
                  const isActive = step === latestLifecycle;
                  const state = isCompleted ? "completed" : isActive ? "active" : "default";
                  const Icon = LIFECYCLE_ICONS[step];

                  return (
                    <React.Fragment key={step}>
                      {i > 0 && <HorizontalStepper.SeparatorIcon />}
                      <HorizontalStepper.Item state={state}>
                        <HorizontalStepper.ItemIndicator state={state}>
                          {state !== "completed" && <Icon className="size-3" />}
                        </HorizontalStepper.ItemIndicator>
                        <span className="capitalize">{step}</span>
                      </HorizontalStepper.Item>
                    </React.Fragment>
                  );
                })}
              </HorizontalStepper.Root>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-label-xs text-text-soft-400 capitalize">{msg.lifecycle}</span>
                    <span className="text-paragraph-xs text-text-soft-400">
                      {new Date(msg.postedAt).toLocaleString()}
                    </span>
                    <span className="text-paragraph-xs text-text-soft-400">· #{msg.channel}</span>
                  </div>
                  <SlackCard blocks={msg.blocks} />
                </div>
              ))}
            </div>

            {/* Link to trace */}
            <div className="mt-6">
              <Link
                href={`/traces/${selectedTrace}`}
                className="inline-flex items-center gap-1.5 text-paragraph-sm text-primary-base hover:underline"
              >
                View trace →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
