import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { HeroSection } from "@/components/sections/HeroSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GithubSection } from "@/components/sections/GithubSection";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getExperiences, getGithubProfile, getGithubRepositories, getProjects, getResume, getSiteSettings, getTechnologies } from "@/services/content";
import type { ResumePayload } from "@/types/api";

export default async function HomePage() {
  const [siteResult, featuredProjectsResult, technologiesResult, experiencesResult, githubProfileResult, githubRepositoriesResult, resumeResult] =
    await Promise.allSettled([
      getSiteSettings(),
      getProjects({ featured: true, page: 1, page_size: 4 }),
      getTechnologies(),
      getExperiences(),
      getGithubProfile(),
      getGithubRepositories(),
      getResume(),
    ]);

  if (siteResult.status === "rejected") {
    return (
      <Section>
        <Container>
          <ErrorState description="A aplicação não conseguiu carregar as configurações principais do portfólio." />
        </Container>
      </Section>
    );
  }

  const site = siteResult.value;
  const featuredProjects = featuredProjectsResult.status === "fulfilled" ? featuredProjectsResult.value.items : [];
  const technologies = technologiesResult.status === "fulfilled" ? technologiesResult.value : [];
  const experiences = experiencesResult.status === "fulfilled" ? experiencesResult.value : [];
  const githubProfile = githubProfileResult.status === "fulfilled" ? githubProfileResult.value : { available: false };
  const githubRepositories = githubRepositoriesResult.status === "fulfilled" ? githubRepositoriesResult.value : { available: false, source: "unavailable", items: [] };
  const resume: ResumePayload =
    resumeResult.status === "fulfilled"
      ? resumeResult.value
      : { has_resume: false, resume_url: null, summary_html: null, experiences: [], technologies: [], projects: [] };
  const focusProject = featuredProjects.find((project) => project.name.includes("Emoções")) ?? featuredProjects[0] ?? null;

  return (
    <>
      <HeroSection site={site} />

      <Section>
        <Container>
          <SectionHeader
            action={<Button href="/projetos" variant="secondary">Todos os projetos</Button>}
            description="Somente projetos publicados e marcados como destaque aparecem aqui."
            eyebrow="Projetos em destaque"
            title="Estudos de caso reais, com foco em implementação e manutenção"
          />
          {featuredProjects.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/admin/login"
              actionLabel="Abrir painel"
              description="Cadastre e publique projetos no painel para preencher esta seção."
              title="Nenhum projeto em destaque"
            />
          )}
        </Container>
      </Section>

      <CapabilitiesSection technologies={technologies} />

      {experiences.length ? (
        <Section className="surface-dark" id="experiencia">
          <Container>
            <SectionHeader
              description="A seção permanece oculta quando não há experiências visíveis cadastradas."
              eyebrow="Experiência"
              title="Trajetórias e responsabilidades carregadas a partir da API"
            />
            <div className="grid gap-4">
              {experiences.map((experience) => (
                <Card className="border-[var(--color-border-dark)] bg-[var(--color-dark-surface)] text-[var(--color-dark-text)]" key={experience.id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl">{experience.role}</h3>
                      <p className="text-sm text-[var(--color-dark-text-muted)]">{experience.organization}</p>
                      {experience.description ? <p className="text-sm leading-7 text-[var(--color-dark-text-muted)]">{experience.description}</p> : null}
                    </div>
                    <div className="space-y-2 text-sm text-[var(--color-dark-text-muted)]">
                      <p>{experience.experience_type}</p>
                      <p>{experience.is_current ? "Atual" : "Concluída"}</p>
                    </div>
                  </div>
                  {experience.technologies.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {experience.technologies.map((technology) => (
                        <Badge className="border-[var(--color-border-dark)] bg-white/5 text-[var(--color-dark-text)]" key={technology.id}>
                          {technology.name}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {focusProject ? (
        <Section>
          <Container>
            <SectionHeader
              description="O destaque é ativado automaticamente quando o projeto inicial está publicado."
              eyebrow="Projeto em foco"
              title="Aplicação Web para Reconhecimento de Emoções"
            />
            <Card className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                {focusProject.short_description ? <p className="text-base leading-8 text-[var(--color-text-muted)]">{focusProject.short_description}</p> : null}
                {focusProject.responsibilities ? <p className="text-base leading-8 text-[var(--color-text)]">{focusProject.responsibilities}</p> : null}
                <Button href={`/projetos/${focusProject.slug}`}>Abrir estudo de caso</Button>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--color-surface-alt)] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Abordagem</p>
                <p className="mt-3 text-lg leading-8 text-[var(--color-text)]">
                  Desenvolvimento ponta a ponta com foco em interface, API, integração de modelos e apresentação confiável dos resultados.
                </p>
              </div>
            </Card>
          </Container>
        </Section>
      ) : null}

      <GithubSection profile={githubProfile} repositories={githubRepositories} />

      <Section id="sobre">
        <Container>
          <SectionHeader
            description="Texto inicial vindo das configurações do site, pronto para edição no painel."
            eyebrow="Sobre"
            title="Posicionamento técnico claro, sem dados pessoais inventados"
          />
          <Card className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <p className="text-base leading-8 text-[var(--color-text-muted)]">{site.about}</p>
            <div className="rounded-[1.5rem] bg-[var(--color-surface-alt)] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Disponibilidade</p>
              <p className="mt-3 text-lg text-[var(--color-text)]">{site.availability ?? "Definir disponibilidade no painel administrativo."}</p>
            </div>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            action={<Button href="/curriculo" variant="secondary">Abrir currículo</Button>}
            description="O currículo exibe estado vazio até que um PDF válido seja enviado pelo painel."
            eyebrow="Currículo"
            title="Resumo profissional e download centralizados em uma rota dedicada"
          />
          {resume.has_resume ? (
            <Card className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-4">
                <div dangerouslySetInnerHTML={{ __html: resume.summary_html ?? "" }} />
                <Button href="/curriculo">Visualizar currículo</Button>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--color-surface-alt)] p-6 text-sm leading-7 text-[var(--color-text-muted)]">
                O PDF fica disponível para visualização e download, e pode ser substituído a qualquer momento no painel.
              </div>
            </Card>
          ) : (
            <EmptyState
              actionHref="/curriculo"
              actionLabel="Ver estado da página"
              description="Envie um PDF válido no painel administrativo para liberar visualização e download."
              title="Currículo ainda não enviado"
            />
          )}
        </Container>
      </Section>

      <ContactSection site={site} />
    </>
  );
}
