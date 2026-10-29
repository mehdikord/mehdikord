import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Vazirmatn } from "next/font/google";
import Script from "next/script";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getDictionary } from "@/data/dictionaries";
import { site } from "@/data/site";
import { localeMeta, locales } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { languageAlternates } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { getProfile } from "@/lib/profile";
import { getAllProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { themeInitScript } from "@/theme/theme";

import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});
// Persian script; Latin characters in Persian pages fall back to Geist. Not
// preloaded so English pages don't fetch it; the switcher label still uses it.
const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic"], preload: false });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const profile = await getProfile(locale);
  const title = `${profile.name} — ${profile.title}`;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s — ${profile.name}` },
    description: profile.summary,
    applicationName: profile.name,
    authors: [{ name: profile.name }],
    creator: profile.name,
    keywords: ["PHP", "Laravel", "Backend Engineer", "Software Architecture", "API Design", "Vue.js"],
    alternates: { canonical: `/${locale}`, languages: languageAlternates() },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].openGraph,
      alternateLocale: locales.filter((other) => other !== locale).map((other) => localeMeta[other].openGraph),
      siteName: profile.name,
      title,
      description: profile.summary,
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title, description: profile.summary },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5fa" },
    { media: "(prefers-color-scheme: dark)", color: "#050507" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const [profile, projects] = await Promise.all([getProfile(locale), getAllProjects(locale)]);

  return (
    <html
      lang={locale}
      dir={localeMeta[locale].dir}
      data-scroll-behavior="smooth"
      // The theme attribute is set by the inline script before hydration.
      suppressHydrationWarning
      className={cn(
        geistSans.variable,
        geistMono.variable,
        instrumentSerif.variable,
        vazirmatn.variable,
        "antialiased",
      )}
    >
      <head>
        {/* Applies the saved or system theme before first paint (injected server-side, never re-run by React). */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {/* Without JavaScript, entrance animations never run — show content as-is. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <span id="page-top" aria-hidden className="absolute top-0" />
        <a
          href="#main"
          className="label-mono fixed start-3 top-3 z-[60] -translate-y-20 rounded-full bg-fg px-4 py-2.5 text-ink-950 transition-transform focus-visible:translate-y-0"
        >
          {dictionary.nav.skipToContent}
        </a>
        <LocaleProvider locale={locale}>
          <ThemeProvider>
          <MotionProvider>
            <Navbar
              copy={{ nav: dictionary.nav, language: dictionary.language, theme: dictionary.theme }}
              brand={{ name: profile.name, initials: profile.initials }}
              availability={profile.availability}
              projectCount={projects.length}
            />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </MotionProvider>
          </ThemeProvider>
        </LocaleProvider>
        <Footer />
      </body>
    </html>
  );
}
