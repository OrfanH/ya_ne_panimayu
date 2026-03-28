/* ============================================
   MistakeLogger — silent mistake capture to KV.
   Listens for EVENTS.MISTAKE_LOG and persists
   via storage.js. No DOM. No player feedback.
   ============================================ */

const MistakeLogger = (() => {
  function _onMistakeEvent(e) {
    const detail = e.detail || {};
    const { word, context, correctAnswer, npcId, location } = detail;
    if (!word) { return; }
    // Fire and forget — do not block game
    logMistake(
      word,
      context || '',
      correctAnswer || '',
      npcId || '',
      location || ''
    );
  }

  function init() {
    window.addEventListener(EVENTS.MISTAKE_LOG, _onMistakeEvent);
  }

  function destroy() {
    window.removeEventListener(EVENTS.MISTAKE_LOG, _onMistakeEvent);
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, destroy };
})();
