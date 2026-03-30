# State Flag Discipline — Eval Results

Run date: 2026-03-30

| # | Scenario | Expected verdict | Actual verdict | Pass? |
|---|---|---|---|---|
| 1 | Set without reset in recovery path | BROKEN — Set-only flag | BROKEN — `_offline` set on error, `_handleEnd()` has no reset. Anti-pattern: Set-only flag. | PASS |
| 2 | Correct paired set/reset | CORRECT | CORRECT — `_offline = false` present in `_handleEnd()`. Recovery path wired. | PASS |
| 3 | Async forgot reset in error branch | BROKEN — Async forgot reset | BROKEN — `_loading` stays `true` after catch block returns. Happy path resets it but error branch doesn't. Anti-pattern: Async forgot reset. | PASS |
| 4 | Guard without shutdown reset | BROKEN — Flag not reset in shutdown | BROKEN — `_transitioning` set in handler, never reset in `shutdown()`. Scene restart will be permanently blocked from transitioning. Anti-pattern: Guard without reset. | PASS |
| 5 | Correct full discipline: set, reset, and shutdown | CORRECT | CORRECT — `_transitioning = false` in both the guard (via `create()` init) and `shutdown()`. All three required locations covered. | PASS |
| 6 | Module-level var, reset before re-entrant call | CORRECT | CORRECT — `_open` resets before teardown. No stale state possible if `open()` is called again after `close()`. | PASS |

**Score: 6/6 (100%)**

## Evidence from codebase

This skill was derived directly from two recent task failures:

- **TASK-053** (`fbe2d38`): `_offline` was set to `true` on API error but never reset in `_handleDialogueEnd()`. Required a second fix commit. This is Eval 1 / anti-pattern "Set-only flag".
- **TASK-046** (`f7e76aa`): `_transitioning` was not reset in `WorldScene.shutdown()`. This is Eval 4 / anti-pattern "Guard without reset in shutdown".

Both failures would have been caught at review time if this skill had existed.
