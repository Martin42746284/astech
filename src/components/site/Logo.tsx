import { cn } from "@/lib/utils";

export function Logo({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <svg viewBox="0 0 48 36" className="h-9 w-12" aria-hidden>
        <path d="M2 34 L24 4 L46 34 H36 L24 17 L12 34 Z" className="fill-primary" />
        <path d="M17 34 L24 24 L31 34 Z" className={light ? "fill-secondary-foreground" : "fill-secondary"} />
      </svg>
      <span className="leading-none">
        <span className={cn("block font-display text-xl font-extrabold tracking-wide", light ? "text-secondary-foreground" : "text-secondary")}>
          ASTECH
        </span>
        <span className={cn("block text-[0.6rem]", light ? "text-secondary-foreground/70" : "text-muted-foreground")}>
          Bureau d'études & Entreprise de construction
        </span>
      </span>
    </span>
  );
}
