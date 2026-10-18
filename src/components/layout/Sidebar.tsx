import Link from "next/link";
import { ShieldIcon } from "@/components/ui/icons";
import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";

// Desktop only; the MobileHeader carries navigation below lg.
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border px-5 py-7 lg:flex">
      <div className="px-1.5">
        <Brand />
      </div>

      <p className="mt-10 mb-3 px-1.5 text-xs font-medium tracking-wide text-muted uppercase">Menu</p>
      <NavLinks />

      {/* A real reminder for a local-only app, in the spot dashboards often use for promos. */}
      <div className="mt-auto rounded-2xl border border-border bg-surface p-4">
        <ShieldIcon className="size-5 text-accent" />
        <p className="mt-3 text-sm font-medium">Stored in this browser</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Nothing leaves your device. Export a backup before clearing site data.
        </p>
        <Link
          href="/settings"
          className="mt-3 inline-block text-xs font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
        >
          Back up data
        </Link>
      </div>
    </aside>
  );
}
