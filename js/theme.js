(function () {
  "use strict";

  var home = document.getElementById("home");
  var mobileHome = document.getElementById("mobileHome");
  var themeToggle = document.getElementById("themeToggle");
  var mThemeToggle = document.getElementById("mThemeToggle");

  function currentTheme() {
    return home.getAttribute("data-theme");
  }

  function setTheme(theme) {
    home.setAttribute("data-theme", theme);
    mobileHome.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    setTheme(currentTheme() === "light" ? "dark" : "light");
  }

  themeToggle.addEventListener("click", toggleTheme);
  mThemeToggle.addEventListener("click", toggleTheme);
})();
