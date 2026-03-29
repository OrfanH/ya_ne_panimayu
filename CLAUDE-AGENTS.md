# CLAUDE-AGENTS.md — Agent roster, track routing, and token rules

Read this file when you are the orchestrator or need to route a task.

---

## Agent roster

| Agent | Model | Track | Role |
|---|---|---|---|
| orchestrator | opus | all | Reads IMPROVEMENTS.md, picks task, routes to correct track |
| researcher | opus | BUILD, CONTENT | Deep research: pedagogy, game design, technical. Runs once per task. |
| architect | sonnet | BUILD | Designs solution spec from researcher brief |
| designer | sonnet | BUILD | Translates architect spec into visual brief |
| composer | sonnet | BUILD | Writes music spec per location for Tone.js synthesis |
| coder | sonnet | BUILD, FAST | Implements from spec. Vanilla JS, Phaser, mobile-first CSS. |
| fixer | sonnet | BUG | Targeted fix from reviewer report |
| narrative-director | sonnet | CONTENT | Writes STORY.md and WORLD.md |
| curriculum-designer | sonnet | CONTENT | Maps vocabulary across locations with reinforcement links |
| content-writer | sonnet | CONTENT, BUILD | Writes NPC dialogue, missions, vocabulary, tutor prompts |
| dialogue-writer | sonnet | CONTENT | Writes dialogue trees from content spec |
| linguist | sonnet | CONTENT | Reviews Russian accuracy, level-appropriateness, naturalness |
| pixel-artist | sonnet | BUILD | Pixel art sprites, tilesets, portraits |
| reviewer | haiku | BUILD, FAST | Code review against CLAUDE-RULES.md |
| ux-reviewer | haiku | BUILD, CONTENT | Game feel and learning experience gate |
| tester | haiku | BUILD | Functional testing |
| code-tracer | haiku | BUILD, BUG, PLAYTEST | Static analysis — traces event chains, data shapes, null refs. No browser. Fast first pass. |
| playtester | sonnet | BUILD, BUG, PLAYTEST | Event-injection browser testing — fires game events via preview_eval, checks DOM + console |
| git | haiku | all | Commits, pushes, logs to IMPROVEMENTS.md |

## Track routing

| Track | When | Agent sequence |
|---|---|---|
| FAST | Fix, polish, feel improvement | coder -> reviewer -> git |
| CONTENT | Russian writing, dialogue, missions | researcher -> content-writer -> ux-reviewer -> git |
| BUILD | New features, scenes, systems | researcher -> architect -> designer + content-writer (parallel) -> coder -> reviewer -> code-tracer -> playtester -> ux-reviewer -> git |
| BUG | Targeted fix from review | fixer -> reviewer -> code-tracer -> playtester -> git |
| PLAYTEST | Ad-hoc game QA | code-tracer -> playtester -> (issues found? fixer -> code-tracer -> playtester) -> git |

## Handoff protocol

Every agent reads from and writes to `.claude/handoffs/`. No verbal handoffs.

| From | To | File |
|---|---|---|
| researcher | architect or curriculum-designer | research-brief.md |
| architect | designer | architecture-spec.md |
| designer | coder | design-spec.md |
| composer | coder | .claude/music-spec.md |
| curriculum-designer | content-writer | curriculum-map.md |
| narrative-director | content-writer, dialogue-writer | narrative-review.md |
| content-writer | dialogue-writer | content-spec.md |
| dialogue-writer | linguist | dialogue-draft.md |
| linguist | ux-reviewer or back to content-writer | language-review.md |
| coder | reviewer | (source files directly) |
| reviewer | tester or back to coder | review-report.md |
| fixer | reviewer | fix-report.md |
| tester | ux-reviewer or orchestrator | test-report.md |
| code-tracer | playtester or fixer | trace-report.md |
| playtester | fixer or orchestrator | play-report.md |
| ux-reviewer | git or back to orchestrator | ux-report.md |
| git | orchestrator | (commit hash -> IMPROVEMENTS.md) |

---

## Token optimisation rules

Mandatory for every agent. Violating these rules wastes budget.

**File reading:**
- Read only the scoped CLAUDE-*.md for your role
- Read source files by exact name only — never glob directories
- STORY.md and WORLD.md: always grep for the specific section needed. Full load only if narrative-director is writing for the first time.
- IMPROVEMENTS.md: read Current task and Backlog only. Never read Done.
- .claude/handoffs/ files are wiped at task start. Never read a stale handoff.

**Model assignment:**
- Opus: orchestrator, researcher — run once per task, do not re-read files in context
- Sonnet: architect, designer, composer, coder, fixer, narrative-director, curriculum-designer, content-writer, dialogue-writer, linguist, pixel-artist
- Haiku: reviewer, ux-reviewer, tester, git — trimmed context, do not request extra files

**Handoff file size limits:**
- research-brief.md: max 400 words
- architecture-spec.md: max 600 words
- design-spec.md: max 400 words
- curriculum-map.md: max 800 words
- content-spec.md: max 600 words per location
- dialogue-draft.md: max 800 words per location
- music-spec.md: max 150 words per location
- All review and report files: max 200 words

---

## Build dependency graph

Nothing gets built before its dependency exists.
Orchestrator checks this before every task.

```
Phaser boots (TASK-001)
  └── Town map (TASK-003)
        ├── Player sprite (TASK-004)
        │     ├── Mobile input (TASK-005)
        │     └── HUD (TASK-009)
        │           └── Journal (TASK-010)
        └── NPC system (TASK-006)
              └── Dialogue UI (TASK-007)
                    └── AI dialogue (TASK-008) ← also needs STORY.md
                          └── Mistake logger (TASK-011)

STORY.md + WORLD.md (TASK-002) ← gates TASK-008, 014–021
Audio system (TASK-012) ← needs TASK-003 + TASK-002

GATE: First location complete (TASK-013) ← needs TASK-008, 010, 011, 012
  └── Park (TASK-015)
        └── Café (TASK-016)
              └── Market (TASK-017)
                    └── Train station (TASK-018)
                          └── Police station (TASK-019)

Chapter tests (TASK-020) ← needs TASK-013
Targeted missions (TASK-021) ← needs TASK-011, 020, 002
```

---

## Mandatory separation of concerns

These rules cannot be broken by any agent under any circumstances:

- Phaser owns the canvas. World, sprites, tilemaps, movement, collision — all Phaser.
- HTML/CSS/JS owns all UI. Dialogue, journal, HUD, menus — all HTML overlay.
- Layers communicate via custom events only. No direct calls between Phaser and HTML.
- All storage via storage.js -> Vercel KV. No localStorage. No sessionStorage.
- API key in api/tutor.js only. Never in frontend.
- All audio via Tone.js synthesis. No audio files. No CDN audio assets.
- Audio starts only on first user interaction via Tone.start().
