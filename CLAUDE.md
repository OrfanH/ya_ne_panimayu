# CLAUDE.md — Russian Tutor Project

This file is your complete context for every Claude Code session on this project.
Read it fully before touching any file. Every decision you make must be consistent
with what is defined here. Do not ask for clarification on anything covered in this
document — make the decision that best fits these guidelines and proceed.

---

## What this project is

A personal Russian language tutor web app for one user (Orfan), built to replace
generic language learning apps with a structured, university-style curriculum backed
by an AI tutor. The app is strictly for personal use — never for production or
public deployment.

The core experience: structured lessons with explanation → examples → mid-check →
deeper content → full drill → summary. An AI tutor (Gemini) is always available in
a side panel to answer questions mid-lesson. The user controls all pacing.

---

## Architecture decisions

- **Single-page app:** All views (lesson selection, lesson viewer, vocabulary, notes) live in `app/index.html`. There is no separate HTML file per view.
- `app.js` renders view content dynamically. `router.js` shows and hides views by toggling classes on elements with `data-view` attributes.
- This was a deliberate deviation from the original file list in this document, which named `lesson.html`, `vocabulary.html`, and `notes.html` as separate files. Those files do not exist and should not be created.

---

## Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | HTML + CSS + Vanilla JS | No frameworks. No React. No build step. |
| Backend | Vercel serverless (Node.js) | One function: `api/tutor.js` — API proxy only |
| AI | Gemini 2.5 Flash (primary) | Free tier. Falls back to Gemini 2.5 Flash-Lite |
| Storage | Vercel KV | Progress, vocabulary, notes, errors |
| Hosting | Vercel | Auto-deploys from GitHub on push |
| Repo | GitHub (private) | Source of truth for all files |

---

## Directory structure

```
russian-tutor/
├── CLAUDE.md                  ← you are here — read first every session
├── README.md                  ← how to run locally and deploy
├── LESSONS.md                 ← full curriculum overview and notes
│
├── app/                       ← everything that runs in the browser
│   ├── index.html             ← single HTML file — all views rendered here as SPA
│   │                             (lesson selection, lesson viewer, vocabulary, notes)
│   │                             router.js toggles data-view elements; no separate
│   │                             HTML files per view exist or should be created
│   ├── style.css              ← all styles — mobile-first, uses tokens.css vars
│   ├── tokens.css             ← design system tokens only — no component styles
│   ├── config.js              ← all constants and configurable values
│   ├── session.js             ← lesson state, phase tracking, keyboard shortcuts
│   ├── tutor.js               ← Gemini API calls, message history, error handling
│   ├── storage.js             ← all Vercel KV reads and writes
│   └── router.js              ← simple client-side routing between views
│
├── api/
│   └── tutor.js               ← Vercel serverless function — Gemini proxy
│
├── curriculum/
│   ├── curriculum.json        ← master lesson index: order, unlock logic, metadata
│   ├── block-1-foundation/
│   │   ├── lesson-1-1.json
│   │   ├── lesson-1-2.json
│   │   └── ... (one file per lesson)
│   ├── block-2-grammar/
│   │   └── ... (one file per lesson)
│   └── block-3-everyday/
│       └── ... (one file per lesson)
│
├── prompts/
│   ├── tutor-core.txt         ← tutor persona, rules, teaching style
│   ├── explain-phase.txt      ← hook + why + explanation prompt
│   ├── drill-phase.txt        ← exercise generation + correction style
│   ├── question-handler.txt   ← mid-lesson question response behaviour
│   └── summary-phase.txt      ← end-of-lesson summary generation
│
├── data/                      ← user data written by the app at runtime
│   ├── progress.json          ← completed lessons, scores, current position
│   ├── vocabulary.json        ← all words seen + lesson source + notes
│   ├── errors.json            ← recurring mistake log per grammar point
│   └── notes.json             ← bookmarked lesson cards and tutor messages
│
└── config/
    ├── settings.json          ← script mode, UI preferences, current level
    └── .env                   ← GEMINI_API_KEY — never commit, never log
```

**Rules about the directory:**
- New JS files go in `app/` only
- New lesson content goes in `curriculum/block-X/` only
- New prompt variants go in `prompts/` only
- Never create files at the root level except README.md, CLAUDE.md, LESSONS.md
- Never write directly to `data/` from frontend — always via `storage.js`
- Never import external JS libraries except Lucide Icons (CDN)

---

## Lesson JSON schema

Every lesson file must follow this exact structure. Claude Code generates new
lesson files using this schema — no deviation without updating this spec first.

