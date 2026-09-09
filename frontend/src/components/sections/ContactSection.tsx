import { Copy, Mail } from "lucide-react";

import type { SiteSettings } from "@/types/api";

import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ContactSection({ site }: { site: SiteSettings }) {
  const hasLinks = Boolean(site.email || site.github_url || site.linkedin_url || site.resume_url);

  return (
    <Section id="contato">
      <Container>
        <SectionHeader
          description="No MVP o contato público permanece direto, enxuto e controlado pelo painel administrativo."
          eyebrow="Contato"
          title="Canais profissionais disponíveis quando configurados"
        />
        {!hasLinks ? (
          <Alert
            description="Cadastre e-mail, currículo ou links profissionais no painel para exibir esta seção publicamente."
            title="Nenhum canal público configurado"
            tone="warning"
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="space-y-4">
              {site.email ? (
                <div className="rounded-[1.5rem] bg-[var(--color-surface-alt)] p-5">
                  <p className="text-sm text-[var(--color-text-muted)]">E-mail</p>
                  <a className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)]" href={`mailto:${site.email}`}>
                    <Mail size={18} />
                    {site.email}
                  </a>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                {site.email ? (
                  <Button
                    onClick={async () => {
                      await navigator.clipboard.writeText(site.email ?? "");
                    }}
                    variant="secondary"
                  >
                    <Copy size={16} />
                    Copiar e-mail
                  </Button>
                ) : null}
                {site.resume_url ? <Button href="/curriculo">Ver currículo</Button> : null}
              </div>
            </Card>
            <Card className="space-y-4">
              {site.github_url ? (
                <a className="block rounded-[1.5rem] border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]" href={site.github_url} rel="noopener noreferrer" target="_blank">
                  GitHub
                </a>
              ) : null}
              {site.linkedin_url ? (
                <a className="block rounded-[1.5rem] border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]" href={site.linkedin_url} rel="noopener noreferrer" target="_blank">
                  LinkedIn
                </a>
              ) : null}
            </Card>
          </div>
        )}
      </Container>
    </Section>
  );
}

