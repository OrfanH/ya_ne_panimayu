/* ============================================
   Main Menu — title screen overlay
   Pure HTML/CSS. No Phaser. No canvas.
   Listens for EVENTS.MAIN_MENU_SHOW on window,
   dispatches EVENTS.MAIN_MENU_NEW_GAME / EVENTS.MAIN_MENU_CONTINUE on window.
   ============================================ */

const MainMenu = (() => {
  let _el = null;
  let _newBtn = null;
  let _continueBtn = null;

  function _build() {
    const el = document.createElement('div');
    el.id = 'main-menu';
    el.className = 'main-menu hidden';
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('role', 'dialog');
    el.innerHTML = `
      <div class="main-menu__inner">
        <h1 class="main-menu__title">Один Семестр</h1>
        <p class="main-menu__subtitle">One Semester</p>
        <div class="main-menu__actions">
          <button id="main-menu-new" class="main-menu__btn main-menu__btn--primary" type="button">New Game</button>
          <button id="main-menu-continue" class="main-menu__btn main-menu__btn--secondary hidden" type="button">Continue</button>
        </div>
      </div>
    `;

    const overlay = document.getElementById('ui-overlay');
    overlay.appendChild(el);

    _el = el;
    _newBtn = document.getElementById('main-menu-new');
    _continueBtn = document.getElementById('main-menu-continue');

    _newBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent(EVENTS.MAIN_MENU_NEW_GAME));
      MainMenu.hide();
    });

    _continueBtn.addEventListener('click', async () => {
      const progress = await getProgress();
      window.dispatchEvent(new CustomEvent(EVENTS.MAIN_MENU_CONTINUE, { detail: { progress } }));
      MainMenu.hide();
    });
  }

  async function _onShow() {
    if (!_el) {
      _build();
    }

    const progress = await getProgress();
    if (progress.lastSession !== null) {
      _continueBtn.classList.remove('hidden');
    } else {
      _continueBtn.classList.add('hidden');
    }

    MainMenu.show();
  }

  function show() {
    _el.classList.remove('hidden');
    // Force reflow so the transition fires from the initial state
    void _el.offsetWidth;
    _el.classList.add('is-visible');
    // Move focus to first button for keyboard / screen-reader users
    _newBtn.focus();
  }

  function hide() {
    _el.classList.remove('is-visible');
    _el.addEventListener('transitionend', () => {
      _el.classList.add('hidden');
      // Return focus to body / canvas
      document.body.focus();
    }, { once: true });
  }

  function init() {
    window.addEventListener(EVENTS.MAIN_MENU_SHOW, _onShow);
  }

  return { init, show, hide };
})();

MainMenu.init();
