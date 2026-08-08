(function () {
  "use strict";

  if (!window.GrowAI || !GrowAI.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  var HEALTH_LABEL = { saudavel: "boa", atencao: "média" };
  var HEALTH_ICON = {
    saudavel: "assets/icons/app/icon-app-check.svg",
    atencao: "assets/icons/app/icon-app-warning.svg",
  };

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function setStatus(el, message, isError) {
    if (!el) return;
    if (!message) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle("app-home__status--error", !!isError);
    el.classList.toggle("m-app-home__status--error", !!isError);
  }

  // Desktop card: full stats row when healthy, health-only + warning text
  // when it needs attention (same pattern the Figma design used, now
  // driven by the actual health status instead of a fixed card slot).
  function cardBodyHtml(station, reading, photo, isDesktop) {
    var photoImg = isDesktop && photo
      ? '<img class="app-station-card__photo" alt="' + escapeHtml(station.plant) + '" src="' + escapeHtml(photo.image_url) + '" />'
      : "";
    var statClass = isDesktop ? "app-station-card__stat" : "m-app-station-card__stat";
    var nameClass = isDesktop ? "app-station-card__name" : "m-app-station-card__name";
    var statsClass = isDesktop ? "app-station-card__stats" : "m-app-station-card__stats";
    var warnClass = isDesktop ? "app-station-card__warning" : "m-app-station-card__warning";
    var btnClass = isDesktop ? "app-station-card__btn" : "m-app-station-card__btn";
    var bodyOpen = isDesktop ? '<div class="app-station-card__body">' : "";
    var bodyClose = isDesktop ? "</div>" : "";

    var healthStat = photo
      ? '<span class="' + statClass + " " + statClass + "--health-" + (photo.health_status === "atencao" ? "warn" : "ok") + '">' +
        '<img alt="" src="' + HEALTH_ICON[photo.health_status] + '" /> Saúde: ' + (HEALTH_LABEL[photo.health_status] || photo.health_status) +
        "</span>"
      : "";

    var body;
    if (photo && photo.health_status === "atencao") {
      body =
        '<p class="' + nameClass + '">' + escapeHtml(station.plant) + "</p>" +
        '<div class="' + statsClass + '">' + healthStat + "</div>" +
        '<p class="' + warnClass + '">' + escapeHtml(photo.analysis_text) + "</p>";
    } else {
      var extraStats = reading
        ? '<span class="' + statClass + '"><img alt="" src="assets/icons/app/icon-app-humidity.svg" /> ' + Math.round(reading.humidity) + "%</span>" +
          '<span class="' + statClass + '"><img alt="" src="assets/icons/app/icon-app-thermometer.svg" /> ' + Math.round(reading.temperature) + "°C</span>"
        : "";
      body =
        '<p class="' + nameClass + '">' + escapeHtml(station.plant) + "</p>" +
        '<div class="' + statsClass + '">' + healthStat + extraStats + "</div>";
    }

    return (
      photoImg +
      bodyOpen +
      body +
      '<button type="button" class="' + btnClass + '" data-action="ver-camera">Ver câmera</button>' +
      bodyClose
    );
  }

  function renderCard(el, mEl, station, reading, photo) {
    if (!station) {
      el.hidden = true;
      mEl.hidden = true;
      return;
    }
    el.hidden = false;
    mEl.hidden = false;
    el.innerHTML = cardBodyHtml(station, reading, photo, true);
    mEl.innerHTML = cardBodyHtml(station, reading, photo, false);
  }

  function renderSensors(reading) {
    var light = reading ? Math.round(reading.light_h) + "h" : "—";
    var ph = reading ? "pH " + reading.ph : "—";
    var humidity = reading ? Math.round(reading.humidity) + "%" : "—";
    var temp = reading ? Math.round(reading.temperature) + "°C" : "—";

    document.getElementById("appSensorLight").textContent = light;
    document.getElementById("appSensorPh").textContent = ph;
    document.getElementById("appSensorHumidity").textContent = humidity;
    document.getElementById("appSensorTemp").textContent = temp;

    document.getElementById("mSensorLight").textContent = light;
    document.getElementById("mSensorPh").textContent = ph;
    document.getElementById("mSensorHumidity").textContent = humidity;
    document.getElementById("mSensorTemp").textContent = temp;
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest('[data-action="ver-camera"]');
    if (target) window.location.href = "app-camera.html";
  });

  async function load() {
    var appStatus = document.getElementById("appHomeStatus");
    var mStatus = document.getElementById("mAppHomeStatus");
    setStatus(appStatus, "Carregando...", false);
    setStatus(mStatus, "Carregando...", false);

    var stations;
    try {
      stations = (await GrowAI.getStations()).slice(0, 2);
    } catch (err) {
      setStatus(appStatus, err.message, true);
      setStatus(mStatus, err.message, true);
      return;
    }

    if (stations.length === 0) {
      setStatus(appStatus, "Você ainda não tem estações. Crie uma na tela Estações.", false);
      setStatus(mStatus, "Você ainda não tem estações. Crie uma na tela Estações.", false);
      renderSensors(null);
      return;
    }
    setStatus(appStatus, "", false);
    setStatus(mStatus, "", false);

    var details = await Promise.all(
      stations.map(function (s) {
        return Promise.all([
          GrowAI.getLatestReading(s.id).catch(function () { return null; }),
          GrowAI.getLatestPhoto(s.id).catch(function () { return null; }),
        ]);
      })
    );

    renderSensors(details[0][0]);

    var card1 = document.getElementById("appStationCard1");
    var mCard1 = document.getElementById("mAppStationCard1");
    var card2 = document.getElementById("appStationCard2");
    var mCard2 = document.getElementById("mAppStationCard2");

    renderCard(card1, mCard1, stations[0], details[0][0], details[0][1]);
    renderCard(card2, mCard2, stations[1], details[1] ? details[1][0] : null, details[1] ? details[1][1] : null);
  }

  // ---- canvas scaling ----
  initResponsiveCanvas({
    desktopPageId: "appHomePage",
    desktopWrapperSelector: ".app-home-wrapper",
    mobilePageId: "mAppHomePage",
    mobileWrapperSelector: ".m-app-home-wrapper",
  });

  load();
})();
