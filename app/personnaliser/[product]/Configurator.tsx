"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { submitOrder } from "./actions";
import { createClient as createClientBrowser } from "@/lib/supabase/client";

type MaterialColor = {
  id: string;
  name: string;
  hex: string | null;
  swatch_image_url: string | null;
  stock_status: "available" | "low_stock" | "unavailable";
};
type Material = {
  id: string;
  name: string;
  slug: string;
  price_delta: number;
  texture_image_url: string | null;
  is_available: boolean;
  material_colors: MaterialColor[];
};
type ProductMaterial = { is_default: boolean; materials: Material };
type ProductSize = { id: string; name: string; price_delta: number; position: number };
type ProductOption = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
};
type Product = {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  fabrication_days: number;
  categories: { name: string } | null;
  product_images: { url: string; position: number }[];
  product_sizes: ProductSize[];
  product_options: ProductOption[];
  product_materials: ProductMaterial[];
};

// Étape "Taille" retirée du flux principal si le produit n'en propose pas.
const STEP_LABELS = [
  "Modèle",
  "Fil",
  "Couleur",
  "Taille",
  "Options",
  "Résumé",
  "Aperçu IA",
  "Validation",
];

export default function Configurator({ product }: { product: Product }) {
  const [step, setStep] = useState(0);

  // Ne garde que les fils réellement proposés pour ce produit et disponibles.
  const availableMaterials = useMemo(
    () =>
      product.product_materials
        .map((pm) => pm.materials)
        .filter((m) => m && m.is_available),
    [product.product_materials]
  );

  const defaultMaterial =
    product.product_materials.find((pm) => pm.is_default)?.materials ??
    availableMaterials[0] ??
    null;

  const [materialId, setMaterialId] = useState<string | null>(
    defaultMaterial?.id ?? null
  );
  const selectedMaterial = availableMaterials.find((m) => m.id === materialId) ?? null;

  // La liste des couleurs dépend TOUJOURS du fil sélectionné.
  const availableColors = useMemo(
    () =>
      (selectedMaterial?.material_colors ?? []).filter(
        (c) => c.stock_status !== "unavailable"
      ),
    [selectedMaterial]
  );

  const [materialColorId, setMaterialColorId] = useState<string | null>(null);

  const [sizeId, setSizeId] = useState<string | null>(
    product.product_sizes[0]?.id ?? null
  );
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState("");

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [addressLabel, setAddressLabel] = useState("Domicile");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableOptions = product.product_options.filter((o) => o.is_available);
  const selectedSize = product.product_sizes.find((s) => s.id === sizeId);
  const selectedOptions = availableOptions.filter((o) => optionIds.includes(o.id));
  const selectedColor = availableColors.find((c) => c.id === materialColorId);

  const hasSizes = product.product_sizes.length > 0;

  const unitPrice = useMemo(() => {
    const materialDelta = Number(selectedMaterial?.price_delta || 0);
    const sizeDelta = Number(selectedSize?.price_delta || 0);
    const optionsTotal = selectedOptions.reduce((sum, o) => sum + Number(o.price), 0);
    return Number(product.base_price) + materialDelta + sizeDelta + optionsTotal;
  }, [product.base_price, selectedMaterial, selectedSize, selectedOptions]);

  const totalPrice = unitPrice * quantity;

  function toggleOption(id: string) {
    setOptionIds((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  }

  function handleSelectMaterial(id: string) {
    setMaterialId(id);
    // On réinitialise la couleur : la palette change avec le fil.
    setMaterialColorId(null);
  }

  function canGoNext(): boolean {
    if (step === 1) return Boolean(materialId);
    if (step === 2) return Boolean(materialColorId);
    if (step === 3 && hasSizes) return Boolean(sizeId);
    return true;
  }

  async function handleGeneratePreview() {
    setGenerating(true);
    setGenerationError(null);

    try {
      const supabase = createClientBrowser();
      const { data, error } = await supabase.functions.invoke("generate-preview", {
        body: {
          productName: product.name,
          sizeName: selectedSize?.name ?? null,
          primaryColorName: selectedColor?.name ?? null,
          optionNames: selectedOptions.map((o) => o.name),
        },
      });

      if (error || !data?.imageUrl) {
        setGenerationError("Échec de la génération. Réessayez.");
        setGenerating(false);
        return;
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (err) {
      console.error("[APERCU IA] erreur:", err);
      setGenerationError("Erreur inattendue lors de la génération.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitOrder({
      productId: product.id,
      materialId,
      materialColorId,
      sizeId,
      optionIds,
      totalPrice: unitPrice,
      quantity,
      comments,
      address: {
        label: addressLabel,
        address: addressLine,
        city,
        country,
      },
      generatedImageUrl,
    });

    if (result?.error) {
      setSubmitError(result.error);
      setSubmitting(false);
    }
  }

  const lastStepIndex = STEP_LABELS.length - 1;

  return (
    <div className="mx-auto max-w-wrap px-6 py-10">
      <Link href="/" className="text-sm text-ink/50 hover:text-clay transition-colors">
        ← Retour à la boutique
      </Link>

      <h1 className="mt-3 font-display text-3xl">{product.name}</h1>
      <p className="mt-1 text-sm text-ink/60">
        {product.categories?.name} · Livraison en {product.fabrication_days} jours
      </p>

      <div className="mt-8 flex items-center gap-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full origin-bottom rounded-full transition-colors duration-500 ${
                i <= step ? "bg-clay" : "bg-ink/10"
              } ${i === step ? "step-dot-active" : ""}`}
            />
            <span
              className={`hidden text-[10px] sm:block ${
                i === step ? "text-clay" : "text-ink/40"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <div key={step} className="step-enter rounded-2xl border border-ink/10 bg-card p-6">
          {step === 0 && (
            <div>
              <p className="font-display text-xl">Modèle</p>
              <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl bg-linen">
                {product.product_images[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.product_images[0].url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink/40">
                    Pas de photo disponible
                  </div>
                )}
              </div>
              {product.description && (
                <p className="mt-4 text-sm text-ink/70">{product.description}</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="font-display text-xl">Choisissez le fil</p>
              <p className="mt-1 text-sm text-ink/60">
                Le fil détermine le rendu, le toucher et le prix final.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {availableMaterials.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMaterial(m.id)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                      materialId === m.id
                        ? "border-clay bg-clay/10"
                        : "border-ink/10 hover:border-clay/50"
                    }`}
                  >
                    {m.texture_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.texture_image_url}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-display">{m.name}</p>
                      <p className="text-sm text-ink/60">
                        {m.price_delta > 0
                          ? `+${Number(m.price_delta).toFixed(0)} DH`
                          : "Inclus dans le prix de base"}
                      </p>
                    </div>
                  </button>
                ))}
                {availableMaterials.length === 0 && (
                  <p className="text-sm text-ink/50">
                    Aucun fil configuré pour ce modèle pour le moment.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="font-display text-xl">Couleur</p>
              <p className="mt-1 text-sm text-ink/60">
                Couleurs disponibles pour le fil « {selectedMaterial?.name} »
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                {availableColors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setMaterialColorId(c.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all ${
                        materialColorId === c.id
                          ? "border-clay scale-110"
                          : "border-ink/10"
                      }`}
                      style={{ backgroundColor: c.hex || "#eee" }}
                    >
                      {c.swatch_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.swatch_image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <span className="text-xs text-ink/60">{c.name}</span>
                    {c.stock_status === "low_stock" && (
                      <span className="text-[10px] text-gold">Stock limité</span>
                    )}
                  </button>
                ))}
                {availableColors.length === 0 && (
                  <p className="text-sm text-ink/50">
                    Aucune couleur disponible pour ce fil actuellement.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="font-display text-xl">Choisissez une taille</p>
              {hasSizes ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.product_sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeId(s.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        sizeId === s.id
                          ? "border-clay bg-clay/10"
                          : "border-ink/10 hover:border-clay/50"
                      }`}
                    >
                      <p className="font-display text-lg">{s.name}</p>
                      <p className="text-sm text-ink/60">
                        {s.price_delta > 0
                          ? `+${Number(s.price_delta).toFixed(0)} DH`
                          : "Inclus dans le prix de base"}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-ink/50">
                  Ce modèle est proposé en taille unique.
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="font-display text-xl">Options</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {availableOptions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleOption(o.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      optionIds.includes(o.id)
                        ? "border-clay bg-clay/10"
                        : "border-ink/10 hover:border-clay/50"
                    }`}
                  >
                    <p className="font-display">{o.name}</p>
                    <p className="text-sm text-ink/60">
                      +{Number(o.price).toFixed(0)} DH
                    </p>
                  </button>
                ))}
                {availableOptions.length === 0 && (
                  <p className="text-sm text-ink/50">Aucune option disponible.</p>
                )}
              </div>

              <div className="mt-6">
                <label className="text-sm text-ink/70">Quantité</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-24 rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <p className="font-display text-xl">Résumé</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/70">
                <li>Modèle : {product.name}</li>
                <li>Fil : {selectedMaterial?.name || "—"}</li>
                <li>Couleur : {selectedColor?.name || "—"}</li>
                {hasSizes && <li>Taille : {selectedSize?.name || "—"}</li>}
                <li>
                  Options :{" "}
                  {selectedOptions.length > 0
                    ? selectedOptions.map((o) => o.name).join(", ")
                    : "Aucune"}
                </li>
                <li>Quantité : {quantity}</li>
              </ul>

              <div className="mt-6">
                <label className="text-sm text-ink/70">
                  Un commentaire pour l'atelier ? (optionnel)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <p className="font-display text-xl">Aperçu IA</p>
              <p className="mt-1 text-sm text-ink/60">
                Visualisez votre pièce en « {selectedMaterial?.name} / {selectedColor?.name} » avant sa fabrication.
              </p>

              <div className="mt-4 aspect-square overflow-hidden rounded-xl bg-linen">
                {generatedImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={generatedImageUrl}
                    alt="Aperçu généré"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-ink/40">
                    {generating ? "Génération en cours..." : "Aucun aperçu généré"}
                  </div>
                )}
              </div>

              {generationError && (
                <p className="mt-4 text-sm text-red-700">{generationError}</p>
              )}

              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={generating}
                className="mt-4 rounded-full bg-clay px-6 py-2.5 text-sm text-card hover:bg-ink transition-colors disabled:opacity-50"
              >
                {generating
                  ? "Génération..."
                  : generatedImageUrl
                  ? "Régénérer"
                  : "Générer l'aperçu"}
              </button>
            </div>
          )}

          {step === 7 && (
            <div>
              <p className="font-display text-xl">Validation & livraison</p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm text-ink/70">Libellé de l'adresse</label>
                  <input
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                    placeholder="Domicile, Bureau..."
                    className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
                  />
                </div>
                <div>
                  <label className="text-sm text-ink/70">Adresse</label>
                  <input
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-ink/70">Ville</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-ink/70">Pays</label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
                    />
                  </div>
                </div>
              </div>

              {submitError && (
                <p className="mt-4 text-sm text-red-700">{submitError}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !addressLine || !city || !country}
                className="mt-6 w-full rounded-full bg-clay px-6 py-3 text-sm text-card hover:bg-ink transition-colors disabled:opacity-50"
              >
                {submitting ? "Validation..." : "Valider ma commande"}
              </button>
            </div>
          )}
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-ink/10 bg-card p-6">
          <p className="font-display text-lg">Total estimé</p>
          <p className="font-display text-3xl text-clay">
            {totalPrice.toFixed(0)} DH
          </p>
          <p className="text-xs text-ink/50">
            Acompte de 40% à la commande, solde à la livraison.
          </p>

          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 rounded-full border border-ink/20 px-4 py-2.5 text-sm hover:bg-linen transition-colors"
              >
                Précédent
              </button>
            )}
            {step < lastStepIndex && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext()}
                className="flex-1 rounded-full bg-clay px-4 py-2.5 text-sm text-card hover:bg-ink transition-colors disabled:opacity-50"
              >
                Suivant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
