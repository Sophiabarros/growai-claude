(function () {
  "use strict";

  // Theme toggle, synced across the desktop and mobile canvases and with
  // the rest of the site - mirrors js/theme.js. The Game page itself has
  // no light-mode design in Figma, so toggling only flips the button icon
  // and keeps this page's theme state consistent when the user navigates
  // to another page.
  var page = document.getElementById("gamePage");
  var mPage = document.getElementById("mGamePage");
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
  // the mobile breakpoint, css/game.css's .m-game stacked layout takes
  // over and this scaling turns off.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var wrapper = document.querySelector(".game-wrapper");
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
