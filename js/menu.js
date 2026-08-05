(function () {
  "use strict";

  function wireMenu(toggleId, navId) {
    var toggle = document.getElementById(toggleId);
    var nav = document.getElementById(navId);
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  wireMenu("menuToggle", "headerNav");
  wireMenu("mMenuToggle", "mHeaderNav");
})();
