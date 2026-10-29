import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function QueryState({
  isPending,
  isError,
  isEmpty,
  children,
}: {
  isPending: boolean;
  isError: boolean;
  isEmpty?: boolean;
  children: ReactNode;
}) {
  const { t } = useI18n();

  if (isPending) {
    return (
      <div
        role="status"
        className="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
      >
        <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-primary" />
        <span>{t("dataLoading")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="rounded-lg border bg-card p-6 text-center text-sm text-destructive">
        {t("dataLoadError")}
      </p>
    );
  }

  if (isEmpty) {
    return (
      <p className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
        {t("dataEmpty")}
      </p>
    );
  }

  return children;
}
