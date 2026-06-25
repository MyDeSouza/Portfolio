// ── Mark entry animation + page reveal ───────────────────────
(function () {
  document.body.style.visibility = ''; // always restore — cleared by head script

  var pageEls = Array.prototype.slice.call(document.querySelectorAll('.h-display, .home-hero .eyebrow')).concat([
    document.querySelector('.projects-grid'),
    document.querySelector('.body-lg'),
    document.querySelector('.footer'),
  ]).filter(Boolean);

  // Play intro on every fresh load (navigate + reload); skip only on browser back/forward.
  var navEntry = performance.getEntriesByType('navigation')[0];
  var navType  = navEntry ? navEntry.type : 'navigate';
  if (navType === 'back_forward') return;

  // Project pages: skip intro — nav is already visible, just hide the mark ghost
  if (document.documentElement.dataset.mode === 'project') {
    var mg = document.querySelector('.topbar-mark-ghost');
    if (mg) mg.style.display = 'none';
    return;
  }

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
    markName.style.color = '#0c1116'; // lock dark during intro — prevents data-lum white override

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
          markName.style.color         = ''; // restore — CSS data-lum rules take over
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

  var topbar = document.querySelector('.topbar');

  // ── Topbar label — completely separate from the intro mark ──────
  var markGhost    = document.querySelector('.topbar-mark-ghost');
  var topbarLabel  = document.getElementById('topbar-label');
  var dsOuter      = null;
  var dsNatW       = 0;

  function setupLabel() {
    if (!topbarLabel) return;
    topbarLabel.textContent = '';

    // "Product " — collapses on scroll
    dsOuter = document.createElement('span');
    dsOuter.style.cssText = 'display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;padding-right:0.28em;';
    var dsInner = document.createElement('span');
    dsInner.style.display = 'inline-block';
    dsInner.textContent   = 'Product';
    dsOuter.appendChild(dsInner);
    topbarLabel.appendChild(dsOuter);

    // "Design" always visible, "er" slides in from left on about open
    topbarLabel.appendChild(document.createTextNode('Design'));

    var labelEr = document.createElement('span');
    labelEr.id = 'topbar-label-er';
    labelEr.textContent = 'er';
    labelEr.style.cssText = 'display:inline-block;overflow:hidden;max-width:0;opacity:0;vertical-align:bottom;transition:max-width 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.35s ease;';
    topbarLabel.appendChild(labelEr);

    requestAnimationFrame(function () {
      dsNatW = dsOuter.offsetWidth;
      dsOuter.style.width = dsNatW + 'px';
    });
  }

  function showLabel() {
    setupLabel();
    // Hide the intro mark permanently
    if (markGhost) markGhost.style.display = 'none';
    // Fade in the label
    requestAnimationFrame(function () {
      if (topbarLabel) {
        topbarLabel.style.transition = 'opacity 0.4s ease, color 0.5s ease';
        topbarLabel.style.opacity    = '1';
      }
    });
  }

  // Show label after intro completes; on back/forward skip straight to showing it
  var navEntry0 = performance.getEntriesByType('navigation')[0];
  var navType0  = navEntry0 ? navEntry0.type : 'navigate';
  if (navType0 === 'back_forward') {
    showLabel();
  } else {
    window.addEventListener('intro-done', function onID() {
      window.removeEventListener('intro-done', onID);
      showLabel();
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
  var hoverExpanded   = false;
  var collapseEase    = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  var expandEase      = '0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  var expandClearTimer = null;

  // Measure nav-btn natural widths for JS-driven animation
  var aboutBtnEl     = document.getElementById('about-btn');
  var aboutBtnNatW   = aboutBtnEl   ? aboutBtnEl.offsetWidth   : 0;
  var sprintsBtnEl   = document.getElementById('sprints-btn');
  var sprintsBtnNatW = sprintsBtnEl ? sprintsBtnEl.offsetWidth : 0;
  var workBtnEl      = document.getElementById('work-btn');
  var workBtnNatW    = workBtnEl    ? workBtnEl.offsetWidth    : 0;
  var workBtnSavedW  = 0;

  function clearBtnInline(el) {
    if (!el) return;
    el.style.width      = '';
    el.style.transition = '';
    el.style.opacity    = '';
    el.style.padding    = '';
    el.style.overflow   = '';
  }
  function clearAboutBtnInline()   { clearBtnInline(aboutBtnEl); }
  function clearSprintsBtnInline() { clearBtnInline(sprintsBtnEl); }
  function clearWorkBtnInline()    { clearBtnInline(workBtnEl); }

  function collapseBtn(el, natW) {
    if (!el || !natW) return;
    var fromW = el.offsetWidth || natW;
    el.style.overflow   = 'hidden';
    el.style.transition = 'none';
    el.style.width      = fromW + 'px';
    el.style.opacity    = '1';
    el.offsetHeight;
    el.style.transition = 'opacity 0.15s ease, width ' + collapseEase + ' 0.05s, padding ' + collapseEase + ' 0.05s';
    el.style.width      = '0';
    el.style.padding    = '0';
    el.style.opacity    = '0';
  }

  function expandBtn(el, natW) {
    if (!el || !natW) return;
    el.style.overflow   = 'hidden';
    el.style.transition = 'width ' + expandEase + ', padding ' + expandEase + ', opacity 0.3s ease 0.2s';
    el.style.width      = natW + 'px';
    el.style.padding    = '';
    el.style.opacity    = '';
  }

  function doCollapse() {
    collapseY = window.scrollY;
    if (expandClearTimer) { clearTimeout(expandClearTimer); expandClearTimer = null; }

    var inSprints = document.body.classList.contains('sprints-open');

    collapseBtn(aboutBtnEl, aboutBtnNatW);

    if (inSprints) {
      workBtnSavedW = workBtnEl ? (workBtnEl.offsetWidth || workBtnNatW) : workBtnNatW;
      collapseBtn(workBtnEl, workBtnNatW);
      if (sprintsBtnEl) {
        sprintsBtnEl.style.background = 'transparent';
        sprintsBtnEl.style.color = '#ffffff';
      }
    } else {
      collapseBtn(sprintsBtnEl, sprintsBtnNatW);
    }

    wrapper.classList.add('collapsed');
    hideIndicator();
    if (dsOuter && dsNatW) {
      dsOuter.style.transition   = 'width ' + collapseEase + ', padding-right ' + collapseEase;
      dsOuter.style.width        = '0';
      dsOuter.style.paddingRight = '0';
    }
    if (topbarLabel) {
      topbarLabel.style.transition      = 'transform ' + collapseEase + ', opacity 0.3s ease, color 0.5s ease';
      topbarLabel.style.transformOrigin = 'left center';
      topbarLabel.style.transform       = 'scale(0.82)';
    }
  }

  function doExpand() {
    expandedAt = Date.now();
    wrapper.classList.remove('collapsed');

    var inSprints = document.body.classList.contains('sprints-open');

    if (expandClearTimer) { clearTimeout(expandClearTimer); expandClearTimer = null; }
    expandBtn(aboutBtnEl, aboutBtnNatW);

    if (inSprints) {
      expandBtn(workBtnEl, workBtnSavedW || workBtnNatW);
      if (sprintsBtnEl) {
        sprintsBtnEl.style.background = '';
        sprintsBtnEl.style.color = '';
      }
    } else {
      expandBtn(sprintsBtnEl, sprintsBtnNatW);
    }

    expandClearTimer = setTimeout(function () {
      expandClearTimer = null;
      clearAboutBtnInline();
      clearSprintsBtnInline();
      clearWorkBtnInline();
    }, 600);

    requestAnimationFrame(function () { showIndicator(); });
    if (dsOuter && dsNatW) {
      dsOuter.style.transition   = 'width ' + expandEase + ', padding-right ' + expandEase;
      dsOuter.style.width        = dsNatW + 'px';
      dsOuter.style.paddingRight = '0.28em';
    }
    if (topbarLabel) {
      topbarLabel.style.transition = 'transform ' + expandEase + ', opacity 0.3s ease, color 0.5s ease';
      topbarLabel.style.transform  = 'scale(1)';
    }
  }

  // Expose for Sprints IIFE so it can collapse/expand the nav
  window.__expandNav   = doExpand;
  window.__collapseNav = doCollapse;

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
  var lastY       = window.scrollY;
  var ticking     = false;
  var expandedAt  = 0; // timestamp of last expand, prevents instant re-collapse

  function updateCollapse() {
    var y     = window.scrollY;
    var delta = y - lastY;
    lastY     = y;
    ticking   = false;

    if (!wrapper.classList.contains('collapsed')) {
      // Collapse: scrolling down past 50px, at least 400ms after last expand
      if (delta > 0 && y > 50 && !hoverExpanded && Date.now() - expandedAt > 400) {
        doCollapse();
      }
    } else {
      // Expand: any upward scroll — only if there is an about-btn to expand to
      if (delta < 0 && !hoverExpanded && aboutBtnEl) {
        doExpand();
      }
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateCollapse);
      ticking = true;
    }
  }, { passive: true });

  // ── Hover to expand / collapse (desktop) ─────────────────────
  wrapper.addEventListener('mouseenter', function () {
    if (aboutBtnEl && wrapper.classList.contains('collapsed')) {
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
      if (aboutBtnEl && wrapper.classList.contains('collapsed')) {
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
  var wrapper   = document.getElementById('about-panel');
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
  // Expose for other IIFEs (sprints, etc.)
  window.__moveNavIndicator = moveIndicator;

  function openAbout() {
    if (wrapper)  { wrapper.setAttribute('aria-hidden', 'false'); }
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('about-open');
    document.body.style.overflow = 'hidden';
    var er = document.getElementById('topbar-label-er');
    if (er) { er.style.maxWidth = '2em'; er.style.opacity = '1'; }
    moveIndicator(aboutBtn);
  }

  function closeAbout() {
    if (wrapper)  { wrapper.setAttribute('aria-hidden', 'true'); }
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('about-open');
    document.body.style.overflow = '';
    var er = document.getElementById('topbar-label-er');
    if (er) { er.style.maxWidth = '0'; er.style.opacity = '0'; }
    moveIndicator(workBtn);
  }

  if (aboutBtn)  aboutBtn.addEventListener('click',  function (e) { e.preventDefault(); openAbout();  });
  if (workBtn && wrapper) workBtn.addEventListener('click', function (e) { e.preventDefault(); closeAbout(); });
  if (overlay)   overlay.addEventListener('click',   closeAbout);
}());



// ── Work view toggle (single / grid) ─────────────────────────
(function () {
  var singleBtn = document.getElementById('view-single');
  var gridBtn   = document.getElementById('view-grid');
  var grid      = document.querySelector('.projects-grid');
  if (!singleBtn || !gridBtn || !grid) return;

  function setView(view) {
    if (view === 'single') {
      grid.classList.add('view-single');
      grid.classList.remove('view-grid');
      document.body.classList.add('view-single-active');
      singleBtn.classList.add('active');
      gridBtn.classList.remove('active');
    } else {
      grid.classList.remove('view-single');
      grid.classList.add('view-grid');
      document.body.classList.remove('view-single-active');
      gridBtn.classList.add('active');
      singleBtn.classList.remove('active');
    }
  }

  singleBtn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); setView('single'); });
  gridBtn.addEventListener('click',   function (e) { e.preventDefault(); e.stopPropagation(); setView('grid');   });

  setView(window.matchMedia('(max-width: 1366px) and (orientation: portrait)').matches ? 'single' : 'grid');
}());



// ── Sprints panel ─────────────────────────────────────────────
(function () {
  var sprintsBtn = document.getElementById('sprints-btn');
  var workBtn    = document.getElementById('work-btn');
  var aboutBtn   = document.getElementById('about-btn');
  var panel      = document.getElementById('sprints-panel');
  var masonry    = document.getElementById('sprints-masonry');
  if (!sprintsBtn || !panel) return;

  // Read ?sprint=xxx from URL — falls back to 'default'
  var sprintSet = (new URLSearchParams(window.location.search)).get('sprint') || 'default';
  var loaded    = false;

  function loadSprints() {
    if (loaded) return;
    loaded = true;
    fetch('sprints/' + sprintSet + '/index.html')
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (html) {
        if (masonry) masonry.innerHTML = html;
      })
      .catch(function () {
        if (masonry) masonry.innerHTML = '<p class="sprints-loading">Sprint set “' + sprintSet + '” not found.</p>';
      });
  }

  function moveInd(target) {
    if (window.__moveNavIndicator) window.__moveNavIndicator(target);
  }

  function openSprints() {
    loadSprints();
    if (window.__expandNav) window.__expandNav();
    // If about is open, close it cleanly first
    if (document.body.classList.contains('about-open')) {
      var aboutOverlay = document.getElementById('about-overlay');
      var aboutPanel   = document.getElementById('about-panel');
      if (aboutOverlay) aboutOverlay.classList.remove('open');
      if (aboutPanel)   aboutPanel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('about-open');
      var er = document.getElementById('topbar-label-er');
      if (er) { er.style.maxWidth = '0'; er.style.opacity = '0'; }
    }
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sprints-open');
    document.body.style.overflow = 'hidden';
    moveInd(sprintsBtn);
  }

  function closeSprints() {
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sprints-open');
    // Only reset overflow/indicator if about isn't taking over
    if (!document.body.classList.contains('about-open')) {
      document.body.style.overflow = '';
      moveInd(workBtn);
    }
  }

  sprintsBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (document.body.classList.contains('sprints-open')) {
      closeSprints();
    } else {
      openSprints();
    }
  });

  if (workBtn)  workBtn.addEventListener('click',  function () { if (document.body.classList.contains('sprints-open')) closeSprints(); });
  if (aboutBtn) aboutBtn.addEventListener('click', function () { if (document.body.classList.contains('sprints-open')) closeSprints(); });

  // Escape key closes sprints
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('sprints-open')) closeSprints();
  });

  // Collapse/expand nav based on scroll within the panel (window scroll is locked)
  var lastPanelScroll = 0;
  var panelCollapsed  = false;
  panel.addEventListener('scroll', function () {
    var y = panel.scrollTop;
    if (!panelCollapsed && y > 80) {
      panelCollapsed = true;
      if (window.__collapseNav) window.__collapseNav();
    } else if (panelCollapsed && y <= 30) {
      panelCollapsed = false;
      if (window.__expandNav) window.__expandNav();
    }
    lastPanelScroll = y;
  }, { passive: true });
}());



