# Sharing Feature — Implementation Plan

## Context

Add a game-state sharing feature to the Sudoku app. A user can share their in-progress game as a URL. The recipient opens the URL, sees a confirmation modal with a text preview, and continues the game from the exact same state as an independent fork.

## Decisions (do not revisit)

- Share = full snapshot: puzzle givens, user-filled values, notes, timer, difficulty. Won flag is excluded.
- Won games cannot be shared — share button is disabled.
- Links are multi-use: each person who opens the link gets their own independent copy.
- No expiry, no deletion, no auth.
- Always show a confirmation modal when opening a share URL — even if the recipient has no active game.
- Text-only preview in the modal: e.g. `"Hard · 12:34 elapsed · 23 cells filled"`.
- After loading: navigate to `/`, replace history entry so back button doesn't re-trigger the share flow.
- Invalid/missing share ID shows a "game does not exist" modal (no redirect, just a dead-end screen).
- Short random base62 ID (8 chars, alphabet `a-zA-Z0-9`) as primary key — no sequential counters.

---

## 1. Database Migration

Create an EF Core migration that adds the `shares` table.

Schema:

```
id          VARCHAR(10)   PRIMARY KEY
game_state  JSONB         NOT NULL
created_at  TIMESTAMPTZ   NOT NULL  DEFAULT NOW()
```

Files to create/modify:
- `server/src/Sudoku.Api/Models/Share.cs` — entity class
- `server/src/Sudoku.Api/Data/AppDbContext.cs` — add `DbSet<Share> Shares`
- Run `dotnet ef migrations add AddShares` to generate the migration file

```csharp
// Share.cs
public class Share
{
    public string Id { get; set; } = default!;
    public JsonDocument GameState { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
```

In `AppDbContext.OnModelCreating`, map `GameState` to `jsonb` column type and set `CreatedAt` default to `now()`.

---

## 2. ID Generator

File: `server/src/Sudoku.Api/Helpers/IdGenerator.cs`

- Use `RandomNumberGenerator.GetBytes(n)` to generate cryptographically random bytes.
- Encode as base62 using alphabet `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.
- Target length: 8 characters (62^8 ≈ 218 trillion combinations).
- Expose a single static method: `string Generate()`.

---

## 3. Shares API

File: `server/src/Sudoku.Api/Controllers/SharesController.cs`

### POST /api/shares

Request body:
```json
{ "gameState": { ...see §4 for format... } }
```

Steps:
1. Validate that `gameState` is present and contains a `v` field (basic schema guard).
2. Generate an ID via `IdGenerator.Generate()`.
3. Insert a new `Share` row.
4. Return `201 Created` with body `{ "id": "aB3kR9xZ" }`.

### GET /api/shares/{id}

Steps:
1. Look up the share by `id`.
2. If not found, return `404 Not Found` (empty body).
3. Return `200 OK` with body `{ "gameState": { ... } }`.

No authentication, no rate limiting needed for now.

---

## 4. Game State JSON Format

This is a new format, distinct from `sudoku.save.v1`. Create `client/src/lib/shareFormat.ts`.

### Shape

```typescript
interface ShareGameState {
  v: 1;
  difficulty: "easy" | "medium" | "hard" | "expert";
  givens: string;   // 81 chars: digit or '.' for non-given cells
  values: string;   // 81 chars: digit or '.' for empty cells
  notes: number[][]; // 81 entries, each an array of candidate digits (1–9) marked by user
  timer: number;    // elapsed seconds, integer
}
```

### Example

```json
{
  "v": 1,
  "difficulty": "hard",
  "givens": "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79",
  "values": "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
  "notes": [[], [1, 3], [], [], [], [], [], [], [], ...],
  "timer": 734
}
```

### Functions to implement

```typescript
// Serialize current Game state into ShareGameState (excludes won flag)
export function serializeGame(game: Game): ShareGameState

// Deserialize a ShareGameState back into the fields needed to reconstruct Game
export function deserializeGame(raw: ShareGameState): Pick<Game, 'puzzle' | 'values' | 'notes' | 'timer' | 'difficulty'>

