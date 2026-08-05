(function () {
  "use strict";

  // Scales the fixed 1440px desktop canvas down to fit tablet-width
  // viewports (between the mobile breakpoint and the design width),
  // keeping the desktop layout intact instead of reflowing it.
  // Below MOBILE_BREAKPOINT, responsive.css takes over with its own
  // stacked layout and this scaling is turned off.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var home = document.getElementById("home");
  var wrapper = document.querySelector(".home-wrapper");
  var naturalHeight = home.scrollHeight;

  function applyScale() {
    var width = window.innerWidth;

    if (width >= DESIGN_WIDTH || width < MOBILE_BREAKPOINT) {
      home.style.transform = "";
      wrapper.style.height = "";
      return;
    }

    var scale = width / DESIGN_WIDTH;
    home.style.transform = "scale(" + scale + ")";
    wrapper.style.height = Math.round(naturalHeight * scale) + "px";
  }

  window.addEventListener("resize", applyScale);
  applyScale();
})();
