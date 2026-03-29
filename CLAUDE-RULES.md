# CLAUDE-RULES.md — Code rules every agent must follow

Read this file whenever you write, edit, or review any code or CSS.

---

## Hard prohibitions

- No `var` in JavaScript — `const` by default, `let` only when reassignment needed
- No `console.log` in production code
- No inline styles in JS or HTML — all visual changes via CSS class toggling
- No `!important` in CSS
- No JS frameworks (React, Vue, Svelte, etc.)
- No CSS utility frameworks (Tailwind, etc.)
- No build steps or bundlers (Webpack, Vite, etc.)
- No external JS libraries except Phaser.js (CDN) and Tone.js (CDN)
- No dark mode styles per-component — tokens handle this globally
- No gamification elements (streaks, points, leaderboards, hearts)
- No blocking modals or popups
- No game logic in Phaser scene `create()` or `update()` — systems/ only
- No DOM manipulation in any file under `game/`
- No Phaser rendering in any file under `ui/`
- No direct Vercel KV access from frontend — always via `storage.js`
- No direct Gemini API access from frontend — always via `api/tutor.js`
- Never commit or log `.env` or API key

## Design tokens — mandatory

All visual values live in `tokens.css` as CSS custom properties.
Never hardcode any colour, spacing, radius, or font-size in a component.
Always reference a token. If a token doesn't exist, add it to `tokens.css` first.

- **Spacing:** 4px base grid. Every spacing value is a multiple of 4.
- **Typography:** Inter font, weights 400 (regular) and 500 (medium) only. Never 600 or 700.
- **Colours:** semantic tokens only (`--bg-base`, `--text-primary`, `--accent`, etc.)
- **Radius:** `--radius-sm` through `--radius-pill`

## CSS rules

- Mobile-first always: base styles for mobile, `@media (min-width: 768px)` for desktop
- Only reference tokens from `tokens.css` — no raw values in `style.css`
- No CSS resets beyond `* { box-sizing: border-box; margin: 0; padding: 0; }`
- Use flexbox for all alignment
- `kebab-case` for CSS classes

## JavaScript rules

- Vanilla JS only
- No inline JS in HTML files — all logic in `.js` files
- `async/await` for all async operations — no raw `.then()` chains
- Always wrap async calls in `try/catch`
- `camelCase` for functions and variables
- `UPPER_SNAKE_CASE` for constants in `config.js`
- `PascalCase` for Phaser scene file names
- `kebab-case` for all other file names
- One responsibility per file

## HTML rules

- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`
- Every interactive element has a visible focus state
- All images have `alt` attributes
- No inline styles on HTML elements

## Mobile-first requirements

- Minimum font size anywhere: 13px
- Body text on mobile: 15px minimum
- Every tappable element: minimum 44x44px touch target
- Dialogue choices: minimum 48px height tap targets
- No hover-only states — active states replace hover on touch devices

## Separation of concerns

- **Phaser owns the canvas:** tilemaps, sprites, movement, collision, camera, scenes
- **HTML/CSS/JS owns all UI:** dialogue, journal, HUD, menus
- Communication between layers: **custom events only**
- All storage via `storage.js` -> Vercel KV only
- API key in `api/tutor.js` only — never in frontend
- All audio via Tone.js synthesis — no audio files
- Audio starts only on first user interaction via `Tone.start()`

## File placement

- Game JS files: `app/game/` (scenes, entities, systems)
- UI JS files: `app/ui/`
- Shared app files (config, tutor, storage): `app/`
- Prompt variants: `prompts/` only
- Root level files: only CLAUDE.md, CLAUDE-VISION.md, CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-AGENTS.md, STORY.md (index), STORY-core.md, STORY-location-*.md, WORLD.md (index), WORLD-core.md, WORLD-location-*.md, IMPROVEMENTS.md, README.md
- Never write to `data/` from frontend — always via `storage.js`
