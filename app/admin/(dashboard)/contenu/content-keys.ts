// "aspect" = largeur / hauteur du cadre affiché sur le site, pour proposer
// le bon cadrage à l'envoi (voir ImageUploadField / ImageCropModal).
export const CONTENT_KEYS = [
  { key: "hero", label: "Hero — Photo 01", section: "Accueil", aspect: 16 / 9 },
  { key: "hero_2", label: "Hero — Photo 02", section: "Accueil", aspect: 16 / 9 },
  { key: "hero_3", label: "Hero — Photo 03", section: "Accueil", aspect: 16 / 9 },
  { key: "hero_4", label: "Hero — Photo 04", section: "Accueil", aspect: 16 / 9 },
  { key: "philosophie", label: "Notre philosophie", section: "Accueil", aspect: 4 / 5 },
  {
    key: "creez_produit_vierge",
    label: "Créez — Produit vierge",
    section: "Section Créez",
    aspect: 1,
  },
  {
    key: "creez_personnalisation",
    label: "Créez — Personnalisation",
    section: "Section Créez",
    aspect: 1,
  },
  {
    key: "creez_creation_finale",
    label: "Créez — Création finale",
    section: "Section Créez",
    aspect: 1,
  },
  { key: "histoire", label: "Histoire NEMA", section: "Histoire", aspect: 4 / 5 },
  { key: "situation_look_1", label: "Look 01 — Minimal", section: "NEMA en situation", aspect: 3 / 4 },
  { key: "situation_look_2", label: "Look 02 — Bold", section: "NEMA en situation", aspect: 3 / 4 },
  { key: "situation_look_3", label: "Look 03 — Casual", section: "NEMA en situation", aspect: 3 / 4 },
  { key: "situation_look_4", label: "Look 04 — Signature", section: "NEMA en situation", aspect: 3 / 4 },
  { key: "apercu_avant", label: "Aperçu IA — Avant", section: "Aperçu IA", aspect: 4 / 3 },
  { key: "apercu_apres", label: "Aperçu IA — Après", section: "Aperçu IA", aspect: 4 / 3 },
] as const;
