import { FileSearch, DraftingCompass, FileCheck, HardHat, Truck, Shovel, Home, Users, Wrench, Building2, type LucideIcon } from "lucide-react";

export const ICONS: Record<string, LucideIcon> = { FileSearch, DraftingCompass, FileCheck, HardHat, Truck, Shovel, Home, Users, Wrench, Building2 };

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const I = ICONS[name] ?? Building2;
  return <I className={className} aria-hidden />;
}
