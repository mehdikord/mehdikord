import { localeMeta, type Locale } from "@/i18n/config";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Renders ASCII digits in the locale's numeral system (Persian digits for `fa`). */
export function localizeDigits(locale: Locale, value: string | number): string {
  const text = String(value);
  return locale === "fa" ? text.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit) : text;
}

/** Zero-padded, localised index, e.g. 3 → "03" / "۰۳". */
export function pad(locale: Locale, value: number, length = 2): string {
  return localizeDigits(locale, String(value).padStart(length, "0"));
}

/** Replaces `{name}` placeholders in a dictionary string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

const monthFormatters = new Map<Locale, Intl.DateTimeFormat>();

/** "2023-06" → "Jun 2023" / "ژوئن ۲۰۲۳" */
export function formatYearMonth(locale: Locale, value: string): string {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  let formatter = monthFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(localeMeta[locale].intl, { month: "short", year: "numeric", timeZone: "UTC" });
    monthFormatters.set(locale, formatter);
  }
  return formatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

/** Prefixes an app path with the locale: ("fa", "/projects") → "/fa/projects". */
export function localePath(locale: Locale, path = "/"): string {
  if (path.startsWith("#")) return `/${locale}${path}`;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Swaps the locale segment of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const rest = pathname.replace(/^\/(en|fa)(?=\/|$)/, "");
  return `/${target}${rest}`;
}
