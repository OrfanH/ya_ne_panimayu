// @ts-check
/**
 * Playthrough spec — full walkthrough of all 6 locations.
 *
 * Per-location tests (Blocks 1–6):
 *   1. Scene is reachable and becomes active
 *   2. First-visit dialogue opens automatically within 2s
 *   3. Advance hint visible when dialogue has no choices (narration phase)
 *   4. Clicking .dialogue-body advances narration to scripted choices
 *   5. All choice buttons contain English text
 *   6. Picking first choice closes dialogue
 *   7. NPC relationship key saved to progress after exchange
 *   8. Mission assigned — HUD .hud-mission-en shows English text
 *   9. Next-location unlock toast fires on first visit
 *
 * Block 7 — Return visits (all locations completed seed):
 *   - Each scene does NOT auto-open first-visit narration
 *   - Manual dialogue:start opens dialogue
 *   - At least 1 choice button visible on manual open
 *   - No JS errors during any return visit
 *
 * NOTE: Park, Café, Market, Station and Police have NO first-visit scripted
 * dialogue pattern. Tests 2–7 are expected to FAIL for those scenes.
 * Failures are filed as TASK-078 through TASK-082.
 *
 * Run: npx playwright test tests/playthrough.spec.js --project=desktop --reporter=list --workers=1
 */

