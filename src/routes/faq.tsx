import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, CtaBanner } from "@/components/site/SiteLayout";
import { SectionHead } from "@/components/site/Cards";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";
import { useSql, type Faq } from "@/lib/data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ – Questions fréquentes | ASTECH" },
      { name: "description", content: "Délais d'un permis de construire, déroulement d'un projet, contenu d'un devis : nos réponses." },
      { property: "og:title", content: "FAQ – ASTECH" },
      { property: "og:description", content: "Les réponses aux questions fréquentes sur nos services." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, pick } = useI18n();
  const q = useSql<Faq>("faqs", "SELECT * FROM faqs ORDER BY ord");
  return (
    <SiteLayout>
      <PageBanner title="FAQ" crumb="FAQ" />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <SectionHead title={t("faqTitle")} sub={t("faqSub")} />
        <Accordion type="single" collapsible className="space-y-3">
          {q.data?.map((f) => (
            <AccordionItem key={f.id} value={String(f.id)} className="rounded-lg border bg-card px-5 shadow-card">
              <AccordionTrigger className="text-left font-semibold text-secondary">{pick(f, "q")}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{pick(f, "a")}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <CtaBanner />
    </SiteLayout>
  );
}
