// ── Mark entry animation + page reveal ───────────────────────
(function () {
  var pageEls = [
    document.querySelector('.h-display'),
    document.querySelector('.body-lg'),
    document.querySelector('.footer'),
  ].filter(Boolean);

  // Skip on in-session navigation; play on first visit or refresh.
  var navEntry  = performance.getEntriesByType('navigation')[0];
  var isReload  = navEntry && navEntry.type === 'reload';
  var seenIntro = sessionStorage.getItem('intro-seen-v5');

  if (!isReload && seenIntro) return;

  sessionStorage.setItem('intro-seen-v5', '1');

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
    prefixOuter.style.cssText = 'display:block;overflow:hidden;white-space:nowrap;';
    var prefixInner = document.createElement('span');
    prefixInner.style.display    = 'inline-block';
    prefixInner.style.fontWeight = '400';
    prefixInner.textContent   = 'Hi, I’m '; // curly apostrophe + non-breaking space
    prefixOuter.appendChild(prefixInner);
    markName.insertBefore(prefixOuter, markName.firstChild);
    markName.style.fontWeight = '600'; // name starts heavier; prefix overrides to 400

    // Hide nav until mark is in position
    var navWrapper = document.querySelector('.nav-pill-wrapper');
    if (navWrapper) navWrapper.style.opacity = '0';

    // ── Starting transform: match old intro size, bottom-left corner ──
    var markRect     = markEl.getBoundingClientRect();
    var markCenterX  = markRect.left + markRect.width  / 2;
    var markCenterY  = markRect.top  + markRect.height / 2;
    var markFontSize = parseFloat(getComputedStyle(markName).fontSize);
    var introSize    = Math.min(Math.max(96, window.innerWidth * 0.15), 192);
    var hDisplaySize = Math.min(Math.max(28, window.innerWidth * 0.045), 64);
    prefixInner.style.fontSize = (hDisplaySize / introSize).toFixed(4) + 'em';
    var scaleStart   = Math.min(introSize / markFontSize,
                       (window.innerWidth - 32) / markRect.width); // 16px margin each side
    var riseOffset   = 72;
    var cornerMargin = 48;
    var scaledW      = markRect.width  * scaleStart;
    var scaledH      = markRect.height * scaleStart;
    var tx = cornerMargin + scaledW / 2 - markCenterX;
    var ty = cornerMargin + scaledH / 2 - markCenterY;

    // transform-origin: centre — element centre flies from viewport centre to mark position
    markEl.style.transformOrigin = '50% 50%';
    markEl.style.transform       = 'translateX(' + tx + 'px) translateY(' + (ty + riseOffset) + 'px) scale(' + scaleStart.toFixed(4) + ')';
    markEl.style.opacity         = '0';

    // Phase 1 – fade in at large / bottom-left position, nav appears simultaneously
    requestAnimationFrame(function () {
      markEl.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      markEl.style.opacity    = '1';
      markEl.style.transform  = 'translateX(' + tx + 'px) translateY(' + ty + 'px) scale(' + scaleStart.toFixed(4) + ')';

      if (navWrapper) {
        navWrapper.style.transition = 'opacity 0.7s ease';
        navWrapper.style.opacity    = '1';
      }

      // Phase 2 – hold, Hi,I’m slides off while large, then Max DeSouza shrinks
      setTimeout(function () {
        markEl.style.transition = ‘’;

        requestAnimationFrame(function () {
          prefixOuter.style.height = prefixOuter.offsetHeight + ‘px’;

          requestAnimationFrame(function () {
            // Step 1: Hi,I’m collapses while mark is still large
            var ease = ‘0.45s cubic-bezier(0.4, 0, 0.2, 1)’;
            prefixOuter.style.transition = ‘height ‘ + ease;
            prefixInner.style.transition = ‘transform ‘ + ease;
            prefixOuter.style.height     = ‘0’;
            prefixInner.style.transform  = ‘translateY(-100%)’;

            // Step 2: Max DeSouza shrinks to topbar
            setTimeout(function () {
              markEl.style.transition = ‘transform 0.85s cubic-bezier(0.65, 0, 0.35, 1)’;
              markEl.style.transform  = ‘translateX(0) translateY(0) scale(1)’;

              // Hero slides in as mark arrives
              setTimeout(function () {
                var hDisplay = document.querySelector(‘.h-display’);
                if (hDisplay) {
                  hDisplay.style.transform = ‘translateY(48px)’;
                  hDisplay.style.opacity   = ‘0’;
                  setTimeout(function () {
                    hDisplay.style.transition =
                      ‘opacity 0.9s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1)’;
                    hDisplay.style.opacity   = ‘1’;
                    hDisplay.style.transform = ‘translateY(0)’;
                  }, 60);
                }
              }, 550);

              // After mark lands: clean up + content
              setTimeout(function () {
                markEl.style.transition      = ‘’;
                markEl.style.transform       = ‘’;
                markEl.style.transformOrigin = ‘’;
                markEl.style.opacity         = ‘’;
                markName.style.transition    = ‘font-weight 0.35s ease’;
                markName.style.fontWeight    = ‘500’;
                setTimeout(function () {
                  markName.style.transition = ‘’;
                  markName.style.fontWeight = ‘’;
                }, 350);

                var bodyLg = document.querySelector(‘.body-lg’);
                var footer = document.querySelector(‘.footer’);
                if (bodyLg) {
                  bodyLg.style.transition = ‘opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)’;
                  bodyLg.style.opacity    = ‘1’;
                  bodyLg.style.transform  = ‘translateY(0)’;
                }
                if (footer) {
                  footer.style.opacity = ‘’;
                  footer.classList.add(‘page-reveal’);
                }
                window.dispatchEvent(new CustomEvent(‘intro-done’));
              }, 900);
            }, 500);
          });
        });
      }, 700 + 800); // fade-in (700ms) + hold (800ms)
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

  // ── Active-item: morph indicator circle → pill on hover ─────
  if (activeItem) {
    var pillEase    = '0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    var origIndLeft = null;

    activeItem.addEventListener('mouseenter', function () {
      stopNonActiveTracking();
      var pr       = pill.getBoundingClientRect();
      var ir       = activeItem.getBoundingClientRect();
      var itemLeft = ir.left - pr.left;
      origIndLeft  = itemLeft + ir.width / 2;
      var hoverW   = parseFloat(getComputedStyle(activeItem).getPropertyValue('--hover-w')) || 60;
      var newLeft  = itemLeft + hoverW / 2;
      requestAnimationFrame(function () {
        indicator.style.transition =
          'width ' + pillEase + ', left ' + pillEase +
          ', opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)' +
          ', background-color var(--dur-2) var(--ease-in-out)';
        indicator.style.width = (hoverW + 10) + 'px';
        indicator.style.left  = newLeft + 'px';
      });
    });

    activeItem.addEventListener('mouseleave', function () {
      indicator.style.transition =
        'width ' + pillEase + ', left ' + pillEase +
        ', opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)' +
        ', background-color var(--dur-2) var(--ease-in-out)';
      indicator.style.width = '44px';
      if (origIndLeft !== null) indicator.style.left = origIndLeft + 'px';
    });
  }

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
