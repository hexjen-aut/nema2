# Nema — Mise à jour "site dynamique" (logo + animations souris/scroll)

Ce dossier contient uniquement les fichiers modifiés ou ajoutés.
Copie-les dans ton repo en respectant exactement les mêmes chemins.

## Fichiers NOUVEAUX (à créer)
- components/CursorGlow.tsx      → halo lumineux qui suit la souris
- components/Reveal.tsx          → apparition douce des sections au scroll
- components/TiltCard.tsx        → cartes en tilt 3D au survol souris
- components/MagneticButton.tsx  → boutons "aimantés" qui suivent le curseur
- components/Logo.tsx            → composant logo (utilise public/nema-logo.png)
- public/nema-logo.png           → ton logo, à copier tel quel

## Fichiers REMPLACÉS (écrase l'existant)
- components/ChainDivider.tsx    → chaînette qui se dessine à l'entrée dans le viewport
- app/page.tsx                   → page d'accueil connectée aux nouveaux composants
- app/globals.css                → ancien contenu + nouvelles classes d'animation

## Étapes d'installation
1. Copie le dossier `public/` (avec `nema-logo.png`) à la racine du projet Next.js
   (crée le dossier `public/` s'il n'existe pas déjà).
2. Copie les 6 fichiers de `components/` dans `components/` du projet.
3. Remplace `app/page.tsx` et `app/globals.css` par ceux fournis ici.
4. `npm run dev` pour vérifier en local.
5. Commit + push comme d'habitude :
   ```
   git add public/nema-logo.png components/CursorGlow.tsx components/Reveal.tsx \
     components/TiltCard.tsx components/MagneticButton.tsx components/Logo.tsx \
     components/ChainDivider.tsx app/page.tsx app/globals.css
   git commit -m "Site dynamique: logo + animations souris/scroll"
   git push
   ```

## Ce qui change concrètement
- Header/footer affichent maintenant le vrai logo Nema.
- Halo orange qui suit la souris sur toute la page (desktop uniquement).
- Cartes (collections, avis) qui basculent légèrement en 3D au survol.
- Boutons qui se déplacent légèrement vers le curseur au survol.
- Sections qui apparaissent en fondu + translation quand on scrolle.
- La chaînette SVG (motif signature) se dessine progressivement à l'écran.
- Dégradé orange/or sur "Un sac, une âme" repris du logo.

Rien n'a été touché côté admin dashboard (`app/admin/**`) ni côté Supabase —
uniquement la page publique `app/page.tsx` et ses composants partagés.
