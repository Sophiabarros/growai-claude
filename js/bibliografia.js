(function () {
  "use strict";

  // Theme toggle, persisted across the whole site via js/theme.js.
  var page = document.getElementById("bibliografiaPage");
  initThemeToggle({
    pageIds: ["bibliografiaPage", "mBibliografiaPage"],
    toggleIds: ["themeToggle", "mThemeToggle"],
    wrapperSelectors: [".bibliografia-wrapper", ".m-bibliografia-wrapper"],
  });

  // Scales the fixed 1440px desktop canvas down to fit tablet-width
  // viewports, same approach as js/components.js on the home page. Below
  // the mobile breakpoint, css/bibliografia.css's .m-bibliografia stacked
  // layout takes over and this scaling turns off.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var wrapper = document.querySelector(".bibliografia-wrapper");
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
