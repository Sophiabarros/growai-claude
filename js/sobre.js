(function () {
  "use strict";

  // Theme toggle, persisted across the whole site via js/theme.js.
  var page = document.getElementById("sobrePage");
  initThemeToggle({
    pageIds: ["sobrePage", "mSobrePage"],
    toggleIds: ["themeToggle", "mThemeToggle"],
    wrapperSelectors: [".sobre-wrapper", ".m-sobre-wrapper"],
  });

  // Em localhost/rede local (dev), usa o backend/ Express na porta 3000
  // (mesmo host da página, não "localhost" fixo, pra funcionar também
  // quando testado de outro dispositivo na rede, ex.: celular abrindo
  // http://<ip-do-pc>:5500/sobre.html). No site publicado (Vercel), usa a
  // serverless function em /api/contact.js, que roda no mesmo domínio e
  // não depende do backend/ (que não está deployado lá).
  function isLocalHost(hostname) {
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)
    );
  }
  var CONTACT_ENDPOINT = isLocalHost(window.location.hostname)
    ? "http://" + window.location.hostname + ":3000/api/contact"
    : "/api/contact";

  // Wires the "Contate-nos" form (desktop and mobile) to POST /api/contact,
  // which sends the message through Resend (backend/controllers/contactController.js
  // locally, or api/contact.js on the deployed Vercel site).
  function wireContactForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    var submitBtn = form.querySelector("[type=submit]");
    var submitLabel = submitBtn.textContent;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      try {
        var res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: form.nome.value,
            email: form.email.value,
            mensagem: form.mensagem.value,
          }),
        });

        var body = await res.json().catch(function () {
          return null;
        });

        if (!res.ok) {
          throw new Error((body && body.error) || "Não foi possível enviar sua mensagem.");
        }

        showToast("Mensagem enviada! Retornaremos em breve.");
        form.reset();
      } catch (err) {
        showToast(err.message || "Não foi possível enviar sua mensagem.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
    });
  }

  wireContactForm("sobreContactForm");
  wireContactForm("mSobreContactForm");

  // Scales the fixed 1440px desktop canvas down to fit tablet-width
  // viewports, same approach as js/bibliografia.js. Below the mobile
  // breakpoint, css/sobre.css's .m-sobre stacked layout takes over and
  // this scaling turns off.
  var DESIGN_WIDTH = 1440;
  var MOBILE_BREAKPOINT = 768;

  var wrapper = document.querySelector(".sobre-wrapper");
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
