import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Configurator from "./Configurator";

export default async function PersonnaliserPage({
  params,
}: {
  params: { product: string };
}) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `id, name, description, base_price, fabrication_days, is_active,
       categories ( name ),
       product_images ( url, position ),
       product_sizes ( id, name, price_delta, position ),
       product_options ( id, name, price, image_url, is_available ),
       product_materials (
         is_default,
         materials (
           id, name, slug, price_delta, texture_image_url, is_available,
           material_colors ( id, name, hex, swatch_image_url, stock_status )
         )
       )`
    )
    .eq("id", params.product)
    .single();

  if (!product || !product.is_active) notFound();

  return <Configurator product={product as any} />;
}
