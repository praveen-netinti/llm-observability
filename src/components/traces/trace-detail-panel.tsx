"use client";

import React, { SVGProps, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightDoubleLine,
  RiArrowUpSLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiFullscreenLine,
  RiLink,
  RiLoader4Line,
  RiMoreFill,
} from "@remixicon/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

import { FlatSpan, flatSpans } from "@/lib/flatten-traces";
import { cn } from "@/utils";

import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as Popover from "@/components/ui/popover";
import * as Tooltip from "@/components/ui/tooltip";

// --- Types ---

type PanelContextValue = {
  traceId: string;
  spans: FlatSpan[];
  close: () => void;
};

const PanelContext = React.createContext<PanelContextValue | null>(null);

function usePanelContext() {
  const ctx = React.useContext(PanelContext);
  if (!ctx) throw new Error("TraceDetailPanel compound components must be used within Root");
  return ctx;
}

function Root({ traceId, children }: { traceId: string; children: React.ReactNode }) {
  const router = useRouter();
  const spans = React.useMemo(() => flatSpans.filter((s) => s.traceId === traceId), [traceId]);
  const close = React.useCallback(() => router.push("/traces"), [router]);

  if (spans.length === 0) return null;

  return (
    <PanelContext.Provider value={{ traceId, spans, close }}>
      <DialogPrimitive.Root open onOpenChange={(open) => { if (!open) close(); }}>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          className='flex h-full flex-col focus:outline-none'
        >
          <DialogPrimitive.Title className='sr-only'>Trace Detail</DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Root>
    </PanelContext.Provider>
  );
}

// --- Header ---

function Header() {
  const { traceId, spans, close } = usePanelContext();
  const router = useRouter();
  const rootSpan = spans.find((s) => s.parentId === null);
  const traceRoots = flatSpans.filter((s) => s.parentId === null);
  const traceIndex = traceRoots.findIndex((s) => s.traceId === traceId);
  const hasPrev = traceIndex > 0;
  const hasNext = traceIndex < traceRoots.length - 1;

  const goToPrev = () => {
    if (hasPrev) router.push(`/traces/${traceRoots[traceIndex - 1].traceId}`);
  };
  const goToNext = () => {
    if (hasNext) router.push(`/traces/${traceRoots[traceIndex + 1].traceId}`);
  };

  return (
    <div className='border-faded-lighter dark:border-stroke-soft-200 flex h-11 shrink-0 items-center gap-0.5 border-b px-2'>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={close}
            className='size-7 cursor-pointer rounded-lg p-0'
          >
            <Button.Icon as={RiArrowRightDoubleLine} className='text-text-soft-400' />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Close</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            className='size-7 cursor-pointer rounded-lg p-0'
          >
            <Button.Icon as={RiFullscreenLine} className='text-text-soft-400' />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Open in full page</Tooltip.Content>
      </Tooltip.Root>

      <div className='bg-bg-soft-200 h-3.5 w-px' style={{ marginInline: "8px" }} />

      <div className='border-stroke-soft-200 bg-bg-weak-25 text-2xs text-text-sub-600 flex h-6 items-center rounded-md border px-2 font-medium'>
        {traceIndex + 1} / {traceRoots.length}
      </div>

      <div className='bg-bg-soft-200 h-3.5 w-px' style={{ marginInline: "8px" }} />

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={goToPrev}
            disabled={!hasPrev}
            className='size-7 cursor-pointer rounded-lg p-0'
          >
            <Button.Icon as={RiArrowUpSLine} className='text-text-soft-400' />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Previous</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={goToNext}
            disabled={!hasNext}
            className='size-7 cursor-pointer rounded-lg p-0'
          >
            <Button.Icon as={RiArrowDownSLine} className='text-text-soft-400' />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Next</Tooltip.Content>
      </Tooltip.Root>

      <div className='bg-bg-soft-200 h-3.5 w-px' style={{ marginInline: "8px" }} />

      <span className='text-text-sub-600 mr-1 truncate text-[13px]'>
        {rootSpan?.name ?? traceId}
      </span>

      <TraceIdPopover traceId={traceId} />

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            className='ml-auto size-7 cursor-pointer rounded-lg p-0'
          >
            <Button.Icon as={RiMoreFill} className='text-text-soft-400' />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>More</Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}

// --- Trace ID Popover ---

function TraceIdPopover({ traceId }: { traceId: string }) {
  const [copied, setCopied] = useState(false);
  const shortId = traceId.replace(/^trace_/, "");

  const copy = () => {
    navigator.clipboard.writeText(traceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root
          variant='neutral'
          mode='lighter'
          size='xxsmall'
          className='cursor-pointer rounded-lg text-xs'
        >
          ID
          <Button.Icon as={RiLink} className='text-text-soft-400 size-3' />
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content
        showArrow={false}
        // sideOffset={-8}
        className='dark:bg-bg-soft-200 flex w-auto items-center gap-2 px-2.5 py-1'
      >
        <span className='text-text-sub-600 text-[11px] font-medium uppercase'>Trace ID</span>
        <code className='text-text-strong-950 font-mono text-[12px]'>{shortId}</code>
        <button type='button' onClick={copy} className='inline-flex cursor-pointer items-center ml-2'>
          <AnimatePresence mode='popLayout' initial={false}>
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className='inline-flex'
            >
              {copied ? (
                <CheckmarkIcon className='text-success-base size-3.5' />
              ) : (
                <CopyIcon className='text-text-soft-400 size-3.5' />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </Popover.Content>
    </Popover.Root>
  );
}

function CheckmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12ZM16.6757 8.26285C17.0828 8.63604 17.1103 9.26861 16.7372 9.67573L11.2372 15.6757C11.0528 15.8768 10.7944 15.9938 10.5217 15.9998C10.249 16.0057 9.98576 15.9 9.79289 15.7071L7.29289 13.2071C6.90237 12.8166 6.90237 12.1834 7.29289 11.7929C7.68342 11.4024 8.31658 11.4024 8.70711 11.7929L10.4686 13.5544L15.2628 8.32428C15.636 7.91716 16.2686 7.88966 16.6757 8.26285Z'
      />
    </svg>
  );
}

function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22 5.25C22 3.45507 20.5449 2 18.75 2H11.25C9.45508 2 8 3.45507 8 5.25V8H5.25C3.45508 8 2 9.45507 2 11.25V18.75C2 20.5449 3.45507 22 5.25 22H12.75C14.5449 22 16 20.5449 16 18.75V16H18.75C20.5449 16 22 14.5449 22 12.75V5.25ZM16 14H18.75C19.4404 14 20 13.4404 20 12.75V5.25C20 4.55964 19.4404 4 18.75 4H11.25C10.5596 4 10 4.55964 10 5.25V8H12.75C14.5449 8 16 9.45507 16 11.25V14Z'
      />
    </svg>
  );
}


