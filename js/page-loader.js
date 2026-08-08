(function () {
  "use strict";

  var MIN_VISIBLE_MS = 300;
  var shownAt = Date.now();
  var loader = document.getElementById("pageLoader");
  if (!loader) return;

  function hideLoader() {
    var elapsed = Date.now() - shownAt;
    var wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    window.setTimeout(function () {
      loader.classList.add("page-loader--hidden");
    }, wait);
  }

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }

  // Show it again right as the user navigates away, so the next page's own
  // loader picks up where this one left off instead of a blank gap.
  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    var link = event.target.closest("a[href]");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    if (link.target && link.target !== "_self") return;
    // Any URL scheme (http:, https:, mailto:, tel:, ...) means it leaves
    // the site or opens something else - only same-site relative links
    // (sistema.html, login.html, ...) get the transition treatment.
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return;

    loader.classList.remove("page-loader--hidden");
  });
})();
