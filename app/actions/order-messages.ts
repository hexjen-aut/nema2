"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendOrderMessageToCustomer, sendOrderMessageToAdmin } from "@/lib/email/send";

export async function sendOrderMessage(
  orderId: string,
  senderRole: "client" | "admin",
  formData: FormData
) {
  const body = String(formData.get("body") || "").trim();
  if (!body) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, user_id, customer_email, profiles ( full_name )")
    .eq("id", orderId)
    .single();
  if (!order) return;

  if (senderRole === "client") {
    if (order.user_id !== user.id) return;
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") return;
  }

  const { error } = await supabase.from("order_messages").insert({
    order_id: orderId,
    sender_role: senderRole,
    body,
  });

  if (error) {
    console.error("[sendOrderMessage] erreur insertion:", error.message);
    return;
  }

  try {
    if (senderRole === "client") {
      await sendOrderMessageToAdmin({
        orderNumber: order.order_number,
        customerName: (order as any).profiles?.full_name || null,
        body,
      });
    } else if (order.customer_email) {
      await sendOrderMessageToCustomer({
        to: order.customer_email,
        orderNumber: order.order_number,
        body,
      });
    }
  } catch (emailError) {
    console.error("[sendOrderMessage] erreur envoi email:", emailError);
  }

  revalidatePath(senderRole === "admin" ? "/admin/commandes" : "/compte/mes-commandes");
}
