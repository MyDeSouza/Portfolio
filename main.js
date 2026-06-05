// ── Mark entry animation + page reveal ───────────────────────
(function () {
  document.body.style.visibility = ''; // always restore — cleared by head script

  var pageEls = Array.prototype.slice.call(document.querySelectorAll('.h-display, .home-hero .eyebrow')).concat([
    document.querySelector('.projects-grid'),
    document.querySelector('.body-lg'),
    document.querySelector('.footer'),
  ]).filter(Boolean);

  // Skip on in-session navigation; play on first visit or refresh.
  var navEntry  = performance.getEntriesByType('navigation')[0];
  var isReload  = navEntry && navEntry.type === 'reload';
  var seenIntro = sessionStorage.getItem('intro-seen-v49');

  if (!isReload && seenIntro) return;

  sessionStorage.setItem('intro-seen-v49', '1');

  document.body.style.overflow = 'hidden'; // prevent scroll during intro

  pageEls.forEach(function (el) {
    el.style.animation = 'none'; // stop CSS fadeUp overriding opacity:0
    el.style.opacity   = '0';
  });

  function revealPage() {
    var easeOut   = 'cubic-bezier(0.16, 1, 0.3, 1)';
    var easeInOut = 'cubic-bezier(0.65, 0, 0.35, 1)';
    var hDisplay  = document.querySelector('.h-display');
    var bodyLg    = document.querySelector('.body-lg');

    pageEls.forEach(function (el) {
      if (el === hDisplay || el === bodyLg) return;
      el.style.opacity = '';
      el.classList.add('page-reveal');
    });

    if (hDisplay) {
      hDisplay.style.animation = 'none';
      void hDisplay.offsetHeight;
      var rect   = hDisplay.getBoundingClientRect();
      var offset = Math.round(window.innerHeight / 2 - (rect.top + rect.height / 2));
      hDisplay.style.transform = 'translateY(' + offset + 'px)';
      hDisplay.style.opacity   = '1';
    }

    if (bodyLg) {
      bodyLg.style.animation = 'none';
      bodyLg.style.transform = 'translateY(24px)';
      bodyLg.style.opacity   = '0';
    }

    setTimeout(function () {
      if (hDisplay) {
        hDisplay.style.transition = 'transform 0.9s ' + easeInOut;
        hDisplay.style.transform  = 'translateY(0)';
      }
      setTimeout(function () {
        if (bodyLg) {
          bodyLg.style.transition = 'opacity 0.65s ' + easeOut + ', transform 0.75s ' + easeOut;
          bodyLg.style.opacity    = '1';
          bodyLg.style.transform  = 'translateY(0)';
        }
      }, 520);
    }, 700);
  }

  // Wait one rAF so the nav IIFE's synchronous mark-name setup has run.
  requestAnimationFrame(function () {
    var markEl   = document.querySelector('.mark');
    var markName = document.querySelector('.mark-name');
    if (!markEl || !markName) { revealPage(); return; }

    // ── Greeting ───────────────────────────────────────────────
    var prefixOuter = document.createElement('span');
    // height:0 from the start — prefix never takes up layout space, so there is
    // nothing to collapse at cleanup and no position snap when it is removed.
    prefixOuter.style.cssText = 'display:block;height:0;overflow:visible;white-space:nowrap;';
    var prefixInner = document.createElement('span');
    prefixInner.style.display    = 'block';
    prefixInner.style.fontWeight = '400';
    prefixInner.textContent   = 'Hi, I’m '; // curly apostrophe + non-breaking space
    prefixOuter.appendChild(prefixInner);
    markName.insertBefore(prefixOuter, markName.firstChild);
    markName.style.fontWeight = '600'; // name starts heavier; prefix overrides to 400

    // Hide the whole pill; it fades in when Max DeSouza lands
    var navWrapper = document.querySelector('.nav-pill-wrapper');
    if (navWrapper) navWrapper.style.opacity = '0';

    // ── Starting transform: scale up from topbar position ──
    var markRect     = markEl.getBoundingClientRect();
    var markFontSize = parseFloat(getComputedStyle(markName).fontSize);
    var introSize    = Math.min(Math.max(64, window.innerWidth * 0.09), 120);
    var hDisplaySize = Math.min(Math.max(28, window.innerWidth * 0.045), 64);
    prefixInner.style.fontSize = (hDisplaySize / introSize).toFixed(4) + 'em';
    var scaleStart = Math.min(introSize / markFontSize,
                     (window.innerWidth - 32) / markRect.width);

    // transform-origin: 50% 50% — scale radiates from the mark's own centre.
    // With the mark centred horizontally in the topbar, this also centres horizontally.
    markEl.style.transformOrigin = '50% 50%';
    markEl.style.opacity         = '0';

    // Phase 1 – fade in at large scale centred on screen
    requestAnimationFrame(function () {
      var prefixH = prefixInner.offsetHeight;
      var gapDes  = 3; // gap between Hi I'm and Max DeSouza in local px

      // Lift Hi I'm above Max DeSouza
      var shiftUp = prefixH + gapDes;
      prefixInner.style.transform = 'translateY(-' + shiftUp + 'px)';

      // holdX/holdR: translate needed to centre the large mark at 50vw/50vh.
      // Natural mark position is to the left of the pill, so holdX shifts it right.
      var markCenterX = markRect.left + markRect.width  / 2;
      var markCenterY = markRect.top  + markRect.height / 2;
      var holdX = (window.innerWidth  / 2 - markCenterX) / scaleStart;
      var holdR = (window.innerHeight / 2 - markCenterY) / scaleStart;

      // Start slightly below centre so Phase 1 has a gentle rise
      markEl.style.transform = 'scale(' + scaleStart.toFixed(4) + ') translateX(' + holdX.toFixed(2) + 'px) translateY(' + (holdR + prefixH) + 'px)';
      markEl.offsetHeight; // force reflow

      // Phase 1: fade in + rise to centred position
      markEl.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      markEl.style.opacity    = '1';
      markEl.style.transform  = 'scale(' + scaleStart.toFixed(4) + ') translateX(' + holdX.toFixed(2) + 'px) translateY(' + holdR + 'px)';

      // Hi I'm fades faster, then Max DeSouza rises to where Hi I'm was
      setTimeout(function () {
        // 1. Hi I'm fades quickly
        requestAnimationFrame(function () {
          prefixInner.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
          prefixInner.style.opacity    = '0';
          prefixInner.style.transform  = 'translateY(-' + (shiftUp + 5) + 'px)';
        });

      }, 1200); // Hi I'm holds slightly longer

      // Phase 3 – starts right when Hi I'm finishes (1200ms + 300ms fade = 1500ms)
      setTimeout(function () {
        // 1. Fade large mark out quickly (0.3s)
        markEl.offsetHeight;
        requestAnimationFrame(function () {
          markEl.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
          markEl.style.opacity    = '0';
          markEl.style.transform  = 'scale(' + scaleStart.toFixed(4) + ') translateX(' + holdX.toFixed(2) + 'px) translateY(' + (holdR - 12) + 'px)';
        });

        // 2. At 320ms: snap + split text → now mark is "Product Designer" at opacity 0
        setTimeout(function () {
          markEl.style.transition      = '';
          markEl.style.transform       = '';
          markEl.style.transformOrigin = '';
          markEl.style.opacity         = '0';
          prefixOuter.style.display    = 'none';
          markName.style.fontWeight    = '500';
          // Fire intro-done so nav IIFE runs setupMarkSplit (text → "Product Designer")
          document.body.style.overflow = '';
          window.dispatchEvent(new CustomEvent('intro-done'));
        }, 320);

        // 3. At 370ms: nav pill + Product Designer fade in together (0.65s)
        setTimeout(function () {
          if (navWrapper) { navWrapper.style.transition = 'opacity 0.65s ease'; navWrapper.style.opacity = '1'; }
          // markGhost fades in via nav IIFE's intro-done listener (already set up)
        }, 370);

        // 4. At 700ms: projects grid fades in (~halfway through nav/mark fade)
        setTimeout(function () {
          var grid = document.querySelector('.projects-grid');
          if (grid) { grid.style.transition = 'opacity 0.7s ease'; grid.style.opacity = '1'; }
        }, 700);
      }, 700 + 800); // 1500ms total — fires right as Hi I'm finishes
    });
  });
}());



