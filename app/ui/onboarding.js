/* ============================================
   OnboardingUI — first-time intro panel sequence
   HTML layer: owns the overlay DOM, panel cycling,
   markIntroSeen() call, and INTRO_DONE dispatch.
   ============================================ */

const OnboardingUI = (() => {
  const _panels = [
    {
      text: 'Маlinov. Population: 11,000. You know nobody.',
      subtext: 'Your phone died somewhere over the Urals.',
    },
    {
      text: 'You have an address on a piece of paper.',
      subtext: 'Third floor. You tried the second floor first. Then the fourth.',
    },
    {
      text: 'The right door. Finally.',
      subtext: 'Someone is already in the hallway.',
    },
    {
      text: 'Press any key or tap to begin.',
      subtext: null,
    },
  ];

  let _currentIndex = 0;
  let _overlay = null;
  let _panelEls = [];

  function _build() {
    _overlay = document.createElement('div');
    _overlay.id = 'onboarding-overlay';
    _overlay.setAttribute('role', 'dialog');
    _overlay.setAttribute('aria-modal', 'true');
    _overlay.setAttribute('aria-label', 'Introduction');
    _overlay.setAttribute('tabindex', '0');

    for (const panelData of _panels) {
      const panel = document.createElement('div');
      panel.className = 'intro-panel';

      const textEl = document.createElement('p');
      textEl.className = 'intro-panel-text';
      textEl.setAttribute('aria-live', 'polite');
      textEl.textContent = panelData.text;
      panel.appendChild(textEl);

      if (panelData.subtext) {
        const subtextEl = document.createElement('p');
        subtextEl.className = 'intro-panel-subtext';
        subtextEl.textContent = panelData.subtext;
        panel.appendChild(subtextEl);
      }

      _overlay.appendChild(panel);
      _panelEls.push(panel);
    }

    document.body.appendChild(_overlay);
  }

  function _show(index) {
    for (let i = 0; i < _panelEls.length; i++) {
      const el = _panelEls[i];
      el.classList.remove('is-active', 'is-entering');
    }

    const incoming = _panelEls[index];
    incoming.classList.add('is-active', 'is-entering');

    // Remove is-entering after one animation frame so the class is only
    // present during the entry animation, not persisted.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.classList.remove('is-entering');
      });
    });
  }

  function _advance() {
    if (_currentIndex < _panels.length - 1) {
      _currentIndex += 1;
      _show(_currentIndex);
    } else {
      _finish();
    }
  }

  function _finish() {
    _overlay.removeEventListener('keydown', _onKey);
    _overlay.removeEventListener('pointerup', _onTap);

    markIntroSeen().then(() => {
      window.dispatchEvent(new CustomEvent(EVENTS.INTRO_DONE));
      if (_overlay && _overlay.parentNode) {
        _overlay.remove();
      }
      _overlay = null;
      _panelEls = [];
    });
  }

  function _onKey(e) {
    // Trap focus: prevent Tab from escaping the overlay
    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }
    // Escape closes the intro immediately
    if (e.key === 'Escape') {
      _finish();
      return;
    }
    _advance();
  }

  function _onTap(e) {
    _advance();
  }

  function init() {
    getProgress().then((progress) => {
      if (progress.hasSeenIntro) {
        window.dispatchEvent(new CustomEvent(EVENTS.INTRO_DONE));
        return;
      }

      _currentIndex = 0;
      _panelEls = [];
      _build();
      _show(0);

      _overlay.focus();
      _overlay.addEventListener('keydown', _onKey);
      _overlay.addEventListener('pointerup', _onTap);
    });
  }

  return { init };
})();
