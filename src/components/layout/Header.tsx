import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

// Mobile-only top bar; the Sidebar replaces it from the md breakpoint up.
export function Header() {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between">
        <Brand />
        <ThemeToggle />
      </div>
      <NavLinks direction="row" />
    </header>
  );
}
