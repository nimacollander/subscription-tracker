import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

// One bar at every size: brand and toggle share the first row on mobile,
// with the nav below; from md up everything sits on one line.
export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-8 px-5 sm:px-8 md:grid-cols-[auto_1fr_auto]">
        {/* Explicit columns: grid places row-pinned items first, which would put the nav before the brand. */}
        <div className="col-start-1 row-start-1 py-3.5 md:py-0">
          <Brand />
        </div>
        <div className="col-span-2 col-start-1 row-start-2 -mx-5 overflow-x-auto px-5 md:col-span-1 md:col-start-2 md:row-start-1 md:mx-0 md:px-0">
          <NavLinks />
        </div>
        <div className="col-start-2 row-start-1 justify-self-end md:col-start-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
