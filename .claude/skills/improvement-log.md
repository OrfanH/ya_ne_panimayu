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

## 2026-04-02 — token-drift-audit (2)
- **Action:** audit (no new skill)
- **Triggered by:** orchestrator (4 tasks since last improve: TASK-079–082)
- **Findings:**
  - Handoff sizes: 2 files (fix-report ~200w, review-report ~100w) — CLEAN
  - Index-file drift: 0 new violations — CLEAN
  - New large files: 0 new .md files in last 4 commits — CLEAN
  - Deprecated refs: no new stale references — CLEAN
  - Pattern analysis: TASK-079/080/081/082 all identical scripted-dialogue scaffold, all reviewer PASS first attempt — no skill gap to address
- **Action taken:** none needed

## 2026-04-02 — state-flag-discipline
- **Action:** updated
- **Triggered by:** orchestrator (post-BUG-025, 3+ tasks since last run)
- **Reason:** BUG-025 was a setTimeout handle stored as local var, inaccessible to shutdown() — same "set-without-cleanup" class as boolean flag anti-patterns. Extended skill to cover timer/interval handles: instance-property promotion, cancel-in-callback, cancel-in-shutdown.
- **Eval score:** 8/8 (100%)
- **Agents affected:** coder, fixer, reviewer

## 2026-04-02 — token-drift-audit
- **Action:** audit (no new skill)
- **Triggered by:** orchestrator (/improve after BUG-025)
- **Findings:**
  - Handoff sizes: 2 files checked (fix-report.md ~200w, review-report.md ~50w) — CLEAN
  - Index-file drift: 0 agents instructed to read index files for content — CLEAN
  - New large files: 0 new .md files in last 3 commits — CLEAN
  - Deprecated refs: dialogue-writer refs in content-writer.md:12 (contextual note, not routing instruction) and improve/SKILL.md (audit check itself) — NOT STALE, CLEAN
  - Worktrees in .claude/worktrees/: 4 isolated snapshots, non-load-bearing (confirmed in prior audit)
- **Action taken:** none needed

## 2026-03-30 — state-flag-discipline
- **Action:** created
- **Triggered by:** /improve pass 1 (TASK-055, TASK-053, TASK-054 review)
- **Reason:** TASK-053 required a second fix commit because `_offline` was set on error but never reset on recovery. TASK-046 fixed `_transitioning` not reset in `shutdown()`. Both are the same pattern: boolean flag set in one path, missing paired reset in exit/recovery/shutdown path. Pattern appeared in 2 of the last 3 task cycles.
- **Eval score:** 6/6 (100%)
- **Agents affected:** coder, fixer, reviewer
