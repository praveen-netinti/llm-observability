"use client";

import { useState } from "react";
import { RiFolder3Fill, RiMore2Line } from "@remixicon/react";

import { cn } from "@/utils/cn";
import * as Button from "@/components/ui/button";
import * as Switch from "@/components/ui/switch";

interface Project {
  id: string;
  name: string;
  environment: "Production" | "Staging" | "Development";
  spans30d: string;
}

const projects: Project[] = [
  { id: "1", name: "checkout-assistant", environment: "Production", spans30d: "18.4M" },
  { id: "2", name: "support-copilot", environment: "Production", spans30d: "9.1M" },
  { id: "3", name: "search-reranker", environment: "Staging", spans30d: "3.2M" },
  { id: "4", name: "internal-rag-eval", environment: "Development", spans30d: "612K" },
];

const envStyles: Record<Project["environment"], string> = {
  Production: "bg-green-alpha-10 text-green-600",
  Staging: "bg-away-lighter text-away-base",
  Development: "bg-feature-lighter text-feature-base",
};

const samplingData = [
  {
    id: "tail-sampling",
    label: "Tail-based sampling",
    description: "Keep all errored and slow traces, sample the rest",
    enabled: true,
  },
  {
    id: "auto-instrument",
    label: "Auto-instrumentation hints",
    description: "Suggest missing spans from known SDK patterns",
    enabled: true,
  },
];

export default function Projects() {
  const [sampling, setSampling] = useState(() => {
    const initial: Record<string, boolean> = {};
    samplingData.forEach((s) => (initial[s.id] = s.enabled));
    return initial;
  });

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Projects
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Services and environments sending telemetry.
          </p>
        </div>

        <div className='flex w-full flex-col gap-5 lg:gap-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-col gap-1'>
              <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                {projects.length} active projects
              </div>
              <div className='text-text-soft-400 text-xs font-medium lg:text-sm'>
                Grouped by deployment environment.
              </div>
            </div>
            <Button.Root
              size='xsmall'
              variant='neutral'
              mode='stroke'
              className='text-text-sub-600 !rounded-10 w-fit cursor-pointer px-3 text-sm font-medium'
            >
              New project
            </Button.Root>
          </div>

          <div className='border-stroke-soft-200 flex flex-col gap-5 border-t pt-5'>
            {projects.map((project) => (
              <div key={project.id} className='flex items-center justify-between gap-2.5'>
                <div className='flex min-w-0 items-center gap-2.5'>
                  <div className='bg-bg-weak-50 grid size-8 shrink-0 place-items-center rounded-full'>
                    <RiFolder3Fill className='text-text-soft-400 size-4' />
                  </div>
                  <div className='flex min-w-0 flex-col gap-0.5'>
                    <span className='text-text-strong-950 tracking-spacing-tiny-2 truncate font-mono text-sm font-medium'>
                      {project.name}
                    </span>
                    <span className='text-text-soft-400 text-xs font-medium'>
                      {project.spans30d} spans / 30d
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-2.5'>
                  <span
                    className={cn(
                      "hidden w-fit rounded-md px-1.5 py-0.5 text-xs font-medium sm:inline",
                      envStyles[project.environment],
                    )}
                  >
                    {project.environment}
                  </span>
                  <Button.Root
                    size='xsmall'
                    variant='neutral'
                    mode='ghost'
                    className='hover:bg-bg-weak-50 size-5 cursor-pointer rounded-sm p-0 transition-colors'
                  >
                    <RiMore2Line className='text-text-soft-400 size-5' />
                  </Button.Root>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-4 border-t px-5 pt-5 lg:flex-row lg:border-t-0 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            Sampling
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            Control which traces are retained.
          </p>
        </div>

        <div className='border-stroke-soft-200 flex w-full flex-col gap-5 border-t pt-4 lg:gap-4 lg:border-t-0 lg:pt-0'>
          {samplingData.map((setting) => (
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
                checked={sampling[setting.id]}
                onCheckedChange={(checked) =>
                  setSampling((prev) => ({ ...prev, [setting.id]: checked }))
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
