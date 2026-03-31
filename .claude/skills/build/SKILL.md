---
name: build
description: /build — session entry point. Reads IMPROVEMENTS.md, picks the next ready task, runs the correct agent pipeline, commits when done.
---

# /build — Orchestrated Build Session

You are the orchestrator for Один Семестр. When the user types `/build`, execute this skill exactly. Never skip steps. Never write code or content directly — delegate everything to agents via the Agent tool.

---

## Arguments

`/build` accepts optional arguments that override task selection:

| Argument | Meaning |
|---|---|
| `/build recover` | Force recovery mode — only fix and stabilize work |
| `/build playability` | Force recovery mode — same as recover |
| `/build stabilize` | Force recovery mode — same as recover |
| `/build [no arg]` | Normal mode — uses priority rules below |

Store the argument as `USER_MODE` (values: `RECOVERY` or `NORMAL`).

---

## Step 1 — Load state

Read these files in parallel:
- `IMPROVEMENTS.md` — read Current task, Backlog, Recovery, **and** Done sections. Done entries are one compressed line each — read them only to extract task IDs for dependency checking. Do not expand or act on their details.
- `CLAUDE-AGENTS.md`

---

## Step 2 — Determine mode

After loading state, determine whether this session runs in **RECOVERY MODE** or **NORMAL MODE**.

### Recovery mode is active when ANY of the following is true:

1. `USER_MODE = RECOVERY` (user passed `recover`, `playability`, or `stabilize`)
2. The `## Recovery` section of IMPROVEMENTS.md contains at least one task with `status: BACKLOG` or `status: IN_PROGRESS`
3. One or more P0 BUG tasks exist in Backlog with `status: BACKLOG` or `status: IN_PROGRESS` (a P0 BUG is any task tagged `**priority:** P0` and `**track:** BUG`)

If none of the above → **NORMAL MODE**.

Tell the user which mode is active before proceeding: `Mode: RECOVERY` or `Mode: NORMAL`.

---

## Step 3 — Pick the task

Task selection depends on the current mode.

### RECOVERY MODE — task selection order

Select the **first** task that qualifies, in this exact priority order:

1. Any task in `## Recovery` section with `status: IN_PROGRESS` (resume first)
2. Any task in `## Recovery` section with `status: BACKLOG` and all `depends_on` DONE
3. Any P0 BUG task with `status: IN_PROGRESS`
4. Any P0 BUG task with `status: BACKLOG` and all `depends_on` DONE
5. Any P1 BUG task with `status: IN_PROGRESS`
6. Any P1 BUG task with `status: BACKLOG` and all `depends_on` DONE

**If no task qualifies in recovery mode:**
→ Tell the user: `Recovery mode is active but no recovery or P0/P1 BUG tasks are ready. The backlog may need a RECOVERY task added, or playability may need manual verification. Run /build again after addressing this.`
→ **STOP. Do not fall through to BACKLOG tasks.**

**Feature work is completely blocked in recovery mode.** Do not select any task from the regular Backlog (P2, P2-ART, BUILD, CONTENT, etc.).

### NORMAL MODE — task selection order

Select the **first** task that qualifies, in this exact priority order:

1. Any `IN_PROGRESS` task in the Backlog with all `depends_on` DONE (resume first, highest IN_PROGRESS priority wins by section order: P0 > P1 > P1-ART > P1-ART-B > P2 > P2-ART)
2. Any P0 task in Backlog with `status: BACKLOG` and all `depends_on` DONE
3. Any P1 task in Backlog with `status: BACKLOG` and all `depends_on` DONE
4. Any P1-ART or P1-ART-B task with `status: BACKLOG` and all `depends_on` DONE
5. Any P2 or P2-ART task with `status: BACKLOG` and all `depends_on` DONE

If no task qualifies → stop and tell the user which tasks are blocked and what they depend on.

---

## Step 4 — Pre-flight checks

Before running any agents, verify:

1. If the task's `reads` field includes any `STORY-*.md` file → confirm that file exists. If not → stop: `BLOCKED: [file] does not exist. Run TASK-002 first.`
2. If the task's `reads` field includes any `WORLD-*.md` file → confirm that file exists. If not → stop with same message.
   Note: `STORY.md` and `WORLD.md` are index files and always exist — check for the specific split files instead.
