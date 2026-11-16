(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Duplica el carril de celulares para que el loop sea continuo.
  var rail = document.querySelector('.rail');
  if (rail && !reduce) {
    Array.prototype.slice.call(rail.children).forEach(function (el) {
      var c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      var img = c.querySelector('img');
      if (img) img.alt = '';
      rail.appendChild(c);
    });
  }

  // Aparición al hacer scroll.
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Parallax suave del celular de cada proyecto.
  var stages = document.querySelectorAll('.stage');
  function parallax() {
    var vh = window.innerHeight || 800;
    stages.forEach(function (s) {
      var r = s.getBoundingClientRect();
      var p = 1 - Math.min(Math.max((r.top + r.height / 2) / vh, 0), 1.2);
      s.style.setProperty('--p', Math.min(Math.max(p, 0), 1).toFixed(3));
    });
  }
  if (stages.length && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(function () { parallax(); ticking = false; }); ticking = true; }
    }, { passive: true });
    parallax();
  }

  // Contador de la portada.
  var n = document.querySelector('[data-count]');
  if (n && !reduce) {
    var target = parseInt(n.getAttribute('data-count'), 10), cur = 0;
    var t = setInterval(function () {
      cur++; n.textContent = cur;
      if (cur >= target) clearInterval(t);
    }, 220);
  }

  // Compartir (celular) o copiar el link.
  var share = document.getElementById('share');
  if (share) {
    share.addEventListener('click', function () {
      var data = { title: 'Nexbit · Trabajos realizados', text: 'Mirá lo que construye Nexbit', url: location.href.split('#')[0] };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url).then(function () {
          var old = share.textContent; share.textContent = '¡Link copiado!';
          setTimeout(function () { share.textContent = old; }, 2200);
        });
      }
    });
  }
})();
