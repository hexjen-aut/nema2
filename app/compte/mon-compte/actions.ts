"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/compte/connexion");

  const full_name = String(formData.get("full_name") || "");
  const phone = String(formData.get("phone") || "");
  const city = String(formData.get("city") || "");
  const country = String(formData.get("country") || "");

  await supabase
    .from("profiles")
    .update({ full_name, phone, city, country })
    .eq("id", user.id);

  revalidatePath("/mon-compte");
}

export async function signOutClient() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
