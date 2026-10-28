import net from "node:net";
import { neon, type FullQueryResults } from "@neondatabase/serverless";

// Some networks (no IPv6 route + parallel "happy eyeballs" connect attempts)
// make Node's default autoSelectFamily connect to the Neon endpoint fail with
// ETIMEDOUT, while a sequential IPv4-first connect succeeds in ~500ms.
// Falling back to sequential connects keeps the Neon HTTP driver working here
// and is harmless on hosts where IPv6 works.
try {
  net.setDefaultAutoSelectFamily(false);
} catch {
  // Older Node without the API — keep the default behaviour.
}

type Statement = { query: string; params?: unknown[] };
type QueryResult = FullQueryResults<false>;
type QueryResponse = QueryResult | { results: QueryResult[] };
type NeonError = Error & { code?: string };

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  return neon(connectionString, { fullResults: true });
}

async function execute(
  query: string | Statement[],
  params: unknown[],
  readOnly = false,
): Promise<QueryResponse> {
  const sql = getSql();
  if (typeof query === "string") {
    return await sql.query(query, params);
  }

  const results = await sql.transaction(
    query.map((statement) => sql.query(statement.query, statement.params ?? [])),
    { fullResults: true, readOnly },
  );
  return { results };
}

export async function neonQuery<T = QueryResult>(
  query: string | Statement[],
  params: unknown[] = [],
  options: { readOnly?: boolean } = {},
): Promise<T> {
  return (await execute(query, params, options.readOnly)) as T;
}

export async function neonExecute<T = QueryResult>(
  query: string | Statement[],
  params: unknown[] = [],
): Promise<T> {
  return (await execute(query, params)) as T;
}

export function neonUserError(err: unknown): { status: number; message: string } {
  const code = (err as NeonError | null)?.code ?? "";
  if (/^22|^23/.test(code)) {
    return { status: 400, message: "The database rejected these values. Check the input and try again." };
  }
  if (code === "42P01") {
    return { status: 503, message: "The database is not initialized. The app owner should apply database/schema.sql." };
  }
  return { status: 503, message: "The database is temporarily unavailable. Try again in a moment." };
}
