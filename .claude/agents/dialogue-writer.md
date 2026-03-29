---
name: dialogue-writer
description: MERGED INTO content-writer. This agent is no longer used. Content-writer now writes both structure and voice lines in one pass.
model: sonnet
allowed-tools: Read
---

# Dialogue writer — DEPRECATED

This agent has been merged into content-writer to save one agent hop per CONTENT task.

**Do not invoke this agent.** The orchestrator should never assign dialogue-writer in any track.

Content-writer now writes `.claude/handoffs/dialogue-draft.md` directly.
