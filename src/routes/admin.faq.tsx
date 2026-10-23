import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/shared";

export const Route = createFileRoute("/admin/faq")({ component: Page });

function Page() {
  return (
    <CrudPage
      title="FAQ" table="faqs" orderBy="ord"
      columns={[
        { label: "Ordre", render: (r) => r.ord as number },
        { label: "Question", render: (r) => String(r.q_fr) },
      ]}
      fields={[
        { name: "q_fr", label: "Question (FR)", required: true, full: true },
        { name: "q_mg", label: "Question (MG)", full: true },
        { name: "a_fr", label: "Réponse (FR)", type: "textarea", required: true },
        { name: "a_mg", label: "Réponse (MG)", type: "textarea" },
        { name: "ord", label: "Ordre", type: "number" },
      ]}
    />
  );
}
