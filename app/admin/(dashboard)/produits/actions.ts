"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const supabase = createClient();
  const name = String(formData.get("name") || "");
  const category_id = String(formData.get("category_id") || "") || null;
  const base_price = Number(formData.get("base_price") || 0);
  const fabrication_days = Number(formData.get("fabrication_days") || 10);
  const description = String(formData.get("description") || "");

  await supabase.from("products").insert({
    name,
    slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
    category_id,
    base_price,
    fabrication_days,
    description,
  });

  revalidatePath("/admin/produits");
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const supabase = createClient();
  await supabase.from("products").update({ is_active: isActive }).eq("id", productId);
  revalidatePath("/admin/produits");
}

export async function deleteProduct(productId: string) {
  const supabase = createClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/admin/produits");
}
