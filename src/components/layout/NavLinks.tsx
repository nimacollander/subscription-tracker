"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SettingsIcon, StackIcon } from "@/components/ui/icons";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: HomeIcon },
  { label: "Subscriptions", href: "/subscriptions", icon: StackIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

/** Icon above a short label: stacked in the desktop rail, side by side in the phone tab bar. */
export function NavLinks({ layout }: { layout: "rail" | "tabs" }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={layout === "rail" ? "flex flex-col gap-2" : "grid grid-cols-3"}>
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            <span
              className={`flex h-9 w-12 items-center justify-center rounded-xl transition-colors ${
                active ? "bg-accent-soft text-accent" : "group-hover:bg-surface-2"
              }`}
            >
              <Icon className="size-5" />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
