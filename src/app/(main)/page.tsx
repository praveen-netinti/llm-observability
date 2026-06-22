"use client";

import * as React from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  RiArrowDownSFill,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiLayoutLeft2Line,
  RiThumbDownLine,
  RiThumbUpLine,
} from "@remixicon/react";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  getCostByModel,
  getCostSparkline,
  getEnvironmentBreakdown,
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
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as ButtonGroup from "@/components/ui/button-group";
import * as Divider from "@/components/ui/divider";

import { IconUserBox } from "./traces/layout";

const histogram = getLatencyHistogram();
const costByModel = getCostByModel();
const errorOverTime = getErrorRateOverTime();
const tokenOverTime = getTokenUsageOverTime();
const tracesSparkline = getTracesSparkline();
const costSparkline = getCostSparkline();
const tokensSparkline = getTokensSparkline();
const errorsSparkline = getErrorsSparkline();
const envBreakdown = getEnvironmentBreakdown();

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
      className='bg-bg-white-0 ring-stroke-soft-200 relative z-50 rounded-xl px-3 py-2.5 ring-1'
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
    "stroke-stroke-white-0 filter-[drop-shadow(0_6px_10px_#0e121b0f)_drop-shadow(0_2px_4px_#0e121b08)]",
};

function StatTiles() {
  const tiles: {
    title: string;
    value: string;
    delta?: { value: number; goodWhenDown?: boolean };
    context: string;
  }[] = [
    {
      title: "Total Traces",
      value: stats.totalTraces.toLocaleString(),
      delta: { value: stats.tracesDelta },
      context: `${stats.dayCount}d`,
    },
    {
      title: "Total Cost",
      value: `$${stats.totalCost.toFixed(2)}`,
      delta: { value: stats.costDelta },
      context: `${stats.modelCount} models`,
    },
    {
      title: "Total Tokens",
      value:
        stats.totalTokens >= 1000
          ? `${(stats.totalTokens / 1000).toFixed(1)}K`
          : String(stats.totalTokens),
      delta: { value: stats.tokensDelta },
      context: "in + out",
    },
    {
      title: "Error Rate",
      value: `${stats.errorRate.toFixed(1)}%`,
      delta: { value: stats.errorsDelta, goodWhenDown: true },
      context: `${stats.errorCount} failed`,
    },
    {
      title: "P50 Latency",
      value: formatMs(stats.p50),
      context: "median",
    },
    {
      title: "P95 Latency",
      value: formatMs(stats.p95),
      context: `${stats.completedCount} done`,
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>
      {tiles.map((tile, idx) => (
        <div
          key={tile.title}
          className={cn(
            "flex flex-col rounded-xl border p-3 transition-colors",
            "border-faded-lighter bg-bg-white-0 hover:border-stroke-soft-200 hover:bg-bg-weak-50",
          )}
        >
          <span className='text-label-xs text-text-soft-400'>{tile.title}</span>
          <span className='text-title-h5 text-text-strong-950 mt-1 tracking-tight tabular-nums'>
            {tile.value}
          </span>
          <div className='mt-4 flex flex-wrap items-center gap-1'>
            {tile.delta && Math.abs(tile.delta.value) >= 0.1 ? (
              <>
                <DeltaIndicator value={tile.delta.value} goodWhenDown={tile.delta.goodWhenDown} />
                <span className='text-label-xs text-text-soft-400 whitespace-nowrap'>vs prev</span>
              </>
            ) : (
              <span className='text-label-xs text-text-soft-400 whitespace-nowrap'>
                {tile.context}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DeltaIndicator({ value, goodWhenDown }: { value: number; goodWhenDown?: boolean }) {
  const isUp = value > 0;
  const isGood = goodWhenDown ? !isUp : isUp;
  return (
    <span
      className={cn(
        "text-label-xs flex items-center gap-0.5 font-medium tabular-nums",
        isGood ? "text-success-base" : "text-error-base",
      )}
    >
      {isUp ? <RiArrowUpSFill className='size-3.5' /> : <RiArrowDownSFill className='size-3.5' />}
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}
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
        <div className='border-faded-lighter flex h-15.5 items-center border-t px-4'>
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
    <div className='bg-bg-white-0 ring-faded-lighter relative flex w-full flex-col rounded-2xl ring-0 ring-inset'>
      <div className='flex items-start gap-2 pb-3'>
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
      <div className='h-[62px]'>
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
        <Button.Root size='xsmall' variant='neutral' mode='stroke'>
          Details
        </Button.Root>
      </ChartHeader>

      <ResponsiveContainer width='100%' height={192} className='pr-1 pl-3'>
        <AreaChart
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
            x={`${((Math.floor(stats.p50 / 500) * 500) / 1000).toFixed(1)}`}
            stroke='var(--color-information-base)'
            strokeDasharray='4 4'
            strokeWidth={1.5}
            label={{
              value: "p50",
              position: "insideTopRight",
              fontSize: 10,
              fill: "var(--color-information-base)",
              dy: 4,
            }}
          />
          <ReferenceLine
            x={`${((Math.floor(stats.p95 / 500) * 500) / 1000).toFixed(1)}`}
            stroke='var(--color-warning-base)'
            strokeDasharray='4 4'
            strokeWidth={1.5}
            label={{
              value: "p95",
              position: "insideTopRight",
              fontSize: 10,
              fill: "var(--color-warning-base)",
              dy: 4,
            }}
          />
          <Area
            type='monotone'
            dataKey='count'
            stroke='var(--color-primary-base)'
            strokeWidth={2}
            fill='var(--color-primary-base)'
            fillOpacity={0.08}
            activeDot={activeDotProps}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function Tracker({ value }: { value: number }) {
  return (
    <div className='relative h-6 w-full overflow-hidden'>
      <div
        className='bg-bg-soft-200 absolute inset-0'
        style={{
          WebkitMaskImage: "linear-gradient(90deg, #000 6px, #0000 6px)",
          maskImage: "linear-gradient(90deg, #000 6px, #0000 6px)",
          maskSize: "9px 100%",
          maskRepeat: "space",
        }}
      />
      <div
        className='absolute inset-y-0 left-0 overflow-hidden'
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          WebkitMaskImage: "linear-gradient(90deg, #000 6px, #0000 6px)",
          maskImage: "linear-gradient(90deg, #000 6px, #0000 6px)",
          maskSize: "9px 100%",
          maskRepeat: "space",
        }}
      >
        <div className='bg-primary-base absolute inset-0' style={{ width: "100vw" }} />
      </div>
    </div>
  );
}

const CATEGORY_COLORS = [
  "var(--color-primary-base)",
  "var(--color-orange-400)",
  "var(--color-orange-300)",
  "var(--color-warning-base)",
  "var(--color-information-base)",
];

function CategoryBar({ data }: { data: { label: string; value: number; sub?: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className='flex flex-col gap-4 px-6 pt-2 pb-6'>
      <div className='flex h-3 w-full gap-[3px] overflow-hidden'>
        {data.map((d, i) => (
          <div
            key={d.label}
            className='h-full rounded-sm transition-all'
            style={{
              width: `${(d.value / total) * 100}%`,
              backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
            }}
          />
        ))}
      </div>
      <div className='flex flex-col gap-2.5'>
        {data.map((d, i) => (
          <div key={d.label} className='flex items-center gap-2'>
            <span
              className='size-2 shrink-0 rounded-full'
              style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
            />
            <span className='text-label-sm text-text-sub-600 flex-1 truncate'>{d.label}</span>
            {d.sub && (
              <span className='text-label-xs text-text-soft-400 tabular-nums'>{d.sub}</span>
            )}
            <span className='text-label-sm text-text-strong-950 w-12 text-right tabular-nums'>
              {((d.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetCostByModel() {
  if (costByModel.length === 0) return <EmptyChart title='Cost by Model' />;

  const total = stats.totalCost || 1;
  const pieData = costByModel.map((item, i) => ({
    ...item,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <ChartCard>
      <ChartHeader
        title='Cost by Model'
        value={`$${stats.totalCost.toFixed(2)}`}
        badge={`${costByModel.length} models`}
        badgeColor='gray'
        description='total spend'
      />

      <div className='flex items-center gap-6 px-6 pb-6'>
        {/* Donut */}
        <div className='relative shrink-0' style={{ width: 132, height: 132 }}>
          <PieChart width={132} height={132}>
            <Pie
              data={pieData}
              dataKey='cost'
              nameKey='model'
              cx='50%'
              cy='50%'
              innerRadius={44}
              outerRadius={64}
              paddingAngle={2}
              cornerRadius={3}
              startAngle={90}
              endAngle={450}
              strokeWidth={0}
            >
              {pieData.map((d) => (
                <Cell key={d.model} fill={d.color} />
              ))}
            </Pie>
            <RechartsTooltip
              cursor={false}
              wrapperStyle={{ zIndex: 50 }}
              content={
                <ChartTooltip
                  valueFormatter={(v) => `$${v.toFixed(3)} (${((v / total) * 100).toFixed(0)}%)`}
                />
              }
            />
          </PieChart>
          {/* Center label */}
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-label-xs text-text-soft-400'>Total</span>
            <span className='text-label-md text-text-strong-950 tabular-nums'>
              ${stats.totalCost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className='flex flex-1 flex-col gap-2.5'>
          {pieData.map((d) => (
            <div key={d.model} className='flex items-center gap-2'>
              <span className='size-2 shrink-0 rounded-full' style={{ backgroundColor: d.color }} />
              <span className='text-label-sm text-text-sub-600 flex-1 truncate'>{d.model}</span>
              <span className='text-label-sm text-text-strong-950 tabular-nums'>
                ${d.cost.toFixed(3)}
              </span>
              <span className='text-label-xs text-text-soft-400 w-9 text-right tabular-nums'>
                {((d.cost / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

function WidgetReliability() {
  return (
    <ChartCard>
      <ChartHeader
        title='Reliability'
        value={`${stats.successRate.toFixed(1)}%`}
        badge={`${stats.successCount} ok`}
        badgeColor='green'
        description='success rate'
      />

      <div className='flex flex-col gap-5 px-6 pb-6'>
        {/* Success rate tracker */}
        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between'>
            <span className='text-label-sm text-text-sub-600'>Success rate</span>
            <span className='text-label-sm text-text-strong-950 tabular-nums'>
              {stats.successRate.toFixed(1)}%
            </span>
          </div>
          <Tracker value={stats.successRate} />
          <span className='text-label-xs text-text-soft-400 tabular-nums'>
            {stats.successCount} of {stats.totalTraces} traces succeeded
          </span>
        </div>

        {/* User satisfaction tracker */}
        {stats.feedbackTotal > 0 && (
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
              <span className='text-label-sm text-text-sub-600'>User satisfaction</span>
              <span className='text-label-sm text-text-strong-950 tabular-nums'>
                {stats.satisfactionRate.toFixed(0)}%
              </span>
            </div>
            <Tracker value={stats.satisfactionRate} />
            <span className='text-label-xs text-text-soft-400 flex items-center gap-1 tabular-nums'>
              <RiThumbUpLine className='text-success-base size-3.5' />
              {stats.feedbackUp}
              <span className='mx-0.5'>·</span>
              <RiThumbDownLine className='text-error-base size-3.5' />
              {stats.feedbackDown}
              <span className='ml-1'>from {stats.feedbackTotal} ratings</span>
            </span>
          </div>
        )}
      </div>
    </ChartCard>
  );
}

function WidgetEnvironments() {
  if (envBreakdown.length === 0) return <EmptyChart title='Traffic by Environment' />;

  return (
    <ChartCard>
      <ChartHeader
        title='Traffic by Environment'
        value={stats.totalTraces.toLocaleString()}
        badge={`${envBreakdown.length} envs`}
        badgeColor='gray'
        description='total traces'
      />

      <CategoryBar
        data={envBreakdown.map((e) => ({
          label: e.label,
          value: e.value,
          sub: `${e.value} traces`,
        }))}
      />
    </ChartCard>
  );
}

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
      <ResponsiveContainer width='100%' height={192} className='pr-3 pl-2'>
        <AreaChart
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
          <Area
            type='monotone'
            dataKey='rate'
            stroke='var(--color-error-base)'
            strokeWidth={2}
            fill='var(--color-error-base)'
            fillOpacity={0.08}
            activeDot={activeDotProps}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

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
            <span
              className='inline-block size-2 rounded-full'
              style={{ backgroundColor: "var(--color-green-400)" }}
            />
            Prompt
          </span>
          <span className='flex items-center gap-1'>
            <span
              className='inline-block size-2 rounded-full'
              style={{ backgroundColor: "var(--color-green-700)" }}
            />
            Completion
          </span>
        </div>
      </ChartHeader>

      <ResponsiveContainer width='100%' height={192} className='pr-4 pl-4'>
        <AreaChart
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
          <Area
            type='monotone'
            dataKey='prompt'
            stroke='var(--color-green-400)'
            strokeWidth={2}
            fill='var(--color-green-400)'
            fillOpacity={0.08}
            activeDot={activeDotProps}
          />
          <Area
            type='monotone'
            dataKey='completion'
            stroke='var(--color-green-700)'
            strokeWidth={2}
            fill='var(--color-green-700)'
            fillOpacity={0.08}
            activeDot={activeDotProps}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-faded-lighter flex w-full flex-col gap-5 rounded-2xl border'>
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
    <div className='flex flex-col justify-between gap-3 px-6 pt-6 sm:flex-row sm:items-center'>
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
    <div className='flex h-[192px] flex-col items-center justify-center gap-2'>
      <div className='text-label-sm text-text-sub-600'>{title}</div>
      <div className='text-paragraph-sm text-text-soft-400'>No data available</div>
    </div>
  );
}

function formatMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

export default function MainPage() {
  const { onMenuClick } = useSidebar();

  return (
    <div className='flex h-full flex-col lg:p-2 lg:pl-0'>
      <div className='bg-bg-white-0 lg:border-stroke-soft-200 relative flex h-full flex-col overflow-y-auto lg:rounded-2xl lg:border'>
        {/* Header */}
        <div className='flex h-11 min-h-11 items-center px-2'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xxsmall'
            onClick={onMenuClick}
            className='size-7 cursor-pointer rounded-lg p-0 lg:hidden'
          >
            <Button.Icon as={RiLayoutLeft2Line} className='text-text-soft-400' />
          </Button.Root>
          <Breadcrumb.Root className='ml-2.5 gap-0.5'>
            <Breadcrumb.Item className='text-[13px]!'>
              <Breadcrumb.Icon as={IconUserBox} className='size-4' />
              Praveen-netinti
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>

        <div className='flex items-center justify-between px-4 py-5 lg:px-5'>
          <div>
            <div className='text-label-lg text-text-strong-950'>Good morning, Praveen</div>
            <div className='text-label-sm text-text-sub-600 mt-1'>
              Welcome back to your dashboard 👋🏻
            </div>
          </div>
        </div>

        <div className='px-4 pt-4 lg:px-5'>
          <StatTiles />
        </div>

        <div className='px-4 py-6 lg:px-5'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start'>
            <div className='flex flex-1 flex-col gap-4'>
              <WidgetLatencyDistribution />
              <WidgetReliability />
              <WidgetErrorRate />
            </div>
            <div className='flex flex-1 flex-col gap-4'>
              <WidgetCostByModel />
              <WidgetEnvironments />
              <WidgetTokenUsage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
