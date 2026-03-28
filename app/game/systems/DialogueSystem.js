/* ============================================
   DialogueSystem — branching dialogue, choice handling,
   NPC conversation state. HTML layer only.
   Cross-layer communication via window custom events only.
   ============================================ */

const DialogueSystem = (() => {
  // -----------------------------------------------------------
  // NPC registry — maps npcId to source and mode
  // -----------------------------------------------------------
  const _NPC_REGISTRY = {
    galina: { source: 'APARTMENT_DIALOGUE', mode: 'scripted' },
    artyom: { source: 'PARK_DIALOGUE.ARTYOM', mode: 'ai' },
    tamara: { source: 'PARK_DIALOGUE.TAMARA', mode: 'ai' },
  };

  // -----------------------------------------------------------
  // Module state
  // -----------------------------------------------------------
  const _state = {
    active: false,
    npcId: null,
    mode: null,       // 'scripted' | 'ai'
    variation: null,  // current VARIATION object from content file
  };

  let _persist = {
    flags: {},       // { [flagName]: boolean }
    seenNodes: {},   // { [npcId]: string[] }
  };

  // -----------------------------------------------------------
  // Resolve NPC data from registry entry
  // -----------------------------------------------------------
  function _getNpcData(registryEntry) {
    if (registryEntry.source === 'APARTMENT_DIALOGUE') {
      return APARTMENT_DIALOGUE.NPC_DATA;
    }
    if (registryEntry.source === 'PARK_DIALOGUE.ARTYOM') {
      return PARK_DIALOGUE.ARTYOM;
    }
    if (registryEntry.source === 'PARK_DIALOGUE.TAMARA') {
      return PARK_DIALOGUE.TAMARA;
    }
    return null;
  }

  // -----------------------------------------------------------
  // Build a DialogueLine object for DialogueUI.open()
  // -----------------------------------------------------------
  function _buildLine(node, npcId) {
    const registryEntry = _NPC_REGISTRY[npcId];
    const npcData = _getNpcData(registryEntry);
    return {
      npcId,
      npcName: npcData ? npcData.name : npcId,
      russian: node.russian || '',
      translation: node.translation || '',
      portrait: (npcData && npcData.portrait) ? npcData.portrait : null,
      choices: node.choices || [],
    };
  }

  // -----------------------------------------------------------
  // Build an AI opening placeholder line for DialogueUI.open()
  // -----------------------------------------------------------
  function _buildAIOpeningLine(npcData) {
    return {
      npcId: npcData.id,
      npcName: npcData.name,
      russian: '',
      translation: '',
      portrait: npcData.portrait || null,
      choices: [
        { id: 'continue', russian: 'Продолжить...', isFinal: false },
        { id: 'end',      russian: 'До свидания',   isFinal: true  },
      ],
    };
  }

  // -----------------------------------------------------------
  // Record a node as seen in _persist
  // -----------------------------------------------------------
  function _recordSeen(npcId, nodeId) {
    if (!_persist.seenNodes[npcId]) {
      _persist.seenNodes[npcId] = [];
    }
    if (!_persist.seenNodes[npcId].includes(nodeId)) {
      _persist.seenNodes[npcId].push(nodeId);
    }
  }

  // -----------------------------------------------------------
  // Persist _persist to KV — fire-and-forget
  // -----------------------------------------------------------
  function _savePersist() {
    kvSet(STORAGE_KEYS.DIALOGUE_STATE, _persist);
  }

  // -----------------------------------------------------------
  // Event handler — DIALOGUE_START
  // -----------------------------------------------------------
  function _onDialogueStart(e) {
    const detail = e.detail || {};
    const npcId = detail.npcId;

    const registryEntry = _NPC_REGISTRY[npcId];
    if (!registryEntry) { return; }

    _state.npcId = npcId;
    _state.mode = registryEntry.mode;

    if (registryEntry.mode === 'scripted') {
      // Select variation: first where trigger.value matches flag state
      const variations = APARTMENT_DIALOGUE.VARIATIONS;
      let selectedVariation = null;

      for (const v of variations) {
        const flagValue = !!(_persist.flags[v.trigger.flag]);
        if (flagValue === v.trigger.value) {
          selectedVariation = v;
          break;
        }
      }

      // Fallback to last variation if none matched
      if (!selectedVariation) {
        selectedVariation = variations[variations.length - 1];
      }

      // Extract root node: first line with no choiceId property
      const rootNode = selectedVariation.lines.find(
        (l) => !Object.prototype.hasOwnProperty.call(l, 'choiceId')
      );

      if (!rootNode) { return; }

      // Record root node as seen
      const nodeKey = rootNode.id || selectedVariation.id + '_root';
      _recordSeen(npcId, nodeKey);

      _state.active = true;
      _state.variation = selectedVariation;

      // Open DialogueUI directly — do not re-dispatch DIALOGUE_START
      DialogueUI.open(_buildLine(rootNode, npcId));

    } else {
      // AI mode
      const npcData = _getNpcData(registryEntry);
      if (!npcData) { return; }

      TutorAI.startConversation(npcData);

      _state.active = true;

      DialogueUI.open(_buildAIOpeningLine(npcData));
    }
  }

  // -----------------------------------------------------------
  // Event handler — DIALOGUE_CHOICE
  // -----------------------------------------------------------
  function _onDialogueChoice(e) {
    // Guard: only handle scripted mode
    if (_state.mode !== 'scripted' || !_state.active) { return; }

    const detail = e.detail || {};
    const choiceId = detail.choiceId;

    // Find response node matching this choice
    const responseNode = _state.variation.lines.find(
      (l) => l.choiceId === choiceId
    );

    if (!responseNode) {
      DialogueUI.close();
      return;
    }

    // Record node as seen and persist
    const nodeKey = responseNode.id || (_state.npcId + '_' + choiceId);
    _recordSeen(_state.npcId, nodeKey);
    _savePersist();

    if (responseNode.isFinal === true) {
      // Show final NPC reply then auto-close after 1800 ms
      DialogueUI.open(_buildLine(responseNode, _state.npcId));
      setTimeout(() => {
        DialogueUI.close();
      }, 1800);
    } else {
      // Show response node (may itself have choices)
      DialogueUI.open(_buildLine(responseNode, _state.npcId));
    }
  }

  // -----------------------------------------------------------
  // Event handler — DIALOGUE_END
  // -----------------------------------------------------------
  function _onDialogueEnd() {
    if (_state.mode === 'scripted' && _state.npcId) {
      _persist.flags[_state.npcId + '_met'] = true;
      _savePersist();
    }

    _state.active = false;
    _state.npcId = null;
    _state.mode = null;
    _state.variation = null;
  }

  // -----------------------------------------------------------
  // Public — init()
  // -----------------------------------------------------------
  async function init() {
    // Load persisted state from KV
    const saved = await kvGet(STORAGE_KEYS.DIALOGUE_STATE);
    if (saved) {
      _persist.flags = saved.flags || {};
      _persist.seenNodes = saved.seenNodes || {};
    }

    // Register handlers as named properties for removal
    DialogueSystem._onDialogueStart = _onDialogueStart;
    DialogueSystem._onDialogueChoice = _onDialogueChoice;
    DialogueSystem._onDialogueEnd = _onDialogueEnd;

    window.addEventListener(EVENTS.DIALOGUE_START, DialogueSystem._onDialogueStart);
    window.addEventListener(EVENTS.DIALOGUE_CHOICE, DialogueSystem._onDialogueChoice);
    window.addEventListener(EVENTS.DIALOGUE_END, DialogueSystem._onDialogueEnd);
  }

  // -----------------------------------------------------------
  // Public — destroy() / shutdown()
  // -----------------------------------------------------------
  function destroy() {
    window.removeEventListener(EVENTS.DIALOGUE_START, DialogueSystem._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_CHOICE, DialogueSystem._onDialogueChoice);
    window.removeEventListener(EVENTS.DIALOGUE_END, DialogueSystem._onDialogueEnd);
  }

  // Boot pattern: same as TutorAI
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, destroy };
})();
