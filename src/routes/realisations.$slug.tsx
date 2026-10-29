import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Calendar, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { QueryState } from "@/components/site/QueryState";
import { Button } from "@/components/ui/button";
import { useI18n, type DictKey } from "@/lib/i18n";
import { useProject } from "@/lib/data";

export const Route = createFileRoute("/realisations/$slug")({
  head: () => ({
    meta: [
      { title: "Réalisation – ASTECH Madagascar" },
      { name: "description", content: "Détail d'un projet réalisé par ASTECH." },
      { property: "og:title", content: "Réalisation – ASTECH" },
      { property: "og:description", content: "Découvrez ce projet de construction ASTECH." },
    ],
  }),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { t, pick } = useI18n();
  const [zoom, setZoom] = useState(false);
  const q = useProject(slug);
  const p = q.data;
  if (q.isSuccess && !p) return <SiteLayout><div className="py-32 text-center text-2xl font-bold">{t("notFound")}</div></SiteLayout>;
  if (!p)
    return (
      <SiteLayout>
        <QueryState isPending={q.isPending} isError={q.isError}>
          <div className="py-32" />
        </QueryState>
      </SiteLayout>
    );
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Link to="/realisations" className="text-sm font-semibold text-accent">← {t("ourProjects")}</Link>
        <span className="mt-6 block text-sm font-semibold text-accent">{t(`cat_${p.category}` as DictKey)}</span>
        <h1 className="break-words text-3xl font-extrabold text-secondary md:text-4xl">{pick(p, "title")}</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {p.location && <span className="flex min-w-0 items-center gap-1"><MapPin className="h-4 w-4 shrink-0" /><span className="break-words">{p.location}</span></span>}
          {p.year && <span className="flex items-center gap-1"><Calendar className="h-4 w-4 shrink-0" />{p.year}</span>}
        </div>
        <button onClick={() => setZoom(true)} className="mt-8 block w-full overflow-hidden rounded-xl" aria-label="Agrandir">
          <img src={p.image} alt={pick(p, "title")} className="w-full object-cover" />
        </button>
        <p className="mt-8 text-lg leading-relaxed">{pick(p, "description")}</p>
        <Button asChild variant="cta" size="lg" className="mt-8"><Link to="/contact">{t("quote")} →</Link></Button>
      </section>
      {zoom && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-navy-deep/95 p-4" onClick={() => setZoom(false)} role="dialog">
          <button className="absolute right-4 top-4 text-secondary-foreground" aria-label="Fermer"><X className="h-8 w-8" /></button>
          <img src={p.image} alt={pick(p, "title")} className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </SiteLayout>
  );
}
