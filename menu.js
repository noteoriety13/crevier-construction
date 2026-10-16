/* Crevier menu: a tab on the edge opens a clean white panel listing every page. The rows are real links,
   so everything works even if this script never runs. */
(function () {
  "use strict";
  var root = document.documentElement;

  var ITEMS = [
    { label: "Home", sub: "Back to the start", href: "/", at: "/" },
    { label: "What we offer", sub: "Everything we build and repair", href: "/services", at: "/services" },
    { label: "Foundations and lifting", sub: "Rebuilds, repairs and house lifting", href: "/foundations-house-lifting", at: "/foundations-house-lifting", child: true },
    { label: "Concrete pours", sub: "Slabs, driveways, patios and walkways", href: "/concrete-pours", at: "/concrete-pours", child: true },
    { label: "Excavation", sub: "Digging and site prep", href: "/excavation", at: "/excavation", child: true },
    { label: "Footings", sub: "Where every good build starts", href: "/footings", at: "/footings", child: true },
    { label: "Projects", sub: "Photos of our recent work", href: "/projects", at: "/projects" },
    { label: "About", sub: "A family business in Alpena", href: "/about", at: "/about" },
    { label: "Contact", sub: "Ask for a free estimate", href: "/contact", at: "/contact" }
  ];
  var DEFAULT_READ = "Alpena, Michigan";
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

  var RING = '<svg class="xmb-tab__ring" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.2"/><circle cx="10" cy="10" r="4.2"/><circle class="dot" cx="10" cy="10" r="1.4"/></svg>';
  var MARK = '<svg class="xmb__mark" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/><circle cx="20" cy="20" r="10.5"/><g class="spin"><path class="arc" d="M20 3a17 17 0 0 1 14.7 8.5" fill="none" stroke-linecap="round"/></g><circle class="dot" cx="20" cy="20" r="2.4"/></svg>';
  var PHONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>';

  var tab = document.createElement("button");
  tab.type = "button"; tab.className = "xmb-tab"; tab.setAttribute("aria-label", "Open the menu"); tab.setAttribute("aria-expanded", "false");
  tab.innerHTML = RING + '<span class="xmb-tab__txt" aria-hidden="true">Menu</span>';

  var shell = document.createElement("div");
  shell.className = "xmb"; shell.hidden = true;
  shell.innerHTML =
    '<div class="xmb__dim" data-close></div>' +
    '<div class="xmb__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="xmb__head">' + MARK + '<span class="xmb__brand">CREVIER<small>Construction and Masonry</small></span></div>' +
      '<button type="button" class="xmb__close" data-close aria-label="Close the menu">&times;</button>' +
      '<div class="xmb__list" role="navigation" aria-label="Pages">' +
        ITEMS.map(function (it, i) {
          return '<a class="xmb__row' + (it.child ? " sub" : "") + '" href="' + it.href + '" style="--i:' + i + '" data-read="' + esc(it.sub) + '"><span class="xmb__ring"></span><span>' + esc(it.label) + "</span></a>";
        }).join("") +
      "</div>" +
      '<div class="xmb__foot"><p class="xmb__read" aria-live="polite">' + DEFAULT_READ + '</p>' +
      '<a class="xmb__call" href="tel:+19894711097">' + PHONE + "Call (989) 471-1097</a></div>" +
    "</div>";
  document.body.appendChild(tab);
  document.body.appendChild(shell);

  var panel = shell.querySelector(".xmb__panel");
  var rows = Array.prototype.slice.call(shell.querySelectorAll(".xmb__row"));
  var call = shell.querySelector(".xmb__call");
  var closeBtn = shell.querySelector(".xmb__close");
  var read = shell.querySelector(".xmb__read");

  var path = location.pathname.replace(/index\.html$/, "").replace(/\.html$/, "").replace(/(.)\/$/, "$1") || "/";
  ITEMS.forEach(function (it, i) { if (it.at === path) { rows[i].classList.add("is-here"); rows[i].setAttribute("aria-current", "page"); } });

  function say(t) { read.textContent = t || DEFAULT_READ; }
  rows.forEach(function (r) {
    r.addEventListener("mouseenter", function () { say(r.getAttribute("data-read")); });
    r.addEventListener("focus", function () { say(r.getAttribute("data-read")); });
    r.addEventListener("mouseleave", function () { say(); });
    r.addEventListener("blur", function () { say(); });
  });

  var isOpen = false, lastFocus = null;
  function open() {
    if (isOpen) return;
    isOpen = true; lastFocus = document.activeElement;
    shell.hidden = false; root.classList.add("xmb-open"); tab.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () { requestAnimationFrame(function () { shell.classList.add("is-open"); closeBtn.focus({ preventScroll: true }); }); });
  }
  function close(restore) {
    if (!isOpen) return;
    isOpen = false; shell.classList.remove("is-open"); tab.setAttribute("aria-expanded", "false"); root.classList.remove("xmb-open");
    setTimeout(function () { if (!isOpen) shell.hidden = true; }, 480);
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  tab.addEventListener("click", function () { isOpen ? close() : open(); });
  shell.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); else if (e.target.closest(".xmb__row")) close(false); });

  window.addEventListener("keydown", function (e) {
    if (!isOpen) return;
    var f = [closeBtn].concat(rows, [call]), i = f.indexOf(document.activeElement);
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      var n = f.length, d = e.key === "ArrowDown" ? 1 : -1;
      f[i < 0 ? (d > 0 ? 1 : n - 1) : (i + d + n) % n].focus({ preventScroll: true });
    } else if (e.key === "Tab") { e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus({ preventScroll: true }); }
  });
  window.addEventListener("pageshow", function () { if (isOpen) close(false); });
  window.crevierMenu = { open: open, close: close };
})();