```json
{
  "id": "1-1",
  "unit": 1,
  "lesson": 1,
  "block": "foundation",
  "title": "Familiar letters",
  "subtitle": "Letters А К М О С Т",
  "estimatedMinutes": 15,
  "vocabulary": [
    {
      "cyrillic": "слово",
      "transliteration": "slovo",
      "gender": "neuter",
      "meaning": "word",
      "exampleCyrillic": "Это слово.",
      "exampleTransliteration": "Eto slovo.",
      "exampleMeaning": "This is a word."
    }
  ],
  "phases": {
    "hook": {
      "text": "Opening question or real-world scenario to frame the lesson"
    },
    "why": {
      "text": "The reason this rule or concept exists — logic before memorisation"
    },
    "explain": {
      "cards": [
        {
          "title": "Card title",
          "body": "Explanation text",
          "examples": [
            {
              "cyrillic": "Example in Russian",
              "transliteration": "romanised",
              "meaning": "English meaning"
            }
          ]
        }
      ]
    },
    "midCheck": {
      "questions": [
        {
          "prompt": "Question shown to user",
          "type": "text-input",
          "answer": "correct answer",
          "explanation": "Why this is correct — shown after answering"
        }
      ]
    },
    "deepen": {
      "cards": []
    },
    "drill": {
      "questions": [
        {
          "prompt": "Drill question",
          "type": "text-input",
          "answer": "correct answer",
          "explanation": "Shown after answering"
        }
      ]
    },
    "summary": {
      "rules": ["Key rule 1", "Key rule 2"],
      "vocabulary": ["List of word IDs introduced in this lesson"],
      "nextLesson": "One sentence previewing lesson 1-2"
    }
  }
}
```

Question types: `text-input`, `multiple-choice`, `fill-blank`, `translate-to-russian`, `translate-to-english`

---

## Design system

All visual values live in `tokens.css` as CSS custom properties.
**Never hardcode any colour, spacing, radius, or font-size in a component.**
Always reference a token. If a token doesn't exist for what you need, add it
to `tokens.css` first, then use it.

### Spacing — 4px base grid, always
```css
--space-1: 4px;    /* icon gaps, tight pairs */
--space-2: 8px;    /* between related items */
--space-3: 12px;   /* component internal padding */
--space-4: 16px;   /* standard padding */
--space-5: 20px;   /* section spacing */
--space-6: 24px;   /* large gaps, card padding */
--space-8: 32px;   /* between sections */
--space-12: 48px;  /* page-level spacing */
```
Never use values like 13px, 17px, 22px. Every spacing value is a multiple of 4.
If something looks off-centre, fix the layout structure — not with margin nudges.

### Typography
```css
--text-xs: 11px;    /* timestamps, captions, badges */
--text-sm: 12px;    /* secondary labels, hints */
--text-base: 13px;  /* default body text */
--text-md: 15px;    /* lesson content, readable prose */
--text-lg: 17px;    /* section headings */
--text-xl: 20px;    /* page titles */
--font-family: 'Inter', system-ui, sans-serif;
--line-height-tight: 1.4;
--line-height-base: 1.6;
--line-height-relaxed: 1.7;
```
Font weights: 400 (regular) and 500 (medium) only.
Never use 600 or 700. If something needs emphasis, use colour or size — not weight.
Font: Inter, loaded from Google Fonts. No other font families.

### Colours — semantic tokens only
```css
/* Backgrounds */
--bg-base: #f8f7f4;       /* page background */
--bg-surface: #ffffff;    /* cards, panels */
--bg-subtle: #f2f1ee;     /* inputs, secondary surfaces */
--bg-hover: #eeede9;      /* hover states */

/* Text */
--text-primary: #1a1a1a;
--text-secondary: #555550;
--text-tertiary: #888780;
--text-disabled: #bbbbba;

/* Borders */
--border: rgba(0,0,0,0.08);
--border-strong: rgba(0,0,0,0.14);

/* Accent — purple, used for active/interactive/current */
--accent: #7F77DD;
--accent-light: #EEEDFE;
--accent-text: #3C3489;

/* Semantic */
--success: #1D9E75;
--success-light: #E1F5EE;
--error: #E24B4A;
--error-light: #FCEBEB;
--warning: #BA7517;
--warning-light: #FAEEDA;
```
Dark mode overrides are defined in `tokens.css` under
`@media (prefers-color-scheme: dark)`. Never write dark mode styles per-component.

### Radius
```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-pill: 999px;
```

### Component rules

