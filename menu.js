/* Crevier side menu: a glass tab on the edge opens a see-through panel with every page as a floating glass tile.
   Nothing scrolls: every option is in view, drifting a little like it is floating in a bubble, and whichever one
   you point at (or tab to) swells and lights up. The tiles are real links, so they work without any of the effects. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function I(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; }
  var ICON = {
    home: I('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    offer: I('<path d="M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>'),
    lift: I('<path d="M12 3v7"/><path d="M9 6l3-3 3 3"/><path d="M4 21v-6l8-5 8 5v6z"/><path d="M10 21v-4h4v4"/>'),
    pour: I('<path d="M3 17h18v4H3z"/><path d="M5 17V9l7-4 7 4v8"/><path d="M9 13h6"/>'),
    dig: I('<path d="M14 3l7 7"/><path d="M17 6l-3 3"/><path d="M12 8L5 15l4 4 7-7"/><path d="M3 21h8"/>'),
    foot: I('<rect x="3" y="13" width="18" height="7" rx="1"/><path d="M7 13V6h10v7"/><path d="M12 6V3"/>'),
    proj: I('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="1.8"/><path d="M21 16l-5-4-9 7"/>'),
    about: I('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M16 5a3 3 0 0 1 0 6"/><path d="M18 14c2 .6 3 2.4 3 5"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    phone: I('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>')
  };
  var ITEMS = [
    { icon: "home", label: "Home", sub: "Back to the start", href: "/", at: "/" },
    { icon: "offer", label: "What We Offer", sub: "Everything we build and repair", href: "/services", at: "/services" },
    { icon: "lift", label: "Foundations & Lifting", sub: "Rebuilds, repairs, house lifting", href: "/foundations-house-lifting", at: "/foundations-house-lifting" },
    { icon: "pour", label: "Concrete Pours", sub: "Slabs, driveways, walkways", href: "/concrete-pours", at: "/concrete-pours" },
    { icon: "dig", label: "Excavation", sub: "Site digging and prep", href: "/excavation", at: "/excavation" },
    { icon: "foot", label: "Footings", sub: "Where every good build starts", href: "/footings", at: "/footings" },
    { icon: "proj", label: "Projects", sub: "A look at our recent work", href: "/projects", at: "/projects" },
    { icon: "about", label: "About", sub: "A family business, 17 years", href: "/about", at: "/about" },
    { icon: "mail", label: "Contact", sub: "Ask for a free estimate", href: "/contact", at: "/contact" },
    { icon: "phone", label: "Call (989) 471-1097", sub: "Leave a voicemail, we call back", href: "tel:+19894711097" }
  ];
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* ---------- markup ---------- */
  var tab = document.createElement("button");
  tab.type = "button"; tab.className = "xmb-tab"; tab.setAttribute("aria-label", "Open the menu"); tab.setAttribute("aria-expanded", "false");
  tab.innerHTML = '<span class="xmb-tab__lines" aria-hidden="true"><i></i><i></i><i></i></span><span class="xmb-tab__txt" aria-hidden="true">Menu</span>';
  var shell = document.createElement("div");
  shell.className = "xmb"; shell.hidden = true;
  shell.innerHTML =
    '<div class="xmb__dim" data-close></div>' +
    '<div class="xmb__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<canvas class="xmb__wave" aria-hidden="true"></canvas>' +
      '<div class="xmb__top"><span class="xmb__brand">CREVIER<small>Construction &amp; Masonry</small></span><span class="xmb__where" aria-hidden="true">Alpena, Michigan</span></div>' +
      '<div class="xmb__list" role="navigation" aria-label="Menu options">' +
        ITEMS.map(function (it, i) {
          return '<a class="xmb__item" href="' + it.href + '" data-i="' + i + '" style="--i:' + i + ";--t:" + (3.6 + ((i * 0.37) % 1.7)).toFixed(2) + "s;--d:-" + ((i * 0.83) % 4).toFixed(2) + 's">' +
            '<span class="xmb__bob"><span class="xmb__icon"><span class="xmb__tile">' + ICON[it.icon] + '</span></span>' +
            '<span class="xmb__text"><b>' + esc(it.label) + "</b><em>" + esc(it.sub) + "</em></span></span></a>";
        }).join("") +
      "</div>" +
      '<p class="xmb__help" aria-hidden="true"><span>Select a page</span><span>Esc to close</span></p>' +
      '<button type="button" class="xmb__close" data-close aria-label="Close the menu">&times;</button>' +
    "</div>";
  document.body.appendChild(tab);
  document.body.appendChild(shell);
  var panel = shell.querySelector(".xmb__panel");
  panel.style.cssText = "--n:" + ITEMS.length + ";--n2:" + Math.ceil(ITEMS.length / 2);
  var list = shell.querySelector(".xmb__list");
  var items = Array.prototype.slice.call(shell.querySelectorAll(".xmb__item"));
  var cv = shell.querySelector(".xmb__wave");

  /* ---------- the page you are on gets a small lit dot ---------- */
  var path = location.pathname.replace(/index\.html$/, "").replace(/\.html$/, "").replace(/(.)\/$/, "$1") || "/";
  ITEMS.forEach(function (it, i) { if (it.at === path) items[i].classList.add("is-here"); });

  /* ---------- open / close ---------- */
  var isOpen = false, lastFocus = null;
  function open() {
    if (isOpen) return;
    isOpen = true; lastFocus = document.activeElement;
    shell.hidden = false; root.classList.add("xmb-open");
    tab.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () { shell.classList.add("is-open"); panel.querySelector(".xmb__close").focus({ preventScroll: true }); });
    startWave();
  }
  function close(restore) {
    if (!isOpen) return;
    isOpen = false; shell.classList.remove("is-open");
    tab.setAttribute("aria-expanded", "false");
    root.classList.remove("xmb-open");
    setTimeout(function () { if (!isOpen) shell.hidden = true; }, 420);
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  tab.addEventListener("click", function () { isOpen ? close() : open(); });
  shell.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
  list.addEventListener("click", function (e) { if (e.target.closest(".xmb__item")) close(false); });

  window.addEventListener("keydown", function (e) {
    if (!isOpen) return;
    var f = items.concat([shell.querySelector(".xmb__close")]), i = f.indexOf(document.activeElement);
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      var n = items.length, k = i < 0 || i >= n ? (e.key === "ArrowDown" ? 0 : n - 1) : (i + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
      items[k].focus({ preventScroll: true });
    } else if (e.key === "Tab") { e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus({ preventScroll: true }); }
  });
  panel.addEventListener("wheel", function (e) { e.preventDefault(); }, { passive: false });
  panel.addEventListener("scroll", function () { panel.scrollTop = 0; panel.scrollLeft = 0; });
  window.addEventListener("resize", function () { if (isOpen) sizeWave(); });
  window.addEventListener("pageshow", function () { if (isOpen) close(false); });

  /* ---------- the wave: fine gold ribbons drifting behind the menu ---------- */
  var g = cv.getContext && cv.getContext("2d");
  var W = 0, Hh = 0, dpr = 1, raf = 0;
  function sizeWave() {
    if (!g) return;
    dpr = Math.min(2, window.devicePixelRatio || 1); W = cv.clientWidth; Hh = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr);
  }
  function wave(t) {
    raf = 0; if (!isOpen || !g) return;
    t /= 1000;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, Hh);
    g.globalCompositeOperation = "lighter";
    var bands = [[0.62, 0.55, "224,196,143", 0.0], [0.7, 0.42, "201,160,99", 2.1], [0.5, 0.35, "255,255,255", 4.2]];
    bands.forEach(function (b) {
      var cy = b[0], amp = b[1], rgb = b[2], ph = b[3];
      for (var j = 0; j < 16; j++) {
        g.beginPath();
        var off = (j - 8) * 3.2;
        for (var x = -10; x <= W + 10; x += 8) {
          var y = Hh * cy + off * (1 + 0.6 * Math.sin(x * 0.01 + t * 0.4 + ph)) +
            Math.sin(x * 0.006 + t * 0.35 + ph + j * 0.05) * Hh * 0.07 * amp * 2 +
            Math.sin(x * 0.017 - t * 0.22 + ph * 1.7) * Hh * 0.025;
          if (x < 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.strokeStyle = "rgba(" + rgb + "," + (0.05 + 0.05 * Math.pow(Math.sin(j * 0.4 + t * 0.6 + ph), 2)) + ")";
        g.lineWidth = 1; g.stroke();
      }
    });
    g.globalCompositeOperation = "source-over";
    if (!reduce) raf = requestAnimationFrame(wave);
  }
  function startWave() { sizeWave(); if (!raf) raf = requestAnimationFrame(wave); }

  window.crevierMenu = { open: open, close: close };
})();