const statusIcon = {
  success: RiCheckboxCircleFill,
  error: RiCloseCircleFill,
  running: RiLoader4Line,
} as const;

const statusColor = {
  success: "text-success-base",
  error: "text-error-base",
  running: "text-warning-base",
} as const;

const typeColor: Record<string, string> = {
  llm: "bg-purple-500",
  tool: "bg-sky-500",
  chain: "bg-blue-500",
  retriever: "bg-teal-500",
};

function Waterfall() {
  const { spans } = usePanelContext();

  // Compute time range for positioning bars
  const startTimes = spans.map((s) => new Date(s.startTime).getTime());
  const endTimes = spans.map((s) => (s.endTime ? new Date(s.endTime).getTime() : Date.now()));
  const traceStart = Math.min(...startTimes);
  const traceEnd = Math.max(...endTimes);
  const totalDuration = traceEnd - traceStart || 1;

  // Sort spans by start time, respecting tree structure (DFS order)
  const sortedSpans = React.useMemo(() => {
    const childMap = new Map<string | null, FlatSpan[]>();
    for (const span of spans) {
      const siblings = childMap.get(span.parentId) ?? [];
      siblings.push(span);
      childMap.set(span.parentId, siblings);
    }
    const result: FlatSpan[] = [];
    function dfs(parentId: string | null) {
      const children = childMap.get(parentId) ?? [];
      children.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      for (const child of children) {
        result.push(child);
        dfs(child.id);
      }
    }
    dfs(null);
    return result;
  }, [spans]);

  return (
    <div className='no-scrollbar flex-1 overflow-auto'>
      <div className='min-w-0 p-2'>
        {sortedSpans.map((span) => {
          const spanStart = new Date(span.startTime).getTime();
          const spanEnd = span.endTime ? new Date(span.endTime).getTime() : Date.now();
          const leftPct = ((spanStart - traceStart) / totalDuration) * 100;
          const widthPct = Math.max(((spanEnd - spanStart) / totalDuration) * 100, 0.5);
          const Icon = statusIcon[span.status];

          return (
            <div
              key={span.id}
              className='hover:bg-bg-weak-50 group flex items-center gap-2 rounded-md px-2 py-1.5'
              style={{ paddingLeft: `${span.depth * 16 + 8}px` }}
            >
              {/* Span info */}
              <Icon
                className={cn(
                  "size-3.5 shrink-0",
                  statusColor[span.status],
                  span.status === "running" && "animate-spin",
                )}
              />
              <span
                className='text-text-strong-950 min-w-0 shrink-0 truncate text-[12px] font-medium'
                style={{ maxWidth: "140px" }}
              >
                {span.name}
              </span>
              <Badge.Root
                color={span.type === "llm" ? "purple" : span.type === "tool" ? "sky" : "blue"}
                variant='light'
                className='shrink-0 px-1 text-[10px] leading-4'
              >
                {span.type}
              </Badge.Root>

              {/* Waterfall bar */}
              <div className='relative ml-auto h-4 min-w-[100px] flex-1'>
                <div className='bg-bg-soft-200 absolute inset-0 rounded-sm' />
                <div
                  className={cn(
                    "absolute top-0.5 bottom-0.5 rounded-sm opacity-80",
                    typeColor[span.type] ?? "bg-gray-400",
                  )}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                />
              </div>

              {/* Latency */}
              <span className='text-text-sub-600 w-14 shrink-0 text-right text-[11px]'>
                {span.latencyMs != null
                  ? span.latencyMs < 1000
                    ? `${span.latencyMs}ms`
                    : `${(span.latencyMs / 1000).toFixed(2)}s`
                  : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Compound export ---

export const TraceDetailPanel = { Root, Header, Waterfall };
