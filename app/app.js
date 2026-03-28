/* ============================================
   App — main application logic, view rendering, event wiring
   ============================================ */

let curriculum = null;
let progress = null;

/* ============================================
   Placement test
   ============================================ */

const PLACEMENT_QUESTIONS = [
  {
    prompt: 'What does кот mean?',
    options: ['cat', 'dog', 'house', 'juice'],
    answer: 'cat',
  },
  {
    prompt: 'The Russian letter С sounds like:',
    options: ['s as in sun', 'sh as in ship', 'ts as in bits', 'z as in zoo'],
    answer: 's as in sun',
  },
  {
    prompt: 'Which noun is feminine?',
    options: ['книга', 'стол', 'окно', 'брат'],
    answer: 'книга',
  },
  {
    prompt: '"I am a student" (male speaker) — correct form:',
    options: ['Я студент.', 'Я студентка.', 'Я студенту.', 'Я студентом.'],
    answer: 'Я студент.',
  },
  {
    prompt: 'What is the plural of книга (book)?',
    options: ['книги', 'книге', 'книгу', 'книгой'],
    answer: 'книги',
  },
  {
    prompt: '"I see the cat" — кот changes to:',
    options: ['кота', 'котом', 'коту', 'коте'],
    answer: 'кота',
  },
  {
    prompt: 'Fill in: Я ___ (читать, present tense, я-form)',
    options: ['читаю', 'читает', 'читаешь', 'читал'],
    answer: 'читаю',
  },
  {
    prompt: '"The book is on the table" — Книга ___ столе.',
    options: ['на', 'в', 'у', 'с'],
    answer: 'на',
  },
  {
    prompt: 'What is the genitive of книга?',
    options: ['книги', 'книге', 'книгу', 'книгой'],
    answer: 'книги',
  },
  {
    prompt: '"I finished reading the book" — which sentence is correct?',
    options: ['Я прочитал книгу.', 'Я читал книгу.', 'Я читаю книгу.', 'Я буду читать книгу.'],
    answer: 'Я прочитал книгу.',
  },
];

const PLACEMENT_RECOMMENDATIONS = [
  { maxScore: 2, lesson: '1-1', label: 'Unit 1 · Familiar letters', reason: 'Start from scratch with the Cyrillic alphabet — the right foundation makes everything else easier.' },
  { maxScore: 4, lesson: '1-7', label: 'Unit 1 · Reading practice + stress rules', reason: 'You know the basics. This lesson bridges alphabet knowledge into real reading and pronunciation.' },
  { maxScore: 6, lesson: '3-1', label: 'Unit 3 · Noun gender', reason: 'Past survival phrases — time to build grammar foundations starting with gender.' },
  { maxScore: 8, lesson: '5-1', label: 'Unit 5 · The case system', reason: 'Solid base. Cases are your next milestone and where most learners need the most drilling.' },
  { maxScore: 10, lesson: '7-1', label: 'Unit 7 · Family and people', reason: 'Strong fundamentals — move straight into everyday language.' },
];

let placementIndex = 0;
let placementAnswers = [];
let placementStarted = false;

function getPlacementRecommendation(score) {
  for (const rec of PLACEMENT_RECOMMENDATIONS) {
    if (score <= rec.maxScore) return rec;
  }
  return PLACEMENT_RECOMMENDATIONS[PLACEMENT_RECOMMENDATIONS.length - 1];
}

function renderPlacementView() {
  const container = document.getElementById('placement-container');
  if (!container) return;

  if (!placementStarted) {
    container.innerHTML = renderPlacementIntro();
    const startBtn = container.querySelector('#placement-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        placementStarted = true;
        placementIndex = 0;
        placementAnswers = [];
        renderPlacementView();
      });
    }
    return;
  }

  if (placementIndex >= PLACEMENT_QUESTIONS.length) {
    const score = placementAnswers.filter(Boolean).length;
    container.innerHTML = renderPlacementResult(score);
    wirePlacementResult(score);
    return;
  }

  container.innerHTML = renderPlacementQuestion();
  wirePlacementQuestion();
}

