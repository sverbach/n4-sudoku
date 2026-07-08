# Graph Report - .  (2026-07-08)

## Corpus Check
- Corpus is ~45,563 words - fits in a single context window. You may not need a graph.

## Summary
- 417 nodes · 594 edges · 38 communities (30 shown, 8 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.63)
- Token cost: 423,781 input · 47,082 output

## Community Hubs (Navigation)
- React Board/Game UI
- Legacy jQuery App Shell
- Client Package Config
- QUnit Test Library
- API Data/EF Core Models
- Share/Load Game Modals
- Graphify Skill References
- API Controllers
- Project Docs & Memory
- Client TS Config (App)
- Client TS Config (Node)
- Legacy JSX Components
- PWA Manifest
- Sudoku Core Solver Library
- Sudoku Core TS Typings
- API Project/NuGet Config
- Bootstrap JS Plugin
- PWA Icon 192 Design
- HTML5 Shiv Polyfill
- Sudoku.js TODOs/Rationale
- Maskable Icon 512 Design
- Glyphicons Sprite Assets
- PWA Icon 512 Design
- Root TS Config
- Demo Apple Touch Icons
- Bootstrap Touch Icon
- Service Worker Shell
- App.js TODO Rationale
- Apple Touch Icon 114
- Apple Touch Icon 72
- Pacman Loading Spinner

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 16 edges
3. `m()` - 16 edges
4. `DifficultyId` - 12 edges
5. `r()` - 11 edges
6. `v()` - 11 edges
7. `n()` - 10 edges
8. `p()` - 10 edges
9. `Graphify SKILL.md` - 9 edges
10. `SudokuLib` - 8 edges

## Surprising Connections (you probably didn't know these)
- `n4-sudoku CLAUDE.md project guide` --semantically_similar_to--> `.claude/CLAUDE.md graphify pointer`  [INFERRED] [semantically similar]
  CLAUDE.md → .claude/CLAUDE.md
- `n4-sudoku README` --semantically_similar_to--> `n4-sudoku CLAUDE.md project guide`  [INFERRED] [semantically similar]
  README.md → CLAUDE.md
- `Numpad()` --indirect_call--> `n()`  [INFERRED]
  design_handoff_sudoku/source/components.jsx → sudoku.js-master/demo/assets/js/jquery.min.js
- `PWA App Icon (192x192) - Sudoku Grid Mark` --semantically_similar_to--> `PWA App Icon (192x192)`  [INFERRED] [semantically similar]
  design_handoff_sudoku/source/icons/icon-192.png → client/public/icons/icon-192.png
- `PWA App Icon (512x512)` --semantically_similar_to--> `PWA App Icon (512x512)`  [INFERRED] [semantically similar]
  design_handoff_sudoku/source/icons/icon-512.png → client/public/icons/icon-512.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Claude Code Project Guidance System** — claude_claude_claude_graphifypointer, claude_projectguide, claude_projects_users_sver_projects_n4_sudoku_memory_memory_index, claude_projects_users_sver_projects_n4_sudoku_memory_project_scaffold_scaffold [INFERRED 0.85]
- **Graphify Skill Reference Pipeline** — claude_skills_graphify_skill_skill, claude_skills_graphify_references_add_watch_doc, claude_skills_graphify_references_exports_doc, claude_skills_graphify_references_extraction_spec_doc, claude_skills_graphify_references_github_and_merge_doc, claude_skills_graphify_references_hooks_doc, claude_skills_graphify_references_query_doc, claude_skills_graphify_references_transcribe_doc, claude_skills_graphify_references_update_doc [EXTRACTED 1.00]
- **Sharing Feature Implementation Components** — sharing_feature_plan_sharesapi, sharing_feature_plan_sharegamestate, sharing_feature_plan_idgenerator, sharing_feature_plan_shareentity [EXTRACTED 1.00]

## Communities (38 total, 8 thin omitted)

### Community 0 - "React Board/Game UI"
Cohesion: 0.07
Nodes (37): MainRoute(), Board(), Props, Props, GameHeader(), Props, GameScreen(), Home() (+29 more)

### Community 1 - "Legacy jQuery App Shell"
Cohesion: 0.17
Nodes (29): App(), makeGame(), NUMFONTS, THEMES, TWEAK_DEFAULTS, a(), b(), c() (+21 more)

### Community 2 - "Client Package Config"
Cohesion: 0.07
Nodes (29): dependencies, react, react-dom, react-router-dom, devDependencies, autoprefixer, eslint, @eslint/js (+21 more)

### Community 3 - "QUnit Test Library"
Cohesion: 0.10
Nodes (18): addClass(), addEvent(), addEvents(), array(), checkPollution(), diff(), done(), extend() (+10 more)

### Community 4 - "API Data/EF Core Models"
Cohesion: 0.08
Nodes (18): Sudoku.Api.Data, Sudoku.Api.Migrations, Sudoku.Api.Models, DateTime, DbContext, DbSet, JsonDocument, Migration (+10 more)

