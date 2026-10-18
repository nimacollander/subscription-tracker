import { avatarColor, avatarInitial } from "@/lib/avatar";

/** A coloured circle with the service's first letter; decorative next to its name. */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${
        size === "sm" ? "size-8 text-sm" : "size-9 text-[15px]"
      }`}
      style={{ background: avatarColor(name) }}
    >
      {avatarInitial(name)}
    </span>
  );
}
