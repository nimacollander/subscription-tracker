import Link from "next/link";

/** An open ring with a dot at the gap: a cycle that comes back around. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className} fill="none">
      <path d="M27 16a11 11 0 1 1-4.2-8.65" stroke="currentColor" strokeWidth={3.25} strokeLinecap="round" />
      <circle cx="26.2" cy="9.6" r="3.1" className="fill-accent" />
    </svg>
  );
}

export function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <BrandMark className="size-7" />
      <span className="text-[17px] font-semibold tracking-tight">Subscription Tracker</span>
    </Link>
  );
}
