(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* Smooth scroll (Lenis) */
  var lenis = null;
  if (!reduce && w.Lenis) {
    lenis = new w.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }

  /* Scroll progress bar */
  var bar = $('.progress span'), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = d.documentElement.scrollHeight - w.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? w.pageYOffset / h : 0) + ')';
      ticking = false;
    });
  }
  w.addEventListener('scroll', onScroll, { passive: true });
  w.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  d.addEventListener('click', function (e) { if (!e.target.closest('#nav')) setMenu(false); });

  /* Anchor links */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault();
      setMenu(false);
      var off = id === '#top' ? 0 : -20;
      if (lenis) lenis.scrollTo(t, { offset: off, duration: 1.3 });
      else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* Count-up stats */
  if ('IntersectionObserver' in w && !reduce) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, t0 = null;
        (function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1300, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { el.textContent = '0'; co.observe(el); });
  }

  /* Contact form: no backend. Builds a WhatsApp / mailto message. */
  var form = $('#leadForm'), hint = $('#formHint');
  var PHONE = '919341323745', MAIL = 'rashmi17ag@gmail.com';
  var via = 'wa';
  $$('button[type=submit]', form).forEach(function (b) { b.addEventListener('click', function () { via = b.dataset.via; }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, name = f.name.value.trim();
    f.name.classList.toggle('err', !name);
    if (!name) { hint.textContent = 'Add your name so we know who to reply to.'; f.name.focus(); return; }
    var lines = ['Hi Digimpressionz! I\'m ' + name + (f.brand.value.trim() ? ' from ' + f.brand.value.trim() : '') + '.',
      'I\'m interested in: ' + f.need.value + '.'];
    if (f.msg.value.trim()) lines.push('', f.msg.value.trim());
    var text = lines.join('\n');
    if (via === 'mail') {
      w.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Enquiry from ' + name) + '&body=' + encodeURIComponent(text);
    } else {
      w.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    }
    hint.textContent = 'Your message is ready to send in the app that just opened.';
  });
  form.elements.name.addEventListener('input', function (e) { e.target.classList.remove('err'); });

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
