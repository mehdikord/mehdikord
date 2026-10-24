type ClassValue = string | false | null | undefined;

/** Joins truthy class names. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Returns the URL when it is an absolute http(s) URL, otherwise `null`. */
export function toSafeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** "https://www.example.com/path/" → "example.com/path" */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2023-06" → "Jun 2023" */
export function formatYearMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

/** Zero-padded index, e.g. 3 → "03". */
export function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}
