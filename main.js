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
  var seenIntro = sessionStorage.getItem('intro-seen-v38');

  if (!isReload && seenIntro) return;

  sessionStorage.setItem('intro-seen-v38', '1');

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
          prefixInner.style.transition = 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          prefixInner.style.opacity    = '0';
          prefixInner.style.transform  = 'translateY(-' + (shiftUp + 5) + 'px)';
        });

        // 2. Large Max DeSouza rises up to where Hi I'm was
        setTimeout(function () {
          markEl.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          markEl.style.transform  = 'scale(' + scaleStart.toFixed(4) + ') translateX(' + holdX.toFixed(2) + 'px) translateY(' + (holdR - shiftUp) + 'px)';
        }, 320); // after Hi I'm is mostly gone
      }, 800);

      // Phase 3 – collapse large centred mark into the nav
      setTimeout(function () {
        markEl.style.transition = 'transform 0.85s cubic-bezier(0.65, 0, 0.35, 1)';
        markEl.style.transform  = 'scale(1)';

        // Hero text slides in after mark starts flying — reveal all .h-display blocks
        setTimeout(function () {
          // Pill and projects grid fade in as Max DeSouza lands
          if (navWrapper) { navWrapper.style.transition = 'opacity 0.5s ease'; navWrapper.style.opacity = '1'; }
          var grid = document.querySelector('.projects-grid');
          if (grid) { grid.style.transition = 'opacity 0.7s ease'; grid.style.opacity = '1'; }

          // Reveal eyebrow then h-display elements
          var eyebrow = document.querySelector('.home-hero .eyebrow');
          if (eyebrow) {
            eyebrow.style.transform = 'translateY(48px)';
            eyebrow.style.opacity   = '0';
            setTimeout(function () {
              eyebrow.style.transition = 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
              eyebrow.style.opacity    = '1';
              eyebrow.style.transform  = 'translateY(0)';
            }, 0);
          }

          var hDisplays = document.querySelectorAll('.h-display');
          hDisplays.forEach(function (el, i) {
            el.style.transform = 'translateY(48px)';
            el.style.opacity   = '0';
            setTimeout(function () {
              el.style.transition =
                'opacity 0.9s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
              el.style.opacity   = i === 0 ? '1' : '0.72';
              el.style.transform = 'translateY(0)';
            }, 60 + i * 120);
          });
        }, 550);

        // After mark lands: clear inline styles so it returns to natural small visible state
        setTimeout(function () {
          prefixOuter.style.display    = 'none';
          markEl.style.transition      = '';
          markEl.style.transform       = '';
          markEl.style.transformOrigin = '';
          markEl.style.opacity         = '';
          markName.style.transition    = 'font-weight 0.35s ease';
          markName.style.fontWeight    = '500';
          setTimeout(function () {
            markName.style.transition = '';
            markName.style.fontWeight = '';
          }, 350);

          var bodyLg = document.querySelector('.body-lg');
          var footer = document.querySelector('.footer');
          if (bodyLg) {
            bodyLg.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
            bodyLg.style.opacity    = '1';
            bodyLg.style.transform  = 'translateY(0)';
          }
          if (footer) {
            footer.style.opacity = '';
            footer.classList.add('page-reveal');
          }
          document.body.style.overflow = ''; // unlock scroll
          window.dispatchEvent(new CustomEvent('intro-done'));
        }, 900);
      }, 700 + 1600); // fade-in (700ms) + hold — gives time for Hi I'm fade + rise before collapse
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

  // ── Mark-name DeSouza split ──────────────────────────────────
  var markName   = document.querySelector('.mark-name');
  var dsOuter    = null;
  var dsNatW     = 0;

  if (markName) {
    markName.textContent = '';
    markName.appendChild(document.createTextNode('Max'));

    dsOuter = document.createElement('span');
    dsOuter.style.cssText = 'display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;';
    var dsInner = document.createElement('span');
    dsInner.style.display = 'inline-block';
    dsInner.textContent   = ' DeSouza ';
    dsOuter.appendChild(dsInner);
    markName.appendChild(dsOuter);

    requestAnimationFrame(function () {
      dsNatW = dsOuter.offsetWidth;
      dsOuter.style.width = dsNatW + 'px';
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
    if (markName) {
      markName.style.transformOrigin = 'left center';
      markName.style.transition     = 'transform ' + collapseEase;
      markName.style.transform      = 'scale(0.82)';
    }
    if (dsOuter && dsNatW) {
      dsOuter.style.transition = 'width ' + collapseEase;
      dsOuter.style.width      = '0';
    }
  }

  function doExpand() {
    wrapper.classList.remove('collapsed');
    requestAnimationFrame(function () { showIndicator(); });
    if (markName) {
      markName.style.transition = 'transform ' + expandEase;
      markName.style.transform  = 'scale(1)';
    }
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
  var lastY      = window.scrollY;
  var expandedAt = 0; // y position when we last expanded
  var ticking    = false;

  function updateCollapse() {
    var y     = window.scrollY;
    var delta = y - lastY;
    if (delta > 0 && y > 60 && y > expandedAt + 30 && !hoverExpanded) {
      // Must scroll 30 px below the expand point before collapsing again
      doCollapse();
    } else if (delta < -10 && wrapper.classList.contains('collapsed') && !hoverExpanded) {
      doExpand();
      expandedAt = y;
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



