import { avatarColor, avatarInitial } from "@/lib/avatar";

/** A coloured square with the service's first letter; decorative next to its name. */
const SIZES = { xs: "size-5 rounded-md text-[10px]", sm: "size-8 rounded-lg text-sm", md: "size-9 rounded-lg text-[15px]" };

export function Avatar({ name, size = "md" }: { name: string; size?: keyof typeof SIZES }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center font-display font-semibold text-white ${SIZES[size]}`}
      style={{ background: avatarColor(name) }}
    >
      {avatarInitial(name)}
    </span>
  );
}
