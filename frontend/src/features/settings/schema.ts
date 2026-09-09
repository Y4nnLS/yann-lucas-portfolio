import { z } from "zod";

export const siteSettingsFormSchema = z.object({
  full_name: z.string().min(2, "Informe o nome."),
  professional_title: z.string().min(2, "Informe o título profissional."),
  hero_title: z.string().min(2, "Informe o título principal."),
  hero_subtitle: z.string().min(10, "Informe o subtítulo."),
  introduction: z.string().min(10, "Informe a introdução."),
  about: z.string().min(10, "Informe a seção sobre."),
  email: z.union([z.literal(""), z.email("Informe um e-mail válido.")]),
  location: z.string().optional().or(z.literal("")),
  github_username: z.string().optional().or(z.literal("")),
  github_url: z.union([z.literal(""), z.url("Informe uma URL válida.")]),
  linkedin_url: z.union([z.literal(""), z.url("Informe uma URL válida.")]),
  availability: z.string().optional().or(z.literal("")),
  default_seo_title: z.string().optional().or(z.literal("")),
  default_seo_description: z.string().optional().or(z.literal("")),
  default_social_image_url: z.union([z.literal(""), z.url("Informe uma URL válida.")]),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;

