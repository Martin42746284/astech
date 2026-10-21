import { z } from "zod";
import { PROJECT_TYPES } from "./data";

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "f_required").max(100),
  phone: z.string().trim().regex(/^\+?[0-9 ]{8,20}$/, "f_phoneInvalid"),
  email: z.string().trim().email("f_emailInvalid").max(255).optional().or(z.literal("")),
  project_type: z.enum(PROJECT_TYPES, { message: "f_required" }),
  location: z.string().trim().max(200).optional(),
  budget: z.string().trim().max(100).optional(),
  surface: z.string().trim().max(50).optional(),
  message: z.string().trim().min(5, "f_required").max(2000),
  consent: z.literal(true, { message: "f_consentReq" }),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
