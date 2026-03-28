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
