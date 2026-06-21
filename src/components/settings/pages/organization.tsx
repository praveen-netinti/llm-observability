"use client";

import { useEffect, useState } from "react";

import * as Button from "@/components/ui/button";

interface OverviewItem {
  id: string;
  label: string;
  value: string;
}

interface ActivityItem {
  id: string;
  label: string;
  value: number;
  unit?: string;
}

interface UsageItem {
  label: string;
  value: number;
  colorClass: string;
}

const organizationData = {
  overview: {
    user: {
      initials: "NS",
      name: "Neosigma AI",
      email: "(observability@neosigma.ai)",
      memberSince: "May 16, 2025",
      memberSinceLabel: "Created on",
    },
    items: [
      { id: "organization", label: "Organization", value: "Neosigma™" },
      { id: "yourRole", label: "Your role", value: "Owner" },
      { id: "members", label: "Members", value: "6/15 seats" },
      { id: "plan", label: "Plan", value: "Scale" },
      { id: "region", label: "Data region", value: "US-East (Virginia)" },
    ] as OverviewItem[],
    manageButtonText: "Manage",
  },
  activity: {
    items: [
      { id: "traces", label: "Traces (30d)", value: 1284500 },
      { id: "spans", label: "Spans (30d)", value: 9637200 },
      { id: "tokens", label: "Tokens (30d)", value: 482000000 },
      { id: "ingestRate", label: "Ingest rate", value: 1420, unit: "/s" },
    ] as ActivityItem[],
  },
  usage: {
    items: [
      { label: "Trace ingest quota", value: 64, colorClass: "bg-purple-500" },
      { label: "Event storage", value: 38, colorClass: "bg-teal-500" },
      { label: "Eval compute", value: 21, colorClass: "bg-orange-500" },
    ] as UsageItem[],
  },
  sections: {
    overview: { title: "Overview", description: "Organization summary and details." },
    activity: { title: "Telemetry", description: "Ingest analytics and volume metrics." },
    usage: { title: "Plan usage", description: "Quota limits and current consumption." },
  },
};

function formatValue(item: ActivityItem) {
  if (item.unit === "/s") return item.value.toLocaleString() + item.unit;
  if (item.value >= 1_000_000) return (item.value / 1_000_000).toFixed(1) + "M";
  if (item.value >= 1_000) return (item.value / 1_000).toFixed(1) + "K";
  return item.value.toLocaleString();
}

export default function Organization() {
  const [containerWidth, setContainerWidth] = useState(200);

  const progressContainerRef = (node: HTMLDivElement | null) => {
    if (node) setContainerWidth(node.offsetWidth);
  };

  useEffect(() => {
    const handleResize = () => {
      const containers = document.querySelectorAll(".progressContainer");
      if (containers.length > 0) {
        setContainerWidth((containers[0] as HTMLDivElement).offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='flex h-full w-full flex-col gap-5 overflow-y-auto px-0 pb-8 lg:gap-7 lg:px-7 lg:pb-0'>
      <div className='flex flex-col gap-5 pt-5 lg:flex-row lg:gap-4 lg:pt-7'>
        <div className='flex flex-col gap-1 px-5 lg:max-w-50 lg:min-w-50 lg:px-0 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            {organizationData.sections.overview.title}
          </h3>
          <p className='text-text-soft-400 lg:tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            {organizationData.sections.overview.description}
          </p>
        </div>

        <div className='flex w-full flex-col'>
          <div className='flex flex-col items-start justify-between px-5 lg:flex-row lg:items-center lg:px-0'>
            <div className='mb-3 flex items-center gap-3 lg:mb-0'>
              <div className='text-stroke-strong-950 tracking-spacing-tiny-4 flex size-10 items-center justify-center rounded-full bg-neutral-200 text-base font-medium lg:size-8 lg:text-sm xl:size-10 xl:text-base'>
                {organizationData.overview.user.initials}
              </div>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-1'>
                  <div className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                    {organizationData.overview.user.name}
                  </div>
                  <div className='text-text-soft-400 tracking-spacing-tiny-2 text-sm font-medium'>
                    {organizationData.overview.user.email}
                  </div>
                </div>
                <div className='text-text-disabled-300 text-xs font-medium'>
                  {organizationData.overview.user.memberSinceLabel}{" "}
                  <span className='text-text-sub-600'>
                    {organizationData.overview.user.memberSince}
                  </span>
                </div>
              </div>
            </div>
            <Button.Root
              size='xsmall'
              variant='neutral'
              mode='stroke'
              className='text-text-sub-600 !rounded-10 ml-13 w-[calc(100%-52px)] cursor-pointer px-3 text-sm font-medium lg:ml-0 lg:w-fit'
            >
              {organizationData.overview.manageButtonText}
            </Button.Root>
          </div>
          <div className='border-stroke-soft-200 mt-5 flex flex-col gap-3.5 border-t px-5 pt-5 lg:px-0'>
            {organizationData.overview.items.map((item) => (
              <div key={item.id} className='flex items-center gap-3'>
                <span className='text-text-soft-400 tracking-spacing-tiny-2 w-3/5 text-sm font-medium lg:w-2/5'>
                  {item.label}
                </span>
                <span className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            {organizationData.sections.activity.title}
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            {organizationData.sections.activity.description}
          </p>
        </div>
        <div className='flex w-full flex-wrap gap-4'>
          {organizationData.activity.items.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col ${index === 0 || index === 2 ? "max-w-3/5 min-w-3/5 lg:max-w-2/5 lg:min-w-2/5" : ""}`}
            >
              <span className='text-text-soft-400 tracking-spacing-tiny-2 text-sm font-medium'>
                {item.label}
              </span>
              <span className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
                {formatValue(item)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='border-stroke-soft-200 flex flex-col gap-5 border-t px-5 pt-5 lg:flex-row lg:gap-4 lg:px-0 lg:pt-7'>
        <div className='flex flex-col gap-1 lg:max-w-50 lg:min-w-50 xl:max-w-75 xl:min-w-75'>
          <h3 className='text-text-strong-950 tracking-spacing-tiny-2 text-sm font-medium'>
            {organizationData.sections.usage.title}
          </h3>
          <p className='text-text-soft-400 tracking-spacing-tiny-2 text-xs font-medium lg:text-sm'>
            {organizationData.sections.usage.description}
          </p>
        </div>

        <div className='planUseWrapper flex w-full flex-col gap-3.5 overflow-hidden'>
          {organizationData.usage.items.map((item) => {
            const segmentWidth = 4;
            const gapWidth = 3;
            const totalSegments = Math.max(
              1,
              Math.floor((containerWidth + gapWidth) / (segmentWidth + gapWidth)),
            );
            const filledSegments = Math.round((item.value / 100) * totalSegments);

            return (
              <div key={item.label} className='flex items-center gap-2 lg:gap-4'>
                <span className='text-text-soft-400 tracking-spacing-tiny-2 flex w-2/5 flex-shrink-0 text-sm font-medium lg:max-w-2/5 lg:min-w-2/5'>
                  {item.label}
                </span>
                <div className='flex min-w-0 flex-1 items-center gap-2 lg:gap-4'>
                  <div ref={progressContainerRef} className='progressContainer flex min-w-0 flex-1 gap-0.75'>
                    {Array.from({ length: totalSegments }, (_, index) => (
                      <div
                        key={index}
                        className={`h-3 w-1 flex-shrink-0 rounded-[0.8px] ${
                          index < filledSegments ? item.colorClass : "bg-bg-weak-50"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className='text-text-soft-400 w-8 flex-shrink-0 text-right text-xs font-medium lg:min-w-10'>
                    {item.value}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
