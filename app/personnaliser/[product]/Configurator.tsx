"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { submitOrder } from "./actions";

type ProductSize = { id: string; name: string; price_delta: number; position: number };
type ProductColor = { id: string; name: string; hex: string; is_available: boolean };
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
  product_colors: ProductColor[];
  product_options: ProductOption[];
};

const STEP_LABELS = [
  "Modèle",
  "Taille",
  "Couleurs",
  "Options",
  "Résumé",
  "Aperçu IA",
  "Validation",
];

export default function Configurator({ product }: { product: Product }) {
  const [step, setStep] = useState(0);

  const [sizeId, setSizeId] = useState<string | null>(
    product.product_sizes[0]?.id ?? null
  );
  const [primaryColorId, setPrimaryColorId] = useState<string | null>(null);
  const [secondaryColorId, setSecondaryColorId] = useState<string | null>(null);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState("");

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [addressLabel, setAddressLabel] = useState("Domicile");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableColors = product.product_colors.filter((c) => c.is_available);
  const availableOptions = product.product_options.filter((o) => o.is_available);

  const selectedSize = product.product_sizes.find((s) => s.id === sizeId);
  const selectedOptions = availableOptions.filter((o) => optionIds.includes(o.id));

  const unitPrice = useMemo(() => {
    const sizeDelta = Number(selectedSize?.price_delta || 0);
    const optionsTotal = selectedOptions.reduce((sum, o) => sum + Number(o.price), 0);
    return Number(product.base_price) + sizeDelta + optionsTotal;
  }, [product.base_price, selectedSize, selectedOptions]);

  const totalPrice = unitPrice * quantity;

  function toggleOption(id: string) {
    setOptionIds((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  }

  function canGoNext(): boolean {
    if (step === 1) return Boolean(sizeId);
    if (step === 2) return Boolean(primaryColorId);
    return true;
  }

  async function handleGeneratePreview() {
    setGenerating(true);
    // NOTE: branchez ici votre service de génération d'image IA (ex: appel à une
    // Edge Function Supabase ou une API externe). En attendant, on utilise la
    // première photo du produit comme aperçu de secours.
    await new Promise((r) => setTimeout(r, 1200));
    const fallback = product.product_images[0]?.url ?? null;
    setGeneratedImageUrl(fallback);
    setGenerating(false);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitOrder({
      productId: product.id,
      sizeId,
      primaryColorId,
      secondaryColorId,
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
    // en cas de succès, submitOrder redirige côté serveur vers /mes-commandes
  }

  return (
    <div className="mx-auto max-w-wrap px-6 py-10">
      <Link href="/personnaliser" className="text-sm text-ink/50 hover:text-clay transition-colors">
        ← Retour aux modèles
      </Link>

      <h1 className="mt-3 font-display text-3xl">{product.name}</h1>
      <p className="mt-1 text-sm text-ink/60">
        {product.categories?.name} · Livraison en {product.fabrication_days} jours
      </p>

      {/* Barre d'étapes */}
      <div className="mt-8 flex items-center gap-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full ${
                i <= step ? "bg-clay" : "bg-ink/10"
              }`}
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
        {/* Contenu de l'étape */}
        <div className="rounded-2xl border border-ink/10 bg-card p-6">
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
              <p className="font-display text-xl">Choisissez une taille</p>
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
                {product.product_sizes.length === 0 && (
                  <p className="text-sm text-ink/50">Aucune taille configurée.</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="font-display text-xl">Couleurs</p>
              <p className="mt-1 text-sm text-ink/60">Couleur principale (obligatoire)</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {availableColors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPrimaryColorId(c.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        primaryColorId === c.id
                          ? "border-clay scale-110"
                          : "border-ink/10"
                      }`}
                      style={{ backgroundColor: c.hex || "#eee" }}
                    />
                    <span className="text-xs text-ink/60">{c.name}</span>
                  </button>
                ))}
              </div>

              <p className="mt-6 text-sm text-ink/60">
                Couleur secondaire (optionnelle)
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSecondaryColorId(null)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs ${
                    secondaryColorId === null
                      ? "border-clay"
                      : "border-ink/10 text-ink/40"
                  }`}
                >
                  Aucune
                </button>
                {availableColors
                  .filter((c) => c.id !== primaryColorId)
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSecondaryColorId(c.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className={`h-10 w-10 rounded-full border-2 transition-all ${
                          secondaryColorId === c.id
                            ? "border-clay scale-110"
                            : "border-ink/10"
                        }`}
                        style={{ backgroundColor: c.hex || "#eee" }}
                      />
                      <span className="text-xs text-ink/60">{c.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {step === 3 && (
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

          {step === 4 && (
            <div>
              <p className="font-display text-xl">Résumé</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/70">
                <li>Modèle : {product.name}</li>
                <li>Taille : {selectedSize?.name || "—"}</li>
                <li>
                  Couleur :{" "}
                  {availableColors.find((c) => c.id === primaryColorId)?.name || "—"}
                  {secondaryColorId
                    ? ` / ${availableColors.find((c) => c.id === secondaryColorId)?.name}`
                    : ""}
                </li>
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

          {step === 5 && (
            <div>
              <p className="font-display text-xl">Aperçu IA</p>
              <p className="mt-1 text-sm text-ink/60">
                Visualisez votre pièce avant sa fabrication.
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

          {step === 6 && (
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

        {/* Récapitulatif prix + navigation */}
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
            {step < STEP_LABELS.length - 1 && (
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
