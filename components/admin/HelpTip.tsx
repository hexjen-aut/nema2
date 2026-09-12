"use client";

import { useState } from "react";

// Petit badge d'aide contextuelle — au clic, explique à quoi sert le
// bouton/le champ à côté duquel il est posé. Pensé pour une utilisatrice
// non technique qui gère la boutique au quotidien.
export default function HelpTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-label="Aide"
        className="flex h-4 w-4 items-center justify-center rounded-full border border-ink/30 text-[10px] leading-none text-ink/50 hover:border-clay hover:text-clay transition-colors"
      >
        ?
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-xl border border-ink/10 bg-card p-3 text-left text-xs leading-relaxed text-ink/80 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
