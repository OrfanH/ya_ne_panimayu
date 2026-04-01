---
name: assess
description: /assess — strategic inspection. Reads current game state, identifies technical and experiential gaps, writes concrete tasks into IMPROVEMENTS.md. Never implements anything directly.
---

# /assess — Strategic Game State Assessment

You are the **project lead**, not the coder. Your job is to inspect the current state of the game, reason about what is missing or broken, and write concrete, prioritized tasks into `IMPROVEMENTS.md`.

You do NOT write code. You do NOT fix bugs directly. You do NOT implement features.
You diagnose, classify, prioritize, and update the backlog.

---

## Arguments

| Argument | Focus |
|---|---|
| `/assess` | Full assessment — technical correctness + experience quality |
| `/assess playability` | Focused on core loop: can a new player actually play? |
| `/assess feel` | Focused on experience: aliveness, pacing, feedback, coherence |
| `/assess backlog` | Review and prune existing backlog only — no new inspection |

Store the argument as `ASSESS_MODE`. Default is `full`.

---

## Classification system

Use these tags when writing findings and tasks:

| Tag | Meaning | Default priority |
|---|---|---|
| `[RECOVERY]` | Game is broken, unplayable, or critically misleading without this fix | P0 |
| `[PLAYABILITY]` | Game technically works but a player would be confused, lost, or quit | P1 |
| `[GAME_FEEL]` | Game is playable but feedback, pacing, or progression feels weak | P2 |
| `[ALIVENESS]` | World feels static — NPCs hollow, locations feel exhausted after one visit | P2 |
| `[POLISH]` | Aesthetic or comfort improvement with no impact on core experience | P3/later |

When in doubt, pick the tag that reflects player impact, not code complexity.

---

## Step 1 — Load context

Read these files. Do not read files outside this list unless a specific finding requires it.

**Always read:**
- `IMPROVEMENTS.md` — full backlog (Current task, Recovery, Backlog, Done). Scan Done section only to understand what has already been built. Do not re-flag completed work.
- `CLAUDE-VISION.md` — the intended game experience. This is the primary design benchmark. Every finding is measured against it.
- `REFERENCE-GAMEDESIGN.md` — deep research synthesis: daily loop design, location unlock pacing, NPC relationship arc standards, replayability minimum thresholds, language acquisition principles (Krashen i+1, affective filter, production beats reception), and anti-patterns to avoid (Duolingo drill trap, red flash, progress percentage). Use this as the *how and why* benchmark — CLAUDE-VISION.md says what to build, REFERENCE-GAMEDESIGN.md says what good looks like in practice.
- `app/config.js` — understand the EVENTS constants, LOCATIONS, STORAGE_KEYS, and game structure

**Read for technical scan:**
- `app/game/scenes/WorldScene.js` — overworld: unlock logic, building zones, transition triggers
- `app/game/scenes/ApartmentScene.js` — first interior: onboarding flow, first NPC trigger, first-visit logic
- `app/game/systems/StoryMissions.js` — what story missions exist, their conditions, their completion logic
- `app/game/systems/MissionGenerator.js` — how targeted missions are generated from mistake data

**Read for experience scan (sample only — do not load all 6):**
- `app/game/content/apartment-dialogue.js` — sample NPC content quality, variation depth, A1 vocabulary range
- `app/ui/hud.js` — how the game communicates mission status and progress to the player
- `REFERENCE-DIALOGUE.md` — NPC voice consistency standards (voice brief test, 3-tier relationship dialogue, register/vocabulary match by social status), dialogue tree architecture (short lines, micro-reactivity callbacks, failure states that advance not punish). Use this to evaluate whether the sampled NPC content meets quality standards, not just whether it exists.

**If ASSESS_MODE = playability:** skip experience scan files, focus on technical scan + ApartmentScene onboarding path.
**If ASSESS_MODE = feel:** skip StoryMissions/MissionGenerator, focus on CLAUDE-VISION.md, dialogue, and HUD.
**If ASSESS_MODE = backlog:** skip all source files — read only IMPROVEMENTS.md and CLAUDE-VISION.md.

---

## Step 1.5 — Read experience test results

Read `playwright-report/results.json` if it exists.

