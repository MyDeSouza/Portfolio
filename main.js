// ── Loading screen ──────────────────────────────────────────
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;

  var numEl    = loader.querySelector('.loader-num');
  var barFill  = loader.querySelector('.loader-bar-fill');
  var countEl  = loader.querySelector('.loader-count');

  // Each segment: from → to over dur ms, then pause ms before next
  var segments = [
    { from: 0,  to: 22,  dur: 500,  pause: 220 },
    { from: 22, to: 46,  dur: 560,  pause: 200 },
    { from: 46, to: 72,  dur: 600,  pause: 250 },
    { from: 72, to: 100, dur: 600,  pause: 0   },
  ];

  // Background + counter reveal at each waypoint pause (indexed by segment just completed)
  var revealSteps = [
    { bg: 'rgba(236,238,245,0.76)', cnt: '0.80' },  // after 22
    { bg: 'rgba(236,238,245,0.50)', cnt: '0.55' },  // after 46
    { bg: 'rgba(236,238,245,0.22)', cnt: '0.28' },  // after 72
  ];

  var segIdx     = 0;
  var segStart   = null;
  var pauseUntil = null;

  function easeOut(t) {
    // Smooth in and out — gentle approach to each waypoint
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function setVal(v) {
    numEl.textContent    = Math.round(v);
    barFill.style.height = v + '%';
  }

  function finish() {
    // Frosted state: near-transparent overlay, counter gone
    loader.style.backgroundColor = 'rgba(236,238,245,0.10)';
    countEl.style.opacity        = '0';
    // Brief frosted moment, then fade the whole loader out
    setTimeout(function () {
      loader.classList.add('fade-out');
      setTimeout(function () { loader.remove(); }, 750);
    }, 360);
  }

  function tick(ts) {
    if (segIdx >= segments.length) { finish(); return; }

    if (pauseUntil !== null) {
      if (ts < pauseUntil) { requestAnimationFrame(tick); return; }
      pauseUntil = null;
      segStart   = ts;
    }

    if (segStart === null) segStart = ts;

    var seg = segments[segIdx];
    var t   = Math.min((ts - segStart) / seg.dur, 1);
    setVal(seg.from + (seg.to - seg.from) * easeOut(t));

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setVal(seg.to);
    segIdx++;

    if (seg.pause > 0) {
      // Apply reveal step as the numbers freeze
      var step = revealSteps[segIdx - 1];
      if (step) {
        loader.style.backgroundColor = step.bg;
        countEl.style.opacity        = step.cnt;
      }
      pauseUntil = ts + seg.pause;
      requestAnimationFrame(tick);
    } else {
      if (segIdx >= segments.length) { finish(); return; }
      segStart = ts;
      requestAnimationFrame(tick);
    }
  }

  setVal(0);
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
