"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { Experience, Technology } from "@/types/api";

import { FormField } from "@/components/admin/FormField";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiFetch, ApiRequestError } from "@/services/api";
import { experienceFormSchema, type ExperienceFormValues } from "@/features/experiences/schema";

export function ExperienceManager({
  experiences,
  technologies,
}: {
  experiences: Experience[];
  technologies: Technology[];
}) {
  const [editing, setEditing] = useState<Experience | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      role: "",
      organization: "",
      experience_type: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      sort_order: 0,
      is_visible: true,
      technology_ids: [],
    },
  });

  const selectedIds = form.watch("technology_ids");

  function resetForm(item?: Experience | null) {
    setEditing(item ?? null);
    form.reset({
      role: item?.role ?? "",
      organization: item?.organization ?? "",
      experience_type: item?.experience_type ?? "",
      location: item?.location ?? "",
      start_date: item?.start_date ?? "",
      end_date: item?.end_date ?? "",
      is_current: item?.is_current ?? false,
      description: item?.description ?? "",
      sort_order: item?.sort_order ?? 0,
      is_visible: item?.is_visible ?? true,
      technology_ids: item?.technologies.map((technology) => technology.id) ?? [],
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <form
        className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFeedback(null);
          try {
            const payload = {
              ...values,
              location: values.location || null,
              start_date: values.start_date || null,
              end_date: values.end_date || null,
              description: values.description || null,
            };
            if (editing) {
              await apiFetch(`/api/v1/admin/experiences/${editing.id}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
                revalidate: false,
              });
            } else {
              await apiFetch("/api/v1/admin/experiences", {
                method: "POST",
                body: JSON.stringify(payload),
                revalidate: false,
              });
            }
            window.location.reload();
          } catch (error) {
            setFeedback(error instanceof ApiRequestError ? error.message : "Falha ao salvar a experiência.");
          }
        })}
      >
        <div>
          <h2 className="font-serif text-2xl text-[var(--color-text)]">{editing ? "Editar experiência" : "Nova experiência"}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Preencha experiências visíveis para alimentar a home e a página de currículo.</p>
        </div>
        {feedback ? <Alert title="Erro" description={feedback} tone="error" /> : null}
        <FormField error={form.formState.errors.role?.message} htmlFor="experience_role" label="Cargo">
          <Input id="experience_role" {...form.register("role")} />
        </FormField>
        <FormField error={form.formState.errors.organization?.message} htmlFor="experience_organization" label="Organização">
          <Input id="experience_organization" {...form.register("organization")} />
        </FormField>
        <FormField error={form.formState.errors.experience_type?.message} htmlFor="experience_type" label="Tipo">
          <Input id="experience_type" {...form.register("experience_type")} />
        </FormField>
        <div className="admin-grid">
          <FormField error={form.formState.errors.location?.message} htmlFor="experience_location" label="Localização">
            <Input id="experience_location" {...form.register("location")} />
          </FormField>
          <FormField error={form.formState.errors.sort_order?.message} htmlFor="experience_sort_order" label="Ordem">
            <Input id="experience_sort_order" type="number" {...form.register("sort_order", { valueAsNumber: true })} />
          </FormField>
          <FormField error={form.formState.errors.start_date?.message} htmlFor="experience_start_date" label="Data inicial">
            <Input id="experience_start_date" type="date" {...form.register("start_date")} />
          </FormField>
          <FormField error={form.formState.errors.end_date?.message} htmlFor="experience_end_date" label="Data final">
            <Input id="experience_end_date" type="date" {...form.register("end_date")} />
          </FormField>
        </div>
        <FormField error={form.formState.errors.description?.message} htmlFor="experience_description" label="Descrição">
          <Textarea id="experience_description" {...form.register("description")} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          {technologies.map((technology) => (
            <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3" key={technology.id}>
              <Checkbox
                checked={selectedIds.includes(technology.id)}
                onChange={(event) => {
                  const current = new Set(form.getValues("technology_ids"));
                  if (event.target.checked) {
                    current.add(technology.id);
                  } else {
                    current.delete(technology.id);
                  }
                  form.setValue("technology_ids", Array.from(current));
                }}
              />
              <span className="text-sm text-[var(--color-text)]">{technology.name}</span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3">
            <Checkbox {...form.register("is_current")} />
            <span className="text-sm text-[var(--color-text)]">Experiência atual</span>
          </label>
          <label className="flex items-center gap-3">
            <Checkbox {...form.register("is_visible")} />
            <span className="text-sm text-[var(--color-text)]">Visível no site</span>
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit">{editing ? "Salvar alterações" : "Criar experiência"}</Button>
          <Button onClick={() => resetForm(null)} type="button" variant="secondary">
            Limpar
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5" key={experience.id}>
            <p className="font-medium text-[var(--color-text)]">{experience.role}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{experience.organization}</p>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => resetForm(experience)} type="button" variant="secondary">
                Editar
              </Button>
              <Button
                onClick={async () => {
                  if (!window.confirm("Deseja excluir esta experiência?")) {
                    return;
                  }
                  await apiFetch(`/api/v1/admin/experiences/${experience.id}`, { method: "DELETE", revalidate: false });
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

