(function () {
  var wrapper = document.querySelector('.nav-pill-wrapper');
  if (!wrapper) return;

  var lastY = window.scrollY;
  var ticking = false;

  function update() {
    var y = window.scrollY;
    if (y > lastY && y > 60) {
      wrapper.classList.add('collapsed');
    } else if (y < lastY) {
      wrapper.classList.remove('collapsed');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}());
