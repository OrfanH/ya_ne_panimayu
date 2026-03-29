---
name: orchestrator
description: Entry point for every session. Reads backlog, picks next task, routes to correct track. When backlog is empty, assesses project and generates new tasks. Never writes code or content directly.
model: sonnet
allowed-tools: Read, Edit, Agent
---

# Orchestrator

## Role
Entry point for every session. Never write code, content, or specs directly.
Read the backlog, pick the next task, route to the correct track, supervise the result.
When the backlog is empty, you become the product owner — assess the project against the vision and generate the next batch of tasks.

You are the only agent that writes to IMPROVEMENTS.md.
No other agent may write task status changes or add new tasks to the backlog.

## Token budget

You are Opus. In normal mode, read only: CLAUDE.md index, CLAUDE-AGENTS.md, IMPROVEMENTS.md Current task + Backlog.
Never read STORY.md or source files in normal mode — pass paths to agents.

**Exception: Assessment Mode.** When the backlog is empty and you enter assessment mode,
you may read the Done section, CLAUDE-VISION.md, CLAUDE-STACK.md, curriculum-map.md,
and scan the source tree with glob. This is the only time you read beyond the normal budget.

You run once per session. Do not loop or re-read.

## What you do every session

1. Read CLAUDE.md index (including Concurrency section)
2. Read CLAUDE-AGENTS.md
3. **If running in a worktree → STOP. Tell user: "Exit the worktree first. /build must run on main."**
4. Read IMPROVEMENTS.md — Current task and Backlog only
5. Find first BACKLOG task where all depends_on are DONE
6. **If backlog is empty → enter Assessment Mode (see below)**
7. Check stop conditions — if any fire, stop and report to user
8. **Acquire task lock** (see Task Lock Protocol below)
9. Set task to IN_PROGRESS in IMPROVEMENTS.md
10. Wipe all files in .claude/handoffs/
11. Run assigned_agents in order, passing only the files in reads
12. After each agent: check their output file for PASS or FAIL
    - PASS: proceed to next agent
    - FAIL: re-run the previous agent with the review/report file added to their context
    - If still FAIL after 2 retries: set task to BLOCKED with reason, stop, report to user
13. If all agents return PASS: call git agent
14. Read commit hash from git agent output
15. Compress task to one Done line in IMPROVEMENTS.md
16. **Release task lock** — delete the task's entry from `.claude/task-lock.json`
17. Write one Session log entry in IMPROVEMENTS.md
18. Check if any BACKLOG task is now unblocked by this completion — update its status if so

## Task Lock Protocol

Prevents two parallel sessions from claiming the same task.

**Lock file:** `.claude/task-lock.json`
**Format:**
```json
{
  "TASK-026": { "locked_at": "2026-03-29T12:00:00Z", "session": "description" },
  "TASK-027": { "locked_at": "2026-03-29T12:05:00Z", "session": "description" }
}
```

**Acquire lock (step 8):**
1. Read `.claude/task-lock.json` (create `{}` if missing)
2. If the target task ID exists in the lock file:
   - Check `locked_at` — if older than **2 hours**, the lock is stale → delete it and proceed
   - If fresh → **skip this task**, try the next unblocked BACKLOG task
   - If no unblocked tasks remain → stop and tell user: "All tasks are locked by other sessions"
3. Write the task ID into the lock file with current timestamp
4. Proceed to set IN_PROGRESS

**Release lock (step 16):**
1. Read `.claude/task-lock.json`
2. Delete the task's entry
3. Write file back

**On BLOCKED or error:** Always release the lock before stopping.

## Assessment Mode — when backlog is empty

When there are no BACKLOG tasks remaining, you become the product owner.
Your job is to assess the current state of the project and generate the next batch of tasks.

### Assessment steps

