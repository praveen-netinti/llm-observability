"use client";

import React, { useMemo, useState } from "react";
import { useIssues } from "@/contexts/issues-context";
import { useSidebar } from "@/contexts/sidebar-context";
import slackCards from "@/data/slack-cards.json";
import {
  RiArrowRightSLine,
  RiFlaskLine,
  RiGitMergeLine,
  RiLayoutLeft2Line,
  RiNotificationOffLine,
} from "@remixicon/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { notification } from "@/hooks/use-notification";

import {
  SlackBlocks,
  type SlackActionContext,
  type SlackBlock,
} from "@/components/slack/slack-card";
import * as Badge from "@/components/ui/badge";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import { plainText } from "@/components/ui/markdown";

import { IconUserBox } from "../traces/layout";

const groupedByTrace = slackCards.messages.reduce(
  (acc, msg) => {
    if (!acc[msg.traceId]) acc[msg.traceId] = [];
    acc[msg.traceId].push(msg);
    return acc;
  },
  {} as Record<string, typeof slackCards.messages>,
);

const LIFECYCLE_BADGE_COLOR: Record<string, "red" | "orange" | "blue" | "green"> = {
  alert: "red",
  investigating: "orange",
  triage: "blue",
  resolved: "green",
};

export default function AlertsPage() {
  const { onMenuClick } = useSidebar();
  const { addIssue } = useIssues();
  const router = useRouter();
  const traceIds = Object.keys(groupedByTrace);
  const [selectedTrace, setSelectedTrace] = useState(traceIds[0]);

  const messages = useMemo(
    () =>
      (groupedByTrace[selectedTrace] ?? []).sort(
        (a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime(),
      ),
    [selectedTrace],
  );

  const handleSlackAction = (actionId: string, ctx: SlackActionContext) => {
    switch (actionId) {
      case "view_trace":
        router.push(`/traces/${selectedTrace}`);
        break;
      case "view_pr":
        if (ctx.url) window.open(ctx.url, "_blank", "noopener,noreferrer");
        break;
      case "create_issue": {
        const alertMsg = messages.find((m) => m.lifecycle === "alert");
        const blocks = (alertMsg?.blocks ?? []) as unknown as SlackBlock[];
        const headerBlock = blocks.find((b) => b.type === "header") as
          | Extract<SlackBlock, { type: "header" }>
          | undefined;
        const sectionBlock = blocks.find((b) => b.type === "section" && "text" in b && b.text) as
          | Extract<SlackBlock, { type: "section" }>
          | undefined;
        addIssue({
          title: headerBlock
            ? plainText(headerBlock.text.text)
                .replace(/^[^\w]+/, "")
                .trim()
            : "Alert issue",
          description: sectionBlock?.text?.text ?? "",
          status: "todo",
          priority: "high",
          assignee: null,
          labels: ["bug"],
          project: null,
          traceId: selectedTrace,
        });
        router.push("/issues/all");
        break;
      }
      case "mute_alert":
        notification({
          status: "information",
          variant: "stroke",
          icon: RiNotificationOffLine,
          title: "Alert muted",
          description: "Notifications paused for this trace.",
          duration: 4000,
        });
        break;
      case "approve_merge":
        notification({
          status: "success",
          variant: "stroke",
          icon: RiGitMergeLine,
          title: "Merge approved",
          description: "The fix has been queued to merge.",
          duration: 4000,
        });
        break;
      case "add_to_evalset":
        notification({
          status: "feature",
          variant: "stroke",
          icon: RiFlaskLine,
          title: "Added to eval set",
          description: "This run was added to the evaluation set.",
          duration: 4000,
        });
        break;
      case "merge_strategy":
        notification({
          status: "information",
          variant: "stroke",
          title: "Merge strategy set",
          description: `Strategy: ${ctx.label}.`,
          duration: 3000,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className='flex h-full flex-col select-none lg:p-2 lg:pl-0'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 flex h-full flex-col lg:rounded-2xl lg:border'>
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
            <Breadcrumb.Item className='text-[13px]!' active>
              Alerts
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>
        <div className='no-scrollbar h-full flex-1 overflow-auto'>
          <div className='mr-auto max-w-140 px-6 py-8'>
            <div className='relative'>
              {messages.map((msg) => (
                <div key={msg.id} className='relative pb-6 last:pb-0'>
                  <div className='flex flex-row'>
                    <div>
                      <Image
                        width={32}
                        height={32}
                        src='/neosigma-icon.png'
                        alt=''
                        className='mt-1 h-6! min-h-6 w-6! min-w-6'
                      />
                    </div>
                    <div className='ml-2'>
                      <div className='mb-1.5 flex items-center gap-2'>
                        <span className='text-label-sm font-semibold'>NeoSigma</span>
                        <Badge.Root
                          size='small'
                          variant='lighter'
                          color={LIFECYCLE_BADGE_COLOR[msg.lifecycle] ?? "gray"}
                          className='capitalize'
                        >
                          {/* <Badge.Dot /> */}
                          {msg.lifecycle}
                        </Badge.Root>
                        <span className='text-text-sub-600 text-[11px]'>
                          {new Date(msg.postedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className='text-text-soft-400 text-[11px]'>{msg.channel}</span>
                      </div>
                      <div className='border-faded-lighter rounded-xl border p-3.5'>
                        <SlackBlocks
                          blocks={msg.blocks as unknown as SlackBlock[]}
                          onAction={handleSlackAction}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
