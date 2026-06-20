"use client";

import React, { SVGProps, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  RiArrowDownSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiBarChartHorizontalLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiFullscreenLine,
  RiLink,
  RiLinkM,
  RiListUnordered,
  RiLoader4Line,
  RiMoreFill,
  RiOpenaiFill,
  RiSearchLine,
  RiShareLine,
  RiSparkling2Fill,
  RiWrenchLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

import { FlatSpan, flatSpans } from "@/lib/flatten-traces";
import { cn } from "@/utils";

import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as Popover from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTab,
} from "@/components/ui/segmented-control";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
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
      <DialogPrimitive.Root
        modal={false}
        open
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
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
            <Button.Icon as={RiFullscreenLine} className='text-text-soft-400 size-4' />
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
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            className='size-7 cursor-pointer rounded-lg p-0'
          >
            <Button.Icon as={RiShareLine} className='text-text-soft-400 size-4' />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Share</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            className='size-7 cursor-pointer rounded-lg p-0'
          >
            <Button.Icon as={CopyIcon} className='text-text-soft-400 size-4' />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Copy Run</Tooltip.Content>
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
        <button
          type='button'
          onClick={copy}
          className='ml-2 inline-flex cursor-pointer items-center'
        >
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

// --- Constants ---

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

const statusDotColor = {
  success: "bg-success-base",
  error: "bg-error-base",
  running: "bg-warning-base animate-pulse",
} as const;

const typeColor: Record<string, string> = {
  llm: "bg-amber-400",
  tool: "bg-emerald-500",
  chain: "bg-blue-500",
  retriever: "bg-pink-500",
};

function getSpanIcon(span: FlatSpan) {
  // LLM calls - detect by name
  const name = span.name.toLowerCase();
  if (span.type === "llm") {
    if (name.includes("openai") || name.includes("gpt")) return RiOpenaiFill;
    return RiSparkling2Fill; // Anthropic / generic LLM
  }
  if (span.type === "tool") {
    if (name.includes("search")) return RiSearchLine;
    return RiWrenchLine;
  }
  // chain / root spans
  return RiLinkM;
}

// --- Body (Summary + View Toggle + Split Layout) ---

type ViewMode = "tree" | "waterfall";

