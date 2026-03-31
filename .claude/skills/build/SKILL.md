---
name: build
description: /build — session entry point. Reads IMPROVEMENTS.md, picks the next ready task, runs the correct agent pipeline, commits when done.
---

# /build — Orchestrated Build Session

You are the orchestrator for Один Семестр. When the user types `/build`, execute this skill exactly. Never skip steps. Never write code or content directly — delegate everything to agents via the Agent tool.

---

## Step 1 — Load state

Read these files in parallel:
- `IMPROVEMENTS.md` — read Current task, Backlog, **and** Done sections. Done entries are one compressed line each — read them only to extract task IDs for dependency checking. Do not expand or act on their details.
- `CLAUDE-AGENTS.md`

---

## Step 2 — Pick the task

Find the first task in Backlog where:
- `status: BACKLOG`
- All tasks in `depends_on` are listed in the ## Done section of IMPROVEMENTS.md

If no task qualifies → stop and tell the user which tasks are blocked and what they depend on.

If a task is already `IN_PROGRESS` → resume it from the last completed agent step (check which handoff files already exist in `.claude/handoffs/`).

---

## Step 3 — Pre-flight checks

Before running any agents, verify:

1. If the task's `reads` field includes any `STORY-*.md` file → confirm that file exists. If not → stop: `BLOCKED: [file] does not exist. Run TASK-002 first.`
2. If the task's `reads` field includes any `WORLD-*.md` file → confirm that file exists. If not → stop with same message.
   Note: `STORY.md` and `WORLD.md` are index files and always exist — check for the specific split files instead.
3. Confirm all file paths in `reads` exist. List any missing files and stop.
4. Check for schema-breaking changes — if task modifies storage schemas in `app/storage.js` or `app/config.js`, warn the user before proceeding.

---

## Step 4 — Set task IN_PROGRESS

Edit `IMPROVEMENTS.md`: change the task's `status` from `BACKLOG` to `IN_PROGRESS`.

Wipe `.claude/handoffs/` — delete every file except `.gitkeep`. Do NOT touch files in `.claude/` root — `curriculum-map.md`, `curriculum-location-*.md`, `curriculum-map-core.md`, `music-spec.md`, and `pixel-art-spec.md` are persistent across tasks and must survive.

Tell the user: `Starting [TASK-XXX]: [title] via [track] track.`

---

## Step 5 — Run the agent pipeline

Use the task's `assigned_agents` list as the authority — not the default track order.

For each agent, use the Agent tool with `subagent_type: "general-purpose"` and build the prompt from the agent's role file at `.claude/agents/{agent-name}.md` plus the specific task context.

### Agent prompt pattern

```
[Paste full contents of .claude/agents/{agent-name}.md]

---

## Current task context

Task ID: {TASK-ID}
Title: {title}
Track: {track}

Reads: {reads list}
Writes: {writes list}
Done when: {done_when}

Notes: {notes if any}

Handoff files available: {list any .claude/handoffs/ files that exist}

Files written by earlier agents this task: {list any files from the task's writes field that now exist on disk — these are available for you to read even if not in the reads list}
```

> **Why the last field matters:** Agents earlier in the pipeline may have created files (e.g. STORY-core.md, WORLD-location-1.md) that a later agent needs but that weren't in the original `reads` list because they didn't exist when the task was written. Always check this field before assuming a file doesn't exist.

### Pipeline rules

**After each agent completes:**
1. Check the agent's output file for `PASS` or `FAIL` on line 1.
2. `PASS` → proceed to next agent.
3. `FAIL` → before retrying, check if the failure matches a pattern seen in previous tasks or earlier in this pipeline. If it does:
   - Run `/improve` targeting the failing agent's skill gap (create or update a skill to prevent this class of failure).
   - Append the new/updated skill to the retry context so the agent benefits immediately.
4. Retry the agent with the failure report (and any new skill) appended. Max 2 retries per agent.
5. Still `FAIL` after 2 retries → set task to `BLOCKED` in IMPROVEMENTS.md with the failure reason. Stop and report to user.

**Parallel execution:** If the task's assigned_agents list includes agents that can run in parallel (designer + content-writer in BUILD track), launch them as parallel Agent calls in a single message.

**Model assignment — mandatory:** When calling the Agent tool, always pass the `model` parameter matching the agent's definition:

