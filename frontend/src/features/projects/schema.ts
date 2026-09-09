import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(3, "Informe o nome do projeto."),
  slug: z.string().optional().or(z.literal("")),
  project_type: z.string().optional().or(z.literal("")),
  short_description: z.string().optional().or(z.literal("")),
  context: z.string().optional().or(z.literal("")),
  problem: z.string().optional().or(z.literal("")),
  responsibilities: z.string().optional().or(z.literal("")),
  architecture: z.string().optional().or(z.literal("")),
  features: z.string().optional().or(z.literal("")),
  challenges: z.string().optional().or(z.literal("")),
  decisions: z.string().optional().or(z.literal("")),
  results: z.string().optional().or(z.literal("")),
  learnings: z.string().optional().or(z.literal("")),
  future_improvements: z.string().optional().or(z.literal("")),
  project_url: z.url("Informe uma URL válida.").optional().or(z.literal("")),
  repository_url: z.url("Informe uma URL válida.").optional().or(z.literal("")),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean(),
  sort_order: z.number().int().min(0),
  seo_title: z.string().optional().or(z.literal("")),
  seo_description: z.string().optional().or(z.literal("")),
  technology_ids: z.array(z.string()),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
