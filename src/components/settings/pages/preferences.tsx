"use client";

import { useState } from "react";
import { RiAddLine, RiSubtractLine } from "@remixicon/react";

import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import * as Switch from "@/components/ui/switch";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface BehaviorSetting {
  id: string;
  label: string;
  description: string;
  type: "switch" | "select" | "counter";
  enabled?: boolean;
  value?: string | number;
  options?: { value: string; label: string }[];
  minValue?: number;
  maxValue?: number;
}

const notificationsData: NotificationSetting[] = [
  {
    id: "alert-emails",
    label: "Alert emails",
    description: "Email me when an alert fires",
    enabled: true,
  },
  {
    id: "weekly-digest",
    label: "Weekly digest",
    description: "Summary of cost, latency and error trends",
    enabled: true,
  },
  {
    id: "anomaly-push",
    label: "Anomaly push notifications",
    description: "Browser notifications for detected anomalies",
    enabled: false,
  },
];

const behaviorData: BehaviorSetting[] = [
  {
    id: "default-environment",
    label: "Default environment",
    description: "Environment selected on dashboard load",
    type: "select",
    value: "production",
    options: [
      { value: "production", label: "Production" },
      { value: "staging", label: "Staging" },
      { value: "development", label: "Development" },
    ],
  },
  {
    id: "default-time-range",
    label: "Default time range",
    description: "Time window applied to new views",
    type: "select",
    value: "24h",
    options: [
      { value: "1h", label: "Last 1 hour" },
      { value: "24h", label: "Last 24 hours" },
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
    ],
  },
  {
    id: "live-tail",
    label: "Live tail by default",
    description: "Auto-stream new traces as they arrive",
    type: "switch",
    enabled: false,
  },
  {
    id: "dashboard-refresh",
    label: "Dashboard auto-refresh",
    description: "Refresh interval for live charts (seconds)",
    type: "counter",
    value: 30,
    minValue: 5,
    maxValue: 300,
  },
];

export default function Preferences() {
  const [notifications, setNotifications] = useState(() => {
    const initial: Record<string, boolean> = {};
    notificationsData.forEach((s) => (initial[s.id] = s.enabled));
    return initial;
  });

  const [behavior, setBehavior] = useState(() => {
    const initial: Record<string, boolean | string | number> = {};
    behaviorData.forEach((s) => {
      if (s.type === "switch") initial[s.id] = s.enabled || false;
      else if (s.type === "select") initial[s.id] = s.value || "";
      else if (s.type === "counter") initial[s.id] = s.value || 0;
    });
    return initial;
  });

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-4 px-5 pt-5 lg:flex-row lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Notifications
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Email and push notification settings.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5 lg:gap-4'>
          {notificationsData.map((setting) => (
            <div key={setting.id} className='flex items-center justify-between'>
              <div className='flex flex-col gap-1'>
                <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                  {setting.label}
                </div>
                <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                  {setting.description}
                </div>
              </div>
              <Switch.Root
                checked={notifications[setting.id]}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [setting.id]: checked }))
                }
                className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
              />
            </div>
          ))}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-4 border-t px-5 pt-5 lg:flex-row lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Defaults
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Default views and dashboard behavior.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5 lg:gap-4'>
          {behaviorData.map((setting) => (
            <div
              key={setting.id}
              className={`flex ${setting.type === "counter" || setting.type === "select" ? "flex-col items-start gap-4 lg:flex-row lg:items-center" : "items-center"} justify-between gap-2`}
            >
              <div className='flex flex-col gap-1'>
                <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                  {setting.label}
                </div>
                <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                  {setting.description}
                </div>
              </div>

              {setting.type === "switch" && (
                <Switch.Root
                  checked={behavior[setting.id] as boolean}
                  onCheckedChange={(checked) =>
                    setBehavior((prev) => ({ ...prev, [setting.id]: checked }))
                  }
                  className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
                />
              )}

              {setting.type === "select" && setting.options && (
                <Select.Root
                  size='xsmall'
                  value={behavior[setting.id] as string}
                  onValueChange={(value) => setBehavior((prev) => ({ ...prev, [setting.id]: value }))}
                >
                  <Select.Trigger className='text-text-sub-600 w-full text-sm lg:w-auto'>
                    <Select.Value placeholder={behavior[setting.id] as string} />
                  </Select.Trigger>
                  <Select.Content className='z-62'>
                    {setting.options.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}

              {setting.type === "counter" && (
                <div className='w-full pb-2 lg:max-w-[120px] lg:min-w-[90px] lg:pb-0'>
                  <div className='bg-bg-white-0 rounded-10 shadow-custom-input flex items-center gap-2.5 p-1.5'>
                    <Button.Root
                      size='xsmall'
                      variant='neutral'
                      mode='ghost'
                      className='hover:bg-bg-weak-50 size-5 cursor-pointer rounded-sm p-0'
                      onClick={() =>
                        setBehavior((prev) => ({
                          ...prev,
                          [setting.id]: Math.max(
                            setting.minValue || 5,
                            (prev[setting.id] as number) - 5,
                          ),
                        }))
                      }
                    >
                      <RiSubtractLine className='text-text-soft-400 size-5 shrink-0' />
                    </Button.Root>
                    <div className='text-text-sub-600 min-w-0 flex-1 text-center text-sm font-medium'>
                      {behavior[setting.id]}
                    </div>
                    <Button.Root
                      size='xsmall'
                      variant='neutral'
                      mode='ghost'
                      className='hover:bg-bg-weak-50 size-5 shrink-0 cursor-pointer rounded-sm p-0'
                      onClick={() =>
                        setBehavior((prev) => ({
                          ...prev,
                          [setting.id]: Math.min(
                            setting.maxValue || 300,
                            (prev[setting.id] as number) + 5,
                          ),
                        }))
                      }
                    >
                      <RiAddLine className='text-text-soft-400 size-5' />
                    </Button.Root>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
