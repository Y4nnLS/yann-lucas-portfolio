import type { PaginationMeta } from "@/types/api";

import { Button } from "@/components/ui/Button";

interface PaginationProps {
  pagination: PaginationMeta;
  buildHref: (page: number) => string;
}

export function Pagination({ pagination, buildHref }: PaginationProps) {
  if (pagination.total_pages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Página {pagination.page} de {pagination.total_pages}
      </p>
      <div className="flex gap-3">
        <Button
          aria-disabled={pagination.page <= 1}
          className={pagination.page <= 1 ? "pointer-events-none opacity-50" : undefined}
          href={buildHref(Math.max(1, pagination.page - 1))}
          variant="secondary"
        >
          Anterior
        </Button>
        <Button
          aria-disabled={pagination.page >= pagination.total_pages}
          className={pagination.page >= pagination.total_pages ? "pointer-events-none opacity-50" : undefined}
          href={buildHref(Math.min(pagination.total_pages, pagination.page + 1))}
          variant="secondary"
        >
          Próxima
        </Button>
      </div>
    </nav>
  );
}
