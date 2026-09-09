import "@testing-library/jest-dom/vitest";
import { createElement, type AnchorHTMLAttributes, type ReactNode } from "react";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  } & AnchorHTMLAttributes<HTMLAnchorElement>) =>
    createElement("a", { href, ...props }, children),
}));
