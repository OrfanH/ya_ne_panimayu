# CLAUDE-AGENTS.md — Agent roster, track routing, and token rules

Read this file when you are the orchestrator or need to route a task.

---

## Agent roster

| Agent | Model | Track | Role |
|---|---|---|---|
| orchestrator | opus | all | Reads IMPROVEMENTS.md, picks task, routes to correct track. When backlog empty, assesses project and generates tasks. |
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
| playtester | sonnet | BUILD, BUG | Plays game in-browser, finds bugs, empty UI, broken interactions |
| git | haiku | all | Commits, pushes, logs to IMPROVEMENTS.md |

## Track routing

| Track | When | Agent sequence |
|---|---|---|
| FAST | Fix, polish, feel improvement | coder -> reviewer -> git |
| CONTENT | Russian writing, dialogue, missions | researcher -> narrative-director -> curriculum-designer -> content-writer -> dialogue-writer -> linguist -> ux-reviewer -> git |
| BUILD | New features, scenes, systems | researcher -> architect -> designer + content-writer (parallel) -> coder -> reviewer -> playtester -> ux-reviewer -> git |
| BUILD-ART | Pixel art, sprites, portraits | researcher -> pixel-artist -> designer -> coder -> reviewer -> git |
| BUILD-AUDIO | Music, soundscapes | researcher -> composer -> coder -> reviewer -> git |
| BUG | Targeted fix from review | fixer -> reviewer -> playtester -> git |
| PLAYTEST | Ad-hoc game QA | playtester -> (issues found? fixer -> playtester) -> git |

**Note:** Tasks may override the default track sequence via their `assigned_agents` list. The task's list is always the authority — it may add or omit agents as needed. Track routing is the default when `assigned_agents` is not specified.

### Parallel agent merge protocol

When a track runs agents in parallel (e.g. designer + content-writer in BUILD):
1. Both agents read the same architecture-spec.md as input
2. Designer writes `.claude/handoffs/design-spec.md` (visual brief)
3. Content-writer writes `.claude/handoffs/content-spec.md` (dialogue/vocab structure)
4. Coder reads **both** handoff files — design-spec.md for UI/visuals, content-spec.md for data/dialogue
5. If the two specs conflict (e.g. both specify layout for the same UI element), coder follows design-spec.md for visuals and content-spec.md for data/structure
6. Coder flags any unresolvable conflicts in a comment: `// CONFLICT: design-spec says X, content-spec says Y — chose X`

## Handoff protocol

Every agent reads from and writes to `.claude/handoffs/`. No verbal handoffs.

All handoff files live in `.claude/handoffs/` and are wiped at the start of each task.
Persistent specs (curriculum-map.md, music-spec.md, pixel-art-spec.md) live in `.claude/` and survive across tasks.

| From | To | File | Location |
|---|---|---|---|
| researcher | architect or curriculum-designer | research-brief.md | .claude/handoffs/ |
| architect | designer, coder | architecture-spec.md | .claude/handoffs/ |
| designer | coder | design-spec.md | .claude/handoffs/ |
| pixel-artist | designer, coder | pixel-art-spec.md | .claude/ (persistent) |
| composer | coder | music-spec.md | .claude/ (persistent) |
| narrative-director | content-writer, dialogue-writer | narrative-review.md | .claude/handoffs/ |
| curriculum-designer | content-writer | curriculum-map.md | .claude/ (persistent) |
| content-writer | dialogue-writer | content-spec.md | .claude/handoffs/ |
| dialogue-writer | linguist | dialogue-draft.md | .claude/handoffs/ |
| linguist | ux-reviewer or back to content-writer | language-review.md | .claude/handoffs/ |
| coder | reviewer | (source files directly) | — |
| reviewer | tester or back to coder | review-report.md | .claude/handoffs/ |
| fixer | reviewer | fix-report.md | .claude/handoffs/ |
| playtester | fixer or orchestrator | play-report.md | .claude/handoffs/ |
| tester | ux-reviewer or orchestrator | test-report.md | .claude/handoffs/ |
| ux-reviewer | git or back to orchestrator | ux-report.md | .claude/handoffs/ |
| git | orchestrator | (commit hash -> IMPROVEMENTS.md) | — |

**All agents output PASS or FAIL on line 1 of their handoff file.** The orchestrator reads line 1 to decide whether to proceed or retry.

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
