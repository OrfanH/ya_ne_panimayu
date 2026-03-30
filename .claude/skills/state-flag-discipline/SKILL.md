---
name: state-flag-discipline
description: auto-invoke when writing or reviewing any JS module that sets a boolean flag on error, failure, or async state change — enforces paired set/reset discipline
---

# State Flag Discipline

## When to apply
- Writing or reviewing any JS file in `app/` that declares a boolean flag (e.g. `_offline`, `_transitioning`, `_loading`, `_open`)
- Any code path that sets a flag to `true` on failure, entry, or error
- Any code path that represents recovery, exit, or success from the above

## The rule: every flag set has a paired reset

Whenever a boolean state flag is set to `true` in one code path, there MUST be a corresponding reset to `false` in the recovery/exit path. Missing the reset causes the module to stay permanently in the degraded state after the first failure.

### Three required locations to check

1. **Set site** — where the flag is set `true` (e.g. on API error, on scene enter)
2. **Reset site** — where the flag returns to `false` (e.g. on recovery, on scene exit, on success)
3. **Shutdown/destroy site** — where the flag is reset as part of cleanup so the next instantiation starts clean

If any of the three is missing, the code is incomplete.

## Examples

### Good: paired set and reset in tutor.js
```js
// Set on API failure (line ~259)
_offline = true;

// Reset on successful dialogue end / recovery (line ~350)
_handleDialogueEnd() {
  _offline = false;   // ← MUST be here so next interaction retries AI
  // ...
}
```

### Good: transition guard with shutdown reset
```js
// Set on transition start
_transitioning = true;

// Reset in shutdown() so re-entry starts clean
shutdown() {
  _transitioning = false;
  // ...
}
```

### Bad: set without reset
```js
// Error handler
_offline = true;

// _handleDialogueEnd() — _offline never reset
// Result: AI permanently disabled after first failure; scripted fallback used forever
_handleDialogueEnd() {
  // no reset here — BUG
}
```

### Bad: flag not reset in shutdown
```js
shutdown() {
  window.removeEventListener(EVENTS.ZONE_ENTER, this._onZoneEnter);
  // _transitioning not reset — next scene start inherits stale true value
}
```

## Reviewer checklist

When reviewing any JS file with a boolean flag:

- [ ] Find every `flagName = true` assignment
- [ ] Confirm a `flagName = false` exists in the success/recovery/exit path
- [ ] Confirm `flagName = false` exists in `shutdown()` or `destroy()` if the flag is instance-level
- [ ] If flag is module-level (closure var), confirm reset happens before any re-entrant call

## Anti-patterns

1. **Set-only flag** — `_offline = true` on error, never reset. Module permanently degraded after first failure.
2. **Reset in wrong place** — flag reset in `create()` instead of `shutdown()`. Next `start()` resets it too late; stale state bleeds into `preload()`.
3. **Guard without reset** — `if (_transitioning) return;` guard exists but `_transitioning` never set back to `false`. All future transitions silently blocked.
4. **Async forgot reset** — async function sets flag before `await`, but only resets in the happy path. Error branch returns early without resetting.
