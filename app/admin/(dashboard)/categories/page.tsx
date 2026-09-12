import { createClient } from "@/lib/supabase/server";
import { createCategory, updateCategory, deleteCategory } from "./actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import HelpTip from "@/components/admin/HelpTip";

export default async function CategoriesPage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, description, image_url, position, products(id)")
    .order("position", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl">Catégories</h1>
      <p className="mt-1 text-sm text-ink/60">
        Ces catégories alimentent la page publique /collections. L'ordre définit
        l'ordre d'affichage sur le site.
      </p>

      <form
        action={createCategory}
        className="mt-6 grid gap-3 rounded-2xl border border-ink/10 bg-card p-5 sm:grid-cols-2 md:grid-cols-4"
      >
        <input
          name="name"
          placeholder="Nom (ex: Sacs)"
          required
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
        />
        <input
          name="position"
          type="number"
          placeholder="Ordre (0, 1, 2...)"
          defaultValue={0}
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
        />
        <ImageUploadField name="image_url" folder="categories" label="" />
        <button
          type="submit"
          className="h-fit rounded-lg bg-clay px-4 py-2 text-sm text-card hover:bg-ink transition-colors"
        >
          Ajouter
        </button>
        <textarea
          name="description"
          placeholder="Description (optionnel, affichée sur la page collections)"
          className="col-span-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
          rows={2}
        />
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(categories || []).map((c: any) => (
          <div key={c.id} className="rounded-2xl border border-ink/10 bg-card p-5">
            <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-linen">
              {c.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image_url} alt={c.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-ink/40">
                  Pas d'image
                </div>
              )}
            </div>

            <form action={updateCategory.bind(null, c.id)} className="space-y-2 text-sm">
              <input
                name="name"
                defaultValue={c.name}
                required
                className="w-full rounded-lg border border-ink/15 bg-linen px-3 py-2"
              />
              <textarea
                name="description"
                defaultValue={c.description || ""}
                rows={2}
                placeholder="Description"
                className="w-full rounded-lg border border-ink/15 bg-linen px-3 py-2"
              />
              <div className="flex items-center gap-2">
                <input
                  name="position"
                  type="number"
                  defaultValue={c.position}
                  className="w-24 rounded-lg border border-ink/15 bg-linen px-3 py-2"
                />
                <span className="text-xs text-ink/50">
                  {(c.products || []).length} produit(s)
                </span>
              </div>
              <ImageUploadField name="image_url" folder="categories" prefix={c.id} label="Changer la photo" />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-clay px-4 py-2 text-xs text-card hover:bg-ink transition-colors"
                >
                  Enregistrer
                </button>
                <HelpTip text="Enregistre le nom, la description, l'ordre d'affichage et la nouvelle photo (si vous en avez envoyé une)." />
              </div>
            </form>

            <form action={deleteCategory.bind(null, c.id)} className="mt-2 flex items-center gap-1.5">
              <button type="submit" className="text-xs text-ink/40 hover:text-red-700">
                Supprimer la catégorie
              </button>
              <HelpTip text="Supprime définitivement cette catégorie. Les produits qui y étaient rattachés ne seront plus classés dans aucune catégorie." />
            </form>
          </div>
        ))}

        {(categories || []).length === 0 && (
          <p className="col-span-full rounded-2xl border border-ink/10 bg-card p-6 text-center text-sm text-ink/40">
            Aucune catégorie pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}