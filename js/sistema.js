(function () {
  "use strict";

  // Theme toggle (dark by default), synced across the desktop and mobile
  // canvases - mirrors js/theme.js for the standalone Sistema page.
  var page = document.getElementById("sistemaPage");
  var mPage = document.getElementById("mSistemaPage");
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

  // Scales the fixed 1440px desktop canvas down to fit tablet-width
  // viewports, same approach as js/components.js on the home page. Below
  // the mobile breakpoint, css/responsive.css-style rules in sistema.css
  // take over with the .m-sistema stacked layout and this scaling turns off.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var wrapper = document.querySelector(".sistema-wrapper");
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
