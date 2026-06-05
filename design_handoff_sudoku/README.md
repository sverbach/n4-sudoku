# Handoff: n4-sudoku — offline Sudoku PWA

## Overview
A complete, offline-first Sudoku game: generate puzzles (easy → very hard), play with
notes, conflict highlighting, peer highlighting, a timer with pause, win detection, and
light/dark theming. No backend, no accounts — all state lives in `localStorage`.

This handoff targets an **existing Vite + React skeleton**. The goal is to port the
prototype into that project as real ES modules with a normal build, dropping the
in-browser Babel transpilation the prototype used.

## About the design files
The files in `source/` are a **working prototype written in HTML + in-browser-Babel JSX**.
They are a faithful reference for look, layout, and behavior — but they are NOT meant to
ship as-is. The `.jsx` files are loaded via `<script type="text/babel">` tags and attach
their components to `window`. Your job is to recreate them as proper React modules inside
the Vite project, using its existing conventions (import/export, file structure, etc.).

The good news: **the logic and components are already cleanly separated and have zero
dependencies**, so this is mostly a mechanical port — add `import`/`export`, move CSS into
the project, and wire up state.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are all final. Recreate
the UI pixel-for-pixel. All exact values are either in this README or directly in the
source files.

---

## File-by-file port guide

| Source file | What it is | How to port |
|---|---|---|
| `source/sudoku.js` | Pure game engine: generator, solver, uniqueness check, conflict/complete/counts helpers. **No DOM, no deps.** | Convert the IIFE that assigns `window.Sudoku` into named ES exports: `export function generate(difficulty)`, `export function conflicts(values)`, `export function isComplete(values)`, `export function counts(values)`. Keep `isValid` / `TARGET` exported too. Logic needs **no changes**. Suggested path: `src/lib/sudoku.js`. |
| `source/components.jsx` | Presentational components: `Home`, `GameHeader`, `ThemeToggle`, `Board`, `Numpad`, `Menu`, `WinOverlay`, plus `DIFFS`, `peersOf`, `fmt`. | Split into one component per file (or one `components/` barrel). Add `import React from 'react'` and `export` each. Delete the `Object.assign(window, …)` line at the bottom. Replace the global `DIFFS` const with an imported module (`src/lib/diffs.js`). |
| `source/app.jsx` | Root `App`: all state, persistence, theming, timer, keyboard, actions. | This is the heart. Port to `src/App.jsx`. See **State Management** and **Tweaks** sections below — the `useTweaks`/`<TweaksPanel>` bits are a **design-tool scaffold, not part of the app**; replace them (details below). |
| `source/Sudoku.html` | Shell: `<head>` (fonts, PWA meta, theme-color) + the entire `<style>` block + script load order. | Move the `<style>` block into the project (a global `index.css` or CSS module). Copy the `<head>` font `<link>`s and PWA `<meta>` tags into the Vite `index.html`. Ignore the `<script>` tags — Vite replaces them. |
| `source/manifest.json`, `source/sw.js`, `source/icons/*` | PWA manifest, service worker, app icons. | Use [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) instead of hand-rolling `sw.js` — it generates a service worker and injects the manifest. Feed it the values from `manifest.json` and reuse the icons. |

---

## Screens / Views

The app is a single mobile-width column (`max-width: 460px`, centered) with three screens
switched by a `screen` state string: `'home'` and `'game'` (plus a transient `generating`
overlay and a `win` overlay on top of the game).

### 1. Home (`Home` component)
- **Purpose:** pick difficulty / resume a game in progress.
- **Layout:** vertical flex, padded with safe-area insets. Top: logo + tagline. Optional
  resume bar. Then a **2×2 difficulty grid** that flex-grows to fill height.
