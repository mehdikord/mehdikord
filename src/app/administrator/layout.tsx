import type { Metadata, Viewport } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import { Suspense } from "react";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

import "../globals.css";

const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "پنل مدیریت", template: "%s — پنل مدیریت" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

/** Root layout of the admin panel: Persian, right-to-left, never indexed. */
export default function AdminRootLayout({ children }: LayoutProps<"/administrator">) {
  return (
    <html lang="fa" dir="rtl" className={cn(vazirmatn.variable, geistMono.variable, "antialiased")}>
      <body className="admin-panel">
        {/* Every admin page reads the session cookie, so it renders per request. */}
        <Suspense fallback={<div className="min-h-svh" />}>{children}</Suspense>
      </body>
    </html>
  );
}
