import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white px-6 py-10 text-center">
      <h3 className="font-serif text-2xl text-[var(--color-text)]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      {actionLabel && actionHref ? (
        <div className="mt-6">
          <Button href={actionHref} variant="secondary">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

