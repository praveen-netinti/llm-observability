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

> A tracing & observability dashboard for LLM apps — traces, spans, issues,
> alerts, and analytics — built to feel like [Linear](https://linear.app).
> Static mock data, **zero backend, zero setup**.

## Table of contents

- [Quick start](#quick-start)
- [Testing guide](#testing-guide)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Editor (slash commands & markdown)](#editor-slash-commands--markdown)
- [Design thinking](#design-thinking)
- [Stack](#stack)

---

## Quick start

```bash
bun install        # or: npm install
bun dev            # → http://localhost:3000
```

Requires Node 18+. Bun is the primary package manager (`bun.lock` committed).

| Task        | Command         |
| ----------- | --------------- |
| Dev server  | `bun dev`       |
| Prod build  | `bun run build` |
| Serve build | `bun start`     |
| Lint        | `bun run lint`  |

---

## Testing guide

A suggested path through the app — start broad, then drill into interactions.

### 1. Global chrome & navigation

- **Splash screen** — animated intro on first load (Framer Motion)
- **Console banner** — open DevTools console for a styled ASCII banner
- Press `⌘K` (or `/`) to open the **Command Menu** — fuzzy‑search across pages
- Press `[` to collapse the sidebar to an icon rail; click again to expand
- Navigate between pages: `G then D` (Dashboard), `G then T` (Traces), `G then I` (Issues), `G then A` (Alerts)
- Open **Settings** via Profile Dropdown or `G then S`
- Toggle **dark mode** from the Profile Dropdown or `⌘⇧L`
- Press `⌘/` to open the **Keyboard Shortcuts drawer** (lists everything below)

### 2. Dashboard (`/`)

- Metric tiles: traces, cost, tokens, error rate, p50/p95 latency, satisfaction
- Charts: latency histogram, cost‑by‑model, error‑rate & token trends, sparklines
- Environment breakdown

### 3. Traces (`/traces`)

- **Search** by name; **filter** by status, environment, tags
- **Keyboard nav**: `J/K` or `↓/↑` to move focus, `X` to select, `⌘A` select all, `Escape` clear
- Click column headers to **sort**; use Display Options to **group** by status/environment
- Hover a row → **"Open"** button appears; click it on an error trace to trigger a **Slack notification card**
- **Detail panel** (resizable split): close with `Escape`, prev/next with `K/J`, copy trace ID with `⌘.`
- Toggle between **Tree** and **Waterfall** views inside the detail panel
- Tooltips on all header buttons show shortcut hints

### 4. Issues (`/issues`)

- **3 sub‑views**: All Issues, Active, Backlog (tab buttons)
- **Display Options**: switch between **List** and **Board** (`⌘B`), change grouping, toggle columns
- **List view**: hover reveals checkbox; `Shift+click` for range select; inline dropdowns for priority/status/assignee
- **Board view (Kanban)**: drag‑and‑drop cards between columns; inline status/priority/assignee dropdowns on each card
- **Issue detail** (`/issues/[id]`): scrollable description with rendered markdown, metadata strip, accordions (Properties/Labels/Details), prev/next nav (`J/K`), copy ID (`⌘.`), copy URL (`⌘⇧/`)

### 5. Alerts (`/alerts`)

- Slack‑style incident cards with full lifecycle: alert → investigating → triage → resolved

### 6. Settings (modal)

- Open via Profile Dropdown → Settings or `G then S`
- **Appearance** page: light/dark theme toggle
- Browse: Organization, Members, Billing, Profile, Preferences, API Keys, etc.

---

## Keyboard shortcuts

Powered by [TanStack Hotkeys](https://tanstack.com/hotkeys) (`@tanstack/react-hotkeys`).
All bindings live in `src/config/shortcuts.ts` (single source of truth).

Press **⌘/** to open the shortcuts drawer at any time.

|                  | Action                  | Shortcut           |
| ---------------- | ----------------------- | ------------------ |
| **General**      | Open command menu       | `⌘ K`              |
|                  | Open search             | `/`                |
|                  | View keyboard shortcuts | `⌘ /`              |
|                  | Open settings           | `G then S`         |
|                  | Toggle dark mode        | `⌘ ⇧ L`            |
| **Navigation**   | Go to Dashboard         | `G then D`         |
|                  | Go to Traces            | `G then T`         |
|                  | Go to Issues            | `G then I`         |
|                  | Go to Alerts            | `G then A`         |
|                  | Toggle left sidebar     | `[`                |
| **List & Board** | Move down / up          | `J` `K` or `↓` `↑` |
|                  | Select item             | `X`                |
|                  | Select all              | `⌘ A`              |
|                  | Clear selection         | `Escape`           |
|                  | Open focused item       | `Enter`            |
|                  | Toggle list/board       | `⌘ B`              |
| **Trace Detail** | Close panel             | `Escape`           |
|                  | Previous / Next trace   | `K` / `J`          |
|                  | Copy trace ID           | `⌘ .`              |
| **Issue Detail** | Previous / Next issue   | `K` / `J`          |
|                  | Copy issue ID           | `⌘ .`              |
|                  | Copy issue URL          | `⌘ ⇧ /`            |

---

## Editor (slash commands & markdown)

The rich text editor (issue descriptions) supports a **slash command menu** —
type `/` to trigger. Each command shows its markdown shortcut inline.

### Slash Commands

| Command       | Markdown shortcut |
| ------------- | ----------------- |
| Text          | —                 |
| To‑do List    | `[] Space`        |
| Heading 1     | `# Space`         |
| Heading 2     | `## Space`        |
| Heading 3     | `### Space`       |
| Bullet List   | `- Space`         |
| Numbered List | `1. Space`        |
| Quote         | `> Space`         |
| Code          | ` ``` Enter `     |
| Table         | `/table`          |

### Markdown Formatting

| Syntax       | Result             |
| ------------ | ------------------ |
| `**Text**`   | Bold               |
| `_Text_`     | Italic             |
| `~Text~`     | Strikethrough      |
| `` `Code` `` | Inline code        |
| `# Space`    | Heading 1          |
| `## Space`   | Heading 2          |
| `### Space`  | Heading 3          |
| `- Space`    | Bulleted list      |
| `1. Space`   | Numbered list      |
| `[] Space`   | Checklist          |
| `> Space`    | Blockquote         |
| ` ``` `      | Code block         |
| `*** Space`  | Horizontal divider |

---

## Design thinking

Inspired by [Linear](https://linear.app) — quiet, dense, and fast. Shaped
directly by two posts:
[A design reset (part I)](https://linear.app/blog/a-design-reset) and
[How we redesigned the Linear UI (part II)](https://linear.app/blog/how-we-redesigned-the-linear-ui).
Key principles applied:

- **Inverted "L" chrome** — persistent sidebar + thin top header; only the content area changes
- **Noise reduction** — hairline borders, flat surfaces, emphasis via type weight and spacing — not shadows
- **Color budget on status** — green/red/amber reserved for success/error/running; chrome is neutral gray
- **Density with rhythm** — tabular numerals, mono face for IDs/code, tight consistent spacing

**Typography:** Open Runde (rounded geometric sans) for UI, JetBrains Mono for
data. Splash screen, logo, and favicon designed in Figma.

---

## Stack

| Layer        | Choice                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router) · React 19 · TypeScript                                                                |
| Styling      | Tailwind v4 · semantic CSS‑variable tokens · light + dark via `next-themes`                                    |
| Primitives   | Radix UI (dialog, popover, dropdown, tabs, select, tooltip, scroll‑area…)                                      |
| Charts       | Recharts + hand‑built waterfall                                                                                |
| Interactions | `@dnd-kit` (kanban) · `cmdk` (command palette) · `motion` (animations) · `@tanstack/react-hotkeys` (shortcuts) |
| Editor       | Tiptap with slash commands, code highlighting (lowlight), tables                                               |

---

> **Placeholder nav:** Playground, Models, Prompts, Evaluations, Cost & Usage,
> API Keys, and Guardrails appear in the sidebar to convey the product shape but
> aren't implemented yet.
