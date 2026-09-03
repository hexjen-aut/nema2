"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SubmitOrderInput = {
  productId: string;
  materialId: string | null;
  materialColorId: string | null;
  sizeId: string | null;
  optionIds: string[];
  totalPrice: number;
  quantity: number;
  comments: string;
  address: {
    label: string;
    address: string;
    city: string;
    country: string;
  };
  generatedImageUrl: string | null;
};

export async function submitOrder(input: SubmitOrderInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/compte/connexion");

  if (!input.materialId || !input.materialColorId) {
    return { error: "Veuillez choisir un fil et une couleur avant de valider." };
  }

  // 1. Enregistre la personnalisation
  // status: 'validated' correspond à la contrainte réelle sur nema.customizations
  // ('draft' | 'previewed' | 'validated').
  const { data: customization, error: customError } = await supabase
    .from("customizations")
    .insert({
      user_id: user.id,
      product_id: input.productId,
      material_id: input.materialId,
      material_color_id: input.materialColorId,
      size_id: input.sizeId,
      selected_option_ids: input.optionIds,
      total_price: input.totalPrice,
      status: input.generatedImageUrl ? "previewed" : "validated",
    })
    .select("id")
    .single();

  if (customError || !customization) {
    console.error("[submitOrder] erreur customization:", customError?.message);
    return { error: "Impossible d'enregistrer la personnalisation." };
  }

  // 2. Aperçu IA (obligatoire côté UI, donc généralement toujours présent ici)
  if (input.generatedImageUrl) {
    const { error: imageError } = await supabase.from("generated_images").insert({
      customization_id: customization.id,
      image_url: input.generatedImageUrl,
      is_validated: true,
    });

    if (imageError) {
      console.error("[submitOrder] erreur generated_images:", imageError.message);
      return { error: "Impossible d'enregistrer l'aperçu généré." };
    }

    await supabase
      .from("customizations")
      .update({ status: "validated" })
      .eq("id", customization.id);
  }

  // 3. Adresse de livraison
  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      label: input.address.label || "Domicile",
      address: input.address.address,
      city: input.address.city,
      country: input.address.country,
      is_default: true,
    })
    .select("id")
    .single();

  if (addressError || !address) {
    console.error("[submitOrder] erreur address:", addressError?.message);
    return { error: "Impossible d'enregistrer l'adresse de livraison." };
  }

  // 4. Commande
  const totalAmount = input.totalPrice * input.quantity;
  const depositAmount = Math.round(totalAmount * 0.4);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      address_id: address.id,
      total_amount: totalAmount,
      deposit_amount: depositAmount,
      deposit_paid: false,
      balance_paid: false,
      status: "nouvelle",
      comments: input.comments,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[submitOrder] erreur order:", orderError?.message);
    return { error: "Impossible de créer la commande." };
  }

  // 5. Article de commande
  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    customization_id: customization.id,
    product_id: input.productId,
    quantity: input.quantity,
    unit_price: input.totalPrice,
  });

  if (itemError) {
    console.error("[submitOrder] erreur order_items:", itemError.message);
    return { error: "Impossible d'ajouter l'article à la commande." };
  }

  redirect("/compte/mes-commandes");
}