// ── Nav ──────────────────────────────────────────────────────
(function () {
  var wrapper = document.querySelector('.nav-pill-wrapper');
  var pill    = document.querySelector('.nav-pill');
  if (!wrapper || !pill) return;

  // ── Topbar over-dark detection ───────────────────────────
  var topbar  = document.querySelector('.topbar');
  var darkEls = document.querySelectorAll('.project-cover, [data-dark], .project-card');

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
    if (isDark === lastDark) return;
    var firstCheck = lastDark === null;
    lastDark = isDark;

    if (mark && !firstCheck) {
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

  // ── Mark-name split (deferred until after intro so intro shows "Max DeSouza") ──
  var markName   = document.querySelector('.mark-name');
  var markGhost  = document.querySelector('.topbar-mark-ghost');
  var dsOuter    = null;
  var dsNatW     = 0;

  function setupMarkSplit() {
    if (!markName) return;
    markName.textContent = '';

    // "Product " — collapses away on scroll, leaving "Designer"
    dsOuter = document.createElement('span');
    dsOuter.style.cssText = 'display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;';
    var dsInner = document.createElement('span');
    dsInner.style.display = 'inline-block';
    dsInner.textContent   = 'Product ';
    dsOuter.appendChild(dsInner);
    markName.appendChild(dsOuter);

    // "Designer" — always visible
    markName.appendChild(document.createTextNode('Designer'));

    requestAnimationFrame(function () {
      dsNatW = dsOuter.offsetWidth;
      dsOuter.style.width = dsNatW + 'px';
    });
  }

  // Defer split until after intro; if no intro, split immediately
  var navEntry0  = performance.getEntriesByType('navigation')[0];
  var isReload0  = navEntry0 && navEntry0.type === 'reload';
  var seenKey    = sessionStorage.getItem('intro-seen-v49');
  if (!isReload0 && seenKey) {
    setupMarkSplit(); // no intro playing — split right away
  } else {
    window.addEventListener('intro-done', function onID() {
      window.removeEventListener('intro-done', onID);
      setupMarkSplit(); // text changes to "Product Designer" while still opacity:0
      requestAnimationFrame(function () {
        if (markGhost) {
          markGhost.style.transition = 'opacity 0.4s ease';
          markGhost.style.opacity    = '1'; // fade in already showing correct text
        }
      });
    });
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
  var collapseEase  = '0.55s cubic-bezier(0.4, 0, 0.2, 1)';
  var expandEase    = '0.55s cubic-bezier(0.16, 1, 0.3, 1)';

  function doCollapse() {
    wrapper.classList.add('collapsed');
    hideIndicator();
    // Collapse "Product " leaving "Designer" visible
    if (dsOuter && dsNatW) {
      dsOuter.style.transition = 'width ' + collapseEase;
      dsOuter.style.width      = '0';
    }
  }

  function doExpand() {
    wrapper.classList.remove('collapsed');
    requestAnimationFrame(function () { showIndicator(); });
    // Restore "Product "
    if (dsOuter && dsNatW) {
      dsOuter.style.transition = 'width ' + expandEase;
      dsOuter.style.width      = dsNatW + 'px';
    }
  }

  // ── Per-icon hover labels ────────────────────────────────────
  var measurer = document.createElement('span');
  measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:11px;font-weight:500;letter-spacing:0.05em;font-family:inherit;';
  document.body.appendChild(measurer);
  navItems.forEach(function (item) {
    if (item.classList.contains('nav-item--text')) return; // already has text content
    var text = item.getAttribute('aria-label') || '';
    measurer.textContent = text;
    var w = measurer.offsetWidth + 24;
    item.style.setProperty('--hover-w', Math.max(34, w) + 'px');
    var lbl = document.createElement('span');
    lbl.className = 'nav-item-label';
    lbl.textContent = text;
    item.appendChild(lbl);
  });
  document.body.removeChild(measurer);

  // Active-item hover expand removed — indicator stays as circle

  // ── Non-active hover: track indicator during layout shifts ───
  var nonActiveRAF = null;

  function stopNonActiveTracking() {
    if (nonActiveRAF) {
      cancelAnimationFrame(nonActiveRAF);
      nonActiveRAF = null;
    }
    indicator.style.removeProperty('transition');
  }

  if (activeItem) {
    navItems.forEach(function (item) {
      if (item === activeItem) return;
      item.addEventListener('mouseenter', function () {
        if (nonActiveRAF) return;
        indicator.style.transition = 'none';
        indicator.style.width      = '44px';
        snapPosition(activeItem);
        requestAnimationFrame(function () {
          indicator.style.transition =
            'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)' +
            ', background-color var(--dur-2) var(--ease-in-out)';
          function loop() {
            snapPosition(activeItem);
            nonActiveRAF = requestAnimationFrame(loop);
          }
          nonActiveRAF = requestAnimationFrame(loop);
        });
      });
      item.addEventListener('mouseleave', function () {
        setTimeout(function () {
          stopNonActiveTracking();
          snapPosition(activeItem);
        }, 420);
      });
    });
  }

  // ── Scroll collapse ──────────────────────────────────────────
  var lastY     = window.scrollY;
  var collapseY = 0; // y where we last collapsed
  var expandY   = 0; // y where we last expanded
  var ticking   = false;

  function updateCollapse() {
    var y     = window.scrollY;
    var delta = y - lastY;

    if (!wrapper.classList.contains('collapsed')) {
      // Collapse: scrolling down, past 60 px, and at least 40 px below last expand
      if (delta > 0 && y > 60 && y > expandY + 40 && !hoverExpanded) {
        doCollapse();
        collapseY = y;
      }
    } else {
      // Expand: at least 20 px above where we collapsed
      if (y < collapseY - 20 && !hoverExpanded) {
        doExpand();
        expandY = y;
      }
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
        e.preventDefault();
        doExpand();
      }
    });
    item.addEventListener('touchstart', function () {
      snapPosition(item);
    }, { passive: true });
  });

  // ── Initial page load ────────────────────────────────────────
  if (activeItem) {
    requestAnimationFrame(function () { showIndicator(); });
  }

  window.addEventListener('intro-done', function () {
    requestAnimationFrame(function () { if (activeItem) showIndicator(); });
  });
}());