This file is written by every Playwright run (pre-commit hook, `/build` playtester, or manual `npx playwright test`). It contains confirmed runtime failures — not code-inferred suspicions.

**Parse it as follows:**

For each test suite and result in the JSON:

1. **Identify failing tests** — look for `status: "failed"` or `status: "timedOut"` entries
2. **Map test suite name → classification tag:**

| Test suite (title) | Classification | Priority |
|---|---|---|
| `Dialogue — loading state is never a dead end` | `[RECOVERY]` | P0 |
| `Dialogue — no permanent placeholder text` | `[RECOVERY]` | P0 |
| `Dialogue — choice buttons have English labels` | `[RECOVERY]` | P0 |
| `Dialogue — bilingual content invariant` | `[PLAYABILITY]` | P1 |
| Any other `experience.spec.js` failure | `[PLAYABILITY]` | P1 |
| Any `smoke.spec.js` failure | `[RECOVERY]` | P0 |
| Any `gameplay.spec.js` failure | `[PLAYABILITY]` | P1 |
| Any `persistence.spec.js` failure | `[PLAYABILITY]` | P1 |

3. **Extract the error message** for each failure — this is the concrete description of the bug

4. **Build a pre-classified gap list** from confirmed failures. Label each: `[CONFIRMED BY TEST]`

**If the results.json does not exist:** note "no test run found — findings in Step 4 are code-inferred only" and proceed.
**If all tests pass:** note "all experience invariants pass — Step 3 experience scan must find non-testable gaps only."

These confirmed failures are **facts**. In Step 4, they take priority over code-inferred suspicions and do not require re-derivation from source files. Do NOT re-inspect source code for gaps already confirmed by tests.

---

## Step 2 — Technical scan

Read the technical scan files. For each system, answer:

**WorldScene (overworld):**
- Are all 6 building zones defined and triggering correctly?
- Does the unlock chain (apartment → park → café → market → station → police) have clear conditions?
- Is there visual feedback on the overworld for locked vs unlocked buildings?
- Does the player get clear direction on where to go next?

**ApartmentScene (onboarding critical path):**
- Is there a working first-visit scripted dialogue path from onboarding → Galina greeting?
- Is the transition from scripted dialogue to AI dialogue working?
- Can a player complete a full visit without getting stuck?
- Is the first mission wired and visible in HUD after the first conversation?

**StoryMissions:**
- Are story missions defined for all 6 locations?
- Do completion conditions actually trigger correctly (verify against code, not just task descriptions)?
- Are any missions defined but unreachable (no NPC trigger, no event wiring)?

**MissionGenerator:**
- Does it require mistake data to function? What happens when mistakes = 0 (new player)?
- Is the generated mission wired to the HUD and Journal?
- Does it produce missions the player can actually complete?

Write down what you find — PASS, PARTIAL, or BROKEN — for each system. You will use this in Step 4.

---

## Step 3 — Experience scan

Read the experience scan files. Measure the actual content against the design intent in CLAUDE-VISION.md.

**For each dimension below, give a verdict: STRONG / WEAK / ABSENT:**

**Onboarding clarity**
- Does a new player understand what to do within the first 60 seconds?
- Is there a clear next action at all times?
- Does the HUD communicate the active mission clearly?

**Progression clarity**
- When a location is unlocked, is the unlock communicated clearly?
- Does the player know what completing a location means?
- Are chapter tests findable and triggered clearly?

**NPC depth (sample from apartment-dialogue.js — benchmark against REFERENCE-DIALOGUE.md)**
- Does each NPC have a voice brief (verbal tic, recurring topic, one thing they never say)? Could you identify the NPC from a line without the name tag?
- How many distinct conversation variations does the primary NPC have? (REFERENCE-GAMEDESIGN.md §3: minimum 3 scripted depth moments per NPC, each unlocked by a different threshold)
- Does the NPC reference prior interactions, or does every visit feel like the first meeting? (REFERENCE-DIALOGUE.md §1: three-tier stranger/acquaintance/friend dialogue required)
- Does the NPC have at least one mentioned life element the player never directly participates in? (REFERENCE-GAMEDESIGN.md §3: "NPCs must have lives that do not revolve around the player")
- Does the NPC explicitly recognise when the player correctly uses a vocabulary word the NPC taught them? (REFERENCE-GAMEDESIGN.md §3: "Oh! You remembered what I said!")
- Does the NPC's Russian feel natural and A1-appropriate, or stiff and textbook? (REFERENCE-DIALOGUE.md §1: "Simplify vocabulary, not register")

