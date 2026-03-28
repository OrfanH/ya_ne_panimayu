/* ============================================
   HUD — location name, mission indicator, journal hint
   ============================================ */

const HUD = (() => {
  let _hudEl = null;
  let _locationEl = null;
  let _missionEl = null;
  let _missionTitleEl = null;
  let _journalHintEl = null;
  let _locationExitTimer = null;
  let _journalHintDismissed = false;

  function _buildDOM() {
    const parent = document.getElementById('ui-overlay') || document.body;

    _hudEl = document.createElement('div');
    _hudEl.id = 'hud';

    // --- Location name (top-left)
    _locationEl = document.createElement('div');
    _locationEl.className = 'hud-location';

    // --- Mission indicator (top-right)
    _missionEl = document.createElement('div');
    _missionEl.className = 'hud-mission';

    const missionLabelEl = document.createElement('span');
    missionLabelEl.className = 'hud-mission-label';
    missionLabelEl.textContent = 'ЗАДАНИЕ';

    _missionTitleEl = document.createElement('span');
    _missionTitleEl.className = 'hud-mission-title';

    _missionEl.appendChild(missionLabelEl);
    _missionEl.appendChild(_missionTitleEl);

    // --- Journal hint (bottom-right)
    _journalHintEl = document.createElement('div');
    _journalHintEl.className = 'hud-journal-hint';

    const keyBadgeEl = document.createElement('span');
    keyBadgeEl.className = 'hud-key-badge';
    keyBadgeEl.textContent = 'J';

    const journalLabelEl = document.createElement('span');
    journalLabelEl.className = 'hud-journal-hint-label';
    journalLabelEl.textContent = 'Journal';

    _journalHintEl.appendChild(keyBadgeEl);
    _journalHintEl.appendChild(journalLabelEl);

    _hudEl.appendChild(_locationEl);
    _hudEl.appendChild(_missionEl);
    _hudEl.appendChild(_journalHintEl);

    parent.appendChild(_hudEl);
  }

  function _showLocation(name) {
    if (_locationExitTimer !== null) {
      clearTimeout(_locationExitTimer);
      _locationExitTimer = null;
    }

    _locationEl.textContent = name;
    _locationEl.classList.remove('is-exiting');
    // Force reflow so entering animation runs even if already visible
    void _locationEl.offsetWidth;
    _locationEl.classList.add('is-visible', 'is-entering');

    _locationEl.addEventListener('animationend', () => {
      _locationEl.classList.remove('is-entering');
    }, { once: true });
  }

  function _hideLocation() {
    if (!_locationEl.classList.contains('is-visible')) return;

    _locationEl.classList.add('is-exiting');

    _locationExitTimer = setTimeout(() => {
      _locationEl.classList.remove('is-visible', 'is-exiting');
      _locationExitTimer = null;
    }, 150);
  }

  function _showMission(title) {
    _missionTitleEl.textContent = title;
    // Force reflow so scale animation runs on re-show
    _missionEl.classList.remove('is-visible');
    void _missionEl.offsetWidth;
    _missionEl.classList.add('is-visible');
  }

  function _dismissJournalHint() {
    if (_journalHintDismissed) return;
    _journalHintDismissed = true;

    _journalHintEl.classList.add('is-fading');
    _journalHintEl.addEventListener('transitionend', () => {
      if (_journalHintEl.parentNode) {
        _journalHintEl.parentNode.removeChild(_journalHintEl);
      }
    }, { once: true });
  }

  function _onKeyDown(e) {
    if (e.code !== KEYBOARD_SHORTCUTS.JOURNAL) return;
    // Do not steal focus from dialogue or journal itself
    const dialogueActive = document.getElementById('dialogue-overlay')
      && document.getElementById('dialogue-overlay').classList.contains('is-active');
    if (dialogueActive) return;

    window.dispatchEvent(new CustomEvent(EVENTS.JOURNAL_OPEN));
    _dismissJournalHint();
  }

  function _registerListeners() {
    window.addEventListener(EVENTS.LOCATION_ENTER, (e) => {
      if (e.detail && e.detail.name) {
        _showLocation(e.detail.name);
      }
    });

    window.addEventListener(EVENTS.LOCATION_EXIT, () => {
      _hideLocation();
    });

    window.addEventListener(EVENTS.MISSION_START, (e) => {
      if (e.detail && e.detail.title) {
        _showMission(e.detail.title);
      }
    });

    // Dismiss hint if journal is opened by any means
    window.addEventListener(EVENTS.JOURNAL_OPEN, () => {
      _dismissJournalHint();
    });

    window.addEventListener('keydown', _onKeyDown);
  }

  function init() {
    _buildDOM();
    _registerListeners();
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
