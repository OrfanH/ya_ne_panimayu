/* ============================================
   Configuration — all constants and configurable values
   ============================================ */

const API_ENDPOINT = '/api/tutor';

const GEMINI_MODELS = {
  PRIMARY: 'gemini-2.5-flash',
  FALLBACK: 'gemini-2.5-flash-lite',
};

const GAME_CONFIG = {
  TILE_SIZE: 32,
  PLAYER_SPEED: 160,
  CAMERA_LERP: 0.1,
  INTERACTION_RADIUS: 48,
  SCALE_MODE: Phaser.Scale.FIT,
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
};

const KEYBOARD_SHORTCUTS = {
  INTERACT: 'KeyE',
  JOURNAL: 'KeyJ',
  PAUSE: 'Escape',
  ADVANCE_DIALOGUE: 'Enter',
};

const RATE_LIMIT_RETRY_MS = 3000;

const STORAGE_KEYS = {
  PROGRESS: 'progress',
  VOCABULARY: 'vocabulary',
  MISTAKES: 'mistakes',
  JOURNAL: 'journal',
  SETTINGS: 'settings',
  GRADUATION_SEEN: 'graduation_seen',
};

const DEFAULT_SETTINGS = {
  scriptMode: 'cyrillic-transliteration',
  theme: 'system',
  volume: 80,
};

const LOCATIONS = {
  APARTMENT: { id: 'apartment', name: 'Apartment Building', chapter: 1 },
  PARK: { id: 'park', name: 'Park', chapter: 2 },
  CAFE: { id: 'cafe', name: 'Cafe', chapter: 3 },
  MARKET: { id: 'market', name: 'Market', chapter: 3 },
  STATION: { id: 'station', name: 'Train Station', chapter: 4 },
  POLICE: { id: 'police', name: 'Police Station', chapter: 4 },
};

const DEFAULT_PROGRESS = {
  chapter: 1,
  unlockedLocations: ['apartment'],
  completedMissions: [],
  activeMission: null,
  testScores: {},
  npcRelationships: {},
  lastSession: null,
  hasSeenIntro: false,
  hasSeenGraduation: false,
  playerPosition: {
    scene: 'Town',
    x: 400,
    y: 300,
  },
};

const TOAST_DURATION_MS = 3000;

const EVENTS = {
  DIALOGUE_START: 'dialogue:start',
  DIALOGUE_END: 'dialogue:end',
  DIALOGUE_CHOICE: 'dialogue:choice',
  TUTOR_AI_REQUEST: 'tutor:ai:request',
  TUTOR_AI_RESPONSE: 'tutor:ai:response',
  MISSION_START: 'mission:start',
  MISSION_COMPLETE: 'mission:complete',
  LOCATION_ENTER: 'location:enter',
  LOCATION_EXIT: 'location:exit',
  JOURNAL_OPEN: 'journal:open',
  JOURNAL_CLOSE: 'journal:close',
  NPC_INTERACT: 'npc:interact',
  VOCABULARY_NEW: 'vocabulary:new',
  ZONE_ENTER:     'zone:enter',
  MISTAKE_LOG:    'mistake:log',
  TEST_START:     'test:start',
  TEST_END:       'test:end',
  TEST_RESULT:    'test:result',
  TEST_DISMISS:   'test:dismiss',
  INTRO_DONE:          'intro:done',
  GRADUATION_SHOW:     'graduation:show',
  GRADUATION_DISMISS:  'graduation:dismiss',
  SETTINGS_SCRIPT_MODE_CHANGE: 'settings:scriptMode:change',
  SETTINGS_THEME_CHANGE:       'settings:theme:change',
  SETTINGS_VOLUME_CHANGE:      'settings:volume:change',
};
