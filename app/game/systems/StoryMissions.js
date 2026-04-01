/* ============================================
   StoryMissions — hardcoded story missions per location.
   Gives the player structured goals through each location.
   Integrates with MissionGenerator: story missions take
   priority over generated practice missions.
   No DOM. No Phaser. Storage via storage.js only.
   ============================================ */

const StoryMissions = (() => {
  // -----------------------------------------------------------
  // Story mission definitions — ordered per location.
  // Each mission fires once, tracked via completedMissions[].
  // successCondition: 'dialogue_complete' — just talk to the NPC.
  // successCondition: 'vocab_count' — learn N words at location.
  // -----------------------------------------------------------
  const MISSIONS = [
    // ---- Apartment (chapter 1) ----
    {
      id: 'story:apartment:1',
      title: 'Знакомство',
      titleEn: 'Meet your neighbor Galina',
      location: 'apartment',
      targetNpcId: 'galina',
      type: 'conversation',
      objectiveEn: 'Enter the apartment building and introduce yourself to Galina',
      successCondition: 'dialogue_complete',
      chapter: 1,
      order: 1,
    },
    {
      id: 'story:apartment:2',
      title: 'Новые слова',
      titleEn: 'Learn 5 greeting words',
      location: 'apartment',
      targetNpcId: 'galina',
      type: 'conversation',
      objectiveEn: 'Talk to Galina and learn at least 5 new words',
      successCondition: 'vocab_count',
      vocabTarget: 5,
      chapter: 1,
      order: 2,
    },
    {
      id: 'story:apartment:3',
      title: 'Прощание',
      titleEn: 'Say goodbye to Galina properly',
      location: 'apartment',
      targetNpcId: 'galina',
      type: 'conversation',
      objectiveEn: 'Have one more conversation with Galina before exploring the town',
      successCondition: 'dialogue_complete',
      chapter: 1,
      order: 3,
    },

    // ---- Park (chapter 2) ----
    {
      id: 'story:park:1',
      title: 'В парке',
      titleEn: 'Meet Artyom in the park',
      location: 'park',
      targetNpcId: 'artyom',
      type: 'conversation',
      objectiveEn: 'Find Artyom on the park bench and introduce yourself',
      successCondition: 'dialogue_complete',
      chapter: 2,
      order: 1,
    },
    {
      id: 'story:park:2',
      title: 'Тамара Андреевна',
      titleEn: 'Talk to Tamara by the fountain',
      location: 'park',
      targetNpcId: 'tamara',
      type: 'conversation',
      objectiveEn: 'Tamara is near the fountain — practice formal greetings with her',
      successCondition: 'dialogue_complete',
      chapter: 2,
      order: 2,
    },
    {
      id: 'story:park:3',
      title: 'Направо и налево',
      titleEn: 'Learn directions from Artyom',
      location: 'park',
      targetNpcId: 'artyom',
      type: 'conversation',
      objectiveEn: 'Ask Artyom about the town — learn direction words',
      successCondition: 'vocab_count',
      vocabTarget: 12,
      chapter: 2,
      order: 3,
    },

    // ---- Cafe (chapter 3) ----
    {
      id: 'story:cafe:1',
      title: 'Кофе',
      titleEn: 'Order something at the cafe',
      location: 'cafe',
      targetNpcId: 'lena',
      type: 'conversation',
      objectiveEn: 'Find the cafe and talk to Lena behind the counter',
      successCondition: 'dialogue_complete',
      chapter: 3,
      order: 1,
    },
    {
      id: 'story:cafe:2',
      title: 'Борис',
      titleEn: 'Talk to Boris by the window',
      location: 'cafe',
      targetNpcId: 'boris',
      type: 'conversation',
      objectiveEn: 'Boris is sitting by the window — see what he has to say',
      successCondition: 'dialogue_complete',
      chapter: 3,
      order: 2,
    },

    // ---- Market (chapter 3) ----
    {
      id: 'story:market:1',
      title: 'На рынке',
      titleEn: 'Visit the market',
      location: 'market',
      targetNpcId: 'fatima',
      type: 'conversation',
      objectiveEn: 'Find Fatima at her produce stall and learn some market vocabulary',
      successCondition: 'dialogue_complete',
      chapter: 3,
      order: 3,
    },
    {
      id: 'story:market:2',
      title: 'Хлеб',
      titleEn: 'Talk to Misha the bread vendor',
      location: 'market',
      targetNpcId: 'misha',
      type: 'conversation',
      objectiveEn: 'Misha sells bread — have a conversation with him',
      successCondition: 'dialogue_complete',
      chapter: 3,
      order: 4,
    },

    // ---- Station (chapter 4) ----
    {
      id: 'story:station:1',
      title: 'Вокзал',
      titleEn: 'Visit the train station',
      location: 'station',
      targetNpcId: 'konstantin',
      type: 'conversation',
      objectiveEn: 'Talk to Konstantin at the ticket window',
      successCondition: 'dialogue_complete',
      chapter: 4,
      order: 1,
    },
    {
      id: 'story:station:2',
      title: 'Расписание',
      titleEn: 'Ask about the train schedule',
      location: 'station',
      targetNpcId: 'nadya',
      type: 'conversation',
      objectiveEn: 'Nadya knows the schedule — learn time-related vocabulary',
      successCondition: 'dialogue_complete',
      chapter: 4,
      order: 2,
    },

    // ---- Police (chapter 4) ----
    {
      id: 'story:police:1',
      title: 'Полиция',
      titleEn: 'Visit the police station',
      location: 'police',
      targetNpcId: 'alina',
      type: 'conversation',
      objectiveEn: 'Talk to Officer Alina — practice formal Russian',
      successCondition: 'dialogue_complete',
      chapter: 4,
      order: 3,
    },
  ];

  let _lastDialogueNpcId = null;

  // -----------------------------------------------------------
  // Find the next unfinished story mission the player can access
  // -----------------------------------------------------------
  function _getNextMission(progress) {
    const completed = progress.completedMissions || [];
    const unlocked = progress.unlockedLocations || ['apartment'];

    for (const mission of MISSIONS) {
      if (completed.includes(mission.id)) { continue; }
      if (!unlocked.includes(mission.location)) { continue; }
      return mission;
    }
    return null;
  }

  // -----------------------------------------------------------
  // Check vocab_count condition
  // -----------------------------------------------------------
  async function _checkVocabCondition(mission) {
    try {
      const vocab = await getVocabulary();
      const count = (vocab.words || []).length;
      return count >= (mission.vocabTarget || 0);
    } catch {
      return false;
    }
  }

  // -----------------------------------------------------------
  // Assign the next story mission if none is active
  // -----------------------------------------------------------
  async function _checkAndAssign() {
    try {
      const progress = await getProgress();

      // Don't overwrite an active mission (story or generated)
      if (progress.activeMission) { return; }

      const mission = _getNextMission(progress);
      if (!mission) { return; }

      progress.activeMission = Object.assign({ generated: false }, mission);
      await saveProgress(progress);

      window.dispatchEvent(new CustomEvent(EVENTS.MISSION_START, {
        detail: { title: mission.title, titleEn: mission.titleEn },
      }));
    } catch {
      /* silent — game continues */
    }
  }

  // -----------------------------------------------------------
  // Check if all missions for a location are complete; if so,
  // persist completedLocations and fire LOCATION_COMPLETE
  // -----------------------------------------------------------
  async function _checkLocationComplete(missionId, progress) {
    const parts = missionId.split(':');
    const locationId = parts[1];
    if (!locationId) { return; }

    const locationMissions = MISSIONS.filter((m) => m.location === locationId);
    if (locationMissions.length === 0) { return; }

    const completedMissions = progress.completedMissions || [];
    const allDone = locationMissions.every((m) => completedMissions.includes(m.id));
    if (!allDone) { return; }

    const completedLocations = progress.completedLocations || [];
    if (completedLocations.includes(locationId)) { return; }

    completedLocations.push(locationId);
    progress.completedLocations = completedLocations;
    await saveProgress(progress);

    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_COMPLETE, {
      detail: { locationId },
    }));
  }

  // -----------------------------------------------------------
  // On dialogue end — check if the active story mission is done
  // -----------------------------------------------------------
  async function _onDialogueEnd() {
    try {
      const progress = await getProgress();
      const mission = progress.activeMission;

      if (!mission || mission.generated === true) { return; }

      let complete = false;

      if (mission.successCondition === 'dialogue_complete') {
        // Complete if player talked to the target NPC
        complete = _lastDialogueNpcId === mission.targetNpcId;
      } else if (mission.successCondition === 'vocab_count') {
        complete = await _checkVocabCondition(mission);
      }

      if (complete) {
        const completed = progress.completedMissions || [];
        completed.push(mission.id);
        progress.completedMissions = completed;
        progress.activeMission = null;
        await saveProgress(progress);

        window.dispatchEvent(new CustomEvent(EVENTS.MISSION_COMPLETE, {
          detail: { id: mission.id, titleEn: mission.titleEn },
        }));

        await _checkLocationComplete(mission.id, progress);

        // Check for next story mission after a short delay
        setTimeout(() => { _checkAndAssign(); }, 500);
      }
    } catch {
      /* silent */
    }
  }

  function _onDialogueStart(e) {
    const detail = e.detail || {};
    _lastDialogueNpcId = detail.npcId || null;
  }

  function _onLocationEnter() {
    _checkAndAssign();
  }

  // -----------------------------------------------------------
  // Init
  // -----------------------------------------------------------
  function init() {
    window.addEventListener(EVENTS.LOCATION_ENTER, _onLocationEnter);
    window.addEventListener(EVENTS.DIALOGUE_START, _onDialogueStart);
    window.addEventListener(EVENTS.DIALOGUE_END, _onDialogueEnd);

    // Assign first mission on boot if needed
    _checkAndAssign();
  }

  function destroy() {
    window.removeEventListener(EVENTS.LOCATION_ENTER, _onLocationEnter);
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
