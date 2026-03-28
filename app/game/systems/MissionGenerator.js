/* ============================================
   MissionGenerator — generates targeted missions
   from MistakeLogger data, delivered via existing NPCs.
   No DOM. No Phaser. Storage via storage.js only.
   ============================================ */

const MissionGenerator = (() => {
  const MISTAKE_THRESHOLD = 3;

  const LOCATION_NPC_MAP = {
    apartment: 'galina',
    park: 'artyom',
    cafe: 'lena',
    market: 'fatima',
    station: 'konstantin',
    police: 'alina',
  };

  const STORY_REASONS = {
    galina:     (w) => `Galina has a shopping list and keeps forgetting "${w}". She wants you to practise saying it before going out.`,
    artyom:     (w) => `Artyom is helping a friend and needs to explain "${w}" — he wants to make sure he has it right.`,
    lena:       (w) => `Lena is writing a new menu item. She needs to know the right word for "${w}" before the sign goes up.`,
    fatima:     (w) => `Fatima is training a new stall assistant. She wants you to help explain what "${w}" means to a customer.`,
    konstantin: (w) => `Konstantin is filling in a form and the word "${w}" keeps coming up. He asks if you can double-check it with him.`,
    alina:      (w) => `Alina is updating the public notice board. She wants to confirm "${w}" is written correctly.`,
  };

  const DEFAULT_REASON = (w) => `Someone in town needs help with the word "${w}".`;

  const NPC_NAMES = {
    galina: 'Galina',
    artyom: 'Artyom',
    lena: 'Lena',
    fatima: 'Fatima',
    konstantin: 'Konstantin',
    alina: 'Alina',
  };

  let _lastDialogueNpcId = null;

  async function _checkAndGenerate() {
    try {
      const mistakes = await getMistakeList();
      const progress = await getProgress();

      if (progress.activeMission) { return; }

      const completed = progress.completedMissions || [];

      const qualifying = mistakes
        .filter((entry) => entry.count >= MISTAKE_THRESHOLD)
        .filter((entry) => !completed.some((id) => id.startsWith(`gen:${entry.word}:`)));

      if (qualifying.length === 0) { return; }

      const entry = qualifying[0];
      const word = entry.word;
      const npcId = entry.npcId || LOCATION_NPC_MAP[entry.location] || 'galina';
      const npcName = NPC_NAMES[npcId] || npcId;
      const reasonFn = STORY_REASONS[npcId] || DEFAULT_REASON;
      const timestamp = new Date().toISOString();
      const id = `gen:${word}:${Date.now()}`;

      const mission = {
        id,
        generated: true,
        title: word,
        titleEn: `Help ${npcName} with "${word}"`,
        location: entry.location || '',
        givenBy: npcId,
        type: 'conversation',
        objectiveEn: `Visit ${npcName} and practise using "${word}" in conversation`,
        storyReason: reasonFn(word),
        requiredVocabulary: [word],
        requiredGrammar: '',
        successCondition: 'dialogue_complete',
        targetNpcId: npcId,
        createdAt: timestamp,
      };

      progress.activeMission = mission;
      await saveProgress(progress);
    } catch {
      /* silent — game continues */
    }
  }

  async function _onDialogueEnd() {
    try {
      const progress = await getProgress();
      const mission = progress.activeMission;

      if (
        mission &&
        mission.generated === true &&
        _lastDialogueNpcId === mission.targetNpcId
      ) {
        const completed = progress.completedMissions || [];
        completed.push(mission.id);
        progress.completedMissions = completed;
        progress.activeMission = null;
        await saveProgress(progress);

        window.dispatchEvent(new CustomEvent(EVENTS.MISSION_COMPLETE, {
          detail: { id: mission.id, titleEn: mission.titleEn },
        }));
      }

      await _checkAndGenerate();
    } catch {
      /* silent — game continues */
    }
  }

  function _onDialogueStart(e) {
    const detail = e.detail || {};
    _lastDialogueNpcId = detail.npcId || null;
  }

  function _onLocationEnter() {
    _checkAndGenerate();
  }

  function _onTestEnd(e) {
    const detail = e.detail || {};
    if (detail.passed === false) {
      _checkAndGenerate();
    }
  }

  function init() {
    window.addEventListener(EVENTS.LOCATION_ENTER, _onLocationEnter);
    window.addEventListener(EVENTS.TEST_END, _onTestEnd);
    window.addEventListener(EVENTS.DIALOGUE_START, _onDialogueStart);
    window.addEventListener(EVENTS.DIALOGUE_END, _onDialogueEnd);
  }

  function destroy() {
    window.removeEventListener(EVENTS.LOCATION_ENTER, _onLocationEnter);
    window.removeEventListener(EVENTS.TEST_END, _onTestEnd);
    window.removeEventListener(EVENTS.DIALOGUE_START, _onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_END, _onDialogueEnd);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, destroy };
})();
