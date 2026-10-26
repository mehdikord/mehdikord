"use client";

import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { LOCALE_COOKIE, localeMeta, locales, type Locale } from "@/i18n/config";
import { interpolate, switchLocalePath } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/** Remembers an explicit choice so locale-less URLs (like "/") honour it. */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

interface LanguageSwitcherProps {
  copy: { label: string; switchTo: string };
  className?: string;
  onSwitch?: () => void;
}

/**
 * Segmented EN / فا control. Each option is a real link to the same page in
 * the other language, so it works without JavaScript; with JavaScript it also
 * keeps the query string and hash, and remembers the choice in a cookie.
 */
export function LanguageSwitcher({ copy, className, onSwitch }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const current = useLocale();

  function handleClick(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    event.preventDefault();
    rememberLocale(target);
    onSwitch?.();
    if (target === current) return;
    // Each language has its own root layout, so this is a full document load.
    const { search, hash } = window.location;
    router.push(`${switchLocalePath(pathname, target)}${search}${hash}`);
  }

  return (
    <div
      role="group"
      aria-label={copy.label}
      className={cn("relative inline-flex h-9 items-center rounded-full border border-line-strong p-0.5", className)}
    >
      {locales.map((locale) => {
        const active = locale === current;
        const meta = localeMeta[locale];
        return (
          <a
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={active ? "true" : undefined}
            aria-label={active ? meta.nativeName : interpolate(copy.switchTo, { language: meta.nativeName })}
            onClick={(event) => handleClick(event, locale)}
            className={cn(
              "relative inline-flex h-full min-w-9 items-center justify-center rounded-full px-2.5 text-[0.75rem] leading-none font-semibold transition-colors duration-300",
              locale === "fa" ? "font-persian text-[0.8125rem]" : "font-mono tracking-wider",
              active ? "bg-fg text-ink-950" : "text-fg-muted hover:text-fg",
            )}
          >
            {meta.short}
          </a>
        );
      })}
    </div>
  );
}
