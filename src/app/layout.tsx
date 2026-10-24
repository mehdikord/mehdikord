import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { content } from "@/data/content";
import { profile, site } from "@/data/profile";
import { getAllProjects } from "@/lib/projects";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const defaultTitle = `${profile.name} — ${profile.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s — ${profile.name}` },
  description: profile.summary,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: ["PHP", "Laravel", "Backend Engineer", "Software Architecture", "API Design", "Vue.js"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: profile.name,
    title: defaultTitle,
    description: profile.summary,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: profile.summary },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        {/* Without JavaScript, entrance animations never run — show content as-is. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <span id="page-top" aria-hidden className="absolute top-0" />
        <a
          href="#main"
          className="label-mono fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fg px-4 py-2.5 text-ink-950 transition-transform focus-visible:translate-y-0"
        >
          {content.nav.skipToContent}
        </a>
        <MotionProvider>
          <Navbar projectCount={getAllProjects().length} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </MotionProvider>
        <Footer />
      </body>
    </html>
  );
}
