"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { MediaType, ProjectMedia } from "@/types/api";

import { FormField } from "@/components/admin/FormField";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { apiFetch, ApiRequestError } from "@/services/api";

const mediaTypes: MediaType[] = ["COVER", "GALLERY", "ARCHITECTURE"];

export function ProjectMediaManager({
  projectId,
  media,
}: {
  projectId: string;
  media: ProjectMedia[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--color-text)]">Imagens</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">Envie capa, galeria ou diagramas com texto alternativo obrigatório.</p>
      </div>
      {status ? <Alert title="Upload" description={status} tone="info" /> : null}
      <form
        className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setStatus(null);
          setUploading(true);
          try {
            await apiFetch("/api/v1/admin/uploads/images", {
              method: "POST",
              body: formData,
              revalidate: false,
            });
            setStatus("Imagem enviada com sucesso.");
            (event.currentTarget as HTMLFormElement).reset();
            router.refresh();
          } catch (error) {
            setStatus(error instanceof ApiRequestError ? error.message : "Falha ao enviar a imagem.");
          } finally {
            setUploading(false);
          }
        }}
      >
        <input name="project_id" type="hidden" value={projectId} />
        <FormField htmlFor="file" label="Arquivo">
          <Input accept="image/png,image/jpeg,image/webp" id="file" name="file" type="file" />
        </FormField>
        <FormField htmlFor="alt_text" label="Texto alternativo">
          <Input id="alt_text" name="alt_text" />
        </FormField>
        <FormField htmlFor="media_type" label="Tipo de mídia">
          <Select defaultValue="GALLERY" id="media_type" name="media_type">
            {mediaTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </FormField>
        <div className="flex items-end">
          <Button disabled={uploading} type="submit">
            {uploading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {media.map((item) => (
          <div className="rounded-[1.5rem] border border-[var(--color-border)] p-4" key={item.id}>
            <img alt={item.alt_text} className="aspect-[16/10] rounded-2xl object-cover" src={item.file_url} />
            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium text-[var(--color-text)]">{item.media_type}</p>
              <p className="text-[var(--color-text-muted)]">{item.alt_text}</p>
            </div>
            <Button
              className="mt-4"
              onClick={async () => {
                if (!window.confirm("Remover esta mídia?")) {
                  return;
                }
                await apiFetch(`/api/v1/admin/uploads/${item.id}`, { method: "DELETE", revalidate: false });
                router.refresh();
              }}
              type="button"
              variant="secondary"
            >
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

