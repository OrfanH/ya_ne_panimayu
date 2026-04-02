// @ts-check
/**
 * Shared helpers for Playwright test suites.
 */

const BOOT_TIMEOUT = 20_000;
const SCENE_TIMEOUT = 90_000;

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

/**
 * Seed a specific progress object into localStorage, then boot and wait for World.
 *
 * Use this instead of waitForGameReady when the test needs a specific game state
 * (e.g. first-visit vs return-visit, specific completedMissions, etc.)
 *
 * @param {import('@playwright/test').Page} page
 * @param {object} progress - The full progress object to seed
 */
async function seedProgressAndBoot(page, progress) {
  await page.addInitScript((p) => {
    try { localStorage.setItem('progress', JSON.stringify(p)); } catch (_) {}
  }, progress);

  await page.goto('/');
  await page.waitForFunction(
    () => typeof window.__GAME__ !== 'undefined' && window.__GAME__.scene?.isActive('World'),
    { timeout: BOOT_TIMEOUT }
  );
}

/**
 * Wait for a specific Phaser scene to become active.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} sceneKey - e.g. 'Apartment', 'World', 'Park'
 * @param {number} timeout
 */
async function waitForSceneActive(page, sceneKey, timeout = SCENE_TIMEOUT) {
  await page.waitForFunction(
    (key) => window.__GAME__?.scene?.isActive(key),
    sceneKey,
    { timeout }
  );
}

module.exports = { waitForGameReady, dispatchGameEvent, seedProgressAndBoot, waitForSceneActive, BOOT_TIMEOUT, SCENE_TIMEOUT };
