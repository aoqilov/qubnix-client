/** "Malika Qodirova" -> "MQ", bitta so'z bo'lsa -> shu so'zning birinchi 2 harfi. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}
