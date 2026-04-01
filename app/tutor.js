/* ============================================
   Tutor — Gemini API calls, message history, error handling
   All communication with the tutor backend goes through here.
   ============================================ */

let messageHistory = [];
let isTutorLocked = false;

function resetTutorHistory() {
  messageHistory = [];
}

function lockTutor() {
  isTutorLocked = true;
  const panel = document.getElementById('tutor-panel');
  if (panel) panel.classList.add('tutor-locked');
}

function unlockTutor() {
  isTutorLocked = false;
  const panel = document.getElementById('tutor-panel');
  if (panel) panel.classList.remove('tutor-locked');
}

function addMessage(role, content) {
  messageHistory.push({ role, content });
}

function buildSystemPrompt(corePrompt, phasePrompt, lessonContext, progressSummary) {
  const parts = [corePrompt];
  if (phasePrompt) parts.push(phasePrompt);
  if (lessonContext) parts.push(`Current lesson context:\n${lessonContext}`);
  if (progressSummary) parts.push(`Student progress:\n${progressSummary}`);
  return parts.join('\n\n---\n\n');
}

async function sendToTutor(systemPrompt, model) {
  if (isTutorLocked) return { error: 'tutor_locked' };

  const chosenModel = model || GEMINI_MODELS.PRIMARY;

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messageHistory,
        systemPrompt,
        model: chosenModel,
      }),
    });

    const data = await res.json();

    if (data.error === 'rate_limit') {
      showTutorStatus('Taking a moment...');
      await sleep(RATE_LIMIT_RETRY_MS);

      const retryRes = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messageHistory,
          systemPrompt,
          model: GEMINI_MODELS.FALLBACK,
        }),
      });

      const retryData = await retryRes.json();
      if (retryData.error) {
        showTutorStatus('Tutor briefly unavailable \u2014 lesson continues.');
        return { error: retryData.error };
      }

      addMessage('assistant', retryData.reply);
      return { reply: retryData.reply };
    }

    if (data.error) {
      showTutorStatus('Tutor briefly unavailable \u2014 lesson continues.');
      return { error: data.error };
    }

    addMessage('assistant', data.reply);
    return { reply: data.reply };
  } catch {
    showTutorStatus('Tutor briefly unavailable \u2014 lesson continues.');
    return { error: 'network_error' };
  }
}

