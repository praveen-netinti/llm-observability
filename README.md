# NeoSigma — LLM Observability

> A tracing & observability dashboard for LLM apps. It ingests a tree of traces
> and spans (chains, tools, retrievers, LLM calls) and surfaces them through
> aggregate metrics, a searchable trace list with a waterfall detail view, and a
> Linear‑style issues workflow.

The dataset is a static mock (`src/data/traces.json`, ~50 traces), so the whole
thing runs with **no backend, no env vars, no setup**.

---

## Quick start

Requires Node 18+ (developed on Node 24). [Bun](https://bun.sh) is the primary
package manager — `bun.lock` is committed — but npm/pnpm/yarn work too.

```bash
bun install        # or: npm install
bun dev            # or: npm run dev   →  http://localhost:3000
```

| Task        | Command          |
| ----------- | ---------------- |
| Dev server  | `bun dev`        |
| Prod build  | `bun run build`  |
| Serve build | `bun start`      |
| Lint        | `bun run lint`   |

---

## What you can try

Everything below is wired up against the mock data. Start at the **Dashboard**,
then open **Traces** → click any row to see the waterfall.

| Page          | Route        | What to test                                                                                  |
| ------------- | ------------ | --------------------------------------------------------------------------------------------- |
| **Dashboard** | `/`          | Metric tiles (traces, cost, tokens, error rate, p50/p95, satisfaction); latency histogram, cost‑by‑model, error‑rate & token trends, sparklines, environment breakdown |
| **Traces**    | `/traces`    | Search, sort, and status‑filter the trace list; resizable split view                          |
| **Trace detail** | `/traces/[id]` | Hand‑built **waterfall** with overlapping/parallel bars and live "running" spans; click a span to inspect input/output, tokens & cost; prev/next trace nav |
| **Issues**    | `/issues`    | Toggle **list ↔ board (kanban)**; drag cards between columns; group & change display options; multi‑select rows (`⌘/Ctrl + A`); open an issue for detail |
| **Alerts**    | `/alerts`    | Slack‑style incident cards (alert → investigating → triage → resolved)                         |
| **Settings**  | modal        | Open from the profile / help menu; **Appearance → toggle light / dark**; browse the settings pages |

**Global interactions**

- `⌘ / Ctrl + K` — command palette to jump between pages
- Collapse the sidebar to an icon rail (click the logo / rail)
- First visit plays a splash screen; there's a console easter‑egg banner too
- Responsive down to a mobile sidebar

> **Placeholder nav:** Playground, Models, Prompts, Evaluations, Cost & Usage,
> API Keys, and Guardrails appear in the sidebar to convey the product shape but
> aren't implemented yet.

---

## Design thinking

I went for the feel of [Linear](https://linear.app): quiet, dense, and fast — a
tool you stare at all day that gets out of your way. Two posts shaped the
direction directly: [A design reset (part I)](https://linear.app/now/a-design-reset)
and [How we redesigned the Linear UI (part II)](https://linear.app/now/how-we-redesigned-the-linear-ui).
The takeaways I actually built around:

- **The inverted "L" chrome** — A persistent left sidebar plus a thin top header
  frame every view; the content area is the only thing that changes. Headers are
  a fixed `h-11`, the sidebar collapses to an icon rail, and nav density is high
  but aligned. The chrome stays still so the data can move.
- **Reduce noise, increase hierarchy** — Hairline borders, mostly flat surfaces,
  and emphasis from type weight, spacing, and a single accent — not from boxes
  and drop shadows. Linear calls this a "neutral and timeless" surface where
  chrome color is deliberately restrained.
- **Timeless over trendy** — A neutral gray base palette with one functional
  accent. Color is reserved almost entirely for *status* (success / error /
  running) rather than decoration — status is the most important signal in an
  observability tool, so it gets the color budget.
- **Density with rhythm** — Tabular numerals for every metric, a mono face for
  IDs/tokens/code, and tight but consistent vertical spacing so dense tables
  stay scannable.

**Type & identity.** Open Runde (a rounded geometric sans) for UI text and
JetBrains Mono for IDs, token counts, and payloads — the rounded sans keeps the
density from feeling cold while staying close to Linear's Inter‑Display
character. The **splash screen, logo, and favicon were designed in Figma**, and
I wireframed the core flows there (dashboard → trace list → trace detail, plus
the issues list/board) before building.

---

## Stack & build

| Layer       | Choice                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router) · React 19 · TypeScript                        |
| Styling     | Tailwind v4 with semantic CSS‑variable tokens (`bg-weak-50`, `text-strong-950`, `stroke-soft-200`) |
| Theming     | Light **and** dark via `next-themes`                                   |
| Primitives  | **Radix UI** (dialog, popover, dropdown, tabs, select, tooltip, scroll‑area…) |
| Charts      | Recharts with custom tooltips; the trace waterfall is hand‑built       |
| Interactions| `@dnd-kit` (kanban), `cmdk` (command palette), `motion` (splash/transitions) |

---
