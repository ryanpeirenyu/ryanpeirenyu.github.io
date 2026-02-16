/**
 * The Compiled Narrative v1.0 — Interaction scripts
 * Copy to clipboard, sidebar toggle, hover transitions (handled in CSS)
 */

(function () {
  "use strict";

  // ---------- Copy to Clipboard ----------
  function getCopyText(target) {
    var el = document.getElementById(target) || document.querySelector("[data-copy-id=\"" + target + "\"]");
    if (!el) return null;
    // Prefer data-email for contact (copy only the address); otherwise copy code/text content
    return (el.getAttribute("data-email") || el.textContent || "").trim();
  }

  document.body.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy-target]");
    if (!btn) return;
    var targetId = btn.getAttribute("data-copy-target");
    var text = getCopyText(targetId);
    if (text === null) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var label = btn.getAttribute("aria-label") || "Copy";
        btn.textContent = "Copied!";
        btn.setAttribute("aria-label", "Copied");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.setAttribute("aria-label", label);
        }, 2000);
      });
    } else {
      // Fallback for older browsers
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  });

  // ---------- Sidebar toggle (mobile) ----------
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("sidebarOverlay");
  var hamburger = document.getElementById("hamburger");

  function openSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.add("is-open");
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    if (hamburger) hamburger.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      if (sidebar.classList.contains("is-open")) closeSidebar();
      else openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Optional: close sidebar when a nav link is clicked (mobile)
  var navLinks = document.querySelectorAll(".sidebar .nav-item");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // ---------- Active nav state from scroll/hash ----------
  function setActiveNav() {
    var hash = window.location.hash || "#readme";
    navLinks.forEach(function (item) {
      var href = item.getAttribute("href") || "";
      item.classList.toggle("active", href === hash);
    });
  }

  window.addEventListener("hashchange", setActiveNav);
  window.addEventListener("load", setActiveNav);
})();
