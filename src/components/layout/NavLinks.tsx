"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string; disabled?: boolean };

// Disabled items mark pages that later steps will add.
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Subscriptions", href: "/subscriptions", disabled: true },
  { label: "Settings", href: "/settings", disabled: true },
];

export function NavLinks({ direction = "column" }: { direction?: "row" | "column" }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className={direction === "row" ? "flex gap-1" : "flex flex-col gap-1"}
    >
      {NAV_ITEMS.map((item) => {
        if (item.disabled) {
          return (
            <span
              key={item.href}
              aria-disabled
              className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-muted/60"
            >
              {item.label}
              {direction === "column" && (
                <span className="rounded bg-border/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  Soon
                </span>
              )}
            </span>
          );
        }

        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-border/50 hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