function renderPlacementIntro() {
  return `
    <div class="placement-screen">
      <div class="placement-intro-icon">Я</div>
      <h1 class="placement-title">Before you start</h1>
      <p class="placement-subtitle">10 quick questions to find your starting point.<br>No pressure — just answer honestly.</p>
      <button class="btn btn-primary placement-cta" id="placement-start-btn">Start the test</button>
      <button class="btn btn-secondary placement-skip" id="placement-skip-btn">Skip — I'll browse lessons myself</button>
    </div>
  `;
}

function renderPlacementQuestion() {
  const q = PLACEMENT_QUESTIONS[placementIndex];
  const progress = placementIndex + 1;
  const total = PLACEMENT_QUESTIONS.length;
  const pct = Math.round((placementIndex / total) * 100);

  let optionsHTML = '';
  for (const opt of q.options) {
    optionsHTML += `<button class="btn placement-option" data-value="${opt}">${opt}</button>`;
  }

  return `
    <div class="placement-screen">
      <div class="placement-progress-bar">
        <div class="placement-progress-fill" style="width: ${pct}%"></div>
      </div>
      <p class="placement-counter">${progress} of ${total}</p>
      <p class="placement-question">${q.prompt}</p>
      <div class="placement-options">${optionsHTML}</div>
    </div>
  `;
}

function renderPlacementResult(score) {
  const rec = getPlacementRecommendation(score);
  const total = PLACEMENT_QUESTIONS.length;
  const pct = Math.round((score / total) * 100);

  return `
    <div class="placement-screen">
      <div class="placement-score-ring">
        <span class="placement-score-number">${score}<span class="placement-score-denom">/${total}</span></span>
      </div>
      <h2 class="placement-result-title">Here's where to start</h2>
      <div class="placement-recommendation">
        <span class="placement-rec-label">${rec.label}</span>
        <p class="placement-rec-reason">${rec.reason}</p>
      </div>
      <button class="btn btn-primary placement-cta" id="placement-accept-btn">Start here</button>
      <button class="btn btn-secondary placement-skip" id="placement-browse-btn">Browse all lessons</button>
    </div>
  `;
}

function wirePlacementQuestion() {
  const container = document.getElementById('placement-container');
  if (!container) return;

  const skipBtn = container.querySelector('#placement-skip-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', async () => {
      progress.placementDone = true;
      await saveProgress(progress);
      navigateTo('/');
    });
  }

  const options = container.querySelectorAll('.placement-option');
  for (const btn of options) {
    btn.addEventListener('click', () => {
      const q = PLACEMENT_QUESTIONS[placementIndex];
      placementAnswers.push(btn.dataset.value === q.answer);

      btn.classList.add(btn.dataset.value === q.answer ? 'placement-option-correct' : 'placement-option-wrong');
      for (const b of options) b.disabled = true;

      setTimeout(() => {
        placementIndex++;
        renderPlacementView();
      }, 400);
    });
  }
}

function wirePlacementResult(score) {
  const container = document.getElementById('placement-container');
  if (!container) return;

  const rec = getPlacementRecommendation(score);

  const acceptBtn = container.querySelector('#placement-accept-btn');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', async () => {
      progress.currentLesson = rec.lesson;
      progress.placementDone = true;
      await saveProgress(progress);
      renderLessonList();
      renderResumeBanner();
      navigateTo('/');
    });
  }

  const browseBtn = container.querySelector('#placement-browse-btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', async () => {
      progress.placementDone = true;
      await saveProgress(progress);
      navigateTo('/');
    });
  }
}

