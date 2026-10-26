"use client";

import { createContext, useContext, type ReactNode } from "react";

import { defaultLocale, type Locale } from "@/i18n/config";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Makes the active locale available to Client Components. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
