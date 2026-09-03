"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const CONTENT_KEYS = [
  { key: "hero", label: "Hero", section: "Accueil" },
  { key: "creez_produit_vierge", label: "Créez — Produit vierge", section: "Section Créez" },
  { key: "creez_personnalisation", label: "Créez — Personnalisation", section: "Section Créez" },
  { key: "creez_creation_finale", label: "Créez — Création finale", section: "Section Créez" },
  { key: "histoire", label: "Histoire NEMA", section: "Histoire" },
  { key: "situation_look_1", label: "Look 01 — Minimal", section: "NEMA en situation" },
  { key: "situation_look_2", label: "Look 02 — Bold", section: "NEMA en situation" },
  { key: "situation_look_3", label: "Look 03 — Casual", section: "NEMA en situation" },
  { key: "situation_look_4", label: "Look 04 — Signature", section: "NEMA en situation" },
  { key: "apercu_avant", label: "Aperçu IA — Avant", section: "Aperçu IA" },
  { key: "apercu_apres", label: "Aperçu IA — Après", section: "Aperçu IA" },
] as const;

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
