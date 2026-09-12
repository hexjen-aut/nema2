import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Dossiers autorisés dans le bucket "nema-products" — un pour chaque
// écran admin qui envoie des images.
const ALLOWED_FOLDERS = new Set(["site-content", "categories", "products"]);

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") || "");
  const prefix = String(formData.get("prefix") || "").replace(/[^a-zA-Z0-9_-]/g, "");

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Dossier invalide." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${prefix ? prefix + "-" : ""}${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("nema-products")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("nema-products").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
