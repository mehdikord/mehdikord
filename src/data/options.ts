/**
 * Fixed choices for content fields stored as plain strings in the database.
 * Each maps to code (an icon), so the admin panel offers exactly these values
 * and the site falls back to the first one when a stored value is unknown.
 */

/** Key-strength icons; mapped to Lucide icons in `StrengthList`. */
export const strengthIcons = [
  "code",
  "architecture",
  "api",
  "database",
  "modules",
  "scale",
  "auth",
  "security",
  "integrations",
  "performance",
  "leadership",
  "frontend",
  "ai",
] as const;

export function pickOption<T extends string>(options: readonly [T, ...T[]], value: string): T {
  return (options as readonly string[]).includes(value) ? (value as T) : options[0];
}
