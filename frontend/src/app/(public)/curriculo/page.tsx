import type { Metadata } from "next";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getResume } from "@/services/content";

export const metadata: Metadata = {
  title: "Currículo",
  description: "Resumo profissional e acesso ao currículo em PDF.",
};

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <Section>
      <Container className="space-y-8">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Currículo" }]} />
        <SectionHeader
          description="O PDF é gerenciado pelo painel administrativo e validado no back-end antes de ser publicado."
          eyebrow="Currículo"
          title="Visualização e download em uma página dedicada"
        />
        {!resume.has_resume ? (
          <EmptyState
            actionHref="/admin/login"
            actionLabel="Abrir painel"
            description="Ainda não existe um currículo em PDF publicado. O estado vazio permanece público até que o arquivo seja enviado."
            title="Currículo ainda indisponível"
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="space-y-5">
              {resume.summary_html ? <div className="space-y-4" dangerouslySetInnerHTML={{ __html: resume.summary_html }} /> : null}
              <div className="flex flex-wrap gap-3">
                <Button href={resume.resume_url ?? "#"}>Abrir PDF</Button>
                <Button href={resume.resume_url ?? "#"} variant="secondary">
                  Download
                </Button>
              </div>
              {resume.experiences.length ? (
                <div>
                  <h2 className="font-serif text-2xl text-[var(--color-text)]">Experiências</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
                    {resume.experiences.map((item) => (
                      <li key={String(item.id)}>
                        <strong className="text-[var(--color-text)]">{String(item.role)}</strong> — {String(item.organization)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>

            <Card className="overflow-hidden p-0">
              <iframe className="min-h-[720px] w-full border-0" src={resume.resume_url ?? undefined} title="Visualizador de currículo" />
            </Card>
          </div>
        )}
      </Container>
    </Section>
  );
}

