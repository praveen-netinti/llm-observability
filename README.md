# NeoSigma — LLM Observability

A tracing & observability dashboard for LLM applications. It ingests a tree of
traces and spans (chains, tools, retrievers, LLM calls) and surfaces them
through a dashboard of aggregate metrics, a searchable trace list with a
waterfall/timeline detail view, and a Linear‑style issues workflow.

The dataset is a static mock (`src/data/traces.json`, ~50 traces) so the whole
thing runs with no backend or environment setup.

## Running it

Requires Node 18+ (developed on Node 24). [Bun](https://bun.sh) is the primary
package manager — `bun.lock` is committed — but npm/pnpm/yarn work too.

```bash
bun install        # or: npm install
bun dev            # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
bun run build      # production build
bun start          # serve the production build
bun run lint       # eslint
```

## Design thinking

I went for the feel of [Linear](https://linear.app): quiet, dense, and
fast — a tool you stare at all day that gets out of your way. Two posts shaped
the direction directly, [A design reset (part I)](https://linear.app/now/a-design-reset)
and [How we redesigned the Linear UI (part II)](https://linear.app/now/how-we-redesigned-the-linear-ui).
The takeaways I actually built around:

- **The inverted "L" chrome.** A persistent left sidebar plus a thin top header
  frame every view; the content area is the only thing that changes. Headers are
  a fixed `h-11`, the sidebar collapses to an icon rail, and navigation density
  is high but aligned. The chrome stays still so the data can move.
- **Reduce visual noise, increase hierarchy.** Borders are hairline, surfaces
  are mostly flat, and emphasis comes from type weight, spacing, and a single
  accent — not from boxes and drop shadows. The goal Linear describes as a
  "neutral and timeless" surface where chrome color is deliberately restrained.
- **Timeless over trendy.** A neutral gray base palette with one functional
  accent, and color reserved almost entirely for *status* (success / error /
  running) rather than decoration. Status is the most important signal in an
  observability tool, so it gets the color budget.
- **Density with rhythm.** Tabular numerals for every metric, a mono face for
  IDs/tokens/code, and tight but consistent vertical spacing so dense tables
  stay scannable.

**Type & identity.** Open Runde (a rounded geometric sans) for UI text and
JetBrains Mono for IDs, token counts, and payloads. The rounded sans keeps the
density from feeling cold while staying close to Linear's Inter‑Display
character. The **splash screen, logo, and favicon were designed in Figma**, and
I wireframed the core flows (dashboard → trace list → trace detail, and the
issues list/board) there before building. There's also a small console
easter‑egg banner.

**The build.** Rather than a component kit with its own opinions, I assembled
**Radix UI primitives** (dialog, popover, dropdown, tabs, select, tooltip,
scroll‑area, etc.) and styled each one from scratch to match the Linear
language, so behavior/accessibility is solid but the look is fully custom.
Theming runs on CSS variables (semantic tokens like `bg-weak-50`,
`text-strong-950`, `stroke-soft-200`) with full **light and dark** modes via
`next-themes`. Charts are Recharts with custom tooltips; the trace waterfall is
hand‑built.
