import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold">
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-lg bg-accent text-sm text-on-accent"
      >
        S
      </span>
      <span>Subscription Tracker</span>
    </Link>
  );
}