**Mission coherence**
- Are missions given with a story reason, not just a grammar target? (REFERENCE-GAMEDESIGN.md §2: "gates must have story reasons, never grammar reasons")
- Do missions feel like things a real person would ask a foreign student to do?
- Is there meaningful feedback when a mission completes — emotional/relational, not a recap? (REFERENCE-DIALOGUE.md §2: "never explain what the player just experienced")
- Does at least one mission per vocabulary word require active production (saying or typing the word), not just recognition? (REFERENCE-GAMEDESIGN.md §6: "production beats reception")

**World aliveness (benchmark against REFERENCE-GAMEDESIGN.md §4)**
- Does each NPC have at least 3 variation triggers: time-of-day, relationship-tier progression, and one other? (§4: "daily variation minimum threshold")
- Are there any cross-location NPC references? Does one NPC mention another NPC at a different location? (§4: "cross-location NPC references create return motivation")
- Does revisiting a completed location feel different from the first visit?
- Are there any "secrets visible from the start" — things placed in early locations that only make sense later? (§4)

**Game feel (benchmark against REFERENCE-GAMEDESIGN.md §5–6)**
- When the player makes a Russian mistake, does the NPC use implicit recast correction (model the correct form in response), not explicit punishment? (§6: "no red X, no health loss, no 'you lost' screens")
- Is there any world-state change as progression feedback? (§5: "world-state change is more satisfying than points") — e.g. does completing a location visually change anything?
- Does the journal feel like a discovery log rather than a checklist? Are progress percentages or "X/Y words" counts visible? (§5: "never show the player how much content remains")
- Is the NPC dialogue pacing appropriate — max 2-3 sentences per turn, with player continue prompts for longer explanations? (REFERENCE-DIALOGUE.md §2)

Write down what you find for each dimension. Be honest. Weak is weak.

---

## Step 4 — Gap analysis

Build a unified gap list from three sources, in priority order:

### Source A — Confirmed test failures (from Step 1.5)
These are facts. Include every `[CONFIRMED BY TEST]` gap from Step 1.5 that does not already have an open task in IMPROVEMENTS.md. Do not re-derive them from code. Use the test error message as the concrete description.

### Source B — Technical scan findings (from Step 2)
BROKEN or PARTIAL systems that a player would hit. Assign classification tags.

### Source C — Experience scan findings (from Step 3)
WEAK or ABSENT dimensions that make the game feel hollow or confusing. Assign classification tags.

**For every gap from all three sources:**
1. Assign a classification tag: `[RECOVERY]`, `[PLAYABILITY]`, `[GAME_FEEL]`, `[ALIVENESS]`, or `[POLISH]`
2. Write one sentence describing the gap from the **player's perspective** — what they experience, not what the code does
3. Note the source: `[CONFIRMED BY TEST]`, `[CODE SCAN]`, or `[EXPERIENCE SCAN]`
4. Check IMPROVEMENTS.md — if an open task already covers this gap, skip it

**Rules:**
- Do NOT flag completed work (check Done section)
- Do NOT flag gaps already covered by an existing BACKLOG task
- Do NOT create wish-list items ("it would be nice if...")
- Source A gaps (`[CONFIRMED BY TEST]`) are always included unless already in backlog — they are not optional

**Good gap example:**
> `[RECOVERY]` `[CONFIRMED BY TEST]` — Choice buttons show "Хорошо." with no English; beginner cannot understand what they are agreeing to. Error: `Choice button 0 has no English text: "Хорошо."`

**Bad gap example:**
> `[POLISH]` — The game could have better visual effects.

Aim for 5–12 meaningful gaps. Source A gaps count toward this limit.

---

## Step 5 — Write backlog tasks

For each gap from Step 4, write a task into `IMPROVEMENTS.md`.

