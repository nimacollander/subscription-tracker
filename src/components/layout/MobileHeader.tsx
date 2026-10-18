import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";

// Below lg the sidebar is hidden; the brand and a scrollable tab row take its place.
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
      <div className="px-5 pt-4 pb-3">
        <Brand />
      </div>
      <div className="overflow-x-auto px-4 pb-3">
        <NavLinks orientation="horizontal" />
      </div>
    </header>
  );
}
