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
       product_colors ( id, name, hex, is_available ),
       product_options ( id, name, price, image_url, is_available )`
    )
    .eq("id", params.product)
    .single();

  if (!product || !product.is_active) notFound();

  return <Configurator product={product as any} />;
}
