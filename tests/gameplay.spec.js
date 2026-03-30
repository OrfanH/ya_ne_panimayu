// @ts-check
/**
 * Gameplay tests — DOM overlay interactions driven by game events.
 * These assert that the game's visible systems (dialogue, journal, menu, HUD)
 * respond correctly to the inputs and events that real players trigger.
 *
 * What Playwright can assert here: DOM class changes, text content, element
 * presence — everything rendered outside the Phaser canvas.
 *
 * What it cannot assert: sprite positions, tile frames, collision, audio.
 */
const { test, expect } = require('@playwright/test');
const { waitForGameReady, dispatchGameEvent } = require('./helpers');

// ─────────────────────────────────────────────
// Dialogue overlay
// ─────────────────────────────────────────────
test.describe('Dialogue overlay', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('opens when dialogue:start event fires', async ({ page }) => {
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'test-npc',
      npcName: 'Тест',
      russian: 'Привет!',
      translation: 'Hello!',
      choices: [],
    });

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);
  });

  test('shows NPC name and Russian text', async ({ page }) => {
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'test-npc',
      npcName: 'Галина Ивановна',
      russian: 'Здравствуйте!',
      translation: 'Good day!',
      choices: [],
    });

    await expect(page.locator('.dialogue-speaker-name')).toContainText('Галина Ивановна');
    await expect(page.locator('.dialogue-russian')).toContainText('Здравствуйте!');
    await expect(page.locator('.dialogue-translation')).toContainText('Good day!');
  });

  test('renders choice buttons when choices are provided', async ({ page }) => {
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'test-npc',
      npcName: 'Тест',
      russian: 'Как дела?',
      translation: 'How are you?',
      choices: [
        { id: 'good', russian: 'Хорошо' },
        { id: 'bad',  russian: 'Плохо'  },
      ],
    });

    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.nth(0)).toContainText('Хорошо');
    await expect(buttons.nth(1)).toContainText('Плохо');
  });

  test('closes when a final choice is clicked', async ({ page }) => {
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'test-npc',
      npcName: 'Тест',
      russian: 'До свидания!',
      translation: 'Goodbye!',
      choices: [{ id: 'bye', russian: 'До свидания!', isFinal: true }],
    });

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);
    await page.locator('.dialogue-choice-btn').click();

    // Dialogue has a closing animation — wait for it
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('shows offline badge when line has offline flag', async ({ page }) => {
    // Open dialogue first
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'test-npc',
      npcName: 'Тест',
      russian: 'Один момент...',
      translation: 'One moment...',
      choices: [],
    });
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    // Update with an offline response (what happens when Gemini API fails)
    await dispatchGameEvent(page, 'dialogue:update', {
      npcId: 'test-npc',
      npcName: 'Тест',
      russian: 'Извините.',
      translation: 'Sorry.',
      offline: true,
      choices: [{ id: 'ok', russian: 'Хорошо', isFinal: true }],
    });

    await expect(page.locator('.dialogue-offline-badge')).toBeVisible();
  });

  test('dialogue:end event closes the overlay', async ({ page }) => {
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'test-npc',
      npcName: 'Тест',
      russian: 'Привет',
      translation: 'Hi',
      choices: [],
    });
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    // dialogue:end is normally dispatched by DialogueUI.close() itself.
    // Test that if something externally closes the dialogue, the overlay clears.
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent('dialogue:end'))
    );

    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 2000 });
  });
});

