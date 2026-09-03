"use client";

import { useMemo, useState, type ReactNode } from "react";
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

type SectionKey = "fil" | "couleur" | "taille" | "options" | "personnalisation";

function AccordionSection({
  title,
  subtitle,
  isOpen,
  onToggle,
  disabled,
  children,
}: {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-noir/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="flex w-full items-center justify-between py-4 text-left disabled:opacity-40"
      >
        <span>
          <span className="font-display text-lg">{title}</span>
          {subtitle && <span className="ml-2 text-xs text-noir/50">{subtitle}</span>}
        </span>
        <span
          className={`text-noir/40 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {isOpen && !disabled && <div className="pb-5">{children}</div>}
    </div>
  );
}

export default function Configurator({ product }: { product: Product }) {
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

  const [materialId, setMaterialId] = useState<string | null>(defaultMaterial?.id ?? null);
  const selectedMaterial = availableMaterials.find((m) => m.id === materialId) ?? null;

  const availableColors = useMemo(
    () =>
      (selectedMaterial?.material_colors ?? []).filter(
        (c) => c.stock_status !== "unavailable"
      ),
    [selectedMaterial]
  );

  const [materialColorId, setMaterialColorId] = useState<string | null>(null);
  const hasSizes = product.product_sizes.length > 0;
  const [sizeId, setSizeId] = useState<string | null>(product.product_sizes[0]?.id ?? null);
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

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    fil: true,
    couleur: true,
    taille: true,
    options: false,
    personnalisation: false,
  });

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const availableOptions = product.product_options.filter((o) => o.is_available);
  const selectedSize = product.product_sizes.find((s) => s.id === sizeId);
  const selectedOptions = availableOptions.filter((o) => optionIds.includes(o.id));
  const selectedColor = availableColors.find((c) => c.id === materialColorId);

  const unitPrice = useMemo(() => {
    const materialDelta = Number(selectedMaterial?.price_delta || 0);
    const sizeDelta = Number(selectedSize?.price_delta || 0);
    const optionsTotal = selectedOptions.reduce((sum, o) => sum + Number(o.price), 0);
    return Number(product.base_price) + materialDelta + sizeDelta + optionsTotal;
  }, [product.base_price, selectedMaterial, selectedSize, selectedOptions]);

  const totalPrice = unitPrice * quantity;

  // Compteur "X/5" approximatif : Fil, Couleur, Taille (ou non applicable),
  // Options et Personnalisation étant les 5 catégories du cahier des charges.
  // Options/Personnalisation sont facultatives, donc comptées dès qu'elles
  // ont été consultées (ouvertes) ou renseignées.
  const completedCount = useMemo(() => {
    let n = 0;
    if (materialId) n++;
    if (materialColorId) n++;
    if (!hasSizes || sizeId) n++;
    if (optionIds.length > 0 || openSections.options) n++;
    if (comments.trim().length > 0 || openSections.personnalisation) n++;
    return n;
  }, [materialId, materialColorId, hasSizes, sizeId, optionIds, comments, openSections]);

  function toggleOption(id: string) {
    setOptionIds((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  }

  function handleSelectMaterial(id: string) {
    setMaterialId(id);
    setMaterialColorId(null);
    setGeneratedImageUrl(null);
  }

  function handleSelectColor(id: string) {
    setMaterialColorId(id);
    setGeneratedImageUrl(null);
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
          baseImageUrl: product.product_images[0]?.url ?? null,
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

  const canValidate = Boolean(
    materialId &&
      materialColorId &&
      (!hasSizes || sizeId) &&
      generatedImageUrl &&
      addressLine &&
      city &&
      country
  );

  async function handleSubmit() {
    if (!canValidate) return;
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

  return (
    <div className="min-h-screen bg-ivoire">
      {/* Barre supérieure */}
      <header className="sticky top-0 z-40 border-b border-noir/10 bg-ivoire/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link href="/" className="font-display text-lg hover:text-orange transition-colors">
            NEMA
          </Link>
          <p className="hidden text-sm text-noir/60 md:block">Votre création</p>
          <p className="text-xs text-noir/50">{completedCount}/5 complétées</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-10 lg:grid-cols-[300px_1fr_340px]">
        {/* GAUCHE — accordéon de configuration */}
        <div
          className={`order-2 transition-opacity duration-300 lg:order-1 ${
            generating ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <p className="font-display text-2xl">{product.name}</p>
          <p className="mt-1 text-sm text-noir/50">
            {product.categories?.name} · Livraison en {product.fabrication_days} jours
          </p>
          {product.description && (
            <p className="mt-3 text-sm text-noir/60">{product.description}</p>
          )}

          <div className="mt-6 rounded-2xl border border-noir/10 bg-card px-5">
            <AccordionSection
              title="Fil"
              subtitle="Tout commence par une forme."
              isOpen={openSections.fil}
              onToggle={() => toggleSection("fil")}
            >
              <div className="grid gap-2">
                {availableMaterials.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMaterial(m.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                      materialId === m.id
                        ? "border-orange bg-orange/10"
                        : "border-noir/10 hover:border-orange/50"
                    }`}
                  >
                    {m.texture_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.texture_image_url}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm">{m.name}</p>
                      <p className="text-xs text-noir/50">
                        {m.price_delta > 0
                          ? `+${Number(m.price_delta).toFixed(0)} DH`
                          : "Inclus"}
                      </p>
                    </div>
                  </button>
                ))}
                {availableMaterials.length === 0 && (
                  <p className="text-sm text-noir/50">Aucun fil configuré pour ce modèle.</p>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Couleur"
              subtitle="Choisissez votre humeur."
              isOpen={openSections.couleur}
              onToggle={() => toggleSection("couleur")}
              disabled={!selectedMaterial}
            >
              <div className="flex flex-wrap gap-3">
                {availableColors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectColor(c.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`relative h-10 w-10 overflow-hidden rounded-full border-2 transition-all ${
                        materialColorId === c.id ? "border-orange scale-110" : "border-noir/10"
                      }`}
                      style={{ backgroundColor: c.hex || "#eee" }}
                    >
                      {c.swatch_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.swatch_image_url} alt="" className="h-full w-full object-cover" />
                      )}
                    </span>
                    <span className="text-[11px] text-noir/60">{c.name}</span>
                    {c.stock_status === "low_stock" && (
                      <span className="text-[10px] text-champagne">Stock limité</span>
                    )}
                  </button>
                ))}
                {availableColors.length === 0 && (
                  <p className="text-sm text-noir/50">
                    Aucune couleur disponible pour ce fil.
                  </p>
                )}
              </div>
            </AccordionSection>

            {hasSizes && (
              <AccordionSection
                title="Taille"
                subtitle="Les détails font votre différence."
                isOpen={openSections.taille}
                onToggle={() => toggleSection("taille")}
              >
                <div className="grid gap-2">
                  {product.product_sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeId(s.id)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        sizeId === s.id
                          ? "border-orange bg-orange/10"
                          : "border-noir/10 hover:border-orange/50"
                      }`}
                    >
                      <p className="text-sm">{s.name}</p>
                      <p className="text-xs text-noir/50">
                        {s.price_delta > 0 ? `+${Number(s.price_delta).toFixed(0)} DH` : "Inclus"}
                      </p>
                    </button>
                  ))}
                </div>
              </AccordionSection>
            )}

            <AccordionSection
              title="Options"
              isOpen={openSections.options}
              onToggle={() => toggleSection("options")}
            >
              <div className="grid gap-2">
                {availableOptions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleOption(o.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      optionIds.includes(o.id)
                        ? "border-orange bg-orange/10"
                        : "border-noir/10 hover:border-orange/50"
                    }`}
                  >
                    <p className="text-sm">{o.name}</p>
                    <p className="text-xs text-noir/50">+{Number(o.price).toFixed(0)} DH</p>
                  </button>
                ))}
                {availableOptions.length === 0 && (
                  <p className="text-sm text-noir/50">Aucune option disponible.</p>
                )}

                <label className="mt-2 text-xs text-noir/70">Quantité</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-20 rounded-lg border border-noir/15 bg-ivoire px-3 py-1.5 text-sm outline-none focus:border-orange"
                />
              </div>
            </AccordionSection>

            <AccordionSection
              title="Personnalisation"
              subtitle="Ajoutez votre signature."
              isOpen={openSections.personnalisation}
              onToggle={() => toggleSection("personnalisation")}
            >
              <label className="text-xs text-noir/70">
                Un mot pour l'atelier ? (initiales, détail particulier...)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
              />
            </AccordionSection>
          </div>
        </div>

        {/* CENTRE — aperçu grand format */}
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-rose">
            {generatedImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={generatedImageUrl}
                alt="Aperçu de votre création"
                className="h-full w-full object-cover"
              />
            ) : product.product_images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.product_images[0].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-noir/40">
                Pas de photo disponible
              </div>
            )}

            {generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-noir/70 text-ivoire backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="h-10 w-10 animate-spin rounded-full border-2 border-ivoire/30 border-t-ivoire"
                />
                <p className="font-display text-lg">Voyez-la avant qu'elle existe...</p>
                <p className="text-xs text-ivoire/60">
                  Génération de votre aperçu, quelques secondes.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedMaterial && (
              <span className="rounded-full border border-noir/15 px-3 py-1 text-xs text-noir/60">
                {selectedMaterial.name}
              </span>
            )}
            {selectedColor && (
              <span className="rounded-full border border-noir/15 px-3 py-1 text-xs text-noir/60">
                {selectedColor.name}
              </span>
            )}
            {hasSizes && selectedSize && (
              <span className="rounded-full border border-noir/15 px-3 py-1 text-xs text-noir/60">
                {selectedSize.name}
              </span>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-noir/10 bg-card p-6 text-center">
            <p className="font-display text-lg">Voyez-la avant qu'elle existe.</p>
            <p className="mt-1 text-sm text-noir/60">
              Générez un aperçu IA de votre pièce en « {selectedMaterial?.name || "—"} /{" "}
              {selectedColor?.name || "—"} » — nécessaire pour valider votre commande.
            </p>
            {generationError && (
              <p className="mt-3 text-sm text-red-700">{generationError}</p>
            )}
            <button
              type="button"
              onClick={handleGeneratePreview}
              disabled={generating || !materialId || !materialColorId}
              className="mt-4 rounded-full bg-orange px-6 py-2.5 text-sm text-ivoire hover:bg-noir transition-colors disabled:opacity-50"
            >
              {generating
                ? "Génération..."
                : generatedImageUrl
                ? "Régénérer l'aperçu"
                : "Générer l'aperçu"}
            </button>
          </div>
        </div>

        {/* DROITE — résumé + validation, sticky */}
        <div className="order-3 h-fit space-y-5 rounded-2xl border border-noir/10 bg-card p-6 lg:sticky lg:top-24">
          <p className="font-display text-lg">Votre NEMA</p>

          <ul className="space-y-1.5 text-sm text-noir/70">
            <li>Produit : {product.name}</li>
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

          <div>
            <p className="font-display text-3xl text-orange">{totalPrice.toFixed(0)} DH</p>
            <p className="text-xs text-noir/50">Acompte de 40% à la commande, solde à la livraison.</p>
          </div>

          <div className="space-y-3 border-t border-noir/10 pt-5">
            <p className="text-xs tracking-label text-noir/40">LIVRAISON</p>
            <input
              value={addressLabel}
              onChange={(e) => setAddressLabel(e.target.value)}
              placeholder="Domicile, Bureau..."
              className="w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
            />
            <input
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Adresse"
              required
              className="w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ville"
                required
                className="w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
              />
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Pays"
                required
                className="w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
              />
            </div>
          </div>

          {!generatedImageUrl && (
            <p className="text-xs text-noir/50">
              Générez l'aperçu IA (au centre) pour pouvoir valider votre création.
            </p>
          )}

          {submitError && <p className="text-sm text-red-700">{submitError}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !canValidate}
            className="w-full rounded-full bg-orange px-6 py-3 text-sm text-ivoire hover:bg-noir transition-colors disabled:opacity-50"
          >
            {submitting ? "Validation..." : "Valider ma création"}
          </button>
        </div>
      </div>
    </div>
  );
}
