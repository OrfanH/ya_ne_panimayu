# Skill Improvement Log

Track all skill creation and modification events here.

---

## 2026-03-28 — improve
- **Action:** created
- **Triggered by:** user
- **Reason:** enable all agents to create, modify, and eval skills for continuous workflow improvement
- **Eval score:** N/A (meta-skill)
- **Agents affected:** all

## 2026-03-28 — phaser-patterns
- **Action:** created
- **Triggered by:** user (first /improve run)
- **Reason:** analysis of TASK-003 to TASK-007 revealed 6 recurring violations: missing shutdown/destroy, string literal events, hardcoded texture keys, double physics.resume
- **Eval score:** 6/6 (100%)
- **Agents affected:** architect, coder, reviewer

## 2026-03-30 — token-drift-audit
- **Action:** audit (no new skill)
- **Triggered by:** user (/improve)
- **Reason:** routine token drift audit after 3 completed tasks (TASK-048, BUG-003, TASK-052)
- **Findings:**
  - Handoff sizes: 1 file checked (play-report.md ~27 lines), within 200-word limit — CLEAN
  - Index-file drift: 1 issue fixed — `composer.md:48` header "expand from STORY.md" contradicted token rule on line 18; renamed to "Location mood brief"
  - New large files: 0 new .md files in last 3 commits — CLEAN
  - Deprecated refs: root CLAUDE-*.md and .claude/agents/ CLEAN; worktree copies have stale dialogue-writer refs but are isolated branch snapshots (not load-bearing)
- **Agents affected:** composer

## 2026-03-30 — state-flag-discipline
- **Action:** created
- **Triggered by:** /improve pass 1 (TASK-055, TASK-053, TASK-054 review)
- **Reason:** TASK-053 required a second fix commit because `_offline` was set on error but never reset on recovery. TASK-046 fixed `_transitioning` not reset in `shutdown()`. Both are the same pattern: boolean flag set in one path, missing paired reset in exit/recovery/shutdown path. Pattern appeared in 2 of the last 3 task cycles.
- **Eval score:** 6/6 (100%)
- **Agents affected:** coder, fixer, reviewer
