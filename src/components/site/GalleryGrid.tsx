import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { useGalleryVideo, type GalleryItem } from "@/lib/data";
import { cn } from "@/lib/utils";

const COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Grille de photos cliquables avec visionneuse plein écran
 * (flèches précédent/suivant, fermeture par Échap ou la croix).
 */
export function GalleryGrid({
  items,
  columns = 3,
  showCaption = true,
}: {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
  showCaption?: boolean;
}) {
  const { t, pick } = useI18n();
  const [idx, setIdx] = useState<number | null>(null);
  const current = idx === null ? null : (items[idx] ?? null);

  // Navigation au clavier pendant la visionneuse (Échap est géré par la fenêtre).
  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setIdx((i) => (i === null ? i : (i - 1 + items.length) % items.length));
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? i : (i + 1) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, items.length]);

  if (!items.length) {
    return (
      <p className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
        {t("galleryEmpty")}
      </p>
    );
  }

  return (
    <>
      <div className={cn("grid gap-4", COLS[columns] ?? COLS[3])}>
        {items.map((g, i) => {
          const caption = pick(g, "title");
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={caption || t("gallery")}
              className="group overflow-hidden rounded-lg border bg-card text-left shadow-card transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={g.image}
                  alt={caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {g.type === "video" && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/35"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white/85 text-secondary shadow-card">
                      <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                    </span>
                  </span>
                )}
              </div>
              {showCaption && (caption || g.category) && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 p-3">
                  {caption && (
                    <span className="break-words font-display font-bold text-secondary">
                      {caption}
                    </span>
                  )}
                  {g.category && (
                    <span className="text-xs font-semibold text-accent">{g.category}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={current !== null} onOpenChange={(o) => !o && setIdx(null)}>
        <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-4xl overflow-hidden border-0 bg-navy-deep p-3 text-secondary-foreground sm:p-4">
          <DialogTitle className="sr-only">
            {current ? pick(current, "title") || t("gallery") : ""}
          </DialogTitle>
          {current && (
            <div className="flex flex-col gap-3">
              <div className="relative">
                {current.type === "video" ? (
                  <VideoPlayer item={current} />
                ) : (
                  <img
                    src={current.image}
                    alt={pick(current, "title")}
                    className="mx-auto max-h-[70vh] w-auto rounded object-contain"
                  />
                )}
                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setIdx((i) => (i === null ? i : (i - 1 + items.length) % items.length))
                      }
                      aria-label={t("previousPhoto")}
                      className="absolute left-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/80"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdx((i) => (i === null ? i : (i + 1) % items.length))}
                      aria-label={t("nextPhoto")}
                      className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/80"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pr-8">
                <p className="min-w-0 break-words text-sm font-semibold">
                  {pick(current, "title")}
                  {current.category && (
                    <span className="ml-2 text-xs font-normal opacity-70">{current.category}</span>
                  )}
                </p>
                {items.length > 1 && (
                  <span className="text-xs opacity-70">
                    {(idx ?? 0) + 1} / {items.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Lecteur vidéo de la visionneuse : la vidéo n'est téléchargée qu'à l'ouverture
 * de l'élément (la liste ne contient que la vignette).
 */
function VideoPlayer({ item }: { item: GalleryItem }) {
  const { t } = useI18n();
  const q = useGalleryVideo(item.id, item.type === "video");
  if (q.isPending || !q.data?.video) {
    return (
      <div className="grid min-h-[38vh] w-full place-items-center rounded bg-black/50">
        {q.isError || (q.isSuccess && !q.data?.video) ? (
          <p className="text-sm">{t("videoUnavailable")}</p>
        ) : (
          <Loader2 aria-label={t("videoLoading")} className="h-8 w-8 animate-spin text-white/80" />
        )}
      </div>
    );
  }
  return (
    <video
      src={q.data.video}
      poster={item.image || undefined}
      controls
      playsInline
      preload="metadata"
      className="mx-auto max-h-[70vh] w-auto rounded bg-black object-contain"
    />
  );
}
