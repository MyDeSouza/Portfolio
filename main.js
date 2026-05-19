(function () {
  var wrapper = document.querySelector('.nav-pill-wrapper');
  var pill    = document.querySelector('.nav-pill');
  if (!wrapper || !pill) return;

  // ── Topbar over-dark detection ───────────────────────────
  var topbar   = document.querySelector('.topbar');
  var darkEls  = document.querySelectorAll('.project-cover, [data-dark]');

  function checkDark() {
    if (!topbar || !darkEls.length) return;
    var h = topbar.offsetHeight;
    var isDark = false;
    darkEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h && r.bottom > 0) isDark = true;
    });
    topbar.classList.toggle('over-dark', isDark);
  }

  if (darkEls.length) {
    window.addEventListener('scroll', checkDark, { passive: true });
    checkDark();
  }

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

  // Place at active item on load: position instantly, then fade in
  if (activeItem) {
    requestAnimationFrame(function () {
      moveTo(activeItem, false);           // snap to position, transition:none
      requestAnimationFrame(function () {
        indicator.style.removeProperty('transition'); // unlock CSS transition
        requestAnimationFrame(function () {
          indicator.style.opacity = '1';   // now fade in
        });
      });
    });
  }

  navItems.forEach(function (item) {
    item.addEventListener('touchstart', function () { moveTo(item, true); }, { passive: true });
  });
}());
