(function () {
  var wrapper = document.querySelector('.nav-pill-wrapper');
  var pill    = document.querySelector('.nav-pill');
  if (!wrapper || !pill) return;

  // ── Topbar over-dark detection ───────────────────────────
  var topbar  = document.querySelector('.topbar');
  var darkEls = document.querySelectorAll('.project-cover, [data-dark]');

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

  // ── Sliding indicator ────────────────────────────────────────
  var indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  pill.insertBefore(indicator, pill.firstChild);

  var activeItem = pill.querySelector('.nav-item.active');
  var navItems   = pill.querySelectorAll('.nav-item');

  // Position-only update — never touches transition or opacity
  function snapPosition(item) {
    if (!item) return;
    var pr = pill.getBoundingClientRect();
    var ir = item.getBoundingClientRect();
    indicator.style.left   = (ir.left - pr.left) + 'px';
    indicator.style.top    = (ir.top  - pr.top)  + 'px';
    indicator.style.width  = ir.width  + 'px';
    indicator.style.height = ir.height + 'px';
  }

  // Fade in the indicator, tracking position during any ongoing pill animation
  function showIndicator() {
    if (!activeItem) return;
    indicator.style.removeProperty('transition'); // ensure CSS fade is active
    snapPosition(activeItem);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        indicator.style.opacity = '1'; // fade in

        // Track position for the duration of the pill expand animation (350ms)
        var start = performance.now();
        function track(now) {
          snapPosition(activeItem);
          if (now - start < 380) requestAnimationFrame(track);
        }
        requestAnimationFrame(track);
      });
    });
  }

  // ── Scroll collapse ─────────────────────────────────────────
  var lastY   = window.scrollY;
  var ticking = false;

  function updateCollapse() {
    var y = window.scrollY;
    if (y > lastY && y > 60) {
      wrapper.classList.add('collapsed');
      indicator.style.transition = 'none'; // instant hide — no fade out
      indicator.style.opacity    = '0';
    } else if (y < lastY && wrapper.classList.contains('collapsed')) {
      wrapper.classList.remove('collapsed');
      // Show immediately so the circle fades in as the pill expands
      requestAnimationFrame(function () { showIndicator(); });
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

  // Initial page load — fade in after first paint
  if (activeItem) {
    requestAnimationFrame(function () { showIndicator(); });
  }

  navItems.forEach(function (item) {
    item.addEventListener('touchstart', function () { snapPosition(item); }, { passive: true });
  });
}());
