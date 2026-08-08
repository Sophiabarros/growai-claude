(function () {
  "use strict";

  // Theme toggle (dark by default), synced across the desktop and mobile
  // canvases - mirrors js/sistema.js.
  var page = document.getElementById("signupPage");
  var mPage = document.getElementById("mSignupPage");
  var themeToggle = document.getElementById("themeToggle");
  var mThemeToggle = document.getElementById("mThemeToggle");

  function currentTheme() {
    return page.getAttribute("data-theme");
  }

  function setTheme(theme) {
    page.setAttribute("data-theme", theme);
    mPage.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    setTheme(currentTheme() === "light" ? "dark" : "light");
  }

  themeToggle.addEventListener("click", toggleTheme);
  mThemeToggle.addEventListener("click", toggleTheme);

  // No backend yet - this is a front-end only prototype like the rest of
  // the site, so just stop the browser from navigating away.
  function stubSubmit(event) {
    event.preventDefault();
  }
  document.getElementById("signupForm").addEventListener("submit", stubSubmit);
  document.getElementById("mSignupForm").addEventListener("submit", stubSubmit);

  // Scales the fixed 1440px desktop canvas down to fit tablet-width
  // viewports, same approach as js/sistema.js.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var wrapper = document.querySelector(".signup-wrapper");
  var naturalHeight = page.scrollHeight;

  function applyScale() {
    var width = window.innerWidth;

    if (width >= DESIGN_WIDTH || width < MOBILE_BREAKPOINT) {
      page.style.transform = "";
      wrapper.style.height = "";
      return;
    }

    var scale = width / DESIGN_WIDTH;
    page.style.transform = "scale(" + scale + ")";
    wrapper.style.height = Math.round(naturalHeight * scale) + "px";
  }

  window.addEventListener("resize", applyScale);
  applyScale();
})();
