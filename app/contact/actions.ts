"use server";

import { redirect } from "next/navigation";
import { sendContactMessageEmail } from "@/lib/email/send";

export async function sendContactForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    redirect("/contact?error=1");
  }

  try {
    await sendContactMessageEmail({ name, email, message });
  } catch (err) {
    console.error("[sendContactForm] erreur envoi email:", err);
    redirect("/contact?error=1");
  }

  redirect("/contact?sent=1");
}
