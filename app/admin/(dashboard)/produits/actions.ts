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

async function uploadProductImage(
  supabase: ReturnType<typeof createClient>,
  productId: string,
  file: File,
  position: number
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${productId}/${Date.now()}-${position}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("nema-products")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[uploadProductImage] erreur upload:", uploadError.message);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("nema-products").getPublicUrl(path);

  await supabase.from("product_images").insert({
    product_id: productId,
    url: publicUrl,
    position,
  });
}

export async function createProduct(formData: FormData) {
  const supabase = createClient();
  const name = String(formData.get("name") || "");
  const category_id = String(formData.get("category_id") || "") || null;
  const base_price = Number(formData.get("base_price") || 0);
  const fabrication_days = Number(formData.get("fabrication_days") || 10);
  const description = String(formData.get("description") || "");

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
      category_id,
      base_price,
      fabrication_days,
      description,
    })
    .select("id")
    .single();

  if (error || !product) {
    console.error("[createProduct] erreur création produit:", error?.message);
    return;
  }

  const images = formData.getAll("images") as File[];
  const validImages = images.filter((f) => f && f.size > 0);

  for (let i = 0; i < validImages.length; i++) {
    await uploadProductImage(supabase, product.id, validImages[i], i);
  }

  // Tailles saisies dans le formulaire de création (optionnel, jusqu'à 4 lignes).
  const sizeNames = formData.getAll("size_name") as string[];
  const sizeDeltas = formData.getAll("size_delta") as string[];

  const sizesToInsert = sizeNames
    .map((rawName, i) => ({
      product_id: product.id,
      name: rawName.trim(),
      price_delta: Number(sizeDeltas[i] || 0),
      position: i,
    }))
    .filter((s) => s.name.length > 0);

  if (sizesToInsert.length > 0) {
    const { error: sizesError } = await supabase.from("product_sizes").insert(sizesToInsert);
    if (sizesError) {
      console.error("[createProduct] erreur tailles:", sizesError.message);
    }
  }

  revalidatePath("/admin/produits");
  revalidatePath("/admin/prix");
}

export async function addProductImage(productId: string, formData: FormData) {
  const supabase = createClient();
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return;

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  await uploadProductImage(supabase, productId, file, count || 0);
  revalidatePath("/admin/produits");
}

export async function deleteProductImage(imageId: string, url: string) {
  const supabase = createClient();

  const marker = "/nema-products/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const path = url.slice(idx + marker.length);
    await supabase.storage.from("nema-products").remove([path]);
  }

  await supabase.from("product_images").delete().eq("id", imageId);
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
