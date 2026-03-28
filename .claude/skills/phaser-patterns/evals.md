# Evals for phaser-patterns

## Eval 1: WorldScene missing shutdown — Rule 1 violation
**Input:** `app/game/scenes/WorldScene.js` registers `this.game.events.on(EVENTS.ZONE_ENTER, ...)` in `create()`.
**Expected:** Skill flags that WorldScene has no `shutdown()` method to remove the ZONE_ENTER listener.
**Checks:** Grep WorldScene.js for `shutdown()` — should not exist. Rule 1 requires it. FAIL = violation detected.

## Eval 2: Player missing destroy — Rule 6 violation
**Input:** `app/game/entities/Player.js` calls `window.addEventListener('joystick:move', ...)` and `window.addEventListener('joystick:stop', ...)` in constructor.
**Expected:** Skill flags that Player has no `destroy()` method to remove these listeners.
**Checks:** Grep Player.js for `destroy()` — should not exist. Grep for `removeEventListener` — should not exist. Rule 6 requires both.

## Eval 3: Joystick events not in EVENTS constant — Rule 12 violation
**Input:** `app/ui/VirtualJoystick.js` dispatches `'joystick:move'` and `'joystick:stop'` as raw strings. `app/game/entities/Player.js` listens for `'joystick:move'` and `'joystick:stop'` as raw strings.
**Expected:** Skill flags both files — event names must come from `EVENTS` constant in config.js. `JOYSTICK_MOVE` and `JOYSTICK_STOP` are missing from the EVENTS object.
**Checks:** Grep config.js EVENTS block for `JOYSTICK` — should not exist (violation). Grep Player.js for `'joystick:` string literal — should exist (violation). Rule 12 requires all event names in EVENTS.

## Eval 4: NPC texture key not configurable — Rule 7 violation
**Input:** `app/game/entities/NPC.js` uses `const KEY = 'npc-default'` hardcoded.
**Expected:** Skill flags that texture key should be derived from config object, not hardcoded.
**Checks:** Grep NPC.js for `'npc-default'` as a constant — should exist (violation). Rule 7 requires `config.textureKey || 'npc-default'`.

## Eval 5: ApartmentScene has proper shutdown — Rule 1 PASS
**Input:** `app/game/scenes/ApartmentScene.js` has both `window.addEventListener(EVENTS.DIALOGUE_END, ...)` in create and `window.removeEventListener(EVENTS.DIALOGUE_END, ...)` in `shutdown()`.
**Expected:** Skill confirms this is correct — ApartmentScene follows Rule 1 properly.
**Checks:** Grep ApartmentScene.js for `shutdown()` — should exist. Grep for `removeEventListener` — should exist. Rule 1 satisfied.

## Eval 6: Anti-pattern — double physics.resume — Rule 14 violation
**Input:** `app/ui/dialogue.js` has a `_onDialogueClose` that iterates `game.scene.scenes` and calls `physics.resume()` on all. `app/game/scenes/ApartmentScene.js` also resumes physics via its own DIALOGUE_END listener.
**Expected:** Skill flags the double-resume as Rule 14 violation. Physics should be resumed from exactly one place.
**Checks:** Grep dialogue.js for `physics.resume` — should exist. Grep ApartmentScene.js for `physics.resume` — should exist. Both existing = Rule 14 violation.