async function initApp() {
  progress = await getProgress();
  await loadCurriculum();
  renderLessonList();
  renderResumeBanner();
  initKeyboardShortcuts();
  wireEvents();
  wireShortcuts();

  const needsPlacement = !progress.placementDone && progress.completedLessons.length === 0;
  if (needsPlacement) {
    placementStarted = false;
    placementIndex = 0;
    placementAnswers = [];
    navigateTo('/placement');
  }

  initRouter();
}

async function loadCurriculum() {
  try {
    const res = await fetch(`${CURRICULUM_PATH}/curriculum.json`);
    if (res.ok) {
      curriculum = await res.json();
    }
  } catch {
    curriculum = null;
  }
}

/* --- Lesson list rendering --- */

function renderLessonList() {
  const sidebar = document.getElementById('lesson-list');
  const grid = document.getElementById('lesson-grid');
  if (!curriculum || !curriculum.units) return;

  let sidebarHTML = '';
  let gridHTML = '';

  for (const unit of curriculum.units) {
    sidebarHTML += `<li class="sidebar-unit-label">Unit ${unit.unit}: ${unit.title}</li>`;
    gridHTML += `<h3 class="grid-unit-label">Unit ${unit.unit} &mdash; ${unit.title}</h3><div class="grid-unit">`;

    for (const lesson of unit.lessons) {
      const id = lesson.id;
      const status = getLessonStatus(id);
      const statusClass = `lesson-${status}`;
      const isCurrent = progress.currentLesson === id;

      sidebarHTML += `
        <li class="sidebar-lesson ${statusClass} ${isCurrent ? 'lesson-current' : ''}"
            data-lesson-id="${id}">
          <span class="lesson-number">${id}</span>
          <span class="lesson-title">${lesson.title}</span>
          ${status === 'completed' ? '<i data-lucide="check" class="icon-inline icon-success"></i>' : ''}
          ${status === 'locked' ? '<i data-lucide="lock" class="icon-inline icon-disabled"></i>' : ''}
        </li>`;

      gridHTML += `
        <button class="lesson-card ${statusClass} ${isCurrent ? 'lesson-current' : ''}"
                data-lesson-id="${id}"
                ${status === 'locked' ? 'disabled' : ''}>
          <div class="lesson-card-header">
            <span class="lesson-card-number">${id}</span>
            ${status === 'completed' ? '<i data-lucide="check-circle" class="icon-inline icon-success"></i>' : ''}
            ${status === 'locked' ? '<i data-lucide="lock" class="icon-inline icon-disabled"></i>' : ''}
          </div>
          <h3 class="lesson-card-title">${lesson.title}</h3>
          <p class="lesson-card-subtitle">${lesson.subtitle || ''}</p>
          ${lesson.estimatedMinutes ? `<span class="lesson-card-time">${lesson.estimatedMinutes} min</span>` : ''}
        </button>`;
    }

    gridHTML += '</div>';
  }

  if (sidebar) sidebar.innerHTML = sidebarHTML;
  if (grid) grid.innerHTML = gridHTML;

  lucide.createIcons();
}

function getLessonStatus(lessonId) {
  if (progress.completedLessons.includes(lessonId)) return 'completed';
  if (progress.referenceLessons && progress.referenceLessons.includes(lessonId)) return 'reference';
  if (lessonId === progress.currentLesson) return 'active';

  if (!curriculum) return 'locked';
  const allIds = [];
  for (const unit of curriculum.units) {
    for (const lesson of unit.lessons) {
      allIds.push(lesson.id);
    }
  }
  const currentIdx = allIds.indexOf(progress.currentLesson);
  const thisIdx = allIds.indexOf(lessonId);
  if (thisIdx <= currentIdx) return 'active';
  return 'locked';
}

/* --- Resume banner --- */

