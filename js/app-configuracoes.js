(function () {
  "use strict";

  if (!window.GrowAI || !GrowAI.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  var TOGGLE_ON = { d: "assets/icons/app/icon-cfg-toggle-on-d.svg", m: "assets/icons/app/icon-cfg-toggle-on.svg" };
  var TOGGLE_OFF = { d: "assets/icons/app/icon-cfg-toggle-off-d.svg", m: "assets/icons/app/icon-cfg-toggle-off.svg" };

  var TOGGLE_IDS = {
    health_alerts: { d: "cfgToggleHealth", m: "mCfgToggleHealth" },
    watering_updates: { d: "cfgToggleWatering", m: "mCfgToggleWatering" },
    weekly_reports: { d: "cfgToggleWeekly", m: "mCfgToggleWeekly" },
  };

  var settingsCache = null;

  function applyToggleVisual(key, value) {
    var ids = TOGGLE_IDS[key];
    if (!ids) return;
    var icon = value ? TOGGLE_ON : TOGGLE_OFF;
    var label = value ? "Ativado" : "Desativado";
    [
      [document.getElementById(ids.d), icon.d],
      [document.getElementById(ids.m), icon.m],
    ].forEach(function (pair) {
      var el = pair[0];
      if (!el) return;
      var img = el.querySelector("img");
      img.src = pair[1];
      img.alt = label;
    });
  }

  function renderProfile(user) {
    var nameEls = [document.getElementById("cfgProfileName"), document.getElementById("mCfgProfileName")];
    var emailEls = [document.getElementById("cfgProfileEmail"), document.getElementById("mCfgProfileEmail")];
    nameEls.forEach(function (el) { if (el) el.textContent = user.name; });
    emailEls.forEach(function (el) { if (el) el.textContent = user.email; });

    var avatarUrl = GrowAI.avatarUrl(user);
    if (avatarUrl) {
      [document.getElementById("cfgProfileIcon"), document.getElementById("mCfgProfileIcon")].forEach(function (el) {
        if (el) el.src = avatarUrl;
      });
      document.querySelectorAll(".app-header__avatar img").forEach(function (img) {
        img.src = avatarUrl;
      });
    }
  }

  // ---- edit profile modal ----
  var profileModal = document.getElementById("profileModal");
  var profileForm = document.getElementById("profileForm");
  var profileError = document.getElementById("profileModalError");
  var profileSubmit = document.getElementById("profileModalSubmit");
  var profileAvatarInput = document.getElementById("profileAvatarInput");
  var profileAvatarPreview = document.getElementById("profileAvatarPreview");

  function openProfileModal() {
    var user = GrowAI.getUser();
    if (!user) return;
    profileError.hidden = true;
    profileModal.classList.remove("is-closing");
    profileForm.reset();
    profileForm.name.value = user.name;
    document.getElementById("profileEmailDisplay").value = user.email;
    profileAvatarPreview.src = GrowAI.avatarUrl(user) || "assets/images/app/img-app-avatar.svg";
    profileModal.hidden = false;
  }

  function closeProfileModal() {
    profileModal.classList.add("is-closing");
    window.setTimeout(function () {
      profileModal.hidden = true;
      profileModal.classList.remove("is-closing");
    }, 180);
  }

  profileAvatarInput.addEventListener("change", function () {
    var file = profileAvatarInput.files[0];
    if (!file) return;
    profileAvatarPreview.src = URL.createObjectURL(file);
  });

  profileForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    profileError.hidden = true;
    profileSubmit.disabled = true;
    profileSubmit.textContent = "Salvando...";

    var formData = new FormData();
    formData.append("name", profileForm.name.value);
    if (profileAvatarInput.files[0]) formData.append("avatar", profileAvatarInput.files[0]);

    try {
      var updated = await GrowAI.updateProfile(formData);
      renderProfile(updated);
      closeProfileModal();
    } catch (err) {
      profileError.textContent = err.message;
      profileError.hidden = false;
    } finally {
      profileSubmit.disabled = false;
      profileSubmit.textContent = "Salvar";
    }
  });

  document.addEventListener("click", async function (event) {
    if (event.target.closest('[data-action="edit-profile"]')) {
      openProfileModal();
      return;
    }
    if (event.target.closest('[data-action="close-profile-modal"]')) {
      closeProfileModal();
      return;
    }

    var row = event.target.closest('[data-action="toggle"]');
    if (!row) return;
    var key = row.dataset.key;
    var newValue = !settingsCache[key];

    // Optimistic update, rolled back if the request fails.
    settingsCache[key] = newValue;
    applyToggleVisual(key, newValue);

    try {
      var payload = {};
      payload[key] = newValue;
      settingsCache = await GrowAI.updateNotificationSettings(payload);
      Object.keys(TOGGLE_IDS).forEach(function (k) {
        applyToggleVisual(k, settingsCache[k]);
      });
    } catch (err) {
      settingsCache[key] = !newValue;
      applyToggleVisual(key, !newValue);
      showToast(err.message, "error");
    }
  });

  async function load() {
    var user = GrowAI.getUser();
    if (user) renderProfile(user);

    try {
      settingsCache = await GrowAI.getNotificationSettings();
      Object.keys(TOGGLE_IDS).forEach(function (key) {
        applyToggleVisual(key, settingsCache[key]);
      });
    } catch (err) {
      // toggles keep their default markup state on failure
    }
  }

  // ---- canvas scaling ----
  initResponsiveCanvas({
    desktopPageId: "appConfiguracoesPage",
    desktopWrapperSelector: ".app-configuracoes-wrapper",
    mobilePageId: "mAppConfiguracoesPage",
    mobileWrapperSelector: ".m-app-configuracoes-wrapper",
  });

  load();
})();
