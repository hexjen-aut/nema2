"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SubmitOrderInput = {
  productId: string;
  sizeId: string | null;
  primaryColorId: string | null;
  secondaryColorId: string | null;
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

  // 1. Enregistre la personnalisation
  const { data: customization, error: customError } = await supabase
    .from("customizations")
    .insert({
      user_id: user.id,
      product_id: input.productId,
      size_id: input.sizeId,
      primary_color_id: input.primaryColorId,
      secondary_color_id: input.secondaryColorId,
      selected_option_ids: input.optionIds,
      total_price: input.totalPrice,
      status: "validee",
    })
    .select("id")
    .single();

  if (customError || !customization) {
    return { error: "Impossible d'enregistrer la personnalisation." };
  }

  // 2. Aperçu IA (si généré à l'étape précédente)
  if (input.generatedImageUrl) {
    await supabase.from("generated_images").insert({
      customization_id: customization.id,
      image_url: input.generatedImageUrl,
      is_validated: true,
    });
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
    return { error: "Impossible d'ajouter l'article à la commande." };
  }

  redirect("/compte/mes-commandes");
}