function renderResumeBanner() {
  const banner = document.getElementById('resume-banner');
  if (!banner) return;

  if (progress.currentLesson && progress.currentPhase > 0) {
    banner.style.display = '';
    const title = document.getElementById('resume-title');
    const phase = document.getElementById('resume-phase');
    if (title) title.textContent = `Lesson ${progress.currentLesson}`;
    if (phase) phase.textContent = `Phase ${progress.currentPhase + 1} of ${PHASE_COUNT} \u00b7 ${PHASE_NAMES[progress.currentPhase]}`;
  } else {
    banner.style.display = 'none';
  }
}

/* --- Lesson opening --- */

async function openLesson(lessonId) {
  navigateTo('/lesson', { id: lessonId });
}

async function startLesson(lessonId) {
  const data = await loadLesson(lessonId);
  if (!data) {
    showToast('Could not load lesson.');
    return;
  }

  progress.currentLesson = lessonId;
  currentPhaseIndex = 0;
  await saveProgress(progress);

  resetTutorHistory();
  resetDrill();
  resetTest();
  unlockTutor();

  renderLessonView();
}

async function resumeLesson() {
  const lessonId = progress.currentLesson;
  if (!lessonId) return;

  const data = await loadLesson(lessonId);
  if (!data) {
    showToast('Could not load lesson.');
    return;
  }

  currentPhaseIndex = progress.currentPhase || 0;
  resetTutorHistory();

  if (currentPhaseIndex >= 4) {
    resetDrill();
  }

  renderLessonView();
}

/* --- Lesson view rendering --- */

function renderLessonView() {
  const container = document.getElementById('lesson-container');
  if (!container || !currentLessonData) return;

  const lesson = currentLessonData;
  const phase = getCurrentPhase();
  if (!phase) return;

  let breadcrumb = `${lesson.block} \u00b7 Lesson ${lesson.id} \u00b7 ${lesson.title}`;

  container.innerHTML = `
    <div class="lesson-header">
      <button class="btn btn-icon lesson-exit" id="lesson-exit-btn">
        <i data-lucide="x"></i>
      </button>
      <span class="lesson-breadcrumb">${breadcrumb}</span>
    </div>
    <div class="phase-progress">
      ${renderPhaseProgress()}
    </div>
    <div class="phase-label">Phase ${currentPhaseIndex + 1} of ${PHASE_COUNT} \u00b7 ${PHASE_NAMES[currentPhaseIndex]}</div>
    <div class="phase-content" id="phase-content">
      ${renderPhaseContent(phase)}
    </div>
    <div class="phase-actions" id="phase-actions">
      ${renderPhaseActions(phase)}
    </div>
  `;

  lucide.createIcons();
  wirePhaseEvents();
}

function renderPhaseProgress() {
  let pips = '';
  for (let i = 0; i < PHASE_COUNT; i++) {
    let cls = 'pip';
    if (i < currentPhaseIndex) cls += ' pip-done';
    if (i === currentPhaseIndex) cls += ' pip-active';
    pips += `<div class="${cls}" data-phase="${i}"></div>`;
  }
  return pips;
}

function renderPhaseContent(phase) {
  switch (phase.name) {
    case 'hook':
      return renderHookPhase(phase.data);
    case 'explain':
      return renderExplainPhase(phase.data);
    case 'deepen':
      return renderDeepenPhase(phase.data);
    case 'drill':
      return renderDrillPhase(phase.data);
    case 'test':
      return renderTestPhase(phase.data);
    case 'feedback':
      return renderFeedbackPhase();
    case 'summary':
      return renderSummaryPhase(phase.data);
    default:
      return '<p>Unknown phase</p>';
  }
}

function renderHookPhase(data) {
  const phases = currentLessonData.phases;
  return `
    <div class="card">
      <h3 class="card-title">Why this matters</h3>
      <p class="card-body">${phases.hook?.text || ''}</p>
    </div>
    <div class="card">
      <h3 class="card-title">The reason</h3>
      <p class="card-body">${phases.why?.text || ''}</p>
    </div>
  `;
}

