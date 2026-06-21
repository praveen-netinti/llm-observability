"use client";

import * as React from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import { RiLayoutLeft2Line, RiSpeedLine } from "@remixicon/react";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getCostByModel,
  getCostSparkline,
  getErrorRateOverTime,
  getErrorsSparkline,
  getLatencyHistogram,
  getTokensSparkline,
  getTokenUsageOverTime,
  getTracesSparkline,
  stats,
} from "@/lib/dashboard-stats";
import { cn } from "@/utils/cn";

import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as ButtonGroup from "@/components/ui/button-group";
import * as Divider from "@/components/ui/divider";

const histogram = getLatencyHistogram();
const costByModel = getCostByModel();
const errorOverTime = getErrorRateOverTime();
const tokenOverTime = getTokenUsageOverTime();
const tracesSparkline = getTracesSparkline();
const costSparkline = getCostSparkline();
const tokensSparkline = getTokensSparkline();
const errorsSparkline = getErrorsSparkline();

// Custom tooltip matching marketing-template-master style
function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
  labelFormatter?: (l: string) => string;
  valueFormatter?: (v: number, name: string) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className='bg-bg-white-0 ring-stroke-soft-200 rounded-xl px-3 py-2.5 ring-1'
      style={{
        filter:
          "drop-shadow(0px 12px 24px rgba(14, 18, 27, 0.06)) drop-shadow(0px 1px 2px rgba(14, 18, 27, 0.03))",
      }}
    >
      <div className='text-label-xs text-text-soft-400'>
        {labelFormatter ? labelFormatter(label ?? "") : label}
      </div>
      <div className='mt-1 flex flex-col gap-1'>
        {payload.map((entry, i) => (
          <div key={i} className='flex items-center gap-2'>
            <span
              className='inline-block size-2 rounded-full'
              style={{ backgroundColor: entry.color }}
            />
            <span className='text-label-sm text-text-strong-950 tabular-nums'>
              {valueFormatter
                ? valueFormatter(entry.value, entry.name)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Line chart class pattern from marketing-template-master --
const lineChartClassName = cn(
  "[&_.recharts-cartesian-grid-horizontal>line]:stroke-bg-weak-50 [&_.recharts-cartesian-grid-horizontal>line]:[stroke-dasharray:0]",
  "[&_.recharts-cartesian-grid-vertical>line:last-child]:opacity-0 [&_.recharts-cartesian-grid-vertical>line:nth-last-child(2)]:opacity-0",
);

const axisClassName =
  "[&_.recharts-cartesian-axis-tick_text]:fill-text-soft-400 [&_.recharts-cartesian-axis-tick_text]:text-label-xs";

const activeDotProps = {
  r: 5.5,
  strokeWidth: 3,
  className:
    "stroke-stroke-white-0 [filter:drop-shadow(0_6px_10px_#0e121b0f)_drop-shadow(0_2px_4px_#0e121b08)]",
};

// -- Stat Cards (campaign-data style with sparkline) --
function StatCards() {
  const [latencyView, setLatencyView] = React.useState<"p50" | "p95">("p50");

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      <StatCard
        title='Total Traces'
        value={stats.totalTraces.toLocaleString()}
        badge='7 days'
        badgeColor='green'
        data={tracesSparkline}
        color='var(--color-primary-base)'
      />
      <StatCard
        title='Total Cost'
        value={`$${stats.totalCost.toFixed(2)}`}
        badge='all models'
        badgeColor='gray'
        data={costSparkline}
        color='var(--color-warning-base)'
      />
      <StatCard
        title='Total Tokens'
        value={
          stats.totalTokens >= 1000
            ? `${(stats.totalTokens / 1000).toFixed(1)}K`
            : String(stats.totalTokens)
        }
        badge='prompt + completion'
        badgeColor='gray'
        data={tokensSparkline}
        color='var(--color-information-base)'
      />
      <StatCard
        title='Error Rate'
        value={`${stats.errorRate.toFixed(1)}%`}
        badge={`${stats.errorCount} errors`}
        badgeColor='red'
        data={errorsSparkline}
        color='var(--color-error-base)'
      />
      {/* Latency card with toggle */}
      <div className='bg-bg-white-0 shadow-regular-xs ring-stroke-soft-200 relative flex w-full flex-col overflow-hidden rounded-2xl ring-1 ring-inset'>
        <div className='flex items-start gap-2 p-5 pb-3'>
          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              <div className='text-label-sm text-text-sub-600'>Latency</div>
            </div>
            <div className='mt-1 flex items-center gap-2'>
              <div className='text-title-h5 text-text-strong-950 tabular-nums'>
                {formatMs(latencyView === "p50" ? stats.p50 : stats.p95)}
              </div>
              <Badge.Root variant='lighter' color='gray' size='medium'>
                {latencyView === "p50" ? "median" : "95th pctl"}
              </Badge.Root>
            </div>
          </div>
        </div>
        <div className='border-faded-lighter flex h-[62px] items-center border-t px-4'>
          <ButtonGroup.Root size='xxsmall'>
            <ButtonGroup.Item
              data-state={latencyView === "p50" ? "on" : "off"}
              onClick={() => setLatencyView("p50")}
            >
              P50: {formatMs(stats.p50)}
            </ButtonGroup.Item>
            <ButtonGroup.Item
              data-state={latencyView === "p95" ? "on" : "off"}
              onClick={() => setLatencyView("p95")}
            >
              P95: {formatMs(stats.p95)}
            </ButtonGroup.Item>
          </ButtonGroup.Root>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  badge,
  badgeColor,
  data,
  color,
}: {
  title: string;
  value: string;
  badge: string;
  badgeColor: "green" | "red" | "gray";
  data: { date: string; value: number }[];
  color: string;
}) {
  return (
    <div className='bg-bg-white-0 shadow-regular-xs ring-stroke-soft-200 relative flex w-full flex-col overflow-hidden rounded-2xl ring-1 ring-inset'>
      <div className='flex items-start gap-2 p-5 pb-3'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>{title}</div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950 tabular-nums'>{value}</div>
            <Badge.Root variant='lighter' color={badgeColor} size='medium'>
              {badge}
            </Badge.Root>
          </div>
        </div>
      </div>
      <div className='border-faded-lighter h-[62px] border-t'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis hide dataKey='date' />
            <YAxis hide domain={[0, "auto"]} />
            <Area
              type='linear'
              dataKey='value'
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.08}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// -- Stat Summary (analytics-summary style, inline row with dividers) --
function StatSummary() {
  const [latencyView, setLatencyView] = React.useState<"p50" | "p95">("p50");

  return (
    <div className='flex flex-col flex-wrap gap-4 lg:flex-row lg:gap-0'>
      <StatSummaryItem title='Total Traces' value={stats.totalTraces.toLocaleString()} />
      <StatSummaryDivider />
      <StatSummaryItem title='Total Cost' value={`$${stats.totalCost.toFixed(2)}`} />
      <StatSummaryDivider />
      <StatSummaryItem
        title='Total Tokens'
        value={
          stats.totalTokens >= 1000
            ? `${(stats.totalTokens / 1000).toFixed(1)}K`
            : String(stats.totalTokens)
        }
      />
      <StatSummaryDivider />
      <StatSummaryItem
        title='Error Rate'
        value={`${stats.errorRate.toFixed(1)}%`}
        trendLabel={`${stats.errorCount} errors`}
        trendColor={stats.errorRate > 10 ? "text-error-base" : "text-success-base"}
      />
      <StatSummaryDivider />
      <div className='flex w-full flex-col lg:w-1/5 lg:px-7'>
        <div className='flex items-center justify-between'>
          <div className='text-label-sm text-text-sub-600'>Latency</div>
          <ButtonGroup.Root size='xxsmall'>
            <ButtonGroup.Item
              data-state={latencyView === "p50" ? "on" : "off"}
              onClick={() => setLatencyView("p50")}
            >
              P50
            </ButtonGroup.Item>
            <ButtonGroup.Item
              data-state={latencyView === "p95" ? "on" : "off"}
              onClick={() => setLatencyView("p95")}
            >
              P95
            </ButtonGroup.Item>
          </ButtonGroup.Root>
        </div>
        <div className='mt-1 flex items-center gap-1.5'>
          <div className='text-title-h5 text-text-strong-950 tabular-nums'>
            {formatMs(latencyView === "p50" ? stats.p50 : stats.p95)}
          </div>
          <div className='text-label-xs text-text-sub-600'>
            {latencyView === "p50" ? "median" : "95th pctl"}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatSummaryItem({
  title,
  value,
  trendLabel,
  trendColor,
}: {
  title: string;
  value: string;
  trendLabel?: string;
  trendColor?: string;
}) {
  return (
    <div className='flex w-full flex-col lg:w-1/5 lg:px-7 lg:first:pl-0 lg:last:pr-0'>
      <div className='text-label-sm text-text-sub-600'>{title}</div>
      <div className='mt-1 flex items-center gap-1.5'>
        <div className='text-title-h5 text-text-strong-950 tabular-nums'>{value}</div>
        {trendLabel && (
          <div className='text-label-xs text-text-sub-600'>
            <span className={trendColor}>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatSummaryDivider() {
  return (
    <>
      <div className='before:bg-stroke-soft-200 relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px lg:block' />
      <Divider.Root className='lg:hidden' />
    </>
  );
}

// -- Latency Distribution --
function WidgetLatencyDistribution() {
  if (histogram.length === 0) return <EmptyChart title='Latency Distribution' />;

  return (
    <ChartCard>
      <ChartHeader
        title='Latency Distribution'
        value={formatMs(stats.p50)}
        badge={`p95: ${formatMs(stats.p95)}`}
        badgeColor='gray'
        description='median (p50)'
      >
        <div className='text-label-xs text-text-soft-400 flex items-center gap-3'>
          <span className='flex items-center gap-1'>
            <span className='bg-information-base inline-block size-2 rounded-full' />
            p50
          </span>
          <span className='flex items-center gap-1'>
            <span className='bg-warning-base inline-block size-2 rounded-full' />
            p95
          </span>
        </div>
      </ChartHeader>

      <ResponsiveContainer width='100%' height={192}>
        <LineChart
          data={histogram}
          margin={{ top: 6, right: 0, left: 0, bottom: 6 }}
          className={lineChartClassName}
        >
          <CartesianGrid strokeDasharray='4 4' className='stroke-stroke-soft-200' />
          <XAxis
            dataKey='range'
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            padding={{ left: 16, right: 16 }}
            className={axisClassName}
            unit='s'
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={16}
            orientation='right'
            className={axisClassName}
            allowDecimals={false}
          />
          <RechartsTooltip
            cursor={false}
            content={
              <ChartTooltip
                labelFormatter={(l) => `${l}–${(parseFloat(l) + 0.5).toFixed(1)}s latency`}
                valueFormatter={(v) => `${v} trace${v !== 1 ? "s" : ""}`}
              />
            }
          />
          <ReferenceLine
            x={`${(Math.floor(stats.p50 / 500) * 500 / 1000).toFixed(1)}`}
            stroke='var(--color-information-base)'
            strokeDasharray='4 4'
            strokeWidth={1.5}
            label={{ value: "p50", position: "insideTopRight", fontSize: 10, fill: "var(--color-information-base)", dy: 4 }}
          />
          <ReferenceLine
            x={`${(Math.floor(stats.p95 / 500) * 500 / 1000).toFixed(1)}`}
            stroke='var(--color-warning-base)'
            strokeDasharray='4 4'
            strokeWidth={1.5}
            label={{ value: "p95", position: "insideTopRight", fontSize: 10, fill: "var(--color-warning-base)", dy: 4 }}
          />
          <Line
            dataKey='count'
            stroke='var(--color-primary-base)'
            strokeWidth={2}
            dot={false}
            strokeLinejoin='round'
            activeDot={activeDotProps}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// -- Cost by Model --
function WidgetCostByModel() {
  if (costByModel.length === 0) return <EmptyChart title='Cost by Model' />;

  return (
    <ChartCard>
      <ChartHeader
        title='Cost by Model'
        value={`$${stats.totalCost.toFixed(2)}`}
        badge={`${costByModel.length} models`}
        badgeColor='gray'
        description='total spend'
      />

      <div className='flex flex-col gap-3'>
        {costByModel.map((item) => {
          const pct = (item.cost / stats.totalCost) * 100;
          return (
            <div key={item.model} className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <div className='text-label-sm text-text-sub-600'>{item.model}</div>
                <div className='text-label-sm text-text-strong-950 tabular-nums'>
                  ${item.cost.toFixed(3)}
                </div>
              </div>
              <div className='bg-bg-weak-50 h-2 w-full overflow-hidden rounded-full'>
                <div
                  className='bg-primary-base h-full rounded-full transition-all'
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// -- Error Rate Over Time --
function WidgetErrorRate() {
  if (errorOverTime.length === 0) return <EmptyChart title='Error Rate Over Time' />;

  return (
    <ChartCard>
      <ChartHeader
        title='Error Rate Over Time'
        value={`${stats.errorRate.toFixed(1)}%`}
        badge={`${stats.errorCount} errors`}
        badgeColor='red'
        description='of all traces'
      />

      <ResponsiveContainer width='100%' height={192}>
        <LineChart
          data={errorOverTime}
          margin={{ top: 6, right: 0, left: 0, bottom: 6 }}
          className={lineChartClassName}
        >
          <RechartsTooltip
            cursor={false}
            content={
              <ChartTooltip
                labelFormatter={(l) => format(new Date(l), "MMM d, yyyy")}
                valueFormatter={(v) => `${v.toFixed(1)}%`}
              />
            }
          />
          <CartesianGrid strokeDasharray='4 4' className='stroke-stroke-soft-200' />
          <XAxis
            dataKey='date'
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(d) => format(new Date(d), "MMM d")}
            minTickGap={40}
            padding={{ left: 16, right: 16 }}
            className={axisClassName}
          />
          <YAxis
            orientation='right'
            axisLine={false}
            tickLine={false}
            tickMargin={16}
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            className={axisClassName}
          />
          <Line
            dataKey='rate'
            stroke='var(--color-error-base)'
            strokeWidth={2}
            dot={false}
            strokeLinejoin='round'
            activeDot={activeDotProps}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// -- Token Usage Over Time --
function WidgetTokenUsage() {
  if (tokenOverTime.length === 0) return <EmptyChart title='Token Usage Over Time' />;

  return (
    <ChartCard>
      <ChartHeader
        title='Token Usage Over Time'
        value={
          stats.totalTokens >= 1000
            ? `${(stats.totalTokens / 1000).toFixed(1)}K`
            : String(stats.totalTokens)
        }
        badge='total tokens'
        badgeColor='gray'
      >
        <div className='text-label-xs text-text-soft-400 flex items-center gap-3'>
          <span className='flex items-center gap-1'>
            <span className='bg-information-base inline-block size-2 rounded-full' />
            Prompt
          </span>
          <span className='flex items-center gap-1'>
            <span className='bg-success-base inline-block size-2 rounded-full' />
            Completion
          </span>
        </div>
      </ChartHeader>

      <ResponsiveContainer width='100%' height={192}>
        <LineChart
          data={tokenOverTime}
          margin={{ top: 6, right: 0, left: 0, bottom: 6 }}
          className={lineChartClassName}
        >
          <RechartsTooltip
            cursor={false}
            content={
              <ChartTooltip
                labelFormatter={(l) => format(new Date(l), "MMM d, yyyy")}
                valueFormatter={(v, name) =>
                  `${v.toLocaleString()} ${name === "prompt" ? "prompt" : "completion"}`
                }
              />
            }
          />
          <CartesianGrid strokeDasharray='4 4' className='stroke-stroke-soft-200' />
          <XAxis
            dataKey='date'
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(d) => format(new Date(d), "MMM d")}
            minTickGap={40}
            padding={{ left: 16, right: 16 }}
            className={axisClassName}
          />
          <YAxis
            orientation='right'
            axisLine={false}
            tickLine={false}
            tickMargin={16}
            tickFormatter={(v) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(v)}
            className={axisClassName}
          />
          <Line
            dataKey='prompt'
            stroke='var(--color-information-base)'
            strokeWidth={2}
            dot={false}
            strokeLinejoin='round'
            activeDot={activeDotProps}
          />
          <Line
            dataKey='completion'
            stroke='var(--color-success-base)'
            strokeWidth={2}
            dot={false}
            strokeLinejoin='round'
            activeDot={activeDotProps}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// -- Shared --
function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-bg-white-0 shadow-regular-xs ring-stroke-soft-200 relative flex w-full flex-col gap-5 rounded-2xl p-5 ring-1 ring-inset'>
      {children}
    </div>
  );
}

function ChartHeader({
  title,
  value,
  badge,
  badgeColor,
  description,
  children,
}: {
  title: string;
  value?: string;
  badge?: string;
  badgeColor?: "green" | "red" | "gray";
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
      <div>
        <div className='text-label-sm text-text-sub-600'>{title}</div>
        {value && (
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>{value}</div>
            {badge && (
              <Badge.Root variant='lighter' color={badgeColor ?? "gray"} size='medium'>
                {badge}
              </Badge.Root>
            )}
            {description && <div className='text-label-xs text-text-sub-600'>{description}</div>}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyChart({ title }: { title: string }) {
  return (
    <ChartCard>
      <div className='flex h-[232px] flex-col items-center justify-center gap-2'>
        <div className='text-label-sm text-text-sub-600'>{title}</div>
        <div className='text-paragraph-sm text-text-soft-400'>No data available</div>
      </div>
    </ChartCard>
  );
}

function formatMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

// -- Main Page --
export default function MainPage() {
  const { onMenuClick } = useSidebar();

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 relative flex h-full flex-col lg:rounded-2xl lg:border'>
        <div className='border-faded-lighter flex h-11 w-full items-center border-b px-4'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={onMenuClick}
            className='size-7 cursor-pointer rounded-lg p-0 lg:hidden'
          >
            <Button.Icon as={RiLayoutLeft2Line} className='text-text-soft-400' />
          </Button.Root>
          <RiSpeedLine className='text-text-soft-400 mr-2 size-4' />
          <span className='text-label-sm text-text-strong-950'>Dashboard</span>
        </div>

        <div className='flex-1 overflow-y-auto'>
          <div className='px-4 py-6 lg:px-8'>
            <StatCards />
          </div>

          {/* <div className='px-4 py-6 lg:px-8'>
            <StatSummary />
          </div> */}

          <div className='px-4 lg:px-8'>
            <Divider.Root />
          </div>

          <div className='flex flex-col gap-6 px-4 py-6 lg:px-8'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <WidgetLatencyDistribution />
              <WidgetCostByModel />
            </div>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <WidgetErrorRate />
              <WidgetTokenUsage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
