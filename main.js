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
    document.querySelector('.body-lg'),
    document.querySelector('.footer'),
  ].filter(Boolean);

  pageEls.forEach(function (el) { el.style.opacity = '0'; });

  var duration = 2800;
  var start    = null;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function revealPage() {
    pageEls.forEach(function (el, i) {
      setTimeout(function () {
        el.style.opacity = '';
        el.classList.add('page-reveal');
      }, 80 + i * 90);
    });
  }

  function shrinkToPill() {
    var pill = document.querySelector('.nav-pill');
    if (!pill) { revealPage(); return; }

    var pr = pill.getBoundingClientRect();
    var bar = loader.querySelector('.loader-bar');
    if (bar) bar.style.opacity = '0';

    // Switch from inset: 0 to explicit px so width/height/top/left are animatable
    loader.style.top    = '0px';
    loader.style.right  = 'auto';
    loader.style.bottom = 'auto';
    loader.style.left   = '0px';
    loader.style.width  = window.innerWidth  + 'px';
    loader.style.height = window.innerHeight + 'px';
    loader.style.overflow = 'hidden';

    void loader.offsetHeight; // force reflow before transition

    var sp = 'cubic-bezier(0.4, 0, 0.2, 1)';
    loader.style.transition = [
      'top 0.55s '              + sp,
      'left 0.55s '             + sp,
      'width 0.55s '            + sp,
      'height 0.55s '           + sp,
      'border-radius 0.55s '    + sp,
      'background-color 0.55s ' + sp,
      'backdrop-filter 0.55s '  + sp,
      '-webkit-backdrop-filter 0.55s ' + sp,
    ].join(', ');

    // Morph into the nav pill — match its exact position, size and visual style
    loader.style.top                  = pr.top    + 'px';
    loader.style.left                 = pr.left   + 'px';
    loader.style.width                = pr.width  + 'px';
    loader.style.height               = pr.height + 'px';
    loader.style.borderRadius         = '999px';
    loader.style.backgroundColor      = 'rgba(205,206,212,0.16)';
    loader.style.backdropFilter       = 'blur(6px) saturate(120%)';
    loader.style.webkitBackdropFilter = 'blur(6px) saturate(120%)';

    // Fade out and reveal once morphed
    setTimeout(function () {
      loader.style.transition = 'opacity 0.22s ease';
      loader.style.opacity    = '0';
      revealPage();
      setTimeout(function () { loader.remove(); }, 260);
    }, 600);
  }

  function finish() {
    // Snap fully opaque so nothing shows through while counter exits
    loader.style.transition           = '';
    loader.style.backgroundColor      = '#ECEEF5';
    loader.style.backdropFilter       = 'none';
    loader.style.webkitBackdropFilter = 'none';

    countEl.classList.add('loader-count-exit');
    setTimeout(shrinkToPill, 420);
  }

  function tick(ts) {
    if (start === null) start = ts;
    var t = Math.min((ts - start) / duration, 1);
    var e = ease(t);

    numEl.textContent    = Math.round(e * 100);
    barFill.style.height = (e * 100) + '%';

    // Blur 20px → 0, bg 0.88 → 0.10
    var blur = (20 * (1 - e)).toFixed(1);
    var bg   = (0.88 - 0.78 * e).toFixed(3);
    loader.style.backgroundColor      = 'rgba(236,238,245,' + bg + ')';
    loader.style.backdropFilter       = 'blur(' + blur + 'px)';
    loader.style.webkitBackdropFilter = 'blur(' + blur + 'px)';

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
