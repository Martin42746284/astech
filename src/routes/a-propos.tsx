import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Clock, BadgeDollarSign, Smile } from "lucide-react";
import rendu3d from "@/assets/rendu3d.jpg";
import { SiteLayout, PageBanner, CtaBanner } from "@/components/site/SiteLayout";
import { SectionHead } from "@/components/site/Cards";
import { QueryState } from "@/components/site/QueryState";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { useI18n } from "@/lib/i18n";
import { useSettingsQuery, useGallery } from "@/lib/data";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos d'ASTECH – Bureau d'études Madagascar" },
      { name: "description", content: "Histoire, méthode de travail et engagements d'ASTECH, bureau d'études et entreprise de construction." },
      { property: "og:title", content: "À propos d'ASTECH" },
      { property: "og:description", content: "Qualité, délais, transparence : nos engagements." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, lang } = useI18n();
  const settings = useSettingsQuery();
  const s = settings.data ?? {};
  const gallery = useGallery();
  const items = [
    { i: ShieldCheck, l: t("quality") },
    { i: Clock, l: t("deadlines") },
    { i: BadgeDollarSign, l: t("transparency") },
    { i: Smile, l: t("satisfaction") },
  ];
  return (
    <SiteLayout>
      <PageBanner title={`${t("about")} ASTECH`} crumb={t("about")} />
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <img src={rendu3d} alt="Rendu 3D ASTECH" loading="lazy" className="rounded-xl shadow-card" />
        <div>
          <SectionHead title={t("ourStory")} />
          <QueryState isPending={settings.isPending} isError={settings.isError}>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {lang === "mg" ? s.about_mg : s.about_fr}
            </p>
          </QueryState>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-xl bg-secondary p-8 text-secondary-foreground md:p-12">
          <h2 className="text-2xl font-extrabold">{t("commitments")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {items.map((x) => <div key={x.l}><x.i className="h-9 w-9 text-primary" /><p className="mt-3 font-semibold">{x.l}</p></div>)}
          </div>
        </div>
      </section>
      {(gallery.isPending || gallery.isError || !!gallery.data?.length) && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <SectionHead
            title={t("ourGallery")}
            sub={t("gallerySub")}
            link="/galerie"
            linkLabel={t("allGallery")}
          />
          <QueryState isPending={gallery.isPending} isError={gallery.isError}>
            <GalleryGrid items={(gallery.data ?? []).slice(0, 4)} columns={4} />
          </QueryState>
        </section>
      )}
      <CtaBanner />
    </SiteLayout>
  );
}