**Buttons**
- Padding: `var(--space-2) var(--space-4)`
- Minimum tap target: 44×44px
- Border-radius: `var(--radius-md)`
- Text always centred with flexbox — never text-align alone
- Transition: `all 150ms ease` on all interactive states
- Primary: `--accent` background, white text
- Secondary: transparent background, `--border-strong` border
- Never use `cursor: default` on a clickable element

**Inputs**
- Height: 40px desktop, 44px mobile
- Padding: `0 var(--space-3)`
- Border: `0.5px solid var(--border-strong)`
- Focus: border becomes `--accent`, `box-shadow: 0 0 0 3px var(--accent-light)`
- Never remove the focus ring without replacing it

**Cards**
- Background: `var(--bg-surface)`
- Border: `0.5px solid var(--border)`
- Radius: `var(--radius-lg)`
- Padding: `var(--space-4)`
- No drop shadows — borders do the separation work

**Icons**
- Library: Lucide Icons via CDN only
- Size: 16px inline, 20px standalone
- Never mix icon libraries
- Never use emoji as UI icons

**Transitions**
- All interactive elements: `transition: all 150ms ease`
- Phase changes: `200ms ease` opacity fade
- Never instant state changes — everything has a transition

**Alignment**
- Everything aligned with flexbox or grid
- Never use `position: relative; top: Npx` nudges
- Never use `margin: auto` hacks for centring inside flex containers
- If something looks off-centre, the layout structure is wrong

---

## Mobile-first rules

Write CSS for mobile screens first. Desktop layout is added on top via
`@media (min-width: 768px)`. This order is mandatory — never reversed.

- Minimum font size anywhere: 13px
- Body text on mobile: 15px minimum
- Every tappable element: minimum 44×44px touch target
- No hover-only states — active states replace hover on touch devices
- Three-panel desktop layout collapses to single-panel with bottom tab bar on mobile
- Tab bar tabs: Lessons, Vocabulary, Notes, Tutor

---

## UX behaviour rules

These are non-negotiable. Every feature Claude Code builds must follow these.

**Session continuity**
- Save state to Vercel KV immediately on every meaningful action — not on tab close
- On load: if an in-progress lesson exists, open it directly with a resume banner
- Progress is never time-limited — a lesson started today can be continued in weeks
- On resume, rebuild tutor context from saved state

**Orientation — user always knows where they are**
- Five-pip phase progress bar: always visible at top of lesson view, never hidden
- Phase label always shown: "Phase 2 of 5 · Show + mid-lesson check"
- Sidebar always highlights current lesson with visual state (done/active/locked)
- Breadcrumb in every header: Block · Lesson number · Lesson title
- Drill counter always shown during drill phase: "Question 3 of 7"

**Pacing — user controls everything**
- Nothing auto-advances. Ever.
- After correct drill answer: show success state, wait for user to press Continue
- Explicit animated transition between phases — user always feels a deliberate step
- Within a lesson: user can navigate back to any completed phase (read-only)
- Lesson exit available at all times — saves immediately, no confirmation modal

**Information density — balanced**
- One primary action visible at a time
- Progressive disclosure: lesson content reveals phase by phase, never all at once
- Tutor panel is always available but never demands attention — no auto-open
- Stats shown in summary views, not scattered across the main UI

**Feedback and errors**
- Correct drill answer: border transitions to `--success`, brief explanation shown
- Wrong drill answer: border transitions to `--error`, gentle shake animation,
  tutor explanation fades in — never just "incorrect"
- API errors: inline message in tutor panel only, auto-retry once after 3s
  If retry fails: "The tutor is briefly unavailable. The lesson continues."
- The lesson never breaks because the tutor API is down
- Zero blocking modals or popups — all feedback is inline or non-blocking toast
- Every async action shows a loading state — never a blank flash or frozen UI

---

## Keyboard shortcuts

Defined in `config.js` as `KEYBOARD_SHORTCUTS`. Handled in `session.js`.

| Key | Action |
|---|---|
| Enter | Submit drill answer / advance phase |
| Escape | Exit current lesson (saves immediately) |
| T | Focus tutor input field |
| B | Bookmark current card |

---

## Gemini API rules

**Models**
- Primary: `gemini-2.5-flash` — explanations, corrections, complex answers
- Fallback: `gemini-2.5-flash-lite` — if primary hits rate limit (429)
- Never use Pro on the free tier — reserved for future use

**API key**
- Stored in `.env` as `GEMINI_API_KEY`
- Accessed only in `api/tutor.js` (serverless function)
- Never referenced in any frontend file
- Never logged anywhere