// ── W3C Luminance nav theming ─────────────────────────────────
// Samples real pixels behind the nav pill using document.elementsFromPoint,
// walks the DOM to composite background colours, and samples images via canvas.
// Sets data-lum on both .nav-pill and .topbar so CSS can style both layers.
(function () {
  var topbar = document.querySelector('.topbar');
  var pill   = document.querySelector('.nav-pill');
  if (!topbar || !pill) return;

  // ─── W3C sRGB → linear → luminance ───────────────────────────
  function lin(c) {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function lum(r, g, b) {
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }
  function parseRGB(str) {
    var m = str.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s]+([0-9.]+))?\s*\)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 } : null;
  }

  // ─── Image luminance — async canvas sample, cached per URL ────
  var imgCache   = {};
  var imgPending = {};

  function sampleImg(url) {
    if (url in imgCache)  return imgCache[url];
    if (imgPending[url])  return 0.2; // still loading — assume dark
    imgPending[url] = true;
    var img = new Image();
    // No crossOrigin — same-origin images don't need it, and setting it
    // can taint the canvas if the server doesn't send CORS headers.
    img.onload = function () {
      try {
        var cw = Math.min(img.naturalWidth,  160);
        var ch = Math.min(img.naturalHeight, 120);
        var cv = document.createElement('canvas');
        cv.width = cw; cv.height = ch;
        var ctx = cv.getContext('2d');
        // Sample the full image — the card can be at any scroll position behind the nav,
        // so a full-image average is more representative than just the top slice.
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cw, ch);
        var px = ctx.getImageData(0, 0, cw, ch).data;
        var R = 0, G = 0, B = 0, n = px.length / 4;
        for (var i = 0; i < px.length; i += 4) { R += px[i]; G += px[i + 1]; B += px[i + 2]; }
        imgCache[url] = lum(R / n, G / n, B / n);
      } catch (_) {
        imgCache[url] = 0.2; // canvas tainted — default to dark (safe for photos)
      }
      delete imgPending[url];
      scheduleUpdate();
    };
    img.onerror = function () { imgCache[url] = 0.2; delete imgPending[url]; };
    img.src = url;
    return 0.2; // not ready yet — assume dark until canvas sample completes
  }

  // ─── Effective luminance of the element visually beneath a point ──
  // Walks up the DOM compositing semi-transparent bg layers.
  function elemLum(el) {
    var R = 245, G = 245, B = 245; // page default fallback
    var node = el;
    while (node && node !== document.documentElement) {
      var s   = getComputedStyle(node);
      var bgi = s.backgroundImage;
      if (bgi && bgi !== 'none') {
        var m = bgi.match(/url\(["']?([^"')]+)["']?\)/);
        if (m) {
          return sampleImg(m[1]); // returns cached value or 0.2 (dark default)
        }
      }
      var col = parseRGB(s.backgroundColor);
      if (col && col.a > 0) {
        if (col.a >= 1) return lum(col.r, col.g, col.b);
        // semi-transparent: composite over what we have so far
        R = Math.round(col.r * col.a + R * (1 - col.a));
        G = Math.round(col.g * col.a + G * (1 - col.a));
        B = Math.round(col.b * col.a + B * (1 - col.a));
        // keep walking up — there may be an opaque layer below
      }
      node = node.parentElement;
    }
    return lum(R, G, B);
  }

  // ─── Sample luminance behind the nav ─────────────────────────
  // Two-pass approach so we don't miss dark images in the opposite grid column:
  //   A) elementsFromPoint at 5 x-positions across the pill (precise, per-pixel)
  //   B) All .project-thumb elements whose bounding rect overlaps the topbar band
  // Final value = minimum (darkest wins).
  function samplePill() {
    var rect    = pill.getBoundingClientRect();
    var topbarH = topbar.offsetHeight || rect.height;
    if (!rect.width) return 0.9;
    var cy  = rect.top + rect.height / 2;
    var min = 1;

    // Pass A — sample through elementsFromPoint across pill x range
    var xs = [0.15, 0.3, 0.5, 0.7, 0.85];
    for (var i = 0; i < xs.length; i++) {
      var x   = rect.left + rect.width * xs[i];
      var els = document.elementsFromPoint(x, cy);
      for (var j = 0; j < els.length; j++) {
        var e = els[j];
        if (e === topbar || topbar.contains(e)) continue;
        var y = (e === document.body || e === document.documentElement)
          ? lum(245, 245, 245)
          : elemLum(e);
        if (y < min) min = y;
        break;
      }
    }

    // Pass B — any project thumb overlapping the topbar height band
    var thumbs = document.querySelectorAll('.project-thumb');
    for (var k = 0; k < thumbs.length; k++) {
      var r = thumbs[k].getBoundingClientRect();
      if (r.top < topbarH && r.bottom > 0) {
        var ty = elemLum(thumbs[k]);
        if (ty < min) min = ty;
      }
    }

    return min < 1 ? min : 0.9;
  }

  // ─── Map Y → tier name ────────────────────────────────────────
  function tier(Y) {
    if (Y >= 0.85) return 'pure-white';
    if (Y >= 0.45) return 'light';
    if (Y >= 0.15) return 'dark';
    return 'pitch-black';
  }

  // ─── Apply tier with hysteresis to avoid flicker at boundaries ─
  var lastTier = '';
  var rafId    = null;

  function update() {
    rafId = null;
    var t = tier(samplePill());
    if (t === lastTier) return;
    lastTier = t;
    pill.setAttribute('data-lum', t);
    topbar.setAttribute('data-lum', t);
  }

  function scheduleUpdate() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });

  // Re-check after nav panel toggles (background changes)
  document.addEventListener('click', function (e) {
    var ab = document.getElementById('about-btn');
    var wb = document.getElementById('work-btn');
    var sb = document.getElementById('sprints-btn');
    if ((ab && (e.target === ab || ab.contains(e.target))) ||
        (wb && (e.target === wb || wb.contains(e.target))) ||
        (sb && (e.target === sb || sb.contains(e.target)))) {
      setTimeout(scheduleUpdate, 50);
    }
  });

  scheduleUpdate();
}());
