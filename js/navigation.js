(function () {
  "use strict";

  function wireScrollTop(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  wireScrollTop("scrollTop");
  wireScrollTop("mScrollTop");
})();
