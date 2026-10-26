import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout, PageBanner } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useSql, type Service } from "@/lib/data";

export const Route = createFileRoute("/services/$slug")({
  head: () => ({
    meta: [
      { title: "Service – ASTECH Madagascar" },
      { name: "description", content: "Détail d'un service ASTECH : étapes, livrables et demande de devis." },
      { property: "og:title", content: "Service – ASTECH" },
      { property: "og:description", content: "Découvrez ce service proposé par ASTECH." },
    ],
  }),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { t, pick } = useI18n();
  const q = useSql<Service>("service", "SELECT * FROM services WHERE slug=?", [slug]);
  const s = q.data?.[0];
  if (q.isSuccess && !s)
    return <SiteLayout><div className="py-32 text-center"><h1 className="text-2xl font-bold">{t("notFound")}</h1><Link to="/services" className="text-accent">{t("ourServices")}</Link></div></SiteLayout>;
  if (!s) return <SiteLayout><div className="py-32" /></SiteLayout>;
  const list = (f: string) => pick(s, f).split("\n").filter(Boolean);
  return (
    <SiteLayout>
      <PageBanner title={pick(s, "title")} crumb={t("services")} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ServiceIcon name={s.icon} className="h-12 w-12 text-primary-glow" />
          <p className="mt-4 text-lg font-semibold text-secondary">{pick(s, "summary")}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{pick(s, "description")}</p>
          <h2 className="mt-10 text-xl font-bold text-secondary">{t("steps")}</h2>
          <ol className="mt-4 space-y-3">
            {list("steps").map((x, i) => (
              <li key={i} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span><span className="pt-0.5">{x}</span></li>
            ))}
          </ol>
        </div>
        <aside className="h-fit rounded-xl bg-secondary p-6 text-secondary-foreground">
          <h2 className="font-bold">{t("deliverables")}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {list("deliverables").map((x, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{x}</li>)}
          </ul>
          <Button asChild variant="cta" className="mt-6 w-full"><Link to="/contact">{t("quote")}</Link></Button>
        </aside>
      </section>
    </SiteLayout>
  );
}
