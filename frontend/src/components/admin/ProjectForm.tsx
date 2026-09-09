"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { ProjectDetail, ProjectSummary, Technology } from "@/types/api";

import { FormField } from "@/components/admin/FormField";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ApiRequestError, apiFetch } from "@/services/api";
import { projectFormSchema, type ProjectFormValues } from "@/features/projects/schema";

function emptyToNull(value: string) {
  return value.trim() ? value : null;
}

function projectToDefaults(project?: ProjectDetail): ProjectFormValues {
  return {
    name: project?.name ?? "",
    slug: project?.slug ?? "",
    project_type: project?.project_type ?? "",
    short_description: project?.short_description ?? "",
    context: project?.context ?? "",
    problem: project?.problem ?? "",
    responsibilities: project?.responsibilities ?? "",
    architecture: project?.architecture ?? "",
    features: project?.features ?? "",
    challenges: project?.challenges ?? "",
    decisions: project?.decisions ?? "",
    results: project?.results ?? "",
    learnings: project?.learnings ?? "",
    future_improvements: project?.future_improvements ?? "",
    project_url: project?.project_url ?? "",
    repository_url: project?.repository_url ?? "",
    start_date: project?.start_date ?? "",
    end_date: project?.end_date ?? "",
    status: project?.status ?? "DRAFT",
    featured: project?.featured ?? false,
    sort_order: project?.sort_order ?? 0,
    seo_title: project?.seo_title ?? "",
    seo_description: project?.seo_description ?? "",
    technology_ids: project?.technologies.map((technology) => technology.id) ?? [],
  };
}

