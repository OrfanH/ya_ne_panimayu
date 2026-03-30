// @ts-check
/**
 * Persistence tests — localStorage shape, settings, API fallback.
 *
 * These verify that the game correctly saves and reads state, and that
 * external API failures are handled gracefully without crashes.
 */
const { test, expect } = require('@playwright/test');
const { waitForGameReady, dispatchGameEvent } = require('./helpers');

// ─────────────────────────────────────────────
// localStorage — progress
// ─────────────────────────────────────────────
test.describe('Progress storage', () => {
  test('progress key is written to localStorage after boot', async ({ page }) => {
    await waitForGameReady(page);

    const raw = await page.evaluate(() => localStorage.getItem('progress'));
    expect(raw, 'localStorage.progress should exist after boot').not.toBeNull();
  });

  test('progress has expected default shape', async ({ page }) => {
    // Clear storage so we get clean defaults
    await page.goto('about:blank');
    await page.evaluate(() => localStorage.clear());
    await waitForGameReady(page);

    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('progress')));
    expect(progress).toMatchObject({
      chapter: 1,
      unlockedLocations: expect.arrayContaining(['apartment']),
      completedMissions: expect.any(Array),
      npcRelationships: expect.any(Object),
    });
  });

  test('progress persists across page reload', async ({ page }) => {
    await waitForGameReady(page);

    // Write a marker to progress
    await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('progress') || '{}');
      p._testMarker = 'persist-check';
      localStorage.setItem('progress', JSON.stringify(p));
    });

    // Reload and check it survived
    await page.reload();
    await page.waitForSelector('#game-container canvas');

    const marker = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('progress') || '{}');
      return p._testMarker;
    });
    expect(marker).toBe('persist-check');
  });
});

// ─────────────────────────────────────────────
// localStorage — vocabulary
// ─────────────────────────────────────────────
test.describe('Vocabulary storage', () => {
  test('vocabulary key exists after boot (may be empty array)', async ({ page }) => {
    await page.goto('about:blank');
    await page.evaluate(() => localStorage.clear());
    await waitForGameReady(page);

    // Vocabulary is created lazily — dispatch an event to trigger it
    await dispatchGameEvent(page, 'vocabulary:new', {
      russian: 'привет',
      translation: 'hello',
      npcId: 'galina',
    });

    // Give storage a tick to write
    await page.waitForTimeout(200);

    const raw = await page.evaluate(() => localStorage.getItem('vocabulary'));
    // May be null if vocabulary is stored under a different key — that's a bug we surface
    expect(raw, 'vocabulary should be written to localStorage after vocab:new event').not.toBeNull();
  });
});

// ─────────────────────────────────────────────
// localStorage — settings
// ─────────────────────────────────────────────
test.describe('Settings storage', () => {
  test('settings key is written when a setting changes', async ({ page }) => {
    await waitForGameReady(page);

    await dispatchGameEvent(page, 'settings:volume:change', { volume: 50 });
    await page.waitForTimeout(200);

    const raw = await page.evaluate(() => localStorage.getItem('settings'));
    expect(raw, 'localStorage.settings should exist after a settings change').not.toBeNull();
  });
});

// ─────────────────────────────────────────────
// API resilience
// ─────────────────────────────────────────────
test.describe('API resilience', () => {
  test('game boots without crash when /api/tutor is unreachable', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    // Block the AI API entirely
    await page.route('/api/tutor', route => route.abort('failed'));

    await waitForGameReady(page);

    expect(errors, `Page errors with API blocked:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('game boots without crash when /api/tutor returns 503', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.route('/api/tutor', route =>
      route.fulfill({ status: 503, body: 'Service Unavailable' })
    );

    await waitForGameReady(page);

    expect(errors, `Page errors with API returning 503:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('offline badge appears in dialogue when API returns error response', async ({ page }) => {
    await page.route('/api/tutor', route =>
      route.fulfill({ status: 503, body: 'Service Unavailable' })
    );

    await waitForGameReady(page);

    // Open dialogue, then push an offline update (as TutorAI would after an API failure)
    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: 'Один момент...',
      translation: 'One moment...',
      choices: [],
    });
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    await dispatchGameEvent(page, 'dialogue:update', {
      npcId: 'galina',
      npcName: 'Галина Ивановна',
      russian: 'Извините.',
      translation: 'Sorry.',
      offline: true,
      choices: [{ id: 'ok', russian: 'Ладно', isFinal: true }],
    });

    await expect(page.locator('.dialogue-offline-badge')).toBeVisible({ timeout: 1000 });
  });
});

// ─────────────────────────────────────────────
// Mobile layout
// ─────────────────────────────────────────────
test.describe('Mobile layout', () => {
  test('no horizontal overflow at 375px', async ({ page, viewport }) => {
    // Skip on desktop project
    if (!viewport || viewport.width > 400) {
      test.skip();
      return;
    }
    await waitForGameReady(page);

    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow, 'Body should not overflow horizontally on mobile').toBe(false);
  });

  test('virtual joystick base is present at 375px', async ({ page, viewport }) => {
    if (!viewport || viewport.width > 400) {
      test.skip();
      return;
    }
    await waitForGameReady(page);
    await expect(page.locator('.joystick-base')).toBeAttached();
  });

  test('canvas renders at 375px without JS errors', async ({ page, viewport }) => {
    if (!viewport || viewport.width > 400) {
      test.skip();
      return;
    }

    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await waitForGameReady(page);
    await expect(page.locator('#game-container canvas')).toBeVisible();
    expect(errors, `Errors on mobile:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('dialogue box fits within 375px viewport', async ({ page, viewport }) => {
    if (!viewport || viewport.width > 400) {
      test.skip();
      return;
    }
    await waitForGameReady(page);

    await dispatchGameEvent(page, 'dialogue:start', {
      npcId: 'test',
      npcName: 'Тест',
      russian: 'Привет!',
      translation: 'Hello!',
      choices: [],
    });

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/);

    const box = await page.locator('.dialogue-box').boundingBox();
    expect(box, 'dialogue-box should be in DOM').not.toBeNull();
    if (box) {
      expect(box.x, 'dialogue box should not overflow left edge').toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, 'dialogue box should not overflow right edge').toBeLessThanOrEqual(viewport.width + 1);
    }
  });
});
