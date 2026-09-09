"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { Technology } from "@/types/api";

import { FormField } from "@/components/admin/FormField";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { apiFetch, ApiRequestError } from "@/services/api";
import { technologyFormSchema, type TechnologyFormValues } from "@/features/technologies/schema";

export function TechnologyManager({ technologies }: { technologies: Technology[] }) {
  const [editing, setEditing] = useState<Technology | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologyFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "FRONTEND",
      sort_order: 0,
      is_active: true,
    },
  });

  function resetForm(item?: Technology | null) {
    setEditing(item ?? null);
    form.reset({
      name: item?.name ?? "",
      slug: item?.slug ?? "",
      category: item?.category ?? "FRONTEND",
      sort_order: item?.sort_order ?? 0,
      is_active: item?.is_active ?? true,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form
        className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFeedback(null);
          try {
            if (editing) {
              await apiFetch(`/api/v1/admin/technologies/${editing.id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
                revalidate: false,
              });
            } else {
              await apiFetch("/api/v1/admin/technologies", {
                method: "POST",
                body: JSON.stringify(values),
                revalidate: false,
              });
            }
            window.location.reload();
          } catch (error) {
            setFeedback(error instanceof ApiRequestError ? error.message : "Falha ao salvar a tecnologia.");
          }
        })}
      >
        <div>
          <h2 className="font-serif text-2xl text-[var(--color-text)]">{editing ? "Editar tecnologia" : "Nova tecnologia"}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Cadastre tecnologias reutilizadas nas páginas públicas e nos formulários administrativos.</p>
        </div>
        {feedback ? <Alert title="Erro" description={feedback} tone="error" /> : null}
        <FormField error={form.formState.errors.name?.message} htmlFor="technology_name" label="Nome">
          <Input id="technology_name" {...form.register("name")} />
        </FormField>
        <FormField error={form.formState.errors.slug?.message} htmlFor="technology_slug" label="Slug">
          <Input id="technology_slug" {...form.register("slug")} />
        </FormField>
        <FormField error={form.formState.errors.category?.message} htmlFor="technology_category" label="Categoria">
          <Select id="technology_category" {...form.register("category")}>
            {["FRONTEND", "BACKEND", "DATABASE", "TOOL", "LANGUAGE", "OTHER"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField error={form.formState.errors.sort_order?.message} htmlFor="technology_sort_order" label="Ordem">
          <Input id="technology_sort_order" type="number" {...form.register("sort_order", { valueAsNumber: true })} />
        </FormField>
        <label className="flex items-center gap-3">
          <Checkbox {...form.register("is_active")} />
          <span className="text-sm text-[var(--color-text)]">Tecnologia ativa</span>
        </label>
        <div className="flex gap-3">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {editing ? "Salvar alterações" : "Criar tecnologia"}
          </Button>
          <Button onClick={() => resetForm(null)} type="button" variant="secondary">
            Limpar
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {technologies.map((technology) => (
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between" key={technology.id}>
            <div>
              <p className="font-medium text-[var(--color-text)]">{technology.name}</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {technology.category} · ordem {technology.sort_order} · {technology.is_active ? "ativo" : "inativo"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => resetForm(technology)} type="button" variant="secondary">
                Editar
              </Button>
              <Button
                onClick={async () => {
                  if (!window.confirm("Deseja excluir esta tecnologia?")) {
                    return;
                  }
                  await apiFetch(`/api/v1/admin/technologies/${technology.id}`, { method: "DELETE", revalidate: false });
                  window.location.reload();
                }}
                type="button"
                variant="secondary"
              >
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

