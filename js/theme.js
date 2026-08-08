(function () {
  "use strict";

  var STORAGE_KEY = "tracklink_theme";

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // storage unavailable (private mode, disabled, etc.) - theme just
      // won't persist across page loads for this visitor
    }
  }

  // Wires a page's theme toggle button(s) to its dark/light canvases
  // (desktop + mobile) and makes the choice persist across navigation via
  // localStorage - the whole marketing site shares one stored preference,
  // applied on load and only changed by clicking a toggle button.
  function initThemeToggle(config) {
    var pages = (config.pageIds || [])
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);
    var toggles = (config.toggleIds || [])
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);
    // The outer wrapper (which centers the fixed-width canvas and shows
    // through around its edges when zoomed out past the design width) has
    // its own `background: var(--dm-bg)` that only resolves correctly if
    // it also carries `data-theme` - otherwise it stays stuck on the dark
    // default and shows through as a dark strip in light mode.
    var wrappers = (config.wrapperSelectors || [])
      .map(function (selector) {
        return document.querySelector(selector);
      })
      .filter(Boolean);

    if (pages.length === 0) return;

    function applyTheme(theme) {
      pages.concat(wrappers).forEach(function (el) {
        el.setAttribute("data-theme", theme);
      });
    }

    function currentTheme() {
      return pages[0].getAttribute("data-theme") || "dark";
    }

    applyTheme(readStoredTheme() || currentTheme());

    function toggleTheme() {
      var next = currentTheme() === "light" ? "dark" : "light";
      applyTheme(next);
      writeStoredTheme(next);
    }

    toggles.forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });
  }

  window.initThemeToggle = initThemeToggle;

  // Auto-wire the home page (index.html only includes this one script).
  if (document.getElementById("home")) {
    initThemeToggle({
      pageIds: ["home", "mobileHome"],
      toggleIds: ["themeToggle", "mThemeToggle"],
      wrapperSelectors: [".home-wrapper", ".home-wrapper--mobile"],
    });
  }
})();
