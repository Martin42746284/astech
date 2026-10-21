import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n, type DictKey } from "@/lib/i18n";
import type { Project, Service } from "@/lib/data";
import { ServiceIcon } from "./ServiceIcon";

export function ServiceCard({ s }: { s: Service }) {
  const { pick } = useI18n();
  return (
    <Link
      to="/services/$slug"
      params={{ slug: s.slug }}
      className="group rounded-lg border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:border-primary"
    >
      <ServiceIcon name={s.icon} className="h-8 w-8 text-primary-glow" />
      <h3 className="mt-4 font-display font-bold text-secondary group-hover:text-accent">{pick(s, "title")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{pick(s, "summary")}</p>
    </Link>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  const { pick, t } = useI18n();
  return (
    <Link to="/realisations/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-lg border bg-card shadow-card">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={p.image} alt={pick(p, "title")} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div>
          <span className="text-xs font-semibold text-accent">{t(`cat_${p.category}` as DictKey)}</span>
          <h3 className="font-display font-bold text-secondary">{pick(p, "title")}</h3>
          <p className="text-xs text-muted-foreground">{p.location}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary-glow" />
      </div>
    </Link>
  );
}

export function SectionHead({ title, sub, link, linkLabel }: { title: string; sub?: string; link?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-secondary md:text-3xl">{title}</h2>
        {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
        <span className="mt-3 block h-1 w-14 rounded bg-gradient-primary" />
      </div>
      {link && (
        <Link to={link} className="text-sm font-semibold text-accent hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
