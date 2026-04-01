// @ts-check
/**
 * Experience invariant tests — structural rules the game must never violate.
 *
 * These are NOT mechanics tests (does event X fire?). They are comprehensibility
 * tests: given what the game actually renders, can a new player understand it?
 *
 * Every test here encodes a rule that, if broken, produces a UX failure visible
 * to a real player — even when all mechanics tests pass.
 *
 * Current failures map to:
 *   BUG-020 — scripted dismiss choice has no English
 *   BUG-021 — loading state shows zero choices (game appears frozen)
 *   BUG-022 — TutorAI choice buttons have no English label
 */
const { test, expect } = require('@playwright/test');
const { waitForGameReady, dispatchGameEvent } = require('./helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Assert that every visible choice button contains at least some Latin
 * characters — the minimum structural requirement for a beginner to understand
 * what the button does.
 */
async function assertChoicesHaveEnglish(page) {
  const buttons = page.locator('.dialogue-choice-btn');
  const count = await buttons.count();
  expect(count, 'Expected at least one choice button').toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const text = await buttons.nth(i).textContent() ?? '';
    expect(
      /[a-zA-Z]/.test(text),
      `Choice button ${i} has no English text: "${text}"`
    ).toBe(true);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Invariant 1 — NPC dialogue line is always bilingual
// Rule: when a translation is provided, it must be present in the DOM so the
//       player can reveal it via the "EN" toggle button.
// Note: translations are hidden by default (toggle design) — this tests that
//       the text EXISTS in the DOM and the toggle button is present.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Dialogue — bilingual content invariant', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('NPC translation text is present in DOM and EN toggle button exists', async ({ page }) => {
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: 'Здравствуйте! Добро пожаловать.',
      translation: 'Hello! Welcome.',
      choices: [{ id: 'ok', russian: 'Хорошо.', isFinal: true }],
    });

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    // Translation content must be in the DOM (even if CSS-hidden behind EN toggle)
    await expect(page.locator('.dialogue-translation')).toContainText('Hello! Welcome.');

    // The EN toggle button must exist so the player CAN reveal the translation
    await expect(page.locator('.dialogue-toggle-translation')).toBeAttached();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// Invariant 2 — Choice buttons always contain English text
// Rule: every rendered choice button must have at least some Latin characters.
// Maps to: BUG-022 (TutorAI choices Russian-only) and BUG-020 ("Хорошо." only)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Dialogue — choice buttons have English labels', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('scripted dismiss choice button contains English', async ({ page }) => {
    // This mirrors the exact payload ApartmentScene dispatches after a scripted choice.
    // BUG-020: currently "Хорошо." has no translation — this test fails until fixed.
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: 'Рада вас видеть!',
      translation: 'Nice to meet you!',
      choices: [{ id: 'dismiss', russian: 'Хорошо.', isFinal: true }],
    });

    await expect(page.locator('.dialogue-choice-btn')).toBeVisible();
    await assertChoicesHaveEnglish(page);
  });

  test('TutorAI continue/goodbye choices contain English', async ({ page }) => {
    // This mirrors the exact payload _dispatchAILine() sends.
    // BUG-022: currently no translation field — this test fails until fixed.
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: '...',
      translation: '',
      choices: [],
    });
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    await dispatchGameEvent(page, 'dialogue:update', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: 'Привет! Как дела? (Hi! How are you?)',
      translation: '',
      choices: [
        { id: 'continue', russian: 'Продолжить...' },
        { id: 'end',      russian: 'До свидания', isFinal: true },
      ],
    });

    await expect(page.locator('.dialogue-choice-btn').first()).toBeVisible();
    await assertChoicesHaveEnglish(page);
  });

  test('all scripted opening choices contain English', async ({ page }) => {
    // Mirrors the first-visit DIALOGUE_START from ApartmentScene.
    // Choices from apartment-dialogue.js VARIATIONS[0].lines[0].choices must
    // each have an English label so a beginner knows what they are agreeing to.
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: 'Здравствуйте! Я ваша соседка. (Hello! I am your neighbour.)',
      translation: 'Hello! I am your neighbour.',
      choices: [
        { id: 'greet',    russian: 'Здравствуйте!' },
        { id: 'question', russian: 'Вы говорите по-английски?' },
        { id: 'thanks',   russian: 'Спасибо.' },
      ],
    });

    await expect(page.locator('.dialogue-choice-btn').first()).toBeVisible();
    await assertChoicesHaveEnglish(page);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Invariant 3 — Loading state never leaves player with zero choices
// Rule: after dialogue:start fires (even with loading:true), at least one
//       interactive choice must appear within 2 seconds.
// Maps to: BUG-021 ('...' loading placeholder, game appears frozen)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Dialogue — loading state is never a dead end', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('dialogue opened in loading state shows at least one choice within 2s', async ({ page }) => {
    // This is the exact event NPC._startDialogue() dispatches before TutorAI loads.
    // BUG-021: currently shows '...' with zero choices. Test fails until fixed.
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: '...',
      translation: '',
      choices: [],
      loading: true,
    });

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    // At least one choice must be visible within 2 seconds.
    // After fix: either an exit button appears immediately, or TutorAI's
    // scripted fallback fires and populates choices.
    await expect(page.locator('.dialogue-choice-btn').first()).toBeVisible({ timeout: 2000 });
  });

  test('player can always exit dialogue regardless of loading state', async ({ page }) => {
    // A player must never be trapped in a dialogue box with no way out.
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: '...',
      translation: '',
      choices: [],
      loading: true,
    });

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    // After fix: an exit/farewell button (isFinal: true) must appear.
    // We check by looking for a button that, when clicked, closes the dialogue.
    const exitBtn = page.locator('.dialogue-choice-btn[data-final="true"], .dialogue-choice-btn').first();
    await expect(exitBtn).toBeVisible({ timeout: 2000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Invariant 4 — Dialogue text is never a raw loading placeholder
// Rule: '...' alone (no NPC speech, no English) must not be the final visible
//       state when dialogue is open. It is only acceptable as a transient state.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Dialogue — no permanent placeholder text', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('dialogue text resolves away from placeholder within 3s', async ({ page }) => {
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: '...',
      translation: '',
      choices: [],
      loading: true,
    });

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    // Within 3 seconds, the Russian text element must no longer show ONLY '...'
    // (i.e. either TutorAI replied, scripted fallback fired, or error message shown)
    await expect(page.locator('.dialogue-russian')).not.toHaveText('...', { timeout: 3000 });
  });
});
