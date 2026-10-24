import type { SVGProps } from "react";

/* Simplified brand glyphs — Lucide no longer ships brand marks. */

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden {...props}>
      <path d="M21.5 4.5 2.8 11.6c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.5c.2.7 1.1.9 1.6.4l2.6-2.5 4.7 3.5c.6.4 1.4.1 1.6-.6L22.9 5.8c.2-.9-.6-1.6-1.4-1.3Z" />
      <path d="m7.4 14.9 10.1-6.7-7.6 7.9" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden {...props}>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="3" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13.2c0-1.6 1.1-2.7 2.5-2.7s2.5 1 2.5 2.7v3.3" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden {...props}>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
