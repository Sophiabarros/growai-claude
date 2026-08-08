(function () {
  "use strict";

  var TOAST_DURATION_MS = 4000;
  var TOAST_TRANSITION_MS = 200;

  function ensureHost() {
    var host = document.getElementById("toastHost");
    if (!host) {
      host = document.createElement("div");
      host.id = "toastHost";
      host.className = "toast-host";
      document.body.appendChild(host);
    }
    return host;
  }

  function showToast(message, type) {
    var host = ensureHost();
    var toast = document.createElement("div");
    toast.className = "toast" + (type === "error" ? " toast--error" : "");
    toast.textContent = message;
    host.appendChild(toast);

    // Force layout so the entrance transition actually plays.
    void toast.offsetWidth;
    toast.classList.add("toast--visible");

    var dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      toast.classList.remove("toast--visible");
      window.setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, TOAST_TRANSITION_MS);
    }

    toast.addEventListener("click", dismiss);
    window.setTimeout(dismiss, TOAST_DURATION_MS);
  }

  var CONFIRM_TRANSITION_MS = 180;

  // Replaces window.confirm() with an in-page dialog. Resolves true/false.
  function showConfirm(message, options) {
    options = options || {};
    return new Promise(function (resolve) {
      var modal = document.createElement("div");
      modal.className = "confirm-modal";
      modal.innerHTML =
        '<div class="confirm-modal__backdrop"></div>' +
        '<div class="confirm-modal__panel">' +
        '<p class="confirm-modal__message"></p>' +
        '<div class="confirm-modal__actions">' +
        '<button type="button" class="confirm-modal__cancel"></button>' +
        '<button type="button" class="confirm-modal__confirm"></button>' +
        "</div></div>";

      modal.querySelector(".confirm-modal__message").textContent = message;
      modal.querySelector(".confirm-modal__cancel").textContent = options.cancelLabel || "Cancelar";
      modal.querySelector(".confirm-modal__confirm").textContent = options.confirmLabel || "Confirmar";
      document.body.appendChild(modal);

      var settled = false;
      function settle(result) {
        if (settled) return;
        settled = true;
        modal.classList.add("is-closing");
        window.setTimeout(function () {
          if (modal.parentNode) modal.parentNode.removeChild(modal);
        }, CONFIRM_TRANSITION_MS);
        resolve(result);
      }

      modal.querySelector(".confirm-modal__backdrop").addEventListener("click", function () {
        settle(false);
      });
      modal.querySelector(".confirm-modal__cancel").addEventListener("click", function () {
        settle(false);
      });
      modal.querySelector(".confirm-modal__confirm").addEventListener("click", function () {
        settle(true);
      });
    });
  }

  window.showToast = showToast;
  window.showConfirm = showConfirm;
})();