export function ProjectForm({
  project,
  technologies,
}: {
  project?: ProjectDetail;
  technologies: Technology[];
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: projectToDefaults(project),
  });

  const selectedTechnologyIds = form.watch("technology_ids");

  async function save(values: ProjectFormValues) {
    const payload = {
      ...values,
      slug: emptyToNull(values.slug ?? ""),
      project_type: emptyToNull(values.project_type ?? ""),
      short_description: emptyToNull(values.short_description ?? ""),
      context: emptyToNull(values.context ?? ""),
      problem: emptyToNull(values.problem ?? ""),
      responsibilities: emptyToNull(values.responsibilities ?? ""),
      architecture: emptyToNull(values.architecture ?? ""),
      features: emptyToNull(values.features ?? ""),
      challenges: emptyToNull(values.challenges ?? ""),
      decisions: emptyToNull(values.decisions ?? ""),
      results: emptyToNull(values.results ?? ""),
      learnings: emptyToNull(values.learnings ?? ""),
      future_improvements: emptyToNull(values.future_improvements ?? ""),
      project_url: emptyToNull(values.project_url ?? ""),
      repository_url: emptyToNull(values.repository_url ?? ""),
      start_date: emptyToNull(values.start_date ?? ""),
      end_date: emptyToNull(values.end_date ?? ""),
      seo_title: emptyToNull(values.seo_title ?? ""),
      seo_description: emptyToNull(values.seo_description ?? ""),
    };

    const endpoint = project ? `/api/v1/admin/projects/${project.id}` : "/api/v1/admin/projects";
    const method = project ? "PATCH" : "POST";
    const result = await apiFetch<ProjectSummary | ProjectDetail>(endpoint, {
      method,
      body: JSON.stringify(payload),
      revalidate: false,
    });

    if (!project) {
      router.push(`/admin/projetos/${result.id}`);
    } else {
      router.refresh();
    }
    setFeedback({ tone: "success", message: "Projeto salvo com sucesso." });
  }

  return (
    <form
      className="space-y-8"
      onSubmit={form.handleSubmit(async (values) => {
        setFeedback(null);
        try {
          await save(values);
        } catch (error) {
          setFeedback({
            tone: "error",
            message: error instanceof ApiRequestError ? error.message : "Não foi possível salvar o projeto.",
          });
        }
      })}
    >
      {feedback ? <Alert description={feedback.message} title={feedback.tone === "success" ? "Sucesso" : "Erro"} tone={feedback.tone} /> : null}
      <div className="admin-grid">
        <FormField error={form.formState.errors.name?.message} htmlFor="name" label="Nome">
          <Input id="name" {...form.register("name")} />
        </FormField>
        <FormField error={form.formState.errors.slug?.message} htmlFor="slug" label="Slug" hint="Se vazio, será gerado automaticamente.">
          <Input id="slug" {...form.register("slug")} />
        </FormField>
        <FormField error={form.formState.errors.project_type?.message} htmlFor="project_type" label="Tipo">
          <Input id="project_type" {...form.register("project_type")} />
        </FormField>
        <FormField error={form.formState.errors.sort_order?.message} htmlFor="sort_order" label="Ordem">
          <Input id="sort_order" type="number" {...form.register("sort_order", { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField error={form.formState.errors.short_description?.message} htmlFor="short_description" label="Resumo">
        <Textarea id="short_description" {...form.register("short_description")} />
      </FormField>

      <div className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-serif text-2xl text-[var(--color-text)]">Conteúdo do estudo de caso</h2>
        <div className="grid gap-5">
          {[
            ["context", "Contexto"],
            ["problem", "Problema"],
            ["responsibilities", "Minha responsabilidade"],
            ["architecture", "Arquitetura"],
            ["features", "Funcionalidades"],
            ["challenges", "Desafios técnicos"],
            ["decisions", "Decisões"],
            ["results", "Resultados"],
            ["learnings", "Aprendizados"],
            ["future_improvements", "Melhorias futuras"],
          ].map(([key, label]) => (
            <FormField
              error={form.formState.errors[key as keyof ProjectFormValues]?.message as string | undefined}
              htmlFor={key}
              key={key}
              label={label}
            >
              <Textarea id={key} {...form.register(key as keyof ProjectFormValues)} />
            </FormField>
          ))}
        </div>
      </div>

      <div className="admin-grid">
        <FormField error={form.formState.errors.project_url?.message} htmlFor="project_url" label="URL do projeto">
          <Input id="project_url" {...form.register("project_url")} />
        </FormField>
        <FormField error={form.formState.errors.repository_url?.message} htmlFor="repository_url" label="URL do repositório">
          <Input id="repository_url" {...form.register("repository_url")} />
        </FormField>
        <FormField error={form.formState.errors.start_date?.message} htmlFor="start_date" label="Data inicial">
          <Input id="start_date" type="date" {...form.register("start_date")} />
        </FormField>
        <FormField error={form.formState.errors.end_date?.message} htmlFor="end_date" label="Data final">
          <Input id="end_date" type="date" {...form.register("end_date")} />
        </FormField>
      </div>

      <div className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-serif text-2xl text-[var(--color-text)]">Tecnologias</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((technology) => {
            const checked = selectedTechnologyIds.includes(technology.id);
            return (
              <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3" key={technology.id}>
                <Checkbox
                  checked={checked}
                  onChange={(event) => {
                    const current = new Set(form.getValues("technology_ids"));
                    if (event.target.checked) {
                      current.add(technology.id);
                    } else {
                      current.delete(technology.id);
                    }
                    form.setValue("technology_ids", Array.from(current), { shouldValidate: true });
                  }}
                />
                <span className="text-sm text-[var(--color-text)]">{technology.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="admin-grid">
        <FormField error={form.formState.errors.status?.message} htmlFor="status" label="Status">
          <Select id="status" {...form.register("status")}>
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </Select>
        </FormField>
        <FormField error={form.formState.errors.seo_title?.message} htmlFor="seo_title" label="SEO título">
          <Input id="seo_title" {...form.register("seo_title")} />
        </FormField>
      </div>

      <FormField error={form.formState.errors.seo_description?.message} htmlFor="seo_description" label="SEO descrição">
        <Textarea id="seo_description" {...form.register("seo_description")} />
      </FormField>

      <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-4">
        <Checkbox {...form.register("featured")} />
        <span className="text-sm text-[var(--color-text)]">Marcar como destaque</span>
      </label>

      <div className="flex flex-wrap gap-3">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Salvando..." : "Salvar projeto"}
        </Button>
        {project?.status === "PUBLISHED" ? (
          <Button
            disabled={form.formState.isSubmitting}
            onClick={async () => {
              await apiFetch(`/api/v1/admin/projects/${project.id}/unpublish`, { method: "POST", revalidate: false });
              router.refresh();
            }}
            type="button"
            variant="secondary"
          >
            Voltar para rascunho
          </Button>
        ) : project ? (
          <Button
            disabled={form.formState.isSubmitting}
            onClick={async () => {
              await apiFetch(`/api/v1/admin/projects/${project.id}/publish`, { method: "POST", revalidate: false });
              router.refresh();
            }}
            type="button"
            variant="secondary"
          >
            Publicar
          </Button>
        ) : null}
        {project ? (
          <Button
            className="border-red-200 text-red-700 hover:bg-red-50"
            onClick={async () => {
              if (!window.confirm("Deseja excluir este projeto?")) {
                return;
              }
              await apiFetch(`/api/v1/admin/projects/${project.id}`, { method: "DELETE", revalidate: false });
              router.push("/admin/projetos");
              router.refresh();
            }}
            type="button"
            variant="secondary"
          >
            Excluir
          </Button>
        ) : null}
      </div>
    </form>
  );
}