// ── Hero: after 8 s both texts dim to 64%, hover restores to 100% ──
(function () {
  var hero = document.querySelector('.home-hero');
  var h1   = document.querySelector('.home-hero h1.h-display');
  var p    = document.querySelector('.home-hero p.h-display');
  if (!hero || !h1 || !p) return;

  setTimeout(function () {
    var easing = '0.7s ease';

    // Capture current values as inline start points
    h1.style.opacity  = getComputedStyle(h1).opacity;
    p.style.animation = 'none';
    p.style.opacity   = getComputedStyle(p).opacity;
    p.offsetHeight; // force reflow

    // h1 dims to 64%, p brightens to 100%
    h1.style.transition = 'opacity ' + easing;
    h1.style.opacity    = '0.64';
    p.style.transition  = 'opacity ' + easing;
    p.style.opacity     = '1';

    // Hand off to CSS class after transition so :hover and :has() take over
    setTimeout(function () {
      h1.style.transition = '';
      h1.style.opacity    = '';
      p.style.transition  = '';
      p.style.opacity     = '';
      hero.classList.add('hero-active');
    }, 700);
  }, 8000);
}());



// ── About / Work nav ─────────────────────────────────────────
(function () {
  var aboutBtn  = document.getElementById('about-btn');
  var workBtn   = document.getElementById('work-btn');
  var panel     = document.getElementById('about-panel');
  var overlay   = document.getElementById('about-overlay');
  var indicator = document.querySelector('.nav-indicator');
  var pill      = document.querySelector('.nav-pill');

  function moveIndicator(target) {
    if (!indicator || !pill || !target) return;
    var pr = pill.getBoundingClientRect();
    var ir = target.getBoundingClientRect();
    indicator.style.transition =
      'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    indicator.style.left = (ir.left - pr.left + ir.width  / 2) + 'px';
    indicator.style.top  = (ir.top  - pr.top  + ir.height / 2) + 'px';
  }

  function openAbout() {
    if (panel)   { panel.classList.add('open');   panel.setAttribute('aria-hidden', 'false'); }
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    moveIndicator(aboutBtn);
  }

  function closeAbout() {
    if (panel)   { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    moveIndicator(workBtn);
  }

  if (aboutBtn)  aboutBtn.addEventListener('click',  function (e) { e.preventDefault(); openAbout();  });
  if (workBtn)   workBtn.addEventListener('click',   function (e) { e.preventDefault(); closeAbout(); });
  if (overlay)   overlay.addEventListener('click',   closeAbout);
}());



