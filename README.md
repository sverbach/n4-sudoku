# n4-sudoku
simple offline sudoku

## Running locally (dev)

Prerequisites: [Node.js 22+](https://nodejs.org), [.NET 10 SDK](https://dotnet.microsoft.com/download), [Docker](https://www.docker.com)

Start Postgres:
```bash
docker compose up postgres
```

Start the API (port 5000):
```bash
cd server
dotnet run --project src/Sudoku.Api
```

Start the frontend (port 5173, hot reload, proxies `/api` to port 5000):
```bash
cd client
npm install
npm run dev
```

## Running with Docker

Builds and starts everything (Postgres + API on :5000 + client on :3000):
```bash
docker compose up --build
```

Then open http://localhost:3000.
