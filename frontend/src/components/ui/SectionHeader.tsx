import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  centered?: boolean;
}

export function SectionHeader({ eyebrow, title, description, action, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6", centered && "items-center text-center")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">{eyebrow}</p> : null}
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">{title}</h2>
          {description ? <p className="max-w-3xl text-base leading-7 text-[var(--color-text-muted)]">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}

