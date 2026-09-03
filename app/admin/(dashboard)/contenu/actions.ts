"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteContent(key: string, formData: FormData) {
  const supabase = createClient();
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `site-content/${key}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("nema-products")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[updateSiteContent] erreur upload:", uploadError.message);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("nema-products").getPublicUrl(path);

  await supabase.from("settings").upsert({ key, value: { image_url: publicUrl } });

  revalidatePath("/admin/contenu");
  revalidatePath("/");
}

export async function removeSiteContent(key: string) {
  const supabase = createClient();
  await supabase.from("settings").delete().eq("key", key);
  revalidatePath("/admin/contenu");
  revalidatePath("/");
}
