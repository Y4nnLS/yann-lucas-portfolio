import { z } from "zod";

export const experienceFormSchema = z.object({
  role: z.string().min(2, "Informe o cargo."),
  organization: z.string().min(2, "Informe a organização."),
  experience_type: z.string().min(2, "Informe o tipo de experiência."),
  location: z.string().optional().or(z.literal("")),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
  is_current: z.boolean(),
  description: z.string().optional().or(z.literal("")),
  sort_order: z.number().int().min(0),
  is_visible: z.boolean(),
  technology_ids: z.array(z.string()),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;
