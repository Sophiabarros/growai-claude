(function () {
  "use strict";

  // Theme toggle, persisted across the whole site via js/theme.js. The
  // Game page itself has no light-mode design in Figma, so this mostly
  // just keeps the toggle button icon and stored preference consistent
  // with whatever the user picked on another page.
  var page = document.getElementById("gamePage");
  initThemeToggle({
    pageIds: ["gamePage", "mGamePage"],
    toggleIds: ["themeToggle", "mThemeToggle"],
  });

  // Escala o canvas fixo de 1440px pra acompanhar a largura da janela: a
  // foto e a página crescem quando a tela é maior que 1440 e encolhem
  // quando é menor. Abaixo do breakpoint mobile, o layout .m-game do
  // css/game.css assume e a escala desliga.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var wrapper = document.querySelector(".game-wrapper");
  var naturalHeight = page.scrollHeight;

  function applyScale() {
    var width = window.innerWidth;

    if (width < MOBILE_BREAKPOINT) {
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
