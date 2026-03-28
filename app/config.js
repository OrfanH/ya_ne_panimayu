/* ============================================
   Configuration — all constants and configurable values
   ============================================ */

const API_ENDPOINT = '/api/tutor';

const GEMINI_MODELS = {
  PRIMARY: 'gemini-2.5-flash',
  FALLBACK: 'gemini-2.5-flash-lite',
};

const PHASE_NAMES = [
  'Hook + Why',
  'Show + Mid-lesson Check',
  'Deepen + Second Check',
  'Full Drill',
  'Test',
  'Tutor Feedback',
  'Summary',
];

const PHASE_COUNT = PHASE_NAMES.length;

const KEYBOARD_SHORTCUTS = {
  SUBMIT_ADVANCE: 'Enter',
  EXIT_LESSON: 'Escape',
  FOCUS_TUTOR: 'KeyT',
  BOOKMARK: 'KeyB',
};

const RATE_LIMIT_RETRY_MS = 3000;

const STORAGE_KEYS = {
  PROGRESS: 'progress',
  VOCABULARY: 'vocabulary',
  ERRORS: 'errors',
  NOTES: 'notes',
  SETTINGS: 'settings',
};

const CURRICULUM_PATH = '/curriculum';

const DEFAULT_PROGRESS = {
  currentLesson: '1-7',
  currentPhase: 0,
  completedLessons: [],
  referenceLessons: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6'],
  scores: {},
  testScores: {},
  lastSession: null,
};

const DEFAULT_SETTINGS = {
  scriptMode: 'cyrillic-transliteration',
  theme: 'system',
};

const DRILL_QUESTION_TYPES = [
  'text-input',
  'multiple-choice',
  'fill-blank',
  'translate-to-russian',
  'translate-to-english',
];

const TEST_QUESTION_COUNT = { MIN: 8, MAX: 10 };

const TOAST_DURATION_MS = 3000;
