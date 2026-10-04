import LegalLayout from "@/components/LegalLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Conditions générales de vente — NEMA" };

export default async function CGVPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  return (
    <LegalLayout
      accountHref={accountHref}
      eyebrow="CONDITIONS"
      title="Conditions générales de vente"
      updated="[À COMPLÉTER — date de mise en ligne]"
    >
      <p className="rounded-xl border border-orange/30 bg-orange/10 p-4 text-noir/80">
        NEMA n'a pas encore de structure juridique formellement enregistrée. Les
        emplacements marqués <strong>[À COMPLÉTER]</strong> doivent être remplis
        dès que le statut légal (auto-entreprise, société...) est fixé, avant
        toute vente réelle.
      </p>

      <div>
        <h2>Article 1 — Objet</h2>
        <p>
          Les présentes conditions générales de vente (CGV) régissent les
          relations contractuelles entre <strong>[À COMPLÉTER — nom légal de
          l'entreprise]</strong> (« NEMA », « nous ») et toute personne
          effectuant un achat ou une commande personnalisée via le site NEMA
          (« le Site »). Toute commande passée sur le Site implique
          l'acceptation sans réserve des présentes CGV.
        </p>
      </div>

      <div>
        <h2>Article 2 — Produits et personnalisation</h2>
        <p>
          NEMA propose des créations en crochet fait main, personnalisables via
          le configurateur du Site (choix du fil, de la ou des couleurs, de la
          taille et d'options complémentaires). Chaque pièce est réalisée à la
          commande, après validation d'un aperçu par la cliente.
        </p>
      </div>

      <div>
        <h2>Article 3 — Prix</h2>
        <p>
          Les prix sont indiqués en dirhams marocains (DH), toutes taxes
          comprises. Le prix final dépend du modèle, du fil, de la taille et
          des options choisies, et est affiché avant validation de la commande.
          NEMA se réserve le droit de modifier ses prix à tout moment ; le prix
          applicable est celui en vigueur au moment de la commande.
        </p>
      </div>

      <div>
        <h2>Article 4 — Commande et paiement</h2>
        <p>
          La commande est confirmée après validation de l'aperçu de la création
          et renseignement d'une adresse de livraison. Un acompte de 40 % du
          montant total est demandé à la commande ; le solde est dû à la
          livraison. <strong>[À COMPLÉTER — moyens de paiement acceptés et
          modalités exactes (virement, espèces à la livraison, etc.)]</strong>.
        </p>
      </div>

      <div>
        <h2>Article 5 — Fabrication et délais</h2>
        <p>
          Chaque création étant faite main et à la commande, le délai de
          fabrication varie selon le modèle et est indiqué sur la fiche produit
          avant validation. Ce délai est donné à titre indicatif et peut varier
          selon la charge de l'atelier ; NEMA s'engage à informer la cliente en
          cas de retard significatif.
        </p>
      </div>

      <div>
        <h2>Article 6 — Livraison</h2>
        <p>
          <strong>[À COMPLÉTER — zones de livraison, transporteur(s) et frais
          de livraison]</strong>. La cliente est responsable de l'exactitude de
          l'adresse fournie lors de la commande.
        </p>
      </div>

      <div>
        <h2>Article 7 — Droit de rétractation</h2>
        <p>
          Conformément à la réglementation applicable aux biens confectionnés
          selon les spécifications du consommateur ou nettement personnalisés,
          les créations NEMA étant réalisées sur mesure à la commande, elles ne
          bénéficient pas du droit de rétractation standard applicable aux
          produits de série. Toute réclamation relative à un défaut de
          fabrication reste possible (voir Article 8).
        </p>
      </div>

      <div>
        <h2>Article 8 — Réclamations et garanties</h2>
        <p>
          En cas de défaut de fabrication ou de non-conformité avec l'aperçu
          validé, la cliente dispose de <strong>[À COMPLÉTER — délai, ex. 14
          jours]</strong> après réception pour contacter NEMA via la page{" "}
          <a href="/contact" className="text-orange hover:text-noir transition-colors">
            Contact
          </a>{" "}
          et demander une réparation, un remplacement ou un remboursement
          partiel, selon la nature du défaut.
        </p>
      </div>

      <div>
        <h2>Article 9 — Données personnelles</h2>
        <p>
          Le traitement des données personnelles collectées lors d'une
          commande est décrit dans notre{" "}
          <a href="/confidentialite" className="text-orange hover:text-noir transition-colors">
            politique de confidentialité
          </a>
          .
        </p>
      </div>

      <div>
        <h2>Article 10 — Droit applicable et litiges</h2>
        <p>
          Les présentes CGV sont soumises au droit{" "}
          <strong>[À COMPLÉTER — pays]</strong>. En cas de litige, une solution
          amiable sera recherchée en priorité via la page{" "}
          <a href="/contact" className="text-orange hover:text-noir transition-colors">
            Contact
          </a>
          , avant tout recours judiciaire devant les juridictions compétentes.
        </p>
      </div>
    </LegalLayout>
  );
}
