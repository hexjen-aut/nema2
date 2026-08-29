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

// ---------- Fils (materials) ----------

export async function addMaterial(formData: FormData) {
  const name = String(formData.get("name") || "");
  const price_delta = Number(formData.get("price_delta") || 0);
  const description = String(formData.get("description") || "");
  const texture_image_url = String(formData.get("texture_image_url") || "") || null;
  if (!name) return;

  const supabase = createClient();
  await supabase.from("materials").insert({
    name,
    slug: slugify(name),
    price_delta,
    description,
    texture_image_url,
  });
  revalidatePath("/admin/fils");
}

export async function toggleMaterialAvailability(materialId: string, isAvailable: boolean) {
  const supabase = createClient();
  await supabase.from("materials").update({ is_available: isAvailable }).eq("id", materialId);
  revalidatePath("/admin/fils");
}

export async function deleteMaterial(materialId: string) {
  const supabase = createClient();
  await supabase.from("materials").delete().eq("id", materialId);
  revalidatePath("/admin/fils");
}

// ---------- Couleurs de fil (material_colors) ----------

export async function addMaterialColor(materialId: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  const hex = String(formData.get("hex") || "");
  const swatch_image_url = String(formData.get("swatch_image_url") || "") || null;
  const stock_status = String(formData.get("stock_status") || "available");
  if (!name) return;

  const supabase = createClient();
  await supabase.from("material_colors").insert({
    material_id: materialId,
    name,
    hex,
    swatch_image_url,
    stock_status,
  });
  revalidatePath("/admin/fils");
}

export async function updateMaterialColorStock(colorId: string, formData: FormData) {
  const stock_status = String(formData.get("stock_status") || "available");
  const supabase = createClient();
  await supabase.from("material_colors").update({ stock_status }).eq("id", colorId);
  revalidatePath("/admin/fils");
}

export async function deleteMaterialColor(colorId: string) {
  const supabase = createClient();
  await supabase.from("material_colors").delete().eq("id", colorId);
  revalidatePath("/admin/fils");
}

// ---------- Liaison produit <-> fil (product_materials) ----------

export async function linkProductMaterial(formData: FormData) {
  const product_id = String(formData.get("product_id") || "");
  const material_id = String(formData.get("material_id") || "");
  const is_default = formData.get("is_default") === "on";
  if (!product_id || !material_id) return;

  const supabase = createClient();

  if (is_default) {
    // Un seul fil par défaut par produit.
    await supabase
      .from("product_materials")
      .update({ is_default: false })
      .eq("product_id", product_id);
  }

  await supabase
    .from("product_materials")
    .upsert(
      { product_id, material_id, is_default },
      { onConflict: "product_id,material_id" }
    );
  revalidatePath("/admin/fils");
}

export async function unlinkProductMaterial(productId: string, materialId: string) {
  const supabase = createClient();
  await supabase
    .from("product_materials")
    .delete()
    .eq("product_id", productId)
    .eq("material_id", materialId);
  revalidatePath("/admin/fils");
}
