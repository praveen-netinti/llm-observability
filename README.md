# NeoSigma — LLM Observability

<p align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="public/splash-screen-light-with-bg.png"
    />
    <source
      media="(prefers-color-scheme: light)"
      srcset="public/splash-screen-dark-with-bg.png"
    />
    <img
      src="public/splash-screen-dark-with-bg.png"
      alt="NeoSigma splash screen"
      width="100%"
    />
  </picture>
</p>

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

| Task        | Command         |
| ----------- | --------------- |
| Dev server  | `bun dev`       |
| Prod build  | `bun run build` |
| Serve build | `bun start`     |
| Lint        | `bun run lint`  |

---

## What you can try

Everything below is wired up against the mock data. Start at the **Dashboard**,
then open **Traces** → click any row to see the waterfall.

| Page             | Route          | What to test                                                                                                                                                           |
| ---------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**    | `/`            | Metric tiles (traces, cost, tokens, error rate, p50/p95, satisfaction); latency histogram, cost‑by‑model, error‑rate & token trends, sparklines, environment breakdown |
| **Traces**       | `/traces`      | Search, sort, and status‑filter the trace list; resizable split view                                                                                                   |
| **Trace detail** | `/traces/[id]` | Hand‑built **waterfall** with overlapping/parallel bars and live "running" spans; click a span to inspect input/output, tokens & cost; prev/next trace nav             |
| **Issues**       | `/issues`      | Toggle **list ↔ board (kanban)**; drag cards between columns; group & change display options; multi‑select rows (`⌘/Ctrl + A`); open an issue for detail               |
| **Alerts**       | `/alerts`      | Slack‑style incident cards (alert → investigating → triage → resolved)                                                                                                 |
| **Settings**     | modal          | Open from the profile / help menu; **Appearance → toggle light / dark**; browse the settings pages                                                                     |

---

## Keyboard shortcuts

The app is fully keyboard‑accessible, modeled on [Linear](https://linear.app)'s
shortcut design. All shortcuts are powered by
[TanStack Hotkeys](https://tanstack.com/hotkeys) (`@tanstack/react-hotkeys`) and
registered from a single source of truth (`src/config/shortcuts.ts`).

Press **⌘/** (or **Ctrl+/**) to open the **Keyboard Shortcuts drawer** at any time.

### General

| Action                 | Shortcut     |
| ---------------------- | ------------ |
| Open command menu      | `⌘ K`        |
| Open search            | `/`          |
| View keyboard shortcuts| `⌘ /`        |
| Open settings          | `G then S`   |
| Toggle dark mode       | `⌘ ⇧ L`     |

### Navigation

| Action              | Shortcut     |
| ------------------- | ------------ |
| Go to Dashboard     | `G then D`   |
| Go to Traces        | `G then T`   |
| Go to Issues        | `G then I`   |
| Go to Alerts        | `G then A`   |
| Toggle left sidebar | `[`          |

### List & Board

| Action              | Shortcut     |
| ------------------- | ------------ |
| Move down           | `J` or `↓`  |
| Move up             | `K` or `↑`  |
| Select item         | `X`          |
| Select all          | `⌘ A`       |
| Clear selection     | `Escape`     |
| Open focused item   | `Enter`      |
| Toggle list/board   | `⌘ B`       |

### Trace Detail

| Action              | Shortcut     |
| ------------------- | ------------ |
| Close panel         | `Escape`     |
| Previous trace      | `K`          |
| Next trace          | `J`          |
| Copy trace ID       | `⌘ .`       |

### Issue Detail

| Action              | Shortcut     |
| ------------------- | ------------ |
| Previous issue      | `K`          |
| Next issue          | `J`          |
| Copy issue ID       | `⌘ .`       |
| Copy issue URL      | `⌘ ⇧ /`     |

---

## Global interactions

- **Command Menu** (`⌘/Ctrl + K` or `/`) — fuzzy jump between all pages
- **Dark mode** — toggle from Profile Dropdown or `⌘⇧L`
- **Settings Modal** — Profile Dropdown → Settings, or `G then S`
- **Collapsible sidebar** — click the logo/rail or press `[`
- **Splash screen** — animated intro on first visit (Framer Motion)
- **Console easter‑egg** — open DevTools to see a styled ASCII banner
- **Responsive** — mobile sidebar with hamburger toggle
- **Tooltips with shortcut hints** — hover buttons in trace/issue detail to see bound keys

### Issues (`/issues`)

- **3 views** — All issues, Active issues, Backlog issues
- **Display options** — switch list ↔ board (`⌘B`), grouping, column visibility
- **List view** — hover reveals checkbox; `Shift+click` range select; `J/K` or arrow keys to navigate; `X` to toggle; inline priority/status/assignee dropdowns
- **Board view (Kanban)** — full drag‑and‑drop between columns
- **Issue detail** — prev/next nav (`J/K`), copy ID (`⌘.`), copy URL (`⌘⇧/`), Properties/Labels/Details accordions

### Traces (`/traces`)

- Search by name + multi‑field filter (status, environment, tags)
- `J/K` or arrow keys to navigate rows; `X` to select; `⌘A` select all
- Column sorting; grouping by status or environment
- Click **Open** on an error trace → Slack notification card
- **Detail panel** — close (`Escape`), prev/next (`K/J`), copy trace ID (`⌘.`); toggle Tree ↔ Waterfall view

### Alerts (`/alerts`)

- Slack‑style incident cards with lifecycle: alert → investigating → triage → resolved

---

## Splash screen & console banner

**Splash screen** — on first visit the app plays a short animated intro
(logo + product name) before revealing the dashboard. Built with Framer Motion;
can be re‑enabled in `src/app/layout.tsx` by uncommenting `<SplashScreen>`.

**Console banner** — open your browser's DevTools console to see a styled ASCII
art banner with project info. Implemented in `src/components/console-banner.tsx`.

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
  accent. Color is reserved almost entirely for _status_ (success / error /
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

| Layer        | Choice                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router) · React 19 · TypeScript                                                                 |
| Styling      | Tailwind v4 with semantic CSS‑variable tokens (`bg-weak-50`, `text-strong-950`, `stroke-soft-200`)              |
| Theming      | Light **and** dark via `next-themes`                                                                            |
| Primitives   | **Radix UI** (dialog, popover, dropdown, tabs, select, tooltip, scroll‑area…)                                   |
| Charts       | Recharts with custom tooltips; the trace waterfall is hand‑built                                                |
| Interactions | `@dnd-kit` (kanban), `cmdk` (command palette), `motion` (splash/transitions), `@tanstack/react-hotkeys` (keys) |

---

> **Placeholder nav:** Playground, Models, Prompts, Evaluations, Cost & Usage,
> API Keys, and Guardrails appear in the sidebar to convey the product shape but
> aren't implemented yet.
