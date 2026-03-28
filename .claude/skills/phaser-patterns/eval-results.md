# Eval Results — phaser-patterns — 2026-03-28

| Eval | Result | Notes |
|---|---|---|
| Eval 1: WorldScene missing shutdown | PASS | Correctly detected: WorldScene.js has 0 matches for `shutdown()`. Rule 1 violation confirmed. |
| Eval 2: Player missing destroy | PASS | Correctly detected: Player.js has 0 matches for `destroy()` or `removeEventListener`. Rule 6 violation confirmed. |
| Eval 3: Joystick events not in EVENTS | PASS | Correctly detected: config.js EVENTS has no `JOYSTICK` entries. Player.js and VirtualJoystick.js use `'joystick:move'` and `'joystick:stop'` as raw strings. Rule 12 violation confirmed. |
| Eval 4: NPC texture key hardcoded | PASS | Correctly detected: NPC.js line 78 has `const KEY = 'npc-default'` hardcoded, not from config. Rule 7 violation confirmed. |
| Eval 5: ApartmentScene has proper shutdown | PASS | Correctly confirmed: ApartmentScene.js has `shutdown()` with `removeEventListener`. Rule 1 satisfied. |
| Eval 6: Double physics.resume | PASS | Correctly detected: dialogue.js:208 calls `physics.resume()` on all scenes AND ApartmentScene.js:74 also calls `physics.resume()`. Rule 14 violation confirmed. |

**Score: 6/6 (100%)**

## Action items
- None — all evals pass. Skill rules correctly identify all violations and correctly confirm valid code.

## Existing violations to fix in future tasks
- [ ] WorldScene.js: add `shutdown()` method (next time it's touched)
- [ ] Player.js: add `destroy()` method with `removeEventListener` calls
- [ ] config.js: add `JOYSTICK_MOVE` and `JOYSTICK_STOP` to EVENTS
- [ ] Player.js + VirtualJoystick.js: replace string literals with `EVENTS.JOYSTICK_MOVE` / `EVENTS.JOYSTICK_STOP`
- [ ] NPC.js: make texture key configurable via `config.textureKey`
- [ ] dialogue.js + ApartmentScene.js: consolidate physics.resume to one location
