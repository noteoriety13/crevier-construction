/* Motion for the Crevier Construction site. Pure enhancement: with this file missing, or with
   reduced motion turned on, the site is exactly the plain one. */
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var doc = document;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hero = doc.querySelector('.hero');

  /* ---- headline: word by word ---- */
  function splitWords(el) {
    if (!el || el.children.length) return;
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.textContent = '';
    words.forEach(function (w, i) {
      var s = doc.createElement('span');
      s.className = 'fx-word';
      s.style.setProperty('--wi', i);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(doc.createTextNode(' '));
    });
  }
  splitWords(doc.querySelector('.hero h1'));

  /* ---- scroll: header shadow, gold progress bar, parallax ---- */
  var header = doc.querySelector('header');
  var bar = doc.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  doc.body.appendChild(bar);
  var imgs = Array.prototype.slice.call(doc.querySelectorAll('.tile img, .photo.has-img img'));
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || 0;
    var vh = window.innerHeight;
    var max = doc.documentElement.scrollHeight - vh;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (hero && y < hero.offsetHeight + 200) hero.style.setProperty('--py', (y * 0.16).toFixed(1) + 'px');
    imgs.forEach(function (img) {
      var r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var k = ((r.top + r.height / 2) - vh / 2) / vh;
      img.style.setProperty('--ty', (-k * 34).toFixed(1) + 'px');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- reveal as things scroll into view ---- */
  var targets = doc.querySelectorAll(
    'section h2, .lead, .card, .photo, .tile, .group h2, .trust li, .flyer-block, .more-link, .no-photos, ' +
    '.cta h2, .cta p, .cta .btn, .contact-grid > *, .contact-split > *, .info-list li, .about > *'
  );
  var seen = new Set();
  var list = [];
  Array.prototype.forEach.call(targets, function (el) {
    if (seen.has(el) || (hero && hero.contains(el))) return;
    for (var p = el.parentElement; p; p = p.parentElement) if (seen.has(p)) return;
    seen.add(el);
    list.push(el);
  });
  var counters = new Map();
  list.forEach(function (el) {
    var parent = el.parentElement;
    var n = counters.get(parent) || 0;
    counters.set(parent, n + 1);
    el.style.setProperty('--d', ((n % 3) * 0.12).toFixed(2) + 's');
    var col = n % 3;
    el.style.setProperty('--dx', (el.matches('.card, .photo, .tile') ? (col === 0 ? -60 : col === 2 ? 60 : 0) : 0) + 'px');
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
        var k = Math.min(1, (t - t0) / 1300);
        num.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    };
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { o.disconnect(); setTimeout(run, 300); }
      }, { threshold: 0.6 });
      o.observe(li);
    } else num.textContent = String(end);
  });

  if (!fine) return;

  /* ---- mouse only: cursor light, 3D tilt, magnetic buttons ---- */
  if (hero) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }
  Array.prototype.forEach.call(doc.querySelectorAll('.grid .card, .about-cols .card, .photo.has-img, .tile'), function (el) {
    el.setAttribute('data-tilt', '');
  });
  var tilted = null;
  doc.addEventListener('mousemove', function (e) {
    var t = e.target.closest ? e.target.closest('[data-tilt]') : null;
    if (tilted && tilted !== t) {
      tilted.classList.remove('is-tilting');
      tilted.style.setProperty('--rx', '0deg');
      tilted.style.setProperty('--ry', '0deg');
    }
    tilted = t;
    if (t) {
      var r = t.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      t.classList.add('is-tilting');
      t.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg');
      t.style.setProperty('--rx', (-py * 8).toFixed(2) + 'deg');
    }
    var b = e.target.closest ? e.target.closest('.btn, .call-btn') : null;
    if (b) {
      var br = b.getBoundingClientRect();
      b.style.setProperty('--bx', ((e.clientX - br.left - br.width / 2) * 0.22).toFixed(1) + 'px');
      b.style.setProperty('--by', ((e.clientY - br.top - br.height / 2) * 0.3).toFixed(1) + 'px');
    }
  });
  doc.addEventListener('mouseout', function (e) {
    var b = e.target.closest ? e.target.closest('.btn, .call-btn') : null;
    if (b && !b.contains(e.relatedTarget)) { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); }
    var t = e.target.closest ? e.target.closest('[data-tilt]') : null;
    if (t && !t.contains(e.relatedTarget)) {
      t.classList.remove('is-tilting'); t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg');
    }
  });
})();
