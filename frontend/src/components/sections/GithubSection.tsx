import { ExternalLink, Github, Star } from "lucide-react";

import type { GitHubProfile, GitHubRepositoryList } from "@/types/api";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface GithubSectionProps {
  profile: GitHubProfile;
  repositories: GitHubRepositoryList;
}

export function GithubSection({ profile, repositories }: GithubSectionProps) {
  if (!profile.available || !repositories.available) {
    return (
      <Section className="surface-dark">
        <Container>
          <SectionHeader
            description="A integração continua opcional e usa fallback no back-end quando o GitHub não está configurado."
            eyebrow="GitHub"
            title="Integração pronta para exibir repositórios públicos"
          />
          <EmptyState
            description="Defina o usuário do GitHub nas configurações do painel para habilitar esta seção."
            title="GitHub ainda não configurado"
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section className="surface-dark">
      <Container>
        <SectionHeader
          description="Os dados são carregados pelo FastAPI com cache em memória e filtragem de forks no fallback automático."
          eyebrow="GitHub"
          title="Código público destacado sem depender de listas estáticas no front-end"
        />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
          <Card className="border-[var(--color-border-dark)] bg-[var(--color-dark-surface)] text-[var(--color-dark-text)]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 p-3">
                  <Github size={20} />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-dark-text-muted)]">Perfil</p>
                  <h3 className="font-serif text-2xl">{profile.username}</h3>
                </div>
              </div>
              {profile.bio ? <p className="leading-7 text-[var(--color-dark-text-muted)]">{profile.bio}</p> : null}
              <div className="flex gap-5 text-sm">
                <p>{profile.public_repos ?? 0} repositórios públicos</p>
                <p>{profile.followers ?? 0} seguidores</p>
              </div>
              {profile.profile_url ? (
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#dbeafe]" href={profile.profile_url} rel="noopener noreferrer" target="_blank">
                  Ver perfil
                  <ExternalLink size={16} />
                </a>
              ) : null}
            </div>
          </Card>

          <div className="grid gap-4">
            {repositories.items.map((repository) => (
              <Card className="border-[var(--color-border-dark)] bg-[var(--color-dark-surface)] text-[var(--color-dark-text)]" key={repository.full_name}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl">{repository.name}</h3>
                    {repository.description ? <p className="text-sm leading-7 text-[var(--color-dark-text-muted)]">{repository.description}</p> : null}
                  </div>
                  <a className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#dbeafe]" href={repository.html_url} rel="noopener noreferrer" target="_blank">
                    Abrir
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-dark-text-muted)]">
                  {repository.language ? <span>{repository.language}</span> : null}
                  <span className="inline-flex items-center gap-1">
                    <Star size={15} />
                    {repository.stargazers_count}
                  </span>
                  <span>Atualizado em {new Date(repository.updated_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

