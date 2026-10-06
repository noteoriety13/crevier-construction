(function () {
  var tiles = [].slice.call(document.querySelectorAll('.tile'));
  var lb = document.getElementById('lb');
  if (!tiles.length || !lb) return;

  var big = lb.querySelector('img');
  var cap = lb.querySelector('figcaption');
  var label = document.querySelector('h1').textContent;
  var cur = 0;

  function show(i) {
    cur = (i + tiles.length) % tiles.length;
    var t = tiles[cur];
    big.src = t.getAttribute('href');
    big.alt = t.querySelector('img').alt;
    cap.textContent = label;
  }

  function open(i) {
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  tiles.forEach(function (t, i) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      open(i);
    });
  });

  lb.querySelector('.x').addEventListener('click', close);
  lb.querySelector('.prev').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.next').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
})();