- **Components:**
  - **Logo** — text `n4-/sud/oku` stacked on 3 lines (literal `<br/>`s). Font: Martian
    Mono 800, `clamp(40px,12.5vw,56px)`, line-height 0.9, letter-spacing −1.5px, color `--ink`.
  - **Tagline** — `OFFLINE · NO ACCOUNT`, 11px, letter-spacing 3px, color `--faint`.
  - **Theme toggle** — top-right, 44×44 hit area, an SVG half-filled circle (see `ThemeToggle`).
    Hover → `--accent`.
  - **Resume bar** (only when a game is in progress and unsolved) — full-width button,
    left side `▶ RESUME` (accent, 10px) over difficulty label (Martian 800, 19px), right
    side the timer. Hover bg → `--peer`.
  - **Difficulty grid** — 2×2 of `.diff-card`. Each: bottom-left aligned label
    (Martian 800, 20px) + sub (e.g. `42 GIVENS`, 10px `--faint`) + a top-right `→` arrow
    in `--accent`. Cards have 2px `--ink` borders forming a grid (border-top+left on the
    container, border-right+bottom on each cell). **Hover inverts:** bg → `--ink`,
    text → `--paper`. `min-height: 120px`.
  - The four difficulties come from `DIFFS`: `easy / medium / hard / very-hard` with
    given-counts `42 / 34 / 30 / 25`.

### 2. Game (`game-screen`)
- **Purpose:** play. Header + board + controls, vertically stacked.
- **GameHeader:** top bar with `← MENU` (back, 11px `--faint`, hover accent) and the theme
  toggle. Below it a stats row with a 2px `--ink` bottom border: left `DIFFICULTY` / label,
  right `TIME` / timer. Stat keys are 10px letter-spacing-3px `--faint`; values are Martian
  800, 24px. **The timer is a button** — tap to pause/resume; when paused it shows `▶ MM:SS`.
