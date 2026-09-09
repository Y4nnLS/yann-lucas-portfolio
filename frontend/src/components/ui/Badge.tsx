import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/utils/cn";

export function Badge({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)]",
        className,
      )}
      {...props}
    />
  );
}

