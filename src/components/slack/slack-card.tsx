"use client";

import * as React from "react";
import {
  RiAddLine,
  RiExternalLinkLine,
  RiFlaskLine,
  RiGitMergeLine,
  RiGitPullRequestLine,
  RiNotificationOffLine,
} from "@remixicon/react";

import { cn } from "@/utils/cn";

import * as Button from "@/components/ui/button";
import { Markdown, plainText } from "@/components/ui/markdown";
import * as Select from "@/components/ui/select";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type TextObject = { type: "plain_text" | "mrkdwn"; text: string; emoji?: boolean };

type ButtonElement = {
  type: "button";
  text: TextObject;
  url?: string;
  style?: "primary" | "danger";
  action_id: string;
};

type SelectOption = { text: TextObject; value: string };

type StaticSelectElement = {
  type: "static_select";
  placeholder: TextObject;
  action_id: string;
  options: SelectOption[];
};

type ImageElement = { type: "image"; image_url: string; alt_text: string };

type ContextElement = ({ type: "mrkdwn" | "plain_text"; text: string } | ImageElement) & {
  type: string;
};

type ActionElement = ButtonElement | StaticSelectElement;

export type SlackBlock =
  | { type: "header"; text: TextObject }
  | { type: "context"; elements: ContextElement[] }
  | { type: "section"; text?: TextObject; fields?: TextObject[] }
  | { type: "divider" }
  | { type: "actions"; elements: ActionElement[] };

export type SlackActionContext = { url?: string; value?: string; label: string };
export type SlackActionHandler = (actionId: string, ctx: SlackActionContext) => void;

/* -------------------------------------------------------------------------- */
/*                              Action registry                               */
/* -------------------------------------------------------------------------- */

/** Per-`action_id` affordances: leading icon + button treatment. */
const ACTION_META: Record<
  string,
  { icon?: React.ElementType; variant?: "primary" | "neutral" | "error"; mode?: "filled" | "stroke" | "lighter" }
> = {
  view_trace: { icon: RiExternalLinkLine, variant: "neutral", mode: "stroke" },
  view_pr: { icon: RiGitPullRequestLine, variant: "neutral", mode: "stroke" },
  create_issue: { icon: RiAddLine },
  approve_merge: { icon: RiGitMergeLine },
  mute_alert: { icon: RiNotificationOffLine, variant: "error", mode: "lighter" },
  add_to_evalset: { icon: RiFlaskLine, variant: "neutral", mode: "stroke" },
};

/** Map Slack's `style` to button variant/mode, with action overrides on top. */
function buttonTreatment(el: ButtonElement) {
  const meta = ACTION_META[el.action_id] ?? {};
  if (el.style === "primary") return { variant: "primary" as const, mode: "filled" as const, ...stripUndefined(meta) };
  if (el.style === "danger") return { variant: "error" as const, mode: "lighter" as const, ...stripUndefined(meta) };
  return { variant: meta.variant ?? "neutral", mode: meta.mode ?? "stroke", icon: meta.icon };
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

/* -------------------------------------------------------------------------- */
/*                              Interactive bits                              */
/* -------------------------------------------------------------------------- */

function SlackButton({
  el,
  size,
  onAction,
}: {
  el: ButtonElement;
  size: "xxsmall" | "xsmall";
  onAction?: SlackActionHandler;
}) {
  const { variant, mode, icon: Icon } = buttonTreatment(el);
  const label = plainText(el.text.text);

  const handle = () => {
    if (onAction) onAction(el.action_id, { url: el.url, label });
    else if (el.url) window.open(el.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Button.Root variant={variant} mode={mode} size={size} onClick={handle} className='cursor-pointer'>
      {Icon && <Button.Icon as={Icon} />}
      {label}
    </Button.Root>
  );
}

function SlackSelect({
  el,
  size,
  onAction,
}: {
  el: StaticSelectElement;
  size: "xxsmall" | "xsmall";
  onAction?: SlackActionHandler;
}) {
  const [value, setValue] = React.useState<string>("");

  return (
    <Select.Root
      size={size}
      value={value || undefined}
      onValueChange={(v) => {
        setValue(v);
        const label = plainText(el.options.find((o) => o.value === v)?.text.text ?? v);
        onAction?.(el.action_id, { value: v, label });
      }}
    >
      <Select.Trigger className='w-fit'>
        <Select.Value placeholder={plainText(el.placeholder.text)} />
      </Select.Trigger>
      <Select.Content>
        {el.options.map((opt) => (
          <Select.Item key={opt.value} value={opt.value}>
            {plainText(opt.text.text)}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Block renderer                               */
/* -------------------------------------------------------------------------- */

export type SlackBlocksProps = {
  blocks: SlackBlock[];
  onAction?: SlackActionHandler;
  /** Tighter sizing for the notification toast vs. the full alerts page. */
  density?: "comfortable" | "compact";
  className?: string;
};

/**
 * Faithfully renders an array of Slack Block Kit blocks using the design
 * system. Supports `header`, `context`, `section` (text + 2-col fields),
 * `divider`, and `actions` (button + static_select).
 */
export function SlackBlocks({ blocks, onAction, density = "comfortable", className }: SlackBlocksProps) {
  const compact = density === "compact";
  const btnSize = compact ? "xxsmall" : "xsmall";

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-2.5", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header":
            return (
              <h3
                key={i}
                className={cn(
                  "text-text-strong-950 font-semibold",
                  compact ? "text-label-sm" : "text-label-md",
                )}
              >
                {plainText(block.text.text)}
              </h3>
            );

          case "context":
            return (
              <div
                key={i}
                className='text-text-soft-400 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]'
              >
                {block.elements.map((el, j) =>
                  el.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={j}
                      src={(el as ImageElement).image_url}
                      alt={(el as ImageElement).alt_text}
                      className='ring-stroke-soft-200 size-4 rounded-full object-cover ring-1'
                    />
                  ) : (
                    <Markdown key={j} inline className='[&_*]:text-[11px]'>
                      {(el as { text: string }).text}
                    </Markdown>
                  ),
                )}
              </div>
            );

          case "section":
            return (
              <div key={i} className='space-y-2'>
                {block.text && (
                  <Markdown
                    className={cn(
                      "text-text-sub-600 leading-relaxed",
                      compact ? "text-paragraph-xs" : "text-paragraph-sm",
                    )}
                  >
                    {block.text.text}
                  </Markdown>
                )}
                {block.fields && (
                  <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                    {block.fields.map((f, j) => (
                      <Markdown
                        key={j}
                        className='text-text-sub-600 text-[11px] leading-snug [&_br]:hidden [&_strong]:mb-0.5 [&_strong]:block [&_strong]:text-[10px] [&_strong]:font-medium [&_strong]:tracking-wide [&_strong]:text-text-soft-400 [&_strong]:uppercase'
                      >
                        {f.text}
                      </Markdown>
                    ))}
                  </div>
                )}
              </div>
            );

          case "divider":
            return <div key={i} className='bg-stroke-soft-200 h-px w-full' />;

          case "actions":
            return (
              <div key={i} className='flex flex-wrap items-center gap-1.5 pt-0.5'>
                {block.elements.map((el, j) =>
                  el.type === "button" ? (
                    <SlackButton key={j} el={el} size={btnSize} onAction={onAction} />
                  ) : el.type === "static_select" ? (
                    <SlackSelect key={j} el={el} size={btnSize} onAction={onAction} />
                  ) : null,
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default SlackBlocks;
