# State Flag Discipline — Evals

Each eval presents a code snippet. The agent must identify: (a) whether the flag discipline is correct or broken, and (b) which specific anti-pattern applies if broken.

---

## Eval 1 — Set without reset in recovery path

```js
let _offline = false;

function _callApi(prompt) {
  return fetch('/api', { body: prompt })
    .catch(() => { _offline = true; return _getFallback(); });
}

function _handleEnd() {
  // clean up UI
  _isOpen = false;
}
```

**Expected:** BROKEN — `_offline` is set on error but never reset in `_handleEnd()` or any recovery path. Anti-pattern: Set-only flag.

---

## Eval 2 — Correct paired set/reset

```js
let _offline = false;

function _callApi(prompt) {
  return fetch('/api', { body: prompt })
    .catch(() => { _offline = true; return _getFallback(); });
}

function _handleEnd() {
  _offline = false;
  _isOpen = false;
}
```

**Expected:** CORRECT — `_offline` is reset in the end/recovery handler. Each new interaction will retry the real API.

---

## Eval 3 — Async forgot reset in error branch

```js
let _loading = false;

async function loadData() {
  _loading = true;
  try {
    const data = await fetchRemote();
    _loading = false;
    return data;
  } catch (e) {
    console.warn(e);
    // _loading never reset here
  }
}
```

**Expected:** BROKEN — error branch returns without resetting `_loading`. Module permanently stuck in loading state after first failure. Anti-pattern: Async forgot reset.

---

## Eval 4 — Guard without shutdown reset

```js
class WorldScene extends Phaser.Scene {
  create() {
    this._transitioning = false;
    this._onZoneEnter = (e) => {
      if (this._transitioning) return;
      this._transitioning = true;
      this.scene.start(e.detail.target);
    };
    window.addEventListener(EVENTS.ZONE_ENTER, this._onZoneEnter);
  }

  shutdown() {
    window.removeEventListener(EVENTS.ZONE_ENTER, this._onZoneEnter);
    // _transitioning not reset
  }
}
```

**Expected:** BROKEN — `_transitioning` not reset in `shutdown()`. If a transition is interrupted mid-flight and the scene is restarted, `_transitioning` will be `true` on entry and all zone transitions will be blocked. Anti-pattern: Guard without reset / Flag not reset in shutdown.

---

## Eval 5 — Correct full discipline: set, reset, and shutdown

```js
class WorldScene extends Phaser.Scene {
  create() {
    this._transitioning = false;
    this._onZoneEnter = (e) => {
      if (this._transitioning) return;
      this._transitioning = true;
      this.scene.start(e.detail.target);
    };
    window.addEventListener(EVENTS.ZONE_ENTER, this._onZoneEnter);
  }

  shutdown() {
    this._transitioning = false;
    window.removeEventListener(EVENTS.ZONE_ENTER, this._onZoneEnter);
  }
}
```

**Expected:** CORRECT — flag is guarded on entry, set on transition start, and reset in `shutdown()` so restarts begin clean.

---

## Eval 6 — Module-level var, reset before re-entrant call

```js
let _open = false;

function open() {
  if (_open) return;
  _open = true;
  _renderUI();
}

function close() {
  _open = false;
  _teardownUI();
}
```

**Expected:** CORRECT — `_open` is reset before `_teardownUI()` in the close path. No re-entrancy issue because the reset happens first.
