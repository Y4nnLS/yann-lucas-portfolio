import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-text-muted)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
            {item.href ? (
              <Link className="hover:text-[var(--color-primary)]" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-[var(--color-text)]">
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? <span>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

