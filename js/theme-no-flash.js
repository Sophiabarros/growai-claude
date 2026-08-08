(function () {
  "use strict";

  // Runs as a blocking <script> placed right after a themed root element's
  // opening tag, so the stored theme (see js/theme.js) is applied before
  // that element (and its wrapper) ever paints in the default dark state -
  // avoiding a dark-then-light flash on every page load/navigation.
  var script = document.currentScript;
  var pageId = script && script.getAttribute("data-page");
  if (!pageId) return;

  var theme;
  try {
    theme = localStorage.getItem("tracklink_theme");
  } catch (e) {
    return;
  }
  if (!theme) return;

  var page = document.getElementById(pageId);
  if (!page) return;
  page.setAttribute("data-theme", theme);
  if (page.parentElement) page.parentElement.setAttribute("data-theme", theme);
})();