async function askTutor(userMessage, systemPrompt) {
  addMessage('user', userMessage);
  showTutorLoading();
  const result = await sendToTutor(systemPrompt);
  hideTutorLoading();
  return result;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showTutorLoading() {
  const indicator = document.getElementById('tutor-loading');
  if (indicator) indicator.classList.add('visible');
}

function hideTutorLoading() {
  const indicator = document.getElementById('tutor-loading');
  if (indicator) indicator.classList.remove('visible');
}

function showTutorStatus(message) {
  const status = document.getElementById('tutor-status');
  if (status) {
    status.textContent = message;
    status.classList.add('visible');
    setTimeout(() => status.classList.remove('visible'), TOAST_DURATION_MS);
  }
}

function renderTutorMessage(content, role) {
  const chat = document.getElementById('tutor-messages');
  if (!chat) return;

  const msg = document.createElement('div');
  msg.className = `tutor-message tutor-message-${role}`;
  msg.textContent = content;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

/* ============================================
   TutorAI — NPC AI conversation module.
   Drives in-world NPC dialogue via Gemini.
   Flash-Lite fallback on 429. Scripted fallback if both fail.
   ============================================ */

const TutorAI = (() => {
  // -----------------------------------------------------------
  // Internal state
  // -----------------------------------------------------------
  let _history = [];
  let _npcId = null;
  let _npcData = null;
  let _isWaiting = false;
  let _offline = false;
  let _learnedWords = [];

  // -----------------------------------------------------------
  // Build system prompt from NPC data
  // -----------------------------------------------------------
  function _buildSystemPrompt(npcData, learnedWords) {
    const vocab = Array.isArray(npcData.tutorVocabulary) ? npcData.tutorVocabulary : [];
    const newVocab = vocab.map(v => v.russian).join(', ');

    let reinforcement = '';
    if (learnedWords && learnedWords.length > 0) {
      // Pick up to 8 previously learned words to reinforce naturally
      const sample = learnedWords.slice(-8).map(w => w.cyrillic || w.russian).join(', ');
      reinforcement = `\nThe student has previously learned these words — use them naturally when they fit: ${sample}.`;
    }

    const personaClause = npcData.persona ? `, ${npcData.persona}` : '';
    return (
      `You are ${npcData.name}${personaClause}.\n` +
      `You are speaking with a beginner Russian learner.\n` +
      `Respond ONLY in Russian. After each sentence add the English translation in parentheses.\n` +
      `Keep responses to 1–3 sentences.\n` +
      `Naturally work in NEW vocabulary from this list when relevant: ${newVocab}.` +
      reinforcement + `\n` +
      `Never break character. Never mention that you are an AI.`
    );
  }

  // -----------------------------------------------------------
  // NPC-to-dialogue-data lookup for scripted fallback
  // -----------------------------------------------------------
  function _getDialogueData(npcId) {
    const map = {
      galina:    typeof APARTMENT_DIALOGUE !== 'undefined' ? APARTMENT_DIALOGUE : null,
      artyom:    typeof PARK_DIALOGUE !== 'undefined' ? PARK_DIALOGUE.ARTYOM : null,
      tamara:    typeof PARK_DIALOGUE !== 'undefined' ? PARK_DIALOGUE.TAMARA : null,
      lena:      typeof CAFE_DIALOGUE !== 'undefined' ? CAFE_DIALOGUE.LENA : null,
      boris:     typeof CAFE_DIALOGUE !== 'undefined' ? CAFE_DIALOGUE.BORIS : null,
      fatima:    typeof MARKET_DIALOGUE !== 'undefined' ? MARKET_DIALOGUE.FATIMA : null,
      misha:     typeof MARKET_DIALOGUE !== 'undefined' ? MARKET_DIALOGUE.MISHA : null,
      styopan:   typeof MARKET_DIALOGUE !== 'undefined' ? MARKET_DIALOGUE.STYOPAN : null,
      konstantin: typeof STATION_DIALOGUE !== 'undefined' ? STATION_DIALOGUE.KONSTANTIN : null,
      nadya:     typeof STATION_DIALOGUE !== 'undefined' ? STATION_DIALOGUE.NADYA : null,
      alina:     typeof POLICE_DIALOGUE !== 'undefined' ? POLICE_DIALOGUE.ALINA : null,
      sergei:    typeof POLICE_DIALOGUE !== 'undefined' ? POLICE_DIALOGUE.SERGEI : null,
    };
    return map[npcId] || null;
  }

  // -----------------------------------------------------------
  // Scripted fallback — picks a line from the NPC's content file.
  // Falls back to a generic busy message if no content found.
  // -----------------------------------------------------------
  function _getScriptedFallback() {
    const data = _getDialogueData(_npcId);
    const variations = (data && Array.isArray(data.VARIATIONS)) ? data.VARIATIONS : [];

    if (variations.length === 0) {
      return 'Извините, я сейчас занят. (Sorry, I am busy right now.)';
    }

    const variation = variations[Math.floor(Math.random() * variations.length)];
    const firstLine = (variation && Array.isArray(variation.lines)) ? variation.lines[0] : null;
    if (!firstLine || !firstLine.russian) {
      return 'Извините, я сейчас занят. (Sorry, I am busy right now.)';
    }

    return firstLine.translation
      ? `${firstLine.russian} (${firstLine.translation})`
      : firstLine.russian;
  }

  // -----------------------------------------------------------
  // Promisified wait helper
  // -----------------------------------------------------------
  function _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // -----------------------------------------------------------
  // POST to api/tutor.js — never throws, returns reply string
  // -----------------------------------------------------------
  async function _sendToAI(userText) {
    _history.push({ role: 'user', content: userText });

    const systemPrompt = _buildSystemPrompt(_npcData, _learnedWords);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: _history,
          systemPrompt,
          model: GEMINI_MODELS.PRIMARY,
        }),
      });

      const data = await res.json();

      if (data.error === 'rate_limit') {
        await _wait(RATE_LIMIT_RETRY_MS);

        try {
          const retryRes = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: _history,
              systemPrompt,
              model: GEMINI_MODELS.FALLBACK,
            }),
          });

          const retryData = await retryRes.json();

          if (retryData.reply) {
            _history.push({ role: 'model', content: retryData.reply });
            _offline = false;
            return retryData.reply;
          }

          _offline = true;
          return _getScriptedFallback();
        } catch (_retryErr) {
          _offline = true;
          return _getScriptedFallback();
        }
      }

      if (data.reply) {
        _history.push({ role: 'model', content: data.reply });
        _offline = false;
        return data.reply;
      }

      _offline = true;
      return _getScriptedFallback();
    } catch (_err) {
      _offline = true;
      return _getScriptedFallback();
    }
  }

  // -----------------------------------------------------------
  // Dispatch a DIALOGUE_UPDATE event with the AI reply and
  // standard continue / end choices so the player can respond.
  // Uses DIALOGUE_UPDATE (not DIALOGUE_START) so the dialogue box
  // that was already opened by the NPC is updated in-place,
  // preventing double-open and race conditions.
  // -----------------------------------------------------------
  function _dispatchAILine(replyText) {
    // Guard: _npcData may be null if dialogue was closed while awaiting API
    if (_npcId === null || _npcData === null) { return; }
    window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
      detail: {
        npcId: _npcId,
        npcName: _npcData.name,
        russian: replyText,
        translation: '',
        portrait: _npcData.portrait || null,
        offline: _offline,
        choices: [
          { id: 'continue', russian: 'Продолжить...', translation: 'Continue...', isFinal: false },
          { id: 'end',      russian: 'До свидания',   translation: 'Goodbye',     isFinal: true  },
        ],
      },
    }));
  }

  // -----------------------------------------------------------
  // Handle DIALOGUE_CHOICE — fetch AI response, dispatch new line
  // -----------------------------------------------------------
  async function _handleChoiceEvent(e) {
    if (_npcId === null || _isWaiting) { return; }

    const detail = e.detail || {};
    const choiceId = detail.choiceId;
    const choiceRussian = detail.russian || '';

    const userText = choiceId === 'continue'
      ? 'Please continue the conversation.'
      : choiceRussian;

    _isWaiting = true;

    if (_offline) {
      const reply = _getScriptedFallback();
      _isWaiting = false;
      _dispatchAILine(reply);
      return;
    }

    window.dispatchEvent(new CustomEvent(EVENTS.TUTOR_AI_REQUEST, {
      detail: { npcId: _npcId },
    }));

    const reply = await _sendToAI(userText);

    window.dispatchEvent(new CustomEvent(EVENTS.TUTOR_AI_RESPONSE, {
      detail: { npcId: _npcId, reply },
    }));

    _isWaiting = false;
    _dispatchAILine(reply);
  }

  // -----------------------------------------------------------
  // Handle DIALOGUE_END — reset active NPC state
  // -----------------------------------------------------------
  function _handleDialogueEnd() {
    _npcId = null;
    _npcData = null;
    _history = [];
    _learnedWords = [];
    _isWaiting = false;
    _offline = false;
  }

  // -----------------------------------------------------------
  // Public — init()
  // -----------------------------------------------------------
  function init() {
    window.addEventListener(EVENTS.DIALOGUE_CHOICE, _handleChoiceEvent);
    window.addEventListener(EVENTS.DIALOGUE_END, _handleDialogueEnd);
  }

  // -----------------------------------------------------------
  // Public — startConversation(npcData)
  // Must be called before the first DIALOGUE_START event fires.
  // -----------------------------------------------------------
  async function startConversation(npcData) {
    _npcId = npcData.id;
    _npcData = npcData;
    _history = [];
    _isWaiting = true;

    // Load previously learned words for reinforcement
    try {
      const vocab = await getVocabulary();
      _learnedWords = (vocab.words || []).slice(-20); // recent 20 words
    } catch { _learnedWords = []; }

    if (_offline) {
      const greeting = _getScriptedFallback();
      _isWaiting = false;
      // Guard: player may have pressed Goodbye while loading was in progress
      if (_npcId !== null) { _dispatchAILine(greeting); }
      return;
    }

    const requestedNpcId = _npcId;

    window.dispatchEvent(new CustomEvent(EVENTS.TUTOR_AI_REQUEST, {
      detail: { npcId: requestedNpcId },
    }));

    const greeting = await _sendToAI('Greet the player. This is the start of the conversation.');

    // Guard: dialogue may have been dismissed while API call was in flight
    if (_npcId === null || _npcId !== requestedNpcId) { return; }

    window.dispatchEvent(new CustomEvent(EVENTS.TUTOR_AI_RESPONSE, {
      detail: { npcId: _npcId, reply: greeting },
    }));

    _isWaiting = false;
    _dispatchAILine(greeting);
  }

  // -----------------------------------------------------------
  // Public — isActive()
  // Returns true when a conversation is in progress.
  // -----------------------------------------------------------
  function isActive() {
    return _npcId !== null;
  }

  // -----------------------------------------------------------
  // Public — destroy()
  // -----------------------------------------------------------
  function destroy() {
    window.removeEventListener(EVENTS.DIALOGUE_CHOICE, _handleChoiceEvent);
    window.removeEventListener(EVENTS.DIALOGUE_END, _handleDialogueEnd);
    _npcId = null;
    _npcData = null;
    _history = [];
    _isWaiting = false;
    _offline = false;
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, isActive, startConversation, destroy };
})();
