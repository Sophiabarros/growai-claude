(function () {
  "use strict";

  // Scales the fixed 1440px desktop canvas down to fit viewports between
  // the mobile breakpoint and the design width - same approach as
  // js/sistema.js. This app screen switches to its own mobile artboard
  // at 900px (the Figma "Home" mobile frame is 412px wide, wider than
  // the 375px breakpoint used by the marketing site pages).
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 900;

  var page = document.getElementById("appHomePage");
  var wrapper = document.querySelector(".app-home-wrapper");
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
