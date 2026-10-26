import { createServerFn } from "@tanstack/react-start";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Row = Record<string, Json>;
type Scalar = string | number | null;

async function db() {
  return await import("./neon.server");
}
async function auth() {
  return await import("./admin.server");
}

const num = (v: unknown) => Number(v ?? 0);

// ---------- Public reads ----------

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { neonQuery } = await db();
  const { rows } = await neonQuery("select key, value from settings where key <> 'admin_password'");
  const map: Record<string, string> = {};
  for (const r of rows) map[String(r.key)] = String(r.value ?? "");
  return map;
});

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { neonQuery } = await db();
  const { rows } = await neonQuery("select * from services where active = 1 order by ord, id limit 50");
  return rows as Row[];
});

export const getService = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { neonQuery } = await db();
    const { rows } = await neonQuery("select * from services where slug = $1 limit 1", [data.slug]);
    return (rows[0] ?? null) as Row | null;
  });

export const listProjects = createServerFn({ method: "GET" })
  .inputValidator((data?: { featured?: boolean }) => data ?? {})
  .handler(async ({ data }) => {
    const { neonQuery } = await db();
    if (data.featured) {
      const { rows } = await neonQuery("select * from projects where featured = 1 order by created_at desc, id desc limit 4");
      return rows as Row[];
    }
    const { rows } = await neonQuery("select * from projects order by created_at desc, id desc limit 200");
    return rows as Row[];
  });

export const getProject = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { neonQuery } = await db();
    const { rows } = await neonQuery("select * from projects where slug = $1 limit 1", [data.slug]);
    return (rows[0] ?? null) as Row | null;
  });

export const listFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const { neonQuery } = await db();
  const { rows } = await neonQuery("select * from faqs order by ord, id limit 100");
  return rows as Row[];
});

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { neonQuery } = await db();
  const { rows } = await neonQuery("select * from testimonials where active = 1 order by id limit 50");
  return rows as Row[];
});

// ---------- Public writes ----------

const PROJECT_TYPES = ["maison", "fondation", "rendu-3d", "chantier", "permis", "etude", "autre"];
const s = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((data: {
    name: string; phone: string; email?: string | null; project_type: string;
    location?: string | null; budget?: string | null; surface?: string | null;
    message: string; attachment?: string | null; attachment_name?: string | null;
  }) => data)
  .handler(async ({ data }) => {
    const name = s(data.name, 100);
    const phone = s(data.phone, 40);
    const message = s(data.message, 2000);
    if (!name || !phone || !message) throw new Error("Missing required fields");
    if (!PROJECT_TYPES.includes(data.project_type)) throw new Error("Invalid project type");
    const { neonExecute, neonUserError } = await db();
    try {
      const inserted = await neonExecute(
        "insert into quotes (name, phone, email, project_type, location, budget, surface, message, attachment, attachment_name, consent) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,1) returning id",
        [name, phone, s(data.email, 200), data.project_type, s(data.location, 200), s(data.budget, 100), s(data.surface, 100), message,
         data.attachment && data.attachment.length < 6_000_000 ? data.attachment : null, s(data.attachment_name, 100)],
      );
      return { ok: true as const, id: num(inserted.rows[0]?.id) };
    } catch (err) {
      console.error(err);
      throw new Error(neonUserError(err).message);
    }
  });

export const trackVisit = createServerFn({ method: "POST" })
  .inputValidator((data: { path: string }) => data)
  .handler(async ({ data }) => {
    const path = s(data.path, 300);
    if (!path || !path.startsWith("/")) return { ok: false as const };
    const { neonExecute } = await db();
    try {
      await neonExecute("insert into visits (path) values ($1)", [path]);
    } catch (err) {
      console.error(err); // tracking must never break the page
    }
    return { ok: true as const };
  });

export const trackWhatsapp = createServerFn({ method: "POST" }).handler(async () => {
  const { neonExecute } = await db();
  try {
    await neonExecute("insert into whatsapp_clicks default values");
  } catch (err) {
    console.error(err);
  }
  return { ok: true as const };
});

// ---------- Admin auth ----------

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const { neonQuery } = await db();
    const { passwordMatches, getSessionConfig } = await auth();
    const { useSession } = await import("@tanstack/react-start/server");
    const { rows } = await neonQuery("select value from settings where key = 'admin_password'");
    const expected = String(rows[0]?.value ?? "");
    if (!expected || !passwordMatches(String(data.password ?? ""), expected)) {
      return { ok: false as const };
    }
    const session = await useSession<{ admin?: boolean }>(getSessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getSessionConfig } = await auth();
  const { useSession } = await import("@tanstack/react-start/server");
  const session = await useSession<{ admin?: boolean }>(getSessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionConfig } = await auth();
  const { useSession } = await import("@tanstack/react-start/server");
  const session = await useSession<{ admin?: boolean }>(getSessionConfig());
  return { admin: session.data.admin === true };
});

// ---------- Admin data (session-gated) ----------

const CRUD_TABLES: Record<string, { columns: string[]; orderBy: string }> = {
  services: {
    columns: ["slug", "title_fr", "title_mg", "summary_fr", "summary_mg", "description_fr", "description_mg", "steps_fr", "steps_mg", "deliverables_fr", "deliverables_mg", "icon", "ord", "active"],
    orderBy: "ord, id",
  },
  projects: {
    columns: ["slug", "title_fr", "title_mg", "category", "location", "year", "description_fr", "description_mg", "image", "featured"],
    orderBy: "created_at desc, id desc",
  },
  faqs: { columns: ["q_fr", "q_mg", "a_fr", "a_mg", "ord"], orderBy: "ord, id" },
  testimonials: { columns: ["name", "role", "text_fr", "text_mg", "rating", "active"], orderBy: "id" },
  quotes: { columns: [], orderBy: "id desc" }, // read-only here; writes via dedicated fns
};