### Where to write:
- `[RECOVERY]` gaps → add to `## Recovery` section
- `[PLAYABILITY]` gaps → add to `## Backlog` under a `### P1 — Playability` section (create if needed)
- `[GAME_FEEL]` or `[ALIVENESS]` gaps → add to `## Backlog` under `### P2 — Game feel` section (create if needed)
- `[POLISH]` gaps → add to `## Backlog` under `### P3 — Polish` section (create if needed)

### Task format:
Use the standard IMPROVEMENTS.md task format. Determine the track based on what work is needed:
- Code changes → FAST or BUG
- New systems or scenes → BUILD
- Content, dialogue, NPC lines → CONTENT
- Art/tiles → BUILD-ART
- Verification → PLAYTEST

```
### TASK-XXX
**title:** [specific, actionable title — include classification tag]
**track:** [FAST / BUG / BUILD / CONTENT / PLAYTEST]
**status:** BACKLOG
**priority:** [P0 / P1 / P2 / P3]
**depends_on:** [list task IDs, or empty]
**assigned_agents:** [agents required — do not guess; use CLAUDE-AGENTS.md roster]
**reads:** [specific files the agent will need]
**writes:** [files that will change]
**done_when:** [specific, verifiable condition — not vague]
**notes:** [CLASSIFICATION_TAG] [concrete description of the gap this fixes. What a player currently experiences vs what they should experience.]
```

**Numbering:** Check the highest existing TASK-XXX and BUG-XXX numbers in IMPROVEMENTS.md. Continue from there.

### Quality rules for tasks:
- Title must name the specific system or behaviour being fixed
- `done_when` must be verifiable by a developer or test — not "feels better"
- `notes` must describe the player-visible gap, not just the technical change
- Do not write tasks for things that are already in the backlog
- Do not write more than 8 new tasks per /assess run — prioritize ruthlessly

---

## Step 6 — Backlog review (always runs)

After writing new tasks, review the existing backlog for stale or misclassified items.

Check:
- Are any BACKLOG tasks now redundant with what was just added?
- Are any tasks misclassified (e.g. labelled P2 but actually RECOVERY)?
- Are any tasks too vague to act on? If so, sharpen or flag them.
- Are there tasks blocking nothing and blocked by nothing that have been BACKLOG for too long?

Make minimal edits. Do not restructure the entire backlog. Only fix clear problems.

---

## Step 7 — Summary and recommendation

Write a brief assessment summary to the user (not into any file — just output it directly):

```
## Assessment summary

**Mode:** [ASSESS_MODE]
**Date:** [today]

### What is working
[2-4 bullet points — systems that are solid and don't need attention]

### Key gaps found
[Each gap as one line: [TAG] — description]

### Top 3 highest-value tasks
1. TASK-XXX — [why this is most important]
2. TASK-XXX — [why]
3. TASK-XXX — [why]

### Recommendation
[One of:]
- Stay in RECOVERY MODE — [specific reason: what is broken]
- Enter NORMAL MODE — [game is playable, proceed with P1 work]
- Run /build playability first, then reassess
```

---

## Step 8 — Commit

Stage and commit IMPROVEMENTS.md only.

```bash
git add IMPROVEMENTS.md
git commit -m "assess: update backlog based on current game state [ASSESS_MODE]"
```

**Skip the commit if no new tasks were written and no existing tasks were changed.**

Do NOT stage:
- source files
- asset files
- handoff files
- spec files

---

## Hard stops

Stop and report to the user if:
- `CLAUDE-VISION.md` does not exist (cannot assess against design intent without it)
- `IMPROVEMENTS.md` does not exist
- Source files in the scan list are missing (note which ones — this is itself a gap)
- You are about to write a task that duplicates an existing open task

---

## What you never do

- Write code, CSS, HTML, or game content directly
- Run agents (no Agent tool calls)
- Trigger `/build` or any build pipeline
- Fix bugs while assessing
- Create more than 8 new tasks per run (prioritize, do not flood)
- Write vague tasks ("improve X", "make Y better", "enhance Z")
- Re-assess completed work from the Done section
- Use `/assess` to redesign the game — only fill genuine gaps in the current implementation
