(function () {
  "use strict";

  // Theme toggle, persisted across the whole site via js/theme.js.
  var page = document.getElementById("loginPage");
  initThemeToggle({
    pageIds: ["loginPage", "mLoginPage"],
    toggleIds: ["themeToggle", "mThemeToggle"],
    wrapperSelectors: [".login-wrapper", ".m-login-wrapper"],
  });

  // Wires both the desktop and mobile forms to the GrowAI API (js/api.js).
  function wireLoginForm(formId, errorId) {
    var form = document.getElementById(formId);
    var errorEl = document.getElementById(errorId);
    var submitBtn = form.querySelector("[type=submit]");
    var submitLabel = submitBtn.textContent;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      errorEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Entrando...";

      try {
        await GrowAI.login(form.email.value, form.senha.value);
        window.location.href = "app-home.html";
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
    });
  }

  wireLoginForm("loginForm", "loginError");
  wireLoginForm("mLoginForm", "mLoginError");

  // Scales the fixed 1440px desktop canvas down to fit tablet-width
  // viewports, same approach as js/signup.js.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var wrapper = document.querySelector(".login-wrapper");
  var naturalHeight = page.scrollHeight;

  function applyScale() {
    var width = window.innerWidth;

    if (width >= DESIGN_WIDTH || width < MOBILE_BREAKPOINT) {
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
