"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteContent(key: string, formData: FormData) {
  const supabase = createClient();
  const imageUrl = String(formData.get("image_url") || "").trim();
  if (!imageUrl) return;

  await supabase.from("settings").upsert({ key, value: { image_url: imageUrl } });

  revalidatePath("/admin/contenu");
  revalidatePath("/");
}

export async function removeSiteContent(key: string) {
  const supabase = createClient();
  await supabase.from("settings").delete().eq("key", key);
  revalidatePath("/admin/contenu");
  revalidatePath("/");
}
