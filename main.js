// ── Loading screen ──────────────────────────────────────────
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;

  var numEl    = loader.querySelector('.loader-num');
  var barFill  = loader.querySelector('.loader-bar-fill');
  var countEl  = loader.querySelector('.loader-count');

  // Hide all page elements except the main heading — revealed after loader exits
  var pageEls = [
    document.querySelector('.topbar'),
    document.querySelector('.eyebrow'),
    document.querySelector('.body-lg'),
    document.querySelector('.home-ctas'),
    document.querySelector('.footer'),
  ].filter(Boolean);

  pageEls.forEach(function (el) { el.style.opacity = '0'; });

  var duration = 2800;
  var start    = null;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function finish() {
    loader.classList.add('fade-out');
    pageEls.forEach(function (el, i) {
      setTimeout(function () {
        el.style.opacity = '';
        el.classList.add('page-reveal');
      }, 100 + i * 90);
    });
    setTimeout(function () { loader.remove(); }, 750);
  }

  function tick(ts) {
    if (start === null) start = ts;
    var t = Math.min((ts - start) / duration, 1);
    var e = ease(t);

    numEl.textContent    = Math.round(e * 100);
    barFill.style.height = (e * 100) + '%';

    // Blur 20px → 0, bg 0.88 → 0.10, counter fades in last 30%
    var blur = (20 * (1 - e)).toFixed(1);
    var bg   = (0.88 - 0.78 * e).toFixed(3);
    loader.style.backgroundColor      = 'rgba(236,238,245,' + bg + ')';
    loader.style.backdropFilter       = 'blur(' + blur + 'px)';
    loader.style.webkitBackdropFilter = 'blur(' + blur + 'px)';
    countEl.style.opacity = e < 0.7 ? '1' : String(((1 - e) / 0.3).toFixed(3));

    if (t < 1) { requestAnimationFrame(tick); } else { finish(); }
  }

  requestAnimationFrame(tick);
}());

// ── Nav ──────────────────────────────────────────────────────
(function () {
  var wrapper = document.querySelector('.nav-pill-wrapper');
  var pill    = document.querySelector('.nav-pill');
  if (!wrapper || !pill) return;

  // ── Topbar over-dark detection ───────────────────────────
  var topbar  = document.querySelector('.topbar');
  var darkEls = document.querySelectorAll('.project-cover, [data-dark]');

  var mark        = document.querySelector('.mark');
  var markFadeTimer = null;
  var lastDark    = null;

  function checkDark() {
    if (!topbar || !darkEls.length) return;
    var h = topbar.offsetHeight;
    var isDark = false;
    darkEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h && r.bottom > 0) isDark = true;
    });
    if (isDark === lastDark) return; // no change
    lastDark = isDark;

    // Cross-fade: hide mark → swap class → show mark
    if (mark) {
      mark.style.opacity = '0';
      clearTimeout(markFadeTimer);
      markFadeTimer = setTimeout(function () {
        topbar.classList.toggle('over-dark', isDark);
        mark.style.opacity = '1';
      }, 150);
    } else {
      topbar.classList.toggle('over-dark', isDark);
    }
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

  function snapPosition(item) {
    if (!item) return;
    var pr = pill.getBoundingClientRect();
    var ir = item.getBoundingClientRect();
    indicator.style.left = (ir.left - pr.left + ir.width  / 2) + 'px';
    indicator.style.top  = (ir.top  - pr.top  + ir.height / 2) + 'px';
  }

  function showIndicator() {
    if (!activeItem) return;
    indicator.style.removeProperty('transition');
    snapPosition(activeItem);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        indicator.style.opacity = '1';
        pill.classList.add('active-shown');
        var start = performance.now();
        function track(now) {
          snapPosition(activeItem);
          if (now - start < 380) requestAnimationFrame(track);
        }
        requestAnimationFrame(track);
      });
    });
  }

  function hideIndicator() {
    indicator.style.transition = 'none';
    indicator.style.opacity    = '0';
    pill.classList.remove('active-shown');
  }

  // ── Collapse helpers ─────────────────────────────────────────
  var hoverExpanded = false;

  function doCollapse() {
    wrapper.classList.add('collapsed');
    hideIndicator();
  }

  function doExpand() {
    wrapper.classList.remove('collapsed');
    requestAnimationFrame(function () { showIndicator(); });
  }

  // ── Scroll collapse ──────────────────────────────────────────
  var lastY   = window.scrollY;
  var ticking = false;

  function updateCollapse() {
    var y = window.scrollY;
    if (y > lastY && y > 60 && !hoverExpanded) {
      doCollapse();
    } else if (y < lastY && wrapper.classList.contains('collapsed') && !hoverExpanded) {
      doExpand();
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

  // ── Hover to expand / collapse (desktop) ─────────────────────
  wrapper.addEventListener('mouseenter', function () {
    if (wrapper.classList.contains('collapsed')) {
      hoverExpanded = true;
      doExpand();
    }
  });

  wrapper.addEventListener('mouseleave', function () {
    if (hoverExpanded) {
      hoverExpanded = false;
      doCollapse();
    }
  });

  // ── Tap to expand collapsed nav, then navigate (mobile) ──────
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (wrapper.classList.contains('collapsed')) {
        e.preventDefault(); // first tap: expand only
        doExpand();
      }
      // second tap: navigation proceeds normally
    });

    item.addEventListener('touchstart', function () {
      snapPosition(item);
    }, { passive: true });
  });

  // ── Initial page load ────────────────────────────────────────
  if (activeItem) {
    requestAnimationFrame(function () { showIndicator(); });
  }
}());
