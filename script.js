/**
 * The Compiled Narrative v1.0 — Ryan Yu
 * Copy to clipboard, sidebar toggle, entries (create, persist, render)
 */

(function () {
  "use strict";

  var STORAGE_KEY = "ryan-yu-compiled-narrative-entries";

  // ---------- Entries ----------
  var entries = [];

  function loadEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) entries = JSON.parse(raw);
      else entries = [];
    } catch (_) {
      entries = [];
    }
  }

  function saveEntries() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (_) {}
  }

  function formatDateForMeta(isoDate) {
    if (!isoDate) return "";
    return "const date = '" + isoDate + "';";
  }

  function renderEntries() {
    var container = document.getElementById("entriesList");
    if (!container) return;
    container.innerHTML = "";
    entries.forEach(function (entry) {
      var card = document.createElement("div");
      card.className = "file-card";
      card.setAttribute("role", "listitem");
      var tagsHtml = (entry.tags || []).map(function (tag) {
        var cls = tag === "Pass" ? "badge badge--success" : "badge";
        return "<span class=\"" + cls + "\">" + escapeHtml(tag) + "</span>";
      }).join("");
      card.innerHTML =
        "<h3 class=\"card-title\">" + escapeHtml(entry.title) + "</h3>" +
        "<p class=\"card-meta\">" + escapeHtml(formatDateForMeta(entry.date)) + "</p>" +
        "<p class=\"card-summary\">" + escapeHtml(entry.summary) + "</p>" +
        "<div class=\"card-tags\">" + tagsHtml + "</div>";
      container.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function openEntryModal() {
    var modal = document.getElementById("entryModal");
    var dateInput = document.getElementById("entryDate");
    if (modal) modal.classList.add("is-open");
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
    var titleEl = document.getElementById("entryTitle");
    if (titleEl) titleEl.focus();
  }

  function closeEntryModal() {
    var modal = document.getElementById("entryModal");
    if (modal) modal.classList.remove("is-open");
    var form = document.getElementById("entryForm");
    if (form) form.reset();
  }

  function handleNewEntry(e) {
    e.preventDefault();
    var titleEl = document.getElementById("entryTitle");
    var dateEl = document.getElementById("entryDate");
    var summaryEl = document.getElementById("entrySummary");
    var tagsEl = document.getElementById("entryTags");
    if (!titleEl || !dateEl || !summaryEl) return;
    var title = titleEl.value.trim();
    var date = dateEl.value;
    var summary = summaryEl.value.trim();
    var tagStr = (tagsEl && tagsEl.value) ? tagsEl.value.trim() : "";
    var tags = tagStr ? tagStr.split(",").map(function (t) { return t.trim(); }).filter(Boolean) : [];
    if (!title || !date || !summary) return;
    var entry = {
      id: Date.now().toString(36),
      title: title,
      date: date,
      summary: summary,
      tags: tags
    };
    entries.unshift(entry);
    saveEntries();
    renderEntries();
    closeEntryModal();
  }

  loadEntries();
  renderEntries();

  var newEntryBtn = document.getElementById("newEntryBtn");
  var cancelEntryBtn = document.getElementById("cancelEntryBtn");
  var entryForm = document.getElementById("entryForm");
  var entryModal = document.getElementById("entryModal");

  if (newEntryBtn) newEntryBtn.addEventListener("click", openEntryModal);
  if (cancelEntryBtn) cancelEntryBtn.addEventListener("click", closeEntryModal);
  if (entryForm) entryForm.addEventListener("submit", handleNewEntry);

  if (entryModal) {
    entryModal.addEventListener("click", function (e) {
      if (e.target === this) closeEntryModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var m = document.getElementById("entryModal");
      if (m && m.classList.contains("is-open")) closeEntryModal();
    }
  });

  // ---------- Copy to Clipboard ----------
  function getCopyText(target) {
    var el = document.getElementById(target) || document.querySelector("[data-copy-id=\"" + target + "\"]");
    if (!el) return null;
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
    if (sidebar) sidebar.classList.add("is-open");
    if (overlay) {
      overlay.classList.add("is-visible");
      overlay.setAttribute("aria-hidden", "false");
    }
    if (hamburger) hamburger.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("is-open");
    if (overlay) {
      overlay.classList.remove("is-visible");
      overlay.setAttribute("aria-hidden", "true");
    }
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      if (sidebar && sidebar.classList.contains("is-open")) closeSidebar();
      else openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

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
