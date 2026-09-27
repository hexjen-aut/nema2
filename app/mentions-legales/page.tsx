import LegalLayout from "@/components/LegalLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Mentions légales — NEMA" };

export default async function MentionsLegalesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  return (
    <LegalLayout
      accountHref={accountHref}
      eyebrow="MENTIONS LÉGALES"
      title="Mentions légales"
      updated="[À COMPLÉTER — date de mise en ligne]"
    >
      <p className="rounded-xl border border-orange/30 bg-orange/10 p-4 text-noir/80">
        NEMA n'a pas encore de structure juridique formellement enregistrée. Les
        emplacements marqués <strong>[À COMPLÉTER]</strong> doivent être remplis
        dès que le statut légal est fixé.
      </p>

      <div>
        <h2>Éditeur du site</h2>
        <ul>
          <li>Nom / raison sociale : [À COMPLÉTER]</li>
          <li>Forme juridique : [À COMPLÉTER — ex. auto-entreprise, SARL...]</li>
          <li>Adresse : [À COMPLÉTER]</li>
          <li>Numéro d'enregistrement (RC/ICE ou équivalent) : [À COMPLÉTER]</li>
          <li>
            Email de contact :{" "}
            <a href="/contact" className="text-orange hover:text-noir transition-colors">
              via la page Contact
            </a>
          </li>
          <li>Directrice de la publication : [À COMPLÉTER]</li>
        </ul>
      </div>

      <div>
        <h2>Hébergement</h2>
        <p>
          Le Site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
          CA 91789, États-Unis. La base de données est hébergée par Supabase
          Inc.
        </p>
      </div>

      <div>
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments du Site (textes, logo, photographies,
          charte graphique) est la propriété exclusive de NEMA, sauf mention
          contraire, et ne peut être reproduit, distribué ou exploité sans
          autorisation écrite préalable.
        </p>
      </div>

      <div>
        <h2>Responsabilité</h2>
        <p>
          NEMA s'efforce d'assurer l'exactitude des informations publiées sur
          le Site, mais ne peut garantir l'absence d'erreur ou d'omission.
          NEMA ne pourra être tenue responsable des dommages directs ou
          indirects résultant de l'accès ou de l'usage du Site.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Pour toute question relative aux présentes mentions légales,
          utilisez la page{" "}
          <a href="/contact" className="text-orange hover:text-noir transition-colors">
            Contact
          </a>
          .
        </p>
      </div>
    </LegalLayout>
  );
}
