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

  // Show intro on first visit or refresh; skip on in-session page navigation.
  var navEntry = performance.getEntriesByType('navigation')[0];
  var isReload = navEntry && navEntry.type === 'reload';
  var seenIntro = sessionStorage.getItem('intro-seen');

  if (!isReload && seenIntro) {
    intro.remove();
    return;
  }

  sessionStorage.setItem('intro-seen', '1');

  pageEls.forEach(function (el) { el.style.opacity = '0'; });

  function revealPage() {
    var easeOut   = 'cubic-bezier(0.16, 1, 0.3, 1)';
    var easeInOut = 'cubic-bezier(0.65, 0, 0.35, 1)';
    var hDisplay  = document.querySelector('.h-display');
    var bodyLg    = document.querySelector('.body-lg');
    var markName  = document.querySelector('.mark-name');

    // Greet on reveal, then slide "Hi, I'm " off to the left.
    // nav IIFE already split mark-name into "Max" + dsOuter span;
    // insert prefix before that existing content.
    if (markName) {
      var prefixOuter = document.createElement('span');
      prefixOuter.style.cssText = 'display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;';
      var prefixInner = document.createElement('span');
      prefixInner.style.display = 'inline-block';
      prefixInner.textContent   = 'Hi, I’m '; //   = non-breaking space, survives overflow:hidden
      prefixOuter.appendChild(prefixInner);
      markName.insertBefore(prefixOuter, markName.firstChild);

      requestAnimationFrame(function () {
        prefixOuter.style.width = prefixOuter.offsetWidth + 'px';
        setTimeout(function () {
          var ease = '0.45s cubic-bezier(0.4, 0, 0.2, 1)';
          prefixOuter.style.transition = 'width ' + ease;
          prefixInner.style.transition = 'transform ' + ease;
          prefixOuter.style.width      = '0';
          prefixInner.style.transform  = 'translateX(-100%)';
        }, 2500);
      });
    }

    // Topbar and footer: standard staggered reveal
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

  // Text exits, then page loads in
  setTimeout(function () {
    introText.style.opacity   = '1';
    introText.style.transform = 'translateY(0)';
    introText.style.animation = 'none';
    void introText.offsetHeight;
    introText.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    introText.style.opacity    = '0';
    introText.style.transform  = 'translateY(-32px)';

    setTimeout(function () {
      intro.remove();
      revealPage();
    }, 520);
  }, 1800);
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
    dsInner.textContent   = ' DeSouza'; // non-breaking space keeps gap
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
  // Measure each label's width and inject span; CSS handles the animation.
  var measurer = document.createElement('span');
  measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:11px;font-weight:500;letter-spacing:0.05em;font-family:inherit;';
  document.body.appendChild(measurer);
  navItems.forEach(function (item) {
    var text = item.getAttribute('aria-label') || '';
    measurer.textContent = text;
    var w = measurer.offsetWidth + 24; // 12px padding each side
    item.style.setProperty('--hover-w', Math.max(34, w) + 'px');
    var lbl = document.createElement('span');
    lbl.className = 'nav-item-label';
    lbl.textContent = text;
    item.appendChild(lbl);
  });
  document.body.removeChild(measurer);


  // ── Active-item: morph indicator circle → pill on hover ─────
  if (activeItem) {
    var pillEaseIn  = '0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    var pillEaseOut = '0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    var origIndLeft = null;

    activeItem.addEventListener('mouseenter', function () {
      var pr      = pill.getBoundingClientRect();
      var ir      = activeItem.getBoundingClientRect();
      var itemLeft = ir.left - pr.left;          // left edge of item in pill
      origIndLeft  = itemLeft + ir.width / 2;    // natural centre (unexpanded)
      var hoverW   = parseFloat(getComputedStyle(activeItem).getPropertyValue('--hover-w')) || 60;
      var newLeft  = itemLeft + hoverW / 2;      // centre of expanded item

      indicator.style.transition  =
        'width ' + pillEaseIn + ', left ' + pillEaseIn +
        ', border-radius ' + pillEaseIn +
        ', opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)' +
        ', background-color var(--dur-2) var(--ease-in-out)';
      indicator.style.width        = hoverW + 'px';
      indicator.style.left         = newLeft + 'px';
      indicator.style.borderRadius = '22px';
    });

    activeItem.addEventListener('mouseleave', function () {
      indicator.style.transition  =
        'width ' + pillEaseOut + ', left ' + pillEaseOut +
        ', border-radius ' + pillEaseOut +
        ', opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)' +
        ', background-color var(--dur-2) var(--ease-in-out)';
      indicator.style.width        = '44px';
      indicator.style.borderRadius = '50%';
      if (origIndLeft !== null) indicator.style.left = origIndLeft + 'px';
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
}());
