/* ============================================
   Session — lesson state, phase tracking, keyboard shortcuts
   ============================================ */

let currentLessonData = null;
let currentPhaseIndex = 0;
let drillIndex = 0;
let drillCorrect = 0;
let testAnswers = [];
let testIndex = 0;

async function loadLesson(lessonId) {
  const parts = lessonId.split('-');
  const unit = parseInt(parts[0], 10);
  let block = 'block-1-foundation';
  if (unit >= 3 && unit <= 6) block = 'block-2-grammar';
  if (unit >= 7) block = 'block-3-everyday';

  const url = `${CURRICULUM_PATH}/${block}/lesson-${lessonId}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    currentLessonData = await res.json();
    return currentLessonData;
  } catch {
    return null;
  }
}

function getCurrentPhase() {
  if (!currentLessonData) return null;
  const phases = currentLessonData.phases;
  const phaseKeys = ['hook', 'explain', 'deepen', 'drill'];

  if (currentPhaseIndex < phaseKeys.length) {
    return { name: phaseKeys[currentPhaseIndex], data: phases[phaseKeys[currentPhaseIndex]] };
  }
  if (currentPhaseIndex === 4) {
    return { name: 'test', data: currentLessonData.test };
  }
  if (currentPhaseIndex === 5) {
    return { name: 'feedback', data: null };
  }
  if (currentPhaseIndex === 6) {
    return { name: 'summary', data: phases.summary };
  }
  return null;
}

function advancePhase() {
  if (currentPhaseIndex < PHASE_COUNT - 1) {
    currentPhaseIndex += 1;
    return true;
  }
  return false;
}

function goToPhase(index) {
  if (index >= 0 && index < PHASE_COUNT) {
    currentPhaseIndex = index;
    return true;
  }
  return false;
}

function resetDrill() {
  drillIndex = 0;
  drillCorrect = 0;
}

function resetTest() {
  testAnswers = [];
  testIndex = 0;
}

function submitDrillAnswer(answer) {
  if (!currentLessonData) return null;
  const questions = currentLessonData.phases.drill.questions;
  if (drillIndex >= questions.length) return null;

  const question = questions[drillIndex];
  const correct = answer.trim().toLowerCase() === question.answer.trim().toLowerCase();

  if (correct) drillCorrect += 1;

  const result = {
    correct,
    expected: question.answer,
    explanation: question.explanation,
    index: drillIndex,
    total: questions.length,
  };

  drillIndex += 1;
  return result;
}

function submitTestAnswer(answer) {
  if (!currentLessonData || !currentLessonData.test) return null;
  const questions = currentLessonData.test.questions;
  if (testIndex >= questions.length) return null;

  const question = questions[testIndex];
  const correct = question.type === 'multiple-choice'
    ? answer.trim().toLowerCase() === question.answer.trim().toLowerCase()
    : answer.trim().toLowerCase() === question.answer.trim().toLowerCase();

  testAnswers.push({
    prompt: question.prompt,
    userAnswer: answer,
    correctAnswer: question.answer,
    correct,
    grammarPoint: question.grammarPoint,
  });

  testIndex += 1;

  return {
    recorded: true,
    index: testIndex,
    total: questions.length,
    done: testIndex >= questions.length,
  };
}

function getTestResults() {
  const total = testAnswers.length;
  const correct = testAnswers.filter((a) => a.correct).length;
  return {
    answers: testAnswers,
    score: correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}

function getDrillScore() {
  if (!currentLessonData) return 0;
  return drillCorrect;
}

/* --- Keyboard shortcuts --- */

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.code === KEYBOARD_SHORTCUTS.SUBMIT_ADVANCE) {
        e.preventDefault();
        const event = new CustomEvent('shortcut:submit');
        window.dispatchEvent(event);
      }
      return;
    }

    switch (e.code) {
      case KEYBOARD_SHORTCUTS.SUBMIT_ADVANCE:
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('shortcut:submit'));
        break;
      case KEYBOARD_SHORTCUTS.EXIT_LESSON:
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('shortcut:exit'));
        break;
      case KEYBOARD_SHORTCUTS.FOCUS_TUTOR:
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('shortcut:focus-tutor'));
        break;
      case KEYBOARD_SHORTCUTS.BOOKMARK:
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('shortcut:bookmark'));
        break;
    }
  });
}
