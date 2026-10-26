/** Supported languages. The first entry is the default. */
export const locales = ["en", "fa"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie remembering an explicit language choice from the switcher. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (locales as readonly string[]).includes(value);
}

interface LocaleMeta {
  /** Name of the language in that language, shown in the switcher. */
  nativeName: string;
  /** Compact switcher label. */
  short: string;
  dir: "ltr" | "rtl";
  /** BCP 47 tag used for Intl formatting. */
  intl: string;
  openGraph: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { nativeName: "English", short: "EN", dir: "ltr", intl: "en", openGraph: "en_US" },
  fa: { nativeName: "فارسی", short: "فا", dir: "rtl", intl: "fa-IR-u-ca-gregory", openGraph: "fa_IR" },
};