function renderExplainPhase(data) {
  if (!data || !data.cards) return '';
  let html = '';
  for (const card of data.cards) {
    html += `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${card.title}</h3>
          <button class="btn btn-icon bookmark-btn" data-card-title="${card.title}">
            <i data-lucide="bookmark"></i>
          </button>
        </div>
        <p class="card-body">${card.body}</p>
        ${card.examples ? renderExamples(card.examples) : ''}
      </div>
    `;
  }

  if (currentLessonData.phases.midCheck) {
    html += renderMidCheck(currentLessonData.phases.midCheck);
  }
  return html;
}

function renderDeepenPhase(data) {
  if (!data || !data.cards) return '';
  let html = '';
  for (const card of data.cards) {
    html += `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${card.title}</h3>
          <button class="btn btn-icon bookmark-btn" data-card-title="${card.title}">
            <i data-lucide="bookmark"></i>
          </button>
        </div>
        <p class="card-body">${card.body}</p>
        ${card.examples ? renderExamples(card.examples) : ''}
      </div>
    `;
  }
  return html;
}

function renderExamples(examples) {
  let html = '<div class="examples">';
  for (const ex of examples) {
    html += `
      <div class="example-row">
        <span class="example-cyrillic">${ex.cyrillic}</span>
        <span class="example-transliteration">${ex.transliteration}</span>
        <span class="example-meaning">${ex.meaning}</span>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

function renderMidCheck(data) {
  if (!data || !data.questions) return '';
  let html = '<div class="mid-check"><h3 class="card-title">Quick check</h3>';
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    html += `
      <div class="check-question" data-index="${i}">
        <p class="check-prompt">${q.prompt}</p>
        <input type="text" class="input check-input" data-answer="${q.answer}" placeholder="Your answer...">
        <div class="check-feedback" style="display:none;"></div>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

function renderDrillPhase(data) {
  if (!data || !data.questions) return '';
  const q = data.questions[drillIndex];
  if (!q) {
    return `
      <div class="card">
        <h3 class="card-title">Drill complete</h3>
        <p class="card-body">You got ${drillCorrect} out of ${data.questions.length} correct.</p>
      </div>
    `;
  }

  return `
    <div class="drill-counter">Question ${drillIndex + 1} of ${data.questions.length}</div>
    <div class="card drill-card" id="drill-card">
      <p class="drill-prompt">${q.prompt}</p>
      ${q.type === 'multiple-choice' ? renderMultipleChoice(q) : `
        <input type="text" class="input drill-input" id="drill-input" placeholder="Type your answer..." autocomplete="off">
      `}
      <div class="drill-feedback" id="drill-feedback" style="display:none;"></div>
    </div>
  `;
}

function renderMultipleChoice(question) {
  let html = '<div class="mc-options">';
  for (const opt of question.options) {
    html += `<button class="btn btn-mc" data-value="${opt}">${opt}</button>`;
  }
  html += '</div>';
  return html;
}

function renderTestPhase(data) {
  if (!data || !data.questions) return '<p>No test available for this lesson.</p>';
  const q = data.questions[testIndex];

  if (!q) {
    const results = getTestResults();
    return `
      <div class="card">
        <h3 class="card-title">Test complete</h3>
        <p class="card-body">Score: ${results.score} / ${results.total} (${results.percentage}%)</p>
      </div>
    `;
  }

  return `
    <div class="test-notice">Test mode \u2014 no feedback until the end</div>
    <div class="drill-counter">Question ${testIndex + 1} of ${data.questions.length}</div>
    <div class="card drill-card" id="test-card">
      <p class="drill-prompt">${q.prompt}</p>
      ${q.type === 'multiple-choice' ? renderMultipleChoice(q) : `
        <input type="text" class="input drill-input" id="test-input" placeholder="Type your answer..." autocomplete="off">
      `}
    </div>
  `;
}

function renderFeedbackPhase() {
  return `
    <div class="card">
      <h3 class="card-title">Tutor feedback</h3>
      <div id="feedback-content">
        <p class="text-secondary">Generating personalised feedback...</p>
      </div>
    </div>
  `;
}

function renderSummaryPhase(data) {
  if (!data) return '';
  let rulesHTML = '';
  if (data.rules) {
    for (const rule of data.rules) {
      rulesHTML += `<li>${rule}</li>`;
    }
  }

  const testResults = getTestResults();

  return `
    <div class="card">
      <h3 class="card-title">Summary</h3>
      <ul class="summary-rules">${rulesHTML}</ul>
    </div>
    <div class="card">
      <h3 class="card-title">Results</h3>
      <p class="card-body">Drill: ${drillCorrect} correct</p>
      <p class="card-body">Test: ${testResults.score} / ${testResults.total} (${testResults.percentage}%)</p>
    </div>
    ${data.nextLesson ? `<p class="next-lesson-hint">${data.nextLesson}</p>` : ''}
  `;
}

function renderPhaseActions(phase) {
  if (phase.name === 'summary') {
    return `<button class="btn btn-primary" id="finish-lesson-btn">Finish lesson</button>`;
  }
  if (phase.name === 'drill' || phase.name === 'test') {
    return `<button class="btn btn-primary" id="submit-answer-btn">Submit</button>`;
  }
  if (phase.name === 'feedback') {
    return `<button class="btn btn-primary" id="continue-btn">Continue to summary</button>`;
  }
  return `<button class="btn btn-primary" id="continue-btn">Continue</button>`;
}

/* --- Phase event wiring --- */

function wirePhaseEvents() {
  const exitBtn = document.getElementById('lesson-exit-btn');
  if (exitBtn) {
    exitBtn.addEventListener('click', exitLesson);
  }

  const continueBtn = document.getElementById('continue-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', handleContinue);
  }

  const finishBtn = document.getElementById('finish-lesson-btn');
  if (finishBtn) {
    finishBtn.addEventListener('click', handleFinishLesson);
  }

  const submitBtn = document.getElementById('submit-answer-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmitAnswer);
  }

  const drillInput = document.getElementById('drill-input');
  if (drillInput) {
    drillInput.focus();
  }

  const testInput = document.getElementById('test-input');
  if (testInput) {
    testInput.focus();
  }

  const mcButtons = document.querySelectorAll('.btn-mc');
  for (const btn of mcButtons) {
    btn.addEventListener('click', () => {
      for (const b of mcButtons) b.classList.remove('mc-selected');
      btn.classList.add('mc-selected');
    });
  }

  const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
  for (const btn of bookmarkBtns) {
    btn.addEventListener('click', () => handleBookmark(btn.dataset.cardTitle));
  }

  const pips = document.querySelectorAll('.pip-done');
  for (const pip of pips) {
    pip.addEventListener('click', () => {
      const idx = parseInt(pip.dataset.phase, 10);
      goToPhase(idx);
      renderLessonView();
    });
  }

  if (currentPhaseIndex === 4) {
    lockTutor();
  } else if (currentPhaseIndex === 5) {
    unlockTutor();
    requestTutorFeedback();
  } else {
    unlockTutor();
  }
}

/* --- Handlers --- */

async function handleContinue() {
  if (advancePhase()) {
    progress.currentPhase = currentPhaseIndex;
    await saveProgress(progress);
    renderLessonView();
  }
}

async function handleSubmitAnswer() {
  const phase = getCurrentPhase();

  if (phase.name === 'drill') {
    const input = document.getElementById('drill-input');
    const selected = document.querySelector('.btn-mc.mc-selected');
    const answer = input ? input.value : (selected ? selected.dataset.value : '');
    if (!answer.trim()) return;

    const result = submitDrillAnswer(answer);
    if (!result) return;

    const feedback = document.getElementById('drill-feedback');
    const card = document.getElementById('drill-card');
    if (feedback && card) {
      feedback.style.display = '';
      if (result.correct) {
        card.classList.add('drill-correct');
        feedback.innerHTML = `<span class="text-success">Correct!</span> ${result.explanation}`;
      } else {
        card.classList.add('drill-incorrect');
        feedback.innerHTML = `<span class="text-error">Not quite.</span> Expected: <strong>${result.expected}</strong>. ${result.explanation}`;
        if (currentLessonData.phases.drill.questions[result.index]?.grammarPoint) {
          logError(
            currentLessonData.phases.drill.questions[result.index].grammarPoint,
            answer
          );
        }
      }
    }

    const submitBtn = document.getElementById('submit-answer-btn');
    if (submitBtn) {
      submitBtn.textContent = 'Continue';
      submitBtn.removeEventListener('click', handleSubmitAnswer);
      submitBtn.addEventListener('click', () => {
        if (drillIndex >= currentLessonData.phases.drill.questions.length) {
          handleContinue();
        } else {
          renderLessonView();
        }
      });
    }
    return;
  }

  if (phase.name === 'test') {
    const input = document.getElementById('test-input');
    const selected = document.querySelector('.btn-mc.mc-selected');
    const answer = input ? input.value : (selected ? selected.dataset.value : '');
    if (!answer.trim()) return;

    const result = submitTestAnswer(answer);
    if (!result) return;

    if (result.done) {
      handleContinue();
    } else {
      renderLessonView();
    }
  }
}

async function handleFinishLesson() {
  const testResults = getTestResults();
  await markLessonComplete(
    currentLessonData.id,
    getDrillScore(),
    testResults.score
  );

  if (currentLessonData.vocabulary) {
    await addVocabulary(currentLessonData.vocabulary, currentLessonData.id);
  }

  for (const answer of testResults.answers) {
    if (!answer.correct && answer.grammarPoint) {
      await logError(answer.grammarPoint, answer.userAnswer);
    }
  }

  progress = await getProgress();
  navigateTo('/');
  renderLessonList();
  renderResumeBanner();
  showToast('Lesson complete!');
}

async function exitLesson() {
  progress.currentPhase = currentPhaseIndex;
  await saveProgress(progress);
  navigateTo('/');
}

async function requestTutorFeedback() {
  const results = getTestResults();
  const feedbackPrompt = `The student just completed the test for lesson "${currentLessonData.title}".
Here are their results:
${JSON.stringify(results.answers, null, 2)}
Score: ${results.score}/${results.total} (${results.percentage}%)

Provide personalised feedback: acknowledge correct answers briefly, explain each wrong answer with the grammar rule, and give one specific thing to watch for in the next lesson. Be direct and useful.`;

  addMessage('user', feedbackPrompt);
  const response = await sendToTutor(feedbackPrompt);

  const feedbackEl = document.getElementById('feedback-content');
  if (feedbackEl && response.reply) {
    feedbackEl.innerHTML = `<p>${response.reply.replace(/\n/g, '</p><p>')}</p>`;
    renderTutorMessage(response.reply, 'assistant');
  } else if (feedbackEl) {
    feedbackEl.innerHTML = '<p>Could not generate feedback. Review your test results in the summary.</p>';
  }
}

async function handleBookmark(cardTitle) {
  if (!currentLessonData) return;
  const phase = getCurrentPhase();
  const card = currentLessonData.phases[phase.name]?.cards?.find(
    (c) => c.title === cardTitle
  );
  const content = card ? card.body : cardTitle;

  await addBookmark(currentLessonData.id, phase.name, cardTitle, content);
  showToast('Bookmarked!');
}

/* --- Tutor input wiring --- */

function focusTutorInput() {
  const input = document.getElementById('tutor-input');
  if (input) input.focus();
}

function wireTutorInput() {
  const input = document.getElementById('tutor-input');
  const sendBtn = document.getElementById('tutor-send');

  if (!input || !sendBtn) return;

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    renderTutorMessage(text, 'user');

    const lessonContext = currentLessonData
      ? `Lesson: ${currentLessonData.title}\nPhase: ${PHASE_NAMES[currentPhaseIndex]}`
      : '';
    const systemPrompt = buildSystemPrompt('', '', lessonContext, '');
    const response = await askTutor(text, systemPrompt);

    if (response.reply) {
      renderTutorMessage(response.reply, 'assistant');
    }
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  });
}

