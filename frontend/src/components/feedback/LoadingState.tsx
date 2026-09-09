export function LoadingState({ label = "Carregando conteúdo..." }: { label?: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white px-6 py-10 text-sm text-[var(--color-text-muted)]">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-primary)]" />
        <span>{label}</span>
      </div>
    </div>
  );
}

