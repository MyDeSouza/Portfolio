(function () {
  var wrapper = document.querySelector('.nav-pill-wrapper');
  var pill    = document.querySelector('.nav-pill');
  if (!wrapper || !pill) return;

  // ── Scroll collapse ─────────────────────────────────────────
  var lastY   = window.scrollY;
  var ticking = false;

  function updateCollapse() {
    var y = window.scrollY;
    if (y > lastY && y > 60) {
      wrapper.classList.add('collapsed');
    } else if (y < lastY) {
      wrapper.classList.remove('collapsed');
    }
    lastY   = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateCollapse);
      ticking = true;
    }
  }, { passive: true });

  // ── Sliding indicator ────────────────────────────────────────
  var indicator  = document.createElement('span');
  indicator.className = 'nav-indicator';
  pill.insertBefore(indicator, pill.firstChild); // render behind items

  var activeItem = pill.querySelector('.nav-item.active');
  var navItems   = pill.querySelectorAll('.nav-item');

  function moveTo(item, animate) {
    if (!item) return;
    var pr = pill.getBoundingClientRect();
    var ir = item.getBoundingClientRect();
    if (!animate) indicator.style.transition = 'none';
    else          indicator.style.removeProperty('transition');
    indicator.style.left   = (ir.left   - pr.left) + 'px';
    indicator.style.top    = (ir.top    - pr.top)  + 'px';
    indicator.style.width  = ir.width   + 'px';
    indicator.style.height = ir.height  + 'px';
  }

  // Place at active item on load with no animation, then unlock transitions
  if (activeItem) {
    requestAnimationFrame(function () {
      moveTo(activeItem, false);
      requestAnimationFrame(function () {
        indicator.style.removeProperty('transition');
      });
    });
  }

  navItems.forEach(function (item) {
    item.addEventListener('mouseenter',  function () { moveTo(item, true); });
    item.addEventListener('mouseleave',  function () { moveTo(activeItem, true); });
    // Touch: slide before navigation so the motion is briefly visible
    item.addEventListener('touchstart',  function () { moveTo(item, true); }, { passive: true });
  });
}());
