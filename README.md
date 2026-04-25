# Ankewelt

> A distraction-free writing studio for novels and long-form fiction — built with Tauri, React, and SQLite.

Ankewelt is a local-first desktop writing application that helps you plan, write, and organize novels. Manage multiple books, reorder chapters with drag-and-drop, track writing stats, and build out characters, locations, and plot outlines — all stored locally on your machine.

## Features

- **Rich text editor** — TipTap-powered editor with highlights, comment threads, slash commands, @mentions, and bubble formatting toolbar
- **Book & chapter management** — Create multiple books, organize chapters into groups, and reorder via drag-and-drop
- **Version history** — Every chapter save creates a snapshot, so you never lose work
- **World-building tools** — Character cards, location profiles, and plot outline tracking per book
- **Writing dashboard** — Daily word targets, streak tracking, activity heatmaps, and recent updates at a glance
- **9 built-in themes** — System, light, dark, midnight, forest, coffee, terminal, and astro variants
- **Local-first & offline** — Everything lives in a local SQLite database with zero cloud dependency

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)
- [Rust toolchain](https://www.rust-lang.org/tools/install) (for Tauri compilation)
- [Tauri system dependencies](https://v2.tauri.app/start/prerequisites/) (varies by platform)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the desktop app in development mode
pnpm tauri dev

# Or run just the frontend dev server (port 1420)
pnpm dev
```

> [!NOTE]
> `pnpm tauri dev` automatically starts the Vite dev server before launching the Tauri window. You don't need to run `pnpm dev` separately.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server (frontend only) |
| `pnpm build` | Type-check and build the frontend |
| `pnpm tauri` | Run Tauri CLI commands |
| `pnpm tauri dev` | Launch the full desktop app in dev mode |
| `pnpm tauri build` | Build the production desktop installer |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Format code with Biome |
| `pnpm db:generate` | Generate SQL migrations from Drizzle schema |
| `pnpm db:seed` | Seed the database with sample data |

## Tech Stack

| Layer | Technology |
|---|---|
| **Desktop framework** | [Tauri v2](https://v2.tauri.app/) (Rust) |
| **Frontend** | React 19, TypeScript, Vite 7 |
| **Routing** | [TanStack Router](https://tanstack.com/router) (file-based) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Editor** | [TipTap](https://tiptap.dev/) (ProseMirror) |
| **Database** | SQLite via [Drizzle ORM](https://orm.drizzle.team/) + [sqlx](https://github.com/launchbadge/sqlx) |
| **Drag & drop** | [dnd-kit](https://dndkit.com/) |
| **Tooling** | [Biome](https://biomejs.dev/) (lint + format) |

## Architecture

Ankewelt uses a **Tauri proxy bridge** pattern: the React frontend sends SQL queries through Drizzle ORM's SQLite proxy driver, which invokes a custom Tauri command (`run_sql`) in Rust. The Rust backend executes the query via sqlx against a local SQLite database, bridging the frontend ORM to the native database layer.

```
React (Drizzle ORM) → invoke("run_sql") → Rust (sqlx) → SQLite
```