/* --- View events --- */

function wireEvents() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-lesson-id]');
    if (card && !card.disabled) {
      openLesson(card.dataset.lessonId);
    }
  });

  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      navigateTo('/lesson', { id: progress.currentLesson });
    });
  }

  wireTutorInput();

  window.addEventListener('routechange', async (e) => {
    const { route, params } = e.detail;
    if (route === 'placement') {
      renderPlacementView();
    }
    if (route === 'lesson' && params.id) {
      if (params.id === progress.currentLesson && progress.currentPhase > 0) {
        await resumeLesson();
      } else {
        await startLesson(params.id);
      }
    }
    if (route === 'vocabulary') {
      await renderVocabulary();
    }
    if (route === 'notes') {
      await renderNotes();
    }
  });
}

function wireShortcuts() {
  window.addEventListener('shortcut:submit', handleSubmitAnswer);
  window.addEventListener('shortcut:exit', exitLesson);
  window.addEventListener('shortcut:focus-tutor', focusTutorInput);
  window.addEventListener('shortcut:bookmark', () => {
    const btn = document.querySelector('.bookmark-btn');
    if (btn) btn.click();
  });
}

/* --- Vocabulary view --- */

async function renderVocabulary() {
  const vocab = await getVocabulary();
  const list = document.getElementById('vocab-list');
  const count = document.getElementById('vocab-count');

  if (count) count.textContent = `${vocab.words.length} words`;
  if (!list) return;

  if (vocab.words.length === 0) {
    list.innerHTML = '<p class="empty-state">No vocabulary yet. Complete lessons to build your word list.</p>';
    return;
  }

  let html = '';
  for (const word of vocab.words) {
    html += `
      <div class="vocab-item">
        <div class="vocab-word">
          <span class="vocab-cyrillic">${word.cyrillic}</span>
          <span class="vocab-transliteration">${word.transliteration}</span>
        </div>
        <span class="vocab-meaning">${word.meaning}</span>
        ${word.gender ? `<span class="vocab-gender badge">${word.gender}</span>` : ''}
      </div>
    `;
  }
  list.innerHTML = html;
}

