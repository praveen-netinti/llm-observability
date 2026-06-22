import tracesJson from "@/data/traces.json";

export type FlatSpan = {
  id: string;
  traceId: string;
  parentId: string | null;
  depth: number;

  name: string;
  type: string;
  status: "success" | "error" | "running";
  startTime: string;
  endTime: string | null;
  latencyMs: number | null;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  error: string | null;

  model: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  costUsd: number | null;

  traceName: string;
  traceStatus: "success" | "error" | "running";
  traceTags: string[];
  traceStartTime: string;
  traceTotalTokens: number;
  traceTotalCostUsd: number;
  traceLatencyMs: number | null;
  traceEnvironment: string | null;
  traceUserId: string | null;
  traceSessionId: string | null;
  traceAppVersion: string | null;
  traceFeedbackRating: "up" | "down" | null;
  traceFeedbackScore: number | null;
  traceFeedbackComment: string | null;

  parentName: string | null;
  parentType: string | null;
};

function buildDepthMap(spans: Array<{ id: string; parentId: string | null }>): Map<string, number> {
  const map = new Map<string, number>();
  const idToParent = new Map(spans.map((s) => [s.id, s.parentId]));

  function getDepth(id: string): number {
    if (map.has(id)) return map.get(id)!;
    const parentId = idToParent.get(id);
    if (!parentId || !idToParent.has(parentId)) {
      map.set(id, 0);
      return 0;
    }
    const depth = getDepth(parentId) + 1;
    map.set(id, depth);
    return depth;
  }

  for (const span of spans) getDepth(span.id);
  return map;
}

export function flattenTraces(): FlatSpan[] {
  const result: FlatSpan[] = [];

  for (const trace of tracesJson.traces) {
    const spans = trace.spans ?? [];
    const spanMap = new Map(spans.map((s) => [s.id, s]));
    const depthMap = buildDepthMap(spans);
    const feedback = (trace as Record<string, unknown>).feedback as
      | { rating?: string; score?: number; comment?: string | null }
      | undefined;
    const metadata = trace.metadata as Record<string, string> | undefined;

    for (const span of spans) {
      const parent = span.parentId ? spanMap.get(span.parentId) : null;

      result.push({
        id: span.id,
        traceId: trace.id,
        parentId: span.parentId,
        depth: depthMap.get(span.id) ?? 0,

        name: span.name,
        type: span.type,
        status: span.status as FlatSpan["status"],
        startTime: span.startTime,
        endTime: (span as Record<string, unknown>).endTime as string | null ?? null,
        latencyMs: (span as Record<string, unknown>).latencyMs as number | null ?? null,
        input: span.input as Record<string, unknown> | null,
        output: span.output as Record<string, unknown> | null,
        error: (span as Record<string, unknown>).error as string | null ?? null,

        model: (span as Record<string, unknown>).model as string | null ?? null,
        promptTokens: (span as Record<string, unknown>).promptTokens as number | null ?? null,
        completionTokens: (span as Record<string, unknown>).completionTokens as number | null ?? null,
        totalTokens: (span as Record<string, unknown>).totalTokens as number | null ?? null,
        costUsd: (span as Record<string, unknown>).costUsd as number | null ?? null,

        traceName: trace.name,
        traceStatus: trace.status as FlatSpan["traceStatus"],
        traceTags: trace.tags,
        traceStartTime: trace.startTime,
        traceTotalTokens: trace.totalTokens,
        traceTotalCostUsd: trace.totalCostUsd,
        traceLatencyMs: (trace as Record<string, unknown>).latencyMs as number | null ?? null,
        traceEnvironment: metadata?.environment ?? null,
        traceUserId: metadata?.userId ?? null,
        traceSessionId: metadata?.sessionId ?? null,
        traceAppVersion: metadata?.appVersion ?? null,
        traceFeedbackRating: (feedback?.rating as FlatSpan["traceFeedbackRating"]) ?? null,
        traceFeedbackScore: feedback?.score ?? null,
        traceFeedbackComment: feedback?.comment ?? null,

        parentName: parent?.name ?? null,
        parentType: parent?.type ?? null,
      });
    }
  }

  return result;
}

// Pre-computed for direct import
export const flatSpans: FlatSpan[] = flattenTraces();
