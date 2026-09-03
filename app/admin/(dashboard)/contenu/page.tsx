import { createClient } from "@/lib/supabase/server";
import { updateSiteContent, removeSiteContent } from "./actions";
import { CONTENT_KEYS } from "./content-keys";

export default async function ContenuPage() {
  const supabase = createClient();

  const { data: rows } = await supabase.from("settings").select("key, value");
  const imageByKey = new Map<string, string>(
    (rows || []).map((r: any) => [r.key, r.value?.image_url || null])
  );

  const sections = Array.from(new Set(CONTENT_KEYS.map((c) => c.section)));

  return (
    <div>
      <h1 className="font-display text-2xl">Contenu Home</h1>
      <p className="mt-1 text-sm text-ink/60">
        Les visuels éditoriaux affichés sur la page d'accueil (Hero, Créez,
        Histoire, NEMA en situation, Aperçu IA). Tant qu'une image n'est pas
        ajoutée ici, un emplacement réservé s'affiche à la place sur le site.
      </p>

      {sections.map((section) => (
        <div key={section} className="mt-8">
          <p className="text-xs tracking-widest text-ink/40">{section.toUpperCase()}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTENT_KEYS.filter((c) => c.section === section).map((c) => {
              const imageUrl = imageByKey.get(c.key);
              return (
                <div key={c.key} className="rounded-2xl border border-ink/10 bg-card p-4">
                  <div className="mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-linen">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={c.label} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-ink/40">
                        Pas d'image — placeholder affiché sur le site
                      </div>
                    )}
                  </div>
                  <p className="text-sm">{c.label}</p>

                  <form
                    action={updateSiteContent.bind(null, c.key)}
                    encType="multipart/form-data"
                    className="mt-3 flex items-center gap-2"
                  >
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full text-xs"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-full bg-clay px-3 py-1.5 text-xs text-card hover:bg-ink transition-colors"
                    >
                      Envoyer
                    </button>
                  </form>

                  {imageUrl && (
                    <form action={removeSiteContent.bind(null, c.key)} className="mt-2">
                      <button type="submit" className="text-xs text-ink/40 hover:text-red-700">
                        Retirer l'image
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
