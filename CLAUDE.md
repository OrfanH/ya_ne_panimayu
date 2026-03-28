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
3. When reading STORY.md or WORLD.md, grep for the relevant section only. Never load the full file unless you are narrative-director writing it for the first time.
4. Handoff files in .claude/handoffs/ are wiped after every task. Never read a handoff file from a previous task.
5. IMPROVEMENTS.md Done section is compressed to one line per task. Never expand done tasks. Read only Current task and Backlog sections.
6. Haiku agents receive a trimmed context. Do not request files beyond what you are given.
7. Opus agents run once per task at most. Do not re-read files already in context.

## Project status

Scaffold: DONE (2026-03-28)
Next task: see IMPROVEMENTS.md -> Current task
