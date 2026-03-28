---
name: phaser-patterns
description: auto-invoke when writing or reviewing Phaser scenes, entities, or game systems — enforces lifecycle, event bus, and cleanup patterns
---

# Phaser Patterns — Scene, Entity, and Event Discipline

## When to apply
- Writing or editing any file in `app/game/scenes/`, `app/game/entities/`, or `app/game/systems/`
- Reviewing code that creates Phaser scenes, sprites, physics bodies, or event listeners
- Architect designing a new scene or entity spec

## Rules

### Scene lifecycle

1. Every scene MUST have a `shutdown()` method that removes all event listeners registered in `create()`.
2. Camera setup (`setBounds`, `startFollow`, `fadeIn`) MUST use values from `GAME_CONFIG` — never hardcode pixel values.
3. Input setup (cursors, WASD, action keys) follows the established pattern: `this._cursors`, `this._wasd`, `this._actionKey`. Do not invent new property names.
4. Scenes MUST NOT contain game logic in `create()` or `update()` directly — delegate to entity methods and system modules per CLAUDE-RULES.md.
5. Use numbered comment blocks (`// 1. ...`, `// 2. ...`) inside `create()` to document setup phases — matching the pattern in WorldScene and ApartmentScene.

### Entity lifecycle

6. Every entity class that registers `window.addEventListener` MUST have a `destroy()` method that calls `window.removeEventListener` for each listener.
7. Entity constructors take a `config` object. Texture keys MUST be derived from config (e.g., `config.textureKey || 'npc-default'`), never hardcoded to a shared constant, so multiple instances can have distinct appearances.
8. Entities expose their Phaser object via a `gameObject` getter. Scene code accesses the sprite only through this getter.
9. Private state uses `_prefixed` properties. No bare underscore-free private fields.

### Event bus discipline

10. **Phaser-to-Phaser** communication uses `this.game.events` (the Phaser global emitter). Used for: scene transitions, zone events, game state changes.
11. **HTML-to-Phaser and Phaser-to-HTML** communication uses `window` CustomEvents. Used for: dialogue, UI overlays, joystick input.
12. ALL event names MUST be defined in the `EVENTS` constant object (in `app/config.js`). Never use string literals for event names — always reference `EVENTS.EVENT_NAME`.
13. When adding a new event, first add the constant to `EVENTS` in `config.js`, then reference it everywhere.

### Physics and cleanup

14. `physics.resume()` must be called from exactly ONE place per pause/resume cycle. Do not add belt-and-suspenders fallbacks that resume physics in multiple listeners.
15. When a scene is restarted or stopped, all physics bodies created by that scene are destroyed. Entity `destroy()` methods handle their own sprite cleanup.

## Examples

### Good: Scene with proper shutdown
```js
create() {
  // 1. World bounds
  this.physics.world.setBounds(0, 0, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);

  // 2. Player
  this._player = new Player(this, { x: 100, y: 100 });

  // 3. Events
  this._onDialogueEnd = () => this.physics.resume();
  window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
}

shutdown() {
  window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
  this._player.destroy();
}
```

### Good: Entity with configurable texture and destroy
```js
class NPC {
  constructor(scene, config) {
    this._textureKey = config.textureKey || 'npc-default';
    this._createTexture(scene);
    // ...
    this._onSomeEvent = (e) => { /* ... */ };
    window.addEventListener(EVENTS.SOME_EVENT, this._onSomeEvent);
  }

  destroy() {
    window.removeEventListener(EVENTS.SOME_EVENT, this._onSomeEvent);
    this._sprite.destroy();
  }
}
```

### Good: Event name from EVENTS constant
```js
// In config.js
const EVENTS = {
  JOYSTICK_MOVE: 'joystick:move',
  JOYSTICK_STOP: 'joystick:stop',
  // ...
};

// In Player.js
window.addEventListener(EVENTS.JOYSTICK_MOVE, this._onJoystickMove);
```

## Anti-patterns

1. **Missing shutdown()** — Scene registers listeners in `create()` but has no `shutdown()`. Listeners accumulate on scene restart.
2. **Hardcoded texture key** — `const KEY = 'npc-default'` shared across all NPC instances. Cannot differentiate NPCs visually.
3. **String literal events** — `window.addEventListener('joystick:move', ...)` instead of `EVENTS.JOYSTICK_MOVE`. Drift risk when renaming.
4. **Double physics.resume()** — Both the scene AND a global UI handler resume physics on the same event. Fragile if physics is paused for other reasons.
5. **No destroy() on entity with listeners** — Entity adds `window.addEventListener` in constructor but has no cleanup path. Memory leak on scene transition.
6. **Camera values not from GAME_CONFIG** — `this.cameras.main.setBounds(0, 0, 800, 600)` instead of using config constants.
