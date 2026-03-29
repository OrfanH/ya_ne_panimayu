# CLAUDE.md — project index

Read this file first every session. Then read only the scoped files your role requires.

## Scoped files

| File | Read when |
|---|---|
| CLAUDE-RULES.md | You write, edit, or review any code or CSS |
| CLAUDE-STACK.md | You make any technical or architectural decision |
| CLAUDE-VISION.md | You write content, dialogue, missions, or design UI |
| CLAUDE-AGENTS.md | You are the orchestrator or need to route a task |

## Token rules — mandatory for all agents

1. Read only the scoped files for your role. Never read all four by default.
2. Read source files by exact name only. Never glob-read directories.
3. `STORY.md`, `WORLD.md`, and `curriculum-map.md` are **index files** — never load them for content. Load the specific split file for your task's location (e.g. `STORY-location-2.md`, `WORLD-location-2.md`, `curriculum-location-2.md`).
4. Handoff files in .claude/handoffs/ are wiped after every task. Never read a handoff file from a previous task.
5. IMPROVEMENTS.md Done section is compressed to one line per task. Never expand done tasks. Read only Current task and Backlog sections.
6. Haiku agents receive a trimmed context. Do not request files beyond what you are given.
7. Only researcher runs on Opus. All other agents run on Sonnet or Haiku.
8. When adding a new file, agent, handoff, or track: run the **Token optimisation policy** checklist in CLAUDE-AGENTS.md first.

## Concurrency — mandatory for parallel sessions

**Do NOT use worktrees for /build.** Always run /build on the main branch directly.
If you are in a worktree, exit it first (`ExitWorktree` → remove) and run from the main repo.

**Task locking:** Before claiming a task, the orchestrator must check `.claude/task-lock.json`.
If the task is already locked by another session, skip it and pick the next unblocked task.
See orchestrator.md for the lock protocol.

**One session = one task at a time.** Never run two /build sessions simultaneously on the same task.
If you want to parallelize, each session must claim a *different* task.

## Project status

Scaffold: DONE (2026-03-28)
Next task: see IMPROVEMENTS.md -> Current task
