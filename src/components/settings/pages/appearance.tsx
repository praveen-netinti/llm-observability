"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import * as Label from "@/components/ui/label";
import * as Radio from "@/components/ui/radio";
import * as Select from "@/components/ui/select";
import * as Switch from "@/components/ui/switch";

interface DisplaySetting {
  id: string;
  label: string;
  description: string;
  type: "select" | "switch";
  value?: string | boolean;
  options?: { value: string; label: string }[];
}

const themeOptions = [
  { id: "light", value: "light", label: "Light" },
  { id: "dark", value: "dark", label: "Dark" },
  { id: "system", value: "system", label: "System" },
];

const displayData: DisplaySetting[] = [
  {
    id: "density",
    label: "Table density",
    description: "Row spacing in trace and span tables",
    type: "select",
    value: "comfortable",
    options: [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "spacious", label: "Spacious" },
    ],
  },
  {
    id: "chart-style",
    label: "Chart style",
    description: "Default visual style for time-series charts",
    type: "select",
    value: "area",
    options: [
      { value: "line", label: "Line" },
      { value: "area", label: "Area" },
      { value: "bar", label: "Bar" },
    ],
  },
  {
    id: "monospace-payloads",
    label: "Monospace payloads",
    description: "Render prompt/response payloads in monospace",
    type: "switch",
    value: true,
  },
  {
    id: "animations",
    label: "Animations",
    description: "Enable smooth transitions and effects",
    type: "switch",
    value: true,
  },
];

const accessibilityData = [
  {
    id: "high-contrast",
    label: "High contrast",
    description: "Increase contrast for better visibility",
    enabled: false,
  },
  {
    id: "reduce-motion",
    label: "Reduce motion",
    description: "Minimize animations and transitions",
    enabled: true,
  },
  {
    id: "color-blind-palette",
    label: "Color-blind safe palette",
    description: "Use accessible colors in charts and status",
    enabled: false,
  },
];

export default function Appearance() {
  const { theme, setTheme } = useTheme();

  const [display, setDisplay] = useState(() => {
    const initial: Record<string, boolean | string> = {};
    displayData.forEach((s) => {
      if (s.type === "switch") initial[s.id] = s.value as boolean;
      else initial[s.id] = s.value as string;
    });
    return initial;
  });

  const [accessibility, setAccessibility] = useState(() => {
    const initial: Record<string, boolean> = {};
    accessibilityData.forEach((s) => (initial[s.id] = s.enabled));
    return initial;
  });

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-4 px-5 pt-5 lg:flex-row lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>Theme</h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Color scheme and visual style.
          </p>
        </div>

        <div className='flex w-full flex-col gap-4'>
          <div className='flex flex-col items-start justify-between gap-5'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                Color theme
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Choose your preferred color scheme
              </div>
            </div>
            <div className='flex'>
              <Radio.Group
                value={theme || "system"}
                onValueChange={(value) => setTheme(value)}
                className='flex gap-6'
              >
                {themeOptions.map((option) => (
                  <div key={option.id} className='group/radio flex items-center gap-1.5'>
                    <Radio.Item value={option.value} id={`theme-${option.id}`} />
                    <Label.Root
                      htmlFor={`theme-${option.id}`}
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
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Display
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Layout and visualization options.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5 lg:gap-4'>
          {displayData.map((setting) => (
            <div
              key={setting.id}
              className={`flex ${setting.type === "select" ? "flex-col items-start gap-4 lg:flex-row lg:items-center" : "items-center"} justify-between gap-2`}
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
                  checked={display[setting.id] as boolean}
                  onCheckedChange={(checked) =>
                    setDisplay((prev) => ({ ...prev, [setting.id]: checked }))
                  }
                  className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
                />
              )}

              {setting.type === "select" && setting.options && (
                <Select.Root
                  size='xsmall'
                  value={display[setting.id] as string}
                  onValueChange={(value) => setDisplay((prev) => ({ ...prev, [setting.id]: value }))}
                >
                  <Select.Trigger className='text-text-sub-600 w-full text-sm lg:w-auto'>
                    <Select.Value placeholder={display[setting.id] as string} />
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
            </div>
          ))}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Accessibility
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Accessibility and readability options.
          </p>
        </div>

        <div className='flex w-full flex-col gap-4'>
          {accessibilityData.map((setting) => (
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
                checked={accessibility[setting.id]}
                onCheckedChange={(checked) =>
                  setAccessibility((prev) => ({ ...prev, [setting.id]: checked }))
                }
                className='[&>div]:group-data-[state=checked]/switch:!bg-success-base [&>div]:group-hover:data-[state=checked]/switch:!bg-success-base cursor-pointer'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
