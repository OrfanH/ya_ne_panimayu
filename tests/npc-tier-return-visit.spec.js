// @ts-check
/**
 * Smoke tests — NPC relationship tiers for 5 non-apartment NPCs.
 *
 * PURPOSE: verify that seeding tier: 1 progress for each NPC and
 * navigating to that scene does not cause JS errors and does not
 * render "undefined" in any dialogue panel text fields.
 *
 * Guards: TASK-085 — Artyom, Lena, Fatima, Konstantin, Alina tier system.
 */
const { test, expect } = require('@playwright/test');
const { BOOT_TIMEOUT, SCENE_TIMEOUT } = require('./helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Shared progress seed — all 5 NPCs at tier 1 with 3 visits each
// ─────────────────────────────────────────────────────────────────────────────

const TIER1_PROGRESS = {
  hasSeenIntro: true,
  chapter: 4,
  unlockedLocations: ['apartment', 'park', 'cafe', 'market', 'station', 'police'],
  completedMissions: [],
  activeMission: null,
  testScores: {},
  lastSession: null,
  hasSeenGraduation: false,
  playerPosition: { scene: 'World', x: 400, y: 300 },
  npcRelationships: {
    galina:     { met: true, tier: 0, visitCount: 1, seenVariations: [] },
    artyom:     { met: true, tier: 1, visitCount: 3, seenVariations: [] },
    lena:       { met: true, tier: 1, visitCount: 3, seenVariations: [] },
    fatima:     { met: true, tier: 1, visitCount: 3, seenVariations: [] },
    konstantin: { met: true, tier: 1, visitCount: 3, seenVariations: [] },
    alina:      { met: true, tier: 1, visitCount: 3, seenVariations: [] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: seed progress, boot to World, start target scene
// ─────────────────────────────────────────────────────────────────────────────

async function seedAndNavigateToScene(page, sceneKey) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.addInitScript((p) => {
    try { localStorage.setItem('progress', JSON.stringify(p)); } catch (_) {}
  }, TIER1_PROGRESS);

  await page.goto('/');
  await page.waitForFunction(
    () => typeof window.__GAME__ !== 'undefined' && window.__GAME__.scene?.isActive('World'),
    { timeout: BOOT_TIMEOUT }
  );

  // Navigate directly to the target scene
  await page.evaluate((key) => {
    window.__GAME__.scene.start(key);
  }, sceneKey);

  await page.waitForFunction(
    (key) => window.__GAME__?.scene?.isActive(key),
    sceneKey,
    { timeout: SCENE_TIMEOUT }
  );

  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: assert no "undefined" in visible dialogue panel text
// ─────────────────────────────────────────────────────────────────────────────

async function assertNoUndefinedInDialogue(page) {
  // Check all text content rendered inside the dialogue panel overlay
  const dialogueText = await page.evaluate(() => {
    const panel = document.getElementById('dialogue-panel') ||
                  document.querySelector('[class*="dialogue"]') ||
                  document.querySelector('[id*="dialogue"]');
    return panel ? panel.textContent : '';
  });
  if (dialogueText) {
    expect(dialogueText, 'dialogue panel must not contain "undefined"').not.toContain('undefined');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests — one per NPC scene
// ─────────────────────────────────────────────────────────────────────────────

test.describe('NPC tier-1 return-visit smoke tests', () => {
  test('Park / Artyom — tier 1 seeds no crash and no "undefined"', async ({ page }) => {
    const errors = await seedAndNavigateToScene(page, 'Park');
    expect(errors, `Uncaught JS exceptions:\n${errors.join('\n')}`).toHaveLength(0);
    await assertNoUndefinedInDialogue(page);
  });

  test('Cafe / Lena — tier 1 seeds no crash and no "undefined"', async ({ page }) => {
    const errors = await seedAndNavigateToScene(page, 'Cafe');
    expect(errors, `Uncaught JS exceptions:\n${errors.join('\n')}`).toHaveLength(0);
    await assertNoUndefinedInDialogue(page);
  });

  test('Market / Fatima — tier 1 seeds no crash and no "undefined"', async ({ page }) => {
    const errors = await seedAndNavigateToScene(page, 'Market');
    expect(errors, `Uncaught JS exceptions:\n${errors.join('\n')}`).toHaveLength(0);
    await assertNoUndefinedInDialogue(page);
  });

  test('Station / Konstantin — tier 1 seeds no crash and no "undefined"', async ({ page }) => {
    const errors = await seedAndNavigateToScene(page, 'Station');
    expect(errors, `Uncaught JS exceptions:\n${errors.join('\n')}`).toHaveLength(0);
    await assertNoUndefinedInDialogue(page);
  });

  test('Police / Alina — tier 1 seeds no crash and no "undefined"', async ({ page }) => {
    const errors = await seedAndNavigateToScene(page, 'Police');
    expect(errors, `Uncaught JS exceptions:\n${errors.join('\n')}`).toHaveLength(0);
    await assertNoUndefinedInDialogue(page);
  });
});
