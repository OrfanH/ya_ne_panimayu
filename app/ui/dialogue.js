/* ============================================
   Dialogue UI — visual novel box, portrait, Russian + translation,
   response options. HTML layer only. No Phaser objects.
   Cross-layer communication via window custom events only.
   ============================================ */

const DialogueUI = (() => {
  // -----------------------------------------------------------
  // State machine
  // States: CLOSED, OPENING, OPEN, CLOSING
  // -----------------------------------------------------------
  const _STATES = Object.freeze({
    CLOSED:  'CLOSED',
    OPENING: 'OPENING',
    OPEN:    'OPEN',
    CLOSING: 'CLOSING',
  });

  const _state = {
    phase: _STATES.CLOSED,
    translationVisible: true,
    currentLine: null,
  };

  // -----------------------------------------------------------
  // DOM — created dynamically, appended to #ui-overlay or body
  // -----------------------------------------------------------
  let _overlay = null;
  let _box = null;
  let _portrait = null;
  let _speakerName = null;
  let _russian = null;
  let _translation = null;
  let _toggleBtn = null;
  let _choices = null;

  function _buildDOM() {
    const uiOverlay = document.getElementById('ui-overlay') || document.body;

    // Remove legacy #dialogue-box if present
    const legacy = document.getElementById('dialogue-box');
    if (legacy) {
      legacy.remove();
    }

    // #dialogue-overlay
    _overlay = document.createElement('div');
    _overlay.id = 'dialogue-overlay';

    // .dialogue-box
    _box = document.createElement('div');
    _box.className = 'dialogue-box';

    // .dialogue-portrait
    _portrait = document.createElement('div');
    _portrait.className = 'dialogue-portrait';

    // .dialogue-body
    const body = document.createElement('div');
    body.className = 'dialogue-body';

    // .dialogue-speaker-name
    _speakerName = document.createElement('p');
    _speakerName.className = 'dialogue-speaker-name';

    // .dialogue-russian
    _russian = document.createElement('p');
    _russian.className = 'dialogue-russian';

    // .dialogue-translation
    _translation = document.createElement('p');
    _translation.className = 'dialogue-translation';

    // .dialogue-toggle-translation
    _toggleBtn = document.createElement('button');
    _toggleBtn.className = 'dialogue-toggle-translation';
    _toggleBtn.type = 'button';
    _toggleBtn.textContent = 'EN';
    _toggleBtn.setAttribute('aria-label', 'Toggle translation');
    _toggleBtn.addEventListener('click', _onToggleTranslation);

    body.appendChild(_speakerName);
    body.appendChild(_russian);
    body.appendChild(_translation);
    body.appendChild(_toggleBtn);

    // .dialogue-choices
    _choices = document.createElement('div');
    _choices.className = 'dialogue-choices';

    _box.appendChild(_portrait);
    _box.appendChild(body);
    _box.appendChild(_choices);

    _overlay.appendChild(_box);
    uiOverlay.appendChild(_overlay);
  }

  // -----------------------------------------------------------
  // Translation toggle
  // -----------------------------------------------------------
  function _onToggleTranslation() {
    _state.translationVisible = !_state.translationVisible;
    _applyTranslationVisibility();
  }

  function _applyTranslationVisibility() {
    if (_state.translationVisible) {
      _translation.classList.remove('translation-hidden');
      _toggleBtn.classList.add('toggle-active');
    } else {
      _translation.classList.add('translation-hidden');
      _toggleBtn.classList.remove('toggle-active');
    }
  }

  // -----------------------------------------------------------
  // Populate DOM from a DialogueLine
  // -----------------------------------------------------------
  function _populate(line) {
    _speakerName.textContent = line.npcName || '';

    // Portrait — clear previous content
    _portrait.innerHTML = '';
    if (line.portrait) {
      const img = document.createElement('img');
      img.alt = line.npcName || 'NPC';
      img.onerror = () => { _portrait.innerHTML = ''; };
      img.src = line.portrait;
      _portrait.appendChild(img);
    }

    _russian.textContent = line.russian || '';
    _translation.textContent = line.translation || '';
    _applyTranslationVisibility();

    // Choices
    _choices.innerHTML = '';
    if (line.choices && line.choices.length > 0) {
      for (const choice of line.choices) {
        const btn = document.createElement('button');
        btn.className = 'dialogue-choice-btn';
        btn.type = 'button';
        btn.textContent = choice.russian || '';

        btn.addEventListener('click', () => {
          if (choice.isFinal) {
            close();
          } else {
            window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_CHOICE, {
              detail: { choiceId: choice.id, russian: choice.russian || '' },
            }));
          }
        });

        btn.addEventListener('mouseenter', () => {
          btn.classList.add('is-hover');
        });
        btn.addEventListener('mouseleave', () => {
          btn.classList.remove('is-hover');
        });

        _choices.appendChild(btn);
      }
    }
  }

  // -----------------------------------------------------------
  // Public — open(line: DialogueLine)
  // Only works when state is CLOSED. Sets state to OPENING.
  // After CSS transition completes, sets state to OPEN.
  // -----------------------------------------------------------
  function open(line) {
    if (_state.phase !== _STATES.CLOSED) { return; }

    _state.phase = _STATES.OPENING;
    _state.currentLine = line;

    _populate(line);
    _portrait.classList.toggle('has-portrait', !!line.portrait);
    _overlay.classList.add('is-active');

    // Track when opening transition ends → move to OPEN
    let _openFallback = null;

    const onOpenEnd = () => {
      _box.removeEventListener('transitionend', onOpenEnd);
      clearTimeout(_openFallback);
      if (_state.phase === _STATES.OPENING) {
        _state.phase = _STATES.OPEN;
      }
    };

    _box.addEventListener('transitionend', onOpenEnd);

    _openFallback = setTimeout(() => {
      _box.removeEventListener('transitionend', onOpenEnd);
      if (_state.phase === _STATES.OPENING) {
        _state.phase = _STATES.OPEN;
      }
    }, 400);
  }

  // -----------------------------------------------------------
  // Public — update(line: DialogueLine)
  // Works when state is OPENING or OPEN.
  // Replaces content in-place without re-opening or flickering.
  // -----------------------------------------------------------
  function update(line) {
    if (_state.phase !== _STATES.OPENING && _state.phase !== _STATES.OPEN) { return; }
    _state.currentLine = line;
    _populate(line);
  }

  // -----------------------------------------------------------
  // Public — close()
  // Only works when state is OPEN or OPENING.
  // Fires DIALOGUE_END exactly once after transition.
  // -----------------------------------------------------------
  function close() {
    if (_state.phase !== _STATES.OPEN && _state.phase !== _STATES.OPENING) { return; }

    _state.phase = _STATES.CLOSING;
    _state.currentLine = null;

    _box.classList.add('is-closing');

    let _fired = false;
    let _closeFallback = null;

    const onEnd = () => {
      if (_fired) { return; }
      _fired = true;
      _box.removeEventListener('transitionend', onEnd);
      clearTimeout(_closeFallback);
      _overlay.classList.remove('is-active');
      _box.classList.remove('is-closing');
      _state.phase = _STATES.CLOSED;
      window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
    };

    _box.addEventListener('transitionend', onEnd);

    // Fallback in case transition doesn't fire (e.g. prefers-reduced-motion)
    _closeFallback = setTimeout(() => {
      _box.removeEventListener('transitionend', onEnd);
      if (!_fired) {
        _fired = true;
        _overlay.classList.remove('is-active');
        _box.classList.remove('is-closing');
        _state.phase = _STATES.CLOSED;
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
      }
    }, 400);
  }

  // -----------------------------------------------------------
  // Physics resume bridge — listens for dialogue-close and
  // resumes physics on all active Phaser scenes.
  // Kept in ui/ but uses window event pattern (no direct Phaser import).
  // -----------------------------------------------------------
  function _onDialogueClose() {
    if (typeof game !== 'undefined' && game.scene) {
      game.scene.scenes.forEach((s) => {
        if (s.physics && s.physics.world) {
          s.physics.resume();
        }
      });
    }
  }

  // -----------------------------------------------------------
  // dialogue:start listener — state machine rejects re-entry
  // -----------------------------------------------------------
  function _onDialogueStart(e) {
    const detail = e.detail || {};
    const line = {
      npcId: detail.npcId || '',
      npcName: detail.npcName || 'NPC',
      russian: detail.russian || '',
      translation: detail.translation || '',
      portrait: detail.portrait || null,
      choices: detail.choices || [],
    };
    open(line);
  }

  // -----------------------------------------------------------
  // dialogue:update listener — updates content in-place
  // -----------------------------------------------------------
  function _onDialogueUpdate(e) {
    const detail = e.detail || {};
    const line = {
      npcId: detail.npcId || '',
      npcName: detail.npcName || 'NPC',
      russian: detail.russian || '',
      translation: detail.translation || '',
      portrait: detail.portrait || null,
      choices: detail.choices || [],
    };
    update(line);
  }

  // -----------------------------------------------------------
  // Init — called once on page load
  // -----------------------------------------------------------
  function _init() {
    _buildDOM();
    window.addEventListener(EVENTS.DIALOGUE_START, _onDialogueStart);
    window.addEventListener(EVENTS.DIALOGUE_UPDATE, _onDialogueUpdate);
    window.addEventListener(EVENTS.DIALOGUE_END, _onDialogueClose);
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { open, close, update };
})();
