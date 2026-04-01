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
    sessionVocab: [],
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

    body.addEventListener('click', _onTapAdvance);

    // .dialogue-choices
    _choices = document.createElement('div');
    _choices.className = 'dialogue-choices';

    _box.appendChild(_portrait);
    _box.appendChild(body);
    _box.appendChild(_choices);

    _overlay.appendChild(_box);
    _overlay.addEventListener('click', (e) => { e.stopPropagation(); });
    uiOverlay.appendChild(_overlay);
  }

  // -----------------------------------------------------------
  // Translation toggle
  // -----------------------------------------------------------
  function _onTapAdvance(e) {
    // Only advance when dialogue is fully OPEN
    if (_state.phase !== _STATES.OPEN) { return; }
    // Don't advance if the user tapped the toggle button
    if (e.target === _toggleBtn || _toggleBtn.contains(e.target)) { return; }
    // Don't advance if there are choices visible — user must pick a choice
    if (_choices.children.length > 0 && !_choices.querySelector('.dialogue-advance-hint')) { return; }
    // Stop propagation so the tap doesn't bubble to game layer
    e.stopPropagation();
    // Fire a dialogue advance event — TutorAI listens for this to send the next beat
    window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_CHOICE, {
      detail: { choiceId: '__advance__', russian: '' },
    }));
  }

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
  // Fallback translation map — used when choice.translation is absent
  // -----------------------------------------------------------
  const _CHOICE_FALLBACK_TRANSLATIONS = {
    dismiss:  'Okay.',
    continue: 'Continue...',
    end:      'Goodbye',
    greet:    'Hello!',
    question: 'Do you speak English?',
    thanks:   'Thank you.',
  };

  // -----------------------------------------------------------
  // Loading fallback timer — cleared when the line is updated away
  // from a loading state (or dialogue closes)
  // -----------------------------------------------------------
  let _loadingFallbackTimer = null;

  function _clearLoadingFallback() {
    if (_loadingFallbackTimer !== null) {
      clearTimeout(_loadingFallbackTimer);
      _loadingFallbackTimer = null;
    }
  }

  // -----------------------------------------------------------
  // Populate DOM from a DialogueLine
  // -----------------------------------------------------------
  function _populate(line) {
    // Cancel any pending loading fallback from a prior call
    _clearLoadingFallback();

    _speakerName.textContent = line.npcName || '';

    // Offline indicator — remove any previous badge first
    const existingBadge = _speakerName.querySelector('.dialogue-offline-badge');
    if (existingBadge) { existingBadge.remove(); }

    if (line.offline) {
      const badge = document.createElement('span');
      badge.className = 'dialogue-offline-badge';
      badge.textContent = '(offline)';
      _speakerName.appendChild(badge);
    }

    // Portrait — clear previous content
    _portrait.innerHTML = '';
    if (line.portrait) {
      const img = document.createElement('img');
      img.alt = line.npcName || 'NPC';
      img.onerror = () => { _portrait.innerHTML = ''; _portrait.classList.remove('has-portrait'); };
      img.src = line.portrait;
      _portrait.appendChild(img);
    }

    _russian.textContent = line.russian || '';
    _translation.textContent = line.translation || '';
    _applyTranslationVisibility();

    // Class A fix: when loading and no choices provided, inject a fallback exit choice
    // so the player is never left with an empty choices area.
    const effectiveChoices = (line.choices && line.choices.length > 0)
      ? line.choices
      : (line.loading
          ? [{ id: 'end', russian: 'До свидания', translation: 'Goodbye', isFinal: true }]
          : []);

    // Class B fix: when loading, start a 2500ms timer. If the text is still '...'
    // when it fires, replace with a bilingual fallback message and ensure exit choice.
    if (line.loading) {
      _loadingFallbackTimer = setTimeout(() => {
        _loadingFallbackTimer = null;
        if (_russian.textContent === '...') {
          _populate({
            npcId:       line.npcId      || '',
            npcName:     line.npcName    || '',
            russian:     `${line.npcName || 'NPC'} отвлеклась... / ${line.npcName || 'NPC'} is distracted...`,
            translation: '',
            portrait:    line.portrait   || null,
            choices:     [{ id: 'end', russian: 'До свидания', translation: 'Goodbye', isFinal: true }],
            offline:     line.offline    || false,
            loading:     false,
          });
        }
      }, 2500);
    }

    // Advance hint — shown when there are no choices and not loading
    _choices.innerHTML = '';
    if (effectiveChoices.length === 0 && !line.loading) {
      const hint = document.createElement('p');
      hint.className = 'dialogue-advance-hint';
      hint.textContent = '▼ tap / press Enter to continue';
      _choices.appendChild(hint);
    }

    for (const choice of effectiveChoices) {
      const btn = document.createElement('button');
      btn.className = 'dialogue-choice-btn';
      btn.type = 'button';

      const russianSpan = document.createElement('span');
      russianSpan.className = 'choice-russian';
      russianSpan.textContent = choice.russian || '';
      btn.appendChild(russianSpan);

      // Class C fix: use fallback translation map when choice.translation is absent
      const translationText = choice.translation || _CHOICE_FALLBACK_TRANSLATIONS[choice.id] || '';
      if (translationText) {
        const translationSpan = document.createElement('span');
        translationSpan.className = 'choice-translation';
        translationSpan.textContent = translationText;
        btn.appendChild(translationSpan);
      }

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

  // -----------------------------------------------------------
  // Public — open(line: DialogueLine)
  // Only works when state is CLOSED. Sets state to OPENING.
  // After CSS transition completes, sets state to OPEN.
  // -----------------------------------------------------------
  function _collectVocabFromLine(line) {
    if (line.russian && line.translation) {
      _state.sessionVocab.push({
        russian: line.russian,
        translation: line.translation,
        npcName: line.npcName || '',
      });
    }
  }

  function open(line) {
    if (_state.phase !== _STATES.CLOSED) { return; }

    _state.phase = _STATES.OPENING;
    _state.currentLine = line;
    _state.sessionVocab = [];
    _collectVocabFromLine(line);

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
    _collectVocabFromLine(line);
    _populate(line);
  }

  // -----------------------------------------------------------
  // Public — close()
  // Only works when state is OPEN or OPENING.
  // Fires DIALOGUE_END exactly once after transition.
  // -----------------------------------------------------------
  function close() {
    if (_state.phase !== _STATES.OPEN && _state.phase !== _STATES.OPENING) { return; }

    _clearLoadingFallback();
    _state.phase = _STATES.CLOSING;
    _state.currentLine = null;
    const vocabSnapshot = _state.sessionVocab.slice();
    _state.sessionVocab = [];

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
      window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END, {
        detail: { vocab: vocabSnapshot },
      }));
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
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END, {
          detail: { vocab: vocabSnapshot },
        }));
      }
    }, 400);
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
      offline: detail.offline || false,
      loading: detail.loading || false,
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
      offline: detail.offline || false,
      loading: detail.loading || false,
    };
    update(line);
  }

  // -----------------------------------------------------------
  // dialogue:end listener — closes overlay if externally fired
  // Guard: close() itself sets phase to CLOSING before dispatching
  // DIALOGUE_END, so close() rejects re-entry via its own phase check.
  // The _overlay.classList check is a belt-and-suspenders guard.
  // -----------------------------------------------------------
  function _onExternalDialogueEnd() {
    if (_overlay && _overlay.classList.contains('is-active')) {
      close();
    }
  }

  // -----------------------------------------------------------
  // Init — called once on page load
  // -----------------------------------------------------------
  function _onKeyDown(e) {
    if (e.key !== KEYBOARD_SHORTCUTS.ADVANCE_DIALOGUE) { return; }
    if (_state.phase !== _STATES.OPEN) { return; }
    if (_choices.children.length > 0 && !_choices.querySelector('.dialogue-advance-hint')) { return; }
    window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_CHOICE, {
      detail: { choiceId: '__advance__', russian: '' },
    }));
  }

  function _init() {
    _buildDOM();
    window.addEventListener(EVENTS.DIALOGUE_START, _onDialogueStart);
    window.addEventListener(EVENTS.DIALOGUE_UPDATE, _onDialogueUpdate);
    window.addEventListener(EVENTS.DIALOGUE_END, _onExternalDialogueEnd);
    window.addEventListener('keydown', _onKeyDown);
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { open, close, update };
})();
