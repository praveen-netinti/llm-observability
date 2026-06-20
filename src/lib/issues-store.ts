export type IssueStatus = "backlog" | "todo" | "in-progress" | "done" | "cancelled";
export type IssuePriority = "no-priority" | "urgent" | "high" | "medium" | "low";
export type IssueLabel = "bug" | "feature" | "improvement";

export type Issue = {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string | null;
  labels: IssueLabel[];
  project: string | null;
  traceId: string | null;
  createdAt: string;
};

const STORAGE_KEY = "neosigma-issues";

let counter = 4;

const SEED_ISSUES: Issue[] = [
  {
    id: "PRA-1",
    title: "ToolException: connection refused in customer_support_agent",
    description: "The agent calls the `lookup_order` tool, which reaches the orders service over HTTP. The service refused the connection and the agent has no retry or fallback, so the run aborts.",
    status: "todo",
    priority: "high",
    assignee: "Praveen N",
    labels: ["bug"],
    project: "Sathvar",
    traceId: "trace_g0116",
    createdAt: "2026-06-13T22:43:26.500Z",
  },
  {
    id: "PRA-2",
    title: "RAG doc QA generation failed after retrieval succeeded",
    description: "Retrieval succeeded, but the final ChatOpenAI generation failed with `ToolException: connection refused`. The run produced no answer.",
    status: "in-progress",
    priority: "medium",
    assignee: "Ritvik S",
    labels: ["bug"],
    project: "Avirbhav",
    traceId: "trace_g0220",
    createdAt: "2026-06-13T20:20:40.000Z",
  },
  {
    id: "PRA-3",
    title: "Negative feedback: hallucinated detail in customer_support_agent",
    description: "Reviewer flagged the response as inaccurate. Worth checking grounding before this reaches customers.",
    status: "backlog",
    priority: "low",
    assignee: null,
    labels: ["improvement"],
    project: null,
    traceId: "trace_g0125",
    createdAt: "2026-06-13T22:30:00.000Z",
  },
];

function loadIssues(): Issue[] {
  if (typeof window === "undefined") return SEED_ISSUES;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ISSUES));
    return SEED_ISSUES;
  }
  return JSON.parse(raw) as Issue[];
}

function saveIssues(issues: Issue[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

function getNextId(issues: Issue[]): string {
  const maxNum = issues.reduce((max, iss) => {
    const num = parseInt(iss.id.replace("PRA-", ""), 10);
    return num > max ? num : max;
  }, 0);
  counter = maxNum + 1;
  return `PRA-${counter}`;
}

export { loadIssues, saveIssues, getNextId, SEED_ISSUES };

export const STATUS_OPTIONS: { value: IssueStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

export const PRIORITY_OPTIONS: { value: IssuePriority; label: string }[] = [
  { value: "no-priority", label: "No priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const LABEL_OPTIONS: { value: IssueLabel; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
];

export const ASSIGNEE_OPTIONS = [
  "Praveen N",
  "Ritvik S",
  "Alice Chen",
  "Bob Smith",
];

export const PROJECT_OPTIONS = [
  { team: "Praveen Netinti", projects: ["Sathvar", "Avirbhav"] },
];
