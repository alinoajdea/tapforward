import slugifyLib from "slugify";
import { nanoid } from "nanoid";

export function generateUniqueSlug(title: string) {
  const base = slugifyLib(title, { lower: true, strict: true });
  const suffix = nanoid(6);
  return `${base}-${suffix}`;
}
