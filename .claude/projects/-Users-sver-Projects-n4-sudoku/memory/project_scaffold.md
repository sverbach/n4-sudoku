---
name: project-scaffold
description: Initial scaffold details for the n4-sudoku offline PWA project
metadata:
  type: project
---

Full-stack offline Sudoku PWA scaffolded 2026-06-04.

**Why:** User wants offline-first play (PWA) with future game sync across devices.

**Stack:**
- `client/` — React + TypeScript, Vite, vite-plugin-pwa (Workbox generateSW), Tailwind CSS v3
- `server/` — ASP.NET Core 9 Web API, EF Core 9, Npgsql (PostgreSQL)
- `docker-compose.yml` — postgres:17-alpine, server :5000→8080, client :3000→80 (nginx)
- `.github/workflows/ci.yml` — build-client, build-server, docker-build jobs

**Local dev:**
- Client dev server: `cd client && npm run dev` (port 5173, proxies /api → localhost:5000)
- Server: `cd server && dotnet run --project src/Sudoku.Api`
- Full stack: `docker compose up --build`
- Postgres only: `docker compose up postgres`

**How to apply:** When adding features, client code goes in `client/src/`, API controllers in `server/src/Sudoku.Api/Controllers/`, EF entities/migrations in `server/src/Sudoku.Api/Data/`.
