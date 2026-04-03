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

---

## Eval 7 — Timer stored as local var, not cancelled in shutdown [added 2026-04-02]

```js
class WorldScene extends Phaser.Scene {
  _showControlsHint() {
    const showTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('hud:toast', { detail: { message: 'WASD to move' } }));
    }, 400);

    this.input.keyboard.once('keydown', () => {
      clearTimeout(showTimer);
    });
  }

  shutdown() {
    window.removeEventListener(EVENTS.INTRO_DONE, this._onIntroDone);
  }
}
```

**Expected:** BROKEN — `showTimer` is a local variable inaccessible from `shutdown()`. If the player enters a building before 400ms, `shutdown()` cannot cancel the timer. The timer fires into the next scene, polluting its HUD toast. Anti-pattern: Local timer var (BUG-025 pattern).

---

## Eval 8 — Timer promoted to instance property, cancelled in shutdown [added 2026-04-02]

```js
class WorldScene extends Phaser.Scene {
  _showControlsHint() {
    this._controlsHintTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('hud:toast', { detail: { message: 'WASD to move' } }));
      this._controlsHintTimer = null;
    }, 400);

    this.input.keyboard.once('keydown', () => {
      clearTimeout(this._controlsHintTimer);
      this._controlsHintTimer = null;
    });
  }

  shutdown() {
    clearTimeout(this._controlsHintTimer);
    this._controlsHintTimer = null;
    window.removeEventListener(EVENTS.INTRO_DONE, this._onIntroDone);
  }
}
```

**Expected:** CORRECT — timer stored on `this`, cleared in callback after firing, cleared on early dismiss, and cancelled in `shutdown()`. No leak into next scene.
