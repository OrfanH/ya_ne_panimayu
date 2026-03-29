/* ============================================
   TestUI — Chapter vocabulary test overlay.
   IIFE module. DOM created dynamically.
   Cross-layer communication via window custom events only.
   ============================================ */

const TestUI = (() => {
  // -----------------------------------------------------------
  // Constants
  // -----------------------------------------------------------
  const CHAPTER_LOCATIONS = {
    1: ['apartment'],
    2: ['park'],
    3: ['cafe', 'market'],
    4: ['station', 'police'],
  };

  const MAX_QUESTIONS = 10;
  const ANSWER_FEEDBACK_MS = 600;

  // -----------------------------------------------------------
  // State
  // -----------------------------------------------------------
  const _state = {
    active: false,
    chapter: 1,
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    phase: 'quiz', // 'quiz' | 'result'
  };

  // -----------------------------------------------------------
  // DOM refs
  // -----------------------------------------------------------
  let _overlay = null;
  let _card = null;
  let _progress = null;
  let _word = null;
  let _answersContainer = null;
  let _resultContainer = null;

  // -----------------------------------------------------------
  // Build DOM
  // -----------------------------------------------------------
  function _buildDOM() {
    const uiOverlay = document.getElementById('ui-overlay') || document.body;

    _overlay = document.createElement('div');
    _overlay.id = 'test-overlay';

    _card = document.createElement('div');
    _card.className = 'test-card';

    _progress = document.createElement('p');
    _progress.className = 'test-progress';

    _word = document.createElement('p');
    _word.className = 'test-word';

    _answersContainer = document.createElement('div');
    _answersContainer.className = 'test-answers';

    _resultContainer = document.createElement('div');
    _resultContainer.className = 'test-result hidden';

    _card.appendChild(_progress);
    _card.appendChild(_word);
    _card.appendChild(_answersContainer);
    _card.appendChild(_resultContainer);
    _overlay.appendChild(_card);
    uiOverlay.appendChild(_overlay);
  }

  // -----------------------------------------------------------
  // Build questions from vocabulary
  // -----------------------------------------------------------
  async function _buildQuestions(chapter) {
    const locations = CHAPTER_LOCATIONS[chapter] || [];
    const vocab = await getVocabulary();
    const pool = (vocab.words || []).filter(
      (w) => w.lessonId && locations.includes(w.lessonId)
    );

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const selected = pool.slice(0, MAX_QUESTIONS);
    const allMeanings = (vocab.words || []).map((w) => w.meaning).filter(Boolean);

    return selected.map((word) => {
      const correct = word.meaning;
      const distractors = allMeanings
        .filter((m) => m !== correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

      return {
        cyrillic: word.cyrillic,
        correctMeaning: correct,
        options,
      };
    });
  }

  // -----------------------------------------------------------
  // Render current question
  // -----------------------------------------------------------
  function _renderQuestion() {
    const q = _state.questions[_state.currentIndex];
    if (!q) { return; }

    _progress.textContent = `${_state.currentIndex + 1} / ${_state.questions.length}`;
    _word.textContent = q.cyrillic;

    _answersContainer.innerHTML = '';
    for (const option of q.options) {
      const btn = document.createElement('button');
      btn.className = 'test-answer-btn';
      btn.type = 'button';
      btn.textContent = option;
      btn.addEventListener('click', () => _onAnswer(btn, option, q));
      _answersContainer.appendChild(btn);
    }
  }

  // -----------------------------------------------------------
  // Handle answer selection
  // -----------------------------------------------------------
  function _onAnswer(btn, selectedMeaning, q) {
    // Prevent double-clicking
    const buttons = _answersContainer.querySelectorAll('.test-answer-btn');
    buttons.forEach((b) => {
      b.disabled = true;
    });

    const isCorrect = selectedMeaning === q.correctMeaning;

    if (isCorrect) {
      _state.correctCount++;
      btn.classList.add('is-correct');
    } else {
      btn.classList.add('is-incorrect');
      // Highlight the correct answer
      buttons.forEach((b) => {
        if (b.textContent === q.correctMeaning) {
          b.classList.add('is-correct');
        }
      });
      logMistake(q.cyrillic, 'test', q.correctMeaning, 'professor', 'test');
    }

    setTimeout(() => {
      _state.currentIndex++;
      if (_state.currentIndex >= _state.questions.length) {
        _showResult();
      } else {
        _renderQuestion();
      }
    }, ANSWER_FEEDBACK_MS);
  }

  // -----------------------------------------------------------
  // Show result screen
  // -----------------------------------------------------------
  function _showResult() {
    _state.phase = 'result';
    const total = _state.questions.length;
    const score = total > 0 ? _state.correctCount / total : 0;
    const passed = score >= 0.7;

    _answersContainer.classList.add('hidden');
    _word.classList.add('hidden');
    _progress.classList.add('hidden');
    _resultContainer.classList.remove('hidden');

    const fraction = document.createElement('p');
    fraction.className = 'test-result-score';
    fraction.textContent = `${_state.correctCount} / ${total}`;

    const outcome = document.createElement('p');
    outcome.className = 'test-result-outcome';
    outcome.textContent = passed ? 'Passed!' : 'Keep practising!';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'test-continue-btn';
    continueBtn.type = 'button';
    continueBtn.textContent = 'Continue';
    continueBtn.addEventListener('click', _onContinue);

    _resultContainer.innerHTML = '';
    _resultContainer.appendChild(fraction);
    _resultContainer.appendChild(outcome);
    _resultContainer.appendChild(continueBtn);

    _saveScore(_state.chapter, score, passed);

    window.dispatchEvent(new CustomEvent(EVENTS.TEST_END, {
      detail: { chapter: _state.chapter, score, passed },
    }));
  }

  // -----------------------------------------------------------
  // Save score and unlock next chapter locations
  // -----------------------------------------------------------
  async function _saveScore(chapter, score, passed) {
    const progress = await getProgress();
    progress.testScores = progress.testScores || {};
    progress.testScores[chapter] = score;

    if (passed) {
      const nextChapter = chapter + 1;
      const nextLocations = CHAPTER_LOCATIONS[nextChapter] || [];
      for (const loc of nextLocations) {
        if (!progress.unlockedLocations.includes(loc)) {
          progress.unlockedLocations.push(loc);
        }
      }
    }

    await saveProgress(progress);
  }

  // -----------------------------------------------------------
  // Continue button handler
  // -----------------------------------------------------------
  function _onContinue() {
    _close();
    window.dispatchEvent(new CustomEvent(EVENTS.TEST_DISMISS));
  }

  // -----------------------------------------------------------
  // Open overlay
  // -----------------------------------------------------------
  async function _open(chapter) {
    _state.active = true;
    _state.chapter = chapter;
    _state.currentIndex = 0;
    _state.correctCount = 0;
    _state.phase = 'quiz';

    _answersContainer.classList.remove('hidden');
    _word.classList.remove('hidden');
    _progress.classList.remove('hidden');
    _resultContainer.classList.add('hidden');
    _resultContainer.innerHTML = '';

    _state.questions = await _buildQuestions(chapter);

    if (_state.questions.length === 0) {
      // No vocabulary for this chapter yet — show message then dismiss
      _answersContainer.classList.add('hidden');
      _word.classList.add('hidden');
      _progress.classList.add('hidden');

      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'test-empty-message';
      emptyMsg.textContent = 'You haven\'t learned any vocabulary yet. Practice with NPCs first!';
      _card.appendChild(emptyMsg);

      _overlay.classList.add('is-active');

      setTimeout(() => {
        _overlay.classList.remove('is-active');
        _card.removeChild(emptyMsg);
        _state.active = false;
        window.dispatchEvent(new CustomEvent(EVENTS.TEST_DISMISS));
      }, 2500);
      return;
    }

    _renderQuestion();
    _overlay.classList.add('is-active');
  }

  // -----------------------------------------------------------
  // Close overlay
  // -----------------------------------------------------------
  function _close() {
    _state.active = false;
    _overlay.classList.remove('is-active');
  }

  // -----------------------------------------------------------
  // TEST_START listener
  // -----------------------------------------------------------
  function _onTestStart(e) {
    const detail = e.detail || {};
    const chapter = detail.chapter || 1;
    _open(chapter);
  }

  // -----------------------------------------------------------
  // Init
  // -----------------------------------------------------------
  function _init() {
    _buildDOM();
    window.addEventListener(EVENTS.TEST_START, _onTestStart);
  }

  document.addEventListener('DOMContentLoaded', _init);

  return {};
})();
