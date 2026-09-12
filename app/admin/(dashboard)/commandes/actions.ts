"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { STATUSES } from "./statuses";
import { sendOrderStatusUpdateEmail } from "@/lib/email/send";

const STATUS_LABELS: Record<string, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  fabrication: "Fabrication",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = String(formData.get("status") || "");
  if (!STATUSES.includes(status as any)) return;

  const supabase = createClient();
  const { data: order } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("order_number, customer_email")
    .single();
  revalidatePath("/admin/commandes");

  if (order?.customer_email) {
    try {
      await sendOrderStatusUpdateEmail({
        to: order.customer_email,
        orderNumber: order.order_number,
        statusLabel: STATUS_LABELS[status] || status,
      });
    } catch (err) {
      console.error("[updateOrderStatus] erreur envoi email:", err);
    }
  }
}
