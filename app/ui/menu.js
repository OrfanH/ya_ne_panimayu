/* ============================================
   Menu — pause menu overlay
   No Phaser objects here — UI layer only.
   ============================================ */

const MenuUI = (() => {
  const menuEl = document.getElementById('menu');
  const resumeBtn = document.getElementById('menu-resume');
  const journalBtn = document.getElementById('menu-journal');
  const settingsBtn = document.getElementById('menu-settings');
  let isOpen = false;

  function open() {
    menuEl.classList.remove('hidden');
    isOpen = true;
  }

  function close() {
    menuEl.classList.add('hidden');
    isOpen = false;
  }

  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  function init() {
    resumeBtn.addEventListener('click', close);

    journalBtn.addEventListener('click', () => {
      close();
      Journal.open();
    });

    settingsBtn.addEventListener('click', () => {
      close();
      SettingsUI.open();
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === KEYBOARD_SHORTCUTS.PAUSE) {
        toggle();
      }
    });
  }

  return { init, open, close, toggle };
})();

/* --- Initialize all UI modules after DOM is ready --- */
document.addEventListener('DOMContentLoaded', () => {
  MenuUI.init();
  SettingsUI.init();
  /* Journal is an IIFE that self-initializes — no init() call needed */
});
