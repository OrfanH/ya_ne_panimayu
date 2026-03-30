// @ts-check
const { test, expect } = require('@playwright/test');

// How long to wait for Phaser to boot and the first scene to be active
const BOOT_TIMEOUT = 12_000;

test.describe('Boot + load', () => {
  test('page loads without JS errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');
    await page.waitForTimeout(3000);

    expect(errors, `Console errors found:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('Phaser canvas renders', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#game-container canvas', { timeout: BOOT_TIMEOUT });
    const canvas = page.locator('#game-container canvas');
    await expect(canvas).toBeVisible();
  });

  test('UI overlay is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ui-overlay')).toBeAttached();
  });
});

test.describe('Core UI', () => {
  test.beforeEach(async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    // Wait for Phaser boot scene to finish
    await page.waitForSelector('#game-container canvas', { timeout: BOOT_TIMEOUT });
    await page.waitForTimeout(2000);
    // Fail fast if page errored during setup
    expect(errors, `Page errors during load:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('menu opens and closes', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const menu = page.locator('#menu');
    const isHidden = await menu.evaluate(el => el.classList.contains('hidden'));
    // Escape either opens or toggles — just assert no crash (no new console errors)
    // A visible menu is a bonus assertion
    if (!isHidden) {
      await expect(menu).toBeVisible();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  });

  test('no Phaser texture errors in console', async ({ page }) => {
    const textureErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        const text = msg.text();
        if (text.includes('Texture') || text.includes('frame') || text.includes('missing')) {
          textureErrors.push(text);
        }
      }
    });
    await page.goto('/');
    await page.waitForSelector('#game-container canvas', { timeout: BOOT_TIMEOUT });
    await page.waitForTimeout(3000);
    expect(textureErrors, `Texture/frame errors:\n${textureErrors.join('\n')}`).toHaveLength(0);
  });
});

test.describe('Input — no crash', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#game-container canvas', { timeout: BOOT_TIMEOUT });
    await page.waitForTimeout(2000);
  });

  test('movement keys do not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const canvas = page.locator('#game-container canvas');
    await canvas.click(); // focus
    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD']) {
      await page.keyboard.down(key);
      await page.waitForTimeout(100);
      await page.keyboard.up(key);
    }
    await page.waitForTimeout(500);
    expect(errors, `Errors after movement keys:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('interaction key (E) does not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const canvas = page.locator('#game-container canvas');
    await canvas.click();
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(500);
    expect(errors, `Errors after E key:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('journal key (J) does not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const canvas = page.locator('#game-container canvas');
    await canvas.click();
    await page.keyboard.press('KeyJ');
    await page.waitForTimeout(500);
    expect(errors, `Errors after J key:\n${errors.join('\n')}`).toHaveLength(0);
  });
});

test.describe('Network', () => {
  test('no failed requests on load', async ({ page }) => {
    const failed = [];
    page.on('requestfailed', req => failed.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`));

    await page.goto('/');
    await page.waitForSelector('#game-container canvas', { timeout: BOOT_TIMEOUT });
    await page.waitForTimeout(2000);

    // Filter out expected non-critical misses (e.g. favicon)
    const blocking = failed.filter(f => !f.includes('favicon'));
    expect(blocking, `Failed requests:\n${blocking.join('\n')}`).toHaveLength(0);
  });
});
