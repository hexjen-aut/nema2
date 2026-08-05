"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { STATUSES } from "./statuses";

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = String(formData.get("status") || "");
  if (!STATUSES.includes(status as any)) return;

  const supabase = createClient();
  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/commandes");
}
