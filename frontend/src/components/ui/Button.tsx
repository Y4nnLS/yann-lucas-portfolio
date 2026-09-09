import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsButton = SharedProps &
  ComponentPropsWithoutRef<"button"> & {
  href?: never;
};

type ButtonAsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children"> & {
    href: string;
  };

const stylesByVariant: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
  secondary: "border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]",
  ghost: "text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]",
  dark: "bg-[var(--color-dark-surface)] text-[var(--color-dark-text)] hover:bg-[#1E2A41]",
};

const baseStyles =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-60";

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className, children } = props;
  const classes = cn(baseStyles, stylesByVariant[variant], className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link className={classes} href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  const { type, ...rest } = buttonProps;
  return (
    <button className={classes} type={type ?? "button"} {...rest}>
      {children}
    </button>
  );
}
