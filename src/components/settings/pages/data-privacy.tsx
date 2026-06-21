"use client";

import { useState } from "react";

import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import * as Switch from "@/components/ui/switch";

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const retentionOptions = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "180d", label: "180 days" },
];

const redactionData: ToggleSetting[] = [
  {
    id: "pii-redaction",
    label: "PII redaction",
    description: "Mask emails, phone numbers and credit cards in payloads",
    enabled: true,
  },
  {
    id: "prompt-capture",
    label: "Capture prompt content",
    description: "Store full prompt/response text on spans",
    enabled: true,
  },
  {
    id: "exclude-training",
    label: "Exclude from model training",
    description: "Never use captured data to train models",
    enabled: true,
  },
];

const dataRights = [
  {
    id: "export-data",
    label: "Export organization data",
    description: "Download all traces and metadata as JSONL",
    buttonText: "Export",
    variant: "stroke" as const,
  },
  {
    id: "purge-data",
    label: "Purge all telemetry",
    description: "Permanently delete all ingested traces and spans",
    buttonText: "Purge",
    variant: "error" as const,
  },
];

export default function DataPrivacy() {
  const [retention, setRetention] = useState("30d");
  const [redaction, setRedaction] = useState(() => {
    const initial: Record<string, boolean> = {};
    redactionData.forEach((s) => (initial[s.id] = s.enabled));
    return initial;
  });

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-4 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Retention
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            How long telemetry is stored.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5 lg:gap-4'>
          <div className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                Trace retention period
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Traces older than this are deleted
              </div>
            </div>
            <Select.Root size='xsmall' value={retention} onValueChange={setRetention}>
              <Select.Trigger className='text-text-sub-600 w-full text-sm lg:w-auto'>
                <Select.Value placeholder={retention} />
              </Select.Trigger>
              <Select.Content className='z-62'>
                {retentionOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:border-t-0 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Data handling
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Redaction and capture controls.
          </p>
        </div>

        <div className='flex w-full flex-col gap-4 lg:gap-5'>
          {redactionData.map((setting) => (
            <div key={setting.id} className='flex items-center justify-between'>
              <div className='flex flex-col gap-1'>
                <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                  {setting.label}
                </div>
                <div className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
                  {setting.description}
                </div>
              </div>
              <Switch.Root
                checked={redaction[setting.id]}
                onCheckedChange={(checked) =>
                  setRedaction((prev) => ({ ...prev, [setting.id]: checked }))
                }
                className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
              />
            </div>
          ))}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:border-t-0 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Data rights
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Export or remove your data.
          </p>
        </div>

        <div className='flex w-full flex-col gap-4 lg:gap-5'>
          {dataRights.map((setting) => (
            <div
              key={setting.id}
              className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'
            >
              <div className='flex flex-col gap-1'>
                <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                  {setting.label}
                </div>
                <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                  {setting.description}
                </div>
              </div>
              {setting.variant === "error" ? (
                <Button.Root
                  size='xsmall'
                  variant='error'
                  mode='lighter'
                  className='!rounded-10 w-full cursor-pointer px-3 text-sm font-medium lg:w-fit'
                >
                  {setting.buttonText}
                </Button.Root>
              ) : (
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='text-text-sub-600 !rounded-10 w-full cursor-pointer px-3 text-sm font-medium lg:w-fit'
                >
                  {setting.buttonText}
                </Button.Root>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