3. Confirm all file paths in `reads` exist. List any missing files and stop.
4. Check for schema-breaking changes — if task modifies storage schemas in `app/storage.js` or `app/config.js`, warn the user before proceeding.

---

## Step 5 — Set task IN_PROGRESS

Edit `IMPROVEMENTS.md`: change the task's `status` from `BACKLOG` to `IN_PROGRESS`.

Wipe `.claude/handoffs/` — delete every file except `.gitkeep`. Do NOT touch files in `.claude/` root — `curriculum-map.md`, `curriculum-location-*.md`, `curriculum-map-core.md`, `music-spec.md`, and `pixel-art-spec.md` are persistent across tasks and must survive.

Tell the user: `Starting [TASK-XXX]: [title] via [track] track.`

---

## Step 6 — Run the agent pipeline

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

## Step 7 — Track-specific pipeline (fallback only)

The task's `assigned_agents` list is always the authority. Use these defaults **only if `assigned_agents` is missing or empty**:

- **FAST:** `coder → reviewer → playtester → git`
- **CONTENT:** `researcher → content-writer → linguist (if Russian produced) → ux-reviewer → git`
- **BUILD:** `architect → designer + content-writer (parallel) → coder → reviewer → tester → ux-reviewer → git`
- **BUG:** `fixer → reviewer → playtester → git`

---

## Step 8 — After git commits

1. Read the commit hash from the git agent's output.
2. In `IMPROVEMENTS.md`:
   - Move the task from its section to Done (one compressed line: `- TASK-XXX | DONE | {date} | {title} | {commit hash}`)
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

## Step 9 — Trigger skill improvement (if due)

Check the Done section of IMPROVEMENTS.md. Count completed tasks since the last `/improve` run (check `.claude/skills/improvement-log.md` for the last entry date).

If 3 or more tasks (any track) have completed since the last improvement run:
1. Tell the user: `3+ tasks completed since last improvement check. Running /improve.`
2. Invoke the `/improve` skill with **two mandatory passes**:
   - **Quality pass** (Step 1B): review handoff outputs from the last 3 tasks, identify failure patterns, create or update skills, run evals to 100%
   - **Token drift audit** (Step 1D): check handoff sizes, index-file drift, new large files, deprecated references — fix any issues found

If fewer than 3 tasks → skip this step.

---

## Step 10 — Offer next action

After completing a task, tell the user what mode and task comes next:

```
Task complete. Current mode: [RECOVERY/NORMAL]. Run /build again to start [next task title], or stop here.
```

If in RECOVERY MODE and no more recovery tasks remain after this commit, tell the user:
```
Recovery queue is now empty. Playability gate satisfied. Next /build will run in NORMAL MODE.
```

---

## Hard stops — always halt and report to user

- A required `STORY-*.md` or `WORLD-*.md` split file is missing
- A `depends_on` task is not DONE
- A new external dependency would be needed that is not in `CLAUDE-STACK.md`
- An agent returns FAIL after 2 retries
- A git push fails
- Any agent tries to write to a path not in the task's `writes` field
- Recovery mode is active and a feature task was somehow selected — STOP and report the selection error

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

---

## Recovery mode scope rules — never break these

When in recovery mode, the orchestrator must NOT:
- Select or run any BUILD, BUILD-ART, BUILD-AUDIO, BUILD-CONTENT, or CONTENT track tasks
- Generate new feature tasks in IMPROVEMENTS.md
- Expand scope beyond what is needed to restore playability
- Treat "recovery mode active" as a reason to stop — keep working through the recovery queue

---

## What you never do

- Write code, CSS, HTML, or dialogue directly
- Skip reviewer or ux-reviewer when they ARE in the task's assigned_agents
- Commit without reviewer PASS when reviewer is assigned; same for ux-reviewer
- Block a commit because reviewer/ux-reviewer didn't run when they are NOT assigned
- Omit the `model` parameter when spawning agents via the Agent tool
- Read `## Done` for anything beyond extracting task IDs for dependency checking
- Run more than one full `/build` session per invocation — one task per `/build`
- Select a feature task when recovery mode is active
