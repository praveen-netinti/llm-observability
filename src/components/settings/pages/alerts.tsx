"use client";

import { useState } from "react";
import {
  RiAlarmWarningFill,
  RiErrorWarningLine,
  RiMoneyDollarCircleLine,
  RiTimerFlashLine,
} from "@remixicon/react";

import * as Label from "@/components/ui/label";
import * as Radio from "@/components/ui/radio";
import * as Switch from "@/components/ui/switch";

interface AlertRule {
  id: string;
  label: string;
  description: string;
  threshold: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}

const alertRulesData: AlertRule[] = [
  {
    id: "p95-latency",
    label: "High p95 latency",
    description: "Trigger when rolling p95 exceeds threshold",
    threshold: "> 4.0s for 5 min",
    icon: RiTimerFlashLine,
    enabled: true,
  },
  {
    id: "error-rate",
    label: "Error rate spike",
    description: "Span error ratio over a 5-minute window",
    threshold: "> 2% for 5 min",
    icon: RiErrorWarningLine,
    enabled: true,
  },
  {
    id: "daily-cost",
    label: "Daily cost budget",
    description: "Notify when projected daily spend is exceeded",
    threshold: "> $250 / day",
    icon: RiMoneyDollarCircleLine,
    enabled: false,
  },
  {
    id: "hallucination",
    label: "Eval score drop",
    description: "Faithfulness/groundedness eval below target",
    threshold: "< 0.80 score",
    icon: RiAlarmWarningFill,
    enabled: true,
  },
];

const channelOptions = [
  { id: "slack", value: "slack", label: "Slack" },
  { id: "email", value: "email", label: "Email" },
  { id: "pagerduty", value: "pagerduty", label: "PagerDuty" },
  { id: "webhook", value: "webhook", label: "Webhook" },
];

export default function Alerts() {
  const [rules, setRules] = useState(() => {
    const initial: Record<string, boolean> = {};
    alertRulesData.forEach((r) => (initial[r.id] = r.enabled));
    return initial;
  });
  const [channel, setChannel] = useState("slack");

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Alert rules
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Thresholds that trigger notifications.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:gap-4 lg:border-t-0 lg:pt-0'>
          {alertRulesData.map((rule) => {
            const Icon = rule.icon;
            return (
              <div key={rule.id} className='flex items-center justify-between gap-2.5'>
                <div className='flex min-w-0 items-start gap-2.5'>
                  <div className='bg-bg-weak-50 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full'>
                    <Icon className='text-text-soft-400 size-4' />
                  </div>
                  <div className='flex min-w-0 flex-col gap-0.5'>
                    <span className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                      {rule.label}
                    </span>
                    <span className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                      {rule.description}
                    </span>
                    <span className='text-text-sub-600 mt-0.5 w-fit rounded-md bg-bg-weak-50 px-1.5 py-0.5 font-mono text-xs'>
                      {rule.threshold}
                    </span>
                  </div>
                </div>
                <Switch.Root
                  checked={rules[rule.id]}
                  onCheckedChange={(checked) =>
                    setRules((prev) => ({ ...prev, [rule.id]: checked }))
                  }
                  className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base mt-1 cursor-pointer'
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:border-t-0 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Default channel
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Where new alerts are routed.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5'>
          <div className='flex flex-col gap-1'>
            <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
              Notification channel
            </div>
            <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
              Applied to alerts without an override
            </div>
          </div>
          <Radio.Group
            value={channel}
            onValueChange={setChannel}
            className='flex flex-wrap gap-6'
          >
            {channelOptions.map((option) => (
              <div key={option.id} className='group/radio flex items-center gap-1.5'>
                <Radio.Item value={option.value} id={`channel-${option.id}`} />
                <Label.Root
                  htmlFor={`channel-${option.id}`}
                  className='text-text-sub-600 group-has-[[data-state=checked]]/radio:text-text-sub-600 cursor-pointer text-sm font-medium'
                >
                  {option.label}
                </Label.Root>
              </div>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}
