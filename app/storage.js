/* ============================================
   Storage — all Vercel KV reads and writes
   Single point of access for persistent data.
   ============================================ */

const KV_API_BASE = '/api/kv';

async function kvGet(key) {
  try {
    const res = await fetch(`${KV_API_BASE}?key=${encodeURIComponent(key)}`);
    if (!res.ok) {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }
    const data = await res.json();
    return data.value ?? null;
  } catch {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
}

async function kvSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));  // write-through cache
  try {
    const res = await fetch(KV_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    // Note: localStorage already written above regardless of API result
  } catch {
    // localStorage already written above
  }
}

/* --- Progress --- */

async function getProgress() {
  const data = await kvGet(STORAGE_KEYS.PROGRESS);
  if (!data) {
    const defaults = { ...DEFAULT_PROGRESS };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(defaults));
    return defaults;
  }
  return data;
}

async function saveProgress(progress) {
  progress.lastSession = new Date().toISOString();
  await kvSet(STORAGE_KEYS.PROGRESS, progress);
}

async function markIntroSeen() {
  const progress = await getProgress();
  progress.hasSeenIntro = true;
  await saveProgress(progress);
  return progress;
}

async function markGraduationSeen() {
  const progress = await getProgress();
  progress.hasSeenGraduation = true;
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

/* --- Settings --- */

async function getSettings() {
  const data = await kvGet(STORAGE_KEYS.SETTINGS);
  return data || { ...DEFAULT_SETTINGS };
}

async function saveSettings(settings) {
  await kvSet(STORAGE_KEYS.SETTINGS, settings);
}
