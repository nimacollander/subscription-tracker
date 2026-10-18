// Letter avatars for services. The colour comes from a hash of the name, so a
// service keeps its colour wherever it appears and across reloads.

const AVATAR_COLORS = ["#3d6dff", "#7c4dff", "#0f9d76", "#c2410c", "#be185d", "#0e7490", "#a16207", "#4d7c0f"];

export function avatarInitial(name: string): string {
  const match = name.trim().match(/[\p{L}\p{N}]/u);
  return match ? match[0].toUpperCase() : "?";
}

export function avatarColor(name: string): string {
  let hash = 0;
  for (const char of name.trim().toLowerCase()) {
    hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
