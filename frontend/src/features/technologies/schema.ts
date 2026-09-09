import { z } from "zod";

export const technologyFormSchema = z.object({
  name: z.string().min(2, "Informe o nome da tecnologia."),
  slug: z.string().optional().or(z.literal("")),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "TOOL", "LANGUAGE", "OTHER"]),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export type TechnologyFormValues = z.infer<typeof technologyFormSchema>;
