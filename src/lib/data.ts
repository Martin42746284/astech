import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SqlValue } from "sql.js";
import { all, run, type Row } from "./db";

export type Service = {
  id: number; slug: string; title_fr: string; title_mg: string; summary_fr: string; summary_mg: string;
  description_fr: string; description_mg: string; steps_fr: string; steps_mg: string;
  deliverables_fr: string; deliverables_mg: string; icon: string; ord: number; active: number;
};
export type Project = {
  id: number; slug: string; title_fr: string; title_mg: string; category: string; location: string;
  year: number; description_fr: string; description_mg: string; image: string; featured: number; created_at: string;
};
export type Faq = { id: number; q_fr: string; q_mg: string; a_fr: string; a_mg: string; ord: number };
export type Testimonial = { id: number; name: string; role: string; text_fr: string; text_mg: string; rating: number; active: number };
export type Quote = {
  id: number; created_at: string; status: QuoteStatus; name: string; phone: string; email: string | null;
  project_type: string; location: string | null; budget: string | null; surface: string | null; message: string;
  attachment: string | null; attachment_name: string | null; consent: number; notes: string | null;
};
export type QuoteStatus = "new" | "in_progress" | "done" | "archived";

export const CATEGORIES = ["maison", "fondation", "rendu-3d", "chantier"] as const;
export const PROJECT_TYPES = ["maison", "fondation", "rendu-3d", "chantier", "permis", "etude", "autre"] as const;

export function useSql<T = Row>(key: string, sql: string, params: SqlValue[] = []) {
  return useQuery({ queryKey: ["sql", key, ...params], queryFn: () => all<T>(sql, params) });
}

export function useSettings() {
  const q = useSql<{ key: string; value: string }>("settings", "SELECT key, value FROM settings");
  const map: Record<string, string> = {};
  q.data?.forEach((r) => (map[r.key] = r.value));
  return map;
}

export function useMutateSql() {
  const qc = useQueryClient();
  return async (sql: string, params: SqlValue[] = []) => {
    const id = await run(sql, params);
    await qc.invalidateQueries({ queryKey: ["sql"] });
    return id;
  };
}

export function waLink(number: string | undefined, text: string) {
  return `https://wa.me/${(number || "261387157941").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function telLink(p?: string) {
  return `tel:${(p || "").replace(/\s/g, "")}`;
}

/** Resize an image file to WebP data URL (keeps the offline DB small). */
export function fileToImage(file: File, max = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/webp", 0.82));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function slugify(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