/* --- Notes view --- */

async function renderNotes() {
  const notes = await getNotes();
  const list = document.getElementById('notes-list');
  const count = document.getElementById('notes-count');

  if (count) count.textContent = `${notes.bookmarks.length} saved`;
  if (!list) return;

  if (notes.bookmarks.length === 0) {
    list.innerHTML = '<p class="empty-state">No bookmarks yet. Press B during a lesson to save a card.</p>';
    return;
  }

  let html = '';
  for (const bm of notes.bookmarks) {
    html += `
      <div class="note-item">
        <div class="note-header">
          <span class="note-lesson">Lesson ${bm.lessonId}</span>
          <span class="note-phase badge">${bm.phase}</span>
        </div>
        <h4 class="note-title">${bm.cardTitle}</h4>
        <p class="note-content">${bm.content}</p>
        <button class="btn btn-sm btn-secondary remove-bookmark-btn" data-bookmark-id="${bm.id}">Remove</button>
      </div>
    `;
  }
  list.innerHTML = html;

  const removeBtns = list.querySelectorAll('.remove-bookmark-btn');
  for (const btn of removeBtns) {
    btn.addEventListener('click', async () => {
      await removeBookmark(btn.dataset.bookmarkId);
      await renderNotes();
    });
  }
}

/* --- Toast --- */

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 200);
  }, TOAST_DURATION_MS);
}

/* --- Init --- */

document.addEventListener('DOMContentLoaded', initApp);
