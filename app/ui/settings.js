/* ============================================
   SettingsUI — script mode, theme, volume controls
   IIFE module. Injects DOM, persists via storage.js.
   All cross-layer communication via custom events.
   ============================================ */

const SettingsUI = (() => {
  let _panel = null;
  let _closeBtn = null;
  let _scriptSelect = null;
  let _themeRadios = null;
  let _volumeSlider = null;
  let _volumeValue = null;

  /* ---- Theme application ---- */

  function _applyTheme(theme) {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  /* ---- DOM injection ---- */

  function _buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'settings-panel';
    panel.className = 'hidden';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Settings');

    panel.innerHTML = `
      <div class="settings-card">
        <div class="settings-header">
          <h2 class="settings-title">Settings</h2>
          <button id="settings-close" class="settings-close-btn" type="button" aria-label="Close settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="settings-body">
          <div class="settings-row">
            <label for="script-mode-select" class="settings-label">Script</label>
            <select id="script-mode-select" class="settings-select">
              <option value="cyrillic">Cyrillic (Кириллица)</option>
              <option value="transliteration">Transliteration</option>
              <option value="cyrillic-transliteration">Both</option>
            </select>
          </div>
          <div class="settings-row">
            <span class="settings-label" aria-hidden="true">Theme</span>
            <fieldset class="theme-toggle">
              <legend class="sr-only">Theme</legend>
              <label class="theme-pill theme-pill--first">
                <input type="radio" name="theme" value="light">
                Light
              </label>
              <label class="theme-pill">
                <input type="radio" name="theme" value="dark">
                Dark
              </label>
              <label class="theme-pill theme-pill--last">
                <input type="radio" name="theme" value="system">
                System
              </label>
            </fieldset>
          </div>
          <div class="settings-row">
            <label for="volume-slider" class="settings-label">Volume</label>
            <div class="settings-volume-group">
              <input id="volume-slider" class="settings-slider" type="range" min="0" max="100" step="1" aria-label="Volume level">
              <span id="volume-value" class="settings-volume-value"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    return panel;
  }

  /* ---- Populate controls from saved settings ---- */

  function _populate(settings) {
    _scriptSelect.value = settings.scriptMode;

    for (const radio of _themeRadios) {
      radio.checked = radio.value === settings.theme;
      radio.closest('.theme-pill').classList.toggle('is-selected', radio.checked);
    }

    _volumeSlider.value = settings.volume;
    _volumeValue.textContent = settings.volume;
  }

  /* ---- Control change handlers ---- */

  function _onScriptChange() {
    getSettings().then((settings) => {
      settings.scriptMode = _scriptSelect.value;
      saveSettings(settings);
      window.dispatchEvent(new CustomEvent(EVENTS.SETTINGS_SCRIPT_MODE_CHANGE, {
        detail: { value: settings.scriptMode },
      }));
    });
  }

  function _onThemeChange(e) {
    const value = e.target.value;
    for (const radio of _themeRadios) {
      radio.closest('.theme-pill').classList.toggle('is-selected', radio.value === value);
    }
    _applyTheme(value);
    getSettings().then((settings) => {
      settings.theme = value;
      saveSettings(settings);
      window.dispatchEvent(new CustomEvent(EVENTS.SETTINGS_THEME_CHANGE, {
        detail: { value },
      }));
    });
  }

  function _onVolumeChange() {
    const level = parseInt(_volumeSlider.value, 10);
    _volumeValue.textContent = level;
    if (typeof AudioManager !== 'undefined') {
      AudioManager.setVolume(level);
    }
    getSettings().then((settings) => {
      settings.volume = level;
      saveSettings(settings);
      window.dispatchEvent(new CustomEvent(EVENTS.SETTINGS_VOLUME_CHANGE, {
        detail: { value: level },
      }));
    });
  }

  /* ---- Escape key handler ---- */

  function _onKeydown(e) {
    if (_panel.classList.contains('hidden')) { return; }

    if (e.code === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }

    // Focus trap: cycle Tab within the settings panel
    if (e.key === 'Tab') {
      const focusable = _panel.querySelectorAll(
        'button, select, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) { return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ---- Public API ---- */

  function init() {
    _panel = _buildPanel();
    document.body.appendChild(_panel);

    _closeBtn = document.getElementById('settings-close');
    _scriptSelect = document.getElementById('script-mode-select');
    _themeRadios = _panel.querySelectorAll('input[name="theme"]');
    _volumeSlider = document.getElementById('volume-slider');
    _volumeValue = document.getElementById('volume-value');

    _closeBtn.addEventListener('click', close);
    _scriptSelect.addEventListener('change', _onScriptChange);

    for (const radio of _themeRadios) {
      radio.addEventListener('change', _onThemeChange);
    }

    _volumeSlider.addEventListener('input', _onVolumeChange);

    document.addEventListener('keydown', _onKeydown, true);

    /* Apply saved theme on page load */
    getSettings().then((settings) => {
      _applyTheme(settings.theme);
    });
  }

  function open() {
    getSettings().then((settings) => {
      _populate(settings);
      _panel.classList.remove('hidden');
      _closeBtn.focus();
    });
  }

  function close() {
    _panel.classList.add('hidden');
  }

  return { init, open, close };
})();
