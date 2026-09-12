"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nema-admin-tutorial-vu";

const SECTIONS = [
  {
    title: "Tableau de bord",
    text: "La vue d'ensemble : commandes du jour, chiffre d'affaires, produits les plus vendus.",
  },
  {
    title: "Commandes",
    text: "Chaque commande passée par une cliente. Changez le statut (nouvelle, en cours, fabrication, expédiée...) avec le menu puis \"Mettre à jour\", et échangez des messages avec la cliente en bas de chaque commande.",
  },
  {
    title: "Produits",
    text: "Les créations vendues sur le site : nom, prix, photos, tailles disponibles. \"Actif/Inactif\" décide si le produit apparaît sur le site.",
  },
  {
    title: "Catégories",
    text: "Les grandes familles affichées sur le site (Sacs, Bonnets...), chacune avec sa photo de couverture.",
  },
  {
    title: "Fils, Prix, Couleurs, Options",
    text: "Les choix proposés aux clientes pour personnaliser une pièce, et les suppléments de prix associés.",
  },
  {
    title: "Contenu Home",
    text: "Les photos affichées sur la page d'accueil du site (Hero, Philosophie...). Tant qu'aucune photo n'est ajoutée, un emplacement réservé s'affiche à la place sur le site.",
  },
  {
    title: "Clients",
    text: "La liste des personnes inscrites sur le site.",
  },
];

export default function OnboardingGuide() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch {
      // stockage indisponible — pas grave, le tutoriel reste accessible via le bouton
    }
    setReady(true);
  }, []);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-ink/60 hover:bg-ivoire hover:text-noir transition-colors"
      >
        Comment ça marche ?
      </button>

      {ready && open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir/40 p-6">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink/10 bg-card p-6">
            <p className="font-display text-2xl">Guide du Dashboard</p>
            <p className="mt-1 text-sm text-ink/60">
              Un rappel rapide de ce que fait chaque section.
            </p>

            <div className="mt-5 space-y-4">
              {SECTIONS.map((s) => (
                <div key={s.title}>
                  <p className="text-sm font-medium text-noir">{s.title}</p>
                  <p className="mt-0.5 text-sm text-ink/70">{s.text}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs text-ink/50">
              Astuce : un petit rond "?" à côté d'un bouton explique toujours ce qu'il fait.
            </p>

            <button
              type="button"
              onClick={close}
              className="mt-6 w-full rounded-full bg-clay px-6 py-3 text-sm text-card hover:bg-ink transition-colors"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}
