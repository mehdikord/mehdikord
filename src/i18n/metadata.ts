import { locales } from "@/i18n/config";

/** hreflang alternates for a path that exists in every language, e.g. "/projects". */
export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, `/${locale}${path}`])),
    "x-default": `/en${path}`,
  };
}
