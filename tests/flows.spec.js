// @ts-check
/**
 * Interactive flow tests — end-to-end player paths through the game.
 *
 * PURPOSE: catch the class of bug that structural tests miss.
 *   Structural tests ask "does this element exist?"
 *   Flow tests ask  "can the player actually DO this?"
 *
 * Each test simulates what a real player does — scene navigation, clicking,
 * key presses, waiting — and asserts the result they would see.
 *
 * Historically missed bugs this spec would have caught:
 *   BUG-023 — narration phase has no advance affordance (dialogue appears frozen)
 *   BUG-020 — first-visit scripted choices had no English translation
 *   BUG-021 — loading state left player with zero choices indefinitely
 */
const { test, expect } = require('@playwright/test');
const {
  waitForGameReady,
  waitForSceneActive,
  seedProgressAndBoot,
  BOOT_TIMEOUT,
} = require('./helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Shared state seeds
// ─────────────────────────────────────────────────────────────────────────────

/** Progress: intro seen, galina never met → triggers first-visit narration */
const FIRST_VISIT_PROGRESS = {
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

/** Progress: galina already met → skips narration, return-visit mode */
const RETURN_VISIT_PROGRESS = {
  ...FIRST_VISIT_PROGRESS,
  unlockedLocations: ['apartment', 'park'],
  npcRelationships: { galina: { met: true } },
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. First-visit onboarding flow
//
// Guards: BUG-023 (narration dead-end), BUG-020 (no English on choices)
// Path:   Boot → ApartmentScene → narration opens → advance → choices appear
//         → pick choice → dialogue closes → galina.met saved
// ─────────────────────────────────────────────────────────────────────────────
test.describe('First-visit onboarding flow', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, FIRST_VISIT_PROGRESS);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');
  });

  test('narration dialogue opens automatically within 2s', async ({ page }) => {
    // ApartmentScene fires DIALOGUE_START after 350ms + async getProgress
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
  });

  test('narration phase shows an advance affordance — no dead-end (BUG-023)', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });

    // After fix: a visible advance hint element must be present when choices are empty.
    // The .dialogue-advance-hint is injected by _populate() when effectiveChoices === [].
    // FAILS until BUG-023 is fixed.
    const advanceHint = page.locator('.dialogue-advance-hint');
    await expect(advanceHint).toBeVisible({ timeout: 1000 });
  });

  test('clicking dialogue body advances narration to scripted choices', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });

    // Wait for OPEN phase (CSS transition + 400ms fallback)
    await page.waitForTimeout(600);

    // Click the dialogue body text area (not the EN toggle button)
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });

    // After __advance__, ApartmentScene._onDialogueChoice fires and dispatches
    // DIALOGUE_UPDATE with 3 scripted choices (from VARIATIONS[0].lines[0])
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('Enter key advances narration to scripted choices (BUG-023 keyboard gap)', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);

    // Enter key should advance narration — FAILS until BUG-023 wires Enter in dialogue.js
    await page.keyboard.press('Enter');

    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
  });

  test('all three scripted choices contain English text', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });

    const buttons = page.locator('.dialogue-choice-btn');
    await expect(buttons).toHaveCount(3, { timeout: 2000 });

    for (let i = 0; i < 3; i++) {
      const text = await buttons.nth(i).textContent() ?? '';
      expect(
        /[a-zA-Z]/.test(text),
        `Choice button ${i} has no English text: "${text}"`
      ).toBe(true);
    }
  });

  test('picking a scripted choice closes the dialogue', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });

    // Pick the first choice — its response has isFinal:true → dialogue closes
    await page.locator('.dialogue-choice-btn').first().click();

    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });
  });

  test('galina.met is saved to progress after first exchange', async ({ page }) => {
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    await expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 });
    await page.locator('.dialogue-choice-btn').first().click();
    await expect(page.locator('#dialogue-overlay')).not.toHaveClass(/is-active/, { timeout: 3000 });

    // _onDialogueEnd in ApartmentScene saves galina: { met: true }
    const progress = await page.evaluate(async () => await getProgress());
    expect(progress.npcRelationships?.galina?.met).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Return-visit flow
