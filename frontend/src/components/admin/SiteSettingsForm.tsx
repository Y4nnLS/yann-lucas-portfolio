"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { SiteSettings } from "@/types/api";

import { FormField } from "@/components/admin/FormField";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiFetch, ApiRequestError } from "@/services/api";
import { siteSettingsFormSchema, type SiteSettingsFormValues } from "@/features/settings/schema";

function siteToDefaults(site: SiteSettings): SiteSettingsFormValues {
  return {
    full_name: site.full_name,
    professional_title: site.professional_title,
    hero_title: site.hero_title,
    hero_subtitle: site.hero_subtitle,
    introduction: site.introduction,
    about: site.about,
    email: site.email ?? "",
    location: site.location ?? "",
    github_username: site.github_username ?? "",
    github_url: site.github_url ?? "",
    linkedin_url: site.linkedin_url ?? "",
    availability: site.availability ?? "",
    default_seo_title: site.default_seo_title ?? "",
    default_seo_description: site.default_seo_description ?? "",
    default_social_image_url: site.default_social_image_url ?? "",
  };
}

export function SiteSettingsForm({ site }: { site: SiteSettings }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: siteToDefaults(site),
  });

  return (
    <div className="space-y-6">
      <form
        className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFeedback(null);
          try {
            await apiFetch("/api/v1/admin/site-settings", {
              method: "PATCH",
              body: JSON.stringify({
                ...values,
                email: values.email || null,
                location: values.location || null,
                github_username: values.github_username || null,
                github_url: values.github_url || null,
                linkedin_url: values.linkedin_url || null,
                availability: values.availability || null,
                default_seo_title: values.default_seo_title || null,
                default_seo_description: values.default_seo_description || null,
                default_social_image_url: values.default_social_image_url || null,
              }),
              revalidate: false,
            });
            setFeedback("Configurações salvas com sucesso.");
            router.refresh();
          } catch (error) {
            setFeedback(error instanceof ApiRequestError ? error.message : "Falha ao salvar as configurações.");
          }
        })}
      >
        {feedback ? <Alert title="Configurações" description={feedback} tone="info" /> : null}
        <div className="admin-grid">
          <FormField error={form.formState.errors.full_name?.message} htmlFor="full_name" label="Nome">
            <Input id="full_name" {...form.register("full_name")} />
          </FormField>
          <FormField error={form.formState.errors.professional_title?.message} htmlFor="professional_title" label="Título profissional">
            <Input id="professional_title" {...form.register("professional_title")} />
          </FormField>
          <FormField error={form.formState.errors.hero_title?.message} htmlFor="hero_title" label="Título principal">
            <Input id="hero_title" {...form.register("hero_title")} />
          </FormField>
          <FormField error={form.formState.errors.email?.message} htmlFor="email" label="E-mail">
            <Input id="email" {...form.register("email")} />
          </FormField>
          <FormField error={form.formState.errors.location?.message} htmlFor="location" label="Localização">
            <Input id="location" {...form.register("location")} />
          </FormField>
          <FormField error={form.formState.errors.availability?.message} htmlFor="availability" label="Disponibilidade">
            <Input id="availability" {...form.register("availability")} />
          </FormField>
          <FormField error={form.formState.errors.github_username?.message} htmlFor="github_username" label="Usuário do GitHub">
            <Input id="github_username" {...form.register("github_username")} />
          </FormField>
          <FormField error={form.formState.errors.github_url?.message} htmlFor="github_url" label="URL do GitHub">
            <Input id="github_url" {...form.register("github_url")} />
          </FormField>
          <FormField error={form.formState.errors.linkedin_url?.message} htmlFor="linkedin_url" label="URL do LinkedIn">
            <Input id="linkedin_url" {...form.register("linkedin_url")} />
          </FormField>
          <FormField error={form.formState.errors.default_seo_title?.message} htmlFor="default_seo_title" label="SEO título padrão">
            <Input id="default_seo_title" {...form.register("default_seo_title")} />
          </FormField>
        </div>
        <FormField error={form.formState.errors.hero_subtitle?.message} htmlFor="hero_subtitle" label="Subtítulo">
          <Textarea id="hero_subtitle" {...form.register("hero_subtitle")} />
        </FormField>
        <FormField error={form.formState.errors.introduction?.message} htmlFor="introduction" label="Introdução">
          <Textarea id="introduction" {...form.register("introduction")} />
        </FormField>
        <FormField error={form.formState.errors.about?.message} htmlFor="about" label="Sobre">
          <Textarea id="about" {...form.register("about")} />
        </FormField>
        <FormField error={form.formState.errors.default_seo_description?.message} htmlFor="default_seo_description" label="SEO descrição padrão">
          <Textarea id="default_seo_description" {...form.register("default_seo_description")} />
        </FormField>
        <FormField error={form.formState.errors.default_social_image_url?.message} htmlFor="default_social_image_url" label="Imagem social padrão">
          <Input id="default_social_image_url" {...form.register("default_social_image_url")} />
        </FormField>
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Salvando..." : "Salvar configurações"}
        </Button>
      </form>

      <form
        className="space-y-4 rounded-[2rem] border border-[var(--color-border)] bg-white p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setFeedback(null);
          setUploadingResume(true);
          try {
            const formData = new FormData(event.currentTarget);
            await apiFetch("/api/v1/admin/uploads/resume", {
              method: "POST",
              body: formData,
              revalidate: false,
            });
            setFeedback("Currículo enviado com sucesso.");
            router.refresh();
          } catch (error) {
            setFeedback(error instanceof ApiRequestError ? error.message : "Falha ao enviar o currículo.");
          } finally {
            setUploadingResume(false);
          }
        }}
      >
        <div>
          <h2 className="font-serif text-2xl text-[var(--color-text)]">Currículo em PDF</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Apenas arquivos PDF válidos são aceitos pelo back-end.</p>
        </div>
        <FormField htmlFor="resume_file" label="Arquivo PDF">
          <Input accept="application/pdf" id="resume_file" name="file" type="file" />
        </FormField>
        {site.resume_url ? (
          <a className="text-sm font-semibold text-[var(--color-primary)]" href={site.resume_url} rel="noopener noreferrer" target="_blank">
            Abrir currículo atual
          </a>
        ) : null}
        <Button disabled={uploadingResume} type="submit" variant="secondary">
          {uploadingResume ? "Enviando..." : "Enviar currículo"}
        </Button>
      </form>
    </div>
  );
}

