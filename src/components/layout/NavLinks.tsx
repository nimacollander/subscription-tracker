"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Subscriptions", href: "/subscriptions" },
  { label: "Settings", href: "/settings" },
];

export function NavLinks({ direction = "column" }: { direction?: "row" | "column" }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className={direction === "row" ? "flex gap-1" : "flex flex-col gap-1"}
    >
      {NAV_ITEMS.map((item) => {
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