//
// Guards: first-visit narration not re-shown on subsequent visits
// Path:   Boot → ApartmentScene (galina met) → no auto dialogue
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Return-visit apartment flow', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgressAndBoot(page, RETURN_VISIT_PROGRESS);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');
    // Give time for any auto-triggers to fire
    await page.waitForTimeout(600);
  });

  test('narration does NOT auto-open on return visit', async ({ page }) => {
    // With galina.met === true, _firstVisitScripted is set to false → no auto DIALOGUE_START
    const isActive = await page.locator('#dialogue-overlay').evaluate(
      el => el.classList.contains('is-active')
    );
    expect(isActive, 'Dialogue should not auto-open on return visit').toBe(false);
  });

  test('player can manually trigger dialogue via NPC interaction event', async ({ page }) => {
    // Simulate what pressing E near Galina would do — fire npc:interact
    // (NPC._startDialogue fires DIALOGUE_START after proximity check)
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
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Scene transition flows
//
// Guards: player can enter and exit scenes; scene state is clean on re-entry
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Scene transitions', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('ApartmentScene is reachable from WorldScene via scene.start', async ({ page }) => {
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');
    const isActive = await page.evaluate(() => window.__GAME__.scene.isActive('Apartment'));
    expect(isActive).toBe(true);
  });

  test('ApartmentScene exit zone returns player to WorldScene', async ({ page }) => {
    await seedProgressAndBoot(page, RETURN_VISIT_PROGRESS);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');

    // Teleport player below exit threshold (y >= sceneH - tileSize = 9*32 - 32 = 256)
    await page.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('Apartment');
      if (scene && scene._player) {
        scene._player.gameObject.setY(280);
      }
    });

    // Wait for scene transition (fade out + scene.start('World'))
    await page.waitForFunction(
      () => window.__GAME__?.scene?.isActive('World'),
      { timeout: 5000 }
    );
    const isWorld = await page.evaluate(() => window.__GAME__.scene.isActive('World'));
    expect(isWorld, 'Should be back in WorldScene after exit').toBe(true);
  });

  test('WorldScene has only one active scene after ApartmentScene exits', async ({ page }) => {
    await seedProgressAndBoot(page, RETURN_VISIT_PROGRESS);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');

    await page.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('Apartment');
      if (scene && scene._player) { scene._player.gameObject.setY(280); }
    });

    await page.waitForFunction(
      () => window.__GAME__?.scene?.isActive('World'),
      { timeout: 5000 }
    );

    // Extra settle time: Phaser stops Apartment after World starts, needs a tick to finalise
    await page.waitForTimeout(500);

    const activeScenes = await page.evaluate(() =>
      window.__GAME__.scene.getScenes(true).map(s => s.sys.settings.key)
    );
    expect(activeScenes).toHaveLength(1);
    expect(activeScenes).toContain('World');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Mission system flows
