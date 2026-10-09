(function () {
  var LIMIT = parseInt(document.body.getAttribute('data-limit') || '0', 10);
  var lb = document.getElementById('lb');
  var allTiles = [].slice.call(document.querySelectorAll('.tile'));
  if (!allTiles.length || !lb) return;
  function visibleTiles() { return allTiles.filter(function (t) { return !t.hidden; }); }
  var tiles = visibleTiles();

  var big = lb.querySelector('img');
  var cap = lb.querySelector('figcaption');
  var label = document.querySelector('h1').textContent;
  var cur = 0;

  function show(i) {
    cur = (i + tiles.length) % tiles.length;
    var t = tiles[cur];
    big.src = t.getAttribute('href');
    big.alt = t.querySelector('img').alt;
    var grp = t.closest('.group');
    cap.textContent = grp ? grp.querySelector('h2').textContent : label;
  }

  function open(i) {
    tiles = visibleTiles();
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  allTiles.forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      open(visibleTiles().indexOf(t));
    });
  });

  // "Show more photos" for long galleries
  if (LIMIT) {
    [].slice.call(document.querySelectorAll('.collage')).forEach(function (grid) {
      var items = [].slice.call(grid.querySelectorAll('.tile'));
      if (items.length <= LIMIT) return;
      items.slice(LIMIT).forEach(function (t) { t.hidden = true; });
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'more-btn';
      btn.textContent = 'Show more photos (' + (items.length - LIMIT) + ')';
      btn.addEventListener('click', function () {
        items.forEach(function (t) { t.hidden = false; });
        btn.remove();
      });
      grid.parentNode.insertBefore(btn, grid.nextSibling);
    });
  }

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
