import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner } from "@/components/site/SiteLayout";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/data";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales – ASTECH" },
      { name: "description", content: "Éditeur du site et directeur de la publication d'ASTECH." },
      { property: "og:title", content: "Mentions légales – ASTECH" },
      { property: "og:description", content: "Informations légales d'ASTECH." },
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
      </article>
    </SiteLayout>
  );
}
