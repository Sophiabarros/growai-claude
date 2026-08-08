(function () {
  "use strict";

  if (!window.GrowAI || !GrowAI.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  var HEALTH_LABEL = { saudavel: "Saudável", atencao: "Atenção" };

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function timeAgo(iso) {
    if (!iso) return "";
    var minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (minutes < 1) return "agora mesmo";
    if (minutes < 60) return minutes + " min atrás";
    return Math.round(minutes / 60) + "h atrás";
  }

  function setStatus(el, message, isError) {
    if (!el) return;
    if (!message) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle("app-camera__status--error", !!isError);
    el.classList.toggle("m-app-camera__status--error", !!isError);
  }

  function cardHtml(station, photo, checkIcon, avisoIcon, hasBullet) {
    var titleRow = hasBullet
      ? '<div class="cam-card__title-row-left"><p class="cam-card__name">' +
        escapeHtml(station.name) +
        '</p><p class="cam-card__plant">' +
        escapeHtml(station.plant) +
        "</p></div>"
      : '<p class="cam-m-card__name">' +
        escapeHtml(station.name) +
        '</p><p class="cam-m-card__plant">' +
        escapeHtml(station.plant) +
        "</p>";

    if (!photo) {
      var emptyClass = hasBullet ? "cam-card__empty" : "cam-m-card__empty";
      if (hasBullet) {
        return (
          '<div class="cam-card__body"><div class="cam-card__title-row">' +
          titleRow +
          '</div><p class="' + emptyClass + '">Nenhuma imagem registrada ainda.</p></div>'
        );
      }
      return '<div class="cam-m-card__body">' + titleRow + '<p class="' + emptyClass + '">Nenhuma imagem registrada ainda.</p></div>';
    }

    var healthClass = photo.health_status === "atencao" ? "health--warn" : "health--ok";
    var healthIcon = photo.health_status === "atencao" ? avisoIcon : checkIcon;
    var healthLabel = HEALTH_LABEL[photo.health_status] || photo.health_status;

    if (hasBullet) {
      return (
        '<img class="cam-card__photo" alt="' + escapeHtml(station.name) + '" src="' + escapeHtml(photo.image_url) + '" />' +
        '<span class="cam-card__time">' + timeAgo(photo.captured_at) + "</span>" +
        '<div class="cam-card__body">' +
        '<div class="cam-card__title-row">' + titleRow +
        '<div class="cam-card__health cam-card__' + healthClass + '"><img alt="" src="' + healthIcon + '" />' + healthLabel + "</div>" +
        "</div>" +
        '<div class="cam-card__analysis"><p class="cam-card__analysis-label">Análise visual</p><p class="cam-card__analysis-text">' +
        escapeHtml(photo.analysis_text) +
        "</p></div>" +
        '<button type="button" class="cam-card__btn">Ver histórico de imagens</button>' +
        "</div>"
      );
    }

    return (
      '<img class="cam-m-card__photo" alt="' + escapeHtml(station.name) + '" src="' + escapeHtml(photo.image_url) + '" />' +
      '<span class="cam-m-card__time">' + timeAgo(photo.captured_at) + "</span>" +
      '<div class="cam-m-card__body">' +
      titleRow +
      '<div class="cam-m-card__health cam-m-card__' + healthClass + '"><img alt="" src="' + healthIcon + '" />' + healthLabel + "</div>" +
      '<div class="cam-m-card__analysis"><p class="cam-m-card__analysis-label">Análise visual</p><p class="cam-m-card__analysis-text">' +
      escapeHtml(photo.analysis_text) +
      "</p></div>" +
      '<button type="button" class="cam-m-card__btn">Ver histórico de imagens</button>' +
      "</div>"
    );
  }

  function renderSlot(station, photo, deskEl, deskAddEl, mEl) {
    if (!station) {
      deskEl.hidden = true;
      if (deskAddEl) deskAddEl.hidden = true;
      mEl.hidden = true;
      return;
    }
    deskEl.hidden = false;
    if (deskAddEl) deskAddEl.hidden = false;
    mEl.hidden = false;
    deskEl.innerHTML = cardHtml(station, photo, "assets/icons/app/icon-app-cam-check.svg", "assets/icons/app/icon-app-cam-aviso.svg", true);
    mEl.innerHTML = cardHtml(station, photo, "assets/icons/app/icon-app-cam-check.svg", "assets/icons/app/icon-app-cam-aviso.svg", false);
  }

  // The mobile tab bar's `top` assumes exactly 2 camera cards; with fewer
  // stations (or none) that leaves a big gap, so it's repositioned right
  // after whatever actually ended up visible.
  function updateMobileTabbar() {
    positionMobileTabbar({
      mobilePageId: "mAppCameraPage",
      contentSelectors: ["#mAppCameraStatus", "#camMCard1", "#camMCard2"],
    });
    applyScale();
  }

  async function load() {
    var appStatus = document.getElementById("appCameraStatus");
    var mStatus = document.getElementById("mAppCameraStatus");
    setStatus(appStatus, "Carregando câmeras...", false);
    setStatus(mStatus, "Carregando câmeras...", false);

    var stations;
    try {
      stations = (await GrowAI.getStations()).slice(0, 2);
    } catch (err) {
      setStatus(appStatus, err.message, true);
      setStatus(mStatus, err.message, true);
      updateMobileTabbar();
      return;
    }

    if (stations.length === 0) {
      setStatus(appStatus, "Você ainda não tem estações. Crie uma na tela Estações.", false);
      setStatus(mStatus, "Você ainda não tem estações. Crie uma na tela Estações.", false);
      updateMobileTabbar();
      return;
    }
    setStatus(appStatus, "", false);
    setStatus(mStatus, "", false);

    var photos = await Promise.all(
      stations.map(function (s) {
        return GrowAI.getLatestPhoto(s.id).catch(function () {
          return null;
        });
      })
    );

    renderSlot(
      stations[0],
      photos[0],
      document.getElementById("camCard1"),
      document.getElementById("camAddCard1"),
      document.getElementById("camMCard1")
    );
    renderSlot(
      stations[1],
      photos[1],
      document.getElementById("camCard2"),
      document.getElementById("camAddCard2"),
      document.getElementById("camMCard2")
    );

    updateMobileTabbar();
  }

  function wireRefresh(btnId) {
    var btn = document.getElementById(btnId);
    btn.addEventListener("click", async function () {
      btn.disabled = true;
      await load();
      btn.disabled = false;
    });
  }
  wireRefresh("cameraRefreshBtn");
  wireRefresh("mCameraRefreshBtn");

  // ---- canvas scaling ----
  var applyScale = initResponsiveCanvas({
    desktopPageId: "appCameraPage",
    desktopWrapperSelector: ".app-camera-wrapper",
    mobilePageId: "mAppCameraPage",
    mobileWrapperSelector: ".m-app-camera-wrapper",
  });

  load();
})();
