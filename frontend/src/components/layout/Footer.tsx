import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white py-8">
      <Container className="flex flex-col gap-3 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>Portfólio Full-Stack com Next.js, FastAPI e PostgreSQL.</p>
        <p>Conteúdo editável pelo painel administrativo.</p>
      </Container>
    </footer>
  );
}

