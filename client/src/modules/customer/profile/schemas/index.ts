import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  avatarUrl: z
    .string()
    .optional()
    .transform((v) => v?.trim() || undefined)
    .refine(
      (v) => v === undefined || v === "" || /^https?:\/\//.test(v),
      "Enter a valid URL"
    ),
});

export type ProfileValues = z.infer<typeof profileSchema>;
