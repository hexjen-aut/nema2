import LegalLayout from "@/components/LegalLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Politique de confidentialité — NEMA" };

export default async function ConfidentialitePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  return (
    <LegalLayout
      accountHref={accountHref}
      eyebrow="CONFIDENTIALITÉ"
      title="Politique de confidentialité"
      updated="[À COMPLÉTER — date de mise en ligne]"
    >
      <p className="rounded-xl border border-orange/30 bg-orange/10 p-4 text-noir/80">
        NEMA n'a pas encore de structure juridique formellement enregistrée. Les
        emplacements marqués <strong>[À COMPLÉTER]</strong> doivent être remplis
        dès que le statut légal est fixé.
      </p>

      <div>
        <h2>Responsable du traitement</h2>
        <p>
          <strong>[À COMPLÉTER — nom légal de l'entreprise]</strong> est
          responsable du traitement des données personnelles collectées via le
          Site.
        </p>
      </div>

      <div>
        <h2>Données collectées</h2>
        <ul>
          <li>Compte : nom, email, téléphone (lors de l'inscription).</li>
          <li>
            Commande : adresse de livraison, choix de personnalisation (fil,
            couleurs, taille, options), photo d'aperçu générée par IA.
          </li>
          <li>Contact : nom, email et message envoyés via le formulaire de contact.</li>
          <li>Échanges liés à une commande (messagerie commande ↔ atelier).</li>
        </ul>
      </div>

      <div>
        <h2>Finalité du traitement</h2>
        <ul>
          <li>Gérer votre compte et vos commandes.</li>
          <li>Générer l'aperçu visuel de votre création personnalisée.</li>
          <li>Vous contacter au sujet d'une commande ou d'une demande.</li>
          <li>Répondre aux obligations légales et comptables applicables.</li>
        </ul>
      </div>

      <div>
        <h2>Destinataires et sous-traitants</h2>
        <p>Vos données sont hébergées et traitées par les prestataires suivants :</p>
        <ul>
          <li>Supabase Inc. — hébergement de la base de données et authentification.</li>
          <li>Vercel Inc. — hébergement du Site.</li>
          <li>Resend — envoi des emails transactionnels (confirmation de commande, contact).</li>
          <li>Replicate Inc. — génération de l'aperçu IA de votre création personnalisée.</li>
        </ul>
        <p>Vos données ne sont ni vendues, ni cédées à des fins commerciales tierces.</p>
      </div>

      <div>
        <h2>Durée de conservation</h2>
        <p>
          Les données de compte et de commande sont conservées pendant la
          durée de la relation commerciale, puis archivées selon les
          obligations légales applicables. <strong>[À COMPLÉTER — durées
          précises une fois le statut légal fixé]</strong>.
        </p>
      </div>

      <div>
        <h2>Vos droits</h2>
        <p>
          Vous disposez d'un droit d'accès, de rectification, d'effacement et
          de portabilité de vos données. Vous pouvez également supprimer votre
          compte directement depuis votre espace client, ou exercer ces droits
          en écrivant via la page{" "}
          <a href="/contact" className="text-orange hover:text-noir transition-colors">
            Contact
          </a>
          .
        </p>
      </div>

      <div>
        <h2>Cookies</h2>
        <p>
          Le Site utilise uniquement des cookies techniques nécessaires à
          l'authentification et au bon fonctionnement du compte client et du
          panier de personnalisation — aucun cookie publicitaire ou de
          traçage tiers n'est utilisé à ce jour.
        </p>
      </div>
    </LegalLayout>
  );
}