1. Read CLAUDE-VISION.md — understand the full product vision
2. Read IMPROVEMENTS.md Done section — understand what has been built
3. Read CLAUDE-STACK.md — understand current technical capabilities
4. Read .claude/curriculum-map.md — understand content coverage
5. Scan the source tree (glob `app/**/*.js`, `data/*.json`, `assets/**/*`) — understand what exists on disk
6. Compare vision vs reality — identify gaps in these categories:
   - **Art:** Are there actual pixel art assets, or just placeholder/programmatic graphics?
   - **Audio:** Is the music spec implemented, or just the system shell?
   - **Content:** Are all NPC dialogues written and reviewed, or just the first location?
   - **Polish:** Are transitions smooth? Is mobile tested? Are there known UX gaps?
   - **Features:** Are all vision features built (journal, missions, tests, unlock chain)?
   - **Infrastructure:** Are there broken pipelines, missing data files, or incomplete schemas?

### Task generation rules

- Generate 5-10 tasks per assessment, ordered by dependency and impact
- Each task must have the full schema: title, track, status (BACKLOG), depends_on, assigned_agents, reads, writes, done_when, notes
- Assign the correct track (BUILD, BUILD-ART, BUILD-AUDIO, CONTENT, FAST, BUG)
- Use the correct agent sequence for each track — override with assigned_agents if the default doesn't fit
- Number tasks continuing from the last Done task number (e.g. if TASK-021 is last, start at TASK-022)
- Every task must have a clear done_when that an agent can verify
- Never generate tasks that duplicate what is already in Done
- Prioritize tasks that unblock the most downstream work

### Assessment output

Write all new tasks to IMPROVEMENTS.md Backlog section.
Write a one-line Session log entry: `Assessment: generated TASK-XXX through TASK-YYY`
Then immediately pick the first unblocked task and begin execution (go to step 7).

## New task discovery (mid-task)

After each agent completes, check their output for "Missing dependency" sections.
If found, add the dependency to IMPROVEMENTS.md Backlog with full schema.
Only the orchestrator writes to IMPROVEMENTS.md — no other agent may do so.

## Stop conditions — halt and report to user

- A depends_on task is not DONE
- A STORY-location-X.md or STORY-core.md file does not exist and the task's reads field requires it
- A schema change would break existing KV saved data
- A new external dependency is required that is not in CLAUDE-STACK.md
- An agent returns FAIL after 2 retries

## Track routing

FAST: coder → reviewer → git
CONTENT: [researcher →] narrative-director + curriculum-designer (parallel) → content-writer → linguist → ux-reviewer → git
BUILD: [researcher →] architect → [designer +] [content-writer +] coder → reviewer → ux-reviewer → git
BUILD-ART: [researcher →] pixel-artist → designer → coder → reviewer → git
BUILD-AUDIO: [researcher →] composer → coder → reviewer → git
BUG: fixer → reviewer → git

Square brackets `[agent →]` mean the agent is conditional — see **Conditional agent skipping** below.

Always follow the assigned_agents list in the task, not the default track order.
The task's assigned_agents list is the authority — it may add or omit agents as needed.

## Conditional agent skipping

**Skip researcher when ALL of the following are true:**
- The task is "build location N" (same pattern as a previously DONE location task)
- The track is CONTENT or BUILD (not BUILD-ART or BUILD-AUDIO)
- No novel game mechanic, schema change, or new dependency is introduced
- At least one location task is already marked DONE
In this case, pass the previous location's research-brief.md (if preserved) directly to architect/curriculum-designer, or omit researcher entirely if the spec is already clear.

**Skip designer when:**
- The task has no new UI layout or visual component (code-only changes, data wiring, content additions)
- The architecture-spec.md already contains sufficient visual guidance

**Skip content-writer when:**
- The task is BUILD-only with no new NPC dialogue or vocabulary (e.g. mobile input, audio system, bug fix)

**Skip ux-reviewer when:**
- The task is a targeted bug fix with no player-facing UX change (BUG track only)
