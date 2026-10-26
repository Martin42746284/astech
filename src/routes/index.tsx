import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Layers, ShieldCheck, MessageCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import hero from "@/assets/hero.jpg";
import chantier from "@/assets/chantier.jpg";
import fondation from "@/assets/fondation.jpg";
import rendu3d from "@/assets/rendu3d.jpg";
import { SiteLayout, CtaBanner, trackWhatsapp } from "@/components/site/SiteLayout";
import { ServiceCard, ProjectCard, SectionHead } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useServices, useProjects, useTestimonials, useSettings, waLink } from "@/lib/data";

const HERO_IMAGES = [hero, chantier, fondation, rendu3d] as const;

/** Retourne un tableau aléatoirement mélangé (Fisher-Yates). */
function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = a[i] as T;
    a[i] = a[j] as T;
    a[j] = current;
  }
  return a;
}

function HeroSlideshow() {
  // SSR-safe: pas de Math.random() à l'initialisation → même image côté serveur et client
  const [order, setOrder] = useState<string[]>([...HERO_IMAGES]);
  const [current, setCurrent] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [nextVisible, setNextVisible] = useState(false);

  // Shuffle après le montage (client uniquement) en gardant HERO_IMAGES[0] en tête
  useEffect(() => {
    const rest = shuffle(HERO_IMAGES.slice(1));
    setOrder([HERO_IMAGES[0], ...rest]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(function tick() {
      const next = (current + 1) % order.length;
      setNextIdx(next);
      setNextVisible(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNextVisible(true);
        });
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, order]);

  function handleTransitionEnd() {
    if (nextIdx !== null) {
      setCurrent(nextIdx);
      setNextIdx(null);
      setNextVisible(false);
    }
  }

  return (
    <>
      {/* Image courante — toujours visible en dessous */}
      <img
        src={order[current]}
        alt="ASTECH construction Madagascar"
        width={1600}
        height={912}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Nouvelle image — fade in par-dessus */}
      {nextIdx !== null && (
        <img
          src={order[nextIdx]}
          alt=""
          aria-hidden
          width={1600}
          height={912}
          className="absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: nextVisible ? 1 : 0 }}
          onTransitionEnd={handleTransitionEnd}
        />
      )}
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASTECH – Bureau d'études & construction à Madagascar" },
      { name: "description", content: "Études, plans 3D, permis de construire, suivi de chantier et construction à Antananarivo et partout à Madagascar." },
      { property: "og:title", content: "ASTECH – Votre projet de construction entre de bonnes mains" },
      { property: "og:description", content: "Bureau d'études et entreprise de construction à Madagascar." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, pick } = useI18n();
  const s = useSettings();
  const services = useServices();
  const projects = useProjects(true);
  const testi = useTestimonials();

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden bg-secondary text-secondary-foreground">
        <HeroSlideshow />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-20 md:pt-28">
          <p className="eyebrow text-primary">{t("heroEyebrow")}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">{t("heroText")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="cta"><Link to="/contact">{t("quote")} →</Link></Button>
            <Button asChild size="lg" variant="ghostLight">
              <a href={waLink(s.whatsapp, t("waMsg"))} onClick={trackWhatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
            </Button>
          </div>
          <div className="mt-16 grid max-w-3xl grid-cols-3 gap-4 border-t border-secondary-foreground/20 pt-6">
            {[
              { icon: Building2, v: `+${s.stat_projects ?? 100}`, l: t("statProjects") },
              { icon: Layers, v: String(services.data?.length ?? 8), l: t("statServices") },
              { icon: ShieldCheck, v: "100%", l: t("statQuality") },
            ].map((x) => (
              <div key={x.l} className="flex items-center gap-3">
                <x.icon className="hidden h-9 w-9 text-primary sm:block" />
                <div><div className="font-display text-2xl font-extrabold">{x.v}</div><div className="text-xs opacity-80">{x.l}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title={t("ourServices")} sub={t("servicesSub")} link="/services" linkLabel={t("allServices")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.data?.map((x) => <ServiceCard key={x.id} s={x} />)}
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead title={t("ourProjects")} sub={t("projectsSub")} link="/realisations" linkLabel={t("allProjects")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projects.data?.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {!!testi.data?.length && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <SectionHead title={t("testimonials")} />
          <div className="grid gap-5 md:grid-cols-3">
            {testi.data.map((x) => (
              <figure key={x.id} className="rounded-lg border bg-card p-6 shadow-card">
                <div className="flex gap-1 text-primary-glow">{Array.from({ length: x.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <blockquote className="mt-3 text-sm">« {pick(x, "text")} »</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-secondary">{x.name} <span className="font-normal text-muted-foreground">· {x.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <CtaBanner />
    </SiteLayout>
  );
}
