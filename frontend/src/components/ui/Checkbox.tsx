import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/utils/cn";

export function Checkbox({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn("h-5 w-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]", className)}
      type="checkbox"
      {...props}
    />
  );
}

