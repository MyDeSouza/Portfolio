// ── Intro screen ────────────────────────────────────────────
(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;

  var introText = intro.querySelector('.intro-text');

  // Nav pill expands from circle; everything else fades in
  var navWrapper = document.querySelector('.nav-pill-wrapper');
  var mark       = document.querySelector('.mark');
  var pageEls    = [
    document.querySelector('.h-display'),
    document.querySelector('.body-lg'),
    document.querySelector('.footer'),
  ].filter(Boolean);

  if (navWrapper) navWrapper.style.opacity = '0';
  if (mark)       mark.style.opacity       = '0';
  pageEls.forEach(function (el) { el.style.opacity = '0'; });

  // Pin to explicit px immediately — avoids a layout snap when transitioning from inset:0
  intro.style.top    = '0px';
  intro.style.left   = '0px';
  intro.style.right  = 'auto';
  intro.style.bottom = 'auto';
  intro.style.width  = window.innerWidth  + 'px';
  intro.style.height = window.innerHeight + 'px';

  function revealPage() {
    // Pill slides out from the circle — clip-path expands from active item rightward
    if (navWrapper) {
      navWrapper.style.opacity = '';
      var pill       = navWrapper.querySelector('.nav-pill');
      var activeItem = navWrapper.querySelector('.nav-item.active');
      if (pill && activeItem) {
        var ar    = activeItem.getBoundingClientRect();
        var pr    = pill.getBoundingClientRect();
        var rClip = Math.round(pr.right  - ar.right);
        var vClip = Math.round((pr.height - ar.height) / 2);
        // Start clipped to just the active item (matches the circle)
        pill.style.clipPath = 'inset(' + vClip + 'px ' + rClip + 'px ' + vClip + 'px 0 round 999px)';
        void pill.offsetHeight;
        pill.style.transition = 'clip-path 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        pill.style.clipPath   = 'inset(0 0 0 0 round 999px)';
      }
    }
    // Mark fades in after pill is open
    if (mark) {
      setTimeout(function () {
        mark.style.opacity = '';
        mark.classList.add('page-reveal');
      }, 400);
    }
    // Page content staggers in
    pageEls.forEach(function (el, i) {
      setTimeout(function () {
        el.style.opacity = '';
        el.classList.add('page-reveal');
      }, 200 + i * 100);
    });
  }

  function shrinkToCircle() {
    var activeItem = document.querySelector('.nav-pill .nav-item.active');
    if (!activeItem) { revealPage(); return; }

    var ir   = activeItem.getBoundingClientRect();
    var size = 44;
    var tTop  = ir.top  + (ir.height - size) / 2;
    var tLeft = ir.left + (ir.width  - size) / 2;

    // Fade text out first
    introText.style.transition = 'opacity 0.2s ease';
    introText.style.opacity    = '0';

    setTimeout(function () {
      intro.style.overflow = 'hidden';
      void intro.offsetHeight;

      var sp = 'cubic-bezier(0.16, 1, 0.3, 1)';
      intro.style.transition = [
        'top 0.7s '           + sp,
        'left 0.7s '          + sp,
        'width 0.7s '         + sp,
        'height 0.7s '        + sp,
        'border-radius 0.7s ' + sp,
      ].join(', ');

      intro.style.top          = tTop  + 'px';
      intro.style.left         = tLeft + 'px';
      intro.style.width        = size  + 'px';
      intro.style.height       = size  + 'px';
      intro.style.borderRadius = '50%';

      // Start pill expanding first, circle stays present on top
      setTimeout(function () {
        revealPage();
        // Circle fades after pill has slid out (~500ms into the 550ms expansion)
        setTimeout(function () {
          intro.style.transition = 'opacity 0.25s ease';
          intro.style.opacity    = '0';
          setTimeout(function () { intro.remove(); }, 280);
        }, 500);
      }, 720);
    }, 220);
  }

  // 0.3s delay + 0.75s wipe = 1.05s fully visible; hold ~0.55s → shrink at 1.6s
  setTimeout(shrinkToCircle, 1600);
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
