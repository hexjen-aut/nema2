"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addSize(productId: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  const price_delta = Number(formData.get("price_delta") || 0);
  if (!name) return;

  const supabase = createClient();
  await supabase.from("product_sizes").insert({ product_id: productId, name, price_delta });
  revalidatePath("/admin/prix");
}

export async function updateSizeDelta(sizeId: string, formData: FormData) {
  const price_delta = Number(formData.get("price_delta") || 0);
  const supabase = createClient();
  await supabase.from("product_sizes").update({ price_delta }).eq("id", sizeId);
  revalidatePath("/admin/prix");
}

export async function deleteSize(sizeId: string) {
  const supabase = createClient();
  await supabase.from("product_sizes").delete().eq("id", sizeId);
  revalidatePath("/admin/prix");
}
