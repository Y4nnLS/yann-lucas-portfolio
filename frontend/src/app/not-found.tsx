import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <Container className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">404</p>
        <h1 className="font-serif text-5xl text-[var(--color-text)]">Página não encontrada</h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
          O conteúdo que você tentou acessar não está disponível ou ainda não foi publicado.
        </p>
        <Button href="/">Voltar para a página inicial</Button>
      </Container>
    </Section>
  );
}

