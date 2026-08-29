import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Modèle rapide et peu coûteux, bien adapté à un aperçu produit.
const REPLICATE_MODEL_VERSION =
  "black-forest-labs/flux-schnell";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type PreviewRequest = {
  productName: string;
  sizeName?: string | null;
  primaryColorName?: string | null;
  secondaryColorName?: string | null;
  optionNames?: string[];
};

function buildPrompt(input: PreviewRequest): string {
  const colors = [input.primaryColorName, input.secondaryColorName]
    .filter(Boolean)
    .join(" et ");
  const options = input.optionNames?.length
    ? `, avec ${input.optionNames.join(", ")}`
    : "";

  return (
    `Photographie produit professionnelle d'un ${input.productName} en crochet fait main, ` +
    `fil coton, couleur ${colors || "naturelle"}${options}, ` +
    `posé sur fond neutre beige clair, lumière studio douce, style artisanal, haute résolution, sans texte`
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: PreviewRequest = await req.json();

    if (!body.productName) {
      return new Response(
        JSON.stringify({ error: "productName manquant" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(body);

    // 1. Lance la génération sur Replicate (mode synchrone via "Prefer: wait")
    const replicateRes = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          input: {
            prompt,
            aspect_ratio: "1:1",
            output_format: "jpg",
            num_outputs: 1,
          },
        }),
      }
    );

    if (!replicateRes.ok) {
      const errText = await replicateRes.text();
      console.error("Erreur Replicate:", errText);
      return new Response(
        JSON.stringify({ error: "Échec de la génération Replicate" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prediction = await replicateRes.json();
    const outputUrl: string | undefined = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;

    if (!outputUrl) {
      return new Response(
        JSON.stringify({ error: "Aucune image retournée par Replicate" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Télécharge l'image générée (URL Replicate temporaire)
    const imageRes = await fetch(outputUrl);
    const imageBlob = await imageRes.arrayBuffer();

    // 3. Upload dans Supabase Storage pour un hébergement permanent
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const fileName = `${crypto.randomUUID()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("nema-previews")
      .upload(fileName, imageBlob, { contentType: "image/jpeg" });

    if (uploadError) {
      console.error("Erreur upload Storage:", uploadError.message);
      return new Response(
        JSON.stringify({ error: "Échec de l'enregistrement de l'aperçu" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("nema-previews").getPublicUrl(fileName);

    return new Response(JSON.stringify({ imageUrl: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return new Response(
      JSON.stringify({ error: "Erreur inattendue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
