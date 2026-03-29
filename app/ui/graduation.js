/* ============================================
   GraduationUI — endgame overlay after Chapter 4 test pass
   Listens for EVENTS.TEST_END on window.
   Self-initialises as an IIFE on DOMContentLoaded.
   ============================================ */

const GraduationUI = (() => {
  const NPC_FAREWELLS = [
    { id: 'galina',      nameRu: 'Галина Ивановна',    farewell: 'Удачи вам. Вы справились.',       translation: 'Good luck. You managed.' },
    { id: 'artyom',     nameRu: 'Артём',               farewell: 'Ну, бывай! Всё чётко.',            translation: 'Later! That was solid.' },
    { id: 'tamara',     nameRu: 'Тамара Андреевна',    farewell: 'Было приятно. Возвращайтесь.',     translation: 'It was a pleasure. Come back.' },
    { id: 'lena',       nameRu: 'Лена',                farewell: 'Удачи! Кофе за мной.',             translation: 'Good luck! Coffee is on me.' },
    { id: 'boris',      nameRu: 'Борис',               farewell: 'Хорошо работали.',                 translation: 'Good work.' },
    { id: 'fatima',     nameRu: 'Фатима',              farewell: 'Рада была. Приходите снова.',       translation: 'Glad to meet you. Come again.' },
    { id: 'konstantin', nameRu: 'Константин Петрович', farewell: 'Счастливого пути.',                translation: 'Safe travels.' },
    { id: 'nadya',      nameRu: 'Надя',                farewell: 'Вы справились. Отличная работа.',  translation: 'You did it. Excellent work.' },
    { id: 'alina',      nameRu: 'Алина',               farewell: 'Всё в порядке. Можете идти.',      translation: 'All is in order. You may go.' },
    { id: 'sergei',     nameRu: 'Сергей',              farewell: 'Задокументировано. Дело закрыто.', translation: 'Documented. Case closed.' },
  ];

  const _state = { shown: false };
  let _overlay = null;

  function _buildOverlay(vocabCount) {
    const overlay = document.createElement('div');
    overlay.id = 'graduation-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Semester complete');

    const card = document.createElement('div');
    card.className = 'graduation-card';

    // Badge
    const badge = document.createElement('div');
    badge.className = 'graduation-badge';
    badge.textContent = 'СЕМЕСТР ЗАВЕРШЁН';
    card.appendChild(badge);

    // Title
    const title = document.createElement('h2');
    title.className = 'graduation-title';
    title.textContent = 'Поздравляем!';
    const subline = document.createElement('span');
    subline.className = 'graduation-title-sub';
    subline.textContent = 'You made it through your first semester in Malinov.';
    title.appendChild(subline);
    card.appendChild(title);

    // Vocab count
    const vocabLine = document.createElement('p');
    vocabLine.className = 'graduation-vocab-count';
    vocabLine.textContent = `You learned ${vocabCount} words across Malinov.`;
    card.appendChild(vocabLine);

    // Farewells wrap (for scroll fade)
    const farewellsWrap = document.createElement('div');
    farewellsWrap.className = 'graduation-farewells-wrap';

    const farewellsList = document.createElement('div');
    farewellsList.className = 'graduation-farewells';

    for (const npc of NPC_FAREWELLS) {
      const item = document.createElement('div');
      item.className = 'farewell-item';

      const name = document.createElement('span');
      name.className = 'farewell-name';
      name.textContent = npc.nameRu;

      const ru = document.createElement('p');
      ru.className = 'farewell-ru';
      ru.textContent = npc.farewell;

      const en = document.createElement('p');
      en.className = 'farewell-en';
      en.textContent = npc.translation;

      item.appendChild(name);
      item.appendChild(ru);
      item.appendChild(en);
      farewellsList.appendChild(item);
    }

    const fade = document.createElement('div');
    fade.className = 'graduation-farewells-fade';

    farewellsWrap.appendChild(farewellsList);
    farewellsWrap.appendChild(fade);
    card.appendChild(farewellsWrap);

    // Dismiss button
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'graduation-dismiss-btn';
    dismissBtn.type = 'button';
    dismissBtn.textContent = 'Continue exploring';
    dismissBtn.addEventListener('click', _dismiss);
    card.appendChild(dismissBtn);

    overlay.appendChild(card);
    return { overlay, dismissBtn };
  }

  function _dismiss() {
    if (!_overlay) return;
    _overlay.classList.add('is-dismissing');
    _overlay.addEventListener('transitionend', () => {
      if (_overlay && _overlay.parentNode) {
        _overlay.parentNode.removeChild(_overlay);
      }
      _overlay = null;
    }, { once: true });

    markGraduationSeen();
    window.dispatchEvent(new CustomEvent(EVENTS.GRADUATION_DISMISS));
  }

  async function _show() {
    if (_state.shown) return;
    _state.shown = true;

    const vocab = await getVocabulary();
    const vocabCount = vocab.words ? vocab.words.length : 0;

    const { overlay, dismissBtn } = _buildOverlay(vocabCount);
    _overlay = overlay;
    document.body.appendChild(_overlay);

    // Trigger entrance animation — rAF ensures paint occurs before opacity change
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        _overlay.classList.add('is-active');
        dismissBtn.focus();
      });
    });

    window.dispatchEvent(new CustomEvent(EVENTS.GRADUATION_SHOW));
  }

  async function _onTestEnd(event) {
    const { chapter, passed } = event.detail || {};
    if (chapter !== 4 || !passed) return;

    const progress = await getProgress();
    if (progress.hasSeenGraduation) return;

    await _show();
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener(EVENTS.TEST_END, _onTestEnd);
  });

  return {};
})();
