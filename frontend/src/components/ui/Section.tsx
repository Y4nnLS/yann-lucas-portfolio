import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/utils/cn";

export function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("py-16 sm:py-20", className)} {...props} />;
}

