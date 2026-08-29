// Supabase Edge Function : supabase/functions/generate-preview/index.ts
//
// Reçoit : productId, materialId, materialColorId
// Fait : récupère la photo de référence du produit + la couleur du fil choisi,
//        appelle Replicate (Flux Kontext), enregistre le résultat, le retourne.
//
// Déploiement : supabase functions deploy generate-preview
// Secret requis : supabase secrets set REPLICATE_API_TOKEN=le_nouveau_token

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildPrompt(materialName: string, colorName: string) {
  return (
    `Change only the crochet yarn color and material to ${colorName}, ${materialName}, ` +
    `keeping the exact same shape, size, proportions, stitch pattern, handles, hardware, ` +
    `and camera angle — do not alter the background or add any new elements; ` +
    `photorealistic studio product photo.`
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, materialId, materialColorId } = await req.json();

    if (!productId || !materialId || !materialColorId) {
      return new Response(
        JSON.stringify({ error: "productId, materialId et materialColorId sont requis." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      db: { schema: "nema" },
    });

    // 1. Récupère la photo de référence du produit
    const { data: images } = await supabase
      .from("product_images")
      .select("url")
      .eq("product_id", productId)
      .order("position", { ascending: true })
      .limit(1);

    const referenceImageUrl = images?.[0]?.url;
    if (!referenceImageUrl) {
      return new Response(
        JSON.stringify({ error: "Aucune photo de référence trouvée pour ce produit." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Récupère le fil + la couleur choisis
    const [{ data: material }, { data: color }] = await Promise.all([
      supabase.from("materials").select("name").eq("id", materialId).single(),
      supabase.from("material_colors").select("name").eq("id", materialColorId).single(),
    ]);

    if (!material || !color) {
      return new Response(
        JSON.stringify({ error: "Fil ou couleur introuvable." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(material.name, color.name);

    // 3. Enregistre la requête (statut pending)
    const { data: previewRequest } = await supabase
      .from("ai_preview_requests")
      .insert({
        product_id: productId,
        material_id: materialId,
        material_color_id: materialColorId,
        reference_image_url: referenceImageUrl,
        prompt_used: prompt,
        status: "pending",
      })
      .select("id")
      .single();

    // 4. Appelle Replicate (Flux Kontext Pro)
    const replicateRes = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait", // attend le résultat directement (modèle rapide)
        },
        body: JSON.stringify({
          input: {
            prompt,
            input_image: referenceImageUrl,
            output_format: "webp",
            safety_tolerance: 2,
          },
        }),
      }
    );

    const prediction = await replicateRes.json();

    if (!replicateRes.ok || prediction.error) {
      const errorMessage = prediction.error || "Erreur Replicate inconnue.";
      if (previewRequest) {
        await supabase
          .from("ai_preview_requests")
          .update({ status: "failed", error_message: errorMessage })
          .eq("id", previewRequest.id);
      }
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // La sortie peut être une chaîne unique ou un tableau selon le modèle.
    const outputUrl = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;

    if (!outputUrl) {
      if (previewRequest) {
        await supabase
          .from("ai_preview_requests")
          .update({ status: "failed", error_message: "Pas d'image en sortie." })
          .eq("id", previewRequest.id);
      }
      return new Response(JSON.stringify({ error: "Pas d'image générée." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Marque la requête comme réussie
    if (previewRequest) {
      await supabase
        .from("ai_preview_requests")
        .update({ status: "succeeded", result_image_url: outputUrl })
        .eq("id", previewRequest.id);
    }

    return new Response(JSON.stringify({ imageUrl: outputUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Erreur inattendue.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