//
// Guards: missions activate, HUD shows English, unlock toast fires
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Mission system flows', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('HUD mission slot shows English subtitle when mission:start fires', async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('mission:start', {
        detail: {
          title: 'Знакомство',
          titleEn: 'Meet your neighbor Galina',
        },
      }));
    });

    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 1000 });
    await expect(page.locator('.hud-mission-en')).toContainText('Meet your neighbor Galina');
  });

  test('mission:complete fires HUD toast then clears mission slot', async ({ page }) => {
    // Start a mission first
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('mission:start', {
        detail: { title: 'Знакомство', titleEn: 'Meet your neighbor Galina' },
      }));
    });
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 1000 });

    // Complete it
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('mission:complete', {
        detail: { id: 'story:apartment:1', titleEn: 'Meet your neighbor Galina' },
      }));
    });

    // Toast should appear
    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 2000 });

    // Mission slot should clear after ~800ms (500ms delay + toast timing)
    await expect(page.locator('.hud-mission')).not.toHaveClass(/is-visible/, { timeout: 4000 });
  });

  test('StoryMissions assigns first mission on first location:enter', async ({ page }) => {
    // Clear activeMission so StoryMissions can assign
    await page.evaluate(async () => {
      const p = await getProgress();
      p.activeMission = null;
      p.completedMissions = [];
      p.unlockedLocations = ['apartment'];
      await saveProgress(p);
    });

    // Fire location:enter — StoryMissions._checkAndAssign() runs
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('location:enter', { detail: { name: 'Apartment Building' } }));
    });

    // Give StoryMissions time to assign and fire mission:start
    await expect(page.locator('.hud-mission')).toHaveClass(/is-visible/, { timeout: 3000 });
    await expect(page.locator('.hud-mission-title')).not.toBeEmpty();
  });

  test('unlock toast appears when hud:toast fires', async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('hud:toast', {
        detail: { message: 'The park is now open!', duration: 3000 },
      }));
    });

    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 1000 });
    await expect(page.locator('#tutor-status')).toContainText('The park is now open!');
  });

  test('park unlock toast fires automatically on first apartment visit', async ({ page }) => {
    // Apartment unlocked but park not yet — first visit should push park and show toast
    await seedProgressAndBoot(page, FIRST_VISIT_PROGRESS);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');

    await expect(page.locator('#tutor-status')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#tutor-status')).toContainText(/park/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Dialogue advance keyboard — Enter key
//
// Guards: KEYBOARD_SHORTCUTS.ADVANCE_DIALOGUE actually works in dialogue
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Dialogue keyboard shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameReady(page);
  });

  test('Enter key closes dialogue when no choices (tap-to-advance equivalent)', async ({ page }) => {
    // Open dialogue with no choices — exactly the narration state
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('dialogue:start', {
        detail: {
          npcId: 'test',
          npcName: 'Тест',
          russian: 'Ваша соседка стучит.',
          translation: 'Your neighbor knocks.',
          choices: [],
        },
      }));
    });
    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 1000 });
    await page.waitForTimeout(500); // wait for OPEN phase

    // Listen for __advance__ being dispatched
    const advanceFired = await page.evaluate(() => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), 2000);
        window.addEventListener('dialogue:choice', (e) => {
          if (e.detail?.choiceId === '__advance__') {
            clearTimeout(timeout);
            resolve(true);
          }
        }, { once: true });
      });
    }, { timeout: 3000 }).catch(() => false);

    // Trigger the check after setting up listener (re-evaluate with key press)
    // Note: the evaluate above will race — use a different approach
    // Just verify Enter key dispatches dialogue:choice __advance__
    const resultPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), 2000);
        window.addEventListener('dialogue:choice', (e) => {
          if (e.detail?.choiceId === '__advance__') {
            clearTimeout(timeout);
            resolve(true);
          }
        }, { once: true });
      });
    });

    await page.keyboard.press('Enter');
    const fired = await resultPromise;
    // FAILS until BUG-023 wires Enter key in dialogue.js
    expect(fired, 'Enter key should dispatch dialogue:choice __advance__').toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. No JS errors during key flows
//
// Guards: scene transitions, dialogue flows, and mission events don't throw
// ─────────────────────────────────────────────────────────────────────────────
test.describe('No crashes during flows', () => {
  test('entering and exiting ApartmentScene produces no JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await seedProgressAndBoot(page, RETURN_VISIT_PROGRESS);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');
    await page.waitForTimeout(500);

    // Exit
    await page.evaluate(() => {
      const scene = window.__GAME__.scene.getScene('Apartment');
      if (scene && scene._player) { scene._player.gameObject.setY(280); }
    });
    await page.waitForFunction(
      () => window.__GAME__?.scene?.isActive('World'),
      { timeout: 5000 }
    );

    expect(errors, `JS errors during scene flow:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('full first-visit onboarding flow produces no JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await seedProgressAndBoot(page, FIRST_VISIT_PROGRESS);
    await page.evaluate(() => window.__GAME__.scene.start('Apartment'));
    await waitForSceneActive(page, 'Apartment');

    await expect(page.locator('#dialogue-overlay')).toHaveClass(/is-active/, { timeout: 2000 });
    await page.waitForTimeout(600);
    await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true });
    // Don't check choice count here — this test only checks for JS errors
    await page.waitForTimeout(500);

    expect(errors, `JS errors during onboarding:\n${errors.join('\n')}`).toHaveLength(0);
  });
});
