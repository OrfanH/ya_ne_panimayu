/* ============================================
   VirtualJoystick — HTML overlay, touch only
   Dispatches joystick:move and joystick:stop on window.
   Visible only on pointer:coarse devices via CSS.
   ============================================ */

(function () {
  const THUMB_MAX_RADIUS = 26;
  const DEAD_ZONE        = 0.15;

  // --- Build DOM ---
  const zone  = document.createElement('div');
  zone.id     = 'joystick-zone';

  const base  = document.createElement('div');
  base.className = 'joystick-base';

  const thumb = document.createElement('div');
  thumb.className = 'joystick-thumb';

  base.appendChild(thumb);
  zone.appendChild(base);

  const uiOverlay = document.getElementById('ui-overlay');
  uiOverlay.appendChild(zone);

  // --- State ---
  let activeTouchId = null;
  let originX       = 0;
  let originY       = 0;

  function getBaseCenter() {
    const rect = base.getBoundingClientRect();
    return {
      x: rect.left + rect.width  / 2,
      y: rect.top  + rect.height / 2,
    };
  }

  function setThumbPosition(dx, dy) {
    thumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  }

  function resetThumb() {
    thumb.style.transform = 'translate(-50%, -50%)';
    thumb.classList.remove('joystick-thumb--active');
  }

  function dispatchMove(dx, dy) {
    window.dispatchEvent(new CustomEvent('joystick:move', { detail: { dx, dy } }));
  }

  function dispatchStop() {
    window.dispatchEvent(new CustomEvent('joystick:stop'));
  }

  function onTouchStart(e) {
    if (activeTouchId !== null) { return; }
    const touch       = e.changedTouches[0];
    activeTouchId     = touch.identifier;
    const center      = getBaseCenter();
    originX           = center.x;
    originY           = center.y;
    thumb.classList.add('joystick-thumb--active');
    e.preventDefault();
  }

  function onTouchMove(e) {
    if (activeTouchId === null) { return; }

    let touch = null;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        touch = e.changedTouches[i];
        break;
      }
    }
    if (!touch) { return; }

    const rawDx = touch.clientX - originX;
    const rawDy = touch.clientY - originY;
    const dist  = Math.sqrt(rawDx * rawDx + rawDy * rawDy);

    const clampedDist = Math.min(dist, THUMB_MAX_RADIUS);
    const angle       = Math.atan2(rawDy, rawDx);
    const clampedDx   = clampedDist * Math.cos(angle);
    const clampedDy   = clampedDist * Math.sin(angle);

    setThumbPosition(clampedDx, clampedDy);

    const normDist = dist / THUMB_MAX_RADIUS;
    if (normDist < DEAD_ZONE) {
      dispatchStop();
      return;
    }

    const scale   = Math.min(normDist, 1);
    const normX   = Math.cos(angle) * scale;
    const normY   = Math.sin(angle) * scale;

    dispatchMove(normX, normY);
    e.preventDefault();
  }

  function onTouchEnd(e) {
    let found = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        found = true;
        break;
      }
    }
    if (!found) { return; }

    activeTouchId = null;
    resetThumb();
    dispatchStop();
    e.preventDefault();
  }

  zone.addEventListener('touchstart',  onTouchStart,  { passive: false });
  zone.addEventListener('touchmove',   onTouchMove,   { passive: false });
  zone.addEventListener('touchend',    onTouchEnd,    { passive: false });
  zone.addEventListener('touchcancel', onTouchEnd,    { passive: false });
}());
