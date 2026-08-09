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

async function uploadCategoryImage(
  supabase: ReturnType<typeof createClient>,
  categoryId: string,
  file: File
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `categories/${categoryId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("nema-products")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[uploadCategoryImage] erreur upload:", uploadError.message);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("nema-products").getPublicUrl(path);

  return publicUrl;
}

export async function createCategory(formData: FormData) {
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const position = Number(formData.get("position") || 0);
  if (!name) return;

  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
      description,
      position,
    })
    .select("id")
    .single();

  if (error || !category) {
    console.error("[createCategory] erreur:", error?.message);
    return;
  }

  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const url = await uploadCategoryImage(supabase, category.id, image);
    if (url) {
      await supabase.from("categories").update({ image_url: url }).eq("id", category.id);
    }
  }

  revalidatePath("/admin/categories");
  revalidatePath("/collections");
  revalidatePath("/");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const position = Number(formData.get("position") || 0);
  if (!name) return;

  await supabase
    .from("categories")
    .update({ name, description, position })
    .eq("id", categoryId);

  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const url = await uploadCategoryImage(supabase, categoryId, image);
    if (url) {
      await supabase.from("categories").update({ image_url: url }).eq("id", categoryId);
    }
  }

  revalidatePath("/admin/categories");
  revalidatePath("/collections");
  revalidatePath("/");
}

export async function deleteCategory(categoryId: string) {
  const supabase = createClient();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/admin/categories");
  revalidatePath("/collections");
  revalidatePath("/");
}
