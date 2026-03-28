/* ============================================
   Journal — vocabulary tab, mission tab.
   Opens on EVENTS.JOURNAL_OPEN, closes on J / X / Escape.
   Reads data from storage.js on each open.
   ============================================ */

const Journal = (() => {
  let _open = false;
  let _activeTab = 'vocabulary';

  // DOM refs
  let _journalEl = null;
  let _contentEl = null;
  let _tabs = [];
  let _closeBtn = null;

  // -----------------------------------------------------------
  // Build DOM — replace static HTML with dynamic structure
  // -----------------------------------------------------------
  function _buildDOM() {
    const parent = document.getElementById('ui-overlay') || document.body;

    // Remove legacy static journal if present
    const legacy = document.getElementById('journal');
    if (legacy) { legacy.remove(); }

    _journalEl = document.createElement('div');
    _journalEl.className = 'journal';

    // Header
    const header = document.createElement('div');
    header.className = 'journal-header';

    const title = document.createElement('h2');
    title.className = 'journal-title';
    title.textContent = 'Дневник';

    _closeBtn = document.createElement('button');
    _closeBtn.className = 'journal-close';
    _closeBtn.type = 'button';
    _closeBtn.setAttribute('aria-label', 'Close journal');
    _closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    _closeBtn.addEventListener('click', close);

    header.appendChild(title);
    header.appendChild(_closeBtn);

    // Tab bar
    const tabBar = document.createElement('div');
    tabBar.className = 'journal-tabs';

    const tabDefs = [
      { id: 'vocabulary', label: 'Словарь' },
      { id: 'missions', label: 'Задания' },
    ];

    for (const def of tabDefs) {
      const btn = document.createElement('button');
      btn.className = 'journal-tab';
      btn.type = 'button';
      btn.dataset.tab = def.id;
      btn.textContent = def.label;
      if (def.id === _activeTab) { btn.classList.add('active'); }
      btn.addEventListener('click', () => _switchTab(def.id));
      tabBar.appendChild(btn);
      _tabs.push(btn);
    }

    // Content area
    _contentEl = document.createElement('div');
    _contentEl.className = 'journal-content';

    _journalEl.appendChild(header);
    _journalEl.appendChild(tabBar);
    _journalEl.appendChild(_contentEl);
    parent.appendChild(_journalEl);
  }

  // -----------------------------------------------------------
  // Tab switching
  // -----------------------------------------------------------
  function _switchTab(tabId) {
    _activeTab = tabId;
    for (const tab of _tabs) {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    }
    _renderContent();
  }

  // -----------------------------------------------------------
  // Render content based on active tab
  // -----------------------------------------------------------
  async function _renderContent() {
    _contentEl.innerHTML = '';

    if (_activeTab === 'vocabulary') {
      await _renderVocabulary();
    } else if (_activeTab === 'missions') {
      await _renderMissions();
    }
  }

  // -----------------------------------------------------------
  // Vocabulary tab
  // -----------------------------------------------------------
  async function _renderVocabulary() {
    try {
      const vocab = await getVocabulary();
      const words = vocab.words || [];

      if (words.length === 0) {
        _contentEl.appendChild(_emptyState('No words yet. Talk to NPCs to learn Russian!'));
        return;
      }

      const list = document.createElement('div');
      list.className = 'vocabulary-list';

      for (const word of words) {
        const card = document.createElement('div');
        card.className = 'vocabulary-card';

        const wordEl = document.createElement('p');
        wordEl.className = 'vocabulary-word';
        wordEl.textContent = word.cyrillic || '';

        card.appendChild(wordEl);

        if (word.transliteration) {
          const translit = document.createElement('p');
          translit.className = 'vocabulary-transliteration';
          translit.textContent = word.transliteration;
          card.appendChild(translit);
        }

        const meaning = document.createElement('p');
        meaning.className = 'vocabulary-meaning';
        meaning.textContent = word.meaning || '';
        card.appendChild(meaning);

        list.appendChild(card);
      }

      _contentEl.appendChild(list);
    } catch {
      _contentEl.appendChild(_emptyState('Could not load vocabulary.'));
    }
  }

  // -----------------------------------------------------------
  // Missions tab
  // -----------------------------------------------------------
  async function _renderMissions() {
    try {
      const progress = await getProgress();
      const active = progress.activeMission;
      const completed = progress.completedMissions || [];

      if (!active && completed.length === 0) {
        _contentEl.appendChild(_emptyState('No missions yet.'));
        return;
      }

      const list = document.createElement('div');
      list.className = 'mission-list';

      if (active) {
        const card = document.createElement('div');
        card.className = 'mission-card is-active';
        card.textContent = active;
        list.appendChild(card);
      }

      for (const mission of completed) {
        const card = document.createElement('div');
        card.className = 'mission-card is-completed';
        card.textContent = '\u2713 ' + mission;
        list.appendChild(card);
      }

      _contentEl.appendChild(list);
    } catch {
      _contentEl.appendChild(_emptyState('Could not load missions.'));
    }
  }

  // -----------------------------------------------------------
  // Empty state helper
  // -----------------------------------------------------------
  function _emptyState(text) {
    const el = document.createElement('p');
    el.className = 'journal-empty-state';
    el.textContent = text;
    return el;
  }

  // -----------------------------------------------------------
  // Open
  // -----------------------------------------------------------
  function open() {
    if (_open) { close(); return; }
    _open = true;
    _journalEl.classList.add('is-open');
    _renderContent();
  }

  // -----------------------------------------------------------
  // Close
  // -----------------------------------------------------------
  function close() {
    if (!_open) { return; }
    _open = false;
    _journalEl.classList.remove('is-open');
    window.dispatchEvent(new CustomEvent(EVENTS.JOURNAL_CLOSE));
  }

  // -----------------------------------------------------------
  // Keyboard — J or Escape closes when open
  // -----------------------------------------------------------
  function _onKeyDown(e) {
    if (!_open) { return; }
    if (e.code === KEYBOARD_SHORTCUTS.JOURNAL || e.code === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  // -----------------------------------------------------------
  // Init
  // -----------------------------------------------------------
  function _init() {
    _buildDOM();
    window.addEventListener(EVENTS.JOURNAL_OPEN, open);
    window.addEventListener('keydown', _onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { open, close };
})();
