# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Client** (from `client/`):
```bash
npm run dev      # dev server on :5173, proxies /api → :5000
npm run build    # tsc + vite build
npm run lint     # eslint
```

**Server** (from `server/`):
```bash
dotnet run --project src/Sudoku.Api      # API on :5000
dotnet build src/Sudoku.Api/Sudoku.Api.csproj -c Release
```

**Infrastructure**:
```bash
docker compose up postgres        # Postgres only (port 5432)
docker compose up --build         # full stack: Postgres + API (:5000) + client (:3000)
```

## Architecture

**Full stack**: React 18 + TypeScript (Vite) client · ASP.NET Core 10 API · PostgreSQL

**Client** (`client/src/`):
- All game state lives in `App.tsx` via `useState`/`useEffect` and is persisted to `localStorage` (`sudoku.save.v1`, `sudoku.settings.v1`).
- Puzzle generation and validation run **entirely client-side** — no API call. The entry point is `lib/sudoku.ts`, which wraps the vendored `lib/sudoku-core.js` (from the `sudoku.js-master/` repo at root).
- Theming uses CSS custom properties (`--bg`, `--ink`, `--accent`, etc.) set on `document.documentElement` from the `THEMES` map in `App.tsx`.
- The app is a PWA (vite-plugin-pwa). Service worker caches all static assets; `/api/*` uses NetworkFirst with a 10s timeout.
- Two screens: `home` and `game`. Navigation is a `screen` state string, not a router.

**Core types** (`client/src/types.ts`): `Game` (puzzle state, notes, timer, won flag) and `Settings` (theme, accent color, peer highlighting, selection style, number font).

**Server** (`server/src/Sudoku.Api/`):
- Minimal scaffold: one `HealthController`, an empty `AppDbContext` (no entities yet), CORS configured for `AllowedOrigins` from config (defaults to `http://localhost:3000`).
- Connection string: `ConnectionStrings__DefaultConnection` (env var or `appsettings.json`).

**Design reference**: `design_handoff_sudoku/` contains the original HTML/JSX mockup used as the design source. `sudoku.js-master/` is the upstream sudoku.js library (vendored, do not modify).

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
