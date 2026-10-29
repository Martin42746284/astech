import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSettings, listServices, getService, listProjects, getProject, listFaqs, listTestimonials, listGallery, getGalleryVideo,
  adminListRows, adminSaveRow, adminDeleteRow, adminListQuotes, updateQuoteStatus,
  updateQuoteNotes, deleteQuote, saveSettings, changeAdminPassword, getDashboardStats,
} from "./data.functions";

type Row = Record<string, unknown>;

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
export type GalleryItem = {
  id: number;
  title_fr: string;
  title_mg: string;
  category: string;
  image: string;
  /** 'photo' (défaut) ou 'video' ; la vidéo elle-même n'est pas dans cette liste */
  type?: string | null;
  ord: number;
  active: number;
  created_at: string;
};
export type Quote = {
  id: number; created_at: string; status: QuoteStatus; name: string; phone: string; email: string | null;
  project_type: string; location: string | null; budget: string | null; surface: string | null; message: string;
  attachment: string | null; attachment_name: string | null; consent: number; notes: string | null;
};
export type QuoteStatus = "new" | "in_progress" | "done" | "archived";

export const CATEGORIES = ["maison", "fondation", "rendu-3d", "chantier"] as const;
export const PROJECT_TYPES = ["maison", "fondation", "rendu-3d", "chantier", "permis", "etude", "autre"] as const;

export function useSettingsQuery() {
  return useQuery({ queryKey: ["settings"], queryFn: () => getSettings(), staleTime: 30_000 });
}

export function useSettings() {
  return useSettingsQuery().data ?? {};
}

export function useServices() {
  return useQuery({ queryKey: ["services"], queryFn: () => listServices() as Promise<Service[]>, staleTime: 30_000 });
}

export function useService(slug: string) {
  return useQuery({ queryKey: ["service", slug], queryFn: () => getService({ data: { slug } }) as Promise<Service | null>, staleTime: 30_000 });
}

export function useProjects(featured = false) {
  return useQuery({ queryKey: ["projects", featured], queryFn: () => listProjects({ data: { featured } }) as Promise<Project[]>, staleTime: 30_000 });
}

export function useProject(slug: string) {
  return useQuery({ queryKey: ["project", slug], queryFn: () => getProject({ data: { slug } }) as Promise<Project | null>, staleTime: 30_000 });
}

export function useFaqs() {
  return useQuery({ queryKey: ["faqs"], queryFn: () => listFaqs() as Promise<Faq[]>, staleTime: 30_000 });
}

export function useTestimonials() {
  return useQuery({ queryKey: ["testimonials"], queryFn: () => listTestimonials() as Promise<Testimonial[]>, staleTime: 30_000 });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: () => listGallery() as Promise<GalleryItem[]>,
    staleTime: 30_000,
  });
}

/** Récupère la vidéo d'une entrée de galerie (à la demande, uniquement à la lecture). */
export function useGalleryVideo(id: number, enabled = true) {
  return useQuery({
    queryKey: ["gallery-video", id],
    queryFn: () => getGalleryVideo({ data: { id } }) as Promise<{ video: string }>,
    enabled,
    staleTime: 5 * 60_000,
  });
}

// ---------- Admin hooks (session-gated on the server) ----------

export function useAdminRows<T = Row>(table: string) {
  return useQuery({ queryKey: ["admin", table], queryFn: () => adminListRows({ data: { table } }) as Promise<T[]> });
}

export function useAdminQuotes() {
  return useQuery({ queryKey: ["admin", "quotes"], queryFn: () => adminListQuotes() as Promise<Quote[]> });
}

export function useDashboardStats(enabled = true) {
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: () => getDashboardStats(), refetchInterval: 60_000, enabled });
}

/** Returns save/delete helpers for a CRUD table, invalidating caches after each write. */
export function useCrudMutate(table: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries();
  return {
    save: async (row: Record<string, string | number | null>, id?: number) => {
      const r = await adminSaveRow({ data: { table, id, row } });
      await invalidate();
      return r;
    },
    del: async (id: number) => {
      await adminDeleteRow({ data: { table, id } });
      await invalidate();
    },
  };
}

export function useAdminMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries();
  return {
    saveSettings: async (entries: Record<string, string>) => {
      const result = await saveSettings({ data: { entries } });
      await invalidate();
      return result;
    },
    changePassword: async (current: string, next: string) => {
      const result = await changeAdminPassword({ data: { current, next } });
      await invalidate();
      return result;
    },
    updateQuoteStatus: async (id: number, status: QuoteStatus) => {
      const result = await updateQuoteStatus({ data: { id, status } });
      await invalidate();
      return result;
    },
    updateQuoteNotes: async (id: number, notes: string) => {
      const result = await updateQuoteNotes({ data: { id, notes } });
      await invalidate();
      return result;
    },
    deleteQuote: async (id: number) => {
      const result = await deleteQuote({ data: { id } });
      await invalidate();
      return result;
    },
  };
}

export function waLink(number: string | undefined, text: string) {
  return `https://wa.me/${(number || "261387157941").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function telLink(p?: string) {
  return `tel:${(p || "").replace(/\s/g, "")}`;
}

/** Resize an image file to WebP data URL (keeps the DB small). */
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
