import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import { SiteLayout, PageBanner, trackWhatsapp } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/site/QueryState";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n, type DictKey } from "@/lib/i18n";
import { useSettingsQuery, waLink, telLink, fileToImage, fileToDataUrl, PROJECT_TYPES } from "@/lib/data";
import { submitQuote } from "@/lib/data.functions";
import { quoteSchema } from "@/lib/quote-schema";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & demande de devis – ASTECH" },
      { name: "description", content: "Demandez un devis gratuit à ASTECH : formulaire, téléphone, WhatsApp ou e-mail." },
      { property: "og:title", content: "Demander un devis – ASTECH" },
      { property: "og:description", content: "Parlez-nous de votre projet de construction." },
    ],
  }),
  component: Page,
});

type Errors = Partial<Record<string, string>>;

function Page() {
  const { t, lang } = useI18n();
  const settings = useSettingsQuery();
  const s = settings.data ?? {};
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot
    const raw = Object.fromEntries(fd.entries());
    const parsed = quoteSchema.safeParse({ ...raw, consent: fd.get("consent") === "on" });
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      return;
    }
    const last = Number(localStorage.getItem("astech-last-quote") || 0);
    if (Date.now() - last < 60_000) {
      setErrors({ form: "f_tooSoon" });
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      let attachment: string | null = null;
      let attachmentName: string | null = null;
      const file = fd.get("file") as File | null;
      if (file && file.size) {
        if (file.size > 3 * 1024 * 1024 || (!file.type.startsWith("image/") && file.type !== "application/pdf")) {
          setErrors({ file: "f_required" });
          return;
        }
        attachment = file.type.startsWith("image/") ? await fileToImage(file) : await fileToDataUrl(file);
        attachmentName = file.name.replace(/[^\w.\- ]/g, "_").slice(0, 100);
      }
      await submitQuote({ data: { ...parsed.data, attachment, attachment_name: attachmentName } });
      localStorage.setItem("astech-last-quote", String(Date.now()));
      setDone(true);
    } catch (error) {
      console.error("Quote submission failed", error);
      setErrors({ form: "f_submitError" });
    } finally {
      setBusy(false);
    }
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive" role="alert">{t(errors[k] as DictKey)}</p>;

  return (
    <SiteLayout>
      <PageBanner title={`${t("contact")} / ${t("quote")}`} crumb={t("contact")} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-secondary">{t("contactInfo")}</h2>
          <QueryState isPending={settings.isPending} isError={settings.isError}>
            <div className="space-y-6">
              {[
                { i: Phone, l: t("phone"), v: <><a href={telLink(s.phone1)} className="block hover:text-accent">{s.phone1}</a><a href={telLink(s.phone2)} className="block hover:text-accent">{s.phone2}</a></> },
                { i: Mail, l: t("email"), v: <a href={`mailto:${s.email}`} className="break-all hover:text-accent">{s.email}</a> },
                { i: MapPin, l: t("address"), v: s.address },
                { i: Clock, l: t("hours"), v: lang === "mg" ? s.hours_mg : s.hours_fr },
              ].map((x) => (
                <div key={x.l} className="flex gap-4">
                  <x.i className="mt-1 h-5 w-5 shrink-0 text-primary-glow" />
                  <div><p className="font-semibold text-secondary">{x.l}</p><div className="text-sm text-muted-foreground">{x.v}</div></div>
                </div>
              ))}
            </div>
          </QueryState>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary p-5 text-secondary-foreground">
            <p className="text-sm font-semibold">{t("preferWa")}</p>
            <Button asChild variant="ghostLight" size="sm"><a href={waLink(s.whatsapp, t("waMsg"))} onClick={trackWhatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card lg:col-span-3 md:p-8">
          {done ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
              <p className="mt-4 text-lg font-semibold">{t("f_success")}</p>
              <Button variant="outline" className="mt-6" asChild><Link to="/">{t("backHome")}</Link></Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><h2 className="text-xl font-bold text-secondary">{t("quote")}</h2><p className="text-sm text-muted-foreground">{t("formIntro")}</p></div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div><Label htmlFor="name">{t("f_name")} *</Label><Input id="name" name="name" maxLength={100} />{err("name")}</div>
              <div><Label htmlFor="phone">{t("f_phone")} *</Label><Input id="phone" name="phone" type="tel" placeholder="+261 ..." />{err("phone")}</div>
              <div><Label htmlFor="email">{t("f_email")}</Label><Input id="email" name="email" type="email" />{err("email")}</div>
              <div>
                <Label htmlFor="project_type">{t("f_type")} *</Label>
                <select id="project_type" name="project_type" defaultValue="" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="" disabled>{t("f_choose")}</option>
                  {PROJECT_TYPES.map((p) => <option key={p} value={p}>{t(`type_${p}` as DictKey)}</option>)}
                </select>{err("project_type")}
              </div>
              <div><Label htmlFor="location">{t("f_location")}</Label><Input id="location" name="location" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="budget">{t("f_budget")}</Label><Input id="budget" name="budget" placeholder="Ar" /></div>
                <div><Label htmlFor="surface">{t("f_surface")}</Label><Input id="surface" name="surface" /></div>
              </div>
              <div className="sm:col-span-2"><Label htmlFor="message">{t("f_message")} *</Label><Textarea id="message" name="message" rows={5} maxLength={2000} />{err("message")}</div>
              <div className="sm:col-span-2"><Label htmlFor="file">{t("f_file")}</Label><Input id="file" name="file" type="file" accept="image/*,application/pdf" />{err("file")}</div>
              <label className="flex gap-2 text-sm sm:col-span-2"><input type="checkbox" name="consent" className="mt-1 accent-primary" /><span>{t("f_consent")} <Link to="/mentions-legales" className="text-accent underline">{t("legal")}</Link></span></label>
              <div className="sm:col-span-2">{err("consent")}{err("form")}</div>
              <Button type="submit" variant="cta" size="lg" disabled={busy} className="sm:col-span-2">{t("f_send")} →</Button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
