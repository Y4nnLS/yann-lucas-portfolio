import { Alert } from "@/components/feedback/Alert";

interface ErrorStateProps {
  title?: string;
  description?: string;
}

export function ErrorState({
  title = "Não foi possível carregar esta seção.",
  description = "Tente atualizar a página em instantes.",
}: ErrorStateProps) {
  return <Alert description={description} title={title} tone="error" />;
}

