"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { FeaturedRepository } from "@/types/api";

import { FormField } from "@/components/admin/FormField";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { apiFetch, ApiRequestError } from "@/services/api";
import { repositoryFormSchema, type RepositoryFormValues } from "@/features/github/schema";

export function RepositoryManager({ repositories }: { repositories: FeaturedRepository[] }) {
  const [editing, setEditing] = useState<FeaturedRepository | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<RepositoryFormValues>({
    resolver: zodResolver(repositoryFormSchema),
    defaultValues: {
      owner: "",
      repository_name: "",
      sort_order: 0,
      is_active: true,
    },
  });

  function resetForm(item?: FeaturedRepository | null) {
    setEditing(item ?? null);
    form.reset({
      owner: item?.owner ?? "",
      repository_name: item?.repository_name ?? "",
      sort_order: item?.sort_order ?? 0,
      is_active: item?.is_active ?? true,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form
        className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFeedback(null);
          try {
            if (editing) {
              await apiFetch(`/api/v1/admin/featured-repositories/${editing.id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
                revalidate: false,
              });
            } else {
              await apiFetch("/api/v1/admin/featured-repositories", {
                method: "POST",
                body: JSON.stringify(values),
                revalidate: false,
              });
            }
            window.location.reload();
          } catch (error) {
            setFeedback(error instanceof ApiRequestError ? error.message : "Falha ao salvar o repositório.");
          }
        })}
      >
        <div>
          <h2 className="font-serif text-2xl text-[var(--color-text)]">{editing ? "Editar repositório" : "Novo repositório em destaque"}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Defina quais repositórios devem ser priorizados na vitrine do GitHub.</p>
        </div>
        {feedback ? <Alert title="Erro" description={feedback} tone="error" /> : null}
        <FormField error={form.formState.errors.owner?.message} htmlFor="repo_owner" label="Owner">
          <Input id="repo_owner" {...form.register("owner")} />
        </FormField>
        <FormField error={form.formState.errors.repository_name?.message} htmlFor="repo_name" label="Repositório">
          <Input id="repo_name" {...form.register("repository_name")} />
        </FormField>
        <FormField error={form.formState.errors.sort_order?.message} htmlFor="repo_sort_order" label="Ordem">
          <Input id="repo_sort_order" type="number" {...form.register("sort_order", { valueAsNumber: true })} />
        </FormField>
        <label className="flex items-center gap-3">
          <Checkbox {...form.register("is_active")} />
          <span className="text-sm text-[var(--color-text)]">Ativo</span>
        </label>
        <div className="flex gap-3">
          <Button type="submit">{editing ? "Salvar alterações" : "Criar item"}</Button>
          <Button onClick={() => resetForm(null)} type="button" variant="secondary">
            Limpar
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {repositories.map((repository) => (
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between" key={repository.id}>
            <div>
              <p className="font-medium text-[var(--color-text)]">
                {repository.owner}/{repository.repository_name}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">ordem {repository.sort_order} · {repository.is_active ? "ativo" : "inativo"}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => resetForm(repository)} type="button" variant="secondary">
                Editar
              </Button>
              <Button
                onClick={async () => {
                  if (!window.confirm("Deseja excluir este repositório?")) {
                    return;
                  }
                  await apiFetch(`/api/v1/admin/featured-repositories/${repository.id}`, { method: "DELETE", revalidate: false });
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

