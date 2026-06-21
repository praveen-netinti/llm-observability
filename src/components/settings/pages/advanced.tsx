"use client";

import { useState } from "react";

import * as Button from "@/components/ui/button";
import * as Switch from "@/components/ui/switch";

interface SwitchSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface ButtonSetting {
  id: string;
  label: string;
  description: string;
  buttonText: string;
}

const developerData: SwitchSetting[] = [
  {
    id: "debug-spans",
    label: "Debug span capture",
    description: "Include internal SDK debug spans in traces",
    enabled: false,
  },
  {
    id: "raw-payloads",
    label: "Raw payload inspector",
    description: "Show unparsed request/response bodies in trace view",
    enabled: false,
  },
  {
    id: "experimental-evals",
    label: "Experimental evaluators",
    description: "Enable beta LLM-as-judge evaluators",
    enabled: true,
  },
];

const systemData: ButtonSetting[] = [
  { id: "rotate-keys", label: "Rotate signing keys", description: "Regenerate webhook signing secrets", buttonText: "Rotate" },
  { id: "export-config", label: "Export configuration", description: "Download org settings as JSON", buttonText: "Export" },
  { id: "import-config", label: "Import configuration", description: "Restore settings from a backup file", buttonText: "Import" },
];

export default function Advanced() {
  const [developer, setDeveloper] = useState(() => {
    const initial: Record<string, boolean> = {};
    developerData.forEach((s) => (initial[s.id] = s.enabled));
    return initial;
  });

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-4 px-5 pt-5 lg:flex-row lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Developer settings
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Advanced developer and debug options.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5'>
          {developerData.map((setting) => (
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
                checked={developer[setting.id]}
                onCheckedChange={(checked) =>
                  setDeveloper((prev) => ({ ...prev, [setting.id]: checked }))
                }
                className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
              />
            </div>
          ))}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-4 border-t px-5 pt-5 lg:flex-row lg:border-t-0 lg:px-0 lg:pt-7'>
        <div className='flex max-w-75 min-w-75 flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            System
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Advanced system configuration.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5'>
          {systemData.map((setting) => (
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
              <Button.Root
                size='xsmall'
                variant='neutral'
                mode='stroke'
                className='text-text-sub-600 !rounded-10 w-full cursor-pointer px-3 text-sm font-medium lg:w-fit'
              >
                {setting.buttonText}
              </Button.Root>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