export const adminListRows = createServerFn({ method: "POST" })
  .inputValidator((data: { table: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await auth();
    await requireAdmin();
    const t = CRUD_TABLES[data.table];
    if (!t) throw new Error("Unknown table");
    const { neonQuery } = await db();
    const { rows } = await neonQuery(`select * from "${data.table}" order by ${t.orderBy} limit 500`);
    return rows as Row[];
  });

export const adminSaveRow = createServerFn({ method: "POST" })
  .inputValidator((data: { table: string; id?: number | undefined; row: Record<string, Scalar> }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await auth();
    await requireAdmin();
    const t = CRUD_TABLES[data.table];
    if (!t || !t.columns.length) throw new Error("Unknown table");
    const { neonExecute, neonUserError } = await db();
    const keys = Object.keys(data.row).filter((k) => t.columns.includes(k));
    if (!keys.length) throw new Error("Nothing to save");
    const vals = keys.map((k) => data.row[k] ?? null);
    const cols = keys.map((k) => `"${k}"`).join(", ");
    try {
      if (data.id) {
        const set = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
        await neonExecute(`update "${data.table}" set ${set} where id = $${keys.length + 1}`, [...vals, data.id]);
        return { ok: true as const, id: data.id };
      }
      const ph = keys.map((_, i) => `$${i + 1}`).join(", ");
      const r = await neonExecute(`insert into "${data.table}" (${cols}) values (${ph}) returning id`, vals);
      return { ok: true as const, id: num(r.rows[0]?.id) };
    } catch (err) {
      console.error(err);
      throw new Error(neonUserError(err).message);
    }
  });

export const adminDeleteRow = createServerFn({ method: "POST" })
  .inputValidator((data: { table: string; id: number }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await auth();
    await requireAdmin();
    if (!(data.table in CRUD_TABLES)) throw new Error("Unknown table");
    const { neonExecute } = await db();
    await neonExecute(`delete from "${data.table}" where id = $1`, [data.id]);
    return { ok: true as const };
  });

const QUOTE_STATUSES = ["new", "in_progress", "done", "archived"];

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number; status: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await auth();
    await requireAdmin();
    if (!QUOTE_STATUSES.includes(data.status)) throw new Error("Invalid status");
    const { neonExecute } = await db();
    await neonExecute("update quotes set status = $1 where id = $2", [data.status, data.id]);
    return { ok: true as const };
  });

export const updateQuoteNotes = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number; notes: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await auth();
    await requireAdmin();
    const { neonExecute } = await db();
    await neonExecute("update quotes set notes = $1 where id = $2", [String(data.notes ?? "").slice(0, 4000), data.id]);
    return { ok: true as const };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((data: { entries: Record<string, string> }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await auth();
    await requireAdmin();
    const { neonExecute } = await db();
    const queries = Object.entries(data.entries)
      .filter(([k]) => /^[a-z0-9_]+$/.test(k) && k !== "admin_password")
      .map(([k, v]) => ({
        query: "insert into settings (key, value) values ($1, $2) on conflict (key) do update set value = excluded.value",
        params: [k, String(v ?? "").slice(0, 8000)],
      }));
    if (queries.length) await neonExecute(queries);
    return { ok: true as const, saved: queries.length };
  });

export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((data: { current: string; next: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, passwordMatches } = await auth();
    await requireAdmin();
    if (String(data.next ?? "").length < 8) return { ok: false as const, reason: "too_short" as const };
    const { neonQuery, neonExecute } = await db();
    const { rows } = await neonQuery("select value from settings where key = 'admin_password'");
    if (!passwordMatches(String(data.current ?? ""), String(rows[0]?.value ?? ""))) {
      return { ok: false as const, reason: "wrong_current" as const };
    }
    await neonExecute("update settings set value = $1 where key = 'admin_password'", [String(data.next)]);
    return { ok: true as const };
  });

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await auth();
  await requireAdmin();
  const { neonQuery } = await db();
  const { results } = await neonQuery<{ results: { rows: Row[] }[] }>(
    [
      { query: "select count(*) as n from quotes" },
      { query: "select count(*) as n from whatsapp_clicks where created_at >= now() - interval '7 days'" },
      { query: "select count(*) as n from visits where created_at >= now() - interval '7 days'" },
      { query: "select count(*) as n from projects" },
      { query: "select count(*) as n from quotes where status = 'new'" },
      { query: "select to_char(created_at at time zone 'UTC', 'YYYY-MM-DD') as d, count(*) as n from visits where created_at >= now() - interval '7 days' group by 1 order by 1" },
      { query: "select project_type, count(*) as n from quotes group by project_type order by n desc limit 10" },
      { query: "select id, created_at, status, name, project_type from quotes order by id desc limit 5" },
      { query: "select id, title_fr, image from projects order by created_at desc, id desc limit 4" },
    ],
    [],
    { "Neon-Batch-Read-Only": "true" },
  );
  const one = (i: number) => num(results[i]?.rows[0]?.n);
  return {
    quotes: one(0),
    whatsapp7: one(1),
    visits7: one(2),
    projects: one(3),
    newQuotes: one(4),
    days: (results[5]?.rows ?? []).map((r) => ({ d: String(r.d), n: num(r.n) })),
    byType: (results[6]?.rows ?? []).map((r) => ({ project_type: String(r.project_type), n: num(r.n) })),
    lastQuotes: (results[7]?.rows ?? []) as Row[],
    recentProjects: (results[8]?.rows ?? []) as Row[],
  };
});
