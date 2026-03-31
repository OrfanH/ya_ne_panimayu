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
- `CLAUDE-VISION.md` — the intended game experience. This is the benchmark. Every finding is measured against it.
- `app/config.js` — understand the EVENTS constants, LOCATIONS, STORAGE_KEYS, and game structure

**Read for technical scan:**
- `app/game/scenes/WorldScene.js` — overworld: unlock logic, building zones, transition triggers
- `app/game/scenes/ApartmentScene.js` — first interior: onboarding flow, first NPC trigger, first-visit logic
- `app/game/systems/StoryMissions.js` — what story missions exist, their conditions, their completion logic
- `app/game/systems/MissionGenerator.js` — how targeted missions are generated from mistake data

**Read for experience scan (sample only — do not load all 6):**
- `app/game/content/apartment-dialogue.js` — sample NPC content quality, variation depth, A1 vocabulary range
- `app/ui/hud.js` — how the game communicates mission status and progress to the player

**If ASSESS_MODE = playability:** skip experience scan files, focus on technical scan + ApartmentScene onboarding path.
**If ASSESS_MODE = feel:** skip StoryMissions/MissionGenerator, focus on CLAUDE-VISION.md, dialogue, and HUD.
**If ASSESS_MODE = backlog:** skip all source files — read only IMPROVEMENTS.md and CLAUDE-VISION.md.

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

**NPC depth (sample from apartment-dialogue.js)**
- How many distinct conversation variations does the primary NPC have?
- Does the NPC reference prior interactions, or does every visit feel like the first meeting?
- Does the NPC's Russian feel natural and A1-appropriate, or stiff and textbook?
- Does the NPC feel like a character or a vocabulary delivery system?

**Mission coherence**
- Are missions given with a story reason (CLAUDE-VISION.md spec), not just a grammar target?
- Do missions feel like things a real person would ask a foreign student to do?
- Is there meaningful feedback when a mission completes?

**World aliveness**
- Do NPCs have greeting variations that change over time?
- Does revisiting a location feel different from the first visit?
- Is the world silent between interactions (no ambient audio cues, no visual movement)?

**Game feel**
- Is there clear feedback when the player does something right?
- Is there clear, gentle feedback when the player makes a Russian mistake?
- Does completing a vocabulary word feel rewarding?
- Is the pacing between missions and free conversation appropriate?

Write down what you find for each dimension. Be honest. Weak is weak.

---

## Step 4 — Gap analysis

Combine findings from Steps 2 and 3 into a unified gap list.

For each gap:
1. Assign a classification tag: `[RECOVERY]`, `[PLAYABILITY]`, `[GAME_FEEL]`, `[ALIVENESS]`, or `[POLISH]`
2. Write one sentence describing the gap concretely
3. Note whether a task for this already exists in the backlog (check IMPROVEMENTS.md) — if it does, skip it

**Rules:**
- Do NOT flag completed work (check Done section)
- Do NOT flag gaps that are already covered by an existing BACKLOG task
- Do NOT create wish-list items ("it would be nice if...")
- Only flag things that a player would actually notice and care about

**Good gap example:**
> `[PLAYABILITY]` — After completing the first Galina conversation, no mission appears in HUD. Player has no direction.

**Bad gap example:**
> `[POLISH]` — The game could have better visual effects.

Aim for 5–12 meaningful gaps. If you find fewer, that is a good sign. Do not inflate.

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
