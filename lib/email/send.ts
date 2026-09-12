import { getResendClient, EMAIL_FROM, ADMIN_EMAIL } from "@/lib/resend";

const COLORS = {
  ivoire: "#FBF6EF",
  rose: "#F1E4D6",
  orange: "#A9683A",
  noir: "#2B1810",
  champagne: "#D7C6B5",
};

function wrapper(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLORS.ivoire};font-family:Georgia,'Times New Roman',serif;color:${COLORS.noir};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.ivoire};padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;border:1px solid ${COLORS.champagne};">
            <tr>
              <td style="background:${COLORS.rose};padding:28px 32px;text-align:center;">
                <span style="font-size:24px;letter-spacing:0.08em;color:${COLORS.orange};font-weight:bold;">NEMA</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;font-weight:normal;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${COLORS.champagne};font-family:Arial,sans-serif;font-size:12px;color:#8a8079;">
                NEMA — Votre style, votre signature.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:${COLORS.noir};">${text}</p>`;
}

async function send(to: string, subject: string, html: string) {
  const resend = getResendClient();
  if (!resend || !to) {
    console.warn("[email] envoi ignoré (RESEND_API_KEY absent ou destinataire manquant)", { to, subject });
    return;
  }
  try {
    await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
  } catch (err) {
    console.error("[email] échec d'envoi:", err instanceof Error ? err.message : err);
  }
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderNumber: number;
  productName: string;
  totalAmount: number;
}) {
  const html = wrapper(
    `Commande #${params.orderNumber} confirmée`,
    paragraph(`Merci pour votre commande — <strong>${params.productName}</strong>.`) +
      paragraph(`Montant total : <strong>${params.totalAmount.toFixed(0)} DH</strong>.`) +
      paragraph(`Vous pouvez suivre son avancement à tout moment depuis votre espace « Mes commandes ».`)
  );
  await send(params.to, `Commande #${params.orderNumber} confirmée — NEMA`, html);
}

export async function sendOrderStatusUpdateEmail(params: {
  to: string;
  orderNumber: number;
  statusLabel: string;
}) {
  const html = wrapper(
    `Commande #${params.orderNumber} — ${params.statusLabel}`,
    paragraph(`Votre commande vient de passer au statut : <strong>${params.statusLabel}</strong>.`) +
      paragraph(`Suivez le détail depuis votre espace « Mes commandes ».`)
  );
  await send(params.to, `Commande #${params.orderNumber} — ${params.statusLabel}`, html);
}

export async function sendAdminNewOrderEmail(params: {
  orderNumber: number;
  customerName: string | null;
  productName: string;
  totalAmount: number;
}) {
  if (!ADMIN_EMAIL) return;
  const html = wrapper(
    `Nouvelle commande #${params.orderNumber}`,
    paragraph(`Client : <strong>${params.customerName || "—"}</strong>`) +
      paragraph(`Pièce : <strong>${params.productName}</strong>`) +
      paragraph(`Montant : <strong>${params.totalAmount.toFixed(0)} DH</strong>`) +
      paragraph(`Consultez-la depuis l'admin (Commandes).`)
  );
  await send(ADMIN_EMAIL, `Nouvelle commande #${params.orderNumber} — NEMA`, html);
}

export async function sendContactMessageEmail(params: {
  name: string;
  email: string;
  message: string;
}) {
  if (!ADMIN_EMAIL) return;
  const html = wrapper(
    `Nouveau message de contact`,
    paragraph(`De : <strong>${params.name}</strong> (${params.email})`) +
      paragraph(params.message.replace(/\n/g, "<br/>"))
  );
  await send(ADMIN_EMAIL, `Message de contact de ${params.name} — NEMA`, html);
}

export async function sendOrderMessageToCustomer(params: {
  to: string;
  orderNumber: number;
  body: string;
}) {
  const html = wrapper(
    `Nouveau message — Commande #${params.orderNumber}`,
    paragraph(params.body.replace(/\n/g, "<br/>")) +
      paragraph(`Répondez depuis votre espace « Mes commandes ».`)
  );
  await send(params.to, `Nouveau message — Commande #${params.orderNumber}`, html);
}

export async function sendOrderMessageToAdmin(params: {
  orderNumber: number;
  customerName: string | null;
  body: string;
}) {
  if (!ADMIN_EMAIL) return;
  const html = wrapper(
    `Nouveau message — Commande #${params.orderNumber}`,
    paragraph(`De : <strong>${params.customerName || "Client"}</strong>`) +
      paragraph(params.body.replace(/\n/g, "<br/>")) +
      paragraph(`Répondez depuis l'admin (Commandes).`)
  );
  await send(ADMIN_EMAIL, `Nouveau message — Commande #${params.orderNumber}`, html);
}
