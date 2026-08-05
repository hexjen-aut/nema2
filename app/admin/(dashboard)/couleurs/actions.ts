"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addColor(formData: FormData) {
  const name = String(formData.get("name") || "");
  const hex = String(formData.get("hex") || "");
  const product_id = String(formData.get("product_id") || "") || null;
  const is_seasonal = formData.get("is_seasonal") === "on";
  if (!name) return;

  const supabase = createClient();
  await supabase.from("product_colors").insert({ name, hex, product_id, is_seasonal });
  revalidatePath("/admin/couleurs");
}

export async function toggleColorAvailability(colorId: string, isAvailable: boolean) {
  const supabase = createClient();
  await supabase.from("product_colors").update({ is_available: isAvailable }).eq("id", colorId);
  revalidatePath("/admin/couleurs");
}

export async function deleteColor(colorId: string) {
  const supabase = createClient();
  await supabase.from("product_colors").delete().eq("id", colorId);
  revalidatePath("/admin/couleurs");
}
