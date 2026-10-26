import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner } from "@/components/site/SiteLayout";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/data";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales et confidentialité – ASTECH" },
      { name: "description", content: "Éditeur du site, données personnelles et politique de confidentialité d'ASTECH." },
      { property: "og:title", content: "Mentions légales – ASTECH" },
      { property: "og:description", content: "Informations légales et protection des données." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const s = useSettings();
  return (
    <SiteLayout>
      <PageBanner title={t("legal")} crumb={t("legal")} />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-relaxed">
        <section><h2 className="mb-2 text-lg font-bold text-secondary">Éditeur du site</h2>
          <p>{s.company_name} – Bureau d'études et entreprise de construction<br />{s.address}<br />Tél. : {s.phone1} / {s.phone2}<br />E-mail : {s.email}<br />STAT : {s.stat} · NIF : {s.nif} · RCS : {s.rcs}</p></section>
        <section><h2 className="mb-2 text-lg font-bold text-secondary">Directeur de la publication</h2><p>{s.director}</p></section>
        <section><h2 className="mb-2 text-lg font-bold text-secondary">Hébergement</h2><p>Le site fonctionne localement sur le poste de l'entreprise ASTECH ; les données sont stockées sur ce poste.</p></section>
        <section><h2 className="mb-2 text-lg font-bold text-secondary">Propriété intellectuelle</h2><p>L'ensemble des contenus (textes, images, plans) est la propriété exclusive d'ASTECH, sauf mention contraire.</p></section>
        <section><h2 className="mb-2 text-lg font-bold text-secondary">Données personnelles</h2>
          <p>Les informations du formulaire de devis (nom, téléphone, e-mail, message) servent uniquement à répondre à votre demande. Elles sont conservées 24 mois maximum. Conformément à la loi malgache n° 2014-038 et aux principes du RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à {s.email}.</p></section>
        <section><h2 className="mb-2 text-lg font-bold text-secondary">Cookies</h2><p>Ce site n'utilise aucun cookie de suivi. Seules votre langue et la session d'administration sont mémorisées sur votre appareil.</p></section>
      </article>
    </SiteLayout>
  );
}
