import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/utils/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_40px_rgba(18,24,38,0.06)]",
        className,
      )}
      {...props}
    />
  );
}

