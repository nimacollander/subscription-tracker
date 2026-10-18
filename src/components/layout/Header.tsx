import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";

// Mobile-only top bar; the Sidebar replaces it from the md breakpoint up.
export function Header() {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:hidden">
      <Brand />
      <NavLinks direction="row" />
    </header>
  );
}
