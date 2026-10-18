import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";

// Desktop: a slim icon rail. Phones: the brand on top and a tab bar along the bottom,
// where thumbs reach it.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[88px] shrink-0 flex-col items-center gap-10 border-r border-border py-6 lg:flex">
        <Brand />
        <NavLinks layout="rail" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center px-5 pt-5 lg:hidden">
          <Brand showName />
        </header>
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 pt-6 pb-28 sm:px-8 lg:px-10 lg:pt-10 lg:pb-16">
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 px-4 pt-1 pb-[max(env(safe-area-inset-bottom),0.25rem)] backdrop-blur-md lg:hidden">
        <NavLinks layout="tabs" />
      </div>
    </div>
  );
}
