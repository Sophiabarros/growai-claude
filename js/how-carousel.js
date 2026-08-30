(function () {
  "use strict";

  var ACTIVE_CLASS = "ativa";

  function initCarousel(root, imageSelector, prevSelector, nextSelector) {
    if (!root) return;

    var images = Array.prototype.slice.call(root.querySelectorAll(imageSelector));
    if (images.length === 0) return;

    var prevBtn = root.querySelector(prevSelector);
    var nextBtn = root.querySelector(nextSelector);

    var current = images.findIndex(function (img) {
      return img.classList.contains(ACTIVE_CLASS);
    });
    if (current === -1) current = 0;
    images[current].classList.add(ACTIVE_CLASS);

    function show(index) {
      images[current].classList.remove(ACTIVE_CLASS);
      current = (index + images.length) % images.length;
      images[current].classList.add(ACTIVE_CLASS);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        show(current - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        show(current + 1);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Carrossel desktop da section "Como funciona"
    initCarousel(
      document.querySelector(".how__carousel"),
      ".imagem",
      ".how__carousel-btn--prev",
      ".how__carousel-btn--next"
    );

    // Carrossel mobile da section "Como funciona"
    initCarousel(
      document.querySelector(".m-how__carousel"),
      ".imagem",
      ".m-how__carousel-btn--prev",
      ".m-how__carousel-btn--next"
    );
  });
})();