- **Board (`Board`):** responsive square,
  `width: min(100%, 420px, calc(100dvh - 300px))`. A 9×9 CSS grid, `aspect-ratio: 1/1`,
  3px `--box` outer border. Thin 1px `--line` cell borders, with **2px `--box` borders on
  the 3×3 box seams** (added via `.bx-r` / `.bx-b` classes on columns/rows 2 & 5). Cell
  states (all driven by classes — see **Board cell states** below).
  - **Digits:** JetBrains Mono. Givens are weight 700; player entries weight 400.
    `clamp(17px,5.4vw,25px)`.
  - **Notes:** when a cell has pencil-marks and no value, a 3×3 mini-grid of digits 1–9,
    `clamp(7px,2.3vw,11px)`, `--note` color (transparent when that digit isn't noted).
  - **Pause:** board blurs (`blur(6px)`, opacity .25) and a centered `PAUSED` veil shows.
- **Controls:**
  - **Numpad (`Numpad`):** a flex row of digits 1–9, big — `clamp(25px,8vw,34px)`, weight
    700. Active-press → `--accent` + 1px nudge. A digit dims to `--line` (`.done`) once all
    9 of it are placed (`counts[n] >= 9`). Font swappable (Martian / JetBrains, a tweak).
  - **Menu (`Menu`):** `NOTES <state>` toggle and `ERASE`. Active item has a 3px `--accent`
    bottom border; the `ON/OFF` state text picks up accent when active. 12px, letter-spacing 2px.

### 3. Win overlay (`WinOverlay`)
Absolute overlay over the game, `--bg` at 86% + 3px backdrop blur. Centered card: 3px
`--ink` border, `--paper` bg. `SOLVED` key (accent, 11px), big time (Martian 800, 54px,
tabular-nums), `LABEL · NO MISTAKES` sub. Two stacked buttons: solid (`NEW · LABEL`,
`--ink` bg / `--paper` text) and outline (`MENU`), each 48px tall.

### Transient: Generating overlay
Full-screen `--bg` cover with `GENERATING…` (the `…` dots blink via a `blink` keyframe in
accent). Shown for a beat while `generate()` runs (it's synchronous backtracking, wrapped in
a 30ms `setTimeout` so the overlay can paint first).

---

## Board cell states (exact class → style)
All set in the `<style>` block; reproduce faithfully. Classes are composed per-cell in
`Board`:
- `.peer` — a peer of the selected cell (same row/col/box). bg `--peer`. Only applied when
  the **Highlight peers** tweak is on.
- `.same` — same value as the selected cell (not the selection itself). bg `--peer` +
  inset 2.5px ring of `--accent` at 30%.
- `.conflict` — value duplicates a peer. bg `--conflictbg`; digit turns `--accent`.
- `.sel-invert` (default selection style) — bg `--selbg`, digit `--selink` weight 700.
- `.sel-ring` (alt selection style) — inset 3px `--accent` ring instead of inverting.
- `.given` — clue cell; digit weight 700 (not editable).

Selection style (`invert` vs `ring`) is a tweak — see below.

---

## Interactions & behavior
- **Select cell:** tap any cell → `selected` index (0–80).
- **Place / toggle digit:** tap a numpad digit or press `1`–`9`. If the same digit is
  already there, it toggles off. Can't edit `given` cells. In **notes mode**, the digit is
  added/removed from that cell's pencil-marks instead (and clears any value).
- **Erase:** `ERASE` button or `Backspace`/`Delete`/`0` clears the selected cell.
- **Notes mode:** `NOTES` toggle or press `N`.
- **Arrow keys:** move selection within the 9×9 grid (clamped).
- **Pause:** tap the timer; board blurs, timer stops.
- **Win:** when the grid is full with no conflicts (`isComplete`), `won` flips true and the
  overlay appears; the timer stops.
- **Hover states:** diff cards invert; resume bar bg → `--peer`; back/theme/timer → accent.
- **Transitions:** cell bg `.1s`, diff-card bg/color `.12s`, num color `.1s` + `transform
  .06s` on press. Generating dots blink at 1s steps.

---

## State Management
All in the root `App` component (`source/app.jsx`). Port these as React state:

- `screen` — `'home' | 'game'`.
- `game` — the active game object, or `null`. Shape from `makeGame(difficulty)`:
  ```
  {
    difficulty,            // 'easy' | 'medium' | 'hard' | 'very-hard'
    givenMask: boolean[81],// true where the cell is a fixed clue
    values:    number[81], // 0 = empty
    notes:     number[][], // 81 arrays of pencil-marked digits
    solution:  number[81], // the full solved grid (for reference)
    seconds:   number,     // elapsed time
    won:       boolean,
  }
  ```
- `selected` — index 0–80 or `null`.
- `notesMode` — boolean.
- `paused` — boolean.
- `generating` — boolean (drives the overlay).

Derived each render (don't store): `conflicts = Sudoku.conflicts(values)` (a `Set`),
`counts = Sudoku.counts(values)`.

**Persistence:** on mount, read `localStorage['sudoku.save.v1']` and restore
`{ screen, game, selected, notesMode }` (resume into the game only if it was in `game`
screen and not won). On every change to those four, write them back. A `loaded` ref guards
against writing before the first read. **Keep the `sudoku.save.v1` key** so existing
players' saves survive.

**Timer:** a `setInterval` ticking `seconds` every 1s while on the game screen, game exists,
not won, not paused.

**Keyboard:** a `keydown` listener active only on the game screen (digits, erase, notes
toggle, arrows). See `app.jsx` for the exact mapping.

---

## Tweaks — IMPORTANT: replace, don't port
The prototype has a `useTweaks(...)` hook and a `<TweaksPanel>` with `<TweakColor>`,
`<TweakRadio>`, etc. **That panel is a design-tool overlay from the prototyping
environment — it is not part of the shipping app.** Do not port `tweaks-panel.jsx`
(it isn't included in this bundle).

The *values* it controlled, however, are real app settings. Decide how to surface them in
the real app (a settings sheet, or just hardcode the defaults). They are:

| Key | Default | Options | Effect |
|---|---|---|---|
| `accent` | `#e5341f` | `#e5341f, #1f8a5b, #2a6fdb, #7a5ae0, #0a0a0a` | sets `--accent` CSS var |
| `theme` | `light` | `light`, `dark` | swaps the whole `--*` var set (see `THEMES` in app.jsx) |
| `peers` | `true` | toggle | highlight row/col/box peers of selection |
| `selStyle` | `invert` | `invert`, `ring` | selected-cell style |
| `numFont` | `martian` | `martian`, `mono` | numpad numeral font |

The **light/dark theme toggle is a real, shipping feature** (the half-circle glyph button
on Home and in the game header) — it just flips `theme` between the two `THEMES` maps. Wire
that up regardless of how you handle the rest. Implement `theme`/`accent` by setting CSS
custom properties on `document.documentElement` exactly as the `useEffect` in `app.jsx`
does.

For the others, simplest path: replace `useTweaks(TWEAK_DEFAULTS)` with a small settings
state object seeded from the defaults table above (persist to `localStorage` if you want
them sticky), and delete the `<TweaksPanel>` JSX entirely.

---

## Design Tokens

### Fonts (Google Fonts — already linked in `Sudoku.html` head)
- **Display:** `Martian Mono` weights 600/700/800.
- **Mono / body:** `JetBrains Mono` weights 400–800.
- CSS vars: `--mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace`,
  `--display: 'Martian Mono', 'JetBrains Mono', monospace`.

### Colors — Light theme
```
--bg #f5f5f0   --paper #f5f5f0   --ink #0a0a0a   --line #cdccc4   --box #0a0a0a
--peer #e8e7e0 --faint #8a8a82   --note #8f8e86   --selbg #0a0a0a  --selink #f5f5f0
--conflictbg rgba(229,52,31,0.12)
```
### Colors — Dark theme
```
--bg #0a0a09   --paper #121210   --ink #f1f0ea   --line #272720   --box #7d7c72
--peer #1d1d18 --faint #6f6e66   --note #73726a   --selbg #f1f0ea  --selink #0c0c0b
--conflictbg rgba(229,52,31,0.20)
```
- `--accent` default `#e5341f` (overlaid on top of whichever theme).
- `--maxw` 460px (app column width).

### Spacing / sizing notes
- App column: `max-width: 460px`, centered, full-height flex column.
- Board: `min(100%, 420px, calc(100dvh - 300px))`, `aspect-ratio: 1/1`.
- 3px outer board border (`--box`); 1px cell lines (`--line`); 2px box-seam borders.
- Hit targets: theme toggle 44×44; numpad digits large; menu items have generous padding.
- Safe-area insets (`env(safe-area-inset-*)`) used on home padding, game header top, and
  controls bottom — keep these for notched devices.
- Buttons in win card: 48px tall.

### Typography scale (key values)
- Logo `clamp(40px,12.5vw,56px)` / Martian 800 / -1.5px.
- Diff label 20px Martian 800; stat value 24px; win time 54px.
- Numpad `clamp(25px,8vw,34px)` 700; cell digit `clamp(17px,5.4vw,25px)`; notes
  `clamp(7px,2.3vw,11px)`.
- Small labels: 10–12px with 2–4px letter-spacing, mostly `--faint`.

---

## Assets
- `source/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — PWA icons. Reuse
  for `vite-plugin-pwa`.
- Fonts are loaded from Google Fonts (no local font files).
- No images beyond icons; all UI is type + CSS borders (brutalist/typographic style).

---

## Files in this bundle
```
design_handoff_sudoku/
  README.md            ← this file
  source/
    sudoku.js          ← game engine (port to ES module, no logic changes)
    app.jsx            ← root App: state, persistence, theme, timer, keyboard
    components.jsx     ← Home, GameHeader, ThemeToggle, Board, Numpad, Menu, WinOverlay
    Sudoku.html        ← shell: <head> + full <style> block + load order
    manifest.json      ← PWA manifest (feed to vite-plugin-pwa)
    sw.js              ← prototype service worker (replace with vite-plugin-pwa)
    icons/             ← PWA icons (reuse)
```

## Suggested target structure (Vite + React)
```
src/
  lib/
    sudoku.js          ← from source/sudoku.js (named exports)
    diffs.js           ← the DIFFS array
  components/
    Home.jsx
    GameHeader.jsx
    ThemeToggle.jsx
    Board.jsx
    Numpad.jsx
    Menu.jsx
    WinOverlay.jsx
  App.jsx              ← from source/app.jsx (minus the TweaksPanel scaffold)
  index.css            ← from the <style> block in Sudoku.html
  main.jsx             ← ReactDOM root (replaces the inline render call)
index.html             ← keep the font <link>s + PWA meta from Sudoku.html's <head>
```

## Port checklist
1. `lib/sudoku.js` — strip the IIFE/`window.Sudoku`, add named exports. No logic changes.
2. `index.css` — paste the `<style>` block verbatim; it's all CSS-var-driven.
3. `index.html` — copy font `<link>`s + PWA/`theme-color`/apple meta tags.
4. Components — one file each, `import React`, `export`, drop the `window` assignment.
5. `App.jsx` — port state, the three persistence/theme/timer `useEffect`s, keyboard
   handler, and actions (`newGame`, `place`, `erase`). Replace `useTweaks` + `<TweaksPanel>`
   with plain settings state (or hardcode defaults); **keep** the theme toggle and the
   `document.documentElement` CSS-var writes.
6. PWA — wire `vite-plugin-pwa` using `manifest.json` values + the icons.
7. Verify: generate each difficulty, notes, conflicts, peer highlight, pause, win, refresh-
   to-resume, light/dark.
