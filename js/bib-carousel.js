(function () {
  "use strict";

  // Carrossel de 3 artigos da Bibliografia.
  //
  // Os 3 slots (esquerda pequena / centro grande / direita pequena) são FIXOS:
  // nunca se mexem nem mudam de tamanho. O que muda é só a imagem dentro de
  // cada slot, com um crossfade suave (opacity). Como nenhum card desliza por
  // cima do outro, não existe "imagem fantasma"/dupla durante a troca.
  //
  // - Desktop (.bib-carousel): setas ‹ › + bolinhas.
  // - Mobile (.m-bib-carousel): passa sozinho a cada 10s, em loop.
  //
  // Para o clique na imagem do meio abrir o artigo, preencha as URLs abaixo na
  // ordem das bolinhas (Artigo 1, 2, 3). Vazio = clique não faz nada.
  var ARTICLE_LINKS = ["", "", ""];

  var AUTOPLAY_MS = 10000;
  var FADE_MS = 600;
  var SLOTS = ["--left", "--center", "--right"];

  function initCarousel(root, config) {
    if (!root) return;
    var base = config.cardClass;
    var imgClass = config.imgClass;

    var cards = {};
    SLOTS.forEach(function (slot) {
      cards[slot] = root.querySelector("." + base + slot);
    });
    if (!cards["--left"] || !cards["--center"] || !cards["--right"]) return;

    // ordem dos artigos = a ordem em que as imagens aparecem no HTML
    // (esquerda, centro, direita). O artigo "atual" é o que está no centro.
    var images = [
      cards["--left"].querySelector("." + imgClass).getAttribute("src"),
      cards["--center"].querySelector("." + imgClass).getAttribute("src"),
      cards["--right"].querySelector("." + imgClass).getAttribute("src"),
    ];
    var n = images.length;

    var dotsWrap = config.dotsSelector
      ? root.parentNode.querySelector(config.dotsSelector)
      : null;
    var dots = dotsWrap
      ? Array.prototype.slice.call(dotsWrap.querySelectorAll("." + config.dotClass))
      : [];
    var prevBtn = root.querySelector("." + config.arrowClass + "--left");
    var nextBtn = root.querySelector("." + config.arrowClass + "--right");

    var current = 1; // começa com a imagem do meio selecionada

    // troca a imagem de um slot com crossfade (dois <img> empilhados)
    function setSlot(card, src) {
      var layers = Array.prototype.slice.call(
        card.querySelectorAll("." + imgClass)
      );
      if (layers.length < 2) return;
      var shown = card.querySelector("." + imgClass + ".is-shown") || layers[0];
      var hidden = layers[0] === shown ? layers[1] : layers[0];
      if (shown.getAttribute("src") === src) return;

      function swap() {
        hidden.classList.add("is-shown");
        shown.classList.remove("is-shown");
      }
      if (hidden.getAttribute("src") === src && hidden.complete) {
        swap();
        return;
      }
      hidden.onload = function () {
        hidden.onload = null;
        swap();
      };
      hidden.setAttribute("src", src);
      if (hidden.complete && hidden.naturalWidth > 0) {
        hidden.onload = null;
        swap();
      }
    }

    function render() {
      setSlot(cards["--left"], images[(current - 1 + n) % n]);
      setSlot(cards["--center"], images[current]);
      setSlot(cards["--right"], images[(current + 1) % n]);

      dots.forEach(function (dot, i) {
        var active = i === current;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function go(index) {
      current = ((index % n) + n) % n;
      render();
    }

    var timer = null;
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    function start() {
      if (!config.autoplay) return;
      stop();
      timer = setInterval(function () {
        if (!document.hidden) go(current + 1);
      }, AUTOPLAY_MS);
    }
    function bump() {
      if (config.autoplay) start();
    }

    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        go(current - 1);
        bump();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        go(current + 1);
        bump();
      });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        go(i);
        bump();
      });
    });

    // clique na imagem do meio abre o artigo
    cards["--center"].addEventListener("click", function () {
      var url = ARTICLE_LINKS[current];
      if (url) window.open(url, "_blank", "noopener");
    });

    if (config.autoplay) {
      root.addEventListener("pointerenter", stop);
      root.addEventListener("pointerleave", start);
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else start();
      });
    }

    render();
    start();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCarousel(document.querySelector(".bib-carousel"), {
      cardClass: "bib-carousel__card",
      imgClass: "bib-carousel__img",
      arrowClass: "bib-carousel__arrow",
      dotsSelector: ".bib-carousel__dots",
      dotClass: "bib-carousel__dot",
      autoplay: false,
    });
    initCarousel(document.querySelector(".m-bib-carousel"), {
      cardClass: "m-bib-carousel__card",
      imgClass: "m-bib-carousel__img",
      arrowClass: "m-bib-carousel__arrow",
      dotsSelector: ".m-bib-carousel__dots",
      dotClass: "m-bib-carousel__dot",
      autoplay: true,
    });
  });
})();
