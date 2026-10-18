import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";

// Desktop-only; on small screens the Header carries navigation.
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-8 border-r border-border bg-surface px-4 py-6 md:flex">
      <div className="px-2">
        <Brand />
      </div>
      <NavLinks />
    </aside>
  );
}
