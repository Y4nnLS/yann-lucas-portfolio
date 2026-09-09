"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section>
      <Container className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-danger)]">Erro</p>
        <h1 className="font-serif text-4xl text-[var(--color-text)]">Ocorreu uma falha inesperada</h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">{error.message}</p>
        <Button onClick={reset}>Tentar novamente</Button>
      </Container>
    </Section>
  );
}
