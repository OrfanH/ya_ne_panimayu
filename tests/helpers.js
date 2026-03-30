// @ts-check
/**
 * Shared helpers for Playwright test suites.
 */

const BOOT_TIMEOUT = 20_000;

/**
 * Navigate to the game and wait until the World scene is fully active.
 * Uses window.__GAME__ seam (set in app/game/main.js).
 * All gameplay tests should call this before interacting.
 *
 * Automatically seeds localStorage to skip the onboarding overlay, which
 * would otherwise intercept all pointer events and block canvas clicks.
 *
 * @param {import('@playwright/test').Page} page
 */
async function waitForGameReady(page) {
  // Seed hasSeenIntro before page scripts run so onboarding never fires.
  // addInitScript executes before any page script on every navigation.
  await page.addInitScript(() => {
    try {
      const raw = localStorage.getItem('progress');
      const p = raw ? JSON.parse(raw) : {};
      if (!p.hasSeenIntro) {
        p.hasSeenIntro = true;
        localStorage.setItem('progress', JSON.stringify(p));
      }
    } catch (_) {}
  });

  await page.goto('/');
  await page.waitForSelector('#game-container canvas', { timeout: BOOT_TIMEOUT });
  await page.waitForFunction(
    () => typeof window.__GAME__ !== 'undefined' && window.__GAME__.scene?.isActive('World'),
    { timeout: BOOT_TIMEOUT }
  );
}

/**
 * Dispatch a window CustomEvent from within the page context.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} eventName
 * @param {object} detail
 */
async function dispatchGameEvent(page, eventName, detail) {
  await page.evaluate(
    ({ name, d }) => window.dispatchEvent(new CustomEvent(name, { detail: d })),
    { name: eventName, d: detail }
  );
}

module.exports = { waitForGameReady, dispatchGameEvent, BOOT_TIMEOUT };