### Community 5 - "Share/Load Game Modals"
Cohesion: 0.13
Nodes (19): GameNotFoundModal(), GameNotFoundModalProps, LoadShareModalProps, ShareLoader(), GameContext, GameProvider(), loadSave(), makeGame() (+11 more)

### Community 6 - "Graphify Skill References"
Cohesion: 0.09
Nodes (23): add-watch.md reference, exports.md reference, FalkorDB Export, MCP Server Export, Neo4j Export, Wiki Export, Confidence Score Rubric, extraction-spec.md reference (+15 more)

### Community 7 - "API Controllers"
Cohesion: 0.11
Nodes (16): ControllerBase, Sudoku.Api.Controllers, Sudoku.Api.Helpers, HttpPost, int, JsonElement, HttpGet, IActionResult (+8 more)

### Community 8 - "Project Docs & Memory"
Cohesion: 0.12
Nodes (22): .claude/CLAUDE.md graphify pointer, n4-sudoku CLAUDE.md project guide, Memory Index, Offline-First PWA Rationale, Project Scaffold Memory, client/index.html shell, n4-sudoku Design Handoff README, TweaksPanel design-tool scaffold (+14 more)

### Community 9 - "Client TS Config (App)"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 10 - "Client TS Config (Node)"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 11 - "Legacy JSX Components"
Cohesion: 0.25
Nodes (8): Board(), DIFFS, fmt(), GameHeader(), Home(), Numpad(), peersOf(), WinOverlay()

### Community 12 - "PWA Manifest"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, scope, short_name (+2 more)

### Community 13 - "Sudoku Core Solver Library"
Cohesion: 0.38
Nodes (8): conflicts(), countSolutions(), fill(), generate(), isComplete(), isValid(), shuffle(), solvedGrid()

### Community 15 - "API Project/NuGet Config"
Cohesion: 0.33
Nodes (5): net10.0, Microsoft.AspNetCore.OpenApi (10.0.0), Microsoft.EntityFrameworkCore.Design (10.0.8), Npgsql.EntityFrameworkCore.PostgreSQL (10.0.0), Microsoft.NET.Sdk.Web

### Community 17 - "PWA Icon 192 Design"
Cohesion: 0.40
Nodes (5): PWA App Icon (192x192), 3x3 Sudoku block grid motif with one highlighted cell, PWA App Icon (192x192) - Sudoku Grid Mark, Icon color scheme: black grid lines/frame, off-white/cream cell fills, single red-orange accent cell, 3x3 Sudoku Grid Motif (black frame, off-white cells, single red accent cell)

### Community 18 - "HTML5 Shiv Polyfill"
Cohesion: 0.70
Nodes (4): h(), i(), j(), k()

### Community 19 - "Sudoku.js TODOs/Rationale"
Cohesion: 0.40
Nodes (3): TODO: Make a standalone board checker. Solve is expensive., TODO: Implement a non-rediculous deep copy function, TODO: Implement a non-rediculous deep copy function

### Community 20 - "Maskable Icon 512 Design"
Cohesion: 0.67
Nodes (4): Red Accent Highlighted Cell, Maskable App Icon (512x512), 3x3 Sudoku Grid Motif, Maskable App Icon (512x512) - stylized 3x3 sudoku grid, black frame with cream/off-white cells and one red accent cell, off-white background, safe-zone padding for PWA maskable icon

### Community 21 - "Glyphicons Sprite Assets"
Cohesion: 0.50
Nodes (4): Bootstrap UI Icon Set, Glyphicons Halflings Sprite Sheet, sudoku.js Demo Page, Glyphicons Halflings Sprite (White)

### Community 22 - "PWA Icon 512 Design"
Cohesion: 0.67
Nodes (3): PWA App Icon (512x512), 3x3 Sudoku Grid Motif with Highlighted Cell, PWA App Icon (512x512)

### Community 24 - "Demo Apple Touch Icons"
Cohesion: 0.67
Nodes (3): sudoku.js-master demo app, Apple Touch Icon (144x144, precomposed) - Letter B, sudoku.js-master/demo/assets/ico directory

### Community 25 - "Bootstrap Touch Icon"
Cohesion: 0.67
Nodes (3): Apple Touch Icon (57x57, Bootstrap 'B' logo), Bootstrap (CSS framework), sudoku.js demo page

## Knowledge Gaps
- **127 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `v()` connect `Legacy jQuery App Shell` to `React Board/Game UI`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `GameScreen()` connect `React Board/Game UI` to `Legacy jQuery App Shell`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `useGame()` connect `React Board/Game UI` to `Share/Load Game Modals`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `m()` (e.g. with `d()` and `f()`) actually correct?**
  _`m()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Board/Game UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06957047791893527 - nodes in this community are weakly interconnected._
- **Should `Client Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._