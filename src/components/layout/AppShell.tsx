import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-10 pb-20 sm:px-8 sm:pt-14">{children}</main>
    </div>
  );
}
