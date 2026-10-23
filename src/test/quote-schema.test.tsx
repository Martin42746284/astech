import { describe, expect, it } from "vitest";
import { quoteSchema } from "@/lib/quote-schema";

const ok = { name: "Rakoto", phone: "+261 34 00 000 00", project_type: "maison", message: "Je veux construire", consent: true };

describe("quote form", () => {
  it("accepts the 4 required fields + consent", () => expect(quoteSchema.safeParse(ok).success).toBe(true));
  it("requires consent", () => expect(quoteSchema.safeParse({ ...ok, consent: false }).success).toBe(false));
  it("rejects missing phone", () => expect(quoteSchema.safeParse({ ...ok, phone: "" }).success).toBe(false));
  it("email is optional", () => expect(quoteSchema.safeParse({ ...ok, email: "" }).success).toBe(true));
});
