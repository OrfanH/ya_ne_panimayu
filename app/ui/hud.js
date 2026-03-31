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

    // --- Mute button (wired by AudioManager)
    // AudioManager may have already created #hud-mute before hud.js ran.
    // Re-use it if present; otherwise create a shell for AudioManager to wire later.
    let _muteBtn = document.getElementById('hud-mute');
    if (!_muteBtn) {
      _muteBtn = document.createElement('button');
      _muteBtn.id = 'hud-mute';
      _muteBtn.type = 'button';
      _muteBtn.className = 'hud-mute-btn';
      _muteBtn.setAttribute('aria-label', 'Mute music');
    }

    _hudEl.appendChild(_locationEl);
    _hudEl.appendChild(_missionEl);
    _hudEl.appendChild(_journalHintEl);
    _hudEl.appendChild(_muteBtn);

    parent.appendChild(_hudEl);

    // --- Toast notification (used by tutor.js showTutorStatus on API errors)
    const toastEl = document.createElement('div');
    toastEl.id = 'tutor-status';
    toastEl.className = 'hud-toast';
    parent.appendChild(toastEl);
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

    window.addEventListener(EVENTS.MISSION_COMPLETE, () => {
      _missionEl.classList.remove('is-visible');
      _missionTitleEl.textContent = '';
    });

    // Dismiss hint if journal is opened by any means
    window.addEventListener(EVENTS.JOURNAL_OPEN, () => {
      _dismissJournalHint();
    });

    // Generic toast: { detail: { message: string, duration?: number } }
    let _toastTimer = null;
    window.addEventListener(EVENTS.HUD_TOAST, (e) => {
      const toastEl = document.getElementById('tutor-status');
      if (!toastEl) { return; }
      const msg = e.detail && e.detail.message ? e.detail.message : '';
      const duration = e.detail && e.detail.duration ? e.detail.duration : 4000;
      toastEl.textContent = msg;
      toastEl.classList.add('visible');
      if (_toastTimer !== null) { clearTimeout(_toastTimer); }
      _toastTimer = setTimeout(() => {
        toastEl.classList.remove('visible');
        _toastTimer = null;
      }, duration);
    });

    document.addEventListener('keydown', _onKeyDown);
  }

  async function _loadActiveMission() {
    try {
      const progress = await getProgress();
      if (progress.activeMission && progress.activeMission.titleEn) {
        _showMission(progress.activeMission.titleEn);
      }
    } catch {
      /* silent */
    }
  }

  function init() {
    _buildDOM();
    _registerListeners();
    _loadActiveMission();
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
