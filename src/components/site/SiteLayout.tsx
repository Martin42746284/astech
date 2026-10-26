import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Phone, Mail, Facebook, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { useI18n, type DictKey } from "@/lib/i18n";
import { useSettings, waLink, telLink } from "@/lib/data";
import { trackVisit, trackWhatsapp as trackWhatsappFn } from "@/lib/data.functions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV: { to: string; key: DictKey }[] = [
  { to: "/", key: "home" },
  { to: "/services", key: "services" },
  { to: "/realisations", key: "projects" },
  { to: "/a-propos", key: "about" },
  { to: "/faq", key: "faq" },
  { to: "/contact", key: "contact" },
];

function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn("flex items-center gap-1 text-sm font-semibold", className)} role="group" aria-label="Langue">
      {(["fr", "mg"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="opacity-50">|</span>}
          <button onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("uppercase", lang === l ? "text-primary" : "opacity-80 hover:opacity-100")}>
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}

export function trackWhatsapp() {
  void trackWhatsappFn().catch(() => {});
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const s = useSettings();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    setOpen(false);
    void trackVisit({ data: { path } }).catch(() => {});
  }, [path]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-secondary text-secondary-foreground shadow-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" aria-label="ASTECH – Accueil">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Principale">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="text-sm font-medium opacity-90 hover:text-primary data-[status=active]:text-primary data-[status=active]:opacity-100">
                {t(n.key)}
              </Link>
            ))}
            <LangSwitch />
            <Button asChild size="sm" variant="cta">
              <Link to="/contact">{t("quote")}</Link>
            </Button>
          </nav>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-sidebar-border px-4 pb-4 lg:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="block py-3 font-medium data-[status=active]:text-primary">
                {t(n.key)}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between">
              <LangSwitch />
              <Button asChild size="sm" variant="cta">
                <Link to="/contact">{t("quote")}</Link>
              </Button>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-navy-deep text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm opacity-80">{t("slogan")}</p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">{t("navigation")}</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-primary">{t(n.key)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">{t("contact")}</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href={telLink(s.phone1)} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" />{s.phone1}</a></li>
              <li><a href={telLink(s.phone2)} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" />{s.phone2}</a></li>
              <li><a href={`mailto:${s.email}`} className="flex items-center gap-2 break-all hover:text-primary"><Mail className="h-4 w-4" />{s.email}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">{t("followUs")}</h3>
            <div className="flex gap-3">
              <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-secondary p-2 hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href={waLink(s.whatsapp, t("waMsg"))} onClick={trackWhatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full bg-secondary p-2 hover:text-primary"><MessageCircle className="h-5 w-5" /></a>
            </div>
            <h3 className="mb-2 mt-6 font-semibold">{t("legalInfo")}</h3>
            <Link to="/mentions-legales" className="text-sm opacity-80 hover:text-primary">{t("legal")}</Link>
          </div>
        </div>
        <div className="border-t border-sidebar-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs opacity-70">
            <span>© {new Date().getFullYear()} ASTECH. {t("rights")}</span>
            <LangSwitch />
          </div>
        </div>
      </footer>

      <a
        href={waLink(s.whatsapp, t("waMsg"))}
        onClick={trackWhatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-success-foreground shadow-glow transition-transform hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}

export function PageBanner({ title, crumb, image }: { title: string; crumb: string; image: string }) {
  const { t } = useI18n();
  return (
    <section className="relative isolate overflow-hidden bg-secondary text-secondary-foreground">
      <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-banner-overlay" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm opacity-80">
          <Link to="/" className="hover:text-primary">{t("home")}</Link> <span className="mx-1">›</span> {crumb}
        </p>
      </div>
    </section>
  );
}

export function CtaBanner({ image }: { image: string }) {
  const { t } = useI18n();
  const s = useSettings();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="relative isolate overflow-hidden rounded-xl bg-secondary text-secondary-foreground">
        <img src={image} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-banner-overlay" />
        <div className="max-w-xl p-8 md:p-12">
          <h2 className="text-2xl font-extrabold md:text-3xl">{t("ctaTitle")}</h2>
          <p className="mt-3 opacity-85">{t("ctaText")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="cta"><Link to="/contact">{t("quote")} →</Link></Button>
            <Button asChild variant="ghostLight">
              <a href={waLink(s.whatsapp, t("waMsg"))} onClick={trackWhatsapp} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
