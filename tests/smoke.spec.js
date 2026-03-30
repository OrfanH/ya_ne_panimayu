// @ts-check
/**
 * Smoke tests — boot, asset loading, no-crash input.
 * These are the fastest checks. A failure here means the game can't start at all.
 */
const { test, expect } = require('@playwright/test');
const { waitForGameReady, BOOT_TIMEOUT } = require('./helpers');

// ─────────────────────────────────────────────
// Boot / Load
// ─────────────────────────────────────────────
test.describe('Boot / Load', () => {
  test('page loads without JavaScript errors', async ({ page }) => {
    // pageerror = uncaught JS exception. Intentionally NOT catching console.error
    // because HTTP 404s (missing portraits, API unavailable) show as console.error
    // but are caught by the dedicated network and API resilience tests instead.
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await waitForGameReady(page);

    expect(errors, `Uncaught JS exceptions:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('Phaser canvas renders', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#game-container canvas', { timeout: BOOT_TIMEOUT });
    await expect(page.locator('#game-container canvas')).toBeVisible();
  });

  test('World scene is active after boot', async ({ page }) => {
    await waitForGameReady(page);
    const isWorldActive = await page.evaluate(() => window.__GAME__.scene.isActive('World'));
    expect(isWorldActive, 'World scene should be active after Boot finishes').toBe(true);
  });

  test('Boot scene is no longer active after load', async ({ page }) => {
    await waitForGameReady(page);
    const isBootActive = await page.evaluate(() => window.__GAME__.scene.isActive('Boot'));
    expect(isBootActive, 'Boot scene should have stopped after World starts').toBe(false);
  });

  test('UI overlay is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ui-overlay')).toBeAttached();
  });

  test('HUD is mounted after boot', async ({ page }) => {
    await waitForGameReady(page);
    await expect(page.locator('#hud')).toBeAttached();
  });

  test('mute button is present in HUD', async ({ page }) => {
    await waitForGameReady(page);
    await expect(page.locator('#hud-mute')).toBeAttached();
  });
});

// ─────────────────────────────────────────────
// Asset integrity
// ─────────────────────────────────────────────
test.describe('Asset integrity', () => {
  test('no Phaser texture or frame errors in console', async ({ page }) => {
    const textureErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        const text = msg.text();
        // Match Phaser-specific texture/frame messages only.
        // Excludes generic HTTP 404s which are surfaced by network tests.
        if (/Texture "\w|Frame "\w|missing key|no frame/i.test(text)) {
          textureErrors.push(text);
        }
      }
    });

    await waitForGameReady(page);
    // Extra settle time for all tiles to be drawn
    await page.waitForTimeout(1500);

    expect(textureErrors, `Texture/frame errors:\n${textureErrors.join('\n')}`).toHaveLength(0);
  });

  test('no failed network requests on load', async ({ page }) => {
    const failed = [];
    page.on('requestfailed', req =>
      failed.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`)
    );

    await waitForGameReady(page);

    const blocking = failed.filter(f => !f.includes('favicon'));
    expect(blocking, `Failed requests:\n${blocking.join('\n')}`).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
// Input — no-crash
// ─────────────────────────────────────────────
test.describe('Input — no crash', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('movement keys do not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const canvas = page.locator('#game-container canvas');
    await canvas.click();
    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD']) {
      await page.keyboard.down(key);
      await page.waitForTimeout(80);
      await page.keyboard.up(key);
    }
    await page.waitForTimeout(300);

    expect(errors, `Errors after movement:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('interaction key (E) does not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.locator('#game-container canvas').click();
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(300);

    expect(errors, `Errors after E key:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('journal key (J) does not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.locator('#game-container canvas').click();
    await page.keyboard.press('KeyJ');
    await page.waitForTimeout(300);

    expect(errors, `Errors after J key:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('pause key (Escape) does not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    expect(errors, `Errors after Escape:\n${errors.join('\n')}`).toHaveLength(0);
  });
});