// Compute preview text for the confirmation modal
export function previewText(raw: ShareGameState): string
// e.g. "Hard · 12:34 elapsed · 23 cells filled"
// "cells filled" = count of non-'.' entries in values that are not givens
```

---

## 5. Routing

Install `react-router-dom` in `client/`.

Wrap the app root with `<BrowserRouter>`. Define two routes:

```
/             → existing app (home + game screens, current screen state logic unchanged)
/share/:id    → share loader (triggers fetch + modal on mount)
```

Keep the existing `screen` state string (`"home"` / `"game"`) for internal navigation — the router only handles the share entry point.

Vite dev server already serves `index.html` for unknown paths via the proxy config. For the Docker/production build, ensure the static file server is configured to fall back to `index.html` for all non-`/api` routes (check `docker-compose.yml` and Nginx config if present).

---

## 6. Share Button

Location: the in-game toolbar in `App.tsx` (or whichever component renders the game screen).

Behavior:
- Render a "Share" button.
- Disabled (and visually muted) when `game.won === true`.
- On click:
  1. Call `serializeGame(game)` to build the payload.
  2. `POST /api/shares` with `{ gameState: payload }`.
  3. On success: open `ShareCreatedModal` showing the full URL and a copy-to-clipboard button.
  4. On network/server error: show an inline error message or toast.

### ShareCreatedModal

File: `client/src/components/ShareCreatedModal.tsx`

- Displays: `window.location.origin + '/share/' + id`
- "Copy link" button that writes the URL to clipboard.
- Close/dismiss button.
- No navigation side-effects.

---

## 7. Share URL Handler

The component rendered at `/share/:id` (can be a small component in `App.tsx` or a dedicated file).

On mount:
1. Extract `id` from URL params.
2. `GET /api/shares/{id}`.
3. **On 404**: render `GameNotFoundModal` (see §8).
4. **On success**:
   - Compute preview text via `previewText(raw)`.
   - Render `LoadShareModal` with the preview text.
   - **On confirm**:
     1. Call `deserializeGame(raw)` to reconstruct game fields.
     2. Persist to `localStorage` (overwrite the existing `sudoku.save.v1` key).
     3. Update in-memory game state in `App`.
     4. Navigate to `/` with `replace: true` and set `screen` to `"game"`.
   - **On cancel**:
     - Navigate to `/` with `replace: true`.
     - If user had an active game before: restore to `"game"` screen.
     - If no active game: restore to `"home"` screen.

Show a loading state (spinner or skeleton) while the fetch is in flight.

### LoadShareModal

File: `client/src/components/LoadShareModal.tsx`

Content:
- Heading: "Continue this game?"
- Preview text (e.g. `"Hard · 12:34 elapsed · 23 cells filled"`)
- Two buttons: "Continue" (primary) / "Cancel" (secondary)
- If recipient has an active game: add a small warning line — "This will replace your current game."
- If no active game: no warning line needed.

---

## 8. Invalid Share Modal

File: `client/src/components/GameNotFoundModal.tsx`

Content:
- Message: "This game link is invalid or does not exist."
- Single button: "Go home" → navigate to `/` with `replace: true`.

---

## Implementation Order

Follow this order to respect dependencies:

1. **DB migration** (§1) — required before any API work
2. **ID generator** (§2) — required for the controller
3. **Shares controller** (§3) — once done, all client work can proceed independently
4. **`shareFormat.ts`** (§4) — pure utility, no dependencies
5. **Routing** (§5) — required before share URL handler
6. **Share button + `ShareCreatedModal`** (§6)
7. **Share URL handler + `LoadShareModal`** (§7)
8. **`GameNotFoundModal`** (§8) — can be done alongside §7

---

## Files Summary

| File | Action |
|------|--------|
| `server/src/Sudoku.Api/Models/Share.cs` | Create |
| `server/src/Sudoku.Api/Data/AppDbContext.cs` | Modify — add `DbSet<Share>` |
| `server/src/Sudoku.Api/Helpers/IdGenerator.cs` | Create |
| `server/src/Sudoku.Api/Controllers/SharesController.cs` | Create |
| `server/src/Sudoku.Api/Migrations/*_AddShares.cs` | Generate via `dotnet ef` |
| `client/package.json` | Modify — add `react-router-dom` |
| `client/src/lib/shareFormat.ts` | Create |
| `client/src/components/ShareCreatedModal.tsx` | Create |
| `client/src/components/LoadShareModal.tsx` | Create |
| `client/src/components/GameNotFoundModal.tsx` | Create |
| `client/src/App.tsx` | Modify — routing wrapper, share button, share URL handler |
