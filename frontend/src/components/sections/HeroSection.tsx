import { ArrowRight, Download, Github, Linkedin } from "lucide-react";

import type { SiteSettings } from "@/types/api";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function HeroSection({ site }: { site: SiteSettings }) {
  return (
    <Section className="pt-14 sm:pt-20">
      <Container className="grid gap-10 lg:grid-cols-[1.25fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {site.professional_title}
            </p>
            <h1 className="font-serif text-4xl leading-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
              {site.hero_title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">{site.hero_subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/projetos">
              Ver projetos
              <ArrowRight size={16} />
            </Button>
            <Button href="/curriculo" variant="secondary">
              Visualizar currículo
              <Download size={16} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)]">
            {site.github_url ? (
              <a className="inline-flex items-center gap-2 hover:text-[var(--color-primary)]" href={site.github_url} rel="noopener noreferrer" target="_blank">
                <Github size={16} />
                GitHub
              </a>
            ) : null}
            {site.linkedin_url ? (
              <a className="inline-flex items-center gap-2 hover:text-[var(--color-primary)]" href={site.linkedin_url} rel="noopener noreferrer" target="_blank">
                <Linkedin size={16} />
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-[var(--color-surface-alt)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Fluxo de trabalho</p>
              <div className="mt-5 flex flex-col gap-4 text-sm sm:flex-row sm:items-center">
                <div className="rounded-2xl bg-white px-4 py-4 text-center shadow-sm">Front-end</div>
                <span className="text-center text-[var(--color-text-muted)]">→</span>
                <div className="rounded-2xl bg-white px-4 py-4 text-center shadow-sm">API</div>
                <span className="text-center text-[var(--color-text-muted)]">→</span>
                <div className="rounded-2xl bg-white px-4 py-4 text-center shadow-sm">Banco de dados</div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--color-dark)] p-5 text-[var(--color-dark-text)]">
                <p className="text-sm text-[var(--color-dark-text-muted)]">Foco técnico</p>
                <p className="mt-2 text-xl font-semibold">React, TypeScript e Python</p>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--color-surface-alt)] p-5">
                <p className="text-sm text-[var(--color-text-muted)]">Abordagem</p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">Arquitetura clara, APIs seguras e manutenção simples</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