function Body() {
  const { spans } = usePanelContext();
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(spans[0]?.id ?? null);
  const selectedSpan = spans.find((s) => s.id === selectedSpanId) ?? null;
  // const rootSpan = spans.find((s) => s.parentId === null);

  return (
    <>
      {/* Split: Span list + Span detail */}
      <ResizablePanelGroup orientation='horizontal' className='min-h-0 flex-1'>
        <ResizablePanel defaultSize='50%' minSize='40%'>
          <div className='border-faded-lighter dark:border-stroke-soft-200 flex items-center gap-4 border-b px-3 py-1.5 text-[12px]'>
            <div className='text-text-sub-600 text-[13px]'>Trace</div>

            <div className='ml-auto'>
              <SegmentedControl value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <SegmentedControlList
                  className='h-7'
                  style={
                    {
                      "--active-tab-height": "28px !important",
                    } as React.CSSProperties
                  }
                >
                  <SegmentedControlTab value='tree' className='px-2 text-[11px]!'>
                    <RiListUnordered className='size-3' />
                    Tree
                  </SegmentedControlTab>
                  <SegmentedControlTab value='waterfall' className='px-2 text-[11px]!'>
                    <RiBarChartHorizontalLine className='size-3' />
                    Waterfall
                  </SegmentedControlTab>
                </SegmentedControlList>
              </SegmentedControl>
            </div>
          </div>

          <div className='no-scrollbar h-full overflow-auto'>
            {viewMode === "tree" ? (
              <SpanTree spans={spans} selectedId={selectedSpanId} onSelect={setSelectedSpanId} />
            ) : (
              <WaterfallView
                spans={spans}
                selectedId={selectedSpanId}
                onSelect={setSelectedSpanId}
              />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize='50%' minSize='40%'>
          <div className='no-scrollbar h-full overflow-auto'>
            {selectedSpan ? <SpanDetail span={selectedSpan} /> : <EmptyState />}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

// --- Helpers ---

function formatDuration(ms: number | null): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTokens(tokens: number | null): string {
  if (tokens == null || tokens === 0) return "—";
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return String(tokens);
}

function formatCost(cost: number | null): string {
  if (cost == null || cost === 0) return "—";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function EmptyState() {
  return (
    <div className='text-text-sub-600 flex h-full items-center justify-center text-sm'>
      Select a span
    </div>
  );
}

// --- Span Tree View ---

function SpanTree({
  spans,
  selectedId,
  onSelect,
}: {
  spans: FlatSpan[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const tree = React.useMemo(() => buildTree(spans), [spans]);

  return (
    <div className='p-2'>
      {tree.map((node) => (
        <SpanTreeItem
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

type TreeNode = FlatSpan & { children: TreeNode[] };

function buildTree(spans: FlatSpan[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  for (const s of spans) map.set(s.id, { ...s, children: [] });
  const roots: TreeNode[] = [];
  for (const s of spans) {
    const node = map.get(s.id)!;
    if (s.parentId && map.has(s.parentId)) {
      map.get(s.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function SpanTreeItem({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;
  const Icon = statusIcon[node.status];

  return (
    <div>
      <div
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-[12px] transition-colors",
          selectedId === node.id ? "bg-bg-weak-50" : "hover:bg-bg-weak-50/50",
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className='flex size-4 items-center justify-center'
          >
            {open ? (
              <RiArrowDownSLine className='size-3' />
            ) : (
              <RiArrowRightSLine className='size-3' />
            )}
          </button>
        ) : (
          <span className='size-4' />
        )}
        <Icon
          className={cn(
            "size-3 shrink-0",
            statusColor[node.status],
            node.status === "running" && "animate-spin",
          )}
        />
        <span className='text-text-strong-950 truncate'>{node.name}</span>
        <span className='text-text-sub-600 ml-auto shrink-0 font-mono text-[11px] tabular-nums'>
          {formatDuration(node.latencyMs)}
        </span>
      </div>
      {open &&
        hasChildren &&
        node.children.map((child) => (
          <SpanTreeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

// --- Waterfall View ---

function WaterfallView({
  spans,
  selectedId,
  onSelect,
}: {
  spans: FlatSpan[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const traceStart = Math.min(...spans.map((s) => new Date(s.startTime).getTime()));
  const knownEnds = spans.filter((s) => s.endTime).map((s) => new Date(s.endTime!).getTime());
  const latestKnownEnd = knownEnds.length > 0 ? Math.max(...knownEnds) : traceStart + 1000;
  const traceEnd = Math.max(
    latestKnownEnd,
    ...spans.map((s) =>
      s.endTime
        ? new Date(s.endTime).getTime()
        : new Date(s.startTime).getTime() + (s.latencyMs ?? 0),
    ),
  );
  const totalDuration = traceEnd - traceStart || 1;

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
    <div className='p-2'>
      {/* Time ruler */}
      <div className='text-text-sub-600 mb-1 flex justify-between px-2 font-mono text-[10px] tabular-nums'>
        <span>0ms</span>
        <span>{formatDuration(totalDuration / 4)}</span>
        <span>{formatDuration(totalDuration / 2)}</span>
        <span>{formatDuration((totalDuration * 3) / 4)}</span>
        <span>{formatDuration(totalDuration)}</span>
      </div>

      {sortedSpans.map((span) => {
        const spanStart = new Date(span.startTime).getTime();
        const spanEnd = span.endTime
          ? new Date(span.endTime).getTime()
          : new Date(span.startTime).getTime() + (span.latencyMs ?? totalDuration * 0.1);
        const leftPct = ((spanStart - traceStart) / totalDuration) * 100;
        const widthPct = Math.max(((spanEnd - spanStart) / totalDuration) * 100, 0.5);

        return (
          <div
            key={span.id}
            className={cn(
              "relative cursor-pointer rounded-md px-2 py-1.5 transition-colors",
              selectedId === span.id ? "bg-bg-weak-50" : "hover:bg-bg-weak-50/50",
            )}
            style={{ paddingLeft: `${span.depth * 16 + 8}px` }}
            onClick={() => onSelect(span.id)}
          >
            {/* Full-width progress bar */}
            <div className='relative h-6 w-full rounded-sm'>
              <div
                className={cn(
                  "absolute inset-y-0 rounded-sm",
                  typeColor[span.type] ?? "bg-gray-400",
                )}
                style={{ left: `${leftPct}%`, width: `${widthPct}%`, opacity: 0.2 }}
              />
              {/* Name + latency positioned at the span bar */}
              <div
                className='absolute inset-y-0 flex items-center gap-1.5 px-1.5'
                style={{ left: `${leftPct}%` }}
              >
                {React.createElement(getSpanIcon(span), {
                  className: cn("size-3 shrink-0", statusColor[span.status]),
                })}
                <span className='text-text-strong-950 truncate text-[11px] font-medium'>
                  {span.name}
                </span>
                <span className='text-text-sub-600 shrink-0 font-mono text-[10px] tabular-nums'>
                  {formatDuration(span.latencyMs)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Span Detail (Scroll-based tab navigation) ---

function SpanDetail({ span }: { span: FlatSpan }) {
  const hasError = !!span.error;
  const hasAttributes =
    span.type === "llm" && (span.model || span.totalTokens != null || span.costUsd != null);

  const sections = React.useMemo(() => {
    const s: { id: string; label: string }[] = [
      { id: "input", label: "Input" },
      { id: "output", label: "Output" },
    ];
    if (hasError) s.push({ id: "error", label: "Error" });
    if (hasAttributes) s.push({ id: "attributes", label: "Attributes" });
    s.push({ id: "metadata", label: "Metadata" });
    return s;
  }, [hasError, hasAttributes]);

  const [activeTab, setActiveTab] = useState(hasError ? "error" : "input");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = sectionRefs.current.get(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section");
            if (section) setActiveTab(section);
          }
        }
      },
      { root: container, rootMargin: "-10% 0px -80% 0px", threshold: 0 },
    );

    for (const el of sectionRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [span.id]);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  };

  return (
    <div className='flex h-full flex-col'>
      {/* Span header */}
      <div className='border-faded-lighter dark:border-stroke-soft-200 shrink-0 border-b px-3 py-2'>
        <div className='flex items-center gap-2'>
          <h3 className='text-text-strong-950 truncate text-[13px] font-medium'>{span.name}</h3>
          <Badge.Root
            color={span.status === "success" ? "green" : span.status === "error" ? "red" : "orange"}
            variant='light'
            className='px-1.5 text-[10px]'
          >
            {span.status}
          </Badge.Root>
          <Badge.Root color='gray' variant='light' className='ml-auto px-1.5 text-[10px]'>
            {span.type}
          </Badge.Root>
        </div>
      </div>

      {/* Tab navigation */}
      <TabMenuHorizontal.Root value={activeTab} onValueChange={scrollToSection}>
        <TabMenuHorizontal.List className='border-faded-lighter h-9 gap-4 border-t-0 px-3'>
          {sections.map((s) => (
            <TabMenuHorizontal.Trigger key={s.id} value={s.id} className={cn("h-9 text-[12px]")}>
              {s.label}
            </TabMenuHorizontal.Trigger>
          ))}
        </TabMenuHorizontal.List>
      </TabMenuHorizontal.Root>

      {/* Scrollable sections */}
      <div ref={containerRef} className='no-scrollbar flex-1 overflow-auto px-3 py-2'>
        <section ref={setSectionRef("input")} data-section='input' className='mb-6'>
          <SectionLabel>Input</SectionLabel>
          {span.input ? (
            <pre className='bg-bg-weak-50 border-stroke-soft-200 overflow-auto rounded-md border p-3 font-mono text-[11px] break-all whitespace-pre-wrap'>
              {JSON.stringify(span.input, null, 2)}
            </pre>
          ) : (
            <p className='text-text-sub-600 text-[12px]'>No input data</p>
          )}
        </section>

        <section ref={setSectionRef("output")} data-section='output' className='mb-6'>
          <SectionLabel>Output</SectionLabel>
          {span.output ? (
            <pre className='bg-bg-weak-50 border-stroke-soft-200 overflow-auto rounded-md border p-3 font-mono text-[11px] break-all whitespace-pre-wrap'>
              {JSON.stringify(span.output, null, 2)}
            </pre>
          ) : span.status === "running" ? (
            <div className='border-warning-base/30 bg-warning-base/5 text-warning-base rounded-md border p-3 text-[12px]'>
              Span is still running…
            </div>
          ) : (
            <p className='text-text-sub-600 text-[12px]'>No output data</p>
          )}
        </section>

        {hasError && (
          <section ref={setSectionRef("error")} data-section='error' className='mb-6'>
            <SectionLabel className='text-error-base'>Error</SectionLabel>
            <div className='border-error-base/30 bg-error-base/5 rounded-md border p-3'>
              <pre className='text-error-base/90 font-mono text-[11px] break-all whitespace-pre-wrap'>
                {span.error}
              </pre>
            </div>
          </section>
        )}

        {hasAttributes && (
          <section ref={setSectionRef("attributes")} data-section='attributes' className='mb-6'>
            <SectionLabel>Attributes</SectionLabel>
            <div className='grid grid-cols-2 gap-3 text-[12px]'>
              {span.model && <Attr label='Model' value={span.model} />}
              {span.promptTokens != null && (
                <Attr label='Prompt Tokens' value={String(span.promptTokens)} />
              )}
              {span.completionTokens != null && (
                <Attr label='Completion Tokens' value={String(span.completionTokens)} />
              )}
              {span.totalTokens != null && (
                <Attr label='Total Tokens' value={formatTokens(span.totalTokens)} />
              )}
              {span.costUsd != null && <Attr label='Cost' value={formatCost(span.costUsd)} />}
              {span.latencyMs != null && (
                <Attr label='Latency' value={formatDuration(span.latencyMs)} />
              )}
            </div>
          </section>
        )}

        <section ref={setSectionRef("metadata")} data-section='metadata' className='mb-6'>
          <SectionLabel>Metadata</SectionLabel>
          <div className='grid grid-cols-2 gap-3 text-[12px]'>
            <Attr label='Span ID' value={span.id} mono />
            <Attr label='Type' value={span.type} />
            <Attr label='Status' value={span.status} />
            {span.startTime && (
              <Attr label='Start' value={new Date(span.startTime).toLocaleTimeString()} />
            )}
            {span.endTime && (
              <Attr label='End' value={new Date(span.endTime).toLocaleTimeString()} />
            )}
            {span.parentId && <Attr label='Parent ID' value={span.parentId} mono />}
          </div>
        </section>

        <div className='h-[60vh]' aria-hidden='true'></div>
      </div>
    </div>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h4 className={cn("text-text-strong-950 mb-2 text-[12px] font-medium", className)}>
      {children}
    </h4>
  );
}

function Attr({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className='text-text-sub-600 text-[11px]'>{label}</div>
      <div className={cn("text-text-strong-950 mt-0.5", mono && "font-mono text-[11px]")}>
        {value}
      </div>
    </div>
  );
}

// --- Compound export ---

export const TraceDetailPanel = { Root, Header, Body };