**Proxy route — `api/tutor.js`**
- Receives: `{ messages: [], systemPrompt: "", model: "" }` from frontend
- Injects API key server-side
- Returns: Gemini response text
- Handles 429 by returning `{ error: "rate_limit" }` — frontend handles retry
- Handles other errors by returning `{ error: "api_error", message: "" }`

**Context management**
- Full message history array sent with every API call
- System prompt assembled at call time: tutor-core.txt + phase prompt +
  current lesson context + user progress summary
- Never send full session transcripts — only current session messages

**Rate limit handling in `tutor.js` (frontend)**
1. On `rate_limit` error: show "Taking a moment..." in tutor panel
2. Wait 3 seconds
3. Retry once with Flash-Lite model
4. If still fails: show "Tutor briefly unavailable — lesson continues"
5. Never block the lesson UI during any of this

---

## Data files

All reads and writes go through `storage.js`. Never access Vercel KV directly
from any other file.

**`progress.json` structure**
```json
{
  "currentLesson": "1-3",
  "currentPhase": 2,
  "completedLessons": ["1-1", "1-2"],
  "scores": { "1-1": 8, "1-2": 6 },
  "lastSession": "2026-03-28T14:30:00Z"
}
```

**`vocabulary.json` structure**
```json
{
  "words": [
    {
      "cyrillic": "слово",
      "transliteration": "slovo",
      "meaning": "word",
      "gender": "neuter",
      "lessonId": "1-1",
      "seenAt": "2026-03-28T14:30:00Z",
      "exampleCyrillic": "Это слово.",
      "exampleMeaning": "This is a word."
    }
  ]
}
```

**`errors.json` structure**
```json
{
  "patterns": [
    {
      "grammarPoint": "feminine-accusative",
      "count": 3,
      "lastSeen": "2026-03-28T14:30:00Z",
      "examples": ["attempted answer that was wrong"]
    }
  ]
}
```

**`notes.json` structure**
```json
{
  "bookmarks": [
    {
      "id": "uuid",
      "lessonId": "1-3",
      "phase": "explain",
      "cardTitle": "Seven new letters",
      "content": "Snippet of the bookmarked content",
      "savedAt": "2026-03-28T14:30:00Z"
    }
  ]
}
```

---

## Coding conventions

**Naming**
- JS functions and variables: `camelCase`
- CSS classes: `kebab-case`
- JSON keys: `camelCase`
- File names: `kebab-case`
- Constants in `config.js`: `UPPER_SNAKE_CASE`

**JavaScript**
- Vanilla JS only — no frameworks, no libraries except Lucide Icons
- No inline JS in HTML files — all logic in `.js` files
- No inline styles in JS — all visual changes via CSS class toggling
- Use `async/await` for all async operations — no raw `.then()` chains
- Always wrap async calls in `try/catch` — never let errors be silent
- `const` by default, `let` only when reassignment is needed, never `var`
- One responsibility per file — `tutor.js` only calls the API, nothing else

**CSS**
- Mobile-first always — base styles for mobile, `@media (min-width: 768px)` for desktop
- Only reference tokens from `tokens.css` — no raw values in `style.css`
- No `!important` anywhere
- No CSS resets beyond `* { box-sizing: border-box; margin: 0; padding: 0; }`
- Use flexbox for all alignment — never tables for layout

