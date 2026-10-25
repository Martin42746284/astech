// Server-only admin session helpers for the single-password back office.
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

// Built per call: module-scope process.env reads are undefined on Workers.
export function getSessionConfig() {
  const password = process.env["SESSION_SECRET"];
  if (!password) throw new Error("SESSION_SECRET is not set");
  return {
    password,
    name: "astech-admin",
    maxAge: 60 * 60 * 8, // one working day
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export type AdminSession = { admin?: boolean };

export async function requireAdmin() {
  const session = await useSession<AdminSession>(getSessionConfig());
  if (!session.data.admin) throw new Error("Forbidden");
}

// Hash both sides first: timingSafeEqual throws on length mismatch and the
// raw length itself would leak through timing.
export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}
