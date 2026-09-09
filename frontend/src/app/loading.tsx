import { LoadingState } from "@/components/feedback/LoadingState";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function Loading() {
  return (
    <Section>
      <Container>
        <LoadingState label="Carregando a aplicação..." />
      </Container>
    </Section>
  );
}