**HTML**
- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`
- Every interactive element has a visible focus state
- All images have `alt` attributes
- No inline styles on HTML elements

---

## What Claude Code must NEVER do

- Install or import any JS framework (React, Vue, Svelte, etc.)
- Use Tailwind or any CSS utility framework
- Add a build step or bundler (Webpack, Vite, etc.)
- Hardcode any colour, spacing, or font-size value outside `tokens.css`
- Use `!important` in CSS
- Write dark mode styles per-component — tokens handle this globally
- Access the Gemini API directly from frontend files
- Write to `data/` files from any file other than `storage.js`
- Create blocking modals or popups
- Auto-advance any lesson phase
- Add gamification elements (streaks, points, leaderboards, hearts)
- Commit or log the `.env` file or API key
- Use `var` in JavaScript
- Leave a `console.log` in production code
- Add pronunciation/speech input features (Gemini free tier limitation)
- Add spaced repetition flashcard mode (premature at A1 level)

---

## First session instructions

When starting the project for the first time, build in this order:

1. Create the directory structure exactly as defined above
2. Write `tokens.css` with all design tokens defined
3. Write `config.js` with all constants (model names, keyboard shortcuts, etc.)
4. Write `api/tutor.js` — the Gemini proxy serverless function
5. Write `storage.js` — Vercel KV read/write helpers
6. Write `app/index.html` + routing logic — the lesson selection/resume screen
7. Write `app/lesson.html` — the three-panel lesson viewer
8. Write curriculum lesson files starting with `lesson-1-1.json`
9. Write `prompts/tutor-core.txt` — the tutor's core system prompt
10. Write `README.md` — local setup and Vercel deployment instructions

Do not ask for confirmation between steps. Build all ten, then report what was
created and flag anything that needs a decision.

---

## Reference — curriculum overview

10 units, ~40 lessons, A1 → solid A2.

**Block 1 — Foundation**
Unit 1: Cyrillic alphabet (7 lessons)
Unit 2: First words and survival phrases (5 lessons)

**Block 2 — Core grammar**
Unit 3: Noun gender and plurality (3 lessons)
Unit 4: Present tense verb conjugation (4 lessons)
Unit 5: The case system — all 6 cases (7 lessons)
Unit 6: Adjectives (3 lessons)

**Block 3 — Everyday language**
Unit 7: Family, people, descriptions (3 lessons)
Unit 8: Time, days, dates, numbers (4 lessons)
Unit 9: Verb aspects — perfective vs imperfective (3 lessons)
Unit 10: Everyday situations (4 lessons)

---

*Last updated: 2026-03-28 | Owner: Orfan Hakimi*

---

## Placement assessment results

**Completed:** 2026-03-28
**Overall score:** 75% (12/16)

| Area | Score | Status |
|---|---|---|
| Cyrillic reading | 75% | Almost there — stress rules gap |
| Basic vocabulary | 75% | Good — solidify in Unit 2 |
| Grammar basics | 75% | Developing — slow down at cases |
| Phrases and usage | 75% | Developing — good awareness |

**Starting lesson:** 1.7 — Reading practice + stress rules
**Lessons 1.1–1.6:** Unlocked for reference, not required
**Note:** User already aware of verb aspects (imperfective/perfective) — tutor can reference this concept earlier than Unit 9 suggests.

**Curriculum adjustments:**
- Set `progress.json` initial `currentLesson` to `"1-7"`
- Mark lessons 1-1 through 1-6 as `"reference"` status in `curriculum.json`
- Unit 2 can be paced faster than default — user has vocabulary exposure
- Unit 5 (cases) — flag for extra drill depth, user lacks drilling not awareness

---

## End-of-lesson test — added to scope

Every lesson ends with a two-phase test sequence after the drill:

### Phase 5 — Test (independent, tutor disabled)
- Tutor panel dims and shows locked state during test
- 8–10 questions per lesson, defined in lesson JSON under `"test"` block
- Question types: vocabulary recall, grammar applied to new sentences, translation
- No immediate feedback per answer — all feedback shown at end
- Score saved to `progress.json` as `"testScore"` per lesson ID
- No pass/fail gate — user always advances regardless of score

### Phase 6 — Tutor feedback (personalised)
- Triggers immediately after test submission
- Tutor receives: full question list, user answers, correct answers, score
- Tutor generates diagnosis: what was right, what was wrong and why,
  one specific thing to watch for in the next lesson
- Tone: direct and useful — not reassuring, not harsh
- After feedback: tutor re-activates fully for follow-up questions
- Wrong grammar points automatically written to `errors.json`

### Addition to lesson JSON schema
Add this block to every lesson file alongside existing phases:

```json
"test": {
  "questions": [
    {
      "prompt": "What does книга mean?",
      "type": "multiple-choice",
      "options": ["table", "book", "house", "cat"],
      "answer": "book",
      "grammarPoint": "vocabulary"
    },
    {
      "prompt": "Fill in the correct form: Это ___ (стол)",
      "type": "text-input",
      "answer": "стол",
      "grammarPoint": "nominative-masculine"
    }
  ]
}
```

### Addition to prompts/
Add `prompts/test-feedback.txt` — the prompt used to generate
personalised tutor feedback from test results. It receives the
full test result as structured JSON and returns a plain-language
diagnosis covering: correct items acknowledged briefly, each wrong
answer explained with the rule, one forward-looking note.

### Updated lesson flow (7 phases total)
1. Hook + why
2. Show + mid-lesson check
3. Deepen + second check
4. Full drill (tutor active)
5. Test (tutor disabled, no mid-question feedback)
6. Tutor feedback (personalised diagnosis)
7. Summary (includes test score + updated vocabulary list)
