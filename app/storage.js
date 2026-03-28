/* ============================================
   Storage — all Vercel KV reads and writes
   Single point of access for persistent data.
   ============================================ */

const KV_API_BASE = '/api/kv';

async function kvGet(key) {
  try {
    const res = await fetch(`${KV_API_BASE}?key=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.value ?? null;
  } catch {
    return null;
  }
}

async function kvSet(key, value) {
  try {
    await fetch(KV_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
  } catch {
    /* silent — lesson continues */
  }
}

/* --- Progress --- */

async function getProgress() {
  const data = await kvGet(STORAGE_KEYS.PROGRESS);
  return data || { ...DEFAULT_PROGRESS };
}

async function saveProgress(progress) {
  progress.lastSession = new Date().toISOString();
  await kvSet(STORAGE_KEYS.PROGRESS, progress);
}

async function markLessonComplete(lessonId, drillScore, testScore) {
  const progress = await getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  if (drillScore !== undefined) {
    progress.scores[lessonId] = drillScore;
  }
  if (testScore !== undefined) {
    progress.testScores[lessonId] = testScore;
  }
  await saveProgress(progress);
  return progress;
}

/* --- Vocabulary --- */

async function getVocabulary() {
  const data = await kvGet(STORAGE_KEYS.VOCABULARY);
  return data || { words: [] };
}

async function addVocabulary(words, lessonId) {
  const vocab = await getVocabulary();
  const existing = new Set(vocab.words.map((w) => w.cyrillic));
  const now = new Date().toISOString();

  for (const word of words) {
    if (!existing.has(word.cyrillic)) {
      vocab.words.push({
        cyrillic: word.cyrillic,
        transliteration: word.transliteration,
        meaning: word.meaning,
        gender: word.gender || null,
        lessonId,
        seenAt: now,
        exampleCyrillic: word.exampleCyrillic || '',
        exampleMeaning: word.exampleMeaning || '',
      });
    }
  }
  await kvSet(STORAGE_KEYS.VOCABULARY, vocab);
  return vocab;
}

/* --- Errors --- */

async function getErrors() {
  const data = await kvGet(STORAGE_KEYS.ERRORS);
  return data || { patterns: [] };
}

async function logError(grammarPoint, attemptedAnswer) {
  const errors = await getErrors();
  const now = new Date().toISOString();
  const existing = errors.patterns.find(
    (p) => p.grammarPoint === grammarPoint
  );

  if (existing) {
    existing.count += 1;
    existing.lastSeen = now;
    if (!existing.examples.includes(attemptedAnswer)) {
      existing.examples.push(attemptedAnswer);
    }
  } else {
    errors.patterns.push({
      grammarPoint,
      count: 1,
      lastSeen: now,
      examples: [attemptedAnswer],
    });
  }
  await kvSet(STORAGE_KEYS.ERRORS, errors);
  return errors;
}

/* --- Mistakes --- */

async function getMistakes() {
  const data = await kvGet(STORAGE_KEYS.MISTAKES);
  return data || { entries: [] };
}

async function logMistake(word, context, correctAnswer, npcId, location) {
  const mistakes = await getMistakes();
  const now = new Date().toISOString();
  const existing = mistakes.entries.find(
    (e) => e.word === word && e.context === context
  );

  if (existing) {
    existing.count += 1;
    existing.lastSeen = now;
  } else {
    mistakes.entries.push({
      word,
      context,
      correctAnswer,
      npcId,
      location,
      count: 1,
      lastSeen: now,
    });
  }
  await kvSet(STORAGE_KEYS.MISTAKES, mistakes);
}

async function getMistakeList() {
  const mistakes = await getMistakes();
  return [...mistakes.entries].sort((a, b) => b.count - a.count);
}

/* --- Notes / Bookmarks --- */

async function getNotes() {
  const data = await kvGet(STORAGE_KEYS.NOTES);
  return data || { bookmarks: [] };
}

async function addBookmark(lessonId, phase, cardTitle, content) {
  const notes = await getNotes();
  const id = crypto.randomUUID();
  notes.bookmarks.push({
    id,
    lessonId,
    phase,
    cardTitle,
    content,
    savedAt: new Date().toISOString(),
  });
  await kvSet(STORAGE_KEYS.NOTES, notes);
  return notes;
}

async function removeBookmark(bookmarkId) {
  const notes = await getNotes();
  notes.bookmarks = notes.bookmarks.filter((b) => b.id !== bookmarkId);
  await kvSet(STORAGE_KEYS.NOTES, notes);
  return notes;
}

/* --- Settings --- */

async function getSettings() {
  const data = await kvGet(STORAGE_KEYS.SETTINGS);
  return data || { ...DEFAULT_SETTINGS };
}

async function saveSettings(settings) {
  await kvSet(STORAGE_KEYS.SETTINGS, settings);
}
