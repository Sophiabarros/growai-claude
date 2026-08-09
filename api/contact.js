// Vercel Serverless Function (Node runtime) — independente do backend/
// Express (que não está deployado aqui). Usada por js/sobre.js no
// formulário "Contate-nos" da página sobre.html.
const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { nome, email, mensagem } = req.body || {};

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Preencha nome, email e mensagem." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY não configurada nas variáveis de ambiente da Vercel");
    return res.status(500).json({ error: "Serviço de e-mail não configurado." });
  }

  const to = process.env.CONTACT_TO_EMAIL || "tracklink.system@gmail.com";

  let resendRes;
  try {
    resendRes = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TrackLink <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Novo contato pelo site - ${nome}`,
        html:
          `<p><strong>Nome:</strong> ${escapeHtml(nome)}</p>` +
          `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
          `<p><strong>Mensagem:</strong></p><p>${escapeHtml(mensagem).replace(/\n/g, "<br>")}</p>`,
      }),
    });
  } catch (err) {
    console.error("Erro de rede ao chamar a API do Resend:", err);
    return res.status(502).json({ error: "Falha ao enviar e-mail. Tente novamente." });
  }

  const data = await resendRes.json().catch(() => null);

  if (!resendRes.ok) {
    console.error("Resend recusou o envio:", data);
    return res.status(502).json({ error: "Falha ao enviar e-mail. Tente novamente." });
  }

  res.status(200).json({ ok: true, id: data && data.id });
};
