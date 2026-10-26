import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Catches unknown paths inside a locale (e.g. /fa/unknown) so they render the
 * localised not-found page within the locale's root layout.
 */
export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  // Cache Components requires at least one sample; it simply renders the 404.
  return [{ rest: ["404"] }];
}

export default function CatchAll() {
  notFound();
}