// ─────────────────────────────────────────────
// Journal
// ─────────────────────────────────────────────
test.describe('Journal', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('opens on J key press', async ({ page }) => {
    await page.locator('#game-container canvas').click();
    await page.keyboard.press('KeyJ');
    await expect(page.locator('.journal')).toHaveClass(/is-open/, { timeout: 1000 });
  });

  test('closes on second J key press', async ({ page }) => {
    await page.locator('#game-container canvas').click();
    await page.keyboard.press('KeyJ');
    await expect(page.locator('.journal')).toHaveClass(/is-open/, { timeout: 1000 });

    await page.keyboard.press('KeyJ');
    await expect(page.locator('.journal')).not.toHaveClass(/is-open/, { timeout: 1000 });
  });

  test('closes on Escape key when open', async ({ page }) => {
    await page.locator('#game-container canvas').click();
    await page.keyboard.press('KeyJ');
    await expect(page.locator('.journal')).toHaveClass(/is-open/, { timeout: 1000 });

    await page.keyboard.press('Escape');
    await expect(page.locator('.journal')).not.toHaveClass(/is-open/, { timeout: 1000 });
  });

  test('opens via journal:open event', async ({ page }) => {
    await dispatchGameEvent(page, 'journal:open', {});
    await expect(page.locator('.journal')).toHaveClass(/is-open/, { timeout: 1000 });
  });

  test('has vocabulary and mission tabs', async ({ page }) => {
    await dispatchGameEvent(page, 'journal:open', {});
    await expect(page.locator('.journal-tab')).toHaveCount(2);
  });
});

// ─────────────────────────────────────────────
// Pause menu
// ─────────────────────────────────────────────
test.describe('Pause menu', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('opens on Escape key', async ({ page }) => {
    await expect(page.locator('#menu')).toHaveClass(/hidden/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu')).not.toHaveClass(/hidden/, { timeout: 500 });
  });

  test('closes on Resume button click', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu')).not.toHaveClass(/hidden/, { timeout: 500 });

    await page.locator('#menu-resume').click();
    await expect(page.locator('#menu')).toHaveClass(/hidden/, { timeout: 500 });
  });

  test('Journal button opens journal overlay', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.locator('#menu-journal').click();
    await expect(page.locator('.journal')).toHaveClass(/is-open/, { timeout: 1000 });
  });

  test('Settings button opens settings panel', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.locator('#menu-settings').click();
    // Settings panel should become visible
    const settingsPanel = page.locator('#settings-panel, .settings-panel, [class*="settings"]').first();
    await expect(settingsPanel).toBeVisible({ timeout: 1000 });
  });
});

// ─────────────────────────────────────────────
// HUD — location name
// ─────────────────────────────────────────────
test.describe('HUD', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('shows location name when location:enter fires', async ({ page }) => {
    await dispatchGameEvent(page, 'location:enter', { name: 'Apartment Building' });

    const locationEl = page.locator('.hud-location');
    await expect(locationEl).toHaveClass(/is-visible/, { timeout: 1000 });
    await expect(locationEl).toContainText('Apartment Building');
  });

  test('updates location text on subsequent location:enter events', async ({ page }) => {
    await dispatchGameEvent(page, 'location:enter', { name: 'Apartment Building' });
    await expect(page.locator('.hud-location')).toContainText('Apartment Building', { timeout: 1000 });

    await dispatchGameEvent(page, 'location:enter', { name: 'Park' });
    await expect(page.locator('.hud-location')).toContainText('Park', { timeout: 1000 });
  });

  test('shows mission when mission:start fires', async ({ page }) => {
    await dispatchGameEvent(page, 'mission:start', {
      id: 'test-mission',
      title: 'Поговори с Галиной',
      description: 'Talk to Galina',
    });

    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 1000 });
    await expect(page.locator('.hud-mission-title')).toContainText('Поговори с Галиной');
  });
});

// ─────────────────────────────────────────────
// Scene state — via window.__GAME__ seam
// ─────────────────────────────────────────────
test.describe('Scene state', () => {
  test('only one scene is active at a time after boot', async ({ page }) => {
    await waitForGameReady(page);
    const activeScenes = await page.evaluate(() =>
      window.__GAME__.scene.getScenes(true).map(s => s.sys.settings.key)
    );
    // World should be the only active scene
    expect(activeScenes).toHaveLength(1);
    expect(activeScenes).toContain('World');
  });
});
