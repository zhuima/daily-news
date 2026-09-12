export function slugifyAccount(name: string): string {
  const trimmed = name.trim();
  const ascii = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (ascii && /^[a-z0-9-]+$/.test(ascii)) return ascii;
  return Buffer.from(trimmed, "utf8").toString("base64url");
}