const { test, expect } = require('@playwright/test');
const {
  waitForSceneActive,
  seedProgressAndBoot,
} = require('./helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Progress seeds
// ─────────────────────────────────────────────────────────────────────────────

const BASE = {
  hasSeenIntro: true,
  chapter: 1,
  unlockedLocations: ['apartment'],
  completedMissions: [],
  activeMission: null,
  npcRelationships: {},
  testScores: {},
  lastSession: null,
  hasSeenGraduation: false,
  playerPosition: { scene: 'World', x: 400, y: 300 },
};

const APT_M  = ['story:apartment:1', 'story:apartment:2', 'story:apartment:3'];
const PARK_M = ['story:park:1',      'story:park:2',      'story:park:3'];
const CAFE_M = ['story:cafe:1',      'story:cafe:2'];
const MKT_M  = ['story:market:1',    'story:market:2'];
const STN_M  = ['story:station:1',   'story:station:2'];
const POL_M  = ['story:police:1'];

/** Apartment: first visit — galina never met */
const APT_SEED = { ...BASE };

/** Park: first visit — apartment done, park unlocked */
const PARK_SEED = {
  ...BASE,
  unlockedLocations: ['apartment', 'park'],
  completedMissions: [...APT_M],
  npcRelationships: { galina: { met: true } },
};

/** Café: first visit */
const CAFE_SEED = {
  ...BASE,
  unlockedLocations: ['apartment', 'park', 'cafe'],
  completedMissions: [...APT_M, ...PARK_M],
  npcRelationships: {
    galina: { met: true }, artyom: { met: true }, tamara: { met: true },
  },
};

/** Market: first visit */
const MKT_SEED = {
  ...BASE,
  unlockedLocations: ['apartment', 'park', 'cafe', 'market'],
  completedMissions: [...APT_M, ...PARK_M, ...CAFE_M],
  npcRelationships: {
    galina: { met: true }, artyom: { met: true }, tamara: { met: true },
    lena: { met: true }, boris: { met: true },
  },
};

/** Station: first visit */
const STN_SEED = {
  ...BASE,
  unlockedLocations: ['apartment', 'park', 'cafe', 'market', 'station'],
  completedMissions: [...APT_M, ...PARK_M, ...CAFE_M, ...MKT_M],
  npcRelationships: {
    galina: { met: true }, artyom: { met: true }, tamara: { met: true },
    lena: { met: true }, boris: { met: true },
    fatima: { met: true }, misha: { met: true }, styopan: { met: true },
  },
};

/** Police: first visit */
const POL_SEED = {
  ...BASE,
  unlockedLocations: ['apartment', 'park', 'cafe', 'market', 'station', 'police'],
  completedMissions: [...APT_M, ...PARK_M, ...CAFE_M, ...MKT_M, ...STN_M],
  npcRelationships: {
    galina: { met: true }, artyom: { met: true }, tamara: { met: true },
    lena: { met: true }, boris: { met: true },
    fatima: { met: true }, misha: { met: true }, styopan: { met: true },
    konstantin: { met: true }, nadya: { met: true },
  },
};

/** All locations + missions complete — used for return-visit block */
const ALL_SEED = {
  ...BASE,
  unlockedLocations: ['apartment', 'park', 'cafe', 'market', 'station', 'police'],
  completedMissions: [...APT_M, ...PARK_M, ...CAFE_M, ...MKT_M, ...STN_M, ...POL_M],
  npcRelationships: {
    galina: { met: true }, artyom: { met: true }, tamara: { met: true },
    lena: { met: true }, boris: { met: true },
    fatima: { met: true }, misha: { met: true }, styopan: { met: true },
    konstantin: { met: true }, nadya: { met: true },
    alina: { met: true }, sergei: { met: true },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Block 1 — Apartment (first visit)
//
// ApartmentScene has a full first-visit scripted flow:
//   DIALOGUE_START (narration, choices:[]) → tap advance → DIALOGUE_UPDATE
//   (choices: 3) → pick choice → dialogue closes → galina.met saved.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 1 – Apartment first visit', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, APT_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');
  });

  test('1-1 scene is reachable and becomes active', async ({ page }) => {
    const active = await page.evaluate(() => window.__GAME__.scene.isActive('Apartment'));
    expect(active).toBe(true);
  });

  test('1-2 first-visit dialogue opens automatically within 2s', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('1-3 advance hint is visible when dialogue has no choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await expect(page.locator('.dialogue-advance-hint')).toBeVisible({ timeout: 1000 });
  });

  test('1-4 clicking dialogue body advances narration to scripted choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('1-5 all three scripted choices contain English text', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(3, { timeout: 2000 });
    for (let i = 0; i < 3; i++) {
      const text = await buttons.nth(i).textContent() ?? '';
      expect(/[a-zA-Z]/.test(text), `Choice ${i} has no English text: "${text}"`).toBe(true);
    }
  });

  test('1-6 picking first choice closes dialogue', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
  });

  test('1-7 galina.met saved to progress after first exchange', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
    const progress = await page.evaluate(async () => await getProgress());
    expect(progress.npcRelationships?.galina?.met).toBe(true);
  });

  test('1-8 mission assigned – HUD .hud-mission-en shows English text', async ({ page }) => {
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 3000 });
    const en = await page.locator('.hud-mission-en').textContent();
    expect(/[a-zA-Z]/.test(en ?? ''), `Mission English text empty: "${en}"`).toBe(true);
  });

  test('1-9 park unlock toast fires on first apartment visit', async ({ page }) => {
    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#tutor-status')).toContainText(/park/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Block 2 — Park (first visit)
//
// ParkScene has NO first-visit scripted dialogue. Tests 2-2 through 2-7 are
// expected to fail — filed as TASK-078.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 2 – Park first visit', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, PARK_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Park'));
    await waitForSceneActive(page, 'Park');
  });

  test('2-1 scene is reachable and becomes active', async ({ page }) => {
    const active = await page.evaluate(() => window.__GAME__.scene.isActive('Park'));
    expect(active).toBe(true);
  });

  test('2-2 first-visit dialogue opens automatically within 2s', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('2-3 advance hint is visible when dialogue has no choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await expect(page.locator('.dialogue-advance-hint')).toBeVisible({ timeout: 1000 });
  });

  test('2-4 clicking dialogue body advances narration to scripted choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('2-5 all choice buttons contain English text', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(3, { timeout: 2000 });
    for (let i = 0; i < 3; i++) {
      const text = await buttons.nth(i).textContent() ?? '';
      expect(/[a-zA-Z]/.test(text), `Choice ${i} has no English text: "${text}"`).toBe(true);
    }
  });

  test('2-6 picking first choice closes dialogue', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
  });

  test('2-7 artyom.met saved to progress after first exchange', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
    const progress = await page.evaluate(async () => await getProgress());
    expect(progress.npcRelationships?.artyom?.met).toBe(true);
  });

  test('2-8 mission assigned – HUD .hud-mission-en shows English text', async ({ page }) => {
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 3000 });
    const en = await page.locator('.hud-mission-en').textContent();
    expect(/[a-zA-Z]/.test(en ?? ''), `Mission English text empty: "${en}"`).toBe(true);
  });

  test('2-9 cafe unlock toast fires on first park visit', async ({ page }) => {
    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#tutor-status')).toContainText(/cafe/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Block 3 — Café (first visit)
//
// CafeScene has NO first-visit scripted dialogue. Tests 3-2 through 3-7 are
// expected to fail — filed as TASK-079.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 3 – Café first visit', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, CAFE_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Cafe'));
    await waitForSceneActive(page, 'Cafe');
  });

  test('3-1 scene is reachable and becomes active', async ({ page }) => {
    const active = await page.evaluate(() => window.__GAME__.scene.isActive('Cafe'));
    expect(active).toBe(true);
  });

  test('3-2 first-visit dialogue opens automatically within 2s', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('3-3 advance hint is visible when dialogue has no choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await expect(page.locator('.dialogue-advance-hint')).toBeVisible({ timeout: 1000 });
  });

  test('3-4 clicking dialogue body advances narration to scripted choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('3-5 all choice buttons contain English text', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(3, { timeout: 2000 });
    for (let i = 0; i < 3; i++) {
      const text = await buttons.nth(i).textContent() ?? '';
      expect(/[a-zA-Z]/.test(text), `Choice ${i} has no English text: "${text}"`).toBe(true);
    }
  });

  test('3-6 picking first choice closes dialogue', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
  });

  test('3-7 lena.met saved to progress after first exchange', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
    const progress = await page.evaluate(async () => await getProgress());
    expect(progress.npcRelationships?.lena?.met).toBe(true);
  });

  test('3-8 mission assigned – HUD .hud-mission-en shows English text', async ({ page }) => {
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 3000 });
    const en = await page.locator('.hud-mission-en').textContent();
    expect(/[a-zA-Z]/.test(en ?? ''), `Mission English text empty: "${en}"`).toBe(true);
  });

  test('3-9 market unlock toast fires on first cafe visit', async ({ page }) => {
    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#tutor-status')).toContainText(/market/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Block 4 — Market (first visit)
//
// MarketScene has NO first-visit scripted dialogue. Tests 4-2 through 4-7 are
// expected to fail — filed as TASK-080.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 4 – Market first visit', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, MKT_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Market'));
    await waitForSceneActive(page, 'Market');
  });

  test('4-1 scene is reachable and becomes active', async ({ page }) => {
    const active = await page.evaluate(() => window.__GAME__.scene.isActive('Market'));
    expect(active).toBe(true);
  });

  test('4-2 first-visit dialogue opens automatically within 2s', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('4-3 advance hint is visible when dialogue has no choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await expect(page.locator('.dialogue-advance-hint')).toBeVisible({ timeout: 1000 });
  });

  test('4-4 clicking dialogue body advances narration to scripted choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('4-5 all choice buttons contain English text', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(3, { timeout: 2000 });
    for (let i = 0; i < 3; i++) {
      const text = await buttons.nth(i).textContent() ?? '';
      expect(/[a-zA-Z]/.test(text), `Choice ${i} has no English text: "${text}"`).toBe(true);
    }
  });

  test('4-6 picking first choice closes dialogue', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
  });

  test('4-7 fatima.met saved to progress after first exchange', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
    const progress = await page.evaluate(async () => await getProgress());
    expect(progress.npcRelationships?.fatima?.met).toBe(true);
  });

  test('4-8 mission assigned – HUD .hud-mission-en shows English text', async ({ page }) => {
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 3000 });
    const en = await page.locator('.hud-mission-en').textContent();
    expect(/[a-zA-Z]/.test(en ?? ''), `Mission English text empty: "${en}"`).toBe(true);
  });

  test('4-9 train station unlock toast fires on first market visit', async ({ page }) => {
    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#tutor-status')).toContainText(/station/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Block 5 — Station (first visit)
//
// StationScene has NO first-visit scripted dialogue. Tests 5-2 through 5-7 are
// expected to fail — filed as TASK-081.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 5 – Station first visit', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, STN_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Station'));
    await waitForSceneActive(page, 'Station');
  });

  test('5-1 scene is reachable and becomes active', async ({ page }) => {
    const active = await page.evaluate(() => window.__GAME__.scene.isActive('Station'));
    expect(active).toBe(true);
  });

  test('5-2 first-visit dialogue opens automatically within 2s', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('5-3 advance hint is visible when dialogue has no choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await expect(page.locator('.dialogue-advance-hint')).toBeVisible({ timeout: 1000 });
  });

  test('5-4 clicking dialogue body advances narration to scripted choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('5-5 all choice buttons contain English text', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(3, { timeout: 2000 });
    for (let i = 0; i < 3; i++) {
      const text = await buttons.nth(i).textContent() ?? '';
      expect(/[a-zA-Z]/.test(text), `Choice ${i} has no English text: "${text}"`).toBe(true);
    }
  });

  test('5-6 picking first choice closes dialogue', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
  });

  test('5-7 konstantin.met saved to progress after first exchange', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
    const progress = await page.evaluate(async () => await getProgress());
    expect(progress.npcRelationships?.konstantin?.met).toBe(true);
  });

  test('5-8 mission assigned – HUD .hud-mission-en shows English text', async ({ page }) => {
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 3000 });
    const en = await page.locator('.hud-mission-en').textContent();
    expect(/[a-zA-Z]/.test(en ?? ''), `Mission English text empty: "${en}"`).toBe(true);
  });

  test('5-9 police station unlock toast fires on first station visit', async ({ page }) => {
    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#tutor-status')).toContainText(/police/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Block 6 — Police (first visit)
//
// PoliceScene has NO first-visit scripted dialogue and is the FINAL location
// (no next-location unlock toast). Tests 6-2 through 6-7 are expected to fail
// — filed as TASK-082. Test 6-9 is absent (final location, no next unlock).
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 6 – Police first visit', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, POL_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Police'));
    await waitForSceneActive(page, 'Police');
  });

  test('6-1 scene is reachable and becomes active', async ({ page }) => {
    const active = await page.evaluate(() => window.__GAME__.scene.isActive('Police'));
    expect(active).toBe(true);
  });

  test('6-2 first-visit dialogue opens automatically within 2s', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('6-3 advance hint is visible when dialogue has no choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await expect(page.locator('.dialogue-advance-hint')).toBeVisible({ timeout: 1000 });
  });

  test('6-4 clicking dialogue body advances narration to scripted choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('6-5 all choice buttons contain English text', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(3, { timeout: 2000 });
    for (let i = 0; i < 3; i++) {
      const text = await buttons.nth(i).textContent() ?? '';
      expect(/[a-zA-Z]/.test(text), `Choice ${i} has no English text: "${text}"`).toBe(true);
    }
  });

  test('6-6 picking first choice closes dialogue', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
  });

  test('6-7 alina.met saved to progress after first exchange', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
    const progress = await page.evaluate(async () => await getProgress());
    expect(progress.npcRelationships?.alina?.met).toBe(true);
  });

  test('6-8 mission assigned – HUD .hud-mission-en shows English text', async ({ page }) => {
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 3000 });
    const en = await page.locator('.hud-mission-en').textContent();
    expect(/[a-zA-Z]/.test(en ?? ''), `Mission English text empty: "${en}"`).toBe(true);
  });

  // 6-9 is intentionally absent — Police is the final location; no next unlock toast fires.
});

