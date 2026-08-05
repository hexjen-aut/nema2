"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addOption(formData: FormData) {
  const name = String(formData.get("name") || "");
  const price = Number(formData.get("price") || 0);
  const product_id = String(formData.get("product_id") || "") || null;
  if (!name) return;

  const supabase = createClient();
  await supabase.from("product_options").insert({ name, price, product_id });
  revalidatePath("/admin/options");
}

export async function toggleOptionAvailability(optionId: string, isAvailable: boolean) {
  const supabase = createClient();
  await supabase
    .from("product_options")
    .update({ is_available: isAvailable })
    .eq("id", optionId);
  revalidatePath("/admin/options");
}

export async function deleteOption(optionId: string) {
  const supabase = createClient();
  await supabase.from("product_options").delete().eq("id", optionId);
  revalidatePath("/admin/options");
}
