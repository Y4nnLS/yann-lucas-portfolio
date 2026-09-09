import { z } from "zod";

export const repositoryFormSchema = z.object({
  owner: z.string().min(1, "Informe o owner."),
  repository_name: z.string().min(1, "Informe o nome do repositório."),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export type RepositoryFormValues = z.infer<typeof repositoryFormSchema>;
