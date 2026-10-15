/* Motion polish for the Crevier Construction site. Pure enhancement: with this file missing, or with
   reduced motion turned on, the site is exactly the plain one. */
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var doc = document;

  /* ---- scroll: header shadow, gold progress bar, hero parallax ---- */
  var header = doc.querySelector('header');
  var hero = doc.querySelector('.hero');
  var bar = doc.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  doc.body.appendChild(bar);
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || 0;
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (hero && y < hero.offsetHeight + 200) hero.style.setProperty('--py', (y * 0.12).toFixed(1) + 'px');
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- reveal things as they scroll into view ---- */
  var targets = doc.querySelectorAll(
    'section h2, .lead, .card, .photo, .tile, .group h2, .trust li, .flyer-block, .more-link, .no-photos, ' +
    '.cta h2, .cta p, .cta .btn, .contact-grid > *, .contact-split > *, .info-list li, .about > *'
  );
  var seen = new Set();
  var list = [];
  Array.prototype.forEach.call(targets, function (el) {
    if (seen.has(el) || (hero && hero.contains(el))) return;
    // do not reveal a thing inside another thing that is already being revealed
    for (var p = el.parentElement; p; p = p.parentElement) if (seen.has(p)) return;
    seen.add(el);
    list.push(el);
  });
  var counters = {};
  list.forEach(function (el) {
    var parent = el.parentElement;
    var n = counters[parent ? parent.className + parent.tagName : ''] || 0;
    counters[parent ? parent.className + parent.tagName : ''] = n + 1;
    el.style.setProperty('--d', ((n % 4) * 0.09).toFixed(2) + 's');
    el.classList.add('rv');
  });
  if (!('IntersectionObserver' in window)) {
    list.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    list.forEach(function (el) { io.observe(el); });
  }

  /* ---- "17 years" counts up once ---- */
  Array.prototype.forEach.call(doc.querySelectorAll('.trust li'), function (li) {
    var m = /^(\d+)(\s+years.*)$/.exec(li.textContent.trim());
    if (!m) return;
    var end = parseInt(m[1], 10);
    li.textContent = '';
    var num = doc.createElement('span');
    num.textContent = '0';
    li.appendChild(num);
    li.appendChild(doc.createTextNode(m[2]));
    li.setAttribute('aria-label', m[1] + m[2]);
    var run = function () {
      var t0 = performance.now();
      (function tick(t) {
        var k = Math.min(1, (t - t0) / 1100);
        num.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    };
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { o.disconnect(); setTimeout(run, 250); }
      }, { threshold: 0.6 });
      o.observe(li);
    } else num.textContent = String(end);
  });
})();
