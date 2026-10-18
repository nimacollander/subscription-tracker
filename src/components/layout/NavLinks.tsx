"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SettingsIcon, StackIcon } from "@/components/ui/icons";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: HomeIcon },
  { label: "Subscriptions", href: "/subscriptions", icon: StackIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

/** Vertical in the sidebar, a horizontal tab row in the mobile header. */
export function NavLinks({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  const vertical = orientation === "vertical";

  return (
    <nav aria-label="Main" className={vertical ? "flex flex-col gap-1" : "flex gap-1"}>
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl border text-[15px] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              vertical ? "px-3.5 py-2.5" : "px-3 py-2 text-sm"
            } ${
              active
                ? "border-border bg-surface-2 font-medium text-foreground"
                : "border-transparent text-muted hover:bg-surface-2/60 hover:text-foreground"
            }`}
          >
            <Icon className={vertical ? "size-5" : "size-4"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