| Agent | model param |
|---|---|
| researcher | `opus` |
| orchestrator, architect, designer, composer, coder, fixer, narrative-director, curriculum-designer, content-writer, linguist, pixel-artist | `sonnet` |
| reviewer, ux-reviewer, tester, git | `haiku` |

---

## Step 6 — Track-specific pipeline (fallback only)

The task's `assigned_agents` list is always the authority. Use these defaults **only if `assigned_agents` is missing or empty**:

- **FAST:** `coder → reviewer → git`
- **CONTENT:** `researcher → content-writer → linguist (if Russian produced) → ux-reviewer → git`
- **BUILD:** `architect → designer + content-writer (parallel) → coder → reviewer → tester → ux-reviewer → git`
- **BUG:** `fixer → reviewer → git`

---

## Step 7 — After git commits

1. Read the commit hash from the git agent's output.
2. In `IMPROVEMENTS.md`:
   - Move the task from Backlog to Done (one compressed line: `- TASK-XXX | DONE | {date} | {title} | {commit hash}`)
   - Append one Session log entry under `## Session log`
3. Check if any other Backlog tasks now have all their `depends_on` satisfied — update their status note if useful.
4. Tell the user: `TASK-XXX complete. Committed {hash}. Next ready task: {TASK-YYY or "none — all tasks blocked"}.`

### Verify-before-expand checkpoint

After completing a task that adds or modifies gameplay-affecting code (scenes, entities, systems, dialogue, missions, tests), verify:
- The game still boots without errors (playtester smoke test)
- The changed system integrates with the rest of the game (not just individually functional)
- No existing gameplay path is broken by the change

If the playtester agent is in the pipeline and returned PASS, this is satisfied. If playtester is NOT in the pipeline (e.g., CONTENT-only tasks), add a brief integration note to the session log: what was changed and why it doesn't need gameplay verification.

**Rule: never generate new feature tasks in assessment mode if the last completed task introduced a gameplay regression that was not caught.** Fix first, expand second.

---

## Step 8 — Trigger skill improvement (if due)

Check the Done section of IMPROVEMENTS.md. Count completed BUILD tasks since the last `/improve` run (check `.claude/skills/improvement-log.md` for the last entry date).

If 3 or more tasks (any track) have completed since the last improvement run:
1. Tell the user: `3+ tasks completed since last improvement check. Running /improve.`
2. Invoke the `/improve` skill with **two mandatory passes**:
   - **Quality pass** (Step 1B): review handoff outputs from the last 3 tasks, identify failure patterns, create or update skills, run evals to 100%
   - **Token drift audit** (Step 1D): check handoff sizes, index-file drift, new large files, deprecated references — fix any issues found

If fewer than 3 tasks → skip this step.

---

## Step 9 — Offer next action

After completing a task, ask:
```
Task complete. Run /build again to start [next task title], or stop here.
```

---

## Hard stops — always halt and report to user

- A required `STORY-*.md` or `WORLD-*.md` split file is missing
- A `depends_on` task is not DONE
- A new external dependency would be needed that is not in `CLAUDE-STACK.md`
- An agent returns FAIL after 2 retries
- A git push fails
- Any agent tries to write to a path not in the task's `writes` field

---

## File path rules — enforce on every agent

All source paths use `app/` not `src/`. Correct any agent that writes to wrong paths:

| Wrong | Correct |
|---|---|
| `src/scenes/` | `app/game/scenes/` |
| `src/entities/` | `app/game/entities/` |
| `src/systems/` | `app/game/systems/` |
| `src/ui/` | `app/ui/` |
| `src/services/` | `app/game/systems/` or `app/` |
| `src/content/` | `app/game/content/` |

If a task's `writes` field contains `src/` paths, correct them before passing to agents and note the correction.

---

## Tasks with no git agent

Some tasks (e.g. TASK-013 sign-off) have no `git` in `assigned_agents`. In this case:
- Do not attempt to commit anything
- Mark the task DONE in IMPROVEMENTS.md after the final assigned agent returns PASS
- Write one Session log entry noting "sign-off only — no commit"

## What you never do

- Write code, CSS, HTML, or dialogue directly
- Skip reviewer or ux-reviewer when they ARE in the task's assigned_agents
- Commit without reviewer PASS when reviewer is assigned; same for ux-reviewer
- Block a commit because reviewer/ux-reviewer didn't run when they are NOT assigned
- Omit the `model` parameter when spawning agents via the Agent tool
- Read `## Done` for anything beyond extracting task IDs for dependency checking
- Run more than one full `/build` session per invocation — one task per `/build`
