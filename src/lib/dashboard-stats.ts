import tracesJson from "@/data/traces.json";

const traces = tracesJson.traces;

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

const completedTraces = traces.filter(
  (t) => t.latencyMs != null && t.status !== "running",
);
const latencies = completedTraces
  .map((t) => t.latencyMs as number)
  .sort((a, b) => a - b);

export const stats = {
  totalTraces: traces.length,
  totalCost: traces.reduce((s, t) => s + t.totalCostUsd, 0),
  totalTokens: traces.reduce((s, t) => s + t.totalTokens, 0),
  errorCount: traces.filter((t) => t.status === "error").length,
  errorRate:
    (traces.filter((t) => t.status === "error").length / traces.length) * 100,
  p50: percentile(latencies, 50),
  p95: percentile(latencies, 95),
};

// Latency histogram - 500ms buckets
export function getLatencyHistogram() {
  if (latencies.length === 0) return [];
  const bucketSize = 500;
  const max = latencies[latencies.length - 1];
  const bucketCount = Math.min(Math.ceil(max / bucketSize) + 1, 20);
  const buckets: { range: string; count: number; from: number }[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const from = i * bucketSize;
    const to = (i + 1) * bucketSize;
    buckets.push({
      range: `${(from / 1000).toFixed(1)}`,
      count: 0,
      from,
    });
  }
  for (const l of latencies) {
    const idx = Math.min(Math.floor(l / bucketSize), bucketCount - 1);
    buckets[idx].count++;
  }
  return buckets;
}

// Cost by model
export function getCostByModel() {
  const map: Record<string, { cost: number; tokens: number }> = {};
  for (const t of traces) {
    for (const s of t.spans) {
      if ("costUsd" in s && s.costUsd != null) {
        const model = (s as { model?: string }).model ?? "unknown";
        if (!map[model]) map[model] = { cost: 0, tokens: 0 };
        map[model].cost += s.costUsd as number;
        map[model].tokens += ((s as { totalTokens?: number }).totalTokens ?? 0);
      }
    }
  }
  return Object.entries(map)
    .map(([model, { cost, tokens }]) => ({ model, cost, tokens }))
    .sort((a, b) => b.cost - a.cost);
}

// Error rate over time (by day)
export function getErrorRateOverTime() {
  const map: Record<string, { date: string; total: number; errors: number }> =
    {};
  for (const t of traces) {
    const day = t.startTime.slice(0, 10);
    if (!map[day]) map[day] = { date: day, total: 0, errors: 0 };
    map[day].total++;
    if (t.status === "error") map[day].errors++;
  }
  return Object.values(map)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      rate: d.total > 0 ? (d.errors / d.total) * 100 : 0,
    }));
}

// Token usage over time (by day)
export function getTokenUsageOverTime() {
  const map: Record<
    string,
    { date: string; prompt: number; completion: number }
  > = {};
  for (const t of traces) {
    const day = t.startTime.slice(0, 10);
    if (!map[day]) map[day] = { date: day, prompt: 0, completion: 0 };
    for (const s of t.spans) {
      if ("promptTokens" in s) {
        map[day].prompt += ((s as { promptTokens?: number }).promptTokens ?? 0);
        map[day].completion += ((s as { completionTokens?: number }).completionTokens ?? 0);
      }
    }
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

// Sparkline data (traces per day as simple value array)
export function getTracesSparkline() {
  const map: Record<string, number> = {};
  for (const t of traces) {
    const day = t.startTime.slice(0, 10);
    map[day] = (map[day] ?? 0) + 1;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

export function getCostSparkline() {
  const map: Record<string, number> = {};
  for (const t of traces) {
    const day = t.startTime.slice(0, 10);
    map[day] = (map[day] ?? 0) + t.totalCostUsd;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

export function getTokensSparkline() {
  const map: Record<string, number> = {};
  for (const t of traces) {
    const day = t.startTime.slice(0, 10);
    map[day] = (map[day] ?? 0) + t.totalTokens;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

export function getErrorsSparkline() {
  const map: Record<string, number> = {};
  for (const t of traces) {
    const day = t.startTime.slice(0, 10);
    if (t.status === "error") map[day] = (map[day] ?? 0) + 1;
    else map[day] = map[day] ?? 0;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}
