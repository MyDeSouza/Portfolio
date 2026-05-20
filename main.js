// ── Intro screen ────────────────────────────────────────────
(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;

  var introText = intro.querySelector('.intro-text');

  var pageEls = [
    document.querySelector('.topbar'),
    document.querySelector('.h-display'),
    document.querySelector('.body-lg'),
    document.querySelector('.footer'),
  ].filter(Boolean);

  pageEls.forEach(function (el) { el.style.opacity = '0'; });

  function revealPage() {
    pageEls.forEach(function (el, i) {
      setTimeout(function () {
        el.style.opacity = '';
        el.classList.add('page-reveal');
      }, 80 + i * 100);
    });
  }

  setTimeout(function () {
    // 1. Text slides up and fades out
    introText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    introText.style.opacity    = '0';
    introText.style.transform  = 'translateY(-32px)';

    setTimeout(function () {
      // 2. Background bleeds to frosted glass
      intro.style.transition =
        'background-color 0.35s ease, ' +
        'backdrop-filter 0.35s ease, ' +
        '-webkit-backdrop-filter 0.35s ease';
      intro.style.backgroundColor      = 'rgba(236,238,245,0.5)';
      intro.style.backdropFilter       = 'blur(14px)';
      intro.style.webkitBackdropFilter = 'blur(14px)';

      setTimeout(function () {
        // 3. Frosted screen fades out, page reveals underneath
        intro.style.transition = 'opacity 0.5s ease';
        intro.style.opacity    = '0';
        setTimeout(function () {
          intro.remove();
          revealPage();
        }, 300);
      }, 380);
    }, 320);
  }, 1600);
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
