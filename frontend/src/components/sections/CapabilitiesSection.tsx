import type { Technology, TechnologyCategory } from "@/types/api";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const groups = [
  {
    title: "Front-end",
    categories: ["FRONTEND", "LANGUAGE"] as TechnologyCategory[],
    fallback: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Interfaces responsivas", "Componentes reutilizáveis", "Integração com APIs"],
  },
  {
    title: "Back-end",
    categories: ["BACKEND"] as TechnologyCategory[],
    fallback: ["Python", "FastAPI", "Django", "Flask", "APIs REST", "Regras de negócio", "Integrações"],
  },
  {
    title: "Dados e engenharia",
    categories: ["DATABASE", "TOOL"] as TechnologyCategory[],
    fallback: ["PostgreSQL", "SQLite", "MongoDB", "SQL", "Git", "Modelagem", "Manutenção de aplicações"],
  },
];

export function CapabilitiesSection({ technologies }: { technologies: Technology[] }) {
  return (
    <Section>
      <Container>
        <SectionHeader
          description="As capacidades são carregadas a partir do cadastro de tecnologias e agrupadas para apresentar o escopo completo de atuação."
          eyebrow="Capacidades"
          title="Desenvolvimento Full-Stack orientado por produto e manutenção"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {groups.map((group) => {
            const items = technologies.filter((technology) => group.categories.includes(technology.category)).map((technology) => technology.name);
            const content = items.length ? items : group.fallback;
            return (
              <Card className="space-y-5" key={group.title}>
                <div>
                  <h3 className="font-serif text-2xl text-[var(--color-text)]">{group.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                    Base funcional organizada para construir interfaces, APIs e persistência sem acoplamento desnecessário.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.map((item) => (
                    <Badge className="bg-white" key={item}>
                      {item}
                    </Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