// ─────────────────────────────────────────────────────────────────────────────
// Block 7 — Return visits (all locations + missions complete)
//
// Verifies that re-entering any scene does NOT auto-open first-visit narration.
// Verifies that a manual dialogue:start event opens the overlay with choices.
// Verifies no JS errors fire during return visits to all 6 scenes.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Block 7 – Return visits (all complete)', () => {
  const ALL_SCENES = [
    { key: 'Apartment', npcId: 'galina',    npcName: 'Галина Ивановна' },
    { key: 'Park',      npcId: 'artyom',    npcName: 'Артём'           },
    { key: 'Cafe',      npcId: 'lena',      npcName: 'Лена'            },
    { key: 'Market',    npcId: 'fatima',    npcName: 'Фатима'          },
    { key: 'Station',   npcId: 'konstantin',npcName: 'Константин'      },
    { key: 'Police',    npcId: 'alina',     npcName: 'Алина'           },
  ];

  for (const { key } of ALL_SCENES) {
    test(`7-return ${key} does NOT auto-open first-visit narration`, async ({ page }) => {
      await seedProgressAndBoot(page, ALL_SEED);
      await page.evaluate((k) => window.__GAME__.scene.start(k), key);
      await waitForSceneActive(page, key);
      await page.waitForTimeout(700); // let any delayed auto-triggers fire
      const isActive = await page.locator('#dialogue-overlay').evaluate(
        (el) => el.classList.contains('is-active')
      );
      expect(isActive, `Dialogue should not auto-open on return visit to ${key}`).toBe(false);
    });
  }

  test('7-manual manual dialogue:start opens overlay with choices in Apartment', async ({ page }) => {
    await seedProgressAndBoot(page, ALL_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('dialogue:start', {
        detail: {
          npcId: 'galina',
          npcName: 'Галина Ивановна',
          russian: 'Снова вы.',
          translation: 'You again.',
          choices: [{ id: 'yes', russian: 'Да.', translation: 'Yes.', isFinal: true }],
        },
      }));
    });
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 1000 });
    await expect(page.locator('.dialogue-choice-btn').first()).toBeVisible({ timeout: 1000 });
  });

  test('7-choice at least 1 choice button visible on manual open', async ({ page }) => {
    await seedProgressAndBoot(page, ALL_SEED);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('dialogue:start', {
        detail: {
          npcId: 'galina',
          npcName: 'Галина Ивановна',
          russian: 'Как дела?',
          translation: 'How are you?',
          choices: [
            { id: 'good', russian: 'Хорошо.', translation: 'Good.', isFinal: false },
            { id: 'bad',  russian: 'Плохо.',  translation: 'Bad.',  isFinal: true  },
          ],
        },
      }));
    });
    const count = await page.locator('.dialogue-choice-btn').count();
    expect(count, 'Expected at least 1 choice button on manual dialogue open').toBeGreaterThanOrEqual(1);
  });

  test('7-errors no JS errors during return visits to all 6 scenes', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await seedProgressAndBoot(page, ALL_SEED);

    for (const { key } of ALL_SCENES) {
      await page.evaluate((k) => window.__GAME__.scene.start(k), key);
      await waitForSceneActive(page, key);
      await page.waitForTimeout(300);
    }

    expect(errors, `JS errors during return visits:\n${errors.join('\n')}`).toHaveLength(0);
  });
});
